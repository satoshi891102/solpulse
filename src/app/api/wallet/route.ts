import { NextRequest, NextResponse } from "next/server";
import type { WalletData, WalletToken, WalletTransaction } from "@/types";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const DEXSCREENER_BASE = "https://api.dexscreener.com";

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

async function getSolPrice(): Promise<number> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=SOL%2FUSDC`);
    if (!res.ok) return 0;
    const data = await res.json();
    const solPair = (data.pairs || []).find(
      (p: { chainId: string; baseToken?: { symbol: string }; quoteToken?: { symbol: string } }) =>
        p.chainId === "solana" && p.baseToken?.symbol === "SOL" && p.quoteToken?.symbol === "USDC"
    );
    return solPair ? parseFloat(solPair.priceUsd) : 0;
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
  }

  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return NextResponse.json({ error: "Invalid Solana address format" }, { status: 400 });
  }

  try {
    const [balanceResult, tokenResult, signaturesResult, solPrice] = await Promise.allSettled([
      rpc("getBalance", [address]),
      rpc("getTokenAccountsByOwner", [
        address,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed" },
      ]),
      rpc("getSignaturesForAddress", [address, { limit: 10 }]),
      getSolPrice(),
    ]);

    const solLamports = balanceResult.status === "fulfilled" ? (balanceResult.value?.value ?? 0) : 0;
    const solBalance = solLamports / 1e9;
    const solUsdPrice = solPrice.status === "fulfilled" ? solPrice.value : 0;
    const solUsdValue = solBalance * solUsdPrice;

    let tokens: WalletToken[] = [];
    if (tokenResult.status === "fulfilled" && tokenResult.value?.value) {
      tokens = (tokenResult.value.value as Array<{
        account: { data: { parsed: { info: { mint: string; tokenAmount: { uiAmount: number; decimals: number } } } } };
      }>)
        .map((acct) => {
          const info = acct.account.data.parsed.info;
          return {
            mint: info.mint,
            symbol: info.mint.slice(0, 6).toUpperCase(),
            name: "SPL Token",
            amount: info.tokenAmount.uiAmount,
            decimals: info.tokenAmount.decimals,
            usdValue: null,
          };
        })
        .filter((t: WalletToken) => t.amount > 0)
        .slice(0, 20);
    }

    let transactions: WalletTransaction[] = [];
    if (signaturesResult.status === "fulfilled" && Array.isArray(signaturesResult.value)) {
      transactions = (signaturesResult.value as Array<{ signature: string; blockTime?: number }>)
        .slice(0, 10)
        .map((sig) => ({
          signature: sig.signature,
          type: "OTHER" as const,
          timestamp: (sig.blockTime ?? 0) * 1000,
          description: sig.signature.slice(0, 8) + "…" + sig.signature.slice(-6),
        }));
    }

    const data: WalletData = { address, solBalance, solUsdValue, tokens, transactions };
    return NextResponse.json({ data, timestamp: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Wallet lookup failed", data: null },
      { status: 200 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import type { WalletData, WalletToken, WalletTransaction } from "@/types";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const JUPITER_PRICE_API = "https://api.jup.ag/price/v2";
const SOL_MINT = "So11111111111111111111111111111111111111112";

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
  }

  // Basic Solana address validation
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return NextResponse.json({ error: "Invalid Solana address format" }, { status: 400 });
  }

  try {
    // Fetch SOL balance and token accounts in parallel
    const [balanceResult, tokenResult, signaturesResult, solPriceResult] = await Promise.allSettled([
      rpc("getBalance", [address]),
      rpc("getTokenAccountsByOwner", [
        address,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed" },
      ]),
      rpc("getSignaturesForAddress", [address, { limit: 10 }]),
      fetch(`${JUPITER_PRICE_API}?ids=${SOL_MINT}`).then(r => r.json()),
    ]);

    // SOL balance
    const solLamports = balanceResult.status === "fulfilled" ? (balanceResult.value?.value ?? 0) : 0;
    const solBalance = solLamports / 1e9;
    const solPrice = solPriceResult.status === "fulfilled"
      ? parseFloat(solPriceResult.value?.data?.[SOL_MINT]?.price ?? "0")
      : 0;
    const solUsdValue = solBalance * solPrice;

    // Token accounts
    let tokens: WalletToken[] = [];
    if (tokenResult.status === "fulfilled" && tokenResult.value?.value) {
      const mints: string[] = [];
      const rawTokens = tokenResult.value.value.map((acct: { account: { data: { parsed: { info: { mint: string; tokenAmount: { uiAmount: number; decimals: number } } } } } }) => {
        const info = acct.account.data.parsed.info;
        mints.push(info.mint);
        return {
          mint: info.mint,
          symbol: info.mint.slice(0, 4).toUpperCase(),
          name: "Unknown",
          amount: info.tokenAmount.uiAmount,
          decimals: info.tokenAmount.decimals,
          usdValue: null,
        };
      }).filter((t: WalletToken) => t.amount > 0);

      // Try to get prices for tokens
      if (mints.length > 0) {
        try {
          const priceRes = await fetch(`${JUPITER_PRICE_API}?ids=${mints.slice(0, 20).join(",")}`);
          if (priceRes.ok) {
            const priceData = await priceRes.json();
            tokens = rawTokens.map((t: WalletToken) => ({
              ...t,
              usdValue: priceData.data?.[t.mint]?.price
                ? t.amount * parseFloat(priceData.data[t.mint].price)
                : null,
            }));
          } else {
            tokens = rawTokens;
          }
        } catch {
          tokens = rawTokens;
        }
      }

      // Sort by USD value
      tokens.sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));
      tokens = tokens.slice(0, 20);
    }

    // Transactions
    let transactions: WalletTransaction[] = [];
    if (signaturesResult.status === "fulfilled" && Array.isArray(signaturesResult.value)) {
      transactions = signaturesResult.value.slice(0, 10).map((sig: { signature: string; blockTime?: number }) => ({
        signature: sig.signature,
        type: "OTHER" as const,
        timestamp: (sig.blockTime ?? 0) * 1000,
        description: shortenSig(sig.signature),
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

function shortenSig(sig: string): string {
  return sig.slice(0, 8) + "…" + sig.slice(-6);
}

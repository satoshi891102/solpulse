import { NextResponse } from "next/server";
import type { TokenPair } from "@/types";

const DEXSCREENER_BASE = "https://api.dexscreener.com";

export const revalidate = 0;

export async function GET() {
  try {
    // Use DexScreener for both SOL price and top pairs
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=SOL%2FUSDC`, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("DexScreener error");

    const data = await res.json();

    // Find the most liquid SOL/USDC pair on Solana
    const solPairs: TokenPair[] = (data.pairs || []).filter(
      (p: TokenPair) =>
        p.chainId === "solana" &&
        p.baseToken?.symbol === "SOL" &&
        (p.quoteToken?.symbol === "USDC" || p.quoteToken?.symbol === "USDT")
    );

    // Sort by liquidity to get the most reliable price
    solPairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));

    const solPair = solPairs[0];
    const solPrice = solPair ? parseFloat(solPair.priceUsd) : 0;
    const solChange24h = solPair?.priceChange?.h24 ?? 0;

    // Get a broader set of Solana pairs for the market overview
    const topPairs = (data.pairs || [])
      .filter((p: TokenPair) => p.chainId === "solana" && (p.liquidity?.usd ?? 0) > 5000)
      .slice(0, 20);

    return NextResponse.json({
      data: {
        solPrice,
        solChange24h,
        topPairs,
      },
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json({
      data: { solPrice: 0, solChange24h: 0, topPairs: [] },
      error: "Market data temporarily unavailable",
      timestamp: Date.now(),
    }, { status: 200 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import type { TokenPair } from "@/types";

const DEXSCREENER_BASE = "https://api.dexscreener.com";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") || "h24";

  try {
    // Search for Solana pairs with high activity
    const [trendingRes, searchRes] = await Promise.allSettled([
      fetch(`${DEXSCREENER_BASE}/token-boosts/top/v1`, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 },
      }),
      fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=SOL`, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 },
      }),
    ]);

    let pairs: TokenPair[] = [];

    if (searchRes.status === "fulfilled" && searchRes.value.ok) {
      const data = await searchRes.value.json();
      pairs = (data.pairs || [])
        .filter((p: TokenPair) => p.chainId === "solana" && p.liquidity?.usd && (p.liquidity.usd > 1000))
        .slice(0, 50);
    }

    // Sort by the requested timeframe change
    const sortKey = timeframe as keyof TokenPair["priceChange"];
    pairs.sort((a, b) => {
      const aChange = a.priceChange?.[sortKey] ?? 0;
      const bChange = b.priceChange?.[sortKey] ?? 0;
      return Math.abs(bChange) - Math.abs(aChange);
    });

    // Top gainers and losers
    const gainers = [...pairs].sort((a, b) => (b.priceChange?.[sortKey] ?? 0) - (a.priceChange?.[sortKey] ?? 0)).slice(0, 20);
    const losers = [...pairs].sort((a, b) => (a.priceChange?.[sortKey] ?? 0) - (b.priceChange?.[sortKey] ?? 0)).slice(0, 20);

    return NextResponse.json({
      data: { gainers, losers, all: pairs.slice(0, 40) },
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending pairs", data: { gainers: [], losers: [], all: [] }, timestamp: Date.now() }, { status: 200 });
  }
}

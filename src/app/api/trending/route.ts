import { NextRequest, NextResponse } from "next/server";
import type { TokenPair } from "@/types";

const DEXSCREENER_BASE = "https://api.dexscreener.com";

export const revalidate = 0;

async function fetchSolanaTrendingAddresses(): Promise<string[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/token-boosts/top/v1`, {
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : [])
      .filter((t: { chainId?: string }) => t.chainId === "solana")
      .map((t: { tokenAddress: string }) => t.tokenAddress)
      .slice(0, 20);
  } catch {
    return [];
  }
}

async function fetchPairsForAddresses(addresses: string[]): Promise<TokenPair[]> {
  if (!addresses.length) return [];
  try {
    // DexScreener accepts up to 30 addresses comma-separated
    const chunk = addresses.slice(0, 20).join(",");
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/tokens/${chunk}`, {
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.pairs || [])
      .filter((p: TokenPair) => p.chainId === "solana" && (p.liquidity?.usd ?? 0) > 500)
      .sort((a: TokenPair, b: TokenPair) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));
  } catch {
    return [];
  }
}

async function fetchBroadSolanaPairs(): Promise<TokenPair[]> {
  // Fallback: search for generic Solana memecoin terms
  const queries = ["meme", "ai", "dog", "cat"];
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=${q}`, {
        headers: { "Accept": "application/json" },
      }).then(r => r.json()).then(d =>
        (d.pairs || []).filter((p: TokenPair) =>
          p.chainId === "solana" && (p.liquidity?.usd ?? 0) > 1000 && (p.volume?.h24 ?? 0) > 1000
        )
      )
    )
  );

  const allPairs: TokenPair[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const p of r.value) {
        if (!seen.has(p.pairAddress)) {
          seen.add(p.pairAddress);
          allPairs.push(p);
        }
      }
    }
  }
  return allPairs;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeframe = (searchParams.get("timeframe") || "h24") as keyof TokenPair["priceChange"];

  try {
    // Try to get trending addresses from token-boosts first
    const [trendingAddresses, broadPairs] = await Promise.all([
      fetchSolanaTrendingAddresses(),
      fetchBroadSolanaPairs(),
    ]);

    let trendingPairs: TokenPair[] = [];
    if (trendingAddresses.length > 0) {
      trendingPairs = await fetchPairsForAddresses(trendingAddresses);
    }

    // Merge and deduplicate
    const seen = new Set<string>();
    const allPairs: TokenPair[] = [];
    for (const p of [...trendingPairs, ...broadPairs]) {
      if (!seen.has(p.pairAddress)) {
        seen.add(p.pairAddress);
        allPairs.push(p);
      }
    }

    // Sort gainers/losers by the requested timeframe
    const gainers = [...allPairs]
      .filter(p => (p.priceChange?.[timeframe] ?? 0) > 0)
      .sort((a, b) => (b.priceChange?.[timeframe] ?? 0) - (a.priceChange?.[timeframe] ?? 0))
      .slice(0, 20);

    const losers = [...allPairs]
      .filter(p => (p.priceChange?.[timeframe] ?? 0) < 0)
      .sort((a, b) => (a.priceChange?.[timeframe] ?? 0) - (b.priceChange?.[timeframe] ?? 0))
      .slice(0, 20);

    return NextResponse.json({
      data: { gainers, losers, all: allPairs.slice(0, 40) },
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json({
      error: "Failed to fetch trending pairs",
      data: { gainers: [], losers: [], all: [] },
      timestamp: Date.now(),
    }, { status: 200 });
  }
}

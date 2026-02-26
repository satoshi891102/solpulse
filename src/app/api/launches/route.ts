import { NextRequest, NextResponse } from "next/server";
import type { TokenPair } from "@/types";

const DEXSCREENER_BASE = "https://api.dexscreener.com";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const maxAge = parseInt(searchParams.get("maxAge") || "86400");

  try {
    // Search for fresh Solana pairs across multiple terms
    const queries = ["pump", "sol", "meme", "ai", "based"];
    const results = await Promise.allSettled(
      queries.map(q =>
        fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=${q}`, {
          headers: { "Accept": "application/json" },
        }).then(r => r.json())
      )
    );

    const now = Date.now();
    const seen = new Set<string>();
    const launches: TokenPair[] = [];

    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      const pairs: TokenPair[] = r.value.pairs || [];
      for (const p of pairs) {
        if (p.chainId !== "solana") continue;
        if (!p.pairCreatedAt) continue;
        if (seen.has(p.pairAddress)) continue;
        const ageMs = now - p.pairCreatedAt;
        if (ageMs > maxAge * 1000) continue;
        seen.add(p.pairAddress);
        launches.push(p);
      }
    }

    // Sort by newest first
    launches.sort((a, b) => (b.pairCreatedAt ?? 0) - (a.pairCreatedAt ?? 0));

    return NextResponse.json({ data: launches.slice(0, 50), timestamp: Date.now() });
  } catch {
    return NextResponse.json({ data: [], error: "Failed to fetch launches", timestamp: Date.now() }, { status: 200 });
  }
}

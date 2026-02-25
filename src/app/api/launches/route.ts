import { NextRequest, NextResponse } from "next/server";
import type { TokenPair } from "@/types";

const DEXSCREENER_BASE = "https://api.dexscreener.com";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const maxAge = parseInt(searchParams.get("maxAge") || "86400"); // seconds, default 24h

  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=solana+new`, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("DexScreener error");

    const data = await res.json();
    const now = Date.now();

    const launches: TokenPair[] = (data.pairs || [])
      .filter((p: TokenPair) => {
        if (p.chainId !== "solana") return false;
        if (!p.pairCreatedAt) return false;
        const ageMs = now - p.pairCreatedAt;
        return ageMs < maxAge * 1000;
      })
      .sort((a: TokenPair, b: TokenPair) => (b.pairCreatedAt ?? 0) - (a.pairCreatedAt ?? 0))
      .slice(0, 50);

    return NextResponse.json({ data: launches, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ data: [], error: "Failed to fetch launches", timestamp: Date.now() }, { status: 200 });
  }
}

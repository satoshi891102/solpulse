import { NextResponse } from "next/server";

const DEXSCREENER_BASE = "https://api.dexscreener.com";
const JUPITER_PRICE_API = "https://api.jup.ag/price/v2";
const SOL_MINT = "So11111111111111111111111111111111111111112";

export const revalidate = 0;

export async function GET() {
  try {
    const [solPriceRes, topTokensRes] = await Promise.allSettled([
      fetch(`${JUPITER_PRICE_API}?ids=${SOL_MINT}`, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 30 },
      }),
      fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=WSOL`, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 },
      }),
    ]);

    let solPrice = 0;
    let solChange24h = 0;

    if (solPriceRes.status === "fulfilled" && solPriceRes.value.ok) {
      const priceData = await solPriceRes.value.json();
      solPrice = parseFloat(priceData?.data?.[SOL_MINT]?.price ?? 0);
    }

    // Get SOL market data from DexScreener as fallback/supplement
    let topPairs = [];
    if (topTokensRes.status === "fulfilled" && topTokensRes.value.ok) {
      const tokenData = await topTokensRes.value.json();
      topPairs = (tokenData.pairs || [])
        .filter((p: { chainId: string }) => p.chainId === "solana")
        .slice(0, 10);

      // Try to get SOL price and change from DexScreener if Jupiter failed
      const solPair = topPairs.find((p: { baseToken?: { symbol: string }; quoteToken?: { symbol: string }; priceUsd?: string; priceChange?: { h24?: number } }) => 
        p.baseToken?.symbol === "SOL" || p.quoteToken?.symbol === "SOL"
      );
      if (solPair && !solPrice) {
        solPrice = parseFloat(solPair.priceUsd ?? "0");
        solChange24h = solPair.priceChange?.h24 ?? 0;
      }
      if (solPair && !solChange24h) {
        solChange24h = solPair.priceChange?.h24 ?? 0;
      }
    }

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

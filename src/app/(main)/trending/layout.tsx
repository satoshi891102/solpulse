import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Pairs",
  description: "Top gaining and losing Solana pairs by timeframe — 1H, 6H, 24H, 7D. Real-time data from DexScreener.",
  openGraph: {
    title: "Trending Pairs | SolPulse",
    description: "Most active Solana trading pairs right now. Filter by 1H, 6H, 24H, 7D.",
    siteName: "SolPulse",
  },
};

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

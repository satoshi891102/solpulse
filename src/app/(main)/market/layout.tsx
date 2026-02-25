import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Overview",
  description: "Solana ecosystem at a glance. SOL price, market direction, top pairs ranked by performance.",
  openGraph: {
    title: "Market Overview | SolPulse",
    description: "Solana ecosystem stats — price, direction, top pairs.",
    siteName: "SolPulse",
  },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

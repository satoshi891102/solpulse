import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Launches",
  description: "Latest token launches on Solana DEXes. Filter by < 1H, < 6H, < 24H. Spot new launches before they pump.",
  openGraph: {
    title: "New Launches | SolPulse",
    description: "Latest token launches on Solana. Spot them first.",
    siteName: "SolPulse",
  },
};

export default function LaunchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

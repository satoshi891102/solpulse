import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet Lookup",
  description: "Enter any Solana wallet address to see token holdings, SOL balance, and recent transaction activity.",
  openGraph: {
    title: "Wallet Lookup | SolPulse",
    description: "Check any Solana wallet — balances, tokens, recent activity.",
    siteName: "SolPulse",
  },
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

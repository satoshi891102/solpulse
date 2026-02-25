import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SolPulse — Solana Morning Intelligence",
    template: "%s | SolPulse",
  },
  description:
    "The Solana morning intelligence dashboard. Real-time trending pairs, new launches, wallet lookup, and market overview. One place to start your day in crypto.",
  keywords: ["Solana", "crypto", "DeFi", "trading", "memecoins", "dashboard", "intelligence"],
  openGraph: {
    title: "SolPulse — Solana Morning Intelligence",
    description: "Real-time Solana market intelligence. Trending pairs, new launches, wallet lookup.",
    siteName: "SolPulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolPulse — Solana Morning Intelligence",
    description: "The Solana morning intelligence dashboard.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

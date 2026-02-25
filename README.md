# SolPulse — Solana Morning Intelligence

The Solana morning intelligence dashboard. One place to start your day in crypto.

## Live
https://solpulse-seven.vercel.app

## Pages

| Route | Description |
|-------|-------------|
| `/` | Daily Brief — SOL price hero, animated ticker, top gainers/losers |
| `/trending` | Trending pairs by timeframe (1H / 6H / 24H / 7D) |
| `/launches` | New token launches (< 1H / < 6H / < 24H filters) |
| `/wallet` | Wallet lookup — enter any Solana address |
| `/market` | Market overview — ecosystem stats and pair rankings |

## Data Sources

- **DexScreener REST API** — trending pairs, new launches, token prices (free, no auth)
- **Jupiter Price API v2** — SOL price and token USD values (free, no auth)
- **Public Solana RPC** — wallet balance and token holdings (free, no auth)

## Design

Editorial newspaper × Bloomberg Terminal × Solana dark.
- Midnight palette: deep charcoal background, electric purple accents
- JetBrains Mono for all price data, percentages, and addresses
- Dense, information-rich layout optimised for traders

## Tech Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS v4
- Framer Motion
- Zustand
- pnpm

## Local Dev

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

No API keys or environment variables required.

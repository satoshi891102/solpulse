export interface TokenPair {
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  priceNative: string;
  priceChange: { m5?: number; h1?: number; h6?: number; h24?: number; d7?: number };
  volume: { h24?: number; h6?: number; h1?: number; m5?: number };
  liquidity?: { usd?: number; base?: number; quote?: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  dexId: string;
  chainId: string;
  url: string;
}

export interface WalletToken {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  usdValue: number | null;
  logoURI?: string;
}

export interface WalletTransaction {
  signature: string;
  type: "SOL_TRANSFER" | "TOKEN_TRANSFER" | "SWAP" | "OTHER";
  timestamp: number;
  description: string;
}

export interface WalletData {
  address: string;
  solBalance: number;
  solUsdValue: number;
  tokens: WalletToken[];
  transactions: WalletTransaction[];
}

export interface MarketStats {
  solPrice: number;
  solChange24h: number;
  solVolume24h: number;
  totalPairs: number;
}

export type Timeframe = "h1" | "h6" | "h24" | "d7";

export interface ApiResponse<T> {
  data: T;
  error?: string;
  cached?: boolean;
  timestamp: number;
}

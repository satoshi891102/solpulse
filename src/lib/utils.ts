import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined) return "—";
  const n = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(n)) return "—";
  if (n >= 1000) return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1) return "$" + n.toFixed(4);
  if (n >= 0.001) return "$" + n.toFixed(6);
  return "$" + n.toExponential(2);
}

export function formatVolume(vol: number | null | undefined): string {
  if (!vol) return "—";
  if (vol >= 1_000_000_000) return "$" + (vol / 1_000_000_000).toFixed(2) + "B";
  if (vol >= 1_000_000) return "$" + (vol / 1_000_000).toFixed(2) + "M";
  if (vol >= 1_000) return "$" + (vol / 1_000).toFixed(1) + "K";
  return "$" + vol.toFixed(0);
}

export function formatLiquidity(liq: number | null | undefined): string {
  return formatVolume(liq);
}

export function formatPct(pct: number | null | undefined): string {
  if (pct === null || pct === undefined) return "—";
  const sign = pct >= 0 ? "+" : "";
  return sign + pct.toFixed(2) + "%";
}

export function pctClass(pct: number | null | undefined): string {
  if (!pct) return "text-neutral";
  return pct >= 0 ? "text-gain" : "text-loss";
}

export function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function shortenAddress(addr: string): string {
  if (!addr || addr.length < 12) return addr;
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

export function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

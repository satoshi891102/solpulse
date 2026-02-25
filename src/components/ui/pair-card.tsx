import type { TokenPair, Timeframe } from "@/types";
import { formatPrice, formatVolume, formatLiquidity, timeAgo } from "@/lib/utils";
import { PriceChange } from "./price-change";
import { ExternalLink, Flame, Sparkles } from "lucide-react";

interface PairCardProps {
  pair: TokenPair;
  timeframe?: Timeframe;
  showAge?: boolean;
}

export function PairCard({ pair, timeframe = "h24", showAge = false }: PairCardProps) {
  const pctChange = pair.priceChange?.[timeframe];
  const isHot = (pair.volume?.h24 ?? 0) > 100_000;
  const isNew = showAge && pair.pairCreatedAt && Date.now() - pair.pairCreatedAt < 30 * 60 * 1000;

  const ageMs = pair.pairCreatedAt ? Date.now() - pair.pairCreatedAt : null;
  const ageStr = ageMs ? timeAgo(pair.pairCreatedAt!) : null;

  return (
    <a
      href={pair.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-base card-hover block p-3 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Token name + badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {pair.baseToken.symbol}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              /{pair.quoteToken.symbol}
            </span>
            {isNew && (
              <span
                className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: "var(--accent-primary-dim)", color: "var(--accent-primary)" }}
              >
                <Sparkles className="h-2.5 w-2.5" /> NEW
              </span>
            )}
            {isHot && (
              <span
                className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: "oklch(0.72 0.22 145 / 0.15)", color: "var(--accent-green)" }}
              >
                <Flame className="h-2.5 w-2.5" /> HOT
              </span>
            )}
          </div>

          {/* DEX + age */}
          <div className="mt-0.5 flex items-center gap-2">
            <span className="label-upper">{pair.dexId}</span>
            {showAge && ageStr && (
              <span className="font-mono-num text-[10px]" style={{ color: "var(--text-muted)" }}>
                {ageStr}
              </span>
            )}
          </div>
        </div>

        {/* Price + change */}
        <div className="text-right shrink-0">
          <div className="font-mono-num text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {formatPrice(pair.priceUsd)}
          </div>
          <PriceChange value={pctChange} size="sm" />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        <div>
          <div className="label-upper">Vol 24h</div>
          <div className="font-mono-num text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {formatVolume(pair.volume?.h24)}
          </div>
        </div>
        <div>
          <div className="label-upper">Liq</div>
          <div className="font-mono-num text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {formatLiquidity(pair.liquidity?.usd)}
          </div>
        </div>
        {pair.fdv && (
          <div>
            <div className="label-upper">FDV</div>
            <div className="font-mono-num text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {formatVolume(pair.fdv)}
            </div>
          </div>
        )}
        <div className="ml-auto">
          <ExternalLink className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
        </div>
      </div>
    </a>
  );
}

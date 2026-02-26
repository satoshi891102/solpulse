import type { TokenPair } from "@/types";
import { formatPct, pctClass } from "@/lib/utils";

interface TickerStripProps {
  pairs: TokenPair[];
  timeframe?: keyof NonNullable<TokenPair["priceChange"]>;
}

export function TickerStrip({ pairs, timeframe = "h24" }: TickerStripProps) {
  if (!pairs.length) return null;

  const items = [...pairs, ...pairs]; // duplicate for seamless loop

  return (
    <div
      className="overflow-hidden rounded-lg border py-2"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((pair, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 text-sm font-mono-num">
            <span style={{ color: "var(--text-secondary)" }}>{pair.baseToken.symbol}</span>
            <span className={pctClass(pair.priceChange?.[timeframe])}>
              {formatPct(pair.priceChange?.[timeframe])}
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

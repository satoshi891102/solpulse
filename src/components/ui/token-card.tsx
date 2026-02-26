import type { WalletToken } from "@/types";
import { formatVolume, shortenAddress } from "@/lib/utils";

interface TokenCardProps {
  token: WalletToken;
}

export function TokenCard({ token }: TokenCardProps) {
  const initials = (token.symbol || "??").slice(0, 2).toUpperCase();

  return (
    <div className="card-base p-3 flex items-center justify-between gap-3">
      {/* Icon */}
      <div
        className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center font-mono-num text-xs font-bold"
        style={{
          background: `linear-gradient(135deg, var(--accent-primary-dim), var(--surface-raised))`,
          color: "var(--accent-primary)",
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {token.symbol || "Unknown"}
        </p>
        <p className="font-mono-num text-[10px]" style={{ color: "var(--text-muted)" }}>
          {shortenAddress(token.mint)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="font-mono-num text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {token.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        {token.usdValue !== null && token.usdValue > 0 && (
          <p className="font-mono-num text-xs" style={{ color: "var(--accent-green)" }}>
            ≈ {formatVolume(token.usdValue)}
          </p>
        )}
      </div>
    </div>
  );
}

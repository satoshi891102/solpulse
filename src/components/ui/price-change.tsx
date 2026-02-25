import { formatPct, pctClass } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceChangeProps {
  value?: number | null;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function PriceChange({ value, size = "md", showIcon = true }: PriceChangeProps) {
  const cls = pctClass(value);
  const formatted = formatPct(value);

  const sizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  if (value === null || value === undefined) {
    return <span className={`font-mono-num ${sizeClass} text-neutral`}>—</span>;
  }

  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;

  return (
    <span className={`inline-flex items-center gap-0.5 font-mono-num font-medium ${sizeClass} ${cls}`}>
      {showIcon && <Icon className="h-3 w-3 shrink-0" />}
      {formatted}
    </span>
  );
}

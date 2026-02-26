import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "gain" | "loss" | "new" | "hot" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const styles: Record<BadgeVariant, React.CSSProperties> = {
  default: { backgroundColor: "var(--accent-primary-dim)", color: "var(--accent-primary)" },
  gain: { backgroundColor: "oklch(0.72 0.22 145 / 0.15)", color: "var(--accent-green)" },
  loss: { backgroundColor: "oklch(0.60 0.22 25 / 0.12)", color: "var(--accent-red)" },
  new: { backgroundColor: "var(--accent-primary-dim)", color: "var(--accent-primary)" },
  hot: { backgroundColor: "oklch(0.72 0.22 145 / 0.15)", color: "var(--accent-green)" },
  muted: { backgroundColor: "var(--surface-raised)", color: "var(--text-muted)" },
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold", className)}
      style={styles[variant]}
    >
      {children}
    </span>
  );
}

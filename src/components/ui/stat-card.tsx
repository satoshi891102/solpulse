import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | React.ReactNode;
  sub?: string | React.ReactNode;
  className?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, className, accent }: StatCardProps) {
  return (
    <div className={cn("card-base p-4", className)}>
      <p className="label-upper mb-2">{label}</p>
      <div
        className="font-mono-num text-2xl font-bold"
        style={{ color: accent ? "var(--accent-primary)" : "var(--text-primary)" }}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

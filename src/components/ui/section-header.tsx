import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, icon: Icon, iconColor, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2 mb-3", className)}>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="h-4 w-4" style={{ color: iconColor ?? "var(--accent-primary)" }} />
        )}
        <h2 className="label-upper" style={{ color: "var(--text-secondary)" }}>{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

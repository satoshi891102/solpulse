interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = "◎", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-3xl mb-3" style={{ color: "var(--accent-primary)" }}>{icon}</p>
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{title}</p>
      {description && (
        <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

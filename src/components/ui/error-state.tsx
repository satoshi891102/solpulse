import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong", onRetry }: ErrorStateProps) {
  return (
    <div
      className="rounded-lg border p-4 flex items-start gap-3"
      style={{ borderColor: "var(--accent-red)", backgroundColor: "oklch(0.60 0.22 25 / 0.08)" }}
    >
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--accent-red)" }} />
      <div className="flex-1">
        <p className="text-sm" style={{ color: "var(--accent-red)" }}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs underline"
            style={{ color: "var(--text-muted)" }}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

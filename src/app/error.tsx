"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Something went wrong</h2>
      <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg px-4 py-2 text-sm font-medium"
        style={{ backgroundColor: "var(--accent-primary)", color: "white" }}
      >
        Try again
      </button>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center" style={{ backgroundColor: "var(--background)" }}>
      <p className="font-mono-num text-6xl font-bold" style={{ color: "var(--accent-primary)" }}>404</p>
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Page not found</h2>
      <Link href="/" className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: "var(--accent-primary)", color: "white" }}>
        Back to Brief
      </Link>
    </div>
  );
}

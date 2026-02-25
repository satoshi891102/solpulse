import { Nav } from "@/components/layout/nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}

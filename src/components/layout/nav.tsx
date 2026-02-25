"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TrendingUp, Rocket, Search, BarChart3, Zap } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Brief", icon: Zap, short: "Brief" },
  { href: "/trending", label: "Trending", icon: TrendingUp, short: "Hot" },
  { href: "/launches", label: "Launches", icon: Rocket, short: "New" },
  { href: "/wallet", label: "Wallet", icon: Search, short: "Wallet" },
  { href: "/market", label: "Market", icon: BarChart3, short: "Market" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span
              className="font-mono-num text-base font-bold tracking-tight"
              style={{ color: "var(--accent-primary)" }}
            >
              SOL<span style={{ color: "var(--text-primary)" }}>PULSE</span>
            </span>
            <span className="label-upper hidden sm:inline">Intelligence</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-white"
                      : "hover:text-white"
                  )}
                  style={
                    active
                      ? { backgroundColor: "var(--accent-primary-dim)", color: "var(--accent-primary)" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium transition-colors"
                  )}
                  style={
                    active
                      ? { color: "var(--accent-primary)" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-[10px]">{item.short}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

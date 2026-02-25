"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { formatPrice, formatVolume, formatPct, pctClass } from "@/lib/utils";
import { PriceChange } from "@/components/ui/price-change";
import { PairCard } from "@/components/ui/pair-card";
import { StatSkeleton, PairSkeleton } from "@/components/ui/loading-skeleton";
import type { TokenPair } from "@/types";
import { RefreshCw, TrendingUp, TrendingDown, Rocket } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<{
    solPrice: number;
    solChange24h: number;
    gainers: TokenPair[];
    losers: TokenPair[];
    ticker: TokenPair[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [marketRes, trendingRes] = await Promise.all([
        fetch("/api/market"),
        fetch("/api/trending?timeframe=h24"),
      ]);
      const market = await marketRes.json();
      const trending = await trendingRes.json();
      setData({
        solPrice: market.data?.solPrice ?? 0,
        solChange24h: market.data?.solChange24h ?? 0,
        gainers: trending.data?.gainers?.slice(0, 5) ?? [],
        losers: trending.data?.losers?.slice(0, 5) ?? [],
        ticker: trending.data?.all?.slice(0, 20) ?? [],
      });
      setLastUpdated(new Date());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (!lastUpdated) return;
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const tickerItems = data?.ticker ?? [];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <p className="label-upper">Solana Intelligence</p>
          <p className="text-xs mt-0.5 font-mono-num" style={{ color: "var(--text-muted)" }}>{today}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: lastUpdated ? "var(--accent-green)" : "var(--text-muted)" }}
          />
          {lastUpdated ? `Updated ${secondsAgo}s ago` : "Loading…"}
        </div>
      </div>

      {/* Hero: SOL Price */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-base p-6"
      >
        {loading ? (
          <div className="flex gap-6 flex-wrap">
            {[1, 2, 3].map(i => <StatSkeleton key={i} />)}
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-6">
            {/* SOL Price */}
            <div>
              <p className="label-upper">Solana (SOL)</p>
              <div className="flex items-end gap-3 mt-2">
                <span className="font-mono-num text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {formatPrice(data?.solPrice ?? 0)}
                </span>
                <div className="mb-1">
                  <PriceChange value={data?.solChange24h} size="lg" />
                  <p className="label-upper mt-0.5">24h change</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: "var(--border)" }} />

            {/* Quick stats */}
            <div className="flex gap-6 flex-wrap">
              <div>
                <p className="label-upper">Top Gainer 24h</p>
                <p className="font-mono-num text-lg font-semibold mt-1" style={{ color: "var(--accent-green)" }}>
                  {data?.gainers?.[0] ? formatPct(data.gainers[0].priceChange?.h24) : "—"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {data?.gainers?.[0]?.baseToken?.symbol ?? "—"}
                </p>
              </div>
              <div>
                <p className="label-upper">Top Loser 24h</p>
                <p className="font-mono-num text-lg font-semibold mt-1" style={{ color: "var(--accent-red)" }}>
                  {data?.losers?.[0] ? formatPct(data.losers[0].priceChange?.h24) : "—"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {data?.losers?.[0]?.baseToken?.symbol ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Ticker */}
      {tickerItems.length > 0 && (
        <div
          className="overflow-hidden rounded-lg border py-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex animate-ticker whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((pair, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 text-sm font-mono-num">
                <span style={{ color: "var(--text-secondary)" }}>{pair.baseToken.symbol}</span>
                <span className={pctClass(pair.priceChange?.h24)}>
                  {formatPct(pair.priceChange?.h24)}
                </span>
                <span style={{ color: "var(--border)" }}>·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gainers + Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4" style={{ color: "var(--accent-green)" }} />
            <h2 className="label-upper" style={{ color: "var(--text-secondary)" }}>Top Gainers (24h)</h2>
          </div>
          <div className="space-y-2">
            {loading
              ? [1, 2, 3, 4, 5].map(i => <PairSkeleton key={i} />)
              : data?.gainers?.length
              ? data.gainers.map((pair) => (
                  <motion.div
                    key={pair.pairAddress}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <PairCard pair={pair} timeframe="h24" />
                  </motion.div>
                ))
              : <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data available</p>
            }
          </div>
        </section>

        {/* Top Losers */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4" style={{ color: "var(--accent-red)" }} />
            <h2 className="label-upper" style={{ color: "var(--text-secondary)" }}>Top Losers (24h)</h2>
          </div>
          <div className="space-y-2">
            {loading
              ? [1, 2, 3, 4, 5].map(i => <PairSkeleton key={i} />)
              : data?.losers?.length
              ? data.losers.map((pair) => (
                  <motion.div
                    key={pair.pairAddress}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <PairCard pair={pair} timeframe="h24" />
                  </motion.div>
                ))
              : <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data available</p>
            }
          </div>
        </section>
      </div>
    </div>
  );
}

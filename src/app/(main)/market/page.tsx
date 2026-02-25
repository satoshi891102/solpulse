"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TokenPair } from "@/types";
import { formatPrice, formatVolume, formatPct, pctClass } from "@/lib/utils";
import { PriceChange } from "@/components/ui/price-change";
import { StatSkeleton, RowSkeleton } from "@/components/ui/loading-skeleton";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MarketData {
  solPrice: number;
  solChange24h: number;
  topPairs: TokenPair[];
}

export default function MarketPage() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/market")
      .then(r => r.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load market data");
        setLoading(false);
      });
  }, []);

  const gainers = data?.topPairs.filter(p => (p.priceChange?.h24 ?? 0) > 0).slice(0, 5) ?? [];
  const losers = data?.topPairs.filter(p => (p.priceChange?.h24 ?? 0) < 0).slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Market Overview</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Solana ecosystem at a glance</p>
      </div>

      {error && (
        <div className="card-base p-4 text-sm" style={{ color: "var(--accent-red)" }}>{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading ? (
          [1, 2, 3, 4].map(i => <StatSkeleton key={i} />)
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-4">
              <p className="label-upper mb-2">SOL Price</p>
              <p className="font-mono-num text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {formatPrice(data?.solPrice ?? 0)}
              </p>
              <PriceChange value={data?.solChange24h} size="sm" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-4">
              <p className="label-upper mb-2">24h Direction</p>
              <div className="flex items-center gap-2 mt-2">
                {(data?.solChange24h ?? 0) >= 0 ? (
                  <TrendingUp className="h-6 w-6" style={{ color: "var(--accent-green)" }} />
                ) : (
                  <TrendingDown className="h-6 w-6" style={{ color: "var(--accent-red)" }} />
                )}
                <span className="font-mono-num text-lg font-bold" style={{ color: (data?.solChange24h ?? 0) >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
                  {(data?.solChange24h ?? 0) >= 0 ? "Bullish" : "Bearish"}
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-4">
              <p className="label-upper mb-2">Active Pairs</p>
              <p className="font-mono-num text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {data?.topPairs?.length ?? "—"}
              </p>
              <p className="label-upper mt-1">tracked</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-base p-4">
              <p className="label-upper mb-2">Network</p>
              <div className="flex items-center gap-2 mt-2">
                <Activity className="h-5 w-5" style={{ color: "var(--accent-green)" }} />
                <span className="font-mono-num text-lg font-bold" style={{ color: "var(--accent-green)" }}>
                  Online
                </span>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Top pairs table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="label-upper mb-3">Top Gainers (Tracked Pairs)</h2>
          <div className="card-base">
            {loading
              ? [1,2,3,4,5].map(i => <RowSkeleton key={i} />)
              : gainers.length === 0
              ? <p className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>No data</p>
              : gainers.map((pair, i) => (
                  <a
                    key={pair.pairAddress}
                    href={pair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-raised border-b last:border-b-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-num text-xs w-5 text-center" style={{ color: "var(--text-muted)" }}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {pair.baseToken.symbol}
                        </p>
                        <p className="label-upper">{pair.dexId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-num text-sm" style={{ color: "var(--text-primary)" }}>
                        {formatPrice(pair.priceUsd)}
                      </p>
                      <p className={`font-mono-num text-xs font-medium ${pctClass(pair.priceChange?.h24)}`}>
                        {formatPct(pair.priceChange?.h24)}
                      </p>
                    </div>
                  </a>
                ))
            }
          </div>
        </section>

        <section>
          <h2 className="label-upper mb-3">Top Losers (Tracked Pairs)</h2>
          <div className="card-base">
            {loading
              ? [1,2,3,4,5].map(i => <RowSkeleton key={i} />)
              : losers.length === 0
              ? <p className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>No data</p>
              : losers.map((pair, i) => (
                  <a
                    key={pair.pairAddress}
                    href={pair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 transition-colors border-b last:border-b-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-num text-xs w-5 text-center" style={{ color: "var(--text-muted)" }}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {pair.baseToken.symbol}
                        </p>
                        <p className="label-upper">{pair.dexId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-num text-sm" style={{ color: "var(--text-primary)" }}>
                        {formatPrice(pair.priceUsd)}
                      </p>
                      <p className={`font-mono-num text-xs font-medium ${pctClass(pair.priceChange?.h24)}`}>
                        {formatPct(pair.priceChange?.h24)}
                      </p>
                    </div>
                  </a>
                ))
            }
          </div>
        </section>
      </div>

      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        Data sourced from DexScreener & Jupiter Price API · Updates every minute
      </p>
    </div>
  );
}

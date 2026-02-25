"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TokenPair, Timeframe } from "@/types";
import { PairCard } from "@/components/ui/pair-card";
import { PairSkeleton } from "@/components/ui/loading-skeleton";

const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: "h1", label: "1H" },
  { key: "h6", label: "6H" },
  { key: "h24", label: "24H" },
  { key: "d7", label: "7D" },
];

export default function TrendingPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("h24");
  const [data, setData] = useState<{ gainers: TokenPair[]; losers: TokenPair[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/trending?timeframe=${timeframe}`)
      .then(r => r.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load trending pairs");
        setLoading(false);
      });
  }, [timeframe]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Trending Pairs</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Most active Solana pairs by price movement
        </p>
      </div>

      {/* Timeframe Tabs */}
      <div
        className="flex rounded-lg p-1 gap-1 w-fit"
        style={{ backgroundColor: "var(--surface)" }}
      >
        {TIMEFRAMES.map(tf => (
          <button
            key={tf.key}
            onClick={() => setTimeframe(tf.key)}
            className="rounded-md px-4 py-1.5 text-sm font-medium transition-all"
            style={
              timeframe === tf.key
                ? { backgroundColor: "var(--accent-primary)", color: "white" }
                : { color: "var(--text-muted)" }
            }
          >
            {tf.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="card-base p-4 text-sm" style={{ color: "var(--accent-red)" }}>
          {error} — <button onClick={() => setTimeframe(timeframe)} className="underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gainers */}
        <section>
          <h2 className="label-upper mb-3" style={{ color: "var(--accent-green)" }}>
            Top Gainers ({timeframe.toUpperCase()})
          </h2>
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {loading
                ? [1,2,3,4,5,6,7,8].map(i => <PairSkeleton key={i} />)
                : data?.gainers?.length
                ? data.gainers.map((pair, i) => (
                    <motion.div
                      key={pair.pairAddress}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <PairCard pair={pair} timeframe={timeframe} />
                    </motion.div>
                  ))
                : <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>No data for this timeframe</p>
              }
            </AnimatePresence>
          </div>
        </section>

        {/* Losers */}
        <section>
          <h2 className="label-upper mb-3" style={{ color: "var(--accent-red)" }}>
            Top Losers ({timeframe.toUpperCase()})
          </h2>
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {loading
                ? [1,2,3,4,5,6,7,8].map(i => <PairSkeleton key={i} />)
                : data?.losers?.length
                ? data.losers.map((pair, i) => (
                    <motion.div
                      key={pair.pairAddress}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <PairCard pair={pair} timeframe={timeframe} />
                    </motion.div>
                  ))
                : <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>No data for this timeframe</p>
              }
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

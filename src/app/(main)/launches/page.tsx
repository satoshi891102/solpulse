"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TokenPair } from "@/types";
import { PairCard } from "@/components/ui/pair-card";
import { PairSkeleton } from "@/components/ui/loading-skeleton";

const FILTERS = [
  { label: "< 1H", maxAge: 3600 },
  { label: "< 6H", maxAge: 21600 },
  { label: "< 24H", maxAge: 86400 },
];

export default function LaunchesPage() {
  const [filter, setFilter] = useState(86400);
  const [data, setData] = useState<TokenPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLaunches = (maxAge: number) => {
    setLoading(true);
    setError(null);
    fetch(`/api/launches?maxAge=${maxAge}`)
      .then(r => r.json())
      .then(res => {
        setData(res.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load new launches");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLaunches(filter);
  }, [filter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>New Launches</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Latest token pairs launched on Solana DEXes
        </p>
      </div>

      {/* Filters */}
      <div className="flex rounded-lg p-1 gap-1 w-fit" style={{ backgroundColor: "var(--surface)" }}>
        {FILTERS.map(f => (
          <button
            key={f.maxAge}
            onClick={() => setFilter(f.maxAge)}
            className="rounded-md px-4 py-1.5 text-sm font-medium transition-all"
            style={
              filter === f.maxAge
                ? { backgroundColor: "var(--accent-primary)", color: "white" }
                : { color: "var(--text-muted)" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="card-base p-4 text-sm" style={{ color: "var(--accent-red)" }}>
          {error} — <button onClick={() => fetchLaunches(filter)} className="underline">Retry</button>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading
          ? [1,2,3,4,5,6,9,10,11].map(i => <PairSkeleton key={i} />)
          : data.length === 0
          ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-2xl mb-2">◎</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No new launches in this timeframe
              </p>
              <button
                onClick={() => setFilter(86400)}
                className="mt-3 text-sm underline"
                style={{ color: "var(--accent-primary)" }}
              >
                Expand to 24 hours
              </button>
            </div>
          )
          : data.map((pair, i) => (
            <motion.div
              key={pair.pairAddress}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <PairCard pair={pair} timeframe="h1" showAge />
            </motion.div>
          ))
        }
      </div>

      {!loading && data.length > 0 && (
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          Showing {data.length} launches · Data from DexScreener
        </p>
      )}
    </div>
  );
}

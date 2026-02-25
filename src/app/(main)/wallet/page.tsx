"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WalletData } from "@/types";
import { formatVolume, isValidSolanaAddress, shortenAddress, timeAgo } from "@/lib/utils";
import { Search, Copy, ExternalLink, Wallet } from "lucide-react";

const DEMO_ADDRESS = "Dd1jiAcbaR682iXkAGHPZmFrdpoHqh2zVerC9NqMDzgi";

export default function WalletPage() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const lookup = async (addr: string) => {
    if (!addr.trim()) return;
    if (!isValidSolanaAddress(addr.trim())) {
      setError("Invalid Solana address format");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/wallet?address=${addr.trim()}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json.data);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (!data?.address) return;
    navigator.clipboard.writeText(data.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Wallet Lookup</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Enter any Solana wallet address to see holdings and recent activity
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={e => e.key === "Enter" && lookup(address)}
            placeholder="Enter Solana wallet address…"
            className="w-full rounded-lg border px-4 py-3 font-mono-num text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: error ? "var(--accent-red)" : "var(--border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-primary)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? "var(--accent-red)" : "var(--border)";
            }}
          />
        </div>
        <button
          onClick={() => lookup(address)}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--accent-primary)", color: "white" }}
        >
          <Search className="h-4 w-4" />
          {loading ? "…" : "LOOK UP"}
        </button>
      </div>

      {/* Demo */}
      {!data && !loading && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Try an example:{" "}
          <button
            onClick={() => {
              setAddress(DEMO_ADDRESS);
              lookup(DEMO_ADDRESS);
            }}
            className="underline font-mono-num"
            style={{ color: "var(--accent-primary)" }}
          >
            {shortenAddress(DEMO_ADDRESS)}
          </button>
        </p>
      )}

      {/* Error */}
      {error && (
        <div
          className="rounded-lg border p-3 text-sm"
          style={{ backgroundColor: "var(--accent-red-dim)", borderColor: "var(--accent-red)", color: "var(--accent-red)" }}
        >
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="card-base p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-t-transparent mb-3"
            style={{ borderColor: "var(--accent-primary)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Looking up wallet…</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Address header */}
            <div className="card-base p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="label-upper mb-1">Wallet Address</p>
                  <p className="font-mono-num text-sm break-all" style={{ color: "var(--text-primary)" }}>
                    {data.address}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={copyAddress}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors"
                    style={{ backgroundColor: "var(--surface-raised)", color: "var(--text-secondary)" }}
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <a
                    href={`https://solscan.io/account/${data.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors"
                    style={{ backgroundColor: "var(--surface-raised)", color: "var(--text-secondary)" }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Solscan
                  </a>
                </div>
              </div>
            </div>

            {/* SOL Balance */}
            <div className="card-base p-4">
              <p className="label-upper mb-2">SOL Balance</p>
              <div className="flex items-end gap-3">
                <span className="font-mono-num text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {data.solBalance.toFixed(4)}
                </span>
                <span className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>SOL</span>
                {data.solUsdValue > 0 && (
                  <span className="font-mono-num text-base mb-1" style={{ color: "var(--accent-green)" }}>
                    ≈ {formatVolume(data.solUsdValue)}
                  </span>
                )}
              </div>
            </div>

            {/* Token Holdings */}
            <div>
              <h2 className="label-upper mb-3">Token Holdings</h2>
              {data.tokens.length === 0 ? (
                <div className="card-base p-6 text-center">
                  <Wallet className="h-6 w-6 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No SPL tokens found in this wallet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.tokens.map((token) => (
                    <div key={token.mint} className="card-base p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            {token.symbol || "Unknown"}
                          </p>
                          <p className="font-mono-num text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {shortenAddress(token.mint)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono-num text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {token.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </p>
                          {token.usdValue !== null && (
                            <p className="font-mono-num text-xs" style={{ color: "var(--accent-green)" }}>
                              ≈ {formatVolume(token.usdValue)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            {data.transactions.length > 0 && (
              <div>
                <h2 className="label-upper mb-3">Recent Activity</h2>
                <div className="card-base divide-y" style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}>
                  {data.transactions.map((tx) => (
                    <div key={tx.signature} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-mono-num text-xs" style={{ color: "var(--text-primary)" }}>
                          {tx.description}
                        </p>
                        <p className="label-upper mt-0.5">{tx.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num text-xs" style={{ color: "var(--text-muted)" }}>
                          {tx.timestamp ? timeAgo(tx.timestamp) : "—"}
                        </span>
                        <a
                          href={`https://solscan.io/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

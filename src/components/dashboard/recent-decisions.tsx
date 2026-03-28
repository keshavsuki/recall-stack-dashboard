"use client";

import Link from "next/link";
import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";

const AGENT_COLORS: Record<string, string> = {
  Guard: "bg-red-100 text-red-600",
  Memory: "bg-violet-100 text-violet-600",
  Research: "bg-blue-100 text-blue-600",
  Execution: "bg-emerald-100 text-emerald-600",
  Reporting: "bg-amber-100 text-amber-600",
};

const OUTCOME_COLORS: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-600",
  blocked: "bg-red-100 text-red-600",
  reverted: "bg-amber-100 text-amber-600",
  pending: "bg-zinc-100 text-zinc-500",
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RecentDecisions() {
  const { state } = useWS();

  const decisions = state?.decisions || [];
  const recent = [...decisions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);

  if (recent.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-800">
            Recent Decisions
          </h3>
          <Link
            href="/decisions"
            className="text-[11px] font-medium text-violet-500 hover:text-violet-600 transition-colors"
          >
            View all
          </Link>
        </div>
        <p className="text-xs text-zinc-400 text-center py-8">
          No decisions recorded yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-800">
          Recent Decisions
        </h3>
        <Link
          href="/decisions"
          className="text-[11px] font-medium text-violet-500 hover:text-violet-600 transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {recent.map((d) => (
          <div
            key={d.id}
            className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/40 p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold",
                    AGENT_COLORS[d.agent] || "bg-zinc-100 text-zinc-500"
                  )}
                >
                  {d.agent}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {relativeTime(d.timestamp)}
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-snug truncate">
                {d.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                  OUTCOME_COLORS[d.outcome] || "bg-zinc-100 text-zinc-500"
                )}
              >
                {d.outcome}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {d.tokenCost.toLocaleString()} tok
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";

const AGENT_COLORS: Record<string, string> = {
  Guard: "bg-red-100 text-red-600",
  Memory: "bg-violet-100 text-violet-600",
  Research: "bg-blue-100 text-blue-600",
  Execution: "bg-emerald-100 text-emerald-600",
  Reporting: "bg-amber-100 text-amber-600",
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

export function AgentActivityFeed() {
  const { state } = useWS();

  if (!state) return null;

  // Collect recent actions from all agents, tagged with agent name
  const allActions: { agent: string; action: string; timestamp: number }[] = [];
  for (const agent of state.agents) {
    for (const action of agent.recentActions.slice(0, 5)) {
      allActions.push({
        agent: agent.name,
        action,
        timestamp: agent.lastActive - Math.random() * 3600000,
      });
    }
  }

  // Sort by timestamp descending, take 10
  const feed = allActions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  if (feed.length === 0) return null;

  return (
    <div className="animate-slide-up">
      <h2 className="text-sm font-semibold text-zinc-800 mb-4">
        Recent Activity Across All Agents
      </h2>
      <div className="rounded-2xl border border-zinc-200/60 bg-white shadow-sm overflow-hidden">
        {feed.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-5 py-3 transition-colors",
              i % 2 === 0 ? "bg-white" : "bg-zinc-50/40",
              i !== feed.length - 1 && "border-b border-zinc-100/80"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0",
                AGENT_COLORS[item.agent] || "bg-zinc-100 text-zinc-500"
              )}
            >
              {item.agent}
            </span>
            <span className="text-xs text-zinc-600 truncate flex-1">
              {item.action}
            </span>
            <span className="text-[10px] text-zinc-400 shrink-0">
              {relativeTime(item.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

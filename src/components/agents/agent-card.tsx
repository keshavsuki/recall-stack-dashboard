"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgentRole } from "@/lib/types";

const ROLE_GRADIENTS: Record<string, { bg: string; icon: string }> = {
  Guard: {
    bg: "from-red-500/10 to-red-600/5",
    icon: "from-red-500 to-red-600",
  },
  Memory: {
    bg: "from-violet-500/10 to-violet-600/5",
    icon: "from-violet-500 to-violet-600",
  },
  Research: {
    bg: "from-blue-500/10 to-blue-600/5",
    icon: "from-blue-500 to-blue-600",
  },
  Execution: {
    bg: "from-emerald-500/10 to-emerald-600/5",
    icon: "from-emerald-500 to-emerald-600",
  },
  Reporting: {
    bg: "from-amber-500/10 to-amber-600/5",
    icon: "from-amber-500 to-amber-600",
  },
};

const ROLE_ICONS: Record<string, string> = {
  Guard: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  Memory: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  Research: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  Execution: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  Reporting: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AgentCard({ agent }: { agent: AgentRole }) {
  const gradient = ROLE_GRADIENTS[agent.name] || ROLE_GRADIENTS.Execution;
  const iconPath = ROLE_ICONS[agent.name] || ROLE_ICONS.Execution;

  return (
    <Card className="card-premium border-zinc-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
      {/* Gradient header with icon */}
      <div className={cn("relative flex items-center justify-center py-8 bg-gradient-to-br", gradient.bg)}>
        <div className={cn("rounded-2xl bg-gradient-to-br p-3", gradient.icon)}>
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Name and status */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-zinc-900">{agent.name}</h3>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full transition-all duration-300",
                agent.status === "active"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  : "bg-zinc-300"
              )}
            />
            <span className={cn(
              "text-xs font-medium",
              agent.status === "active" ? "text-emerald-500" : "text-zinc-400"
            )}>
              {agent.status}
            </span>
          </div>
        </div>

        {/* Role description */}
        <p className="text-xs text-zinc-400 mb-3">{agent.role}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-xs">
          <span className="font-semibold text-zinc-600">{agent.totalActions} total actions</span>
          <span className="text-zinc-400">Last active: {relativeTime(agent.lastActive)}</span>
        </div>

        {/* Recent actions */}
        {agent.recentActions.length > 0 && (
          <div className="border-t border-zinc-100 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Recent</p>
            <ul className="space-y-1">
              {agent.recentActions.slice(0, 4).map((action, i) => (
                <li key={i} className="text-xs text-zinc-500 truncate flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-300 shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

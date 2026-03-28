"use client";

import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, { bg: string; dot: string }> = {
  Guard: { bg: "bg-red-50", dot: "from-red-500 to-red-600" },
  Memory: { bg: "bg-violet-50", dot: "from-violet-500 to-violet-600" },
  Research: { bg: "bg-blue-50", dot: "from-blue-500 to-blue-600" },
  Execution: { bg: "bg-emerald-50", dot: "from-emerald-500 to-emerald-600" },
  Reporting: { bg: "bg-amber-50", dot: "from-amber-500 to-amber-600" },
};

const ROLE_ICONS: Record<string, string> = {
  Guard: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  Memory: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  Research: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  Execution: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  Reporting: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

export function AgentStrip() {
  const { state } = useWS();

  if (!state || state.agents.length === 0) {
    return (
      <div className="flex items-center gap-4 px-8 py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-1 h-16 rounded-xl bg-zinc-50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-8 py-4 animate-fade-in">
      <div className="flex items-center gap-3">
        {state.agents.map((agent) => {
          const colors = ROLE_COLORS[agent.name] || ROLE_COLORS.Execution;
          const iconPath = ROLE_ICONS[agent.name] || ROLE_ICONS.Execution;

          return (
            <div
              key={agent.id}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                  colors.dot
                )}
              >
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={iconPath}
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-800 truncate">
                    {agent.name}
                  </span>
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full shrink-0",
                      agent.status === "active"
                        ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                        : "bg-zinc-300"
                    )}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {agent.totalActions} actions
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useWS } from "@/components/shared/ws-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ActivityItem } from "@/lib/types";

const DOT_COLORS: Record<string, string> = {
  command: "bg-blue-400",
  gate: "bg-red-400",
  session: "bg-violet-400",
  file: "bg-emerald-400",
  system: "bg-zinc-300",
};

const DOT_RING_COLORS: Record<string, string> = {
  command: "ring-blue-400/20",
  gate: "ring-red-400/20",
  session: "ring-violet-400/20",
  file: "ring-emerald-400/20",
  system: "ring-zinc-300/20",
};

const ICON_BG: Record<string, string> = {
  command: "bg-blue-50 text-blue-600",
  gate: "bg-red-50 text-red-600",
  session: "bg-violet-50 text-violet-600",
  file: "bg-emerald-50 text-emerald-600",
  system: "bg-zinc-50 text-zinc-500",
};

function formatTime(ts: number): string {
  if (!ts) return "";
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function TimelineEntry({
  item,
  index,
  isFirst,
}: {
  item: ActivityItem;
  index: number;
  isFirst: boolean;
}) {
  const isGateBlock = item.type === "gate" && item.level === "block";
  const isSession = item.type === "session";
  const isCommand = item.type === "command";

  return (
    <div
      className={`group relative flex gap-4 pb-6 animate-fade-in ${
        isFirst ? "pt-0" : ""
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div
          className={`relative z-10 flex h-[10px] w-[10px] items-center justify-center rounded-full ${
            DOT_COLORS[item.type] || "bg-zinc-300"
          } ${isFirst ? "ring-4 " + (DOT_RING_COLORS[item.type] || "ring-zinc-200/20") + " animate-timeline-pulse" : ""}`}
        />
      </div>

      {/* Content */}
      <div className={`-mt-1 flex-1 min-w-0 ${isFirst ? "pb-1" : ""}`}>
        {/* Gate block: alert-style card */}
        {isGateBlock ? (
          <div className="rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/80 to-red-50/40 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                BLOCKED
              </span>
              <span className="text-[11px] text-red-400 font-medium">
                {formatTime(item.timestamp)}
              </span>
            </div>
            <p className="text-[13px] font-medium text-red-800 leading-snug">
              {item.description}
            </p>
            {item.detail && (
              <p className="mt-1 text-xs text-red-500/70">{item.detail}</p>
            )}
          </div>
        ) : isSession ? (
          /* Session: milestone marker */
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50/60 px-3 py-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[item.type]}`} />
              <span className="text-[12px] font-semibold text-violet-700">
                {item.description}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {formatTime(item.timestamp)}
            </span>
          </div>
        ) : isCommand ? (
          /* Command: code-style block */
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-zinc-50/80 px-3 py-2 font-mono text-[12px] text-zinc-700 leading-snug max-w-full">
                  <span className="text-violet-400 select-none">$</span>
                  <span className="truncate">{item.description}</span>
                </div>
                {item.detail && (
                  <p className="mt-1 pl-0.5 text-[11px] text-zinc-400">
                    {item.detail}
                  </p>
                )}
              </div>
              <span className="shrink-0 pt-2 text-[11px] text-zinc-300 font-medium">
                {formatTime(item.timestamp)}
              </span>
            </div>
          </div>
        ) : (
          /* Default: clean row */
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-zinc-600 leading-snug">
                {item.description}
              </p>
              {item.detail && (
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  {item.detail}
                </p>
              )}
            </div>
            <span className="shrink-0 text-[11px] text-zinc-300 font-medium">
              {formatTime(item.timestamp)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivityTimeline() {
  const { activities, state } = useWS();

  const historyAsActivities: ActivityItem[] = (state?.recentHistory || [])
    .slice(-50)
    .reverse()
    .map((h, i) => ({
      id: `hist-${i}`,
      type: "command" as const,
      description: h.display,
      timestamp: h.timestamp,
      detail: h.project,
    }));

  const merged = activities.length > 0 ? activities : historyAsActivities;

  return (
    <div className="animate-slide-up">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-800">Live Activity</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            {merged.length} events
          </span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        {merged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-3 h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 text-zinc-300"
              >
                <path
                  d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">Waiting for activity...</p>
            <p className="mt-1 text-xs text-zinc-300">
              Events will appear as your agent works
            </p>
          </div>
        ) : (
          <div className="timeline-line pl-1">
            {merged.map((item, i) => (
              <TimelineEntry
                key={item.id}
                item={item}
                index={i}
                isFirst={i === 0}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

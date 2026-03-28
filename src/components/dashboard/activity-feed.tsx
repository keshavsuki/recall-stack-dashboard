"use client";

import { useWS } from "@/components/shared/ws-provider";
import { TypeBadge } from "@/components/shared/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ActivityItem } from "@/lib/types";

const BORDER_COLORS: Record<string, string> = {
  command: "border-l-blue-400",
  gate: "border-l-red-400",
  session: "border-l-violet-400",
  file: "border-l-emerald-400",
  system: "border-l-zinc-300",
};

function formatTime(ts: number): string {
  if (!ts) return "";
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function ActivityRow({ item, index }: { item: ActivityItem; index: number }) {
  return (
    <div
      className={`group flex items-start gap-3 border-l-[3px] ${BORDER_COLORS[item.type] || "border-l-zinc-200"} bg-white px-4 py-3 transition-all duration-200 hover:bg-zinc-50/80 animate-fade-in`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <TypeBadge type={item.type} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-zinc-700 leading-snug">{item.description}</p>
        {item.detail && (
          <p className="mt-0.5 text-xs text-zinc-400">{item.detail}</p>
        )}
      </div>
      <span className="shrink-0 text-[11px] text-zinc-400 font-medium">
        {formatTime(item.timestamp)}
      </span>
    </div>
  );
}

export function ActivityFeed() {
  const { activities, state } = useWS();

  // Merge real-time activities with initial history
  const historyAsActivities: ActivityItem[] = (
    state?.recentHistory || []
  )
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
    <div className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-800">Live Activity</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            {merged.length} events
          </span>
        </div>
      </div>
      <ScrollArea className="h-[420px]">
        {merged.length === 0 ? (
          <div className="flex h-full items-center justify-center py-20 text-sm text-zinc-400">
            Waiting for activity...
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {merged.map((item, i) => <ActivityRow key={item.id} item={item} index={i} />)}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

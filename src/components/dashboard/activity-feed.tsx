"use client";

import { useWS } from "@/components/shared/ws-provider";
import { TypeBadge } from "@/components/shared/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ActivityItem } from "@/lib/types";

function formatTime(ts: number): string {
  if (!ts) return "";
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="group flex items-start gap-3 border-b border-zinc-800/50 px-4 py-2.5 transition-colors hover:bg-zinc-800/30">
      <TypeBadge type={item.type} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-zinc-300">{item.description}</p>
        {item.detail && (
          <p className="truncate text-xs text-zinc-600">{item.detail}</p>
        )}
      </div>
      <span className="shrink-0 text-[10px] text-zinc-600">
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
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-medium text-zinc-300">Live Activity</h2>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] text-zinc-600">
            {merged.length} events
          </span>
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        {merged.length === 0 ? (
          <div className="flex h-full items-center justify-center py-20 text-sm text-zinc-600">
            Waiting for activity...
          </div>
        ) : (
          merged.map((item) => <ActivityRow key={item.id} item={item} />)
        )}
      </ScrollArea>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useWS } from "@/components/shared/ws-provider";
import { TypeBadge } from "@/components/shared/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/types";

const FILTER_TYPES = [
  { value: "all", label: "All" },
  { value: "command", label: "Commands" },
  { value: "gate", label: "Gates" },
  { value: "session", label: "Sessions" },
  { value: "file", label: "Files" },
] as const;

function formatTimestamp(ts: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ActivityLog() {
  const [filter, setFilter] = useState<string>("all");
  const { activities, state } = useWS();

  // Build unified timeline
  const historyItems: ActivityItem[] = (state?.recentHistory || [])
    .map((h, i) => ({
      id: `h-${i}`,
      type: "command" as const,
      description: h.display,
      timestamp: h.timestamp,
      detail: h.project,
    }));

  const all = [...activities, ...historyItems].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const filtered =
    filter === "all" ? all : all.filter((item) => item.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        {FILTER_TYPES.map((ft) => (
          <button
            key={ft.value}
            onClick={() => setFilter(ft.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              filter === ft.value
                ? "bg-zinc-800 text-zinc-200"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            )}
          >
            {ft.label}
          </button>
        ))}
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <ScrollArea className="h-[600px]">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-zinc-600">
              No activity to show
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-2.5 hover:bg-zinc-800/20"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-[10px] text-zinc-600">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  <TypeBadge type={item.type} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-300">{item.description}</p>
                    {item.detail && (
                      <p className="text-xs text-zinc-600">{item.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}

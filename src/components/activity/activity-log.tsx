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

const BORDER_COLORS: Record<string, string> = {
  command: "border-l-blue-400",
  gate: "border-l-red-400",
  session: "border-l-violet-400",
  file: "border-l-emerald-400",
  system: "border-l-zinc-300",
};

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
    <div className="space-y-5 animate-slide-up">
      <div className="flex gap-2">
        {FILTER_TYPES.map((ft) => (
          <button
            key={ft.value}
            onClick={() => setFilter(ft.value)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200",
              filter === ft.value
                ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200/30"
                : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
            )}
          >
            {ft.label}
          </button>
        ))}
      </div>

      <Card className="border-zinc-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
        <ScrollArea className="h-[600px]">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-zinc-400">
              No activity to show
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 border-l-[3px] ${BORDER_COLORS[item.type] || "border-l-zinc-200"} px-5 py-3.5 transition-all duration-200 hover:bg-zinc-50/80 animate-fade-in`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] text-zinc-400 font-medium min-w-[70px]">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  <TypeBadge type={item.type} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-zinc-700">{item.description}</p>
                    {item.detail && (
                      <p className="mt-0.5 text-xs text-zinc-400">{item.detail}</p>
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

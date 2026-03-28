"use client";

import { cn } from "@/lib/utils";
import type { SessionEvent } from "@/lib/types";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const DOT_COLORS: Record<string, string> = {
  command: "bg-blue-400",
  file: "bg-emerald-400",
  gate: "bg-red-400",
};

const EVENT_BG: Record<string, string> = {
  command: "bg-blue-50/60",
  file: "bg-emerald-50/60",
  gate: "bg-red-50/60",
};

export function SessionTimeline({ events }: { events: SessionEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-zinc-500 font-medium">No events recorded</p>
      </div>
    );
  }

  return (
    <div className="timeline-line relative space-y-4 pl-10">
      {events.map((event, i) => (
        <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          {/* Timeline dot */}
          <div
            className={cn(
              "absolute -left-10 top-2 h-3 w-3 rounded-full border-2 border-white",
              DOT_COLORS[event.type] || "bg-zinc-300"
            )}
            style={{ left: "-22px" }}
          />

          {/* Event card */}
          <div className="flex items-start justify-between gap-4">
            <div className={cn(
              "flex-1 rounded-xl px-4 py-3",
              EVENT_BG[event.type] || "bg-zinc-50/60"
            )}>
              {/* Type indicator */}
              <div className="mb-1 flex items-center gap-2">
                {event.type === "command" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-blue-500">
                    <path d="M4 17l6-5-6-5M12 19h8" />
                  </svg>
                )}
                {event.type === "file" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-500">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
                {event.type === "gate" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-red-500">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  event.type === "command" && "text-blue-500",
                  event.type === "file" && "text-emerald-500",
                  event.type === "gate" && "text-red-500"
                )}>
                  {event.type}
                </span>
              </div>

              {/* Description */}
              {event.type === "command" ? (
                <code className="block text-[12px] font-mono text-zinc-700 leading-relaxed">
                  {event.description}
                </code>
              ) : (
                <p className="text-[13px] text-zinc-700 font-medium">
                  {event.description}
                </p>
              )}

              {/* Detail */}
              {event.detail && (
                <p className="mt-1 text-[11px] text-zinc-400 font-medium">
                  {event.detail}
                </p>
              )}
            </div>

            {/* Timestamp on the right */}
            <span className="shrink-0 pt-1 text-[11px] font-mono text-zinc-400">
              {formatTime(event.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

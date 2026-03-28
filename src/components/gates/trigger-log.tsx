"use client";

import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";
import type { GateTrigger } from "@/lib/types";

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

export function TriggerLog() {
  const { state } = useWS();
  const triggers = state?.gateTriggers || [];

  return (
    <div className="animate-slide-up">
      <h2 className="mb-4 text-sm font-semibold text-zinc-800">
        Recent Triggers
      </h2>

      {triggers.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center">
          <p className="text-sm text-zinc-400 font-medium">
            No gate triggers recorded
          </p>
        </div>
      ) : (
        <div
          className="space-y-2 overflow-y-auto"
          style={{ maxHeight: "400px" }}
        >
          {triggers.map((trigger) => (
            <TriggerEntry key={trigger.id} trigger={trigger} />
          ))}
        </div>
      )}
    </div>
  );
}

function TriggerEntry({ trigger }: { trigger: GateTrigger }) {
  const isBlock = trigger.level === "block";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3">
      {/* Timestamp */}
      <span className="shrink-0 pt-0.5 text-[11px] font-mono text-zinc-400">
        {relativeTime(trigger.timestamp)}
      </span>

      {/* Gate name badge */}
      <span
        className={cn(
          "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold",
          isBlock ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
        )}
      >
        {trigger.gateName}
      </span>

      {/* Blocked content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-zinc-600 font-medium">
          {trigger.blocked}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-400 font-mono">
          {trigger.toolCall}
        </p>
      </div>
    </div>
  );
}

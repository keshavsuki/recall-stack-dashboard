"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { LevelBadge } from "@/components/shared/badge";
import type { Gate } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GateCard({ gate }: { gate: Gate }) {
  const [enabled, setEnabled] = useState(gate.enabled);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await fetch("/api/gates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gate.name, enabled: !enabled }),
      });
      setEnabled(!enabled);
    } catch {
      // Revert on error
    } finally {
      setLoading(false);
    }
  }

  const isBlock = gate.level === "block";

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-white transition-all duration-200",
        enabled
          ? isBlock
            ? "border-red-200/60 shadow-sm"
            : "border-amber-200/60 shadow-sm"
          : "border-zinc-100 opacity-50"
      )}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          "h-0.5 rounded-t-2xl",
          isBlock
            ? "bg-gradient-to-r from-red-400 to-red-500"
            : "bg-gradient-to-r from-amber-400 to-amber-500"
        )}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Icon */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                isBlock ? "bg-red-50" : "bg-amber-50"
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-4 w-4",
                  isBlock ? "text-red-500" : "text-amber-500"
                )}
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-zinc-800">
                  {gate.name}
                </span>
                <LevelBadge level={gate.level} />
                {gate.auto && (
                  <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-500 tracking-wide">
                    AUTO
                  </span>
                )}
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">
                {gate.tool}
              </span>
            </div>
          </div>

          <Switch
            checked={enabled}
            onCheckedChange={toggle}
            disabled={loading}
          />
        </div>

        {/* Pattern as styled code block */}
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 font-mono">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-red-300/60" />
              <div className="h-2 w-2 rounded-full bg-amber-300/60" />
              <div className="h-2 w-2 rounded-full bg-emerald-300/60" />
            </div>
            <span className="text-[9px] text-zinc-300 font-sans font-medium">
              pattern
            </span>
          </div>
          <code className="block text-[12px] leading-relaxed">
            <span className="syntax-keyword">match</span>{" "}
            <span className="syntax-regex">/{gate.pattern}/</span>
          </code>
        </div>

        {/* Message */}
        <p className="mt-3 text-[12px] text-zinc-500 leading-relaxed">
          {gate.message}
        </p>
      </div>
    </div>
  );
}

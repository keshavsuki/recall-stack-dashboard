"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card
      className={cn(
        "card-premium border-zinc-200/80 bg-white shadow-sm overflow-hidden transition-all duration-200",
        !enabled && "opacity-50"
      )}
    >
      <div className={cn(
        "h-1 w-full",
        gate.level === "block" && "bg-gradient-to-r from-red-400 to-red-500",
        gate.level === "warn" && "bg-gradient-to-r from-amber-400 to-amber-500"
      )} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-800">
                {gate.name}
              </span>
              <LevelBadge level={gate.level} />
              {gate.auto && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-600">
                  AUTO
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                  {gate.tool}
                </span>
              </div>
              <code className="block rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-500 font-mono border border-zinc-100">
                /{gate.pattern}/
              </code>
            </div>
            <p className="text-xs text-zinc-400">{gate.message}</p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={toggle}
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

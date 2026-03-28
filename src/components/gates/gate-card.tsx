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
        "border-zinc-800 transition-all",
        enabled ? "bg-zinc-900/80" : "bg-zinc-900/30 opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-200">
                {gate.name}
              </span>
              <LevelBadge level={gate.level} />
              {gate.auto && (
                <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-400">
                  AUTO
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                  {gate.tool}
                </span>
              </div>
              <code className="block rounded bg-zinc-950 px-2 py-1 text-xs text-zinc-400">
                /{gate.pattern}/
              </code>
            </div>
            <p className="text-xs text-zinc-600">{gate.message}</p>
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

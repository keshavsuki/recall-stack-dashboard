"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

function StatCard({ label, value, sub, color = "text-zinc-100" }: StatCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
        {sub && <p className="mt-0.5 text-xs text-zinc-600">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function StatusCards() {
  const { state } = useWS();

  if (!state) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
              <div className="mt-2 h-8 w-10 animate-pulse rounded bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const gates = state.gates.gates;
  const blockCount = gates.filter((g) => g.level === "block" && g.enabled).length;
  const warnCount = gates.filter((g) => g.level === "warn" && g.enabled).length;
  const approaching = state.lessons.filter(
    (l) => l.failureCount >= 2 && !l.promoted
  ).length;

  // Count active layers
  const layers = [
    !!state.claudeMd,
    !!state.primer.raw,
    state.health.filesWatched.includes("settings.json"),
    state.health.hindsightAvailable,
    state.recentHistory.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Active Gates"
        value={gates.filter((g) => g.enabled).length}
        sub={`${blockCount} blocking, ${warnCount} warning`}
        color="text-red-400"
      />
      <StatCard
        label="Lessons Learned"
        value={state.lessons.length}
        sub={
          approaching > 0
            ? `${approaching} approaching gate promotion`
            : "none approaching promotion"
        }
        color="text-amber-400"
      />
      <StatCard
        label="Sessions Today"
        value={state.sessions.length}
        sub={
          state.health.activeSessions > 0
            ? `${state.health.activeSessions} active now`
            : "none active"
        }
        color="text-purple-400"
      />
      <StatCard
        label="Memory Layers"
        value={`${layers}/5`}
        sub="active"
        color="text-emerald-400"
      />
    </div>
  );
}

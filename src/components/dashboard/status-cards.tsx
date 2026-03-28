"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
  accentBg: string;
}

function StatCard({ label, value, sub, gradient, accentBg }: StatCardProps) {
  return (
    <Card className={`card-premium border-zinc-200/80 bg-white shadow-sm overflow-hidden`}>
      <CardContent className="relative p-5">
        <div className={`absolute top-0 right-0 h-24 w-24 rounded-bl-[60px] opacity-[0.04] ${accentBg}`} />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </p>
        <p className={`mt-2 text-3xl font-extrabold tracking-tight ${gradient}`}>{value}</p>
        {sub && <p className="mt-1 text-xs text-zinc-400 font-medium">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function StatusCards() {
  const { state } = useWS();

  if (!state) {
    return (
      <div className="grid grid-cols-4 gap-5 stagger-children">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-200/80 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="h-4 w-20 animate-pulse rounded-lg bg-zinc-100" />
              <div className="mt-3 h-9 w-14 animate-pulse rounded-lg bg-zinc-100" />
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
    <div className="grid grid-cols-4 gap-5 stagger-children">
      <StatCard
        label="Active Gates"
        value={gates.filter((g) => g.enabled).length}
        sub={`${blockCount} blocking, ${warnCount} warning`}
        gradient="text-gradient"
        accentBg="bg-red-500"
      />
      <StatCard
        label="Lessons Learned"
        value={state.lessons.length}
        sub={
          approaching > 0
            ? `${approaching} approaching gate promotion`
            : "none approaching promotion"
        }
        gradient="text-gradient"
        accentBg="bg-amber-500"
      />
      <StatCard
        label="Sessions Today"
        value={state.sessions.length}
        sub={
          state.health.activeSessions > 0
            ? `${state.health.activeSessions} active now`
            : "none active"
        }
        gradient="text-gradient"
        accentBg="bg-violet-500"
      />
      <StatCard
        label="Memory Layers"
        value={`${layers}/5`}
        sub="active"
        gradient="text-gradient"
        accentBg="bg-emerald-500"
      />
    </div>
  );
}

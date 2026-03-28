"use client";

import { useWS } from "@/components/shared/ws-provider";

interface RibbonStatProps {
  label: string;
  value: string | number;
  color: string;
}

function RibbonStat({ label, value, color }: RibbonStatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
          {value}
        </span>
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
      </div>
    </div>
  );
}

export function StatsRibbon() {
  const { state } = useWS();

  if (!state) {
    return (
      <div className="flex items-center gap-8 border-b border-zinc-100 bg-white/60 px-8 py-3.5 backdrop-blur-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-100 animate-pulse" />
            <div className="h-5 w-16 rounded bg-zinc-100 animate-pulse" />
          </div>
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
  const layers = [
    !!state.claudeMd,
    !!state.primer.raw,
    state.health.filesWatched.includes("settings.json"),
    state.health.hindsightAvailable,
    state.recentHistory.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-0 border-b border-zinc-100 bg-white/60 px-8 py-3.5 backdrop-blur-sm animate-fade-in">
      <RibbonStat
        label={`Gates${blockCount > 0 ? ` (${blockCount} blocking)` : ""}`}
        value={gates.filter((g) => g.enabled).length}
        color="bg-red-400"
      />
      <div className="stat-divider mx-6" />
      <RibbonStat
        label={`Lessons${approaching > 0 ? ` (${approaching} near promotion)` : ""}`}
        value={state.lessons.length}
        color="bg-amber-400"
      />
      <div className="stat-divider mx-6" />
      <RibbonStat
        label={`Sessions${state.health.activeSessions > 0 ? ` (${state.health.activeSessions} active)` : ""}`}
        value={state.sessions.length}
        color="bg-violet-400"
      />
      <div className="stat-divider mx-6" />
      <RibbonStat
        label="Layers"
        value={`${layers}/5`}
        color="bg-emerald-400"
      />
    </div>
  );
}

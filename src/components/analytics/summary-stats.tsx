"use client";

import { useWS } from "@/components/shared/ws-provider";

interface StatPillProps {
  label: string;
  value: string | number;
  color: string;
}

function StatPill({ label, value, color }: StatPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white px-5 py-3 shadow-sm">
      <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-zinc-900">{value}</span>
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
      </div>
    </div>
  );
}

export function SummaryStats() {
  const { state } = useWS();

  if (!state) {
    return (
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-5 py-3 shadow-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-100 animate-pulse" />
            <div className="h-6 w-20 rounded bg-zinc-100 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const { trends } = state;
  const totalSessions = trends.sessionsPerDay.reduce((sum, d) => sum + d.count, 0);
  const totalGates = trends.gatesPerDay.reduce((sum, d) => sum + d.count, 0);
  const totalLessons = trends.lessonsCumulative.length > 0
    ? trends.lessonsCumulative[trends.lessonsCumulative.length - 1].total
    : 0;
  const uniqueCommands = trends.topCommands.length;

  return (
    <div className="flex flex-wrap items-center gap-4 animate-slide-up">
      <StatPill label="Total Sessions" value={totalSessions} color="bg-violet-400" />
      <StatPill label="Gate Triggers" value={totalGates} color="bg-red-400" />
      <StatPill label="Lessons Learned" value={totalLessons} color="bg-amber-400" />
      <StatPill label="Unique Commands" value={uniqueCommands} color="bg-emerald-400" />
    </div>
  );
}

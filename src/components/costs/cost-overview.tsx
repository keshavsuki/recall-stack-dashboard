"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";

export function CostOverview() {
  const { state } = useWS();

  if (!state) {
    return (
      <div className="grid grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
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

  const { totalCost, dailyBreakdown, entries } = state.costs;
  const daysTracked = dailyBreakdown.length || 1;
  const dailyAvg = totalCost / daysTracked;
  const sessionCount = entries.length;

  return (
    <div className="grid grid-cols-3 gap-5 animate-slide-up stagger-children">
      <Card className="card-premium border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <CardContent className="relative p-5">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[60px] opacity-[0.04] bg-violet-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Spend</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gradient">${totalCost.toFixed(2)}</p>
          <p className="mt-1 text-xs text-zinc-400 font-medium">last {daysTracked} days</p>
        </CardContent>
      </Card>
      <Card className="card-premium border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <CardContent className="relative p-5">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[60px] opacity-[0.04] bg-blue-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Daily Average</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gradient">${dailyAvg.toFixed(2)}</p>
          <p className="mt-1 text-xs text-zinc-400 font-medium">per day</p>
        </CardContent>
      </Card>
      <Card className="card-premium border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <CardContent className="relative p-5">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[60px] opacity-[0.04] bg-emerald-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Sessions Tracked</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gradient">{sessionCount}</p>
          <p className="mt-1 text-xs text-zinc-400 font-medium">across {daysTracked} days</p>
        </CardContent>
      </Card>
    </div>
  );
}

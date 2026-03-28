"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/shared/bar-chart";

export function DailyChart() {
  const { state } = useWS();

  if (!state) {
    return (
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="h-4 w-32 animate-pulse rounded-lg bg-zinc-100" />
          <div className="mt-6 h-40 animate-pulse rounded-lg bg-zinc-50" />
        </CardContent>
      </Card>
    );
  }

  const breakdown = state.costs.dailyBreakdown.slice(-14);
  const data = breakdown.map((d) => ({
    label: d.date.slice(5), // MM-DD
    value: +d.cost.toFixed(2),
  }));

  return (
    <Card className="card-premium border-zinc-200/80 bg-white shadow-sm rounded-2xl animate-slide-up">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">Daily Spend (14 days)</h3>
        {data.length > 0 ? (
          <BarChart data={data} maxHeight={180} color="from-violet-500 to-blue-500" />
        ) : (
          <p className="text-xs text-zinc-400 text-center py-8">No cost data available</p>
        )}
      </CardContent>
    </Card>
  );
}

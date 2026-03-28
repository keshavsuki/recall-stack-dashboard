"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/shared/bar-chart";

interface TrendChartProps {
  title: string;
  dataKey: "sessionsPerDay" | "gatesPerDay";
  color?: string;
}

export function TrendChart({ title, dataKey, color = "from-violet-500 to-blue-500" }: TrendChartProps) {
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

  const series = state.trends[dataKey];
  const data = series.map((d) => ({
    label: d.date.slice(5), // MM-DD
    value: d.count,
  }));

  return (
    <Card className="card-premium border-zinc-200/80 bg-white shadow-sm rounded-2xl animate-slide-up">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">{title}</h3>
        {data.length > 0 ? (
          <BarChart data={data} maxHeight={180} color={color} />
        ) : (
          <p className="text-xs text-zinc-400 text-center py-8">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}

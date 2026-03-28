import { Header } from "@/components/layout/header";
import { SummaryStats } from "@/components/analytics/summary-stats";
import { TrendChart } from "@/components/analytics/trend-chart";
import { TopCommands } from "@/components/analytics/top-commands";

export default function AnalyticsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Analytics" />
      <div className="flex-1 space-y-6 p-8">
        <SummaryStats />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrendChart
            title="Sessions per Day"
            dataKey="sessionsPerDay"
            color="from-violet-500 to-blue-500"
          />
          <TrendChart
            title="Gate Triggers per Day"
            dataKey="gatesPerDay"
            color="from-red-500 to-amber-500"
          />
        </div>
        <TopCommands />
      </div>
    </div>
  );
}

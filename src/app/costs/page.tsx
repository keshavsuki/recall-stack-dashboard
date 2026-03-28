import { Header } from "@/components/layout/header";
import { CostOverview } from "@/components/costs/cost-overview";
import { DailyChart } from "@/components/costs/daily-chart";
import { ModelBreakdown } from "@/components/costs/model-breakdown";

export default function CostsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Costs" />
      <div className="flex-1 space-y-6 p-8">
        <CostOverview />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DailyChart />
          <ModelBreakdown />
        </div>
      </div>
    </div>
  );
}

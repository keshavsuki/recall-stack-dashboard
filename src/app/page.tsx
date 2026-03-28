import { HeroBanner } from "@/components/dashboard/hero-banner";
import { StatsRibbon } from "@/components/dashboard/stats-ribbon";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <HeroBanner />
      <StatsRibbon />
      <div className="flex-1 px-8 pb-8 pt-6">
        <ActivityTimeline />
      </div>
    </div>
  );
}

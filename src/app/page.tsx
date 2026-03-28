import { HeroBanner } from "@/components/dashboard/hero-banner";
import { StatsRibbon } from "@/components/dashboard/stats-ribbon";
import { AgentStrip } from "@/components/dashboard/agent-strip";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { RecentDecisions } from "@/components/dashboard/recent-decisions";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <HeroBanner />
      <StatsRibbon />
      <AgentStrip />
      <div className="flex-1 px-8 pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityTimeline />
          </div>
          <div>
            <RecentDecisions />
          </div>
        </div>
      </div>
    </div>
  );
}

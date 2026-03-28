import { Header } from "@/components/layout/header";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { StatusCards } from "@/components/dashboard/status-cards";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 space-y-6 p-6">
        <ActivityFeed />
        <StatusCards />
      </div>
    </div>
  );
}

import { Header } from "@/components/layout/header";
import { ActivityLog } from "@/components/activity/activity-log";

export default function ActivityPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Activity" />
      <div className="flex-1 p-6">
        <ActivityLog />
      </div>
    </div>
  );
}

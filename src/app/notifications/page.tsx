"use client";

import { Header } from "@/components/layout/header";
import { NotificationList } from "@/components/notifications/notification-list";

export default function NotificationsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Notifications" />
      <div className="flex-1 p-8">
        <NotificationList />
      </div>
    </div>
  );
}

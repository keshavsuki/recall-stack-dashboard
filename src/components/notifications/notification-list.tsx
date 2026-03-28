"use client";

import { useNotifications } from "./notification-provider";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TYPE_ICONS: Record<AppNotification["type"], { path: string; color: string }> = {
  gate_block: {
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    color: "text-red-500 bg-red-50",
  },
  lesson_promoted: {
    path: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V5a2.5 2.5 0 012.5-2.5H20v15H6.5A2.5 2.5 0 004 19.5z",
    color: "text-emerald-500 bg-emerald-50",
  },
  session_start: {
    path: "M5 3l14 9-14 9V3z",
    color: "text-blue-500 bg-blue-50",
  },
  session_end: {
    path: "M6 4h4v16H6zM14 4h4v16h-4z",
    color: "text-zinc-500 bg-zinc-100",
  },
  system: {
    path: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
    color: "text-violet-500 bg-violet-50",
  },
};

export function NotificationList() {
  const { notifications, markAllRead, markRead, dismiss } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6 text-zinc-300"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 font-medium">No notifications</p>
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="animate-slide-up">
      {/* Header actions */}
      {hasUnread && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={markAllRead}
            className="rounded-lg bg-violet-50 px-3 py-1.5 text-[12px] font-semibold text-violet-600 transition-colors hover:bg-violet-100"
          >
            Mark all read
          </button>
        </div>
      )}

      {/* Notification list */}
      <div className="space-y-2 stagger-children">
        {notifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            notification={notif}
            onRead={() => markRead(notif.id)}
            onDismiss={() => dismiss(notif.id)}
          />
        ))}
      </div>
    </div>
  );
}

function NotificationCard({
  notification,
  onRead,
  onDismiss,
}: {
  notification: AppNotification;
  onRead: () => void;
  onDismiss: () => void;
}) {
  const iconInfo = TYPE_ICONS[notification.type];

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-xl border bg-white px-4 py-3 transition-all",
        notification.read ? "border-zinc-100" : "border-violet-100"
      )}
      onClick={() => {
        if (!notification.read) onRead();
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" />
      )}

      {/* Icon */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
        iconInfo.color.split(" ")[1]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("h-4 w-4", iconInfo.color.split(" ")[0])}
        >
          <path d={iconInfo.path} />
        </svg>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold text-zinc-800">
            {notification.title}
          </p>
          <span className="shrink-0 text-[11px] text-zinc-400 font-mono">
            {relativeTime(notification.timestamp)}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-zinc-500 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="shrink-0 self-start rounded-md p-1 text-zinc-300 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-500 group-hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

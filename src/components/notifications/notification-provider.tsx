"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AppNotification } from "@/lib/types";

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
  dismiss: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

const now = Date.now();
const mins = (n: number) => now - n * 60_000;
const hours = (n: number) => now - n * 3600_000;

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-001",
    timestamp: mins(3),
    type: "gate_block",
    title: "Credential pattern blocked",
    message: "Gate no-credentials-in-output blocked a write containing sk-proj- to config/api.ts",
    read: false,
  },
  {
    id: "notif-002",
    timestamp: mins(12),
    type: "session_start",
    title: "Session started",
    message: "New interactive session in api-server (pid 48291)",
    read: false,
  },
  {
    id: "notif-003",
    timestamp: mins(45),
    type: "gate_block",
    title: "Force push intercepted",
    message: "Gate no-force-push blocked git push --force on feature/demo-mode",
    read: false,
  },
  {
    id: "notif-004",
    timestamp: hours(2),
    type: "lesson_promoted",
    title: "Lesson promoted to gate",
    message: "no-em-dashes reached 7 failures and was promoted to AGENTS.md LEARNED section",
    read: true,
  },
  {
    id: "notif-005",
    timestamp: hours(5),
    type: "session_end",
    title: "Session ended",
    message: "Session ses-003 in api-server ended after 2h 31m. 10 commands, 2 files changed.",
    read: true,
  },
  {
    id: "notif-006",
    timestamp: hours(8),
    type: "system",
    title: "Watcher started",
    message: "Recall Stack watcher initialized, monitoring 6 files in .claude/ directory",
    read: true,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // In demo mode, seed with sample notifications
    setNotifications(DEMO_NOTIFICATIONS);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, dismiss }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

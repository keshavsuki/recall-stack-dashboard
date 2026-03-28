"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { DashboardState, WSEvent, ActivityItem } from "@/lib/types";

interface WSContextValue {
  state: DashboardState | null;
  connected: boolean;
  activities: ActivityItem[];
}

const WSContext = createContext<WSContextValue>({
  state: null,
  connected: false,
  activities: [],
});

export function useWS() {
  return useContext(WSContext);
}

// Demo mode: env var OR detected by hostname (Vercel deployments)
const IS_DEMO =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  (typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
     window.location.hostname.includes("vercel.sh")));

const WS_URL =
  typeof window !== "undefined" && !IS_DEMO
    ? `ws://${window.location.hostname}:${process.env.NEXT_PUBLIC_WS_PORT || 3001}`
    : "";

export function WSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState | null>(null);
  const [connected, setConnected] = useState(IS_DEMO);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>(undefined);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || IS_DEMO) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 3s
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSEvent = JSON.parse(event.data);

        switch (msg.type) {
          case "snapshot":
            setState(msg.data);
            break;
          case "primer:updated":
            setState((prev) =>
              prev ? { ...prev, primer: msg.data } : prev
            );
            break;
          case "gates:updated":
            setState((prev) =>
              prev ? { ...prev, gates: msg.data } : prev
            );
            break;
          case "failures:updated":
            setState((prev) =>
              prev ? { ...prev, failures: msg.data } : prev
            );
            break;
          case "history:appended":
            setState((prev) =>
              prev
                ? {
                    ...prev,
                    recentHistory: [...prev.recentHistory, ...msg.data].slice(
                      -200
                    ),
                  }
                : prev
            );
            break;
          case "session:started":
            setState((prev) =>
              prev
                ? { ...prev, sessions: [msg.data, ...prev.sessions] }
                : prev
            );
            break;
          case "activity":
            setActivities((prev) => [msg.data, ...prev].slice(0, 500));
            break;
          case "health:status":
            setState((prev) =>
              prev ? { ...prev, health: msg.data } : prev
            );
            break;
          case "decisions:updated":
            setState((prev) =>
              prev ? { ...prev, decisions: msg.data } : prev
            );
            break;
          case "costs:updated":
            setState((prev) =>
              prev ? { ...prev, costs: msg.data } : prev
            );
            break;
          case "triggers:updated":
            setState((prev) =>
              prev ? { ...prev, gateTriggers: msg.data } : prev
            );
            break;
        }
      } catch {
        // Ignore parse errors
      }
    };
  }, []);

  // Fetch initial state via REST (primary source in demo mode, fallback otherwise)
  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((data) => {
        if (!state) setState(data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (IS_DEMO) return; // Skip WebSocket entirely in demo mode
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return (
    <WSContext.Provider value={{ state, connected, activities }}>
      {children}
    </WSContext.Provider>
  );
}

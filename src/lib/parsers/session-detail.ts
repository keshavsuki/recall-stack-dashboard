import { parseHistory } from "./history";
import { parseSessions } from "./sessions";
import type { Session, HistoryEntry } from "../types";

export interface TimelineEvent {
  timestamp: number;
  type: "command" | "start" | "end";
  description: string;
}

export interface SessionDetail {
  session: Session;
  history: HistoryEntry[];
  timeline: TimelineEvent[];
  commandCount: number;
  durationMs: number;
  firstActivity: number;
  lastActivity: number;
}

export function getSessionDetail(sessionId: string): SessionDetail | null {
  const sessions = parseSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return null;

  const allHistory = parseHistory(2000);
  const history = allHistory.filter((h) => h.sessionId === sessionId);

  const timeline: TimelineEvent[] = [];

  // Session start
  timeline.push({
    timestamp: session.startedAt,
    type: "start",
    description: `Session started in ${session.cwd || "unknown directory"}`,
  });

  // History entries as commands
  for (const entry of history) {
    timeline.push({
      timestamp: entry.timestamp,
      type: "command",
      description: entry.display,
    });
  }

  timeline.sort((a, b) => a.timestamp - b.timestamp);

  const timestamps = [session.startedAt, ...history.map((h) => h.timestamp)].filter(Boolean);
  const firstActivity = Math.min(...timestamps);
  const lastActivity = Math.max(...timestamps);

  return {
    session,
    history,
    timeline,
    commandCount: history.length,
    durationMs: lastActivity - firstActivity,
    firstActivity,
    lastActivity,
  };
}

export function getAllSessionDetails(): SessionDetail[] {
  const sessions = parseSessions();
  const details: SessionDetail[] = [];

  for (const session of sessions) {
    const detail = getSessionDetail(session.sessionId);
    if (detail) details.push(detail);
  }

  return details.sort((a, b) => b.session.startedAt - a.session.startedAt);
}

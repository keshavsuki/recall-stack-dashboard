import { parseHistory } from "./history";
import { parseSessions } from "./sessions";
import { parseLessons } from "./lessons";

export interface DayBucket {
  date: string;
  commands: number;
  sessions: number;
  lessons: number;
}

export interface TrendData {
  days: DayBucket[];
  commandsPerDay: number[];
  sessionsPerDay: number[];
  lessonsPerDay: number[];
  labels: string[];
}

function toDateKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function buildTrends(windowDays = 14): TrendData {
  const history = parseHistory(2000);
  const sessions = parseSessions();
  const lessons = parseLessons();

  const dateRange = lastNDays(windowDays);
  const buckets: Record<string, DayBucket> = {};

  for (const date of dateRange) {
    buckets[date] = { date, commands: 0, sessions: 0, lessons: 0 };
  }

  for (const entry of history) {
    const key = toDateKey(entry.timestamp);
    if (buckets[key]) buckets[key].commands += 1;
  }

  for (const session of sessions) {
    const key = toDateKey(session.startedAt);
    if (buckets[key]) buckets[key].sessions += 1;
  }

  for (const lesson of lessons) {
    if (lesson.date && buckets[lesson.date]) {
      buckets[lesson.date].lessons += 1;
    }
  }

  const days = dateRange.map((d) => buckets[d]);

  return {
    days,
    commandsPerDay: days.map((d) => d.commands),
    sessionsPerDay: days.map((d) => d.sessions),
    lessonsPerDay: days.map((d) => d.lessons),
    labels: days.map((d) => d.date.slice(5)), // MM-DD
  };
}

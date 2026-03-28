export interface Gate {
  name: string;
  tool: string;
  pattern: string;
  level: "block" | "warn";
  message: string;
  enabled: boolean;
  auto?: boolean;
}

export interface GatesFile {
  version: number;
  description: string;
  gates: Gate[];
}

export interface Failure {
  count: number;
  rule: string;
  mistake: string;
  promoted: boolean;
}

export interface FailureMap {
  failures: Record<string, Failure>;
}

export interface Lesson {
  date: string;
  mistake: string;
  rule: string;
  source: string;
  failureCount: number;
  promoted: boolean;
}

export interface Session {
  pid: number;
  sessionId: string;
  cwd: string;
  startedAt: number;
  kind: string;
  entrypoint: string;
}

export interface HistoryEntry {
  display: string;
  timestamp: number;
  project: string;
  sessionId: string;
}

export interface PrimerState {
  raw: string;
  sections: Record<string, string>;
  lastModified: number;
}

export interface HealthStatus {
  watcherActive: boolean;
  hindsightAvailable: boolean;
  activeSessions: number;
  filesWatched: string[];
  lastActivity: number;
}

export interface DashboardState {
  primer: PrimerState;
  gates: GatesFile;
  failures: FailureMap;
  lessons: Lesson[];
  sessions: Session[];
  recentHistory: HistoryEntry[];
  health: HealthStatus;
  claudeMd: string;
  hindsightPatterns: string[];
}

export interface ActivityItem {
  id: string;
  type: "command" | "gate" | "session" | "file" | "system";
  description: string;
  timestamp: number;
  detail?: string;
  level?: "info" | "warn" | "block";
}

export type WSEvent =
  | { type: "snapshot"; data: DashboardState }
  | { type: "primer:updated"; data: PrimerState }
  | { type: "gates:updated"; data: GatesFile }
  | { type: "failures:updated"; data: FailureMap }
  | { type: "session:started"; data: Session }
  | { type: "session:ended"; data: Session }
  | { type: "history:appended"; data: HistoryEntry[] }
  | { type: "activity"; data: ActivityItem }
  | { type: "health:status"; data: HealthStatus };

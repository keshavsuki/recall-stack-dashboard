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
  decisions: Decision[];
  costs: CostSummary;
  trends: TrendData;
  agents: AgentRole[];
  repos: RepoSummary[];
  sessionDetails: SessionDetail[];
  gateTriggers: GateTrigger[];
}

export interface ActivityItem {
  id: string;
  type: "command" | "gate" | "session" | "file" | "system";
  description: string;
  timestamp: number;
  detail?: string;
  level?: "info" | "warn" | "block";
}

export interface Decision {
  id: string;
  timestamp: number;
  description: string;
  agent: string;
  reason: string;
  tokenCost: number;
  outcome: "success" | "blocked" | "reverted" | "pending";
}

export interface UsageEntry {
  date: string;
  sessionId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface CostSummary {
  entries: UsageEntry[];
  totalCost: number;
  dailyBreakdown: { date: string; cost: number }[];
  modelBreakdown: { model: string; cost: number; tokens: number }[];
}

export interface TrendData {
  sessionsPerDay: { date: string; count: number }[];
  gatesPerDay: { date: string; count: number }[];
  lessonsCumulative: { date: string; total: number }[];
  topCommands: { command: string; count: number }[];
}

export interface AgentRole {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: "active" | "idle";
  recentActions: string[];
  totalActions: number;
  lastActive: number;
}

export interface RepoSummary {
  name: string;
  path: string;
  lastActivity: number;
  commandCount: number;
  activeGates: number;
  hasClaudeMd: boolean;
  hasAgentsMd: boolean;
}

export interface SessionDetail extends Session {
  duration: number;
  commandCount: number;
  filesChanged: string[];
  timeline: SessionEvent[];
  status: "active" | "ended";
}

export interface SessionEvent {
  timestamp: number;
  type: "command" | "file" | "gate";
  description: string;
  detail?: string;
}

export interface GateTrigger {
  id: string;
  timestamp: number;
  gateName: string;
  blocked: string;
  toolCall: string;
  level: "block" | "warn";
}

export interface AppNotification {
  id: string;
  timestamp: number;
  type: "gate_block" | "lesson_promoted" | "session_start" | "session_end" | "system";
  title: string;
  message: string;
  read: boolean;
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
  | { type: "health:status"; data: HealthStatus }
  | { type: "decisions:updated"; data: Decision[] }
  | { type: "costs:updated"; data: CostSummary }
  | { type: "triggers:updated"; data: GateTrigger[] };

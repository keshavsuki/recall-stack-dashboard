import { parsePrimer } from "./parsers/primer";
import { parseGates } from "./parsers/gates";
import { parseLessons, parseFailures } from "./parsers/lessons";
import { parseHistory } from "./parsers/history";
import { parseSessions } from "./parsers/sessions";
import { fileExists } from "./config";
import type { DashboardState, HealthStatus } from "./types";

let state: DashboardState | null = null;

export function buildHealth(): HealthStatus {
  const sessions = parseSessions();
  const now = Date.now();
  const activeSessions = sessions.filter(
    (s) => now - s.startedAt < 24 * 60 * 60 * 1000
  );

  return {
    watcherActive: true,
    hindsightAvailable: false,
    activeSessions: activeSessions.length,
    filesWatched: [
      "primer.md",
      "gates.json",
      "CLAUDE.md",
      "settings.json",
      "sessions/",
      "history.jsonl",
    ].filter((f) => fileExists(f.replace("/", ""))),
    lastActivity: Date.now(),
  };
}

export function getState(): DashboardState {
  if (!state) {
    state = buildState();
  }
  return state;
}

export function buildState(): DashboardState {
  state = {
    primer: parsePrimer(),
    gates: parseGates(),
    failures: parseFailures(),
    lessons: parseLessons(),
    sessions: parseSessions(),
    recentHistory: parseHistory(200),
    health: buildHealth(),
    claudeMd: "",
    hindsightPatterns: [],
  };

  // Load CLAUDE.md
  try {
    const { resolveFile, fileExists } = require("./config");
    if (fileExists("CLAUDE.md")) {
      const fs = require("fs");
      state.claudeMd = fs.readFileSync(resolveFile("CLAUDE.md"), "utf-8");
    }
  } catch {
    // Ignore
  }

  return state;
}

export function updatePrimer() {
  const primer = parsePrimer();
  if (state) state.primer = primer;
  return primer;
}

export function updateGates() {
  const gates = parseGates();
  if (state) state.gates = gates;
  return gates;
}

export function updateFailures() {
  const failures = parseFailures();
  if (state) state.failures = failures;
  return failures;
}

export function updateLessons() {
  const lessons = parseLessons();
  if (state) state.lessons = lessons;
  return lessons;
}

export function updateSessions() {
  const sessions = parseSessions();
  if (state) state.sessions = sessions;
  return sessions;
}

export function updateHealth(hindsightAvailable: boolean) {
  const health = buildHealth();
  health.hindsightAvailable = hindsightAvailable;
  if (state) state.health = health;
  return health;
}

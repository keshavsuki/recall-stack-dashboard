import type {
  DashboardState,
  GatesFile,
  FailureMap,
  Lesson,
  Session,
  HistoryEntry,
  PrimerState,
  HealthStatus,
  ActivityItem,
} from "./types";

const now = Date.now();
const hours = (n: number) => now - n * 3600_000;
const mins = (n: number) => now - n * 60_000;

// --- Gates ---
const demoGates: GatesFile = {
  version: 2,
  description: "Recall Stack safety gates",
  gates: [
    {
      name: "no-force-push",
      tool: "Bash",
      pattern: "git\\s+push\\s+--force|git\\s+push\\s+-f",
      level: "block",
      message: "Force push is destructive. Use --force-with-lease or rebase instead.",
      enabled: true,
    },
    {
      name: "no-credentials-in-output",
      tool: "Write",
      pattern: "(sk-[a-zA-Z0-9]{20,}|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]{36})",
      level: "block",
      message: "Credential pattern detected in file write. Remove secrets before writing.",
      enabled: true,
    },
    {
      name: "no-em-dashes",
      tool: "Write",
      pattern: "\u2014",
      level: "warn",
      message: "Use colon, period, or line break instead of em dashes.",
      enabled: true,
      auto: true,
    },
    {
      name: "no-destructive-git",
      tool: "Bash",
      pattern: "git\\s+(reset\\s+--hard|clean\\s+-f|checkout\\s+\\.)",
      level: "block",
      message: "Destructive git operation. Consider a safer alternative.",
      enabled: true,
    },
    {
      name: "no-sudo-install",
      tool: "Bash",
      pattern: "sudo\\s+(apt|yum|dnf|pacman)\\s+install",
      level: "warn",
      message: "System package install detected. Prefer containerized dependencies.",
      enabled: true,
      auto: true,
    },
    {
      name: "no-env-commit",
      tool: "Bash",
      pattern: "git\\s+add\\s+.*\\.env",
      level: "block",
      message: "Never commit .env files. Add to .gitignore instead.",
      enabled: true,
    },
  ],
};

// --- Failures ---
const demoFailures: FailureMap = {
  failures: {
    "no-em-dashes": {
      count: 7,
      rule: "Use colon, period, or line break instead of em dashes",
      mistake: "Used em dash in README.md content",
      promoted: true,
    },
    "no-force-push": {
      count: 2,
      rule: "Never force push. Use --force-with-lease",
      mistake: "Attempted git push --force on feature branch",
      promoted: false,
    },
    "no-credentials-in-output": {
      count: 4,
      rule: "Never include API keys or tokens in file output",
      mistake: "Included OpenAI API key in config.ts",
      promoted: true,
    },
    "require-test-before-commit": {
      count: 3,
      rule: "Run tests before committing changes",
      mistake: "Committed broken migration without running test suite",
      promoted: false,
    },
    "prefer-edit-over-write": {
      count: 5,
      rule: "Use Edit tool for modifications, Write only for new files",
      mistake: "Overwrote existing file instead of using targeted edit",
      promoted: true,
    },
    "no-lazy-fixes": {
      count: 2,
      rule: "Find root causes, not temporary workarounds",
      mistake: "Added try-catch to suppress error instead of fixing the null reference",
      promoted: false,
    },
    "verify-paths": {
      count: 1,
      rule: "Verify file paths exist before operating on them",
      mistake: "Wrote to non-existent directory without checking",
      promoted: false,
    },
    "no-env-commit": {
      count: 3,
      rule: "Never stage .env files for commit",
      mistake: "Ran git add . which included .env.local",
      promoted: false,
    },
  },
};

// --- Lessons ---
const demoLessons: Lesson[] = [
  {
    date: "2026-03-28",
    mistake: "Used em dash in blog post draft",
    rule: "Replace em dashes with colon, period, or line break. User strongly prefers this style.",
    source: "user correction",
    failureCount: 7,
    promoted: true,
  },
  {
    date: "2026-03-27",
    mistake: "Included OpenAI API key in generated config file",
    rule: "Scan all output for credential patterns (sk-, AKIA, ghp_, etc.) before writing files.",
    source: "gate: no-credentials-in-output",
    failureCount: 4,
    promoted: true,
  },
  {
    date: "2026-03-27",
    mistake: "Overwrote entire component file when only changing one function",
    rule: "Always use Edit tool for existing files. Write tool only for new files.",
    source: "user correction",
    failureCount: 5,
    promoted: true,
  },
  {
    date: "2026-03-26",
    mistake: "Attempted git push --force on shared branch",
    rule: "Never force push. Use --force-with-lease or interactive rebase.",
    source: "gate: no-force-push",
    failureCount: 2,
    promoted: false,
  },
  {
    date: "2026-03-26",
    mistake: "Committed migration without running tests",
    rule: "Always run the test suite before committing. Verify correctness.",
    source: "user correction",
    failureCount: 3,
    promoted: false,
  },
  {
    date: "2026-03-25",
    mistake: "Added try-catch to suppress TypeError instead of fixing null reference",
    rule: "Find root causes. No band-aid fixes. Trace the actual bug.",
    source: "user correction",
    failureCount: 2,
    promoted: false,
  },
  {
    date: "2026-03-25",
    mistake: "Ran git add . which staged .env.local with database credentials",
    rule: "Never use git add . or git add -A. Stage specific files by name.",
    source: "gate: no-env-commit",
    failureCount: 3,
    promoted: false,
  },
  {
    date: "2026-03-24",
    mistake: "Wrote to /src/utils/helpers.ts which did not exist",
    rule: "Verify target directory and file existence before write operations.",
    source: "runtime error",
    failureCount: 1,
    promoted: false,
  },
  {
    date: "2026-03-23",
    mistake: "Asked 'should I proceed with the refactor?' mid-task",
    rule: "Never ask permission. Execute immediately. Only stop on actual errors.",
    source: "user correction",
    failureCount: 6,
    promoted: true,
  },
  {
    date: "2026-03-22",
    mistake: "Generated a 50-line response explaining what would be changed before making changes",
    rule: "Action first, explanation second. Be terse and direct.",
    source: "user correction",
    failureCount: 4,
    promoted: true,
  },
];

// --- Activity Items ---
const demoActivityItems: ActivityItem[] = [
  {
    id: "act-001",
    type: "command",
    description: "committed: fix auth middleware token validation",
    timestamp: mins(2),
    detail: "3 files changed, 47 insertions(+), 12 deletions(-)",
    level: "info",
  },
  {
    id: "act-002",
    type: "gate",
    description: "BLOCKED: credential pattern detected in Write to config/api.ts",
    timestamp: mins(5),
    detail: "Gate: no-credentials-in-output matched sk-proj-... pattern",
    level: "block",
  },
  {
    id: "act-003",
    type: "file",
    description: "primer.md updated: active project changed to recall-stack-dashboard",
    timestamp: mins(8),
    level: "info",
  },
  {
    id: "act-004",
    type: "command",
    description: "npm run test -- --watch src/lib/auth.test.ts",
    timestamp: mins(12),
    detail: "Tests: 14 passed, 0 failed",
    level: "info",
  },
  {
    id: "act-005",
    type: "gate",
    description: "WARN: em dash detected in Write to docs/setup.md",
    timestamp: mins(18),
    detail: "Gate: no-em-dashes (auto-promoted to AGENTS.md)",
    level: "warn",
  },
  {
    id: "act-006",
    type: "session",
    description: "Session started: recall-stack-dashboard (pid 48291)",
    timestamp: mins(25),
    level: "info",
  },
  {
    id: "act-007",
    type: "command",
    description: "committed: add Vercel deployment config and demo mode",
    timestamp: mins(32),
    detail: "5 files changed, 280 insertions(+)",
    level: "info",
  },
  {
    id: "act-008",
    type: "gate",
    description: "BLOCKED: git push --force intercepted",
    timestamp: mins(45),
    detail: "Gate: no-force-push. Suggested --force-with-lease instead.",
    level: "block",
  },
  {
    id: "act-009",
    type: "file",
    description: "gates.json modified: added no-sudo-install gate",
    timestamp: mins(55),
    level: "info",
  },
  {
    id: "act-010",
    type: "command",
    description: "git diff HEAD~3 --stat",
    timestamp: hours(1.2),
    detail: "Reviewing recent changes across 12 files",
    level: "info",
  },
  {
    id: "act-011",
    type: "system",
    description: "Hindsight: indexed 3 new conversation segments",
    timestamp: hours(1.5),
    level: "info",
  },
  {
    id: "act-012",
    type: "gate",
    description: "BLOCKED: git add . would have staged .env.local",
    timestamp: hours(2),
    detail: "Gate: no-env-commit. Staged specific files instead.",
    level: "block",
  },
  {
    id: "act-013",
    type: "session",
    description: "Session started: api-server refactor (pid 47832)",
    timestamp: hours(2.5),
    level: "info",
  },
  {
    id: "act-014",
    type: "command",
    description: "committed: refactor database connection pooling",
    timestamp: hours(3),
    detail: "2 files changed, 89 insertions(+), 134 deletions(-)",
    level: "info",
  },
  {
    id: "act-015",
    type: "file",
    description: "AGENTS.md updated: promoted 'no-em-dashes' to LEARNED",
    timestamp: hours(3.5),
    level: "info",
  },
  {
    id: "act-016",
    type: "command",
    description: "docker compose up -d --build api",
    timestamp: hours(4),
    detail: "Container rebuilt and started in 12s",
    level: "info",
  },
  {
    id: "act-017",
    type: "gate",
    description: "WARN: sudo apt install detected",
    timestamp: hours(5),
    detail: "Gate: no-sudo-install. Switched to Docker-based dependency.",
    level: "warn",
  },
  {
    id: "act-018",
    type: "session",
    description: "Session ended: api-server refactor (pid 47832, 2h 31m)",
    timestamp: hours(5),
    level: "info",
  },
  {
    id: "act-019",
    type: "system",
    description: "Recall Stack watcher started, monitoring 6 files",
    timestamp: hours(6),
    level: "info",
  },
  {
    id: "act-020",
    type: "command",
    description: "committed: initial Recall Stack dashboard scaffolding",
    timestamp: hours(8),
    detail: "18 files changed, 1,240 insertions(+)",
    level: "info",
  },
];

// --- History ---
const demoHistory: HistoryEntry[] = [
  {
    display: "Edit src/lib/auth.ts",
    timestamp: mins(3),
    project: "api-server",
    sessionId: "ses-001",
  },
  {
    display: "Bash: npm run test",
    timestamp: mins(12),
    project: "api-server",
    sessionId: "ses-001",
  },
  {
    display: "Write src/middleware/validate.ts",
    timestamp: mins(15),
    project: "api-server",
    sessionId: "ses-001",
  },
  {
    display: "Bash: git commit -m 'fix auth middleware'",
    timestamp: mins(20),
    project: "api-server",
    sessionId: "ses-001",
  },
  {
    display: "Read src/config/api.ts",
    timestamp: mins(25),
    project: "api-server",
    sessionId: "ses-001",
  },
  {
    display: "Edit src/components/Dashboard.tsx",
    timestamp: mins(35),
    project: "recall-stack-dashboard",
    sessionId: "ses-002",
  },
  {
    display: "Bash: npm run dev",
    timestamp: mins(40),
    project: "recall-stack-dashboard",
    sessionId: "ses-002",
  },
  {
    display: "Write src/lib/demo-data.ts",
    timestamp: mins(45),
    project: "recall-stack-dashboard",
    sessionId: "ses-002",
  },
  {
    display: "Edit next.config.ts",
    timestamp: mins(50),
    project: "recall-stack-dashboard",
    sessionId: "ses-002",
  },
  {
    display: "Bash: git push origin feature/demo-mode",
    timestamp: mins(55),
    project: "recall-stack-dashboard",
    sessionId: "ses-002",
  },
  {
    display: "Bash: docker compose logs api --tail 50",
    timestamp: hours(1),
    project: "api-server",
    sessionId: "ses-003",
  },
  {
    display: "Edit src/db/pool.ts",
    timestamp: hours(1.5),
    project: "api-server",
    sessionId: "ses-003",
  },
  {
    display: "Bash: psql -c 'SELECT count(*) FROM connections'",
    timestamp: hours(2),
    project: "api-server",
    sessionId: "ses-003",
  },
  {
    display: "Edit docker-compose.yml",
    timestamp: hours(2.5),
    project: "api-server",
    sessionId: "ses-003",
  },
  {
    display: "Bash: git commit -m 'refactor connection pooling'",
    timestamp: hours(3),
    project: "api-server",
    sessionId: "ses-003",
  },
];

// --- Sessions ---
const demoSessions: Session[] = [
  {
    pid: 48291,
    sessionId: "ses-001",
    cwd: "/home/dev/projects/api-server",
    startedAt: mins(25),
    kind: "interactive",
    entrypoint: "claude",
  },
  {
    pid: 48150,
    sessionId: "ses-002",
    cwd: "/home/dev/projects/recall-stack-dashboard",
    startedAt: hours(1),
    kind: "interactive",
    entrypoint: "claude",
  },
  {
    pid: 47832,
    sessionId: "ses-003",
    cwd: "/home/dev/projects/api-server",
    startedAt: hours(5),
    kind: "interactive",
    entrypoint: "claude",
  },
];

// --- Primer ---
const demoPrimer: PrimerState = {
  raw: `# Active Project: Recall Stack Dashboard

## Current Focus
Building the Recall Stack monitoring dashboard. Next.js app that visualizes
gates, lessons, sessions, and activity in real time.

## What Was Completed
- Gate enforcement engine with 6 active rules
- Failure tracking with auto-promotion at threshold (5 failures)
- WebSocket live updates from file watcher
- Activity feed with command, gate, session, and file events
- Hindsight integration for semantic pattern recall

## Exact Next Step
Deploy to Vercel with demo mode for public showcase.
Demo mode serves sample data, skips filesystem reads and WebSocket.

## Open Blockers
- None. Demo data module is the last piece before deploy.

## Key Info
- Repo: recall-stack-dashboard
- Stack: Next.js 15, TypeScript, Tailwind, shadcn/ui
- Local dev: reads from ~/.claude/ via chokidar watcher
- Production: Vercel serverless with DEMO_MODE=true
`,
  sections: {
    "Active Project": "Recall Stack Dashboard",
    "Current Focus":
      "Building the Recall Stack monitoring dashboard. Next.js app that visualizes gates, lessons, sessions, and activity in real time.",
    "What Was Completed":
      "Gate enforcement engine, failure tracking, WebSocket live updates, activity feed, Hindsight integration",
    "Exact Next Step":
      "Deploy to Vercel with demo mode for public showcase.",
    "Open Blockers": "None. Demo data module is the last piece before deploy.",
    "Key Info":
      "Next.js 15, TypeScript, Tailwind, shadcn/ui. Vercel serverless with DEMO_MODE=true.",
  },
  lastModified: mins(8),
};

// --- CLAUDE.md ---
const demoClaudeMd = `# CLAUDE.md

## Session Start
1. Read AGENTS.md LEARNED section before touching anything
2. Check memory/ daily logs for context
3. One clarifying question upfront if ambiguous

## Conventions
- No em dashes. Use colon, period, or line break
- Never expose real paths in public content
- Prefer Edit over Write for existing files
- Run tests before committing

## LEARNED
- No em dashes anywhere (promoted from 7 failures)
- Never include credentials in output (promoted from 4 failures)
- Always use Edit for existing files (promoted from 5 failures)
- Never ask permission mid-task. Execute immediately
- Action first, explanation second. Be terse and direct
`;

// --- Health ---
const demoHealth: HealthStatus = {
  watcherActive: true,
  hindsightAvailable: true,
  activeSessions: 3,
  filesWatched: [
    "primer.md",
    "gates.json",
    "CLAUDE.md",
    "settings.json",
    "sessions/",
    "history.jsonl",
  ],
  lastActivity: mins(2),
};

// --- Hindsight Patterns ---
const demoHindsightPatterns = [
  "Auth middleware should validate JWT expiry before checking permissions",
  "Database connection pool size should match max concurrent requests",
  "Always run migrations in a transaction for rollback safety",
  "Prefer parameterized queries over string interpolation for SQL",
  "Cache invalidation should be event-driven, not time-based",
];

// --- Full Dashboard State ---
export const demoDashboardState: DashboardState = {
  primer: demoPrimer,
  gates: demoGates,
  failures: demoFailures,
  lessons: demoLessons,
  sessions: demoSessions,
  recentHistory: demoHistory,
  health: demoHealth,
  claudeMd: demoClaudeMd,
  hindsightPatterns: demoHindsightPatterns,
};

export const demoActivities = demoActivityItems;

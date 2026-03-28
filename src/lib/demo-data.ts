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
  Decision,
  UsageEntry,
  CostSummary,
  TrendData,
  AgentRole,
  RepoSummary,
  SessionDetail,
  SessionEvent,
  GateTrigger,
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

// --- Decisions ---
const days = (n: number) => now - n * 86_400_000;

const demoDecisions: Decision[] = [
  { id: "dec-001", timestamp: mins(3), description: "Rewrote auth middleware token validation", agent: "Execution", reason: "JWT expiry check was missing, allowing stale tokens through", tokenCost: 4200, outcome: "success" },
  { id: "dec-002", timestamp: mins(8), description: "Blocked credential write to config/api.ts", agent: "Guard", reason: "Detected sk-proj- pattern in file output", tokenCost: 180, outcome: "blocked" },
  { id: "dec-003", timestamp: mins(20), description: "Searched codebase for all usages of deprecated auth helper", agent: "Research", reason: "Need full impact analysis before removing old auth util", tokenCost: 8900, outcome: "success" },
  { id: "dec-004", timestamp: mins(35), description: "Updated primer.md with current project state", agent: "Memory", reason: "Session context shifted to recall-stack-dashboard", tokenCost: 620, outcome: "success" },
  { id: "dec-005", timestamp: mins(50), description: "Generated deployment config for Vercel", agent: "Execution", reason: "Demo mode needs DEMO_MODE=true env var and static export", tokenCost: 3100, outcome: "success" },
  { id: "dec-006", timestamp: hours(1.2), description: "Blocked force push to feature branch", agent: "Guard", reason: "Gate no-force-push triggered on git push --force", tokenCost: 100, outcome: "blocked" },
  { id: "dec-007", timestamp: hours(1.5), description: "Indexed 3 new Hindsight conversation segments", agent: "Memory", reason: "New patterns detected in auth refactor discussion", tokenCost: 2400, outcome: "success" },
  { id: "dec-008", timestamp: hours(2), description: "Blocked git add . that would stage .env.local", agent: "Guard", reason: "Gate no-env-commit matched .env pattern in staged files", tokenCost: 150, outcome: "blocked" },
  { id: "dec-009", timestamp: hours(2.5), description: "Analyzed database connection pool sizing", agent: "Research", reason: "Pool exhaustion errors in production logs needed root cause analysis", tokenCost: 12300, outcome: "success" },
  { id: "dec-010", timestamp: hours(3), description: "Refactored connection pooling from 5 to 20 max connections", agent: "Execution", reason: "Analysis showed concurrent request peak of 18, pool was bottleneck", tokenCost: 5600, outcome: "success" },
  { id: "dec-011", timestamp: hours(3.5), description: "Promoted no-em-dashes rule to AGENTS.md LEARNED", agent: "Memory", reason: "Failure count reached threshold of 7", tokenCost: 340, outcome: "success" },
  { id: "dec-012", timestamp: hours(4), description: "Rebuilt API container with new pool config", agent: "Execution", reason: "Docker compose rebuild needed after pool.ts changes", tokenCost: 1800, outcome: "success" },
  { id: "dec-013", timestamp: hours(5), description: "Warned about sudo apt install usage", agent: "Guard", reason: "Gate no-sudo-install prefers containerized dependencies", tokenCost: 120, outcome: "blocked" },
  { id: "dec-014", timestamp: hours(6), description: "Generated daily summary report for memory/daily/", agent: "Reporting", reason: "End of session summary with key decisions and outcomes", tokenCost: 2100, outcome: "success" },
  { id: "dec-015", timestamp: hours(8), description: "Scaffolded initial dashboard project structure", agent: "Execution", reason: "New project init with Next.js 15, Tailwind, shadcn/ui", tokenCost: 15000, outcome: "success" },
  { id: "dec-016", timestamp: days(1), description: "Reverted migration that broke user table constraints", agent: "Execution", reason: "Migration removed NOT NULL on email column, caught by tests", tokenCost: 3200, outcome: "reverted" },
  { id: "dec-017", timestamp: days(1) + hours(2), description: "Researched WebSocket vs SSE for live dashboard updates", agent: "Research", reason: "Need bidirectional communication for gate acknowledgment", tokenCost: 7400, outcome: "success" },
  { id: "dec-018", timestamp: days(1) + hours(4), description: "Wrote chokidar file watcher for .claude/ directory", agent: "Execution", reason: "Dashboard needs real-time updates when gates/lessons change", tokenCost: 6800, outcome: "success" },
  { id: "dec-019", timestamp: days(2), description: "Blocked write containing AWS access key", agent: "Guard", reason: "AKIA pattern detected in deployment script output", tokenCost: 130, outcome: "blocked" },
  { id: "dec-020", timestamp: days(2) + hours(3), description: "Updated MEMORY.md with new project references", agent: "Memory", reason: "recall-stack-dashboard added to active projects index", tokenCost: 480, outcome: "success" },
  { id: "dec-021", timestamp: days(3), description: "Pending: evaluate Drizzle ORM for data layer", agent: "Research", reason: "Current raw SQL approach does not scale well with new tables", tokenCost: 9200, outcome: "pending" },
  { id: "dec-022", timestamp: days(4), description: "Fixed null reference in session cleanup routine", agent: "Execution", reason: "Process exit handler was not checking for undefined session map", tokenCost: 2800, outcome: "success" },
  { id: "dec-023", timestamp: days(5), description: "Generated API documentation from route handlers", agent: "Reporting", reason: "OpenAPI spec needed for client SDK generation", tokenCost: 11000, outcome: "success" },
  { id: "dec-024", timestamp: days(6), description: "Blocked destructive git reset --hard", agent: "Guard", reason: "Gate no-destructive-git prevented loss of uncommitted work", tokenCost: 110, outcome: "blocked" },
  { id: "dec-025", timestamp: days(7), description: "Archived old daily logs older than 14 days", agent: "Memory", reason: "Memory hygiene: moved 8 daily logs to archive/", tokenCost: 560, outcome: "success" },
];

// --- Usage Entries ---
const demoUsageEntries: UsageEntry[] = [];
const modelPricing: Record<string, { input: number; output: number }> = {
  "claude-sonnet": { input: 3 / 1_000_000, output: 15 / 1_000_000 },
  "claude-opus": { input: 15 / 1_000_000, output: 75 / 1_000_000 },
};

for (let d = 13; d >= 0; d--) {
  const date = new Date(days(d));
  const dateStr = date.toISOString().slice(0, 10);
  const sessionsToday = 2 + Math.floor(Math.random() * 3);
  for (let s = 0; s < sessionsToday; s++) {
    const model = Math.random() > 0.3 ? "claude-sonnet" : "claude-opus";
    const inputTokens = 8000 + Math.floor(Math.random() * 40000);
    const outputTokens = 2000 + Math.floor(Math.random() * 15000);
    const pricing = modelPricing[model];
    const costUsd = +(inputTokens * pricing.input + outputTokens * pricing.output).toFixed(4);
    demoUsageEntries.push({
      date: dateStr,
      sessionId: `ses-usage-${d}-${s}`,
      model,
      inputTokens,
      outputTokens,
      costUsd,
    });
  }
}

// Normalize total to ~$12.50
const rawTotal = demoUsageEntries.reduce((sum, e) => sum + e.costUsd, 0);
const scaleFactor = 12.5 / rawTotal;
for (const entry of demoUsageEntries) {
  entry.costUsd = +(entry.costUsd * scaleFactor).toFixed(4);
}

const dailyMap = new Map<string, number>();
const modelMap = new Map<string, { cost: number; tokens: number }>();
for (const entry of demoUsageEntries) {
  dailyMap.set(entry.date, (dailyMap.get(entry.date) ?? 0) + entry.costUsd);
  const existing = modelMap.get(entry.model) ?? { cost: 0, tokens: 0 };
  existing.cost += entry.costUsd;
  existing.tokens += entry.inputTokens + entry.outputTokens;
  modelMap.set(entry.model, existing);
}

const demoCosts: CostSummary = {
  entries: demoUsageEntries,
  totalCost: +demoUsageEntries.reduce((s, e) => s + e.costUsd, 0).toFixed(2),
  dailyBreakdown: Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cost]) => ({ date, cost: +cost.toFixed(4) })),
  modelBreakdown: Array.from(modelMap.entries()).map(([model, data]) => ({
    model,
    cost: +data.cost.toFixed(4),
    tokens: data.tokens,
  })),
};

// --- Trend Data ---
const trendDates: string[] = [];
for (let d = 13; d >= 0; d--) {
  trendDates.push(new Date(days(d)).toISOString().slice(0, 10));
}

const demoTrends: TrendData = {
  sessionsPerDay: trendDates.map((date) => ({
    date,
    count: 2 + Math.floor(Math.random() * 5),
  })),
  gatesPerDay: trendDates.map((date) => ({
    date,
    count: Math.floor(Math.random() * 4),
  })),
  lessonsCumulative: trendDates.map((date, i) => ({
    date,
    total: Math.min(2 + Math.floor((i / 13) * 8), 10),
  })),
  topCommands: [
    { command: "git commit", count: 47 },
    { command: "npm run test", count: 38 },
    { command: "git diff", count: 31 },
    { command: "npm run dev", count: 24 },
    { command: "docker compose up", count: 18 },
    { command: "git push", count: 15 },
    { command: "git log", count: 12 },
    { command: "psql", count: 9 },
  ],
};

// --- Agent Roles ---
const demoAgents: AgentRole[] = [
  {
    id: "agent-guard",
    name: "Guard",
    role: "Safety enforcement. Intercepts dangerous operations before execution.",
    icon: "shield",
    status: "active",
    recentActions: [
      "Blocked credential write to config/api.ts",
      "Blocked git push --force on feature branch",
      "Blocked git add . staging .env.local",
      "Warned about sudo apt install",
    ],
    totalActions: 42,
    lastActive: mins(5),
  },
  {
    id: "agent-memory",
    name: "Memory",
    role: "Context persistence. Maintains primer, daily logs, and lesson promotion.",
    icon: "brain",
    status: "active",
    recentActions: [
      "Updated primer.md with project state",
      "Indexed 3 Hindsight conversation segments",
      "Promoted no-em-dashes to LEARNED",
      "Archived 8 daily logs to archive/",
    ],
    totalActions: 89,
    lastActive: mins(8),
  },
  {
    id: "agent-research",
    name: "Research",
    role: "Deep analysis. Codebase search, impact analysis, architecture evaluation.",
    icon: "search",
    status: "idle",
    recentActions: [
      "Searched all usages of deprecated auth helper",
      "Analyzed database connection pool sizing",
      "Researched WebSocket vs SSE for live updates",
    ],
    totalActions: 31,
    lastActive: hours(1.2),
  },
  {
    id: "agent-execution",
    name: "Execution",
    role: "Code changes. Writes, edits, builds, and deploys code.",
    icon: "terminal",
    status: "active",
    recentActions: [
      "Rewrote auth middleware token validation",
      "Generated Vercel deployment config",
      "Refactored connection pooling",
      "Rebuilt API container",
      "Scaffolded dashboard project",
    ],
    totalActions: 156,
    lastActive: mins(3),
  },
  {
    id: "agent-reporting",
    name: "Reporting",
    role: "Documentation and summaries. Generates reports, specs, and daily logs.",
    icon: "file-text",
    status: "idle",
    recentActions: [
      "Generated daily summary report",
      "Generated API documentation from routes",
    ],
    totalActions: 18,
    lastActive: hours(6),
  },
];

// --- Repo Summaries ---
const demoRepos: RepoSummary[] = [
  {
    name: "api-server",
    path: "/home/dev/projects/api-server",
    lastActivity: mins(3),
    commandCount: 124,
    activeGates: 6,
    hasClaudeMd: true,
    hasAgentsMd: true,
  },
  {
    name: "recall-stack-dashboard",
    path: "/home/dev/projects/recall-stack-dashboard",
    lastActivity: mins(35),
    commandCount: 87,
    activeGates: 6,
    hasClaudeMd: true,
    hasAgentsMd: true,
  },
  {
    name: "marketing-site",
    path: "/home/dev/projects/marketing-site",
    lastActivity: days(3),
    commandCount: 34,
    activeGates: 4,
    hasClaudeMd: true,
    hasAgentsMd: false,
  },
  {
    name: "data-pipeline",
    path: "/home/dev/projects/data-pipeline",
    lastActivity: days(5),
    commandCount: 52,
    activeGates: 5,
    hasClaudeMd: true,
    hasAgentsMd: true,
  },
];

// --- Session Details ---
const demoSessionDetails: SessionDetail[] = [
  {
    pid: 48291,
    sessionId: "ses-001",
    cwd: "/home/dev/projects/api-server",
    startedAt: mins(25),
    kind: "interactive",
    entrypoint: "claude",
    duration: 25 * 60_000,
    commandCount: 8,
    filesChanged: ["src/lib/auth.ts", "src/middleware/validate.ts", "src/config/api.ts"],
    status: "active",
    timeline: [
      { timestamp: mins(25), type: "command", description: "Session started in api-server" },
      { timestamp: mins(22), type: "file", description: "Read src/lib/auth.ts", detail: "Analyzing existing auth middleware" },
      { timestamp: mins(18), type: "gate", description: "WARN: em dash in docs/setup.md", detail: "Auto-corrected to colon" },
      { timestamp: mins(15), type: "file", description: "Edit src/lib/auth.ts", detail: "Added JWT expiry validation" },
      { timestamp: mins(12), type: "command", description: "npm run test -- --watch src/lib/auth.test.ts", detail: "14 passed, 0 failed" },
      { timestamp: mins(8), type: "file", description: "Write src/middleware/validate.ts", detail: "New validation middleware" },
      { timestamp: mins(5), type: "gate", description: "BLOCKED: credential in config/api.ts", detail: "sk-proj- pattern removed" },
      { timestamp: mins(3), type: "command", description: "git commit -m 'fix auth middleware'", detail: "3 files, +47 -12" },
    ],
  },
  {
    pid: 48150,
    sessionId: "ses-002",
    cwd: "/home/dev/projects/recall-stack-dashboard",
    startedAt: hours(1),
    kind: "interactive",
    entrypoint: "claude",
    duration: 35 * 60_000,
    commandCount: 6,
    filesChanged: ["src/components/Dashboard.tsx", "src/lib/demo-data.ts", "next.config.ts", "vercel.json", ".env.example"],
    status: "ended",
    timeline: [
      { timestamp: hours(1), type: "command", description: "Session started in recall-stack-dashboard" },
      { timestamp: mins(55), type: "file", description: "Edit src/components/Dashboard.tsx", detail: "Added activity feed component" },
      { timestamp: mins(50), type: "command", description: "npm run dev", detail: "Dev server on localhost:3000" },
      { timestamp: mins(45), type: "file", description: "Write src/lib/demo-data.ts", detail: "New demo data module" },
      { timestamp: mins(42), type: "gate", description: "BLOCKED: git push --force intercepted", detail: "Suggested --force-with-lease" },
      { timestamp: mins(40), type: "file", description: "Edit next.config.ts", detail: "Added DEMO_MODE env handling" },
      { timestamp: mins(38), type: "command", description: "git commit -m 'add demo mode'", detail: "5 files, +280" },
      { timestamp: mins(35), type: "command", description: "git push origin feature/demo-mode" },
    ],
  },
  {
    pid: 47832,
    sessionId: "ses-003",
    cwd: "/home/dev/projects/api-server",
    startedAt: hours(5),
    kind: "interactive",
    entrypoint: "claude",
    duration: 151 * 60_000,
    commandCount: 10,
    filesChanged: ["src/db/pool.ts", "docker-compose.yml"],
    status: "ended",
    timeline: [
      { timestamp: hours(5), type: "command", description: "Session started in api-server" },
      { timestamp: hours(4.8), type: "command", description: "docker compose logs api --tail 50", detail: "Connection pool exhaustion errors found" },
      { timestamp: hours(4.5), type: "file", description: "Read src/db/pool.ts", detail: "Pool max was set to 5" },
      { timestamp: hours(4), type: "command", description: "psql -c 'SELECT count(*) FROM connections'", detail: "18 active connections at peak" },
      { timestamp: hours(3.5), type: "file", description: "Edit src/db/pool.ts", detail: "Increased max to 20, added idle timeout" },
      { timestamp: hours(3.2), type: "gate", description: "BLOCKED: git add . would stage .env.local", detail: "Staged specific files instead" },
      { timestamp: hours(3), type: "command", description: "git commit -m 'refactor connection pooling'", detail: "2 files, +89 -134" },
      { timestamp: hours(2.8), type: "file", description: "Edit docker-compose.yml", detail: "Updated pool env vars" },
      { timestamp: hours(2.5), type: "command", description: "docker compose up -d --build api", detail: "Rebuilt in 12s" },
      { timestamp: hours(2.3), type: "command", description: "Session ended after 2h 31m" },
    ],
  },
];

// --- Gate Triggers ---
const demoGateTriggers: GateTrigger[] = [
  { id: "gt-001", timestamp: mins(5), gateName: "no-credentials-in-output", blocked: "sk-proj-aBcDeFgHiJkLmNoPqRsT...", toolCall: "Write config/api.ts", level: "block" },
  { id: "gt-002", timestamp: mins(18), gateName: "no-em-dashes", blocked: "em dash character in paragraph", toolCall: "Write docs/setup.md", level: "warn" },
  { id: "gt-003", timestamp: mins(45), gateName: "no-force-push", blocked: "git push --force origin feature/demo-mode", toolCall: "Bash", level: "block" },
  { id: "gt-004", timestamp: hours(2), gateName: "no-env-commit", blocked: "git add . (would include .env.local)", toolCall: "Bash", level: "block" },
  { id: "gt-005", timestamp: hours(5), gateName: "no-sudo-install", blocked: "sudo apt install libpq-dev", toolCall: "Bash", level: "warn" },
  { id: "gt-006", timestamp: days(2), gateName: "no-credentials-in-output", blocked: "AKIA... AWS key in deploy script", toolCall: "Write scripts/deploy.sh", level: "block" },
  { id: "gt-007", timestamp: days(4), gateName: "no-destructive-git", blocked: "git reset --hard HEAD~3", toolCall: "Bash", level: "block" },
  { id: "gt-008", timestamp: days(6), gateName: "no-destructive-git", blocked: "git checkout . (discard all changes)", toolCall: "Bash", level: "block" },
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
  decisions: demoDecisions,
  costs: demoCosts,
  trends: demoTrends,
  agents: demoAgents,
  repos: demoRepos,
  sessionDetails: demoSessionDetails,
  gateTriggers: demoGateTriggers,
};

export const demoActivities = demoActivityItems;

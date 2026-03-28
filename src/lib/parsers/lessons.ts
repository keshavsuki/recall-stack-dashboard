import fs from "fs";
import path from "path";
import { resolveFile, fileExists, getBasePath } from "../config";
import type { Lesson, FailureMap } from "../types";

export function parseFailures(): FailureMap {
  if (!fileExists("failures.json")) {
    return { failures: {} };
  }

  try {
    const raw = fs.readFileSync(resolveFile("failures.json"), "utf-8");
    return JSON.parse(raw) as FailureMap;
  } catch {
    return { failures: {} };
  }
}

function parseLessonsFromFile(filePath: string, source: string): Lesson[] {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const lessons: Lesson[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Match: [YYYY-MM-DD] | mistake | rule
    // Also match: - [YYYY-MM-DD] | mistake | rule
    const match = line.match(
      /[-*]?\s*\[?(\d{4}-\d{2}-\d{2})\]?\s*\|\s*(.+?)\s*\|\s*(.+)/
    );
    if (match) {
      lessons.push({
        date: match[1],
        mistake: match[2].trim(),
        rule: match[3].trim(),
        source,
        failureCount: 0,
        promoted: false,
      });
    }
  }

  return lessons;
}

export function parseLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  const failures = parseFailures();

  // Parse from AGENTS.md LEARNED section (look in base path and common repo locations)
  const agentsPaths = [
    resolveFile("AGENTS.md"),
    path.join(getBasePath(), "..", "AGENTS.md"),
  ];

  for (const p of agentsPaths) {
    if (fs.existsSync(p)) {
      lessons.push(...parseLessonsFromFile(p, "AGENTS.md"));
      break;
    }
  }

  // Parse from tasks/lessons.md in projects
  const projectsDir = resolveFile("projects");
  if (fs.existsSync(projectsDir)) {
    try {
      const projects = fs.readdirSync(projectsDir);
      for (const proj of projects) {
        const lessonsFile = path.join(
          projectsDir,
          proj,
          "tasks",
          "lessons.md"
        );
        if (fs.existsSync(lessonsFile)) {
          lessons.push(...parseLessonsFromFile(lessonsFile, `${proj}/lessons.md`));
        }
      }
    } catch {
      // Permission errors, etc.
    }
  }

  // Cross-reference with failures.json
  for (const lesson of lessons) {
    const key = lesson.mistake.toLowerCase().replace(/\s+/g, "-");
    const failure = failures.failures[key];
    if (failure) {
      lesson.failureCount = failure.count;
      lesson.promoted = failure.promoted;
    }
  }

  return lessons;
}

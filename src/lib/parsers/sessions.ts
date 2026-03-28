import fs from "fs";
import path from "path";
import { resolveFile, fileExists } from "../config";
import type { Session } from "../types";

export function parseSessions(): Session[] {
  const sessionsDir = resolveFile("sessions");
  if (!fileExists("sessions") || !fs.statSync(sessionsDir).isDirectory()) {
    return [];
  }

  const sessions: Session[] = [];

  try {
    const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(sessionsDir, file), "utf-8");
        const parsed = JSON.parse(raw);
        sessions.push({
          pid: parsed.pid || 0,
          sessionId: parsed.sessionId || file.replace(".json", ""),
          cwd: parsed.cwd || "",
          startedAt: parsed.startedAt || 0,
          kind: parsed.kind || "unknown",
          entrypoint: parsed.entrypoint || "",
        });
      } catch {
        // Skip malformed
      }
    }
  } catch {
    // Permission errors
  }

  return sessions.sort((a, b) => b.startedAt - a.startedAt);
}

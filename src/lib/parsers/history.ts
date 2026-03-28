import fs from "fs";
import { resolveFile, fileExists } from "../config";
import type { HistoryEntry } from "../types";

let lastOffset = 0;

export function parseHistory(limit = 200): HistoryEntry[] {
  if (!fileExists("history.jsonl")) {
    return [];
  }

  const filePath = resolveFile("history.jsonl");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);

  // Take last N lines
  const recent = lines.slice(-limit);
  const entries: HistoryEntry[] = [];

  for (const line of recent) {
    try {
      const parsed = JSON.parse(line);
      entries.push({
        display: parsed.display || parsed.message || "",
        timestamp: parsed.timestamp || 0,
        project: parsed.project || "",
        sessionId: parsed.sessionId || "",
      });
    } catch {
      // Skip malformed lines
    }
  }

  lastOffset = content.length;
  return entries;
}

export function parseNewHistory(): HistoryEntry[] {
  if (!fileExists("history.jsonl")) {
    return [];
  }

  const filePath = resolveFile("history.jsonl");
  const stat = fs.statSync(filePath);

  if (stat.size <= lastOffset) {
    return [];
  }

  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(stat.size - lastOffset);
  fs.readSync(fd, buffer, 0, buffer.length, lastOffset);
  fs.closeSync(fd);

  lastOffset = stat.size;

  const lines = buffer.toString("utf-8").trim().split("\n").filter(Boolean);
  const entries: HistoryEntry[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      entries.push({
        display: parsed.display || parsed.message || "",
        timestamp: parsed.timestamp || 0,
        project: parsed.project || "",
        sessionId: parsed.sessionId || "",
      });
    } catch {
      // Skip
    }
  }

  return entries;
}

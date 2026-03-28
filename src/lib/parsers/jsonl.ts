import fs from "fs";
import { resolveFile, fileExists } from "../config";

export function parseJsonl<T>(filename: string, limit = 500): T[] {
  if (!fileExists(filename)) return [];
  try {
    const content = fs.readFileSync(resolveFile(filename), "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    const recent = lines.slice(-limit);
    const results: T[] = [];
    for (const line of recent) {
      try { results.push(JSON.parse(line) as T); } catch { /* skip */ }
    }
    return results;
  } catch { return []; }
}

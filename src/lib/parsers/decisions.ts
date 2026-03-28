import { parseJsonl } from "./jsonl";

export interface Decision {
  timestamp: number;
  sessionId: string;
  gate: string;
  action: "allow" | "block" | "warn";
  tool: string;
  reason?: string;
}

export function parseDecisions(limit = 500): Decision[] {
  return parseJsonl<Decision>("decisions.jsonl", limit);
}

export function recentDecisions(hours = 24): Decision[] {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return parseDecisions().filter((d) => d.timestamp >= cutoff);
}

export function decisionsByGate(): Record<string, Decision[]> {
  const all = parseDecisions();
  const grouped: Record<string, Decision[]> = {};
  for (const d of all) {
    const key = d.gate || "unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  }
  return grouped;
}

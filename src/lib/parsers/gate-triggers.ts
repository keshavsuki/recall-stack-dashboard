import { parseJsonl } from "./jsonl";

export interface GateTrigger {
  timestamp: number;
  gate: string;
  tool: string;
  action: "block" | "warn" | "allow";
  sessionId: string;
  message?: string;
}

export function parseGateTriggers(limit = 500): GateTrigger[] {
  return parseJsonl<GateTrigger>("gate-triggers.jsonl", limit);
}

export function recentGateTriggers(hours = 24): GateTrigger[] {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return parseGateTriggers().filter((t) => t.timestamp >= cutoff);
}

export function triggersByGate(): Record<string, GateTrigger[]> {
  const all = parseGateTriggers();
  const grouped: Record<string, GateTrigger[]> = {};
  for (const t of all) {
    const key = t.gate || "unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  }
  return grouped;
}

export function triggerCounts(): Record<string, number> {
  const grouped = triggersByGate();
  const counts: Record<string, number> = {};
  for (const [gate, triggers] of Object.entries(grouped)) {
    counts[gate] = triggers.length;
  }
  return counts;
}

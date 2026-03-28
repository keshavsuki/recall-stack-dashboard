import { parseJsonl } from "./jsonl";

export interface UsageEntry {
  timestamp: number;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  sessionId?: string;
}

export interface DailyUsage {
  date: string;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  entries: number;
}

export interface ModelUsage {
  model: string;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  entries: number;
}

export interface CostSummary {
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalEntries: number;
  daily: DailyUsage[];
  byModel: ModelUsage[];
}

function toDateKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function parseUsage(limit = 500): UsageEntry[] {
  return parseJsonl<UsageEntry>("usage.jsonl", limit);
}

export function aggregateUsage(entries?: UsageEntry[]): CostSummary {
  const all = entries ?? parseUsage();

  const dailyMap: Record<string, DailyUsage> = {};
  const modelMap: Record<string, ModelUsage> = {};

  let totalCost = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const e of all) {
    totalCost += e.cost || 0;
    totalInputTokens += e.inputTokens || 0;
    totalOutputTokens += e.outputTokens || 0;

    // Daily aggregation
    const dateKey = toDateKey(e.timestamp || Date.now());
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = {
        date: dateKey,
        totalCost: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        entries: 0,
      };
    }
    dailyMap[dateKey].totalCost += e.cost || 0;
    dailyMap[dateKey].totalInputTokens += e.inputTokens || 0;
    dailyMap[dateKey].totalOutputTokens += e.outputTokens || 0;
    dailyMap[dateKey].entries += 1;

    // Model aggregation
    const model = e.model || "unknown";
    if (!modelMap[model]) {
      modelMap[model] = {
        model,
        totalCost: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        entries: 0,
      };
    }
    modelMap[model].totalCost += e.cost || 0;
    modelMap[model].totalInputTokens += e.inputTokens || 0;
    modelMap[model].totalOutputTokens += e.outputTokens || 0;
    modelMap[model].entries += 1;
  }

  return {
    totalCost,
    totalInputTokens,
    totalOutputTokens,
    totalEntries: all.length,
    daily: Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)),
    byModel: Object.values(modelMap).sort((a, b) => b.totalCost - a.totalCost),
  };
}

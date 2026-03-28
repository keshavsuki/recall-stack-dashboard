"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MODEL_COLORS: Record<string, string> = {
  "claude-opus": "from-violet-500 to-purple-600",
  "claude-sonnet": "from-blue-500 to-cyan-500",
  "claude-haiku": "from-emerald-500 to-teal-500",
};

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function ModelBreakdown() {
  const { state } = useWS();

  if (!state) {
    return (
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="h-4 w-32 animate-pulse rounded-lg bg-zinc-100" />
          <div className="mt-6 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-50" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const models = state.costs.modelBreakdown;
  const maxCost = Math.max(...models.map((m) => m.cost), 0.01);

  return (
    <Card className="card-premium border-zinc-200/80 bg-white shadow-sm rounded-2xl animate-slide-up">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">Cost by Model</h3>
        {models.length > 0 ? (
          <div className="space-y-4">
            {models.map((model) => {
              const pct = (model.cost / maxCost) * 100;
              const gradient = MODEL_COLORS[model.model] || "from-zinc-400 to-zinc-500";
              return (
                <div key={model.model}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-zinc-700">{model.model}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 font-mono">{formatTokens(model.tokens)} tokens</span>
                      <span className="text-sm font-bold text-zinc-900">${model.cost.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", gradient)}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 text-center py-8">No model data available</p>
        )}
      </CardContent>
    </Card>
  );
}

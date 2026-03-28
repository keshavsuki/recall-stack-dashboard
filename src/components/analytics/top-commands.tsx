"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TopCommands() {
  const { state } = useWS();

  if (!state) {
    return (
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="h-4 w-32 animate-pulse rounded-lg bg-zinc-100" />
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-lg bg-zinc-50" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const commands = state.trends.topCommands;
  const maxCount = Math.max(...commands.map((c) => c.count), 1);

  return (
    <Card className="card-premium border-zinc-200/80 bg-white shadow-sm rounded-2xl animate-slide-up">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">Top Commands</h3>
        {commands.length > 0 ? (
          <div className="space-y-2.5">
            {commands.map((cmd, i) => {
              const pct = (cmd.count / maxCount) * 100;
              return (
                <div key={cmd.command} className="flex items-center gap-3">
                  <span className="w-5 text-right text-xs font-bold text-zinc-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-700 font-mono truncate">{cmd.command}</span>
                      <span className="text-xs font-bold text-zinc-500 ml-2">{cmd.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                        )}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 text-center py-8">No command data available</p>
        )}
      </CardContent>
    </Card>
  );
}

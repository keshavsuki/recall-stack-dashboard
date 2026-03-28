"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PromotionPipeline() {
  const { state } = useWS();

  if (!state) return null;

  // Get lessons with failure counts
  const tracked = state.lessons
    .filter((l) => l.failureCount > 0 || l.promoted)
    .sort((a, b) => b.failureCount - a.failureCount);

  if (tracked.length === 0) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-6 text-center text-sm text-zinc-600">
          No failures tracked yet. Mistakes in lessons.md auto-promote to gates
          after 3 occurrences.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-zinc-400">
        Promotion Pipeline
      </h2>
      <p className="text-xs text-zinc-600">
        lessons.md &rarr; failures.json &rarr; gates.json (at 3 occurrences)
      </p>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="space-y-3 p-4">
          {tracked.map((lesson, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">
                  {lesson.mistake}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    lesson.promoted
                      ? "text-emerald-400"
                      : lesson.failureCount >= 2
                        ? "text-amber-400"
                        : "text-zinc-500"
                  )}
                >
                  {lesson.promoted
                    ? "PROMOTED"
                    : `${lesson.failureCount}/3`}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    lesson.promoted
                      ? "bg-emerald-500"
                      : lesson.failureCount >= 2
                        ? "bg-amber-500"
                        : "bg-zinc-600"
                  )}
                  style={{
                    width: `${Math.min((lesson.failureCount / 3) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

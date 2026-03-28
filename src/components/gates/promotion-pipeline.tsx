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
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-8 text-center text-sm text-zinc-400">
          No failures tracked yet. Mistakes in lessons.md auto-promote to gates
          after 3 occurrences.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 animate-slide-up">
      <h2 className="text-sm font-semibold text-zinc-800">
        Promotion Pipeline
      </h2>
      <p className="text-xs text-zinc-400 font-medium">
        lessons.md &rarr; failures.json &rarr; gates.json (at 3 occurrences)
      </p>
      <Card className="border-zinc-200/80 bg-white shadow-sm rounded-2xl">
        <CardContent className="space-y-4 p-5">
          {tracked.map((lesson, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 font-medium">
                  {lesson.mistake}
                </span>
                <span
                  className={cn(
                    "text-xs font-bold rounded-full px-2.5 py-0.5",
                    lesson.promoted
                      ? "bg-emerald-50 text-emerald-600"
                      : lesson.failureCount >= 2
                        ? "bg-amber-50 text-amber-600"
                        : "bg-zinc-50 text-zinc-400"
                  )}
                >
                  {lesson.promoted
                    ? "PROMOTED"
                    : `${lesson.failureCount}/3`}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    lesson.promoted
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : lesson.failureCount >= 2
                        ? "bg-gradient-to-r from-amber-400 to-amber-500"
                        : "bg-gradient-to-r from-zinc-300 to-zinc-400"
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

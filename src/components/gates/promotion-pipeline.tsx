"use client";

import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";

const FUNNEL_STEPS = [
  { label: "Lessons", color: "from-zinc-200 to-zinc-300", textColor: "text-zinc-600" },
  { label: "Tracked", color: "from-amber-300 to-amber-400", textColor: "text-amber-800" },
  { label: "Gates", color: "from-emerald-400 to-emerald-500", textColor: "text-emerald-800" },
];

export function PromotionPipeline() {
  const { state } = useWS();

  if (!state) return null;

  const tracked = state.lessons
    .filter((l) => l.failureCount > 0 || l.promoted)
    .sort((a, b) => b.failureCount - a.failureCount);

  const totalLessons = state.lessons.length;
  const trackedCount = tracked.filter((l) => !l.promoted).length;
  const promotedCount = tracked.filter((l) => l.promoted).length;

  return (
    <div className="animate-slide-up">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-800">
          Promotion Pipeline
        </h2>
        <p className="mt-1 text-[11px] text-zinc-400 font-medium">
          Repeated mistakes auto-promote from lessons to gates after 3 occurrences
        </p>
      </div>

      {/* Funnel visualization */}
      <div className="mb-6 flex items-center gap-1">
        {[
          { label: "Lessons", count: totalLessons, width: "flex-[3]", color: "bg-zinc-100", text: "text-zinc-600" },
          { label: "Tracked", count: trackedCount, width: "flex-[2]", color: "bg-amber-100", text: "text-amber-700" },
          { label: "Promoted", count: promotedCount, width: "flex-[1]", color: "bg-emerald-100", text: "text-emerald-700" },
        ].map((step, i) => (
          <div
            key={step.label}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl py-3 px-4 transition-all",
              step.width,
              step.color
            )}
          >
            <span className={cn("text-xl font-extrabold tracking-tight", step.text)}>
              {step.count}
            </span>
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", step.text, "opacity-60")}>
              {step.label}
            </span>
            {i < 2 && (
              <div className="absolute -right-2 z-10 text-zinc-300">
                <svg viewBox="0 0 8 14" className="h-3.5 w-2" fill="currentColor">
                  <path d="M0 0l8 7-8 7V0z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Individual lesson progress */}
      {tracked.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center">
          <p className="text-sm text-zinc-400">
            No failures tracked yet. Repeated mistakes will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tracked.map((lesson, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 rounded-xl border bg-white px-4 py-3 transition-all",
                lesson.promoted
                  ? "border-emerald-200/60"
                  : lesson.failureCount >= 2
                    ? "border-amber-200/60"
                    : "border-zinc-100"
              )}
            >
              {/* Progress indicator */}
              <div className="flex gap-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      lesson.promoted || lesson.failureCount >= step
                        ? lesson.promoted
                          ? "bg-emerald-400"
                          : lesson.failureCount >= 2
                            ? "bg-amber-400"
                            : "bg-zinc-300"
                        : "bg-zinc-100"
                    )}
                  />
                ))}
              </div>

              {/* Mistake text */}
              <span className="flex-1 text-[13px] text-zinc-700 font-medium truncate">
                {lesson.mistake}
              </span>

              {/* Status badge */}
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold",
                  lesson.promoted
                    ? "bg-emerald-50 text-emerald-600"
                    : lesson.failureCount >= 2
                      ? "bg-amber-50 text-amber-600"
                      : "bg-zinc-50 text-zinc-400"
                )}
              >
                {lesson.promoted ? "PROMOTED" : `${lesson.failureCount}/3`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

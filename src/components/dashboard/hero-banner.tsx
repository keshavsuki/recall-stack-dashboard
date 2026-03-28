"use client";

import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";

export function HeroBanner() {
  const { state, connected } = useWS();

  const layers = state
    ? [
        !!state.claudeMd,
        !!state.primer.raw,
        state.health.filesWatched.includes("settings.json"),
        state.health.hindsightAvailable,
        state.recentHistory.length > 0,
      ].filter(Boolean).length
    : 0;

  const filesWatched = state?.health.filesWatched.length || 0;
  const sessionsToday = state?.sessions.length || 0;
  const hindsightUp = state?.health.hindsightAvailable || false;

  // Extract project name from primer if available
  const primerSections = state?.primer.sections || {};
  const projectLine =
    primerSections["Active Project"] ||
    primerSections["What Was Completed (this session)"] ||
    "";
  const projectName = projectLine
    ? projectLine.split("\n")[0].replace(/^[-#*\s]+/, "").trim().slice(0, 60)
    : "";

  return (
    <div className="relative overflow-hidden border-b border-zinc-200/60">
      {/* Mesh gradient background */}
      <div className="hero-mesh absolute inset-0" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative px-8 pb-6 pt-8">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            {/* Status chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1">
              <StatusDot active={connected} />
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wide">
                {connected ? "AGENT ACTIVE" : "CONNECTING"}
              </span>
            </div>

            {/* Hero text */}
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              <span className="text-gradient">{layers} layers</span> active
            </h1>

            {/* Subtitle */}
            <p className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Watching {filesWatched} files</span>
              <span className="text-zinc-300">|</span>
              <span>
                {sessionsToday} session{sessionsToday !== 1 ? "s" : ""} today
              </span>
              <span className="text-zinc-300">|</span>
              <span className="flex items-center gap-1.5">
                <StatusDot active={hindsightUp} />
                Hindsight {hindsightUp ? "connected" : "offline"}
              </span>
            </p>

            {/* Project context */}
            {projectName && (
              <p className="mt-1 max-w-lg text-xs text-zinc-400 font-medium">
                {projectName}
              </p>
            )}
          </div>

          {/* Decorative element: stacked layers visual */}
          <div className="hidden lg:flex flex-col items-end gap-1 pt-2 animate-float">
            {[5, 4, 3, 2, 1].map((n) => {
              const active = n <= layers;
              const widths = ["w-28", "w-32", "w-36", "w-40", "w-44"];
              return (
                <div
                  key={n}
                  className={`${widths[5 - n]} h-3 rounded-full transition-all duration-500 ${
                    active
                      ? "bg-gradient-to-r from-violet-400/60 to-blue-400/40"
                      : "bg-zinc-200/40"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

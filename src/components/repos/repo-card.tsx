"use client";

import type { RepoSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

const BORDER_COLORS = [
  "border-l-violet-400",
  "border-l-blue-400",
  "border-l-emerald-400",
  "border-l-amber-400",
];

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RepoCard({ repo, index }: { repo: RepoSummary; index: number }) {
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  return (
    <div
      className={cn(
        "card-premium rounded-2xl border border-zinc-100 border-l-4 bg-white p-5",
        borderColor
      )}
    >
      {/* Title and path */}
      <div className="mb-3">
        <h3 className="text-[14px] font-bold text-zinc-800 tracking-tight">
          {repo.name}
        </h3>
        <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-400 font-mono">
          {repo.path}
        </p>
      </div>

      {/* Last activity */}
      <div className="mb-3 text-[11px] text-zinc-400 font-medium">
        Last active {relativeTime(repo.lastActivity)}
      </div>

      {/* Stats row */}
      <div className="mb-3 flex items-center gap-4 text-[12px] text-zinc-500">
        <span className="font-medium">{repo.commandCount} commands</span>
        <span className="font-medium">{repo.activeGates} gates</span>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        {repo.hasClaudeMd && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
            CLAUDE.md
          </span>
        )}
        {repo.hasAgentsMd && (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
            AGENTS.md
          </span>
        )}
      </div>
    </div>
  );
}

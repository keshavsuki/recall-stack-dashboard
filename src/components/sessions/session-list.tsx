"use client";

import Link from "next/link";
import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";
import type { SessionDetail } from "@/lib/types";

function formatDuration(ms: number): string {
  const totalMins = Math.floor(ms / 60_000);
  if (totalMins < 60) return `${totalMins}m`;
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hours}h ${mins}m`;
}

function truncateId(id: string): string {
  return id.length > 12 ? id.slice(0, 12) + "..." : id;
}

export function SessionList() {
  const { state } = useWS();
  const sessions = state?.sessionDetails || [];

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6 text-zinc-300"
          >
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 font-medium">No sessions recorded</p>
        <p className="mt-1 text-xs text-zinc-400">
          Sessions will appear here when Claude Code is active
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 stagger-children">
      {sessions.map((session) => (
        <SessionCard key={session.sessionId} session={session} />
      ))}
    </div>
  );
}

function SessionCard({ session }: { session: SessionDetail }) {
  const isActive = session.status === "active";

  return (
    <div className="card-premium rounded-2xl border border-zinc-100 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Terminal icon */}
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isActive ? "bg-emerald-50" : "bg-zinc-50"
          )}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "h-4 w-4",
                isActive ? "text-emerald-500" : "text-zinc-400"
              )}
            >
              <path d="M4 17l6-5-6-5M12 19h8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-zinc-800 font-mono">
                {truncateId(session.sessionId)}
              </span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-zinc-100 text-zinc-400"
              )}>
                {isActive ? "ACTIVE" : "ENDED"}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium font-mono truncate block max-w-[400px]">
              {session.cwd}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[12px] text-zinc-500 mb-3">
        <span className="font-medium">{formatDuration(session.duration)}</span>
        <span className="font-medium">{session.commandCount} commands</span>
        <span className="font-medium">{session.filesChanged.length} files changed</span>
      </div>

      {/* View replay link */}
      <Link
        href={`/sessions/${session.sessionId}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-[12px] font-semibold text-violet-600 transition-colors hover:bg-violet-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-3.5 w-3.5"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        View replay
      </Link>
    </div>
  );
}

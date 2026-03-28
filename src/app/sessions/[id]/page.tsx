"use client";

import { use, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { SessionTimeline } from "@/components/sessions/session-timeline";
import type { SessionDetail } from "@/lib/types";

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => setSession(data))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex h-full flex-col">
      <Header title={`Session ${id}`} />
      <div className="flex-1 p-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          </div>
        )}

        {!loading && !session && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-zinc-500 font-medium">Session not found</p>
            <p className="mt-1 text-xs text-zinc-400">
              This session may have been archived or does not exist
            </p>
          </div>
        )}

        {!loading && session && (
          <div className="animate-slide-up">
            {/* Session info header */}
            <div className="mb-8 rounded-2xl border border-zinc-100 bg-white p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4.5 w-4.5 text-violet-500"
                  >
                    <path d="M4 17l6-5-6-5M12 19h8" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-zinc-800 font-mono">
                    {session.sessionId}
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-medium font-mono">
                    {session.cwd}
                  </p>
                </div>
                <span className={
                  session.status === "active"
                    ? "ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600"
                    : "ml-auto rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400"
                }>
                  {session.status === "active" ? "ACTIVE" : "ENDED"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-zinc-500">
                <span className="font-medium">
                  {Math.floor(session.duration / 60_000)}m duration
                </span>
                <span className="font-medium">{session.commandCount} commands</span>
                <span className="font-medium">{session.filesChanged.length} files changed</span>
              </div>
            </div>

            {/* Timeline */}
            <h3 className="mb-4 text-sm font-semibold text-zinc-800">Timeline</h3>
            <SessionTimeline events={session.timeline} />
          </div>
        )}
      </div>
    </div>
  );
}

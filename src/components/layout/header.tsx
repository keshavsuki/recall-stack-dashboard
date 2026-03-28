"use client";

import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";

export function Header({ title }: { title: string }) {
  const { state } = useWS();
  const health = state?.health;

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
      <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <StatusDot active={!!health?.watcherActive} />
          Watcher
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot active={!!health?.hindsightAvailable} />
          Hindsight
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot active={(health?.activeSessions || 0) > 0} />
          {health?.activeSessions || 0} sessions
        </div>
      </div>
    </header>
  );
}

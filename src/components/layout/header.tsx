"use client";

import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";

export function Header({ title }: { title: string }) {
  const { state } = useWS();
  const health = state?.health;

  return (
    <header className="flex items-center justify-between border-b border-zinc-200/60 bg-white/80 px-8 py-4 backdrop-blur-sm">
      <h1 className="text-lg font-bold text-zinc-900 tracking-tight">{title}</h1>
      <div className="flex items-center gap-4 text-[12px]">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <StatusDot active={!!health?.watcherActive} />
          <span className="font-medium">Watcher</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <StatusDot active={!!health?.hindsightAvailable} />
          <span className="font-medium">Hindsight</span>
        </div>
        {(health?.activeSessions || 0) > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-violet-600">
            <StatusDot active={true} />
            <span className="font-semibold">{health?.activeSessions} active</span>
          </div>
        )}
      </div>
    </header>
  );
}

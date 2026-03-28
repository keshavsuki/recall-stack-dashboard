"use client";

import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";

export function Header({ title }: { title: string }) {
  const { state } = useWS();
  const health = state?.health;

  return (
    <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white/80 px-8 py-4 backdrop-blur-sm">
      <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h1>
      <div className="flex items-center gap-5 text-[13px]">
        <div className="flex items-center gap-2 text-zinc-500">
          <StatusDot active={!!health?.watcherActive} />
          <span className="font-medium">Watcher</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <StatusDot active={!!health?.hindsightAvailable} />
          <span className="font-medium">Hindsight</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1 text-zinc-500">
          <StatusDot active={(health?.activeSessions || 0) > 0} />
          <span className="font-medium">{health?.activeSessions || 0} sessions</span>
        </div>
      </div>
    </header>
  );
}

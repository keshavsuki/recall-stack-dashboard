"use client";

import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";
import { cn } from "@/lib/utils";

interface LayerProps {
  number: number;
  name: string;
  file: string;
  type: string;
  active: boolean;
  onClick?: () => void;
}

function Layer({ number, name, file, type, active, onClick }: LayerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all",
        active
          ? "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
          : "border-zinc-800/50 bg-zinc-900/30 opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
          active
            ? "bg-gradient-to-br from-violet-600/30 to-blue-600/30 text-violet-400"
            : "bg-zinc-800 text-zinc-600"
        )}
      >
        L{number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{name}</span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
            {type}
          </span>
        </div>
        <span className="text-xs text-zinc-600">{file}</span>
      </div>
      <StatusDot active={active} />
    </button>
  );
}

export function LayerStack() {
  const { state } = useWS();

  const layers = [
    {
      number: 1,
      name: "CLAUDE.md",
      file: "~/.claude/CLAUDE.md",
      type: "permanent",
      active: !!state?.claudeMd,
    },
    {
      number: 2,
      name: "primer.md",
      file: "~/.claude/primer.md",
      type: "session",
      active: !!state?.primer.raw,
    },
    {
      number: 3,
      name: "Git Context",
      file: "hooks/session-start.sh",
      type: "injected",
      active: state?.health.filesWatched.includes("settings.json") || false,
    },
    {
      number: 4,
      name: "Hindsight",
      file: "localhost:8888",
      type: "optional",
      active: state?.health.hindsightAvailable || false,
    },
    {
      number: 5,
      name: "Knowledge Base",
      file: ".claude-memory.md",
      type: "per-repo",
      active: (state?.recentHistory.length || 0) > 0,
    },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-zinc-400">Memory Layers</h2>
      <div className="space-y-1.5">
        {layers.map((layer) => (
          <Layer key={layer.number} {...layer} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";
import { cn } from "@/lib/utils";

const LAYER_GRADIENTS = [
  "from-violet-500 to-violet-600",
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-purple-500 to-purple-600",
  "from-fuchsia-500 to-fuchsia-600",
];

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
        "flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
        active
          ? "border-zinc-200 bg-white shadow-sm card-premium"
          : "border-zinc-100 bg-zinc-50/50 opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold",
          active
            ? `bg-gradient-to-br ${LAYER_GRADIENTS[number - 1]} text-white shadow-sm`
            : "bg-zinc-100 text-zinc-400"
        )}
      >
        L{number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-800">{name}</span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
            {type}
          </span>
        </div>
        <span className="text-xs text-zinc-400">{file}</span>
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
    <div className="space-y-3 animate-slide-up">
      <h2 className="text-sm font-semibold text-zinc-800">Memory Layers</h2>
      <div className="space-y-2 stagger-children">
        {layers.map((layer) => (
          <Layer key={layer.number} {...layer} />
        ))}
      </div>
    </div>
  );
}

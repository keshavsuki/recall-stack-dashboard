"use client";

import { useWS } from "@/components/shared/ws-provider";
import { cn } from "@/lib/utils";

const LAYER_COLORS = [
  { bg: "from-violet-500 to-violet-600", light: "bg-violet-50 border-violet-200/60", text: "text-violet-600" },
  { bg: "from-blue-500 to-blue-600", light: "bg-blue-50 border-blue-200/60", text: "text-blue-600" },
  { bg: "from-indigo-500 to-indigo-600", light: "bg-indigo-50 border-indigo-200/60", text: "text-indigo-600" },
  { bg: "from-purple-500 to-purple-600", light: "bg-purple-50 border-purple-200/60", text: "text-purple-600" },
  { bg: "from-fuchsia-500 to-fuchsia-600", light: "bg-fuchsia-50 border-fuchsia-200/60", text: "text-fuchsia-600" },
];

const TYPE_LABELS: Record<string, string> = {
  permanent: "Always loaded",
  session: "Per session",
  injected: "Hook injected",
  optional: "External service",
  "per-repo": "Repository scoped",
};

interface LayerCardProps {
  number: number;
  name: string;
  file: string;
  type: string;
  active: boolean;
  onClick?: () => void;
}

function LayerCard({ number, name, file, type, active, onClick }: LayerCardProps) {
  const colors = LAYER_COLORS[number - 1];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-300 min-w-[140px]",
        active
          ? `${colors.light} shadow-sm card-premium`
          : "border-zinc-100 bg-zinc-50/30 opacity-40"
      )}
    >
      {/* Layer number badge */}
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all",
          active
            ? `bg-gradient-to-br ${colors.bg} text-white shadow-md`
            : "bg-zinc-100 text-zinc-400"
        )}
      >
        L{number}
      </div>

      {/* Name */}
      <span className={cn(
        "text-[13px] font-semibold",
        active ? "text-zinc-800" : "text-zinc-400"
      )}>
        {name}
      </span>

      {/* File path */}
      <span className="mt-0.5 text-[10px] text-zinc-400 font-mono truncate max-w-full">
        {file}
      </span>

      {/* Type label */}
      <span className={cn(
        "mt-2 text-[9px] font-semibold uppercase tracking-wider",
        active ? colors.text : "text-zinc-300"
      )}>
        {TYPE_LABELS[type] || type}
      </span>

      {/* Active indicator */}
      {active && (
        <div className={cn(
          "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white",
          `bg-gradient-to-br ${colors.bg}`
        )} />
      )}
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

  const activeCount = layers.filter((l) => l.active).length;

  return (
    <div className="animate-slide-up">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-800">Memory Layers</h2>
        <span className="text-xs text-zinc-400 font-medium">
          {activeCount}/5 active
        </span>
      </div>

      {/* Horizontal scrolling layer cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 stagger-children">
        {layers.map((layer) => (
          <LayerCard key={layer.number} {...layer} />
        ))}
      </div>

      {/* Visual stack diagram */}
      <div className="mt-6 flex flex-col items-center gap-0.5">
        {[...layers].reverse().map((layer) => {
          const colors = LAYER_COLORS[layer.number - 1];
          const widthClass = [
            "w-[65%]",
            "w-[72%]",
            "w-[79%]",
            "w-[86%]",
            "w-[93%]",
          ][5 - layer.number];

          return (
            <div
              key={layer.number}
              className={cn(
                `${widthClass} h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-500`,
                layer.active
                  ? `bg-gradient-to-r ${colors.bg} text-white/90 shadow-sm`
                  : "bg-zinc-100 text-zinc-300"
              )}
            >
              L{layer.number} {layer.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

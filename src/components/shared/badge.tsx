"use client";

import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: "block" | "warn" | "info";
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        level === "block" && "bg-red-500/20 text-red-400",
        level === "warn" && "bg-yellow-500/20 text-yellow-400",
        level === "info" && "bg-blue-500/20 text-blue-400",
        className
      )}
    >
      {level.toUpperCase()}
    </span>
  );
}

interface StatusDotProps {
  active: boolean;
  className?: string;
}

export function StatusDot({ active, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        active ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-zinc-600",
        className
      )}
    />
  );
}

interface TypeBadgeProps {
  type: "command" | "gate" | "session" | "file" | "system";
  className?: string;
}

const TYPE_COLORS = {
  command: "bg-blue-500/20 text-blue-400",
  gate: "bg-red-500/20 text-red-400",
  session: "bg-purple-500/20 text-purple-400",
  file: "bg-emerald-500/20 text-emerald-400",
  system: "bg-zinc-500/20 text-zinc-400",
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
        TYPE_COLORS[type],
        className
      )}
    >
      {type}
    </span>
  );
}

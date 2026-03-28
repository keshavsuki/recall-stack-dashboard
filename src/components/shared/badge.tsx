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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold",
        level === "block" && "bg-red-100 text-red-600",
        level === "warn" && "bg-amber-100 text-amber-600",
        level === "info" && "bg-blue-100 text-blue-600",
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
        "inline-block h-2 w-2 rounded-full transition-all duration-300",
        active ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-zinc-300",
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
  command: "bg-blue-100 text-blue-600",
  gate: "bg-red-100 text-red-600",
  session: "bg-violet-100 text-violet-600",
  file: "bg-emerald-100 text-emerald-600",
  system: "bg-zinc-100 text-zinc-500",
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        TYPE_COLORS[type],
        className
      )}
    >
      {type}
    </span>
  );
}

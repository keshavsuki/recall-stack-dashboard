"use client";

import { cn } from "@/lib/utils";

interface DivSparklineProps {
  values: number[];
  height?: number;
  color?: string;
  width?: number;
}

export function DivSparkline({
  values,
  height = 24,
  color = "bg-violet-400",
  width = 80,
}: DivSparklineProps) {
  const maxValue = Math.max(...values, 1);

  return (
    <div
      className="inline-flex items-end gap-px"
      style={{ height, width }}
    >
      {values.map((v, i) => {
        const barHeight = Math.max((v / maxValue) * height, 1);
        return (
          <div
            key={i}
            className={cn("rounded-sm opacity-80", color)}
            style={{ width: 2, height: barHeight }}
          />
        );
      })}
    </div>
  );
}

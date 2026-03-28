"use client";

import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number }[];
  maxHeight?: number;
  color?: string;
  showLabels?: boolean;
}

export function BarChart({
  data,
  maxHeight = 160,
  color = "from-violet-500 to-blue-500",
  showLabels = true,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height: maxHeight }}>
      {data.map((item, i) => {
        const heightPct = (item.value / maxValue) * 100;

        return (
          <div
            key={`${item.label}-${i}`}
            className="group flex flex-1 flex-col items-center justify-end h-full min-w-0"
          >
            {/* Value tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium text-zinc-500 mb-1">
              {item.value}
            </div>

            {/* Bar */}
            <div
              className={cn(
                "w-full min-w-[6px] max-w-[32px] rounded-t bg-gradient-to-t transition-all duration-300",
                color
              )}
              style={{ height: `${Math.max(heightPct, 2)}%` }}
            />

            {/* Label */}
            {showLabels && (
              <span className="mt-1.5 text-[9px] text-zinc-400 truncate w-full text-center">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

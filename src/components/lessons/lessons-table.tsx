"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function LessonsTable() {
  const { state } = useWS();

  if (!state || state.lessons.length === 0) {
    return (
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-8 text-center text-sm text-zinc-400">
          No lessons recorded yet. Corrections from Claude Code sessions appear
          here.
        </CardContent>
      </Card>
    );
  }

  const sorted = [...state.lessons].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  return (
    <Card className="border-zinc-200/80 bg-white shadow-sm rounded-2xl overflow-hidden animate-slide-up">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-100 hover:bg-transparent bg-zinc-50/80">
            <TableHead className="text-zinc-500 font-semibold text-xs">Date</TableHead>
            <TableHead className="text-zinc-500 font-semibold text-xs">Mistake</TableHead>
            <TableHead className="text-zinc-500 font-semibold text-xs">Rule</TableHead>
            <TableHead className="text-zinc-500 font-semibold text-xs">Source</TableHead>
            <TableHead className="text-right text-zinc-500 font-semibold text-xs">Count</TableHead>
            <TableHead className="text-zinc-500 font-semibold text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((lesson, i) => (
            <TableRow
              key={i}
              className={cn(
                "border-zinc-100/80 transition-colors duration-150",
                i % 2 === 0 ? "bg-white" : "bg-zinc-50/40",
                lesson.failureCount >= 2 && !lesson.promoted && "bg-amber-50/40",
                lesson.promoted && "bg-emerald-50/40"
              )}
            >
              <TableCell className="font-mono text-xs text-zinc-400">
                {lesson.date}
              </TableCell>
              <TableCell className="text-sm text-zinc-700 font-medium">
                {lesson.mistake}
              </TableCell>
              <TableCell className="text-sm text-zinc-500">
                {lesson.rule}
              </TableCell>
              <TableCell className="text-xs text-zinc-400">
                {lesson.source}
              </TableCell>
              <TableCell className="text-right">
                {lesson.failureCount > 0 && (
                  <span
                    className={cn(
                      "font-mono text-xs font-bold",
                      lesson.failureCount >= 3
                        ? "text-emerald-500"
                        : lesson.failureCount >= 2
                          ? "text-amber-500"
                          : "text-zinc-400"
                    )}
                  >
                    {lesson.failureCount}/3
                  </span>
                )}
              </TableCell>
              <TableCell>
                {lesson.promoted ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                    GATED
                  </span>
                ) : lesson.failureCount >= 2 ? (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-600">
                    APPROACHING
                  </span>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

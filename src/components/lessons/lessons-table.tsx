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
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-6 text-center text-sm text-zinc-600">
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
    <Card className="border-zinc-800 bg-zinc-900/50">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500">Date</TableHead>
            <TableHead className="text-zinc-500">Mistake</TableHead>
            <TableHead className="text-zinc-500">Rule</TableHead>
            <TableHead className="text-zinc-500">Source</TableHead>
            <TableHead className="text-right text-zinc-500">Count</TableHead>
            <TableHead className="text-zinc-500">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((lesson, i) => (
            <TableRow
              key={i}
              className={cn(
                "border-zinc-800/50",
                lesson.failureCount >= 2 && !lesson.promoted && "bg-amber-500/5",
                lesson.promoted && "bg-emerald-500/5"
              )}
            >
              <TableCell className="font-mono text-xs text-zinc-500">
                {lesson.date}
              </TableCell>
              <TableCell className="text-sm text-zinc-300">
                {lesson.mistake}
              </TableCell>
              <TableCell className="text-sm text-zinc-400">
                {lesson.rule}
              </TableCell>
              <TableCell className="text-xs text-zinc-600">
                {lesson.source}
              </TableCell>
              <TableCell className="text-right">
                {lesson.failureCount > 0 && (
                  <span
                    className={cn(
                      "font-mono text-xs",
                      lesson.failureCount >= 3
                        ? "text-emerald-400"
                        : lesson.failureCount >= 2
                          ? "text-amber-400"
                          : "text-zinc-500"
                    )}
                  >
                    {lesson.failureCount}/3
                  </span>
                )}
              </TableCell>
              <TableCell>
                {lesson.promoted ? (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                    GATED
                  </span>
                ) : lesson.failureCount >= 2 ? (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">
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

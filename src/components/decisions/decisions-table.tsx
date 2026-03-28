"use client";

import { useState } from "react";
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

const AGENT_COLORS: Record<string, string> = {
  Guard: "bg-red-100 text-red-600",
  Memory: "bg-violet-100 text-violet-600",
  Research: "bg-blue-100 text-blue-600",
  Execution: "bg-emerald-100 text-emerald-600",
  Reporting: "bg-amber-100 text-amber-600",
};

const OUTCOME_COLORS: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-600",
  blocked: "bg-red-100 text-red-600",
  reverted: "bg-amber-100 text-amber-600",
  pending: "bg-zinc-100 text-zinc-500",
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DecisionsTable() {
  const { state } = useWS();
  const [agentFilter, setAgentFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");

  if (!state || state.decisions.length === 0) {
    return (
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-8 text-center text-sm text-zinc-400">
          No decisions recorded yet. Agent decisions from Claude Code sessions appear here.
        </CardContent>
      </Card>
    );
  }

  const decisions = state.decisions;
  const totalTokens = decisions.reduce((sum, d) => sum + d.tokenCost, 0);
  const successCount = decisions.filter((d) => d.outcome === "success").length;
  const successRate = decisions.length > 0 ? Math.round((successCount / decisions.length) * 100) : 0;

  const filtered = [...decisions]
    .filter((d) => agentFilter === "All" || d.agent === agentFilter)
    .filter((d) => outcomeFilter === "All" || d.outcome === outcomeFilter)
    .sort((a, b) => b.timestamp - a.timestamp);

  const agents = ["All", "Guard", "Memory", "Research", "Execution", "Reporting"];
  const outcomes = ["All", "success", "blocked", "reverted", "pending"];

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="card-premium border-zinc-200/80 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Decisions</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gradient">{decisions.length}</p>
          </CardContent>
        </Card>
        <Card className="card-premium border-zinc-200/80 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Token Cost</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gradient">
              ${(totalTokens * 0.000003).toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-zinc-400 font-medium">{totalTokens.toLocaleString()} tokens</p>
          </CardContent>
        </Card>
        <Card className="card-premium border-zinc-200/80 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Success Rate</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gradient">{successRate}%</p>
            <p className="mt-1 text-xs text-zinc-400 font-medium">{successCount} of {decisions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {agents.map((a) => (
            <option key={a} value={a}>{a === "All" ? "All Agents" : a}</option>
          ))}
        </select>
        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {outcomes.map((o) => (
            <option key={o} value={o}>{o === "All" ? "All Outcomes" : o}</option>
          ))}
        </select>
        <span className="text-xs text-zinc-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <Card className="border-zinc-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100 hover:bg-transparent bg-zinc-50/80">
              <TableHead className="text-zinc-500 font-semibold text-xs">Time</TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs">Agent</TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs">Decision</TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs">Reason</TableHead>
              <TableHead className="text-right text-zinc-500 font-semibold text-xs">Tokens</TableHead>
              <TableHead className="text-zinc-500 font-semibold text-xs">Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((decision, i) => (
              <TableRow
                key={decision.id}
                className={cn(
                  "border-zinc-100/80 transition-colors duration-150",
                  i % 2 === 0 ? "bg-white" : "bg-zinc-50/40"
                )}
              >
                <TableCell className="font-mono text-xs text-zinc-400 whitespace-nowrap">
                  {relativeTime(decision.timestamp)}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                      AGENT_COLORS[decision.agent] || "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {decision.agent}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-zinc-700 font-medium max-w-[280px] truncate">
                  {decision.description}
                </TableCell>
                <TableCell className="text-sm text-zinc-500 max-w-[240px] truncate">
                  {decision.reason}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-zinc-400">
                  {decision.tokenCost.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                      OUTCOME_COLORS[decision.outcome] || "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {decision.outcome}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

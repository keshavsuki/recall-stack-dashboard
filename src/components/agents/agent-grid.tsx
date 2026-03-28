"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { AgentCard } from "./agent-card";

export function AgentGrid() {
  const { state } = useWS();

  if (!state || state.agents.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-200/80 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="h-20 animate-pulse rounded-xl bg-zinc-50 mb-4" />
              <div className="h-5 w-24 animate-pulse rounded-lg bg-zinc-100 mb-2" />
              <div className="h-4 w-48 animate-pulse rounded-lg bg-zinc-50" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-slide-up stagger-children">
      {state.agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

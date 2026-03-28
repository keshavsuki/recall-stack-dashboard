"use client";

import { Header } from "@/components/layout/header";
import { GateCard } from "@/components/gates/gate-card";
import { PromotionPipeline } from "@/components/gates/promotion-pipeline";
import { useWS } from "@/components/shared/ws-provider";

export default function GatesPage() {
  const { state } = useWS();
  const gates = state?.gates.gates || [];

  return (
    <div className="flex h-full flex-col">
      <Header title="Gates" />
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h2 className="mb-3 text-sm font-medium text-zinc-400">
            Active Rules ({gates.length})
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {gates.map((gate) => (
              <GateCard key={gate.name} gate={gate} />
            ))}
          </div>
          {gates.length === 0 && (
            <p className="text-sm text-zinc-600">
              No gates configured. Add rules to gates.json.
            </p>
          )}
        </div>
        <PromotionPipeline />
      </div>
    </div>
  );
}

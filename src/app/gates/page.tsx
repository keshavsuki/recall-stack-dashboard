"use client";

import { Header } from "@/components/layout/header";
import { GateCard } from "@/components/gates/gate-card";
import { PromotionPipeline } from "@/components/gates/promotion-pipeline";
import { TriggerLog } from "@/components/gates/trigger-log";
import { useWS } from "@/components/shared/ws-provider";

export default function GatesPage() {
  const { state } = useWS();
  const gates = state?.gates.gates || [];
  const blockGates = gates.filter((g) => g.level === "block");
  const warnGates = gates.filter((g) => g.level === "warn");

  return (
    <div className="flex h-full flex-col">
      <Header title="Gates" />
      <div className="flex-1 space-y-8 p-8">
        {/* Pipeline hero */}
        <PromotionPipeline />

        {/* Trigger log */}
        <TriggerLog />

        {/* Block gates */}
        {blockGates.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <h2 className="text-sm font-semibold text-zinc-800">
                Blocking Rules ({blockGates.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 stagger-children">
              {blockGates.map((gate) => (
                <GateCard key={gate.name} gate={gate} />
              ))}
            </div>
          </div>
        )}

        {/* Warn gates */}
        {warnGates.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <h2 className="text-sm font-semibold text-zinc-800">
                Warning Rules ({warnGates.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 stagger-children">
              {warnGates.map((gate) => (
                <GateCard key={gate.name} gate={gate} />
              ))}
            </div>
          </div>
        )}

        {gates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-6 w-6 text-zinc-300"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500 font-medium">No gates configured</p>
            <p className="mt-1 text-xs text-zinc-400">
              Add rules to gates.json to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

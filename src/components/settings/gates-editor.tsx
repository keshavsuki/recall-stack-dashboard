"use client";

import { useState } from "react";
import { useWS } from "@/components/shared/ws-provider";
import { Switch } from "@/components/ui/switch";
import { LevelBadge } from "@/components/shared/badge";
import type { Gate } from "@/lib/types";

function AddGateForm({ onAdd }: { onAdd: (gate: Gate) => void }) {
  const [name, setName] = useState("");
  const [tool, setTool] = useState("");
  const [pattern, setPattern] = useState("");
  const [level, setLevel] = useState<"block" | "warn">("warn");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !tool || !pattern) return;
    onAdd({
      name,
      tool,
      pattern,
      level,
      message: `Custom gate: ${name}`,
      enabled: true,
    });
    setName("");
    setTool("");
    setPattern("");
    setLevel("warn");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[12px] text-zinc-800 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          placeholder="gate-name"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Tool</label>
        <input
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[12px] text-zinc-800 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          placeholder="Bash"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Pattern</label>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="h-8 w-48 rounded-lg border border-zinc-200 bg-white px-3 font-mono text-[12px] text-zinc-800 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          placeholder="regex pattern"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as "block" | "warn")}
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[12px] text-zinc-800 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        >
          <option value="warn">Warn</option>
          <option value="block">Block</option>
        </select>
      </div>
      <button
        type="submit"
        className="h-8 rounded-lg bg-violet-600 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-violet-700"
      >
        Add Gate
      </button>
    </form>
  );
}

export function GatesEditor() {
  const { state } = useWS();
  const [localGates, setLocalGates] = useState<Gate[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const gates = localGates ?? state?.gates.gates ?? [];

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function handleToggle(index: number) {
    const updated = [...gates];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setLocalGates(updated);
    showToast("Demo mode: changes are visual only");
  }

  function handleAdd(gate: Gate) {
    setLocalGates([...gates, gate]);
    setShowForm(false);
    showToast("Demo mode: gate added locally");
  }

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-800">Gates</h2>
          <p className="text-[11px] text-zinc-400">Toggle safety rules on and off</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Gate
        </button>
      </div>

      {showForm && (
        <div className="border-b border-zinc-100 px-6 py-4">
          <AddGateForm onAdd={handleAdd} />
        </div>
      )}

      <div className="divide-y divide-zinc-50">
        {gates.map((gate, i) => (
          <div key={gate.name} className="flex items-center gap-4 px-6 py-3.5">
            <Switch
              checked={gate.enabled}
              onCheckedChange={() => handleToggle(i)}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-zinc-800">{gate.name}</span>
                <LevelBadge level={gate.level} />
              </div>
              <code className="text-[11px] text-zinc-400 font-mono truncate block">{gate.pattern}</code>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">{gate.tool}</span>
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-[12px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

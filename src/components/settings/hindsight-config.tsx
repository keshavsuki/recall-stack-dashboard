"use client";

import { useState } from "react";
import { StatusDot } from "@/components/shared/badge";

export function HindsightConfig() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    // Simulate connection test in demo mode
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTestResult("success");
    setTesting(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white">
      <div className="border-b border-zinc-100 px-6 py-4">
        <h2 className="text-sm font-bold text-zinc-800">Hindsight</h2>
        <p className="text-[11px] text-zinc-400">Semantic memory search integration</p>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">URL</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-2.5">
              <code className="text-[13px] font-mono text-zinc-700">http://localhost:8888</code>
              <div className="ml-auto flex items-center gap-2">
                <StatusDot active={true} />
                <span className="text-[11px] font-medium text-emerald-600">Connected</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-5">
            <button
              onClick={testConnection}
              disabled={testing}
              className="h-9 rounded-lg border border-zinc-200 px-4 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            {testResult === "success" && (
              <span className="text-[11px] font-medium text-emerald-600 text-center">Connection OK</span>
            )}
            {testResult === "error" && (
              <span className="text-[11px] font-medium text-red-500 text-center">Failed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

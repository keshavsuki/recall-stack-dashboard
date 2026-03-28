"use client";

import { useEffect, useState } from "react";
import type { HookConfig } from "@/lib/parsers/settings";

export function HooksViewer() {
  const [hooks, setHooks] = useState<HookConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const parsed: HookConfig[] = [];
        if (data.hooks) {
          for (const [eventType, hookList] of Object.entries(data.hooks)) {
            if (Array.isArray(hookList)) {
              for (const h of hookList as Record<string, unknown>[]) {
                parsed.push({
                  type: eventType,
                  matcher: (h.matcher as string) || "",
                  command: (h.command as string) || "",
                  timeout: (h.timeout as number) || undefined,
                });
              }
            }
          }
        }
        setHooks(parsed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white">
      <div className="border-b border-zinc-100 px-6 py-4">
        <h2 className="text-sm font-bold text-zinc-800">Hooks</h2>
        <p className="text-[11px] text-zinc-400">Configured lifecycle hooks (read-only)</p>
      </div>

      {loading ? (
        <div className="px-6 py-8 text-center text-[12px] text-zinc-400">Loading...</div>
      ) : hooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-zinc-300">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </div>
          <p className="text-[12px] text-zinc-500 font-medium">No hooks configured</p>
          <p className="mt-1 text-[11px] text-zinc-400">Add hooks to settings.json to automate lifecycle events</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Hook Type</th>
                <th className="px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Matcher</th>
                <th className="px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Command</th>
                <th className="px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Timeout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {hooks.map((hook, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-3 text-[12px] font-semibold text-violet-600">{hook.type}</td>
                  <td className="px-6 py-3 text-[12px] text-zinc-600 font-mono">{hook.matcher || "*"}</td>
                  <td className="px-6 py-3 text-[12px] text-zinc-800 font-mono">{hook.command}</td>
                  <td className="px-6 py-3 text-[12px] text-zinc-400">{hook.timeout ? `${hook.timeout}ms` : "default"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

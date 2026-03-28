"use client";

import { useWS } from "@/components/shared/ws-provider";

export function PathsConfig() {
  const { state } = useWS();
  const paths = state?.health.filesWatched ?? [];

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white">
      <div className="border-b border-zinc-100 px-6 py-4">
        <h2 className="text-sm font-bold text-zinc-800">Watched Paths</h2>
        <p className="text-[11px] text-zinc-400">Files and directories monitored for changes</p>
      </div>

      {paths.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-[12px] text-zinc-500 font-medium">No paths configured</p>
          <p className="mt-1 text-[11px] text-zinc-400">The watcher is not monitoring any files</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50">
          {paths.map((path) => (
            <div key={path} className="flex items-center gap-3 px-6 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-500">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <code className="text-[12px] font-mono text-zinc-700">{path}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useWS } from "@/components/shared/ws-provider";

interface CheckItem {
  label: string;
  passed: boolean;
}

function CheckRow({ label, passed }: CheckItem) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-white px-4 py-3">
      {passed ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-emerald-500">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-red-400">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
      <span className="text-[13px] font-medium text-zinc-700">{label}</span>
    </div>
  );
}

export function DetectionChecks() {
  const { state } = useWS();

  const checks: CheckItem[] = [
    { label: "CLAUDE.md found", passed: !!state?.claudeMd },
    { label: "primer.md found", passed: !!state?.primer.raw },
    { label: "gates.json found", passed: (state?.gates.gates.length ?? 0) > 0 },
    { label: "Hindsight connected", passed: !!state?.health.hindsightAvailable },
    { label: "Sessions active", passed: (state?.health.activeSessions ?? 0) > 0 },
  ];

  const passedCount = checks.filter((c) => c.passed).length;

  return (
    <div>
      <div className="space-y-2">
        {checks.map((check) => (
          <CheckRow key={check.label} {...check} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className={`text-sm font-bold ${passedCount === 5 ? "text-emerald-600" : passedCount >= 3 ? "text-amber-600" : "text-red-500"}`}>
          {passedCount}/5 layers detected
        </span>
      </div>
    </div>
  );
}

"use client";

import { useWS } from "@/components/shared/ws-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrimerViewer() {
  const { state } = useWS();
  const primer = state?.primer;

  if (!primer?.raw) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center">
        <p className="text-sm text-zinc-400">
          No primer.md found. Start a Claude Code session to generate one.
        </p>
      </div>
    );
  }

  const sections = Object.entries(primer.sections).filter(
    ([key]) => key !== "intro" || primer.sections.intro?.trim()
  );

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-800">
            primer.md
          </h2>
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 tracking-wide">
            LIVE
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">
          {new Date(primer.lastModified).toLocaleTimeString()}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200/60 bg-white overflow-hidden">
        <ScrollArea className="h-[500px]">
          <div className="p-6 space-y-5">
            {sections.map(([heading, content]) => (
              <div key={heading}>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-500 mb-2">
                  {heading}
                </h3>
                <div className="rounded-xl bg-zinc-50/80 border border-zinc-100 p-4">
                  <pre className="whitespace-pre-wrap text-[12px] text-zinc-600 font-mono leading-relaxed">
                    {content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

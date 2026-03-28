"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrimerViewer() {
  const { state } = useWS();
  const primer = state?.primer;

  if (!primer?.raw) {
    return (
      <Card className="border-zinc-200/80 bg-white shadow-sm">
        <CardContent className="p-8 text-center text-sm text-zinc-400">
          No primer.md found. Start a Claude Code session to generate one.
        </CardContent>
      </Card>
    );
  }

  const sections = Object.entries(primer.sections).filter(
    ([key]) => key !== "intro" || primer.sections.intro?.trim()
  );

  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-800">
          primer.md (live)
        </h2>
        <span className="text-[11px] text-zinc-400 font-medium">
          {new Date(primer.lastModified).toLocaleTimeString()}
        </span>
      </div>
      <Card className="border-zinc-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
        <ScrollArea className="h-[500px]">
          <CardContent className="p-6 space-y-5">
            {sections.map(([heading, content]) => (
              <div key={heading}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-2">
                  {heading}
                </h3>
                <pre className="whitespace-pre-wrap text-sm text-zinc-600 font-mono leading-relaxed bg-zinc-50 rounded-xl p-4">
                  {content}
                </pre>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}

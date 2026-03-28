"use client";

import { useWS } from "@/components/shared/ws-provider";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrimerViewer() {
  const { state } = useWS();
  const primer = state?.primer;

  if (!primer?.raw) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-6 text-center text-sm text-zinc-600">
          No primer.md found. Start a Claude Code session to generate one.
        </CardContent>
      </Card>
    );
  }

  const sections = Object.entries(primer.sections).filter(
    ([key]) => key !== "intro" || primer.sections.intro?.trim()
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-400">
          primer.md (live)
        </h2>
        <span className="text-[10px] text-zinc-600">
          {new Date(primer.lastModified).toLocaleTimeString()}
        </span>
      </div>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <ScrollArea className="h-[500px]">
          <CardContent className="p-4 space-y-4">
            {sections.map(([heading, content]) => (
              <div key={heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
                  {heading}
                </h3>
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed">
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

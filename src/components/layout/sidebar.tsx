"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/memory", label: "Memory", icon: "layers" },
  { href: "/gates", label: "Gates", icon: "shield" },
  { href: "/lessons", label: "Lessons", icon: "book" },
  { href: "/activity", label: "Activity", icon: "list" },
];

const ICONS: Record<string, string> = {
  grid: "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
  layers:
    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  shield:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V5a2.5 2.5 0 0 1 2.5-2.5H20v15H6.5A2.5 2.5 0 0 0 4 19.5z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
};

export function Sidebar() {
  const pathname = usePathname();
  const { connected } = useWS();

  return (
    <aside className="flex h-screen w-[220px] flex-col border-r border-zinc-200/60 bg-white">
      {/* Brand area with subtle gradient */}
      <div className="sidebar-brand px-5 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-200/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-4 w-4 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-bold text-zinc-900 tracking-tight">
              recall-stack
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
              <StatusDot active={connected} />
              {connected ? "live" : "connecting..."}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 pt-2">
        <div className="px-3 pb-2 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
            Navigation
          </span>
        </div>
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-violet-50/80 text-violet-700"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-4 w-4",
                  active ? "text-violet-500" : "text-zinc-400"
                )}
              >
                <path d={ICONS[item.icon]} />
              </svg>
              {item.label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-100 px-5 py-4">
        <div className="text-[10px] text-zinc-300 font-medium tracking-wide">
          recall-stack v1.0
        </div>
      </div>
    </aside>
  );
}

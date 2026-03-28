"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWS } from "@/components/shared/ws-provider";
import { StatusDot } from "@/components/shared/badge";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: "notifications";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "CORE",
    items: [
      { href: "/", label: "Dashboard", icon: "grid" },
      { href: "/memory", label: "Memory", icon: "layers" },
      { href: "/gates", label: "Gates", icon: "shield" },
      { href: "/lessons", label: "Lessons", icon: "book" },
      { href: "/activity", label: "Activity", icon: "list" },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { href: "/decisions", label: "Decisions", icon: "scale" },
      { href: "/costs", label: "Costs", icon: "dollar" },
      { href: "/analytics", label: "Analytics", icon: "chart" },
      { href: "/agents", label: "Agents", icon: "users" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/sessions", label: "Sessions", icon: "play" },
      { href: "/repos", label: "Repos", icon: "folder" },
      { href: "/notifications", label: "Notifications", icon: "bell", badge: "notifications" },
      { href: "/settings", label: "Settings", icon: "gear" },
    ],
  },
];

const ICONS: Record<string, string> = {
  grid: "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
  layers:
    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  shield:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V5a2.5 2.5 0 0 1 2.5-2.5H20v15H6.5A2.5 2.5 0 0 0 4 19.5z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  scale: "M12 3v18m-9-9h18M5 6l7-3 7 3M5 18l7 3 7-3",
  dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  chart: "M18 20V10M12 20V4M6 20v-6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  play: "M5 3l14 9-14 9V3z",
  folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
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
      <nav className="flex-1 overflow-y-auto px-3 pt-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-1">
            <div className="px-3 pb-1.5 pt-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
                {section.title}
              </span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
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
                        "h-4 w-4 flex-shrink-0",
                        active ? "text-violet-500" : "text-zinc-400"
                      )}
                    >
                      <path d={ICONS[item.icon]} />
                    </svg>
                    {item.label}
                    {item.badge === "notifications" && (
                      <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        3
                      </span>
                    )}
                    {active && !item.badge && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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

"use client";

import { Header } from "@/components/layout/header";
import { RepoCard } from "@/components/repos/repo-card";
import { useWS } from "@/components/shared/ws-provider";

export default function ReposPage() {
  const { state } = useWS();
  const repos = state?.repos || [];

  return (
    <div className="flex h-full flex-col">
      <Header title="Repositories" />
      <div className="flex-1 p-8">
        {repos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 stagger-children">
            {repos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-6 w-6 text-zinc-300"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500 font-medium">No repositories found</p>
            <p className="mt-1 text-xs text-zinc-400">
              Repositories with CLAUDE.md will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

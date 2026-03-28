import { AgentGrid } from "@/components/agents/agent-grid";
import { AgentActivityFeed } from "@/components/agents/agent-activity-feed";

export default function AgentsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-200/60">
        <div className="hero-mesh absolute inset-0" />
        <div className="relative px-8 pb-6 pt-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Your <span className="text-gradient">AI Team</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            5 agents working across your codebase
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-8 p-8">
        <AgentGrid />
        <AgentActivityFeed />
      </div>
    </div>
  );
}

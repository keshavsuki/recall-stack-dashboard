import { Header } from "@/components/layout/header";
import { AgentGrid } from "@/components/agents/agent-grid";

export default function AgentsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Agents" />
      <div className="flex-1 p-8">
        <AgentGrid />
      </div>
    </div>
  );
}

import { DecisionsTable } from "@/components/decisions/decisions-table";

export default function DecisionsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-200/60">
        <div className="hero-mesh absolute inset-0" />
        <div className="relative px-8 pb-6 pt-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            <span className="text-gradient">Decision</span> Log
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Every autonomous choice your agents made, with full audit trail
          </p>
        </div>
      </div>

      <div className="flex-1 p-8">
        <DecisionsTable />
      </div>
    </div>
  );
}

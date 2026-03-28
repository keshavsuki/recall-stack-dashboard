import { Header } from "@/components/layout/header";
import { DecisionsTable } from "@/components/decisions/decisions-table";

export default function DecisionsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Decisions" />
      <div className="flex-1 p-8">
        <DecisionsTable />
      </div>
    </div>
  );
}

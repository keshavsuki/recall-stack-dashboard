import { Header } from "@/components/layout/header";
import { LayerStack } from "@/components/memory/layer-stack";
import { PrimerViewer } from "@/components/memory/primer-viewer";

export default function MemoryPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Memory" />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-2 gap-8">
          <LayerStack />
          <PrimerViewer />
        </div>
      </div>
    </div>
  );
}

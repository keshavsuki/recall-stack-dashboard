"use client";

import { Header } from "@/components/layout/header";
import { GatesEditor } from "@/components/settings/gates-editor";
import { HooksViewer } from "@/components/settings/hooks-viewer";
import { HindsightConfig } from "@/components/settings/hindsight-config";
import { PathsConfig } from "@/components/settings/paths-config";

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Settings" />
      <div className="flex-1 space-y-6 p-8">
        <GatesEditor />
        <HooksViewer />
        <HindsightConfig />
        <PathsConfig />
      </div>
    </div>
  );
}

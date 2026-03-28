"use client";

import { Header } from "@/components/layout/header";
import { SessionList } from "@/components/sessions/session-list";

export default function SessionsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Sessions" />
      <div className="flex-1 p-8">
        <SessionList />
      </div>
    </div>
  );
}

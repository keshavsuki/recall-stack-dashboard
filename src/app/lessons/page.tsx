import { Header } from "@/components/layout/header";
import { LessonsTable } from "@/components/lessons/lessons-table";

export default function LessonsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Lessons" />
      <div className="flex-1 p-8">
        <LessonsTable />
      </div>
    </div>
  );
}

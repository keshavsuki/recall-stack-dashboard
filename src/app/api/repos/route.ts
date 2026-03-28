import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    return NextResponse.json(demoDashboardState.repos);
  }

  const { scanRepos } = await import("@/lib/parsers/repos");
  return NextResponse.json(scanRepos());
}

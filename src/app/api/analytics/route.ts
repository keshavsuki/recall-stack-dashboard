import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    return NextResponse.json(demoDashboardState.trends);
  }
  const { buildTrends } = await import("@/lib/parsers/trends");
  return NextResponse.json(buildTrends());
}

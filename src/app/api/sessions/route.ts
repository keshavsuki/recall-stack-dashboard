import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    return NextResponse.json(demoDashboardState.sessionDetails);
  }

  const { getAllSessionDetails } = await import("@/lib/parsers/session-detail");
  return NextResponse.json(getAllSessionDetails());
}

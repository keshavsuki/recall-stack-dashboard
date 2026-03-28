import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    return NextResponse.json(demoDashboardState.decisions);
  }
  const { parseJsonl } = await import("@/lib/parsers/jsonl");
  return NextResponse.json(parseJsonl("decisions.jsonl"));
}

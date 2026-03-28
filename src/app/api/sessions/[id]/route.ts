import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    const session = demoDashboardState.sessionDetails.find(
      (s) => s.sessionId === id
    );
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json(session);
  }

  const { getSessionDetail } = await import("@/lib/parsers/session-detail");
  const detail = getSessionDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json(detail);
}

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    return NextResponse.json(demoDashboardState.gates);
  }

  const { parseGates } = await import("@/lib/parsers/gates");
  return NextResponse.json(parseGates());
}

export async function PATCH(request: NextRequest) {
  if (process.env.DEMO_MODE === "true") {
    return NextResponse.json(
      { error: "Gate toggling is disabled in demo mode" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, enabled } = body;

    if (typeof name !== "string" || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "name (string) and enabled (boolean) required" },
        { status: 400 }
      );
    }

    const { toggleGate } = await import("@/lib/parsers/gates");
    const updated = toggleGate(name, enabled);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update gate" },
      { status: 500 }
    );
  }
}

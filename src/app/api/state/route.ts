import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (process.env.DEMO_MODE === "true") {
      const { demoDashboardState } = await import("@/lib/demo-data");
      return NextResponse.json(demoDashboardState);
    }

    const { buildState } = await import("@/lib/state");
    const state = buildState();
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read state" },
      { status: 500 }
    );
  }
}

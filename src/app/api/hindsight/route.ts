import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (process.env.DEMO_MODE === "true") {
    const { demoDashboardState } = await import("@/lib/demo-data");
    return NextResponse.json({
      available: true,
      patterns: demoDashboardState.hindsightPatterns,
    });
  }

  const { recallPatterns, isAvailable } = await import("@/lib/hindsight");

  if (!isAvailable()) {
    return NextResponse.json({ available: false, patterns: [] });
  }

  const query = request.nextUrl.searchParams.get("q") || "recent patterns";
  const n = parseInt(request.nextUrl.searchParams.get("n") || "10", 10);

  const patterns = await recallPatterns(query, n);
  return NextResponse.json({ available: true, patterns });
}

import { NextResponse } from "next/server";

const sampleConfig = {
  hindsightUrl: "http://localhost:8888",
  watchedPaths: ["primer.md", "gates.json", "CLAUDE.md", "settings.json", "sessions/", "history.jsonl"],
  gates: {
    promotionThreshold: 5,
    autoPromote: true,
  },
  hooks: {
    "PreToolUse": [
      { matcher: "Bash", command: "check-safety.sh", timeout: 5000 },
    ],
    "PostToolUse": [
      { matcher: "Write", command: "log-write.sh", timeout: 3000 },
    ],
  },
};

export async function GET() {
  return NextResponse.json(sampleConfig);
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Settings updates are disabled in demo mode" },
    { status: 403 }
  );
}

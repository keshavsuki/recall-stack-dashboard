import path from "path";
import fs from "fs";

export function getBasePath(): string {
  if (process.env.RECALL_STACK_PATH) {
    return process.env.RECALL_STACK_PATH;
  }
  const home = process.env.HOME || process.env.USERPROFILE || "/root";
  return path.join(home, ".claude");
}

export function resolveFile(...segments: string[]): string {
  return path.join(getBasePath(), ...segments);
}

export function fileExists(...segments: string[]): boolean {
  return fs.existsSync(resolveFile(...segments));
}

export const WS_PORT = parseInt(process.env.WS_PORT || "3001", 10);
export const PORT = parseInt(process.env.PORT || "3000", 10);

import fs from "fs";
import { resolveFile, fileExists } from "../config";

export interface HookConfig {
  type: string;
  matcher?: string;
  command: string;
  timeout?: number;
}

export interface Settings {
  hooks: HookConfig[];
}

export function parseSettings(): Settings {
  if (!fileExists("settings.json")) {
    return { hooks: [] };
  }

  try {
    const raw = fs.readFileSync(resolveFile("settings.json"), "utf-8");
    const parsed = JSON.parse(raw);
    const hooks: HookConfig[] = [];

    // settings.json hooks can be nested under event types
    if (parsed.hooks) {
      for (const [eventType, hookList] of Object.entries(parsed.hooks)) {
        if (Array.isArray(hookList)) {
          for (const h of hookList) {
            hooks.push({
              type: eventType,
              matcher: h.matcher || "",
              command: h.command || "",
              timeout: h.timeout,
            });
          }
        }
      }
    }

    return { hooks };
  } catch {
    return { hooks: [] };
  }
}

import chokidar, { type FSWatcher } from "chokidar";
import path from "path";
import { getBasePath } from "./config";
import {
  updatePrimer,
  updateGates,
  updateFailures,
  updateLessons,
  updateSessions,
} from "./state";
import { parseNewHistory } from "./parsers/history";
import type { WSEvent, ActivityItem } from "./types";

type EventHandler = (event: WSEvent) => void;

let watcher: FSWatcher | null = null;
const handlers: EventHandler[] = [];

export function onEvent(handler: EventHandler) {
  handlers.push(handler);
}

function emit(event: WSEvent) {
  for (const h of handlers) {
    try {
      h(event);
    } catch {
      // Ignore handler errors
    }
  }
}

function emitActivity(item: Omit<ActivityItem, "id">) {
  emit({
    type: "activity",
    data: { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
  });
}

export function startWatcher() {
  if (watcher) return;

  const basePath = getBasePath();
  const watchPaths = [
    path.join(basePath, "primer.md"),
    path.join(basePath, "gates.json"),
    path.join(basePath, "failures.json"),
    path.join(basePath, "CLAUDE.md"),
    path.join(basePath, "settings.json"),
    path.join(basePath, "sessions"),
    path.join(basePath, "history.jsonl"),
  ];

  watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
  });

  watcher.on("change", (filePath: string) => {
    const basename = path.basename(filePath);
    const dir = path.basename(path.dirname(filePath));

    if (basename === "primer.md") {
      const data = updatePrimer();
      emit({ type: "primer:updated", data });
      emitActivity({
        type: "file",
        description: "primer.md updated",
        timestamp: Date.now(),
        detail: Object.keys(data.sections).join(", "),
      });
    } else if (basename === "gates.json") {
      const data = updateGates();
      emit({ type: "gates:updated", data });
      emitActivity({
        type: "gate",
        description: `Gates updated (${data.gates.length} rules)`,
        timestamp: Date.now(),
      });
    } else if (basename === "failures.json") {
      const data = updateFailures();
      emit({ type: "failures:updated", data });
    } else if (basename === "history.jsonl") {
      const entries = parseNewHistory();
      if (entries.length > 0) {
        emit({ type: "history:appended", data: entries });
        for (const entry of entries) {
          emitActivity({
            type: "command",
            description: entry.display,
            timestamp: entry.timestamp || Date.now(),
            detail: entry.project,
          });
        }
      }
    } else if (dir === "sessions" && basename.endsWith(".json")) {
      updateSessions();
      emitActivity({
        type: "session",
        description: `Session updated: ${basename.replace(".json", "").slice(0, 8)}`,
        timestamp: Date.now(),
      });
    }
  });

  watcher.on("add", (filePath: string) => {
    const dir = path.basename(path.dirname(filePath));
    const basename = path.basename(filePath);

    if (dir === "sessions" && basename.endsWith(".json")) {
      const sessions = updateSessions();
      const newest = sessions[0];
      if (newest) {
        emit({ type: "session:started", data: newest });
        emitActivity({
          type: "session",
          description: `Session started (${newest.kind || "cli"})`,
          timestamp: Date.now(),
          detail: newest.cwd,
        });
      }
    }
  });

  watcher.on("unlink", (filePath: string) => {
    const dir = path.basename(path.dirname(filePath));
    const basename = path.basename(filePath);

    if (dir === "sessions" && basename.endsWith(".json")) {
      emitActivity({
        type: "session",
        description: "Session ended",
        timestamp: Date.now(),
      });
      updateSessions();
    }
  });

  console.log(`[recall-stack] Watching ${basePath}`);
}

export function stopWatcher() {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
}

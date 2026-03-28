import { createServer } from "http";
import next from "next";
import { createWSServer } from "./src/lib/ws-server";
import { startWatcher } from "./src/lib/watcher";
import { buildState } from "./src/lib/state";
import { checkHindsight, isAvailable } from "./src/lib/hindsight";
import { updateHealth } from "./src/lib/state";
import { getBasePath, WS_PORT, PORT } from "./src/lib/config";

const dev = process.env.NODE_ENV !== "production";

async function main() {
  const basePath = getBasePath();
  console.log(`[recall-stack] Dashboard starting...`);
  console.log(`[recall-stack] Reading from: ${basePath}`);

  // Build initial state
  buildState();

  // Check Hindsight
  const hindsightUp = await checkHindsight();
  updateHealth(hindsightUp);
  console.log(
    `[recall-stack] Hindsight: ${hindsightUp ? "connected" : "not available (optional)"}`
  );

  // Start file watcher
  startWatcher();

  // Start WebSocket server
  createWSServer(WS_PORT);

  // Periodic Hindsight health check
  setInterval(async () => {
    const up = await checkHindsight();
    updateHealth(up);
  }, 30000);

  // Start Next.js
  const app = next({ dev });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = createServer((req, res) => {
    handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`[recall-stack] Dashboard: http://localhost:${PORT}`);
    console.log(`[recall-stack] WebSocket: ws://localhost:${WS_PORT}`);
  });
}

main().catch((err) => {
  console.error("[recall-stack] Failed to start:", err);
  process.exit(1);
});

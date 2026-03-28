import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import type { WSEvent } from "./types";
import { getState } from "./state";
import { onEvent } from "./watcher";

let wss: WebSocketServer | null = null;

export function createWSServer(port: number) {
  wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket, _req: IncomingMessage) => {
    // Send initial snapshot
    const snapshot: WSEvent = { type: "snapshot", data: getState() };
    ws.send(JSON.stringify(snapshot));

    // Heartbeat
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000);

    ws.on("close", () => clearInterval(heartbeat));
  });

  // Forward watcher events to all connected clients
  onEvent((event: WSEvent) => {
    if (!wss) return;
    const data = JSON.stringify(event);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  });

  console.log(`[recall-stack] WebSocket server on ws://localhost:${port}`);
  return wss;
}

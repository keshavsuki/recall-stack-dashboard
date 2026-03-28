import fs from "fs";
import { resolveFile, fileExists } from "../config";
import type { GatesFile } from "../types";

const DEFAULT_GATES: GatesFile = {
  version: 1,
  description: "No gates.json found",
  gates: [],
};

export function parseGates(): GatesFile {
  if (!fileExists("gates.json")) {
    return DEFAULT_GATES;
  }

  try {
    const raw = fs.readFileSync(resolveFile("gates.json"), "utf-8");
    return JSON.parse(raw) as GatesFile;
  } catch {
    return DEFAULT_GATES;
  }
}

export function toggleGate(name: string, enabled: boolean): GatesFile {
  const filePath = resolveFile("gates.json");
  const gates = parseGates();

  const gate = gates.gates.find((g) => g.name === name);
  if (gate) {
    gate.enabled = enabled;
    fs.writeFileSync(filePath, JSON.stringify(gates, null, 2), "utf-8");
  }

  return gates;
}

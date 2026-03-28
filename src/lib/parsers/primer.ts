import fs from "fs";
import { resolveFile, fileExists } from "../config";
import type { PrimerState } from "../types";

export function parsePrimer(): PrimerState {
  const filePath = resolveFile("primer.md");
  if (!fileExists("primer.md")) {
    return { raw: "", sections: {}, lastModified: 0 };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const stat = fs.statSync(filePath);
  const sections: Record<string, string> = {};

  let currentSection = "intro";
  const lines = raw.split("\n");

  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.+)/);
    if (match) {
      currentSection = match[1].trim();
      sections[currentSection] = "";
    } else {
      sections[currentSection] = (sections[currentSection] || "") + line + "\n";
    }
  }

  // Trim trailing newlines from sections
  for (const key of Object.keys(sections)) {
    sections[key] = sections[key].trimEnd();
  }

  return { raw, sections, lastModified: stat.mtimeMs };
}

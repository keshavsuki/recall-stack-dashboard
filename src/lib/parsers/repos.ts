import fs from "fs";
import path from "path";
import { resolveFile, fileExists } from "../config";

export interface RepoInfo {
  name: string;
  path: string;
  hasClaudeMd: boolean;
  hasAgentsMd: boolean;
  claudeMdSize: number;
  agentsMdSize: number;
}

export function scanRepos(): RepoInfo[] {
  const projectsDir = resolveFile("projects");
  if (!fileExists("projects")) return [];

  const repos: RepoInfo[] = [];

  try {
    const entries = fs.readdirSync(projectsDir);
    for (const entry of entries) {
      const fullPath = path.join(projectsDir, entry);
      const stat = fs.statSync(fullPath);
      if (!stat.isDirectory()) continue;

      const claudeMdPath = path.join(fullPath, "CLAUDE.md");
      const agentsMdPath = path.join(fullPath, "AGENTS.md");
      const hasClaudeMd = fs.existsSync(claudeMdPath);
      const hasAgentsMd = fs.existsSync(agentsMdPath);

      repos.push({
        name: entry,
        path: fullPath,
        hasClaudeMd,
        hasAgentsMd,
        claudeMdSize: hasClaudeMd ? fs.statSync(claudeMdPath).size : 0,
        agentsMdSize: hasAgentsMd ? fs.statSync(agentsMdPath).size : 0,
      });
    }
  } catch {
    // Permission or read errors
  }

  return repos.sort((a, b) => a.name.localeCompare(b.name));
}

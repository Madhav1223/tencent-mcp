// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { readdir, readFile, stat } from "node:fs/promises";
import { join, basename, dirname, resolve } from "node:path";

export interface SkillFile {
  name: string;
  path: string;
  content: string;
}

function searchDirs(): string[] {
  const override = process.env.TENCENT_MCP_KNOWLEDGE_DIR?.trim();
  return [
    process.env.TENCENT_MCP_SKILLS_DIR ?? "",
    "/app/config/skills",
    "config/skills",
    "/app/skills",
    "skills",
    ...(override ? [override] : []),
  ].filter(Boolean);
}

async function walk(dir: string, depth: number, out: SkillFile[]): Promise<void> {
  if (depth > 3) return;
  let files: string[];
  try {
    const s = await stat(dir);
    if (!s.isDirectory()) return;
    files = await readdir(dir);
  } catch {
    return;
  }
  for (const f of files) {
    // Skip hidden files/dirs (e.g. .git) to avoid noise.
    if (f.startsWith(".")) continue;
    const full = join(dir, f);
    try {
      const s = await stat(full);
      if (s.isDirectory()) {
        await walk(full, depth + 1, out);
        continue;
      }
      if (!f.endsWith(".md") && !f.endsWith(".txt") && !f.endsWith(".json")) continue;
      const content = await readFile(full, "utf8");
      const rel = full.startsWith(resolve(".") + "/") ? full.slice(resolve(".").length + 1) : full;
      // AWS-style layout uses <skill-name>/skill.md — derive the skill name from
      // the parent directory so hundreds of skill.md files don't collapse to one
      // entry. First-wins dedupe in listSkills() still lets config/skills/ override.
      const base = basename(f, ".md");
      const fname = base.toLowerCase() === "skill" ? basename(dirname(full)) : base;
      out.push({ name: fname, path: rel || full, content: content.slice(0, 8000) });
    } catch {
      // skip unreadable entries
    }
  }
}

export async function listSkills(): Promise<SkillFile[]> {
  const seen = new Set<string>();
  const out: SkillFile[] = [];
  for (const dir of searchDirs()) {
    const abs = dir.startsWith("/") ? dir : resolve(dir);
    if (seen.has(abs)) continue;
    seen.add(abs);
    await walk(abs, 0, out);
  }
  // config/skills wins on name collision: it is listed first, so keep first.
  const uniq = new Map<string, SkillFile>();
  for (const s of out) if (!uniq.has(s.name)) uniq.set(s.name, s);
  return [...uniq.values()].sort((a, b) => a.name.localeCompare(b.name));
}

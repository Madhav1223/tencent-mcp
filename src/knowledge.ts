// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { basename, join, resolve } from "node:path";

export type KnowledgeStatus = "refined" | "unrefined";

export interface KnowledgeEntry {
  name: string;
  status: KnowledgeStatus;
  path: string;
  preview: string;
  bytes: number;
}

const MAX_CONTENT_CHARS = 20000;

/**
 * MCP-managed knowledge base. Refined lessons (validated via hit-and-trial)
 * live under `<skills>/refined/`, raw unrefined notes under
 * `<skills>/unrefined/` for later refinement and validation.
 *
 * Write target resolution (first writable wins):
 *   1. $TENCENT_MCP_KNOWLEDGE_DIR (explicit override)
 *   2. /app/skills            (container: named volume, writable, survives restarts)
 *   3. ./skills               (local dev: repo-tracked)
 *   4. /app/config/skills     (container: operator bind mount, often read-only)
 *   5. ./config/skills        (local dev fallback)
 */
function baseCandidates(): string[] {
  const override = process.env.TENCENT_MCP_KNOWLEDGE_DIR?.trim();
  const cands = [
    ...(override ? [override] : []),
    "/app/skills",
    resolve("skills"),
    "/app/config/skills",
    resolve("config/skills"),
  ];
  return [...new Set(cands)];
}

async function isWritableDir(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    if (!s.isDirectory()) return false;
    await access(path, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function resolveKnowledgeDir(): Promise<string> {
  for (const base of baseCandidates()) {
    if (await isWritableDir(base)) return base;
  }
  // Nothing writable yet (fresh volume not seeded?): try to create the first
  // non-root candidate, otherwise fall back to a tmp dir that always works.
  for (const base of baseCandidates()) {
    try {
      await mkdir(base, { recursive: true });
      if (await isWritableDir(base)) return base;
    } catch {
      // try next candidate
    }
  }
  const tmp = resolve("skills");
  await mkdir(tmp, { recursive: true });
  return tmp;
}

export function knowledgeSubdir(base: string, status: KnowledgeStatus): string {
  return join(base, status);
}

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return slug || "note";
}

async function uniquePath(dir: string, slug: string): Promise<string> {
  let candidate = join(dir, `${slug}.md`);
  for (let i = 2; i < 100; i += 1) {
    try {
      await stat(candidate);
      candidate = join(dir, `${slug}-${i}.md`);
    } catch {
      return candidate;
    }
  }
  return candidate;
}

export async function saveKnowledge(input: {
  title: string;
  content: string;
  status?: KnowledgeStatus;
  source?: string;
}): Promise<KnowledgeEntry> {
  const title = input.title?.trim();
  if (!title) throw new Error("save_knowledge requires a non-empty 'title'.");
  const content = (input.content ?? "").trim();
  if (!content) throw new Error("save_knowledge requires non-empty 'content'.");
  const status: KnowledgeStatus = input.status === "refined" ? "refined" : "unrefined";
  if (content.length > MAX_CONTENT_CHARS) {
    throw new Error(
      `content too large (${content.length} chars, max ${MAX_CONTENT_CHARS}). Split it into smaller notes.`,
    );
  }
  const base = await resolveKnowledgeDir();
  const dir = knowledgeSubdir(base, status);
  await mkdir(dir, { recursive: true });
  const filePath = await uniquePath(dir, slugify(title));
  const body = `# ${title}\n\n> status: ${status} | created: ${new Date().toISOString()} | source: ${input.source ?? "mcp-knowledge-tool"}\n\n${content}\n`;
  await writeFile(filePath, body, "utf8");
  const s = await stat(filePath);
  return {
    name: basename(filePath, ".md"),
    status,
    path: filePath,
    preview:
      content
        .split("\n")
        .find((l) => l.trim())
        ?.slice(0, 140) ?? "",
    bytes: s.size,
  };
}

async function listDir(dir: string, status: KnowledgeStatus): Promise<KnowledgeEntry[]> {
  const out: KnowledgeEntry[] = [];
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return out;
  }
  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const full = join(dir, f);
    try {
      const s = await stat(full);
      if (!s.isFile()) continue;
      const text = await readFile(full, "utf8");
      out.push({
        name: basename(f, ".md"),
        status,
        path: full,
        preview:
          text
            .split("\n")
            .find((l) => l.trim() && !l.startsWith(">"))
            ?.slice(0, 140) ?? "",
        bytes: s.size,
      });
    } catch {
      // skip unreadable files
    }
  }
  return out;
}

export async function listKnowledge(status?: KnowledgeStatus): Promise<{ base: string; entries: KnowledgeEntry[] }> {
  const base = await resolveKnowledgeDir();
  const statuses: KnowledgeStatus[] = status ? [status] : ["refined", "unrefined"];
  const entries: KnowledgeEntry[] = [];
  for (const st of statuses) {
    entries.push(...(await listDir(knowledgeSubdir(base, st), st)));
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return { base, entries };
}

export async function promoteKnowledge(name: string): Promise<KnowledgeEntry> {
  const clean = slugify(name);
  if (!clean || clean !== name.toLowerCase().replace(/\.md$/i, "")) {
    // Allow plain names only: no paths, no traversal.
    if (name.includes("/") || name.includes("\\") || name.includes("..")) {
      throw new Error("promote_knowledge requires a plain note name (no paths).");
    }
  }
  const base = await resolveKnowledgeDir();
  const fileName = name.endsWith(".md") ? basename(name) : `${basename(name, ".md")}.md`;
  if (fileName.includes("/") || fileName.includes("\\") || fileName !== basename(fileName)) {
    throw new Error("promote_knowledge requires a plain note name (no paths).");
  }
  const src = join(knowledgeSubdir(base, "unrefined"), fileName);
  try {
    await stat(src);
  } catch {
    throw new Error(`No unrefined note named '${fileName}' in ${knowledgeSubdir(base, "unrefined")}.`);
  }
  const destDir = knowledgeSubdir(base, "refined");
  await mkdir(destDir, { recursive: true });
  const dest = join(destDir, fileName);
  try {
    await stat(dest);
    throw new Error(`A refined note named '${fileName}' already exists; rename one first.`);
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("A refined note")) throw err;
  }
  let text = await readFile(src, "utf8");
  text = text.replace(/> status:\s*unrefined/, `> status: refined | promoted: ${new Date().toISOString()}`);
  await writeFile(dest, text, "utf8");
  const { rm } = await import("node:fs/promises");
  await rm(src);
  const s = await stat(dest);
  return {
    name: basename(dest, ".md"),
    status: "refined",
    path: dest,
    preview:
      text
        .split("\n")
        .find((l) => l.trim() && !l.startsWith(">"))
        ?.slice(0, 140) ?? "",
    bytes: s.size,
  };
}

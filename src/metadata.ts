// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { readFile, stat } from "node:fs/promises";

export interface ProjectMetadata {
  project_id?: string;
  project_name?: string;
  region?: string;
  workflow_id?: string;
  workflow_name?: string;
  data_engine_id?: string;
  data_engine_name?: string;
  database?: string;
  catalog?: string;
  resource_group_name?: string;
}

export interface MetadataDocument {
  defaults?: { region?: string };
  wedata?: ProjectMetadata;
  dlc?: Pick<
    ProjectMetadata,
    "region" | "data_engine_id" | "data_engine_name" | "database" | "catalog" | "resource_group_name"
  >;
  [key: string]: unknown;
}

const DEFAULT_PATH = "/app/config/metadata.md";
// Change signature must be stronger than mtime alone: two writes can land in
// the same millisecond (fast editors, fs mtime granularity) and silently serve
// stale content.
let cached: { path: string; sign: string; value: MetadataDocument } | undefined;

function fileSignature(s: { mtimeMs: number; ctimeMs: number; size: number }): string {
  return `${s.mtimeMs}-${s.ctimeMs}-${s.size}`;
}

function metadataPath(): string {
  return process.env.TENCENT_MCP_METADATA_FILE || DEFAULT_PATH;
}

function parseDocument(text: string): MetadataDocument {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const json = (match?.[1] ?? text).trim();
  const parsed: unknown = JSON.parse(json);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("metadata.md must contain a JSON object.");
  }
  return parsed as MetadataDocument;
}

export async function loadMetadata(): Promise<MetadataDocument> {
  const path = metadataPath();
  try {
    const fileStat = await stat(path);
    const sign = fileSignature(fileStat);
    if (cached?.path === path && cached.sign === sign) return cached.value;
    const value = parseDocument(await readFile(path, "utf8"));
    cached = { path, sign, value };
    return value;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return {};
    throw new Error(`Unable to read ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getMetadataContext(): Promise<MetadataDocument> {
  return loadMetadata();
}

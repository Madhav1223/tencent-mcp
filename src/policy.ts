// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type Decision =
  { allow: true; reason: string; readonly: boolean } | { allow: false; reason: string; readonly: boolean };

// ---------------------------------------------------------------------------
// Profiles file schema
// ---------------------------------------------------------------------------

interface ProfileEntry {
  label: string;
  allowedMutations: string[];
  readonlyPrefixes?: string[];
  denyPrefixes?: string[];
}

interface ProfilesFile {
  _comment?: unknown;
  _defaults?: {
    readonlyPrefixes?: string[];
    denyPrefixes?: string[];
  };
  [profileName: string]: ProfileEntry | unknown;
}

// ---------------------------------------------------------------------------
// Built-in profiles — always available even when mutation-profiles.json is
// absent (e.g. plain `docker run` without a ./config bind-mount).
// The JSON file, when present, is merged on top: its entries win for any name
// that appears in both. This means users can override built-in profiles in
// the file without touching code.
// ---------------------------------------------------------------------------

const BUILTIN_READONLY_PREFIXES = [
  "Describe",
  "Get",
  "List",
  "Head",
  "Query",
  "InquiryPrice",
  "Check",
  "Preview",
  "Count",
  "Search",
  "Statistic",
  "Export",
  "Download",
  "multipartList",
  "selectObjectContent",
];

const BUILTIN_DENY_PREFIXES = [
  "Delete",
  "Destroy",
  "Terminate",
  "Drop",
  "Remove",
  "Release",
  "Reset",
  "Purge",
  "Stop",
  "Kill",
  "Cancel",
  "Modify",
  "Renew",
  "Recover",
  "Restart",
];

/** Profiles baked into the image — zero external dependencies. */
const BUILTIN_PROFILES: Record<string, ProfileEntry> = {
  default: {
    label: "Default — DLC SQL execution only (safe baseline)",
    allowedMutations: ["dlc:CreateTask", "dlc:CreateTasks", "dlc:CreateTaskSync", "dlc:CreateSparkSessionBatchSQL"],
  },
  readonly: {
    label: "Read-only — zero mutations, safest, CI/reporting/audit environments",
    allowedMutations: [],
    denyPrefixes: [
      ...BUILTIN_DENY_PREFIXES,
      "Create",
      "Update",
      "Put",
      "Run",
      "Start",
      "Upload",
      "Submit",
      "Send",
      "Trigger",
      "Execute",
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function csv(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function envList(envName: string, fallback: string[]): string[] {
  const raw = process.env[envName];
  if (!raw || raw.trim() === "") return fallback;
  return csv(raw);
}

/**
 * Singular/plural equivalence: allowing 'dlc:CreateTask' also covers
 * 'dlc:CreateTasks' and vice versa. Only trailing-"s" morphology — no stemming.
 */
function sameActionVariant(allowed: string, action: string): boolean {
  if (allowed === action) return true;
  if (allowed + "s" === action) return true;
  if (action + "s" === allowed) return true;
  return false;
}

function isProfileEntry(v: unknown): v is ProfileEntry {
  return (
    typeof v === "object" &&
    v !== null &&
    "label" in v &&
    "allowedMutations" in v &&
    Array.isArray((v as ProfileEntry).allowedMutations)
  );
}

// ---------------------------------------------------------------------------
// Profile loader
//
// Resolution order (first found wins):
//   1. User profile from mutation-profiles.json (if file exists)
//   2. Built-in profile baked into the image
//
// If the file exists but is invalid JSON → hard error (misconfiguration).
// If the file exists but the named profile is not in it → check builtins.
// If neither the file nor builtins have the profile → hard error with hint.
// ---------------------------------------------------------------------------

function loadProfile(profileName: string): {
  label: string;
  readonlyPrefixes: string[];
  denyPrefixes: string[];
  allowedMutations: string[];
  source: string;
} {
  const profilesPath = resolve(process.env["TENCENT_MCP_PROFILES_FILE"] ?? "config/mutation-profiles.json");

  // Try to read the user file — missing file is fine, any other error is not.
  const fileProfiles: Record<string, ProfileEntry> = {};
  let fileReadonly = BUILTIN_READONLY_PREFIXES;
  let fileDeny = BUILTIN_DENY_PREFIXES;
  let fileLoaded = false;

  try {
    const raw = readFileSync(profilesPath, "utf8");
    const file = JSON.parse(raw) as ProfilesFile;
    fileLoaded = true;

    const defs = file["_defaults"] as ProfilesFile["_defaults"] | undefined;
    if (defs?.readonlyPrefixes) fileReadonly = defs.readonlyPrefixes;
    if (defs?.denyPrefixes) fileDeny = defs.denyPrefixes;

    for (const [key, val] of Object.entries(file)) {
      if (!key.startsWith("_") && isProfileEntry(val)) {
        fileProfiles[key] = val;
      }
    }
  } catch (err) {
    // ENOENT → silently use builtins; anything else (bad JSON, permissions) → fail fast.
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`mutation-profiles.json found at '${profilesPath}' but could not be parsed: ${msg}`);
    }
  }

  // File profile wins over builtin for the same name.
  const entry = fileProfiles[profileName] ?? BUILTIN_PROFILES[profileName];
  if (!entry) {
    const fromFile = Object.keys(fileProfiles).join(", ") || "(none)";
    const fromBuiltin = Object.keys(BUILTIN_PROFILES).join(", ");
    throw new Error(
      `Unknown profile '${profileName}'. ` +
        (fileLoaded
          ? `Profiles in '${profilesPath}': ${fromFile}. `
          : `No mutation-profiles.json found at '${profilesPath}'. `) +
        `Built-in profiles: ${fromBuiltin}. ` +
        `Add a '${profileName}' key to mutation-profiles.json and restart.`,
    );
  }

  const defaultReadonly = fileProfiles[profileName] ? fileReadonly : BUILTIN_READONLY_PREFIXES;
  const defaultDeny = fileProfiles[profileName] ? fileDeny : BUILTIN_DENY_PREFIXES;
  const source = fileProfiles[profileName] ? profilesPath : "built-in";

  return {
    label: entry.label,
    readonlyPrefixes: entry.readonlyPrefixes ?? defaultReadonly,
    denyPrefixes: entry.denyPrefixes ?? defaultDeny,
    allowedMutations: entry.allowedMutations,
    source,
  };
}

// ---------------------------------------------------------------------------
// SafetyPolicy
// ---------------------------------------------------------------------------

export class SafetyPolicy {
  readonly profileName: string;
  readonly profileLabel: string;
  readonly profileSource: string;
  readonly readonlyPrefixes: string[];
  readonly denyPrefixes: string[];
  readonly allowedMutations: string[];

  constructor() {
    this.profileName = (process.env["TENCENT_MCP_PROFILE"] ?? "default").trim();
    const profile = loadProfile(this.profileName);
    this.profileLabel = profile.label;
    this.profileSource = profile.source;
    // Env-var overrides win on top of the profile — fine-tune without editing the file.
    this.readonlyPrefixes = envList("TENCENT_MCP_READONLY_PREFIXES", profile.readonlyPrefixes);
    this.denyPrefixes = envList("TENCENT_MCP_DENY_PREFIXES", profile.denyPrefixes);
    this.allowedMutations = envList("TENCENT_MCP_ALLOW_MUTATIONS", profile.allowedMutations);
  }

  decide(service: string, action: string): Decision {
    if (!action || typeof action !== "string") {
      return { allow: false, reason: "Action must be a non-empty string", readonly: true };
    }
    const lowered = action.toLowerCase();

    const readonlyHit = this.readonlyPrefixes.find((p) => lowered.startsWith(p.toLowerCase()));
    if (readonlyHit) {
      return { allow: true, reason: `readonly prefix '${readonlyHit}'`, readonly: true };
    }

    const denyHit = this.denyPrefixes.find((p) => lowered.startsWith(p.toLowerCase()));
    if (denyHit) {
      return {
        allow: false,
        reason: `denied: action starts with dangerous prefix '${denyHit}'`,
        readonly: false,
      };
    }

    const allowedEntry = this.allowedMutations.find((m) => {
      const [svc, act] = m.split(":");
      return (svc === "*" || svc === service) && (act === "*" || sameActionVariant(act, action));
    });
    if (allowedEntry) {
      const variant = allowedEntry.endsWith(`:${action}`) ? "" : " (singular/plural variant)";
      return { allow: true, reason: `explicit allowlist entry '${allowedEntry}'${variant}`, readonly: false };
    }

    return {
      allow: false,
      reason:
        `denied by default: '${service}:${action}' is neither a readonly action nor an allowlisted mutation. ` +
        `Add '${service}:${action}' to the '${this.profileName}' profile in mutation-profiles.json and restart.`,
      readonly: false,
    };
  }

  configSummary(): Record<string, unknown> {
    return {
      profile: this.profileName,
      profileLabel: this.profileLabel,
      profileSource: this.profileSource,
      profilesFile: process.env["TENCENT_MCP_PROFILES_FILE"] ?? "config/mutation-profiles.json",
      readonlyPrefixes: this.readonlyPrefixes,
      denyPrefixes: this.denyPrefixes,
      allowedMutations: this.allowedMutations,
    };
  }
}

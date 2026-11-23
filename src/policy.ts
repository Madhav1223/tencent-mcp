// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type Decision =
  | { allow: true; reason: string; readonly: boolean }
  | { allow: false; reason: string; readonly: boolean };

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

const FALLBACK_READONLY_PREFIXES = [
  "Describe", "Get", "List", "Head", "Query",
  "InquiryPrice", "Check", "Preview", "Count",
  "Search", "Statistic", "Export", "Download",
  "multipartList", "selectObjectContent",
];

const FALLBACK_DENY_PREFIXES = [
  "Delete", "Destroy", "Terminate", "Drop",
  "Remove", "Release", "Reset", "Purge",
  "Stop", "Kill", "Cancel", "Modify",
  "Renew", "Recover", "Restart",
];

function csv(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function envList(envName: string, fallback: string[]): string[] {
  const raw = process.env[envName];
  if (!raw || raw.trim() === "") return fallback;
  return csv(raw);
}

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

function loadProfile(profileName: string): {
  label: string;
  readonlyPrefixes: string[];
  denyPrefixes: string[];
  allowedMutations: string[];
} {
  const profilesPath = resolve(
    process.env["TENCENT_MCP_PROFILES_FILE"] ?? "config/mutation-profiles.json",
  );

  let file: ProfilesFile;
  try {
    file = JSON.parse(readFileSync(profilesPath, "utf8")) as ProfilesFile;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load mutation profiles from '${profilesPath}': ${msg}`);
  }

  const defaults = file["_defaults"] as ProfilesFile["_defaults"] | undefined;
  const defaultReadonly = defaults?.readonlyPrefixes ?? FALLBACK_READONLY_PREFIXES;
  const defaultDeny = defaults?.denyPrefixes ?? FALLBACK_DENY_PREFIXES;

  const entry = file[profileName];
  if (!isProfileEntry(entry)) {
    const known = Object.keys(file)
      .filter((k) => !k.startsWith("_") && isProfileEntry(file[k]))
      .join(", ");
    throw new Error(
      `Unknown profile '${profileName}' in '${profilesPath}'. ` +
      `Known profiles: ${known || "(none)"}. ` +
      `Add a '${profileName}' key to the file and restart.`,
    );
  }

  return {
    label: entry.label,
    readonlyPrefixes: entry.readonlyPrefixes ?? defaultReadonly,
    denyPrefixes: entry.denyPrefixes ?? defaultDeny,
    allowedMutations: entry.allowedMutations,
  };
}

export class SafetyPolicy {
  readonly profileName: string;
  readonly profileLabel: string;
  readonly readonlyPrefixes: string[];
  readonly denyPrefixes: string[];
  readonly allowedMutations: string[];

  constructor() {
    this.profileName = (process.env["TENCENT_MCP_PROFILE"] ?? "default").trim();
    const profile = loadProfile(this.profileName);
    this.profileLabel = profile.label;
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
      profilesFile: process.env["TENCENT_MCP_PROFILES_FILE"] ?? "config/mutation-profiles.json",
      readonlyPrefixes: this.readonlyPrefixes,
      denyPrefixes: this.denyPrefixes,
      allowedMutations: this.allowedMutations,
    };
  }
}

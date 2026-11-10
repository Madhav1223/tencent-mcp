// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

export type Decision =
  | { allow: true; reason: string; readonly: boolean }
  | { allow: false; reason: string; readonly: boolean };

const DEFAULT_READONLY_PREFIXES = [
  "Describe", "Get", "List", "Head", "Query",
  "InquiryPrice", "Check", "Preview", "Count",
  "Search", "Statistic", "Export", "Download",
  "multipartList", "selectObjectContent",
];

const DEFAULT_DENY_PREFIXES = [
  "Delete", "Destroy", "Terminate", "Drop",
  "Remove", "Release", "Reset", "Purge",
  "Stop", "Kill", "Cancel", "Modify",
  "Renew", "Recover", "Restart",
];

const DEFAULT_ALLOWED_MUTATIONS = [
  "dlc:StartRayCluster",
  "dlc:StartLab",
  "dlc:SwitchDataEngine",
  "dlc:CreateTask",
  "dlc:CreateTasks",
  "dlc:CreateTaskSync",
  "dlc:CreateSparkSessionBatchSQL",
  "wedata:CreateTriggerWorkflowRun",
  "emr:StartJobs",
  "emr:StartSparkSubmitTask",
  "emr:RunJobFlow",
  "tke:StartKubeedgeGateway",
  "tke:StartService",
];

function sameActionVariant(allowed: string, action: string): boolean {
  if (allowed === action) return true;
  if (allowed + "s" === action) return true;
  if (action + "s" === allowed) return true;
  return false;
}

function csv(name: string): string[] {
  return name.split(",").map((s) => s.trim()).filter(Boolean);
}

function envList(envName: string, fallback: string[]): string[] {
  const raw = process.env[envName];
  if (!raw || raw.trim() === "") return fallback;
  return csv(raw);
}

export class SafetyPolicy {
  readonly readonlyPrefixes: string[];
  readonly denyPrefixes: string[];
  readonly allowedMutations: string[];

  constructor() {
    this.readonlyPrefixes = envList("TENCENT_MCP_READONLY_PREFIXES", DEFAULT_READONLY_PREFIXES);
    this.denyPrefixes = envList("TENCENT_MCP_DENY_PREFIXES", DEFAULT_DENY_PREFIXES);
    this.allowedMutations = envList("TENCENT_MCP_ALLOW_MUTATIONS", DEFAULT_ALLOWED_MUTATIONS);
  }

  decide(service: string, action: string): Decision {
    if (!action || typeof action !== "string") {
      return { allow: false, reason: "Action must be a non-empty string", readonly: true };
    }
    const lowered = action.toLowerCase();
    const expectedReadonlyPrefix = this.readonlyPrefixes.find((p) => lowered.startsWith(p.toLowerCase()));
    if (expectedReadonlyPrefix) {
      return { allow: true, reason: `readonly prefix '${expectedReadonlyPrefix}'`, readonly: true };
    }
    const expectedDenyPrefix = this.denyPrefixes.find((p) => lowered.startsWith(p.toLowerCase()));
    if (expectedDenyPrefix) {
      return {
        allow: false,
        reason: `denied: action starts with dangerous prefix '${expectedDenyPrefix}'`,
        readonly: false,
      };
    }
    const allowedEntry = this.allowedMutations.find((m) => {
      const [svc, act] = m.split(":");
      return svc === service && (act === "*" || sameActionVariant(act, action));
    });
    if (allowedEntry) {
      const variant = allowedEntry.endsWith(`:${action}`) ? "" : " (singular/plural variant)";
      return { allow: true, reason: `explicit allowlist entry '${allowedEntry}'${variant}`, readonly: false };
    }
    return {
      allow: false,
      reason:
        `denied by default (deny-by-default): '${service}:${action}' is neither a readonly action ` +
        `nor an allowlisted mutation. Add '${service}:${action}' to TENCENT_MCP_ALLOW_MUTATIONS if intended.`,
      readonly: false,
    };
  }

  configSummary(): Record<string, unknown> {
    return {
      readonlyPrefixes: this.readonlyPrefixes,
      denyPrefixes: this.denyPrefixes,
      allowedMutations: this.allowedMutations,
    };
  }
}

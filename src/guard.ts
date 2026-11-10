// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { auditCall } from "./audit.js";
import { getLogger } from "./log.js";
import { SafetyPolicy } from "./policy.js";
import { callTencentApi, CallResult } from "./sdk.js";

let sharedPolicy: SafetyPolicy | undefined;

export function getPolicy(): SafetyPolicy {
  if (!sharedPolicy) sharedPolicy = new SafetyPolicy();
  return sharedPolicy;
}

/**
 * checkedCall is the ONLY path any Tencent Cloud API request may take
 * (user-initiated tool calls and internal sub-calls alike). It enforces
 * three invariants:
 *
 *   1. every request is checked explicitly against the SafetyPolicy,
 *   2. every request is logged (structured log line),
 *   3. every request is audited (file + Loki sinks) with outcome
 *      success|error|blocked.
 *
 * Blocked requests throw; callers must not catch-and-continue silently.
 */
export async function checkedCall(
  service: string,
  action: string,
  params: Record<string, unknown>,
  region?: string,
  opts: { readonlyOverride?: boolean; httpTimeout?: number; version?: string } = {},
): Promise<CallResult> {
  const policy = getPolicy();
  const logger = getLogger();
  const decision = policy.decide(service, action);
  const started = Date.now();

  logger.info("tencent api request", {
    request: { service, action, region: region ?? null, version: opts.version ?? null },
    policy: { allow: decision.allow, readonly: decision.readonly, reason: decision.reason },
  });

  if (!decision.allow) {
    await auditCall({
      service,
      action,
      params,
      region,
      allowed: false,
      readonly: decision.readonly,
      reason: decision.reason,
      durationMs: Date.now() - started,
      outcome: "blocked",
    });
    throw new Error(`Blocked by safety policy: ${decision.reason}`);
  }

  const readonly = opts.readonlyOverride ?? decision.readonly;
  try {
    const result = await callTencentApi(
      service,
      action,
      params,
      region,
      opts.httpTimeout || opts.version ? { httpTimeout: opts.httpTimeout, version: opts.version } : undefined,
    );
    await auditCall({
      service,
      action,
      params,
      region,
      allowed: true,
      readonly,
      reason: decision.reason,
      durationMs: Date.now() - started,
      outcome: "success",
    });
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await auditCall({
      service,
      action,
      params,
      region,
      allowed: true,
      readonly,
      reason: decision.reason,
      durationMs: Date.now() - started,
      outcome: "error",
      error: message,
    });
    throw err;
  }
}

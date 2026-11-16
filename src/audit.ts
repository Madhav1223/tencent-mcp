// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { createWriteStream, mkdirSync, WriteStream } from "node:fs";
import { dirname } from "node:path";
import { hostname } from "node:os";

export interface AuditEntry {
  service: string;
  action: string;
  params?: Record<string, unknown>;
  region?: string;
  allowed: boolean;
  readonly?: boolean;
  reason?: string;
  durationMs?: number;
  outcome?: "success" | "error" | "blocked" | "failed";
  error?: string;
}

const SECRET_KEYS = new Set([
  "secretid",
  "secretkey",
  "token",
  "password",
  "passwd",
  "apikey",
  "api_key",
  "privatekey",
  "credential",
]);

function redact(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "object") {
    if (Array.isArray(value)) return value.map((v) => redact(v));
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : redact(v);
    }
    return out;
  }
  return value;
}

export class AuditLogger {
  private stream?: WriteStream;
  private esEndpoint?: string;
  private esIndex: string;
  private esApiKey?: string;
  private esUser?: string;
  private esPwd?: string;
  private lokiEndpoint?: string;
  private lokiTenant?: string;
  private closed = false;

  constructor() {
    const file = process.env.TENCENT_MCP_AUDIT_FILE;
    if (file) {
      mkdirSync(dirname(file), { recursive: true });
      this.stream = createWriteStream(file, { flags: "a" });
    }
    this.esEndpoint = process.env.TENCENT_MCP_ES_ENDPOINT;
    this.esIndex = process.env.TENCENT_MCP_ES_INDEX || "tencent-mcp-audit";
    this.esApiKey = process.env.TENCENT_MCP_ES_API_KEY;
    this.esUser = process.env.TENCENT_MCP_ES_USER;
    this.esPwd = process.env.TENCENT_MCP_ES_PASSWORD;
    this.lokiEndpoint = process.env.TENCENT_MCP_LOKI_ENDPOINT;
    this.lokiTenant = process.env.TENCENT_MCP_LOKI_TENANT;
  }

  async record(entry: AuditEntry): Promise<void> {
    const outcome = entry.allowed ? (entry.outcome ?? "success") : "blocked";
    const record = {
      "@timestamp": new Date().toISOString(),
      level: outcome === "error" || outcome === "failed" ? "error" : outcome === "blocked" ? "warning" : "info",
      event: {
        action: "tencent-mcp-api-call",
        category: ["process"],
        outcome,
        type: ["api"],
      },
      host: { hostname: hostname() },
      user: { name: process.env.USER || "unknown" },
      source: {
        mcp_server: "tencent-mcp",
        service: entry.service,
        action: entry.action,
        region: entry.region,
        readonly: entry.readonly ?? null,
        allowed: entry.allowed,
        decision_reason: entry.reason,
        duration_ms: entry.durationMs ?? null,
        params: redact(entry.params ?? null),
      },
    };
    if (entry.error) (record as Record<string, unknown>).error = entry.error;
    const line = JSON.stringify(record);
    if (this.stream) {
      this.stream.write(line + "\n");
    }
    if (this.esEndpoint) {
      await this.pushToES(record).catch((err) => {
        console.error(`[audit] ES push failed: ${err.message}`);
      });
    }
    if (this.lokiEndpoint) {
      await this.pushToLoki(record).catch((err) => {
        console.error(`[audit] Loki push failed: ${err instanceof Error ? err.message : String(err)}`);
      });
    }
  }

  private async pushToLoki(record: Record<string, unknown>): Promise<void> {
    if (!this.lokiEndpoint) return;
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (this.lokiTenant) headers["x-scope-orgid"] = this.lokiTenant;
    const tsNs = (BigInt(Date.now()) * 1_000_000n).toString();
    const payload = {
      streams: [
        {
          stream: {
            job: "tencent-mcp-audit",
            service: String((record.source as any)?.service ?? "unknown"),
            outcome: String((record.event as any)?.outcome ?? "unknown"),
          },
          values: [[tsNs, JSON.stringify(record)]],
        },
      ],
    };
    const url = `${this.lokiEndpoint.replace(/\/$/, "")}/loki/api/v1/push`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Loki responded ${res.status}: ${await res.text()}`);
    }
  }

  private async pushToES(record: Record<string, unknown>): Promise<void> {
    if (!this.esEndpoint) return;
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (this.esApiKey) headers.authorization = `ApiKey ${this.esApiKey}`;
    else if (this.esUser && this.esPwd) {
      headers.authorization = `Basic ${Buffer.from(`${this.esUser}:${this.esPwd}`).toString("base64")}`;
    }
    const url = `${this.esEndpoint.replace(/\/$/, "")}/${this.esIndex}/_doc`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      throw new Error(`ES responded ${res.status}: ${await res.text()}`);
    }
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.stream?.end();
  }
}

export const auditLogger = new AuditLogger();

export async function auditCall(entry: AuditEntry): Promise<void> {
  try {
    await auditLogger.record(entry);
  } catch (err) {
    console.error(`[audit] failed: ${err instanceof Error ? err.message : err}`);
  }
}

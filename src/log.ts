// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { createWriteStream, mkdirSync, WriteStream } from "node:fs";
import { dirname } from "node:path";
import { hostname } from "node:os";
import { Socket } from "node:net";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogFields {
  [key: string]: unknown;
}

/**
 * LogShipper emits structured JSON log lines (ECS-ish/observability-friendly)
 * to three kinds of sink at once, mirroring the AuditLogger pattern:
 *
 *   1. console (stdout)                          - docker logs
 *   2. a JSONL file (TENCENT_MCP_LOG_FILE)       - durable copy on a docker volume
 *   3. Logstash over TCP (TENCENT_MCP_LOGSTASH_HOST / _PORT)   - ELK alternative
 *   4. Grafana Loki push API (TENCENT_MCP_LOKI_ENDPOINT)       - lightweight stack
 *
 * It is intentionally best-effort: if a remote sink is down it buffers a
 * bounded number of lines and never crashes the MCP server. The file sink is
 * the source of truth and is always written.
 */
export class LogShipper {
  private file?: WriteStream;
  private host?: string;
  private port?: number;
  private socket?: Socket;
  private connected = false;
  private reconnectTimer?: NodeJS.Timeout;
  private queue: string[] = [];
  private readonly maxQueue = 2000;
  private closed = false;

  private lokiEndpoint?: string;
  private lokiTenant?: string;
  private lokiBuffer: { line: string; level: LogLevel; tsNs: string }[] = [];
  private lokiTimer?: NodeJS.Timeout;

  constructor() {
    const logFile = process.env.TENCENT_MCP_LOG_FILE;
    if (logFile) {
      try {
        mkdirSync(dirname(logFile), { recursive: true });
        this.file = createWriteStream(logFile, { flags: "a" });
      } catch {
        this.file = undefined;
      }
    }

    this.host = process.env.TENCENT_MCP_LOGSTASH_HOST;
    this.port = Number(process.env.TENCENT_MCP_LOGSTASH_PORT || 0) || undefined;
    if (this.host && this.port) {
      this.connect();
    }

    this.lokiEndpoint = process.env.TENCENT_MCP_LOKI_ENDPOINT;
    this.lokiTenant = process.env.TENCENT_MCP_LOKI_TENANT;
  }

  info(message: string, fields?: LogFields): void {
    this.write("info", message, fields);
  }

  warn(message: string, fields?: LogFields): void {
    this.write("warn", message, fields);
  }

  error(message: string, fields?: LogFields): void {
    this.write("error", message, fields);
  }

  debug(message: string, fields?: LogFields): void {
    this.write("debug", message, fields);
  }

  write(level: LogLevel, message: string, fields?: LogFields): void {
    if (this.closed) return;
    const record = {
      "@timestamp": new Date().toISOString(),
      log: { level },
      message,
      service: { name: "tencent-mcp" },
      host: { hostname: hostname() },
      ...(fields ?? {}),
    };
    const line = JSON.stringify(record);
    console.log(line);
    this.file?.write(line + "\n");
    this.send(line);
    this.bufferLoki(line, level);
  }

  private send(line: string): void {
    if (!this.host || !this.port) return;
    if (!this.connected) {
      this.buffer(line);
      return;
    }
    this.socket?.write(line + "\n");
  }

  private buffer(line: string): void {
    this.queue.push(line);
    if (this.queue.length > this.maxQueue) this.queue.shift();
  }

  private connect(): void {
    if (!this.host || !this.port || this.closed) return;
    const socket = new Socket();
    this.socket = socket;
    socket.setNoDelay(true);
    socket.on("connect", () => {
      this.connected = true;
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      const flush = this.queue.splice(0);
      for (const line of flush) socket.write(line + "\n");
    });
    socket.on("error", () => {
      this.connected = false;
      this.scheduleReconnect();
    });
    socket.on("close", () => {
      this.connected = false;
      this.scheduleReconnect();
    });
    socket.connect(this.port, this.host);
  }

  private scheduleReconnect(): void {
    if (this.closed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connected = false;
      this.connect();
    }, 5000);
  }

  private bufferLoki(line: string, level: LogLevel): void {
    if (!this.lokiEndpoint) return;
    const tsNs = (BigInt(Date.now()) * 1_000_000n).toString();
    this.lokiBuffer.push({ line, level, tsNs });
    if (this.lokiBuffer.length >= 64) {
      void this.flushLoki();
      return;
    }
    if (!this.lokiTimer) {
      this.lokiTimer = setTimeout(() => {
        this.lokiTimer = undefined;
        void this.flushLoki();
      }, 2000);
    }
  }

  private async flushLoki(): Promise<void> {
    if (this.lokiTimer) {
      clearTimeout(this.lokiTimer);
      this.lokiTimer = undefined;
    }
    if (!this.lokiEndpoint || this.closed) {
      this.lokiBuffer = [];
      return;
    }
    const batch = this.lokiBuffer.splice(0);
    if (batch.length === 0) return;

    const byLevel = new Map<string, { tsNs: string; line: string }[]>();
    for (const entry of batch) {
      const list = byLevel.get(entry.level) ?? [];
      list.push(entry);
      byLevel.set(entry.level, list);
    }

    const streams = [...byLevel.entries()].map(([level, values]) => ({
      stream: { job: "tencent-mcp", level },
      values: values.map((v) => [v.tsNs, v.line]),
    }));

    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (this.lokiTenant) headers["x-scope-orgid"] = this.lokiTenant;
      const url = `${this.lokiEndpoint.replace(/\/$/, "")}/loki/api/v1/push`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ streams }),
      });
      if (!res.ok) {
        console.error(`[loki] push failed: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      console.error(`[loki] push failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  close(): void {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.lokiTimer) {
      clearTimeout(this.lokiTimer);
      this.lokiTimer = undefined;
    }
    this.socket?.destroy();
    this.file?.end();
    void this.flushLoki();
  }
}

const logger = new LogShipper();

export function getLogger(): LogShipper {
  return logger;
}

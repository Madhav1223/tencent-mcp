// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { getLogger } from "./log.js";
import {
  authenticateApproval,
  consumeApproval,
  getApproval,
  isApprovalCredentialsConfigured,
  sqlFingerprint,
} from "./approval.js";
import { getMetadataContext } from "./metadata.js";
import { listSkills } from "./skills.js";
import { defaultRegion, credentialFileProblem, resolveCredentials } from "./sdk.js";
import { checkedCall } from "./guard.js";

export interface HttpServerOptions {
  port: number;
  host: string;
  basePath: string;
  idleTimeoutMs: number;
  createCore: () => Server;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

interface Session {
  server: Server;
  transport: StreamableHTTPServerTransport;
  lastActive: number;
  createdAt: number;
}

/**
 * Single unified MCP layer: one localhost port, one base path, that any MCP
 * client can connect to over Streamable HTTP (SSE + JSON). Sessions are
 * tracked in-memory and cleaned up when idle or when the client sends DELETE.
 */
export function startHttpServer(options: HttpServerOptions): Promise<{ close: () => Promise<void> }> {
  const { port, host, basePath, idleTimeoutMs, createCore } = options;
  const logger = getLogger();

  const sessions = new Map<string, Session>();
  const pending = new Set<Session>();

  async function newSession(): Promise<Session> {
    const server = createCore();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: true,
      onsessioninitialized: (id: string) => {
        pair.lastActive = Date.now();
        sessions.set(id, pair);
        logger.info("mcp session initialized", {
          mcp: { session_id: id, active_sessions: sessions.size },
        });
      },
      onsessionclosed: (id: string) => {
        sessions.delete(id);
        logger.info("mcp session closed", {
          mcp: { session_id: id, active_sessions: sessions.size },
        });
      },
    });
    const pair: Session = { server, transport, lastActive: Date.now(), createdAt: Date.now() };
    try {
      await server.connect(transport);
    } catch (err) {
      logger.error("failed to connect mcp server to transport", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return pair;
  }

  function sweep(): void {
    const now = Date.now();
    for (const [id, session] of sessions) {
      if (now - session.lastActive > idleTimeoutMs) {
        logger.warn("closing idle mcp session", {
          mcp: { session_id: id, idle_ms: now - session.lastActive },
        });
        sessions.delete(id);
        session.transport.close().catch(() => undefined);
      }
    }
  }

  async function buildReadme(): Promise<string> {
    let metadata: unknown = {};
    try {
      metadata = await getMetadataContext();
    } catch {
      metadata = {};
    }
    const skills = await listSkills().catch(() => []);
    const skillsSection =
      skills.length === 0
        ? "_No skills found._ Add markdown files to `config/skills/` (mounted at `/app/config/skills`) or `/app/skills/refined|unrefined/` via `save_knowledge`. Example: `config/skills/cost-optimization.md`."
        : skills
            .map(
              (s) =>
                `- **${s.name}** \`${s.path}\` — ${
                  s.content
                    .split("\n")
                    .find((l) => l.trim() && !l.startsWith(">") && !l.startsWith("#"))
                    ?.slice(0, 140) ?? ""
                }`,
            )
            .join("\n");
    const configuredTemplatePath = process.env.TENCENT_MCP_README_FILE;
    let template: string;
    if (configuredTemplatePath) {
      template = await readFile(configuredTemplatePath, "utf8");
    } else {
      const templatePaths = [
        resolve("config/mcp-readme.md"),
        "/app/config-baked/mcp-readme.md",
        resolve("config-baked/mcp-readme.md"),
      ];
      let lastError: unknown;
      template = "";
      for (const templatePath of templatePaths) {
        try {
          template = await readFile(templatePath, "utf8");
          break;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
          lastError = error;
        }
      }
      if (!template) {
        throw lastError instanceof Error
          ? lastError
          : new Error(`Unable to find MCP readme template in: ${templatePaths.join(", ")}`);
      }
    }
    return template
      .replaceAll("{{BASE_PATH}}", basePath)
      .replaceAll("{{PORT}}", String(port))
      .replaceAll("{{METADATA}}", JSON.stringify(metadata, null, 2))
      .replaceAll("{{SKILLS_COUNT}}", String(skills.length))
      .replaceAll("{{SKILLS_SECTION}}", skillsSection);
  }

  // ---- STS helper (cached, short timeout so health stays fast) -------------
  const STS_CACHE_TTL_MS = 30_000;
  let stsCache: { at: number; payload: Record<string, unknown> } | null = null;
  async function fetchStsPayload(): Promise<Record<string, unknown>> {
    const now = Date.now();
    if (stsCache && now - stsCache.at < STS_CACHE_TTL_MS) return stsCache.payload;
    const creds = await resolveCredentials();
    if (!creds.secretId || !creds.secretKey) {
      const payload: Record<string, unknown> = {
        configured: false,
        ok: false,
        error:
          "Missing credentials. Provide creds/credentials.json at TENCENT_MCP_CRED_FILE (/app/creds/credentials.json)." +
          (credentialFileProblem() ? ` Reason: ${credentialFileProblem()}.` : ""),
        cred_file: process.env.TENCENT_MCP_CRED_FILE || "/app/creds/credentials.json",
      };
      stsCache = { at: now, payload };
      return payload;
    }
    const region = defaultRegion();
    const started = Date.now();
    try {
      const result = await checkedCall("sts", "GetCallerIdentity", {}, region, { httpTimeout: 5 });
      const identity = (result.response as Record<string, unknown>) ?? {};
      const payload: Record<string, unknown> = {
        configured: true,
        ok: true,
        region,
        duration_ms: Date.now() - started,
        identity,
        // Common fields for convenience (SDK shape varies)
        account_id: (identity as any)?.AccountId ?? (identity as any)?.accountId ?? null,
        app_id: (identity as any)?.AppId ?? (identity as any)?.appId ?? null,
        uin: (identity as any)?.Uin ?? (identity as any)?.uin ?? null,
      };
      stsCache = { at: now, payload };
      return payload;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const payload: Record<string, unknown> = {
        configured: true,
        ok: false,
        region,
        duration_ms: Date.now() - started,
        error: message,
      };
      stsCache = { at: now, payload };
      return payload;
    }
  }

  async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const rawPath = (req.url ?? "/").split("?")[0];
    const query = (req.url ?? "").includes("?")
      ? new URL(req.url ?? "/", `http://localhost`).searchParams
      : new URLSearchParams();
    const path = rawPath.replace(/\/$/, "") || "/";
    const normalizedBase = basePath.replace(/\/$/, "") || "/mcp";
    const method = req.method ?? "GET";
    // Every HTTP request is explicitly logged — satisfies "each and every request is logged" for the HTTP layer
    // (MCP tool calls are logged again inside handleTool; Tencent API calls are logged inside checkedCall).
    logger.info("http request", {
      http: { method, path: rawPath, base_path: basePath },
      headers: {
        accept: String(req.headers.accept ?? ""),
        mcp_session_id: String(req.headers["mcp-session-id"] ?? ""),
      },
    });

    // Dedicated STS endpoints — return caller identity (policy-checked + audited via checkedCall)
    if (method === "GET" && (path === "/sts" || path === "/health/sts" || path === "/healthz/sts")) {
      const sts = await fetchStsPayload();
      const status = sts.ok ? 200 : sts.configured ? 503 : 503;
      // Always 200 for health composite, but STS-only endpoint reflects ok
      sendJson(res, status, {
        ok: Boolean(sts.ok),
        service: "tencent-mcp",
        version: "0.1.1",
        time: new Date().toISOString(),
        sts,
      });
      return;
    }

    if (method === "GET" && (path === "/healthz" || path === "/health")) {
      const includeSts = query.get("sts") === "1" || query.get("include") === "sts" || query.get("with") === "sts";
      if (includeSts) {
        const sts = await fetchStsPayload();
        sendJson(res, 200, {
          ok: true,
          service: "tencent-mcp",
          version: "0.1.1",
          time: new Date().toISOString(),
          sts,
        });
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          service: "tencent-mcp",
          version: "0.1.1",
          time: new Date().toISOString(),
        }),
      );
      return;
    }

    const approvalMatch = path.match(/^\/approvals\/([^/]+)$/);
    if (approvalMatch) {
      if (!isApprovalCredentialsConfigured()) {
        sendJson(res, 503, { error: "human_approval_not_configured" });
        return;
      }
      if (!authenticateApproval(req.headers.authorization)) {
        res.setHeader("www-authenticate", 'Basic realm="Tencent MCP approvals"');
        sendJson(res, 401, { error: "human_authentication_required" });
        return;
      }
      const id = approvalMatch[1];
      const approval = getApproval(id);
      if (!approval) {
        sendJson(res, 404, { error: "approval_not_found_or_expired" });
        return;
      }
      if (method === "GET") {
        sendJson(res, 200, {
          id: approval.id,
          operation: approval.operation,
          sql: approval.sql,
          sql_sha256: sqlFingerprint(approval.sql),
          created_at: approval.createdAt,
          expires_at: new Date(approval.expiresAt).toISOString(),
        });
        return;
      }
      if (method === "POST") {
        const body = await readJson(req);
        if (body.approve !== true) {
          sendJson(res, 400, { error: "approval_requires_approve_true" });
          return;
        }
        const consumed = consumeApproval(id);
        if (!consumed) {
          sendJson(res, 404, { error: "approval_not_found_or_already_used" });
          return;
        }
        try {
          sendJson(res, 200, { approved: true, id, result: await consumed.execute() });
        } catch (error) {
          sendJson(res, 500, { approved: true, id, error: error instanceof Error ? error.message : String(error) });
        }
        return;
      }
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }

    if (
      method === "GET" &&
      (path === `${normalizedBase}/readme` || path === "/mcp/readme" || path === `${basePath}/readme`)
    ) {
      const md = await buildReadme();
      const accept = String(req.headers.accept ?? "");
      if (accept.includes("application/json")) {
        sendJson(res, 200, { readme: md });
      } else {
        res.writeHead(200, { "content-type": "text/markdown; charset=utf-8" });
        res.end(md);
      }
      return;
    }

    if (path === "/") {
      const accept = String(req.headers.accept ?? "");
      const endpoints = [
        { method: "GET", path: "/", brief: "This index — all available endpoints" },
        { method: "GET", path: "/healthz", brief: "Health check — ok, version, time (also /health)" },
        { method: "GET", path: "/healthz?sts=1", brief: "Health + STS caller identity (also ?include=sts)" },
        {
          method: "GET",
          path: "/sts",
          brief: "STS GetCallerIdentity — verify credentials (also /health/sts, /healthz/sts)",
        },
        {
          method: "GET",
          path: "/mcp/readme",
          brief: "Agent readme — tools, policy, skills (also /mcp/readme via basePath)",
        },
        {
          method: "POST",
          path: basePath,
          brief: "MCP Streamable HTTP — JSON-RPC with mcp-session-id (also GET/DELETE for SSE)",
        },
        { method: "GET", path: "/approvals/:id", brief: "Get pending approval (Basic auth)" },
        { method: "POST", path: "/approvals/:id", brief: "Approve dangerous SQL with {approve:true} (Basic auth)" },
      ];
      if (accept.includes("text/html")) {
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Tencent MCP</title></head><body style="font-family:system-ui;padding:24px"><h1>Tencent MCP ${"0.1.1"}</h1><p>Unified Tencent Cloud MCP — <code>http://localhost:${port}${basePath}</code></p><table border="1" cellpadding="6" style="border-collapse:collapse"><tr><th>Method</th><th>Path</th><th>Brief</th></tr>${endpoints.map((e) => `<tr><td>${e.method}</td><td><code>${e.path}</code></td><td>${e.brief}</td></tr>`).join("")}</table><p><a href="/mcp/readme">/mcp/readme</a> · <a href="/healthz">/healthz</a> · <a href="/sts">/sts</a></p></body></html>`;
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(html);
        return;
      }
      sendJson(res, 200, {
        ok: true,
        service: "tencent-mcp",
        version: "0.1.1",
        time: new Date().toISOString(),
        endpoint: `http://localhost:${port}${basePath}`,
        endpoints,
        hint: "curl http://localhost:8000/mcp/readme for full readme",
      });
      return;
    }

    if (path !== basePath && path !== normalizedBase) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "not_found", path }));
      return;
    }

    if (method === "GET" || method === "POST" || method === "DELETE") {
      const sessionId = String(req.headers["mcp-session-id"] ?? "");
      const session = sessions.get(sessionId);
      if (session) {
        session.lastActive = Date.now();
        await handleWith(session, req, res, sessionId);
        return;
      }
      if (method === "POST") {
        // First request for a session: the transport decides whether it is a
        // valid initialization or an error (it sets up the session id when the
        // initialize JSON-RPC request arrives).
        const created = await newSession();
        pending.add(created);
        res.on("close", () => pending.delete(created));
        await handleWith(created, req, res, "");
        return;
      }
      // GET (SSE) and DELETE always require an existing session.
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32001, message: "Session not found" },
        }),
      );
      return;
    }

    // OPTIONS or anything else
    if (method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
        "access-control-allow-headers": "content-type, mcp-session-id, accept, mcp-protocol-version",
      });
      res.end();
      return;
    }

    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "method_not_allowed", method }));
  }

  async function handleWith(
    session: Session,
    req: IncomingMessage,
    res: ServerResponse,
    sessionId: string,
  ): Promise<void> {
    const started = Date.now();
    try {
      await session.transport.handleRequest(req, res);
      logger.debug("mcp http request handled", {
        mcp: {
          session_id: sessionId || undefined,
          method: req.method,
          path: req.url,
          duration_ms: Date.now() - started,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("mcp http request failed", {
        mcp: {
          session_id: sessionId || undefined,
          method: req.method,
          path: req.url,
          duration_ms: Date.now() - started,
        },
        error: message,
      });
      if (!res.writableEnded) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32603, message } }));
      }
    }
  }

  const server = createServer(async (req, res) => {
    try {
      await route(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("mcp http router failed", { error: message });
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "application/json" });
      }
      if (!res.writableEnded) res.end(JSON.stringify({ error: message }));
    }
  });

  const interval = setInterval(sweep, 60_000);
  interval.unref();

  return new Promise((resolve) => {
    server.listen(port, host, () => {
      logger.info("tencent-mcp http server listening", {
        mcp: {
          host,
          port,
          base_path: basePath,
          endpoint: `http://localhost:${port}${basePath}`,
        },
      });
      resolve({
        close: async () => {
          clearInterval(interval);
          for (const session of [...sessions.values(), ...pending]) {
            await session.transport.close().catch(() => undefined);
          }
          await new Promise<void>((done) => server.close(() => done()));
        },
      });
    });
  });
}

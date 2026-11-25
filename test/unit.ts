// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type Server as NodeServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { startHttpServer } from "../src/http.js";
import { listSkills } from "../src/skills.js";

async function getFreePort(): Promise<number> {
  const listener: NodeServer = createServer();
  await new Promise<void>((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => resolve());
  });
  const address = listener.address();
  assert(address && typeof address !== "string");
  const port = address.port;
  await new Promise<void>((resolve, reject) => listener.close((error) => (error ? reject(error) : resolve())));
  return port;
}

test("listSkills discovers nested skills and derives skill directory names", async () => {
  const root = await mkdtemp(join(tmpdir(), "tencent-mcp-skills-"));
  const previous = process.env.TENCENT_MCP_SKILLS_DIR;
  process.env.TENCENT_MCP_SKILLS_DIR = root;
  try {
    await mkdir(join(root, "nested"));
    await writeFile(join(root, "plain-test-skill.md"), "# Plain skill\nUse the test path.\n");
    await writeFile(join(root, "nested", "skill.md"), "# Nested skill\nUse the nested path.\n");

    const skills = await listSkills();
    const plain = skills.find((skill) => skill.name === "plain-test-skill");
    const nested = skills.find((skill) => skill.name === "nested");

    assert.equal(plain?.content, "# Plain skill\nUse the test path.\n");
    assert.equal(nested?.content, "# Nested skill\nUse the nested path.\n");
  } finally {
    if (previous === undefined) delete process.env.TENCENT_MCP_SKILLS_DIR;
    else process.env.TENCENT_MCP_SKILLS_DIR = previous;
    await rm(root, { recursive: true, force: true });
  }
});

test("HTTP readme loads the file template and replaces runtime values", async () => {
  const port = await getFreePort();
  const http = await startHttpServer({
    port,
    host: "127.0.0.1",
    basePath: "/mcp",
    idleTimeoutMs: 60_000,
    createCore: () => {
      const server = new Server({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } });
      server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [] }));
      server.setRequestHandler(CallToolRequestSchema, async () => ({ content: [{ type: "text", text: "ok" }] }));
      return server;
    },
  });

  try {
    const response = await fetch(`http://127.0.0.1:${port}/mcp/readme`);
    assert.equal(response.status, 200);
    const readme = await response.text();
    const template = await readFile(join(process.cwd(), "config", "mcp-readme.md"), "utf8");

    assert.match(readme, /## MCP initialization/);
    assert.match(readme, /protocolVersion/);
    assert.match(readme, /GET \/mcp\/readme/);
    assert.doesNotMatch(readme, /\{\{(?:BASE_PATH|PORT|METADATA|SKILLS_COUNT|SKILLS_SECTION)\}\}/);
    assert.notEqual(readme, template);
  } finally {
    await http.close();
  }
});

test("HTTP initialize returns a session usable for tools/list", async () => {
  const port = await getFreePort();
  const http = await startHttpServer({
    port,
    host: "127.0.0.1",
    basePath: "/mcp",
    idleTimeoutMs: 60_000,
    createCore: () => {
      const server = new Server({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } });
      server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [{ name: "test_tool", description: "test", inputSchema: { type: "object" } }],
      }));
      return server;
    },
  });

  try {
    const endpoint = `http://127.0.0.1:${port}/mcp`;
    const initialize = await fetch(endpoint, {
      method: "POST",
      headers: { accept: "application/json, text/event-stream", "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "unit-test-client", version: "1.0.0" },
        },
        id: 1,
      }),
    });
    assert.equal(initialize.status, 200);
    const sessionId = initialize.headers.get("mcp-session-id");
    assert.ok(sessionId);
    const initializeBody = (await initialize.json()) as { result?: { protocolVersion?: string } };
    assert.equal(initializeBody.result?.protocolVersion, "2024-11-05");

    const tools = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
        "mcp-session-id": sessionId,
      },
      body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", params: {}, id: 2 }),
    });
    assert.equal(tools.status, 200);
    const toolsBody = (await tools.json()) as { result?: { tools?: Array<{ name: string }> } };
    assert.deepEqual(
      toolsBody.result?.tools?.map((tool) => tool.name),
      ["test_tool"],
    );
  } finally {
    await http.close();
  }
});

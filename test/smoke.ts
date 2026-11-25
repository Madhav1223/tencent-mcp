// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const auditDir = mkdtempSync(join(tmpdir(), "tencent-audit-"));
const auditFile = join(auditDir, "audit.ndjson");

const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/index.js"],
  env: {
    ...process.env,
    TENCENT_MCP_AUDIT_FILE: auditFile,
  },
});

const clientOptions: ConstructorParameters<typeof Client>[1] = { requestTimeout: 300000 };
const client = new Client({ name: "test-client", version: "0.0.1" }, clientOptions);
await client.connect(transport);

const { tools } = await client.listTools();
console.log("TOOLS:", tools.map((t) => t.name).join(", "));

const srv = await client.callTool({ name: "list_service_actions", arguments: { service: "cos" } });
console.log("COS ACTIONS:", JSON.stringify(srv.content[0].text).slice(0, 400));

const pol = await client.callTool({ name: "get_audit_policy", arguments: {} });
console.log("POLICY:", JSON.stringify(pol.content[0].text));

const del = await client.callTool({
  name: "call_tencent_api",
  arguments: { service: "cos", action: "DeleteBucket", params: { bucket: "x" } },
});
console.log("DELETE RESULT:", JSON.stringify(del.content[0].text));

const readonly = await client.callTool({
  name: "call_tencent_api",
  arguments: { service: "sts", action: "GetCallerIdentity", params: {} },
});
console.log("READONLY RESULT:", JSON.stringify(readonly.content[0].text).slice(0, 300));

const start = await client.callTool({
  name: "call_tencent_api",
  arguments: { service: "dlc", action: "StartRayCluster", params: {} },
});
console.log("STARt RESULT:", JSON.stringify(start.content[0].text).slice(0, 200));

const bad = await client.callTool({
  name: "run_dlc_sql",
  arguments: { sql: "DROP TABLE IF EXISTS bogus_table", region: "ap-singapore" },
});
console.log("DANGEROUS SQL (no confirm):", JSON.stringify(bad.content[0].text));

const good = await client.callTool({
  name: "run_dlc_sql",
  arguments: {
    sql: "SELECT 1 AS ok",
    data_engine_name: "makro-bic-standard-dlc-01",
    database: "default",
    region: "ap-singapore",
    timeout_ms: 240000,
  },
});
console.log("SAFE SQL:", JSON.stringify(good.content[0].text).slice(0, 500));

await client.close();

console.log("--- AUDIT FILE ---");
console.log(readFileSync(auditFile, "utf8"));

process.exit(0);

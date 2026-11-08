#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  defaultRegion,
  credentialFileProblem,
  listServices,
  listVersions,
  resolveCredentials,
  resolveService,
  resolveServiceVersion,
} from "./sdk.js";
import { auditCall, auditLogger } from "./audit.js";
import { classifySql } from "./sqlguard.js";
import { runWedataWorkflow } from "./wedata.js";
import { getLogger } from "./log.js";
import { getMetadataContext, loadMetadata } from "./metadata.js";
import { createApproval, isApprovalCredentialsConfigured, sqlFingerprint } from "./approval.js";
import { checkedCall, getPolicy } from "./guard.js";
import { listKnowledge, promoteKnowledge, saveKnowledge } from "./knowledge.js";

const TOOLS: Tool[] = [
  {
    name: "list_tencent_services",
    description:
      "List all Tencent Cloud services supported by the Tencent Cloud SDK (COS, CVM, TKE, CLS, CAM, STS, etc.). Returns service names you can pass to call_tencent_api.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "list_service_actions",
    description:
      "List the available API actions (versions and method names) for a given Tencent Cloud service, e.g. 'cos', 'cvm', 'sts'. Optionally pass 'version' (e.g. '2021-08-20') to list the actions of a specific SDK version instead of the newest.",
    inputSchema: {
      type: "object",
      properties: {
        service: { type: "string", description: "Tencent Cloud service name, e.g. 'cvm' or 'cos'" },
        version: {
          type: "string",
          description:
            "Optional API version to pin (e.g. '2021-08-20', with or without leading 'v'). Default: newest installed version.",
        },
      },
      required: ["service"],
    },
  },
  {
    name: "get_caller_identity",
    description:
      "Return the Tencent Cloud account identity (via STS GetCallerIdentity), confirming the credentials are valid and which account/appId is in use.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "call_tencent_api",
    description:
      "Call any Tencent Cloud API action through the official SDK. Specify the service (e.g. 'cos', 'cvm', 'tke', 'cls'), the action (e.g. 'DescribeBuckets', 'DescribeInstances'), and request params. Returns the parsed response. NOTE: a deny-by-default safety policy is enforced: only readonly actions (Describe/Get/List/Query/InquiryPrice/Check/Preview/Count/Search/Statistic/Export/Download), explicit allowlisted mutations (e.g. engine startup like dlc:StartEngine, emr:StartJobs), and actions under TENCENT_MCP_ALLOW_MUTATIONS are permitted. Destructive operations (Delete/Destroy/Terminate/Remove/Release/Reset/etc.) are blocked. All calls are audited.",
    inputSchema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          description: "Tencent Cloud service name, e.g. 'cos', 'cvm', 'tke', 'cls', 'cam'.",
        },
        action: {
          type: "string",
          description:
            "API action name, e.g. 'DescribeBuckets', 'DescribeInstances'. Use list_service_actions to discover.",
        },
        params: {
          type: "object",
          description: "Request parameters (object). Omit or pass {} if none.",
        },
        region: {
          type: "string",
          description: `Tencent Cloud region (default: ${defaultRegion()}).`,
        },
        version: {
          type: "string",
          description:
            "API version to pin, e.g. '2021-08-20' for wedata legacy workflow-scheduling projects (with or without leading 'v'). Default: the SDK's newest installed version. Use list_service_actions to see available versions.",
        },
      },
      required: ["service", "action"],
    },
  },
  {
    name: "run_dlc_sql",
    description:
      "Run a SQL query on Tencent DLC (Data Lake Compute). Safe statements (SELECT, SHOW, DESCRIBE/DESC, EXPLAIN, USE, LIST, WITH) run automatically. Dangerous statements (INSERT, UPDATE, DELETE, TRUNCATE, DROP, ALTER, CREATE, MERGE, GRANT, and other DDL/DML/DCL) require the exact confirmation token confirm=CONFIRM. The SQL is submitted via CreateTask, polled to completion, and (for read queries) the result rows are returned. All calls are audited.",
    inputSchema: {
      type: "object",
      properties: {
        sql: { type: "string", description: "SQL statement(s) to run, e.g. 'SELECT * FROM my_table LIMIT 10'." },
        data_engine_name: {
          type: "string",
          description: "DLC data engine name (optional; if omitted the account default engine is used).",
        },
        data_engine_id: {
          type: "string",
          description: "DLC data engine id, e.g. 'DataEngine-1dze2hdj' (optional; preferred over name if both set).",
        },
        database: { type: "string", description: "Database name to run the SQL against (optional)." },
        catalog: { type: "string", description: "Data source / catalog name (default 'DataLakeCatalog')." },
        resource_group_name: {
          type: "string",
          description: "DLC resource group name for the engine (optional; defaults to engine default).",
        },
        max_rows: {
          type: "number",
          description: "Maximum result rows to return for read queries (default 1000).",
        },
        timeout_ms: {
          type: "number",
          description: "Maximum time to wait for the query to finish, in milliseconds (default 600000).",
        },
        region: { type: "string", description: `Tencent Cloud region (default: ${defaultRegion()}).` },
      },
      required: ["sql"],
    },
  },
  {
    name: "get_audit_policy",
    description:
      "Return the current safety policy configuration: readonly action prefixes, denied (dangerous) prefixes, and explicitly allowed mutation actions.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_metadata_context",
    description:
      "Return the local metadata.md context used to supply default Tencent Cloud, WeData, and DLC values. The file is reloaded when it changes.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "run_wedata_workflow",
    description:
      "Run or monitor a Tencent Cloud WeData workflow and report pass/fail. In 'run' mode it triggers the workflow (CreateTriggerWorkflowRun), polls until it reaches a terminal state, and returns per-task status. In 'monitor' mode it only checks an already-running workflow (via workflow_execution_id). On failure it collects the error codes/messages, fetches the task log tail, and produces a rule-based Root Cause Analysis (RCA) explaining the probable cause and recommended actions for users.",
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["run", "monitor"],
          description:
            "'run' triggers a new workflow run (default). 'monitor' checks an existing run using workflow_execution_id.",
        },
        project_id: {
          type: "string",
          description:
            "WeData Project ID (required if project_name is not given; auto-resolves the first project otherwise).",
        },
        project_name: {
          type: "string",
          description: "WeData project name or display name; used to resolve the project_id.",
        },
        workflow_id: { type: "string", description: "WeData workflow ID. Required in 'run' mode." },
        workflow_execution_id: {
          type: "string",
          description: "Existing workflow run (execution) ID. Required in 'monitor' mode.",
        },
        task_ids: {
          type: "array",
          items: { type: "string" },
          description: "Optional subset of task IDs to run (run mode only). Omit to run all tasks.",
        },
        region: { type: "string", description: `Tencent Cloud region (default: ${defaultRegion()}).` },
        wait: {
          type: "boolean",
          description:
            "Wait until the run reaches a terminal state (default true). If false, submit and return immediately.",
        },
        timeout_ms: {
          type: "number",
          description: "Max polling time in ms while waiting for the run to finish (default 3600000).",
        },
        poll_interval_ms: {
          type: "number",
          description: "Polling interval in ms (default 15000).",
        },
        max_log_lines: {
          type: "number",
          description: "Max tail lines of the failed task log to fetch for the RCA (default 120).",
        },
        explain: {
          type: "boolean",
          description: "Include the RCA explanation when the run fails (default true).",
        },
      },
      required: [],
    },
  },
  {
    name: "save_knowledge",
    description:
      "Save a lesson learned (e.g. from hit-and-trial debugging, incident RCA, cost finding) to the MCP-managed knowledge base as a markdown file. status='unrefined' stores a raw note for later refinement and validation; status='refined' stores a validated lesson. Files land under <skills>/unrefined/ or <skills>/refined/ and are discoverable via list_knowledge and GET /mcp/readme.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short title for the note (becomes the file name)." },
        content: { type: "string", description: "Markdown body of the lesson/note." },
        status: {
          type: "string",
          enum: ["refined", "unrefined"],
          description: "'refined' for validated lessons, 'unrefined' for raw notes (default 'unrefined').",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "list_knowledge",
    description:
      "List notes in the MCP-managed knowledge base (<skills>/refined/ and <skills>/unrefined/). Optionally filter by status.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["refined", "unrefined"],
          description: "Filter to one status; omit for both.",
        },
      },
      required: [],
    },
  },
  {
    name: "promote_knowledge",
    description:
      "Promote a validated unrefined note to refined status (moves <skills>/unrefined/<name>.md to <skills>/refined/<name>.md).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Note name (file name without .md), e.g. 'dlc-timeout-fix'." },
      },
      required: ["name"],
    },
  },
];

function fail(message: string) {
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

function ok(data: unknown) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function b64encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function b64decode(value: string): string {
  return Buffer.from(value, "base64").toString("utf8");
}

function metadataValue(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return value;
}

const DLC_SQL_ACTIONS = new Set(["CreateTask", "CreateTaskSync", "CreateTasks", "CreateSparkSessionBatchSQL"]);

// Extract raw SQL text from the common DLC task-submission param shapes. The
// SDK expects the SQL to be base64-encoded, so decode it for classification.
function extractSqlFromParams(action: string, params: Record<string, unknown>): string[] {
  if (!DLC_SQL_ACTIONS.has(action)) return [];
  const found: string[] = [];
  const candidates: unknown[] = [];
  if (params.Task && typeof params.Task === "object") {
    const task = params.Task as Record<string, any>;
    for (const key of ["SQLTask", "SparkSQLTask"]) {
      const st = task[key];
      if (st && typeof st === "object" && typeof (st as Record<string, any>).SQL === "string") {
        candidates.push((st as Record<string, any>).SQL);
      }
    }
  }
  if (Array.isArray(params.TaskSet)) {
    for (const item of params.TaskSet) {
      const obj = item as Record<string, any>;
      for (const key of ["SQLTask", "SparkSQLTask"]) {
        const st = obj[key];
        if (st && typeof st === "object" && typeof (st as Record<string, any>).SQL === "string") {
          candidates.push((st as Record<string, any>).SQL);
        }
      }
    }
  }
  if (params.Tasks && typeof params.Tasks === "object") {
    const tasks = params.Tasks as Record<string, any>;
    if (typeof tasks.SQL === "string") candidates.push(tasks.SQL);
  }
  if (typeof params.ExecuteSQL === "string") {
    candidates.push(params.ExecuteSQL);
  }
  if (typeof params.SQL === "string") {
    candidates.push(params.SQL);
  }
  for (const c of candidates) {
    try {
      found.push(b64decode(String(c)));
    } catch {
      found.push(String(c));
    }
  }
  return found;
}

function stripGuardKeys(params: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    const lower = k.toLowerCase();
    if (lower === "confirm" || lower === "confirmation" || lower === "__confirm") continue;
    out[k] = v;
  }
  return out;
}

const DLC_TASK_STATES: Record<number, string> = {
  0: "initialized",
  1: "running",
  2: "succeeded",
  3: "writing",
  4: "queued",
  [-1]: "failed",
  [-3]: "cancelled",
};

async function pollDlcTask(
  taskId: string,
  region: string | undefined,
  timeoutMs: number,
): Promise<Record<string, any>> {
  const deadline = Date.now() + timeoutMs;
  let last: Record<string, any> = {};
  while (Date.now() < deadline) {
    // Policy-checked + logged + audited like every other request.
    const res = await checkedCall(
      "dlc",
      "DescribeTasks",
      {
        Limit: 1,
        Filters: [{ Name: "task-id", Values: [taskId] }],
      },
      region,
    );
    const list = (res.response as any)?.TaskList ?? [];
    if (list.length === 0) {
      await sleep(2000);
      continue;
    }
    last = list[0];
    const state = Number(last.State);
    if (state === 2 || state === -1 || state === -3) {
      return last;
    }
    await sleep(2000);
  }
  throw new Error(`Timed out waiting for DLC task ${taskId} after ${timeoutMs}ms (last state: ${last.State}).`);
}

function rowsFromResult(resultRaw: unknown): { columns: string[]; rows: unknown[][] } {
  let columns: string[] = [];
  const rows: unknown[][] = [];
  const rs = resultRaw as any;
  if (rs?.ResultSchema && Array.isArray(rs.ResultSchema)) {
    for (const col of rs.ResultSchema) {
      columns.push(String(col?.Name ?? col?.name ?? "col"));
    }
  }
  if (typeof rs?.ResultSet === "string" && rs.ResultSet.trim() !== "") {
    try {
      const parsed = JSON.parse(rs.ResultSet);
      const arr = Array.isArray(parsed) ? parsed : (parsed.rows ?? parsed.data ?? []);
      if (Array.isArray(arr)) {
        for (const row of arr) {
          if (Array.isArray(row)) rows.push(row);
          else if (row && typeof row === "object") rows.push(Object.values(row));
        }
        if (columns.length === 0 && arr.length > 0 && Array.isArray(arr[0])) {
          columns = arr[0].map((_, i: number) => `col${i + 1}`);
        }
      }
    } catch {
      // leave raw string accessible to the caller
    }
  }
  return { columns, rows };
}

interface ResolvedEngine {
  name?: string;
  taskType: "SparkSQLTask" | "SQLTask";
}

function engineTaskType(typeDetail: string, engineType: string): "SparkSQLTask" | "SQLTask" {
  const hay = `${typeDetail} ${engineType}`.toLowerCase();
  return hay.includes("presto") ? "SQLTask" : "SparkSQLTask";
}

async function resolveDlcEngine(
  dataEngineId: string | undefined,
  dataEngineName: string | undefined,
  region: string | undefined,
): Promise<ResolvedEngine> {
  const defaultResult: ResolvedEngine = { taskType: "SparkSQLTask" };
  if (!dataEngineName && !dataEngineId) {
    // No engine specified: pick the default engine, or the first running engine.
    const res = await checkedCall("dlc", "DescribeDataEngines", {}, region);
    const engines = (res.response as any)?.DataEngines ?? [];
    const pick = (e: any) => ({
      name: e.DataEngineName,
      taskType: engineTaskType(e.EngineTypeDetail, e.EngineType),
    });
    const def = engines.find((e: any) => e.DefaultDataEngine === true);
    if (def) return pick(def);
    const running = engines.find((e: any) => e.State === 2);
    if (running) return pick(running);
    return defaultResult;
  }
  const targetName = dataEngineName;
  if (!targetName) {
    const res = await checkedCall("dlc", "DescribeDataEngines", {}, region);
    const engines = (res.response as any)?.DataEngines ?? [];
    const match = engines.find((e: any) => e.DataEngineId === dataEngineId || e.DataEngineName === dataEngineId);
    if (match) {
      return { name: match.DataEngineName, taskType: engineTaskType(match.EngineTypeDetail, match.EngineType) };
    }
    return defaultResult;
  }
  // Try to look up the engine to pick the correct TaskType (Spark vs Presto).
  try {
    const res = await checkedCall("dlc", "DescribeDataEngines", {}, region);
    const engines = (res.response as any)?.DataEngines ?? [];
    const match = engines.find((e: any) => e.DataEngineName === targetName);
    if (match) {
      return { name: targetName, taskType: engineTaskType(match.EngineTypeDetail, match.EngineType) };
    }
  } catch {
    // fall through: cannot resolve, assume Spark
  }
  return { name: targetName, taskType: "SparkSQLTask" };
}

async function runDlcSql(
  sql: string,
  opts: {
    dataEngineName?: string;
    dataEngineId?: string;
    database?: string;
    catalog?: string;
    resourceGroupName?: string;
    maxRows: number;
    timeoutMs: number;
    region?: string;
  },
) {
  const resolvedEngine = await resolveDlcEngine(opts.dataEngineId, opts.dataEngineName, opts.region);

  const createParams: Record<string, unknown> = {
    DatabaseName: opts.database ?? "",
    Tasks: {
      TaskType: resolvedEngine.taskType,
      FailureTolerance: "Terminate",
      SQL: b64encode(sql),
    },
    DatasourceConnectionName: opts.catalog ?? "DataLakeCatalog",
  };
  if (resolvedEngine.name) createParams.DataEngineName = resolvedEngine.name;
  if (opts.resourceGroupName) createParams.ResourceGroupName = opts.resourceGroupName;

  const created = await checkedCall("dlc", "CreateTasks", createParams, opts.region);
  const taskSet = (created.response as any)?.TaskIdSet ?? [];
  const taskId = String(Array.isArray(taskSet) && taskSet.length > 0 ? taskSet[0] : "");
  if (!taskId) {
    throw new Error(`CreateTasks did not return any TaskId: ${JSON.stringify(created.response)}`);
  }

  const taskInfo = await pollDlcTask(taskId, opts.region, opts.timeoutMs);
  const state = Number(taskInfo.State);

  const summary: Record<string, unknown> = {
    batch_id: (created.response as any)?.BatchId ?? null,
    task_ids: taskSet,
    taskId,
    state,
    stateLabel: DLC_TASK_STATES[state] ?? "unknown",
    sql,
    message: taskInfo.OutputMessage ?? taskInfo.Error ?? null,
  };

  if (state !== 2) {
    summary.success = false;
    summary.error = taskInfo.OutputMessage ?? taskInfo.Error ?? `DLC task ended with state ${state}`;
    return summary;
  }

  const cls = classifySql(sql);
  summary.success = true;
  if (cls.risk === "safe") {
    const result = await checkedCall("dlc", "QueryResult", { TaskId: taskId }, opts.region);
    const { columns, rows } = rowsFromResult((result as any).response);
    summary.columns = columns;
    summary.row_count = rows.length;
    summary.result = rows.slice(0, opts.maxRows);
    summary.truncated = rows.length > opts.maxRows;
  } else {
    summary.row_affected = taskInfo.RowAffectInfo ?? taskInfo.DataNumber ?? null;
  }
  return summary;
}

const audit = auditLogger;

function redactArgsForLog(args: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(args ?? {})) {
    const lower = k.toLowerCase();
    if (["secretid", "secretkey", "token", "password"].includes(lower)) out[k] = "[REDACTED]";
    else if (typeof v === "string" && v.length > 2000) out[k] = v.slice(0, 2000) + "...[truncated]";
    else out[k] = v;
  }
  return out;
}

async function handleTool(name: string, args: Record<string, any>) {
  // Every MCP tool invocation is explicitly logged (structured) and
  // — for Tencent-affecting tools — policy-checked via checkedCall downstream.
  // This satisfies "each and every request is logged and must be checked explicitly in policy".
  const logger = getLogger();
  const toolStarted = Date.now();
  logger.info("mcp tool invocation", {
    mcp_tool: name,
    mcp_args: redactArgsForLog(args ?? {}),
  });

  switch (name) {
    case "list_tencent_services": {
      // No Tencent API call — local discovery. Still logged above; audit as mcp meta.
      await auditCall({
        service: "mcp",
        action: "list_tencent_services",
        params: {},
        allowed: true,
        readonly: true,
        reason: "local mcp meta tool (no Tencent API)",
        durationMs: Date.now() - toolStarted,
        outcome: "success",
      });
      const services = listServices().sort();
      return ok({ count: services.length, services });
    }
    case "list_service_actions": {
      await auditCall({
        service: "mcp",
        action: "list_service_actions",
        params: { service: args.service },
        allowed: true,
        readonly: true,
        reason: "local mcp meta tool (no Tencent API)",
        durationMs: Date.now() - toolStarted,
        outcome: "success",
      });
      const service = String(args.service ?? "");
      const requestedVersion = args.version ? String(args.version) : undefined;
      try {
        const resolved = resolveServiceVersion(service, requestedVersion);
        if (!resolved) {
          return fail(`Unknown service '${service}'. Use list_tencent_services to discover services.`);
        }
        const versions = listVersions(service);
        return ok({
          service,
          requested_version: requestedVersion ?? null,
          versions,
          latestVersion: resolveService(service)?.version ?? null,
          resolvedVersion: resolved.version,
          actions: resolved.actions,
        });
      } catch (err) {
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "get_caller_identity": {
      const creds = await resolveCredentials();
      if (!creds.secretId || !creds.secretKey) {
        await auditCall({
          service: "sts",
          action: "GetCallerIdentity",
          params: {},
          region: defaultRegion(),
          allowed: false,
          readonly: true,
          reason: "missing credentials",
          durationMs: Date.now() - toolStarted,
          outcome: "blocked",
        });
        const credWhy = credentialFileProblem();
        return fail(
          "Missing credentials. Provide creds/credentials.json with {secretId, secretKey, token} (TENCENT_MCP_CRED_FILE=/app/creds/credentials.json). Env vars are disabled." +
            (credWhy ? ` Reason: ${credWhy}.` : ""),
        );
      }
      try {
        // checkedCall enforces policy + logging + audit explicitly.
        const result = await checkedCall("sts", "GetCallerIdentity", {}, defaultRegion());
        return ok(result.response);
      } catch (err) {
        // checkedCall already audited blocked/error; surface to caller.
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "get_audit_policy": {
      await auditCall({
        service: "mcp",
        action: "get_audit_policy",
        params: {},
        allowed: true,
        readonly: true,
        reason: "local mcp meta tool (no Tencent API)",
        durationMs: Date.now() - toolStarted,
        outcome: "success",
      });
      return ok(getPolicy().configSummary());
    }
    case "get_metadata_context": {
      try {
        const ctx = await getMetadataContext();
        await auditCall({
          service: "mcp",
          action: "get_metadata_context",
          params: {},
          allowed: true,
          readonly: true,
          reason: "local mcp meta tool (no Tencent API)",
          durationMs: Date.now() - toolStarted,
          outcome: "success",
        });
        return ok(ctx);
      } catch (err) {
        await auditCall({
          service: "mcp",
          action: "get_metadata_context",
          params: {},
          allowed: true,
          readonly: true,
          reason: "local mcp meta tool (no Tencent API)",
          durationMs: Date.now() - toolStarted,
          outcome: "error",
          error: err instanceof Error ? err.message : String(err),
        });
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "run_dlc_sql": {
      const metadata = await loadMetadata();
      const dlc = metadata.dlc ?? {};
      const sql = String(args.sql ?? "");
      if (!sql.trim()) {
        return fail("run_dlc_sql requires a non-empty 'sql' parameter.");
      }
      const cls = classifySql(sql);
      const region = args.region
        ? String(args.region)
        : (metadataValue(dlc.region) ?? metadataValue(metadata.defaults?.region) ?? defaultRegion());
      const maxRows = Number(args.max_rows ?? 1000);
      const timeoutMs = Number(args.timeout_ms ?? 600000);

      const auditParams = { ...args, sql, classification: cls.risk, dangerous_keywords: cls.dangerousKeywords };
      const started = Date.now();
      if (cls.risk !== "safe") {
        await auditCall({
          service: "dlc",
          action: "run_dlc_sql",
          params: auditParams,
          region,
          allowed: false,
          readonly: false,
          reason: `dangerous SQL requires authenticated human approval (${cls.dangerousKeywords.join(",")})`,
          durationMs: Date.now() - started,
          outcome: "blocked",
        });
        const approval = createApproval("run_dlc_sql", sql, () =>
          runDlcSql(sql, {
            dataEngineName: args.data_engine_name ? String(args.data_engine_name) : metadataValue(dlc.data_engine_name),
            dataEngineId: args.data_engine_id ? String(args.data_engine_id) : metadataValue(dlc.data_engine_id),
            database: args.database ? String(args.database) : metadataValue(dlc.database),
            catalog: args.catalog ? String(args.catalog) : metadataValue(dlc.catalog),
            resourceGroupName: args.resource_group_name
              ? String(args.resource_group_name)
              : metadataValue(dlc.resource_group_name),
            maxRows,
            timeoutMs,
            region,
          }),
        );
        return fail(
          JSON.stringify(
            {
              status: "human_approval_required",
              approval_id: approval.id,
              approval_url: `/approvals/${approval.id}`,
              sql_sha256: sqlFingerprint(sql),
              message:
                "A human must review and approve this exact SQL through the authenticated approval endpoint before it can execute.",
            },
            null,
            2,
          ),
        );
      }
      try {
        const summary = await runDlcSql(sql, {
          dataEngineName: args.data_engine_name ? String(args.data_engine_name) : metadataValue(dlc.data_engine_name),
          dataEngineId: args.data_engine_id ? String(args.data_engine_id) : metadataValue(dlc.data_engine_id),
          database: args.database ? String(args.database) : metadataValue(dlc.database),
          catalog: args.catalog ? String(args.catalog) : metadataValue(dlc.catalog),
          resourceGroupName: args.resource_group_name
            ? String(args.resource_group_name)
            : metadataValue(dlc.resource_group_name),
          maxRows,
          timeoutMs,
          region,
        });
        await auditCall({
          service: "dlc",
          action: "run_dlc_sql",
          params: auditParams,
          region,
          allowed: true,
          readonly: cls.risk === "safe",
          reason: cls.risk === "safe" ? "safe read-only SQL" : "confirmed dangerous SQL",
          durationMs: Date.now() - started,
          outcome: summary.success ? "success" : "failed",
          error: summary.success ? undefined : String((summary as any).error ?? ""),
        });
        return ok(summary);
      } catch (err) {
        await auditCall({
          service: "dlc",
          action: "run_dlc_sql",
          params: auditParams,
          region,
          allowed: true,
          readonly: cls.risk === "safe",
          reason: cls.risk === "safe" ? "safe read-only SQL" : "confirmed dangerous SQL",
          durationMs: Date.now() - started,
          outcome: "error",
          error: err instanceof Error ? err.message : String(err),
        });
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "run_wedata_workflow": {
      const metadata = await loadMetadata();
      const wedata = metadata.wedata ?? {};
      const mode = String(args.mode ?? "run") === "monitor" ? "monitor" : "run";
      const workflowId = args.workflow_id ? String(args.workflow_id) : metadataValue(wedata.workflow_id);
      const workflowExecutionId = args.workflow_execution_id ? String(args.workflow_execution_id) : undefined;
      if (mode === "monitor" && !workflowExecutionId) {
        return fail("run_wedata_workflow in monitor mode requires workflow_execution_id.");
      }
      if (mode === "run" && !workflowId) {
        return fail(
          "run_wedata_workflow in run mode requires workflow_id (or use mode=monitor with workflow_execution_id).",
        );
      }
      const region = args.region
        ? String(args.region)
        : (metadataValue(wedata.region) ?? metadataValue(metadata.defaults?.region) ?? defaultRegion());
      const started = Date.now();
      try {
        const result = await runWedataWorkflow({
          mode,
          projectId: args.project_id ? String(args.project_id) : metadataValue(wedata.project_id),
          projectName: args.project_name ? String(args.project_name) : metadataValue(wedata.project_name),
          workflowId,
          workflowExecutionId,
          taskIds: Array.isArray(args.task_ids) ? args.task_ids.map(String) : undefined,
          region,
          wait: args.wait !== false && args.wait !== "false" && args.wait !== 0,
          timeoutMs: Number(args.timeout_ms ?? 3600000),
          pollIntervalMs: Number(args.poll_interval_ms ?? 15000),
          maxLogLines: Number(args.max_log_lines ?? 120),
          explain: args.explain !== false && args.explain !== "false" && args.explain !== 0,
        });
        await auditCall({
          service: "wedata",
          action: "run_wedata_workflow",
          params: { ...args },
          region,
          allowed: true,
          readonly: false,
          reason: mode === "run" ? "trigger + monitor wedata workflow" : "monitor wedata workflow",
          durationMs: Date.now() - started,
          outcome: result.passed === false ? "failed" : result.passed === true ? "success" : "error",
          error: result.passed === false ? (result.error_message ?? result.message) : undefined,
        });
        return ok(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await auditCall({
          service: "wedata",
          action: "run_wedata_workflow",
          params: { ...args },
          region,
          allowed: true,
          readonly: false,
          reason: mode === "run" ? "trigger + monitor wedata workflow" : "monitor wedata workflow",
          durationMs: Date.now() - started,
          outcome: "error",
          error: message,
        });
        return fail(message);
      }
    }
    case "call_tencent_api": {
      const service = String(args.service ?? "");
      const action = String(args.action ?? "");
      const params = (args.params as Record<string, unknown>) ?? {};
      const region = args.region ? String(args.region) : undefined;
      const version = args.version ? String(args.version) : undefined;

      // SQL embedded in DLC/other tasks must be gated before any Tencent call.
      const sqls = extractSqlFromParams(action, params);
      const sanitizedParams = stripGuardKeys(params);
      if (sqls.length > 0) {
        const joinedSql = sqls.filter(Boolean).join(";");
        if (joinedSql.trim() !== "") {
          const cls = classifySql(joinedSql);
          if (cls.risk !== "safe") {
            await auditCall({
              service,
              action,
              params,
              region,
              allowed: false,
              readonly: false,
              reason: `dangerous SQL requires authenticated human approval (${cls.dangerousKeywords.join(",")})`,
              durationMs: Date.now() - toolStarted,
              outcome: "blocked",
            });
            if (!isApprovalCredentialsConfigured()) {
              return fail("Dangerous SQL is disabled because human approval credentials are not configured.");
            }
            const approval = createApproval(`call_tencent_api ${service}:${action}`, joinedSql, async () => {
              // Approval execute path must also be policy-checked + audited.
              const result = await checkedCall(service, action, sanitizedParams, region, { version });
              return result.response;
            });
            return fail(
              JSON.stringify(
                {
                  status: "human_approval_required",
                  approval_id: approval.id,
                  approval_url: `/approvals/${approval.id}`,
                  sql_sha256: sqlFingerprint(joinedSql),
                  message:
                    "A human must review and approve this exact SQL through the authenticated approval endpoint before it can execute.",
                },
                null,
                2,
              ),
            );
          }
        }
      }
      try {
        // checkedCall does explicit policy decide + structured log + audit.
        const result = await checkedCall(service, action, sanitizedParams, region, { version });
        return ok(result.response);
      } catch (err) {
        // checkedCall already audited blocked/error.
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "save_knowledge": {
      try {
        const title = String(args.title ?? "");
        const content = String(args.content ?? "");
        const status = args.status === "refined" ? "refined" : "unrefined";
        const entry = await saveKnowledge({ title, content, status, source: "mcp:save_knowledge" });
        await auditCall({
          service: "mcp",
          action: "save_knowledge",
          params: { title, status, path: entry.path },
          allowed: true,
          readonly: false,
          reason: "local knowledge write (policy: allowlisted mcp mutation)",
          durationMs: Date.now() - toolStarted,
          outcome: "success",
        });
        logger.info("knowledge saved", { mcp_tool: "save_knowledge", entry });
        return ok(entry);
      } catch (err) {
        await auditCall({
          service: "mcp",
          action: "save_knowledge",
          params: { title: args.title },
          allowed: true,
          readonly: false,
          reason: "local knowledge write",
          durationMs: Date.now() - toolStarted,
          outcome: "error",
          error: err instanceof Error ? err.message : String(err),
        });
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "list_knowledge": {
      try {
        const status = args.status === "refined" || args.status === "unrefined" ? args.status : undefined;
        const result = await listKnowledge(status);
        await auditCall({
          service: "mcp",
          action: "list_knowledge",
          params: { status: status ?? null },
          allowed: true,
          readonly: true,
          reason: "local knowledge read",
          durationMs: Date.now() - toolStarted,
          outcome: "success",
        });
        return ok(result);
      } catch (err) {
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    case "promote_knowledge": {
      try {
        const name = String(args.name ?? "");
        if (!name.trim()) return fail("promote_knowledge requires 'name'.");
        const entry = await promoteKnowledge(name);
        await auditCall({
          service: "mcp",
          action: "promote_knowledge",
          params: { name, path: entry.path },
          allowed: true,
          readonly: false,
          reason: "local knowledge promote (policy: allowlisted mcp mutation)",
          durationMs: Date.now() - toolStarted,
          outcome: "success",
        });
        logger.info("knowledge promoted", { mcp_tool: "promote_knowledge", entry });
        return ok(entry);
      } catch (err) {
        await auditCall({
          service: "mcp",
          action: "promote_knowledge",
          params: { name: args.name },
          allowed: true,
          readonly: false,
          reason: "local knowledge promote",
          durationMs: Date.now() - toolStarted,
          outcome: "error",
          error: err instanceof Error ? err.message : String(err),
        });
        return fail(err instanceof Error ? err.message : String(err));
      }
    }
    default:
      await auditCall({
        service: "mcp",
        action: name,
        params: args,
        allowed: false,
        readonly: true,
        reason: "unknown tool (deny-by-default)",
        durationMs: Date.now() - toolStarted,
        outcome: "blocked",
      });
      return fail(`Unknown tool: ${name}`);
  }
}

export function createMcpServer(): Server {
  const server = new Server({ name: "tencent-mcp", version: "0.2.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      return await handleTool(name, args ?? {});
    } catch (err) {
      return fail(err instanceof Error ? err.message : String(err));
    }
  });

  return server;
}

async function main(): Promise<void> {
  const rawPort = (process.env.TENCENT_MCP_HTTP_PORT ?? "").trim();
  const httpPort = rawPort !== "" ? Number(rawPort) : NaN;
  const httpMode = process.env.MCP_TRANSPORT === "http" || Number.isFinite(httpPort);

  if (httpMode) {
    const { startHttpServer } = await import("./http.js");
    const port = Number.isFinite(httpPort) ? httpPort : 8000;
    const host = process.env.TENCENT_MCP_HTTP_HOST || "0.0.0.0";
    const basePath = process.env.TENCENT_MCP_HTTP_PATH || "/mcp";
    const idleTimeoutMs = Number(process.env.TENCENT_MCP_SESSION_IDLE_TIMEOUT_MS || 1800000);
    const handle = await startHttpServer({
      port,
      host,
      basePath,
      idleTimeoutMs,
      createCore: createMcpServer,
    });
    const shutdown = async () => {
      const logger = getLogger();
      logger.info("shutting down tencent-mcp http server");
      await handle.close();
      audit.close();
      logger.close();
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    return;
  }

  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(`[tencent-mcp] fatal: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { getLogger } from "./log.js";
import { checkedCall } from "./guard.js";

export interface WedataRunArgs {
  mode: "run" | "monitor";
  projectId?: string;
  projectName?: string;
  workflowId?: string;
  workflowExecutionId?: string;
  taskIds?: string[];
  region?: string;
  wait: boolean;
  timeoutMs: number;
  pollIntervalMs: number;
  maxLogLines: number;
  explain: boolean;
}

export interface TaskRunBrief {
  task_id?: string;
  task_name?: string;
  execution_id?: string;
  state?: string;
  error_code?: string;
  is_latest?: boolean;
}

export interface RcaResult {
  verdict: string;
  category: string;
  confidence: "high" | "medium" | "low";
  probable_cause: string;
  evidence: string[];
  recommended_actions: string[];
  raw_errors: string[];
}

export interface WedataRunResult {
  status: string;
  passed: boolean | null;
  mode: WedataRunArgs["mode"];
  project_id?: string;
  workflow_id?: string;
  workflow_execution_id?: string;
  state?: string;
  error_code?: string;
  error_message?: string;
  start_time?: string;
  end_time?: string;
  duration_seconds?: number;
  tasks?: TaskRunBrief[];
  failed_tasks?: TaskRunBrief[];
  log_excerpt?: string;
  rca?: RcaResult | null;
  message?: string;
}

const TERMINAL_SUCCESS = new Set(["SUCCESS", "SUCCESS_WITH_HANDLE"]);
const TERMINAL_FAILURE = new Set(["FAILED", "FAILED_WITH_HANDLE", "CANCELLED", "CANCELED", "SKIPED", "SKIPPED"]);
const TERMINAL = new Set([...TERMINAL_SUCCESS, ...TERMINAL_FAILURE]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wedataCall(
  action: string,
  params: Record<string, unknown>,
  region?: string,
  opts: { readonly?: boolean } = {},
): Promise<{ response: unknown }> {
  // Every Tencent API request MUST go through checkedCall so it is
  // policy-checked, logged, and audited exactly once. Wedata helpers are
  // internal callers — they do not do their own audit.
  const readonly = opts.readonly ?? true;
  const res = await checkedCall("wedata", action, params, region, { readonlyOverride: readonly });
  return { response: (res as any).response };
}

function asString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function responseData(res: unknown): any {
  return (res as any)?.response?.Data ?? (res as any)?.response ?? (res as any);
}

export async function resolveProjectId(
  projectId: string | undefined,
  projectName: string | undefined,
  region?: string,
): Promise<string> {
  if (projectId) return projectId;
  const res = await wedataCall("ListProjects", {}, region);
  const data = responseData(res);
  const items: any[] = data?.Items ?? data?.Data?.Items ?? data?.Projects ?? [];
  if (items.length === 0) {
    throw new Error("wedata:ListProjects returned no projects. Provide project_id or project_name.");
  }
  if (projectName) {
    const match = items.find(
      (p) => p.ProjectName === projectName || p.DisplayName === projectName || p.ProjectId === projectName,
    );
    if (match?.ProjectId) return String(match.ProjectId);
    throw new Error(
      `wedata:ListProjects found no project matching '${projectName}'. ` +
        `Available: ${items.map((p) => p.ProjectName ?? p.ProjectId).join(", ")}`,
    );
  }
  return String(items[0].ProjectId);
}

export async function triggerWorkflowRun(
  projectId: string,
  workflowId: string,
  taskIds: string[],
  region?: string,
): Promise<string> {
  const params: Record<string, unknown> = { ProjectId: projectId, WorkflowId: workflowId };
  if (taskIds && taskIds.length > 0) params.TaskIds = taskIds;
  const res = await wedataCall("CreateTriggerWorkflowRun", params, region, { readonly: false });
  const data = responseData(res);
  const executionId = data?.WorkflowExecutionId ?? data?.Data?.WorkflowExecutionId;
  if (!executionId) {
    throw new Error(
      `wedata:CreateTriggerWorkflowRun did not return a WorkflowExecutionId: ${JSON.stringify(res.response)}`,
    );
  }
  return String(executionId);
}

export async function getWorkflowRun(projectId: string, executionId: string, region?: string): Promise<any> {
  const res = await wedataCall(
    "ListTriggerWorkflowRuns",
    {
      ProjectId: projectId,
      Filters: [{ Name: "ExecutionId", Values: [executionId] }],
      PageSize: 10,
    },
    region,
  );
  const data = responseData(res);
  const items: any[] = data?.Items ?? data?.Data?.Items ?? [];
  const match = items.find((i) => String(i.ExecutionId ?? "") === String(executionId));
  return match ?? items[0] ?? null;
}

export async function listTaskRuns(projectId: string, workflowExecutionId: string, region?: string): Promise<any[]> {
  const res = await wedataCall(
    "ListTriggerTaskRuns",
    {
      ProjectId: projectId,
      Filters: [{ Name: "WorkflowExecutionId", Values: [workflowExecutionId] }],
      PageSize: 200,
    },
    region,
  );
  const data = responseData(res);
  return data?.Items ?? data?.Data?.Items ?? [];
}

export function toTaskBrief(item: any): TaskRunBrief {
  return {
    task_id: asString(item.TaskId),
    task_name: asString(item.TaskName),
    execution_id: asString(item.ExecutionId),
    state: asString(item.TaskExecutionState ?? item.ExecutionState),
    error_code: asString(item.ErrorCodeStr ?? item.ErrorCode),
    is_latest: item.IsLatestExecution === true,
  };
}

export async function fetchTaskLogTail(projectId: string, task: any, region?: string, maxLines = 120): Promise<string> {
  const instanceKey = asString(task.InstanceKey ?? task.ExecutionId ?? task.InstanceId ?? task.TaskId);
  if (!instanceKey) return "";
  try {
    const res = await wedataCall(
      "GetTaskInstanceLog",
      { ProjectId: projectId, InstanceKey: instanceKey, LogLevel: "Error" },
      region,
    );
    const data = responseData(res);
    const logInfo: string = asString(data?.LogInfo) ?? asString(data?.Data?.LogInfo) ?? asString(data?.Logs) ?? "";
    if (!logInfo) return "";
    const lines = logInfo.split(/\r?\n/).filter((l) => l.trim() !== "");
    return lines.slice(-maxLines).join("\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    getLogger().warn("GetTaskInstanceLog failed for task", {
      task: task.TaskId,
      instanceKey,
      error: msg,
    });
    return "";
  }
}

// --- RCA heuristics ---------------------------------------------------------

interface RcaRule {
  category: string;
  confidence: "high" | "medium" | "low";
  patterns: RegExp[];
  probableCause: (found: string) => string;
  actions: string[];
}

const RCA_RULES: RcaRule[] = [
  {
    category: "permission",
    confidence: "high",
    patterns: [
      /accessdenied/i,
      /unauthorizedoperation/i,
      /authfailure/i,
      /permission[\s_]denied/i,
      /\bforbidden\b/i,
      /not\s+authorized/i,
      /缺少权限|无权限|未授权|访问被拒绝/i,
      /camp\.(no.?)?permission/i,
      /policy\s+does\s+not\s+allow/i,
    ],
    probableCause: (found) =>
      `The account/role lacks the required permission to perform this action. Evidence: "${found}".`,
    actions: [
      "Check that the WeData project role / CAM policy grants the needed action (e.g. CreateTriggerWorkflowRun, DescribeInstanceLog) to the caller UIN.",
      "If using temporary credentials, confirm the STS token scope includes the WeData resource.",
      "Verify the resource group or scheduler account bound to the workflow has access to the target data source.",
    ],
  },
  {
    category: "sql_syntax",
    confidence: "high",
    patterns: [
      /parse\s+exception/i,
      /syntax\s+error/i,
      /semantic\s+exception/i,
      /sql\s+error/i,
      /analysis\s+exception/i,
      /mismatched\s+input/i,
      /unexpected\s+token/i,
      /语法错误|解析失败|无法解析/i,
      /failed\s+to\s+parse/i,
      /cannot\s+parse/i,
    ],
    probableCause: (found) => `The submitted SQL (or the task script) failed to parse/compile. Evidence: "${found}".`,
    actions: [
      "Review the SQL of the failed task in WeData; fix syntax errors around the reported line/column.",
      "Pre-validate the script with a dry run / SELECT LIMIT query before scheduling.",
      "Check for version-specific dialect mismatches (Spark vs Presto engine) in the SQL.",
    ],
  },
  {
    category: "missing_object",
    confidence: "high",
    patterns: [
      /table\s+or\s+view[\s\w]*not\s+found/i,
      /table[\s\w]*doesn'?t\s+exist/i,
      /no\s?such\s+table/i,
      /table\s+not\s+found/i,
      /column[\s\w]*not\s+found/i,
      /cannot\s+resolve\b/i,
      /frontier\s*(not\s*)?found/i,
      /object[\s\w]*not\s+found/i,
      /database[\s\w]*not\s*found/i,
      /catalog[\s\w]*not\s+found/i,
      /找不到.*(表|字段|库)|表或视图不存在|不存在/i,
    ],
    probableCause: (found) =>
      `A database object referenced by the task does not exist or is misnamed. Evidence: "${found}".`,
    actions: [
      "Confirm the database, table and column names exist at run time (case, catalog and schema prefixes matter).",
      "If the object is created earlier in the pipeline, verify upstream tables completed and the run captured the refreshed metadata (REFRESH TABLE).",
      "Check that the configured catalog / datasource connection in WeData matches where the object lives.",
    ],
  },
  {
    category: "data_quality",
    confidence: "medium",
    patterns: [
      /nullpointerexception/i,
      /to_char|to\s*timestamp/i,
      /cast\s+failed/i,
      /cannot\s+cast/i,
      /number\s+of\s+columns/i,
      /column\s+count/i,
      /datatype\s+mismatch/i,
      /type\s+mismatch/i,
      /divide\s+by\s+zero/i,
      /when\s+casting\s+from/i,
      /cast\s+.*\.\.\./i,
      /\bNaN\b|\bInfinity\b/i,
    ],
    probableCause: (found) =>
      `The run hit a data type / value issue (null dereference, cast failure, column mismatch, or divide-by-zero). Evidence: "${found}".`,
    actions: [
      "Inspect the offending row(s): run the SELECT on a sample and check for NULLs, out-of-range numbers, or timestamp formats.",
      "Add explicit CAST / COALESCE / CASE handling in the task script for the columns in the error message.",
      "Compare the actual source schema against the task's expected schema.",
    ],
  },
  {
    category: "resource_or_capacity",
    confidence: "high",
    patterns: [
      /outofmemory/i,
      /oom\b/i,
      /container(?:\[| |\().*(?:exceeded|killed|exit)/i,
      /container\s+.*killed/i,
      /killed\s+by\s+external/i,
      /resource\s+exhausted/i,
      /insufficient\s+resources/i,
      /queue\s+is\s+full/i,
      /capacity\s+limit/i,
      /executor\s+lost/i,
      /pod\s+evicted/i,
      /memory\s+limit/i,
      /资源不足|内存不足|内存溢出|队列已满/i,
    ],
    probableCause: (found) =>
      `The workflow run exhausted compute/memory resources (the engine container/queue could not finish). Evidence: "${found}".`,
    actions: [
      "Check queue/resource-group usage and the DLC/Spark engine size; increase executor memory or parallelism conservatively.",
      "Reduce input data skew (salting) or add repartitioning to avoid long-tail tasks.",
      "Verify the scheduling resource group has quota and is not oversubscribed at this time window.",
    ],
  },
  {
    category: "connectivity",
    confidence: "high",
    patterns: [
      /connection\s+refused/i,
      /connection\s+timed?\s+out/i,
      /connect\s+exception/i,
      /cannot\s+connect/i,
      /unknown\s+host/i,
      /network\s+is\s+unreachable/i,
      /peer\s+reset/i,
      /broken\s+pipe/i,
      /handshake\s+exception/i,
      /authentication\s+to\s+server/i,
      /access\s+denied\s+for\s+user/i,
      /connection\s+reset/i,
      /无法连接|连接超时|连接被拒绝|网络不可达/i,
    ],
    probableCause: (found) =>
      `The task could not reach its dependency (data source, JDBC endpoint, or sibling service). Evidence: "${found}".`,
    actions: [
      "Verify the data source host/port is reachable from the engine network and the credentials are valid.",
      "Check for transient network events and retry the run; confirm the source is up during the scheduled window.",
      "Check WeData datasource config (endpoint, whitelist, VPC peering).",
    ],
  },
  {
    category: "partition_or_parameter",
    confidence: "medium",
    patterns: [
      /partition[\s\w]*not\s+found/i,
      /does\s+not\s+exist.*partition|no\s+partition/i,
      /\$?\{.*\}.*undefined|parameter\s+not\s+found/i,
      /variable\s+not\s+defined/i,
      /undefined\s+variable/i,
      /schedule\s+time\s+parameter/i,
      /分区不存在|参数未定义|变量未定义/i,
    ],
    probableCause: (found) =>
      `A scheduling parameter or partition referenced by the task was missing at runtime. Evidence: "${found}".`,
    actions: [
      "Check the task scheduling parameters (e.g. $bizdate / $scheduleTime) and their values at the failed run's ScheduleTime.",
      "Confirm the expected partition was produced by the upstream task before this task started.",
      "Re-run the upstream partition or backfill the date(s) before rerunning this workflow.",
    ],
  },
  {
    category: "job_timeout_or_cancel",
    confidence: "medium",
    patterns: [/timed?\s+out/i, /timeout/i, /cancelled|killed|aborted/i, /quit\s+with\s+code/i, /被取消|超时|已取消/i],
    probableCause: (found) =>
      `The run did not complete in the allowed time and was cancelled/timed-out. Evidence: "${found}".`,
    actions: [
      "Check if the timeout is a hard limit vs application; review recent run durations for slow tasks.",
      "Split long workflows or tune task timeouts / retry policy in WeData.",
    ],
  },
];

function compileRules(): RcaRule[] {
  return RCA_RULES;
}

export interface RcaInput {
  errorCodes: string[];
  errorMessages: string[];
  logText: string;
}

export function explainRca(input: RcaInput): RcaResult {
  const haystack = [...input.errorCodes.filter(Boolean), ...input.errorMessages.filter(Boolean), input.logText].join(
    "\n",
  );

  const rawErrors = [...input.errorCodes.filter(Boolean), ...input.errorMessages.filter(Boolean)];

  const matches: { rule: RcaRule; found: string }[] = [];
  for (const rule of compileRules()) {
    for (const pattern of rule.patterns) {
      const found = haystack.match(pattern)?.[0];
      if (found) {
        matches.push({ rule, found });
        break;
      }
    }
  }

  if (matches.length === 0) {
    return {
      verdict: "no_match",
      category: "unknown",
      confidence: "low",
      probable_cause:
        "No known error signature matched the run's error codes and log tail. Inspect the raw log excerpt below.",
      evidence: rawErrors.slice(0, 5),
      recommended_actions: [
        "Review the full instance log in WeData (Instance detail -> Log) for a stack trace beyond the tail excerpt.",
        "Search the error code on Tencent Cloud docs / WeData console to identify the failing component.",
        "Correlate the failure time with dependent systems (compute engine, data source availability).",
      ],
      raw_errors: rawErrors.slice(0, 20),
    };
  }

  const top = matches.slice(0, 3);
  const primary = top[0].rule;
  const verdict =
    top.length > 1
      ? `${primary.category} (plus ${top.length - 1} other signature${top.length > 2 ? "s" : ""})`
      : primary.category;

  return {
    verdict,
    category: primary.category,
    confidence: primary.confidence,
    probable_cause: primary.probableCause(top[0].found),
    evidence: top.map((m) => m.found),
    recommended_actions: primary.actions,
    raw_errors: rawErrors.slice(0, 20),
  };
}

// --- Orchestration -----------------------------------------------------------

export async function runWedataWorkflow(args: WedataRunArgs): Promise<WedataRunResult> {
  const { region, wait, timeoutMs, pollIntervalMs, maxLogLines, explain } = args;

  if (args.mode === "monitor" && !args.workflowExecutionId) {
    throw new Error("monitor mode requires workflow_execution_id.");
  }
  if (args.mode === "run" && !args.workflowId) {
    throw new Error("run mode requires workflow_id (or provide workflow_execution_id to monitor an existing run).");
  }

  const projectId = await resolveProjectId(args.projectId, args.projectName, region);

  let workflowId = args.workflowId;
  let workflowExecutionId = args.workflowExecutionId;

  const action: "run" | "monitor" = args.mode;
  if (action === "run") {
    if (!workflowId) throw new Error("run mode requires workflow_id.");
    workflowExecutionId = await triggerWorkflowRun(projectId, workflowId, args.taskIds ?? [], region);
    if (!wait) {
      return {
        status: "submitted",
        passed: null,
        mode: "run",
        project_id: projectId,
        workflow_id: workflowId,
        workflow_execution_id: workflowExecutionId,
        message: `Workflow run submitted. Poll with mode=monitor and workflow_execution_id=${workflowExecutionId}.`,
      };
    }
  }

  if (!workflowExecutionId) throw new Error("No workflow execution id is available.");
  if (!workflowId) {
    // In monitor mode we may not have the workflow id yet; fill it from the run.
    const brief = await getWorkflowRun(projectId, workflowExecutionId, region);
    workflowId = asString(brief?.WorkflowId) ?? undefined;
  }

  const deadline = Date.now() + timeoutMs;
  let run: any = null;
  for (;;) {
    run = await getWorkflowRun(projectId, workflowExecutionId, region);
    if (!run || !run.ExecutionState) {
      if (Date.now() >= deadline) {
        return outcomeFromRun(
          run,
          args.mode,
          projectId,
          workflowId,
          workflowExecutionId,
          "timed_out",
          maxLogLines,
          explain,
          region,
        );
      }
      await sleep(pollIntervalMs);
      continue;
    }
    const state = String(run.ExecutionState).toUpperCase();
    if (TERMINAL.has(state)) break;
    if (Date.now() >= deadline) {
      return outcomeFromRun(
        run,
        args.mode,
        projectId,
        workflowId,
        workflowExecutionId,
        "timed_out",
        maxLogLines,
        explain,
        region,
      );
    }
    await sleep(pollIntervalMs);
  }

  const state = String(run.ExecutionState).toUpperCase();
  if (TERMINAL_SUCCESS.has(state)) {
    const tasks = await listTaskRuns(projectId, workflowExecutionId, region);
    return {
      status: "succeeded",
      passed: true,
      mode: args.mode,
      project_id: projectId,
      workflow_id: workflowId,
      workflow_execution_id: workflowExecutionId,
      state,
      start_time: asString(run.ExecutionStartTime),
      end_time: asString(run.ExecutionEndTime),
      duration_seconds: toNumber(run.ExecutionCostTime),
      tasks: tasks.map(toTaskBrief),
      message: `WeData workflow ${workflowExecutionId} completed successfully.`,
    };
  }

  return outcomeFromRun(
    run,
    args.mode,
    projectId,
    workflowId,
    workflowExecutionId,
    "failed",
    maxLogLines,
    explain,
    region,
  );
}

function toNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function outcomeFromRun(
  run: any,
  mode: WedataRunArgs["mode"],
  projectId: string,
  workflowId: string | undefined,
  workflowExecutionId: string,
  status: "failed" | "timed_out",
  maxLogLines: number,
  explain: boolean,
  region: string | undefined,
): Promise<WedataRunResult> {
  const tasks = await listTaskRuns(projectId, workflowExecutionId, region).catch((err) => {
    getLogger().warn("ListTriggerTaskRuns failed", { error: err instanceof Error ? err.message : String(err) });
    return [];
  });
  const failedTasks = tasks.filter((t) =>
    TERMINAL_FAILURE.has(String(t.TaskExecutionState ?? t.ExecutionState ?? "").toUpperCase()),
  );
  const source = failedTasks.length > 0 ? failedTasks : tasks;

  const errorCodes = source.map((t) => asString(t.ErrorCodeStr ?? t.ErrorCode) ?? "").filter(Boolean);
  const errorMessages = [asString(run.ErrorMessage), asString(run.ErrorDescription), asString(run.ErrorCodeStr)].filter(
    Boolean,
  ) as string[];

  let logExcerpt = "";
  if (source.length > 0) {
    const first = source[0];
    const tail = await fetchTaskLogTail(projectId, first, region, maxLogLines).catch(() => "");
    logExcerpt = tail;
  }

  let rca: RcaResult | null = null;
  if (explain) {
    rca = explainRca({ errorCodes, errorMessages, logText: logExcerpt });
  }

  return {
    status,
    passed: false,
    mode,
    project_id: projectId,
    workflow_id: workflowId,
    workflow_execution_id: workflowExecutionId,
    state: asString(run.ExecutionState),
    error_code: asString(run.ErrorCodeStr),
    error_message: asString(run.ErrorMessage) ?? asString(run.ErrorDescription),
    start_time: asString(run.ExecutionStartTime),
    end_time: asString(run.ExecutionEndTime),
    duration_seconds: toNumber(run.ExecutionCostTime),
    tasks: tasks.map(toTaskBrief),
    failed_tasks: failedTasks.map(toTaskBrief),
    log_excerpt: logExcerpt.slice(0, 20000),
    rca,
    message:
      status === "failed"
        ? `WeData workflow ${workflowExecutionId} FAILED. ${errorCodes.length} failed task(s).`
        : `Timed out while waiting for WeData workflow ${workflowExecutionId}; check the run in the WeData console.`,
  };
}

---
name: tencent-wedata
description: Routes all Tencent Cloud WeData work — Studio authoring, operations and instances, data quality, lineage and catalog. Start here for any WeData task, then follow the linked specialized skill. Prefer the run_wedata_workflow helper for executions. Triggers on mentions of WeData, workflow, data pipeline, task instance, backfill, data quality, lineage, CodeStudio, data catalog, or ETL run. Reads pass automatically; CreateTriggerWorkflowRun is pre-allowlisted; authoring and deletion mutations are gated.
metadata:
  version: "2"
---

# Tencent Cloud WeData

Data pipeline platform on API version `v20250806` (182 actions). One service, five concerns — route to the specialized skill before acting:

| User need | Use this skill |
|---|---|
| Author workflows, tasks, code files, SQL scripts, folders (CodeStudio / Data Studio canvas) | **tencent-WEDATA-STUDIO** |
| Run, monitor, rerun, diagnose instances; alarms; backfills | **tencent-WEDATA-OPERATIONS** (also see `run_wedata_workflow`) |
| Quality rules, rule groups, templates, monitoring tasks | **tencent-WEDATA-QUALITY** |
| Column/table/process lineage, catalog tables, data sources | **tencent-WEDATA-LINEAGE** |
| Just execute a known workflow now | `run_wedata_workflow` with `{"mode": "run", "workflow_id": "wf-xxxx"}` |

**Works best with** the Tencent MCP server — `run_wedata_workflow` for execution, `call_tencent_api` with `service: "wedata"` for everything else. Nearly every action requires `ProjectId` — get it from `get_metadata_context` (`wedata.project_id`), never guess.

## Object model (read this first — most failures come from mixing families)

- **Design-time:** `Workflow` (canvas) → `Task` (node on canvas, `CreateTask`/`UpdateTask`/`SubmitTask`) and trigger-side twins `TriggerWorkflow` / `TriggerTask` (`CreateTriggerWorkflow`, `CreateTriggerTask`). Inspect with `GetTask` / `GetTaskCode` vs `GetTriggerTask` / `GetTriggerTaskCode`.
- **CodeStudio artifacts:** `CodeFile` (`CreateCodeFile`: needs `ProjectId` + `CodeFileName` + `ParentFolderPath` like `/aaa/bbb`, root is `/`), `SQLScript` (`CreateSQLScript`: `ScriptContent` must be **base64-encoded**), folders (`CreateCodeFolder`, `CreateSQLFolder`, `CreateTaskFolder`, `CreateWorkflowFolder` — folder paths always start with `/`).
- **Runtime:** `Instance` (`ListTaskInstances` needs only `ProjectId`; logs via `GetTaskInstanceLog` with `InstanceKey` + optional `LifeRoundNum`), `TriggerWorkflowRun` (`CreateTriggerWorkflowRun`: `ProjectId` + `WorkflowId` — **pre-allowlisted**).

## Safety

- **Auto-allowed:** `List*`, `Get*`, `Describe*`, `run_wedata_workflow` monitor mode, `CreateTriggerWorkflowRun`.
- **Gated:** `Create*`, `Update*`, `Modify*`, `Submit*`, `Delete*`, `Kill*`, `Rerun*`, `Stop*`, `Pause*`, `Authorize*`, `Grant*`, `Revoke*`.
- A run executes real pipelines (writes + compute). Confirm `ProjectId` + `WorkflowId` before `mode: "run"`.

## Mistakes to avoid

- `RerunType` on `RerunTaskInstancesAsync`: `1` = self, `2` = self+children, `3` = children only — default is `1`, not "everything downstream".
- `TimeZone` defaults to `UTC+8` on instance queries — passing UTC timestamps without `TimeZone` shifts the window by 8 hours.
- `KillTaskInstancesAsync` / `KillTriggerWorkflowRuns` are deny-prefixed and blocked — stuck runs need console or allowlist intervention.
- `SubmitTask` needs `ProjectId` + `TaskId` + `VersionRemark`, and only works on tasks authored in the same project.

## Verify

- `run_wedata_workflow` run mode waits for terminal state with per-task results and RCA on failure — that is the verification.
- After authoring, `GetWorkflow` / `GetTaskVersion` must show the new definition before triggering.

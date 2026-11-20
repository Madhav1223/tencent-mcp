---
name: tencent-wedata-operations
description: Operates WeData runtime — trigger workflow runs, monitor instances, read logs, rerun or mark-success failed instances, manage alarms, and plan backfills. Use for any run/monitor/diagnose/recover task. Triggers on mentions of run workflow, monitor, instance log, rerun, backfill, alarm, task instance, failed run, or ops. Monitor-mode reads pass automatically; CreateTriggerWorkflowRun is pre-allowlisted; rerun/kill/stop mutations are gated or denied.
metadata:
  version: "1"
---

# WeData Operations (Runs, Instances, Alarms, Backfills)

Run it, watch it, fix it. Prefers the `run_wedata_workflow` helper; raw actions below for control the helper doesn't expose.

## Run and monitor

| Action | Required params | Notes |
|---|---|---|
| `run_wedata_workflow` `mode: "run"` | `workflow_id` (+ `project_id` from metadata) | Polls to terminal state, per-task results, RCA with log tail on failure — **this is the default path** |
| `CreateTriggerWorkflowRun` | `ProjectId`, `WorkflowId`; optional `TaskIds` (subset — null/empty runs all), `AdvancedParams` (override scheduling params), `SchedulingResourceGroupId` / `IntegrationResourceGroupId` | **Pre-allowlisted.** `TaskIds` lets you run one node of a large workflow |
| `run_wedata_workflow` `mode: "monitor"` | `workflow_execution_id` | No new run; use for in-flight checks |
| `GetTriggerWorkflowRun` / `ListTriggerWorkflowRuns` | `ProjectId` (+ run ID) | Raw run status when the helper isn't in play |
| `GetOpsAsyncJob` | async-job ID | Follows `*Async` submits (`PauseOpsTasksAsync`, `RerunTriggerWorkflowRunAsync`) to completion |

## Diagnose a failure

1. Read the helper's RCA first (error codes + failed-task log tail are included).
2. Full logs: `GetTaskInstanceLog` with `ProjectId` + `InstanceKey` (+ `LifeRoundNum` for rerun attempts — `0` is the first run, `1` the first rerun; default is latest). Paginate with `NextCursor`, filter with `LogLevel` (`Info`/`Debug`/`Warn`/`Error`/`All`).
3. Blast radius: `ListUpstreamTaskInstances` / `ListDownstreamTaskInstances` on the failed instance; execution attempts via `ListTaskInstanceExecutions`.
4. History: `ListTaskInstances` needs only `ProjectId` — add `Keyword` (task name or ID, fuzzy, comma-separated multiples), time range (default timezone `UTC+8` — set `TimeZone` explicitly when passing UTC), `PageNumber`/`PageSize` (max 100).

## Recover

| Action | Required params | Notes |
|---|---|---|
| `RerunTaskInstancesAsync` | `ProjectId`, `InstanceKeyList` (from `ListTaskInstances`) | `RerunType`: `1` self (default), `2` self+children, `3` children only. `CheckParentType`: `NONE` (default) / `ALL` / `MAKE_SCOPE`. `SonRangeType`: `WORKFLOW` (default) / `PROJECT` / `ALL` — **gated** |
| `SetSuccessTaskInstancesAsync` | `ProjectId`, `InstanceKeyList` | Marks failed instances success without running — **gated**; use only when downstream was fixed out-of-band |
| `CreateDataBackfillPlan` | `ProjectId`, `TaskIds`, `DataBackfillRangeList` | `TimeZone` default `UTC+8`; `CheckParentType` default `NONE`; `SkipEventListening` default true — **gated**; track with `ListDataBackfillInstances` |
| `KillTaskInstancesAsync` / `KillTriggerWorkflowRuns` | — | **Denied by prefix** — stuck runs need console or an allowlist entry |

## Alarms

`ListOpsAlarmRules` → `GetOpsAlarmRule`; create with `CreateOpsAlarmRule`, update with `UpdateOpsAlarmRule` (**gated**). Alarm history: `ListAlarmMessages` (`ProjectId` + `StartTime`/`EndTime` as `yyyy-MM-dd HH:mm:ss` + `AlarmLevel`). Silence noisy rules with `CreateAlarmShield`, not deletion.

## Mistakes to avoid

- Rerunning without `CheckParentType` when the root cause is upstream just reproduces the failure — check lineage first (`tencent-WEDATA-LINEAGE`).
- `SetSuccess*` hides the failure from SLAs and downstream triggers — prefer real reruns; reserve mark-success for cases fixed outside the pipeline, with a note.
- Async actions return a job, not a result — follow every `*Async` call with `GetOpsAsyncJob` or `mode: "monitor"`.

## Verify

- `run_wedata_workflow` run mode IS the verification (terminal state + per-task results).
- For raw calls: `GetTriggerWorkflowRun` shows the final status; `ListTaskInstances` filtered by time confirms the new attempt exists.

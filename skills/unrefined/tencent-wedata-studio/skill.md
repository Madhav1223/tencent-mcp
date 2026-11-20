---
name: tencent-wedata-studio
description: Authors in WeData Studio (CodeStudio / Data Studio canvas) — folders, code files, SQL scripts, workflows, tasks, and submits. Use when creating or editing any design-time artifact: workflow canvas, task nodes, code, SQL, or project structure. Triggers on mentions of WeData Studio, CodeStudio, data studio, create workflow, create task, code file, SQL script, task folder, submit task, or authoring. All authoring mutations are gated; reads pass automatically. Requires ProjectId on every call.
metadata:
  version: "1"
---

# WeData Studio Authoring (CodeStudio)

End-to-end authoring flow in WeData Studio: project structure → code → workflow → task → submit. Every call needs `ProjectId`.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "wedata"`. All actions below are **gated** (need `TENCENT_MCP_ALLOW_MUTATIONS` entries like `wedata:CreateTask`); reads are auto-allowed.

## The authoring sequence (follow in order)

### 1. Project structure — folders first

| Action | Required params | Notes |
|---|---|---|
| `CreateWorkflowFolder` | `ProjectId`, `ParentFolderPath`, folder name | Paths start with `/`; root is `/` or empty string |
| `CreateTaskFolder` | `ProjectId`, `WorkflowId`, `ParentTaskFolderPath`, `TaskFolderName`, `TaskFolderType` | Task folders live **inside a workflow** — get `WorkflowId` from `ListWorkflows` first |
| `CreateCodeFolder` / `CreateSQLFolder` | `ProjectId`, `ParentFolderPath`, name | CodeStudio explorers |

Verify with `ListWorkflowFolders` / `ListTaskFolders` / `ListCodeFolderContents` before writing into them.

### 2. Code artifacts

| Action | Required params | Notes |
|---|---|---|
| `CreateCodeFile` | `ProjectId`, `CodeFileName`, `ParentFolderPath` (e.g. `/aaa/bbb`, root `/`) | Body goes in `CodeFileContent`; config in `CodeFileConfig` |
| `CreateSQLScript` | `ProjectId`, `ScriptName` | **`ScriptContent` must be base64-encoded** or the script saves empty; `AccessScope`: `SHARED` or `PRIVATE` |
| `CreateResourceFile` | `ProjectId`, resource name + folder | Jars, archives, and files tasks reference |

Read back with `GetCodeFile` / `GetSQLScript` / `GetResourceFile` — never assume the write applied.

### 3. Workflow + task

| Action | Required params | Notes |
|---|---|---|
| `CreateWorkflow` | `ProjectId`, `WorkflowName`, `ParentFolderPath` | `WorkflowType`: `cycle` (scheduled, default) or `manual`; set `OwnerUin` explicitly or ownership defaults may surprise |
| `CreateTask` | `ProjectId`, `TaskBaseAttribute`, `TaskConfiguration`, `TaskSchedulerConfiguration` | Three structured objects — inspect `GetTask` on a similar existing task and mirror its shape rather than inventing fields |
| `CreateTriggerTask` / `CreateTriggerWorkflow` | Same triple with `TriggerTask*` prefix + `ProjectId` | The runtime-side twins; needed when wiring scheduled triggers directly |

### 4. Submit

`SubmitTask` with `ProjectId` + `TaskId` + `VersionRemark` — unsubmitted drafts never run. Confirm with `GetTaskVersion` / `ListTaskVersions`, then trigger via `CreateTriggerWorkflowRun` (pre-allowlisted) or `run_wedata_workflow`.

## Mistakes to avoid

- **Folder path formats differ slightly per API** (`/aaa/bbb` vs `/aaa/bbb/ccc`, root as `/` vs empty string) — copy the exact convention from each action's doc; a wrong path creates stray root-level folders.
- `TaskFolderType` is an enum (check `ListTaskFolders` output for valid values) — free text fails validation.
- Creating a task does **not** schedule it — without `TaskSchedulerConfiguration` + submit + trigger wiring, it sits inert.
- `UpdateTask` / `UpdateTaskPartially` need the full current definition base — `GetTaskCode` first, modify, then update; partial updates on stale definitions cause version conflicts.

## Verify

- After each step, read back (`GetCodeFile`, `GetTask`, `GetWorkflow`) — Studio APIs return success on accepted writes that still fail async validation.
- Final gate: `GetTaskVersion` shows the submitted version; only then trigger the run.

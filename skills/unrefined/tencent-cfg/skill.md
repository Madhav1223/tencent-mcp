---
name: tencent-cfg
description: Tencent Cloud CFG via the Tencent MCP server — 17 actions in API version v20210820 (9 read-only auto-allowed). Use for action, execute, from, template, trigger, field. Triggers on mentions of cfg, action, execute, from, template, trigger, field, library, multi. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CFG

General service: 17 actions in API version `v20210820` — 9 read-only (auto-allowed), 6 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cfg"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cfg/v20210820 — action signatures in `cfg_client.ts`, full request/response shapes in `cfg_models.ts`.

## Read actions (auto-allowed, 9)

| Action | What it does |
|---|---|
| `DescribeObjectTypeList` | Describe object type list |
| `DescribeTemplateList` | Describe template list<br>Required: `Limit`, `Offset` |
| `DescribeTaskList` | Describe task list<br>Required: `Limit`, `Offset` |
| `DescribeTaskPolicyTriggerLog` | Describe task policy trigger log<br>Required: `TaskId`, `Page`, `PageSize` |
| `DescribeTaskExecuteLogs` | Describe task execute logs<br>Required: `TaskId`, `Limit`, `Offset` |
| `DescribeActionLibraryList` | Describe action library list<br>Required: `Limit`, `Offset` (default 0), `ObjectType` |
| `DescribeActionFieldConfigList` | Describe action field config list<br>Required: `ActionIds`, `ObjectTypeId` |
| `DescribeTask` | Describe task<br>Required: `TaskId` |
| `DescribeTemplate` | Describe template<br>Required: `TemplateId` |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `CreateTaskFromTemplate` | Create task from template<br>Required: `TemplateId`, `TaskConfig` |
| `CreateTaskFromMultiAction` | Create task from multi action<br>Required: `TaskInstances` |
| `ExecuteTaskInstance` | Execute task instance<br>Required: `TaskId`, `TaskActionId`, `TaskInstanceIds`, `IsOperateAll`, `ActionType`, `TaskGroupId` |
| `ExecuteTask` | Execute task<br>Required: `TaskId` |
| `CreateTaskFromAction` | Create task from action<br>Required: `TaskActionId`, `TaskInstances` |
| `TriggerPolicy` | Trigger policy<br>Required: `TaskId`, `Name`, `Content`, `TriggerType` |

## Blocked destructive actions (2)

`ModifyTaskRunStatus`, `DeleteTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cfg`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210820` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cfg"`) for the allow/block decision and reason.

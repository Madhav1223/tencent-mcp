---
name: tencent-batch
description: Tencent Cloud BATCH via the Tencent MCP server — 30 actions in API version v20170312 (15 read-only auto-allowed). Use for compute, terminate, create, infos, instances, jobs. Triggers on mentions of batch, compute, terminate, create, infos, instances, jobs, submit, template. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud BATCH

Compute instances & pools: 30 actions in API version `v20170312` — 15 read-only (auto-allowed), 6 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "batch"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/batch/v20170312 — action signatures in `batch_client.ts`, full request/response shapes in `batch_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeJobMonitorData` | Describe job monitor data<br>Required: `JobId`, `TaskName`, `TaskInstanceIndex`, `MetricName` (unit: %) |
| `DescribeComputeEnv` | Describe compute env<br>Required: `EnvId` |
| `DescribeJobs` | Describe jobs |
| `DescribeAvailableCvmInstanceTypes` | Describe available cvm instance types |
| `DescribeTaskLogs` | Describe task logs<br>Required: `JobId`, `TaskName` |
| `DescribeTask` | Describe task<br>Required: `JobId`, `TaskName` |
| `DescribeCvmZoneInstanceConfigInfos` | Describe cvm zone instance config infos |
| `DescribeJob` | Describe job<br>Required: `JobId` |
| `DescribeTaskTemplates` | Describe task templates |
| `DescribeInstanceCategories` | Describe instance categories |
| `DescribeJobSubmitInfo` | Describe job submit info<br>Required: `JobId` |
| `DescribeComputeEnvCreateInfo` | Describe compute env create info<br>Required: `EnvId` |
| `DescribeComputeEnvActivities` | Describe compute env activities<br>Required: `EnvId` |
| `DescribeComputeEnvCreateInfos` | Describe compute env create infos |
| `DescribeComputeEnvs` | Describe compute envs |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `CreateTaskTemplate` | Create task template<br>Required: `TaskTemplateName`, `TaskTemplateInfo` |
| `AttachInstances` | Attach instances<br>Required: `EnvId`, `Instances` |
| `CreateComputeEnv` | Create compute env<br>Required: `ComputeEnv`, `Placement` |
| `DetachInstances` | Detach instances<br>Required: `EnvId`, `InstanceIds` |
| `SubmitJob` | Submit job<br>Required: `Placement`, `Job` |
| `RetryJobs` | Retry jobs<br>Required: `JobIds` |

## Blocked destructive actions (9)

`TerminateComputeNode`, `DeleteComputeEnv`, `TerminateJob`, `TerminateComputeNodes`, `DeleteTaskTemplates`, `TerminateTaskInstance`, `ModifyComputeEnv`, `DeleteJob`, `ModifyTaskTemplate` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `batch`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20170312` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="batch"`) for the allow/block decision and reason.

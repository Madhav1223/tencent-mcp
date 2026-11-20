---
name: tencent-thpc
description: Tencent Cloud THPC via the Tencent MCP server — 43 actions in API version v20230321 (15 read-only auto-allowed). Use for workspaces, cluster, auto, nodes, queue, scaling. Triggers on mentions of thpc, workspaces, cluster, auto, nodes, queue, scaling, scheduled, action. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud THPC

Compute instances & pools: 43 actions in API version `v20230321` — 15 read-only (auto-allowed), 13 gated mutations, 15 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "thpc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/thpc/v20230321 — action signatures in `thpc_client.ts`, full request/response shapes in `thpc_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeAutoScalingConfiguration` | Describe auto scaling configuration<br>Required: `ClusterId` |
| `DescribeJobs` | Describe jobs |
| `DescribeQueues` | Describe queues<br>Required: `ClusterId` |
| `DescribeWorkspaces` | Describe workspaces |
| `DescribeNodes` | Describe nodes |
| `DescribeClusters` | Describe clusters |
| `DescribeQueueAutoScalingOverview` | Describe queue auto scaling overview<br>Required: `ClusterId` |
| `DescribeInstanceFamilies` | Describe instance families<br>Required: `ClusterId` |
| `DescribeInitNodeScripts` | Describe init node scripts<br>Required: `ClusterId` |
| `DescribeJobSubmitInfo` | Describe job submit info<br>Required: `JobId` |
| `DescribeQueueAutoScaling` | Describe queue auto scaling<br>Required: `ClusterId` |
| `DescribeClusterActivities` | Describe cluster activities<br>Required: `ClusterId` |
| `DescribeClusterStorageOption` | Describe cluster storage option<br>Required: `ClusterId` |
| `DescribeJobsOverview` | Describe jobs overview<br>Required: `ClusterId` |
| `DescribeScheduledActions` | Describe scheduled actions<br>Required: `ClusterId` |
## Mutations (gated — need allowlist, 13)

| Action | What it does |
|---|---|
| `CreateCluster` | Create cluster |
| `CreateWorkspaces` | Create workspaces |
| `AddNodes` | Add nodes<br>Required: `Placement`, `ClusterId`, `VirtualPrivateCloud`, `Count` |
| `CreateScheduledAction` | Create scheduled action<br>Required: `ClusterId`, `QueueName`, `ScheduledActionName`, `StartTime` (format `YYYY-MM-DD…`), `DesiredCapacity` |
| `InquirePriceCreateWorkspaces` | Inquire the price of: create workspaces |
| `SetAutoScalingConfiguration` | Set auto scaling configuration<br>Required: `ClusterId` |
| `AddQueue` | Add queue<br>Required: `ClusterId`, `QueueName` |
| `DetachNodes` | Detach nodes<br>Required: `ClusterId`, `NodeIds` |
| `SubmitJob` | Submit job<br>Required: `ClusterId`, `Job` |
| `AddClusterStorageOption` | Add cluster storage option<br>Required: `ClusterId`, `StorageOption` |
| `InquirePriceModifyWorkspacesChargeType` | Inquire the price of: modify workspaces charge type<br>Required: `SpaceIds`, `SpaceChargeType` |
| `SetQueueAutoScaling` | Set queue auto scaling<br>Required: `ClusterId`, `QueueName` |
| `AttachNodes` | Attach nodes<br>Required: `ClusterId`, `ResourceSet` |

## Blocked destructive actions (15)

`DeleteNodes`, `TerminateWorkspaces`, `ModifyWorkspacesAttribute`, `DeleteCluster`, `ModifyWorkspacesRenewFlag`, `DeleteScheduledAction`, `ModifyScheduledAction`, `DeleteClusterStorageOption`, `TerminateJob`, `ModifyWorkspacesChargeType`, `ModifyNodeAttribute`, `ModifyClusterDeletionProtection`, `ModifyInitNodeScripts`, `DeleteJob`, `DeleteQueue` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `thpc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230321` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="thpc"`) for the allow/block decision and reason.

---
name: tencent-cdwch
description: Tencent Cloud CDWCH via the Tencent MCP server — 31 actions in API version v20200915 (16 read-only auto-allowed). Use for back, scale, cluster, schedule, action, alter. Triggers on mentions of cdwch, back, scale, cluster, schedule, action, alter, apis, clusters. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud CDWCH

Databases: 31 actions in API version `v20200915` — 16 read-only (auto-allowed), 8 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdwch"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdwch/v20200915 — action signatures in `cdwch_client.ts`, full request/response shapes in `cdwch_models.ts`.

## Read actions (auto-allowed, 16)

| Action | What it does |
|---|---|
| `DescribeBackUpJob` | Describe back up job<br>Required: `InstanceId` |
| `DescribeInstanceKeyValConfigs` | Describe instance key val configs<br>Required: `InstanceId` |
| `DescribeBackUpTables` | Describe back up tables<br>Required: `InstanceId` |
| `DescribeInstanceShards` | Describe instance shards<br>Required: `InstanceId` |
| `DescribeInstancesNew` | Describe instances new |
| `DescribeInstanceState` | Describe instance state<br>Required: `InstanceId` |
| `DescribeClusterConfigs` | Describe cluster configs<br>Required: `InstanceId` |
| `DescribeCkSqlApis` | Describe ck sql apis<br>Required: `InstanceId`, `ApiType` |
| `DescribeSpec` | Describe spec<br>Required: `Zone` |
| `DescribeBackUpSchedule` | Describe back up schedule<br>Required: `InstanceId` |
| `DescribeBackUpJobDetail` | Describe back up job detail<br>Required: `InstanceId`, `BackUpJobId` |
| `DescribeInstanceClusters` | Describe instance clusters<br>Required: `InstanceId` |
| `DescribeInstance` | Describe instance<br>Required: `InstanceId` |
| `DescribeEventTasks` | Describe event tasks<br>Required: `InstanceId` |
| `DescribeInstanceNodes` | Describe instance nodes<br>Required: `InstanceId` |
| `DescribeCNInstances` | Describe cninstances |
## Mutations (gated — need allowlist, 8)

| Action | What it does |
|---|---|
| `CreateBackUpSchedule` | Create back up schedule<br>Required: `InstanceId`, `ScheduleType`, `OperationType` |
| `OpenBackUp` | Open back up<br>Required: `InstanceId`, `OperationType`, `CosBucketName` |
| `ScaleUpInstance` | Scale up instance<br>Required: `InstanceId`, `Type`, `SpecName`, `ScaleUpEnableRolling` |
| `ScaleOutInstance` | Scale out instance<br>Required: `InstanceId`, `Type`, `NodeCount` |
| `ActionAlterCkUser` | Run action alter ck user<br>Required: `UserInfo`, `ApiType` |
| `ScaleCNOutUpInstance` | Scale cnout up instance<br>Required: `InstanceId`, `VirtualCluster`, `UserSubnetID`, `NewCount`, `NewSpecName` |
| `CreateInstanceNew` | Create instance new<br>Required: `Zone`, `HaFlag`, `UserVPCId`, `UserSubnetId`, `ProductVersion`, `ChargeProperties`, `InstanceName`, `DataSpec` |
| `ResizeDisk` | Resize disk<br>Required: `InstanceId`, `Type`, `DiskSize` |

## Blocked destructive actions (7)

`DestroyInstance`, `ModifyInstanceKeyValConfigs`, `DeleteBackUpData`, `ModifyClusterConfigs`, `RestartInstance`, `RecoverBackUpJob`, `ModifyUserNewPrivilege` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdwch`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200915` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdwch"`) for the allow/block decision and reason.

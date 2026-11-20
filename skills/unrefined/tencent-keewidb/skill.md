---
name: tencent-keewidb
description: Tencent Cloud KEEWIDB via the Tencent MCP server — 38 actions in API version v20220308 (18 read-only auto-allowed). Use for security, backup, auto, connection, destroy, instances. Triggers on mentions of keewidb, security, backup, auto, connection, destroy, instances, maintenance, params. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud KEEWIDB

Databases: 38 actions in API version `v20220308` — 18 read-only (auto-allowed), 9 gated mutations, 11 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "keewidb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/keewidb/v20220308 — action signatures in `keewidb_client.ts`, full request/response shapes in `keewidb_models.ts`.

## Read actions (auto-allowed, 18)

| Action | What it does |
|---|---|
| `DescribeInstanceNodeInfo` | Describe instance node info<br>Required: `InstanceId` |
| `DescribeTaskList` | Describe task list |
| `DescribeMaintenanceWindow` | Describe maintenance window<br>Required: `InstanceId` |
| `DescribeInstanceBackups` | Describe instance backups<br>Required: `InstanceId` |
| `DescribeInstances` | Describe instances |
| `DescribeConnectionConfig` | Describe connection config<br>Required: `InstanceId` |
| `DescribeInstanceBinlogs` | Describe instance binlogs<br>Required: `InstanceId` |
| `DescribeAutoBackupConfig` | Describe auto backup config<br>Required: `InstanceId` |
| `DescribeTaskInfo` | Describe task info<br>Required: `TaskId` |
| `DescribeProxySlowLog` | Describe proxy slow log<br>Required: `InstanceId`, `BeginTime`, `EndTime` |
| `DescribeProjectSecurityGroups` | Describe project security groups<br>Required: `Product` |
| `DescribeTendisSlowLog` | Describe tendis slow log<br>Required: `InstanceId`, `BeginTime`, `EndTime` |
| `DescribeInstanceParams` | Describe instance params<br>Required: `InstanceId` |
| `DescribeInstanceReplicas` | Describe instance replicas<br>Required: `InstanceId` |
| `DescribeProductInfo` | Describe product info |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `Product`, `InstanceId` |
| `DescribeInstanceParamRecords` | Describe instance param records<br>Required: `InstanceId` |
| `DescribeInstanceDealDetail` | Describe instance deal detail |
## Mutations (gated — need allowlist, 9)

| Action | What it does |
|---|---|
| `CleanUpInstance` | Run clean up instance<br>Required: `InstanceId` |
| `ChangeInstanceMaster` | Run change instance master<br>Required: `InstanceId`, `NodeId` |
| `CreateInstances` | Create instances<br>Required: `TypeId`, `UniqVpcId`, `UniqSubnetId`, `BillingMode`, `GoodsNum`, `Period`, `ShardNum`, `ReplicasNum`, `MachineMemory` (unit: GB) |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `Product`, `SecurityGroupId`, `InstanceIds` |
| `UpgradeInstance` | Upgrade instance<br>Required: `InstanceId` |
| `CreateBackupManually` | Create backup manually<br>Required: `InstanceId` |
| `ClearInstance` | Run clear instance<br>Required: `InstanceId` |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `Product`, `SecurityGroupId`, `InstanceIds` |
| `StartUpInstance` | Start up instance<br>Required: `InstanceId` |

## Blocked destructive actions (11)

`ModifyMaintenanceWindow`, `ModifyNetworkConfig`, `ModifyAutoBackupConfig`, `ResetPassword`, `RenewInstance`, `ModifyInstanceParams`, `ModifyDBInstanceSecurityGroups`, `ModifyConnectionConfig`, `DestroyPrepaidInstance`, `DestroyPostpaidInstance`, `ModifyInstance` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `keewidb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220308` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="keewidb"`) for the allow/block decision and reason.

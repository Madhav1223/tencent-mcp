---
name: tencent-tcaplusdb
description: Tencent Cloud TCAPLUSDB via the Tencent MCP server — 52 actions in API version v20190823 (15 read-only auto-allowed). Use for table, tables, cluster, tags, snapshots, backup. Triggers on mentions of tcaplusdb, table, tables, cluster, tags, snapshots, backup, index, machine. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud TCAPLUSDB

Databases: 52 actions in API version `v20190823` — 15 read-only (auto-allowed), 16 gated mutations, 21 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tcaplusdb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tcaplusdb/v20190823 — action signatures in `tcaplusdb_client.ts`, full request/response shapes in `tcaplusdb_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeTableTags` | Describe table tags<br>Required: `ClusterId`, `SelectedTables` |
| `DescribeMachine` | Describe machine |
| `DescribeUinInWhitelist` | Describe uin in whitelist |
| `DescribeTablesInRecycle` | Describe tables in recycle |
| `DescribeClusters` | Describe clusters |
| `DescribeRegions` | Describe regions |
| `DescribeTasks` | Describe tasks |
| `DescribeSnapshots` | Describe snapshots<br>Required: `ClusterId` |
| `DescribeBackupRecords` | Describe backup records |
| `DescribeApplications` | Describe applications |
| `DescribeTableGroupTags` | Describe table group tags<br>Required: `ClusterId`, `TableGroupIds` |
| `DescribeTableGroups` | Describe table groups<br>Required: `ClusterId` |
| `DescribeIdlFileInfos` | Describe idl file infos<br>Required: `ClusterId` |
| `DescribeTables` | Describe tables |
| `DescribeClusterTags` | Describe cluster tags<br>Required: `ClusterIds` |
## Mutations (gated — need allowlist, 16)

| Action | What it does |
|---|---|
| `UpdateApply` | Update apply<br>Required: `ApplyStatus` |
| `CreateCluster` | Create cluster<br>Required: `IdlType`, `ClusterName`, `VpcId`, `SubnetId`, `Password` |
| `MergeTablesData` | Merge tables data<br>Required: `SelectedTables`, `IsOnlyCompare` |
| `DisableRestProxy` | Disable rest proxy<br>Required: `ClusterId` |
| `SetTableDataFlow` | Set table data flow<br>Required: `ClusterId`, `SelectedTables` |
| `SetTableIndex` | Set table index<br>Required: `ClusterId`, `SelectedTables` |
| `CreateSnapshots` | Create snapshots<br>Required: `ClusterId`, `SelectedTables` |
| `EnableRestProxy` | Enable rest proxy<br>Required: `ClusterId` |
| `SetBackupExpireRule` | Set backup expire rule<br>Required: `ClusterId`, `BackupExpireRules` |
| `CreateBackup` | Create backup<br>Required: `ClusterId`, `SelectedTables` |
| `CreateTables` | Create tables<br>Required: `ClusterId`, `IdlFiles`, `SelectedTables` |
| `CreateTableGroup` | Create table group<br>Required: `ClusterId`, `TableGroupName` |
| `ImportSnapshots` | Import snapshots<br>Required: `ClusterId`, `Snapshots`, `ImportSpecialKey`, `ImportOriginTable` |
| `CompareIdlFiles` | Compare idl files<br>Required: `ClusterId`, `SelectedTables` |
| `VerifyIdlFiles` | Verify idl files<br>Required: `ClusterId` |
| `ClearTables` | Run clear tables<br>Required: `ClusterId`, `SelectedTables` |

## Blocked destructive actions (21)

`DeleteTableIndex`, `ModifyTableTags`, `ModifyClusterName`, `DeleteBackupRecords`, `DeleteCluster`, `ModifyClusterPassword`, `DeleteIdlFiles`, `ModifyCensorship`, `ModifyTableQuotas`, `ModifyClusterMachine`, `DeleteTableGroup`, `ModifyTableGroupName`, `DeleteSnapshots`, `RecoverRecycleTables`, `ModifyClusterTags`, `ModifyTableGroupTags`, `DeleteTables`, `ModifyTableMemos`, `ModifySnapshots`, `DeleteTableDataFlow`, `ModifyTables` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tcaplusdb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190823` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tcaplusdb"`) for the allow/block decision and reason.

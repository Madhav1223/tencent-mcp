---
name: tencent-tdmysql
description: Tencent Cloud TDMYSQL via the Tencent MCP server — 46 actions in API version v20211122 (22 read-only auto-allowed). Use for dbsbackup, dbinstance, dbinstances, dbparameters, instances, isolate. Triggers on mentions of tdmysql, dbsbackup, dbinstance, dbinstances, dbparameters, instances, isolate, maintenance, privileges. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud TDMYSQL

Databases: 46 actions in API version `v20211122` — 22 read-only (auto-allowed), 7 gated mutations, 17 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tdmysql"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tdmysql/v20211122 — action signatures in `tdmysql_client.ts`, full request/response shapes in `tdmysql_models.ts`.

## Read actions (auto-allowed, 22)

| Action | What it does |
|---|---|
| `DescribeDBSBackupPolicy` | Describe dbsbackup policy<br>Required: `InstanceId` |
| `DescribeDatabaseObjects` | Describe database objects<br>Required: `InstanceId`, `DbName` |
| `DescribeSaleInfo` | Describe sale info |
| `DescribeDBEngines` | Describe dbengines |
| `DescribeUsers` | Describe users<br>Required: `InstanceId` |
| `DescribeFlow` | Describe flow<br>Required: `FlowId` |
| `DescribeDBParameters` | Describe dbparameters<br>Required: `InstanceId` |
| `DescribeDBSArchiveLogs` | Describe dbsarchive logs<br>Required: `InstanceId` |
| `DescribeDBSBackupSets` | Describe dbsbackup sets<br>Required: `InstanceId` |
| `DescribeDBSBackupStatistics` | Describe dbsbackup statistics<br>Required: `InstanceId` |
| `DescribeSlowLogs` | Describe slow logs<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeInstanceSSLStatus` | Describe instance sslstatus<br>Required: `InstanceId` |
| `DescribeDBSAvailableRecoveryTime` | Describe dbsavailable recovery time<br>Required: `InstanceId` |
| `DescribeUserPrivileges` | Describe user privileges<br>Required: `InstanceId`, `Host`, `UserName`, `DbName` |
| `DescribeSpecs` | Describe specs |
| `DescribeDBSBackupStatisticsDetail` | Describe dbsbackup statistics detail<br>Required: `InstanceId` |
| `DescribeDatabases` | Describe databases<br>Required: `InstanceId` |
| `DescribeDBInstances` | Describe db instances |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `InstanceId` |
| `DescribeMaintenanceWindow` | Describe maintenance window<br>Required: `InstanceId` |
| `DescribeDBInstanceDetail` | Describe db instance detail<br>Required: `InstanceId` |
| `DescribeDBSCloneInstances` | Describe dbsclone instances<br>Required: `SourceInstanceId` |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `CreateCloneInstance` | Create clone instance<br>Required: `Zone`, `VpcId`, `SubnetId`, `SpecCode`, `Disk`, `StorageNodeNum`, `InstanceId` |
| `IsolateDBInstance` | Run isolate dbinstance<br>Required: `InstanceIds` |
| `CreateDBInstances` | Create db instances<br>Required: `Zone`, `VpcId`, `SubnetId`, `SpecCode`, `Disk`, `StorageNodeNum`, `Replications`, `InstanceCount` |
| `CreateUsers` | Create users<br>Required: `InstanceId` |
| `CreateDBSBackup` | Create dbsbackup<br>Required: `BackupMethod`, `BackupType`, `InstanceId` |
| `UpgradeInstance` | Upgrade instance<br>Required: `InstanceId`, `SpecCode`, `Disk` |
| `ExpandInstance` | Run expand instance<br>Required: `InstanceId`, `StorageNodeNum` |

## Blocked destructive actions (17)

`ResetUsersPassword`, `ModifyInstanceSSLStatus`, `ModifyInstanceNetwork`, `ModifyMaintenanceWindow`, `CancelIsolateDBInstances`, `ModifyDBInstanceVPort`, `ModifyDBParameters`, `RestartDBInstances`, `ModifyInstanceName`, `DestroyInstances`, `ModifyAutoRenewFlag`, `ModifyUserPrivileges`, `ModifyDBSBackupPolicy`, `DeleteUsers`, `ModifyDBInstanceSecurityGroups`, `DeleteDBSBackupSets`, `ModifyDBSBackupSetComment` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tdmysql`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20211122` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tdmysql"`) for the allow/block decision and reason.

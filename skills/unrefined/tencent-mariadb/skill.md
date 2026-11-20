---
name: tencent-mariadb
description: Tencent Cloud MARIADB via the Tencent MCP server — 81 actions in API version v20170312 (32 read-only auto-allowed). Use for dbinstance, backup, hour, dbinstances, dedicated, privileges. Triggers on mentions of mariadb, dbinstance, backup, hour, dbinstances, dedicated, privileges, security, upgrade. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud MARIADB

Databases: 81 actions in API version `v20170312` — 32 read-only (auto-allowed), 22 gated mutations, 27 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mariadb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mariadb/v20170312 — action signatures in `mariadb_client.ts`, full request/response shapes in `mariadb_models.ts`.

## Read actions (auto-allowed, 32)

| Action | What it does |
|---|---|
| `DescribeAccountPrivileges` | Describe account privileges<br>Required: `InstanceId`, `UserName`, `Host`, `DbName` |
| `DescribeRenewalPrice` | Describe renewal price<br>Required: `InstanceId` |
| `DescribeInstanceNodeInfo` | Describe instance node info<br>Required: `InstanceId` |
| `DescribeDatabaseObjects` | Describe database objects<br>Required: `InstanceId`, `DbName` |
| `DescribeSaleInfo` | Describe sale info |
| `DescribeFileDownloadUrl` | Describe file download url<br>Required: `InstanceId`, `FilePath` |
| `DescribeBackupTime` | Describe backup time<br>Required: `InstanceIds` |
| `DescribeInstanceSSLAttributes` | Describe instance sslattributes<br>Required: `InstanceId` |
| `DescribeDBSlowLogs` | Describe dbslow logs<br>Required: `InstanceId`, `Offset`, `Limit`, `StartTime` |
| `DescribeFlow` | Describe flow<br>Required: `FlowId` |
| `DescribeOrders` | Describe orders<br>Required: `DealNames` |
| `DescribeDBParameters` | Describe dbparameters<br>Required: `InstanceId` |
| `DescribeDBLogFiles` | Describe dblog files<br>Required: `InstanceId`, `Type` |
| `DescribeDBInstanceSpecs` | Describe db instance specs |
| `DescribeDBInstances` | Describe db instances |
| `DescribeUpgradePrice` | Describe upgrade price<br>Required: `InstanceId`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `DescribeProjectSecurityGroups` | Describe project security groups<br>Required: `Product` (mariadb) |
| `DescribeBackupFiles` | Describe backup files |
| `DescribeAccounts` | Describe accounts<br>Required: `InstanceId` |
| `DescribeDcnDetail` | Describe dcn detail<br>Required: `InstanceId` |
| `DescribeDBTmpInstances` | Describe dbtmp instances<br>Required: `InstanceId` |
| `DescribeDBSyncMode` | Describe dbsync mode<br>Required: `InstanceId` |
| `DescribeDatabases` | Describe databases<br>Required: `InstanceId` |
| `DescribePrice` | Describe price<br>Required: `Zone`, `NodeCount`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `DescribeBinlogTime` | Describe binlog time<br>Required: `InstanceId` |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `Product` (mariadb), `InstanceId` |
| `DescribeDatabaseTable` | Describe database table<br>Required: `InstanceId`, `DbName`, `Table` |
| `DescribeBackupConfigs` | Describe backup configs<br>Required: `InstanceId` |
| `DescribeProcessList` | Describe process list<br>Required: `InstanceId`, `NodeId` |
| `DescribeDBInstanceDetail` | Describe db instance detail<br>Required: `InstanceId` |
| `DescribeLogFileRetentionPeriod` | Describe log file retention period<br>Required: `InstanceId` |
| `DescribeDBEncryptAttributes` | Describe dbencrypt attributes<br>Required: `InstanceId` |
## Mutations (gated — need allowlist, 22)

| Action | What it does |
|---|---|
| `CreateHourDBInstance` | Create hour db instance<br>Required: `Zones`, `NodeCount`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `SwitchDBInstanceHA` | Switch db instance ha<br>Required: `InstanceId`, `Zone` |
| `ActivateHourDBInstance` | Activate hour db instance<br>Required: `InstanceIds` |
| `CreateDedicatedClusterDBInstance` | Create dedicated cluster db instance<br>Required: `GoodsNum`, `Memory`, `Storage`, `ClusterId` |
| `IsolateDedicatedDBInstance` | Run isolate dedicated dbinstance<br>Required: `InstanceId` |
| `IsolateDBInstance` | Run isolate dbinstance<br>Required: `InstanceIds` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `Product` (mariadb), `SecurityGroupId`, `InstanceIds` |
| `CreateAccount` | Create account<br>Required: `InstanceId`, `UserName`, `Host` |
| `OpenDBExtranetAccess` | Open dbextranet access<br>Required: `InstanceId` |
| `InitDBInstances` | Run init dbinstances<br>Required: `InstanceIds`, `Params` (default 16K) |
| `UpgradeDedicatedDBInstance` | Upgrade dedicated db instance<br>Required: `InstanceId`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `CreateDBInstance` | Create db instance<br>Required: `Zones`, `NodeCount`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `CloseDBExtranetAccess` | Close dbextranet access<br>Required: `InstanceId` |
| `CreateTmpInstances` | Create tmp instances<br>Required: `InstanceIds`, `RollbackTime` |
| `FlushBinlog` | Flush binlog<br>Required: `InstanceId` |
| `GrantAccountPrivileges` | Grant account privileges<br>Required: `InstanceId`, `UserName`, `Host`, `DbName`, `Privileges` |
| `CopyAccountPrivileges` | Copy account privileges<br>Required: `InstanceId`, `SrcUserName`, `SrcHost`, `DstUserName`, `DstHost` |
| `UpgradeHourDBInstance` | Upgrade hour db instance<br>Required: `InstanceId`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `CloneAccount` | Clone account<br>Required: `InstanceId`, `SrcUser`, `SrcHost`, `DstUser`, `DstHost` |
| `IsolateHourDBInstance` | Run isolate hour dbinstance<br>Required: `InstanceIds` |
| `UpgradeDBInstance` | Upgrade db instance<br>Required: `InstanceId`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `Product` (mariadb), `SecurityGroupId`, `InstanceIds` |

## Blocked destructive actions (27)

`ModifyBackupTime`, `ModifyInstanceVport`, `ModifyAccountDescription`, `DestroyDBInstance`, `ResetAccountPassword`, `ModifyDBParameters`, `KillSession`, `ModifyInstanceSSLAttributes`, `ModifyDBInstanceName`, `ModifySyncTaskAttribute`, `DeleteAccount`, `ModifyDBInstancesProject`, `RestartDBInstances`, `ModifyInstanceVip`, `ModifyRealServerAccessStrategy`, `ModifyInstanceProtectedProperty`, `ModifyInstanceNetwork`, `DestroyHourDBInstance`, `RenewDBInstance`, `ModifyAccountPrivileges`, `ModifyDBInstanceSecurityGroups`, `ModifyDBSyncMode`, `ModifyDBEncryptAttributes`, `TerminateDedicatedDBInstance`, `CancelDcnJob`, `ModifyBackupConfigs`, `ModifyLogFileRetentionPeriod` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mariadb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20170312` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mariadb"`) for the allow/block decision and reason.

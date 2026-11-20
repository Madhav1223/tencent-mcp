---
name: tencent-dcdb
description: Tencent Cloud DCDB via the Tencent MCP server — 83 actions in API version v20180411 (35 read-only auto-allowed). Use for dcdbinstance, dbinstance, hour, dedicated, privileges, security. Triggers on mentions of dcdb, dcdbinstance, dbinstance, hour, dedicated, privileges, security, access, backup. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud DCDB

Databases: 83 actions in API version `v20180411` — 35 read-only (auto-allowed), 23 gated mutations, 25 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dcdb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dcdb/v20180411 — action signatures in `dcdb_client.ts`, full request/response shapes in `dcdb_models.ts`.

## Read actions (auto-allowed, 35)

| Action | What it does |
|---|---|
| `DescribeAccountPrivileges` | Describe account privileges<br>Required: `InstanceId`, `UserName`, `Host`, `DbName` |
| `DescribeDatabaseObjects` | Describe database objects<br>Required: `InstanceId`, `DbName` |
| `DescribeDatabaseTable` | Describe database table<br>Required: `InstanceId`, `DbName`, `Table` |
| `DescribeShardSpec` | Describe shard spec |
| `DescribeDCDBInstances` | Describe dcdbinstances |
| `DescribeFileDownloadUrl` | Describe file download url<br>Required: `InstanceId`, `ShardId`, `FilePath` |
| `DescribeInstanceSSLAttributes` | Describe instance sslattributes<br>Required: `InstanceId` |
| `DescribeUserTasks` | Describe user tasks |
| `DescribeDCDBPrice` | Describe dcdbprice<br>Required: `Zone`, `Count`, `Period`, `ShardNodeCount`, `ShardMemory` (unit: GB), `ShardStorage` (unit: GB), `ShardCount` (range 2-8) |
| `DescribeDCDBSaleInfo` | Describe dcdbsale info |
| `DescribeDBSlowLogs` | Describe dbslow logs<br>Required: `InstanceId`, `Offset`, `Limit`, `StartTime`, `ShardId` |
| `DescribeFlow` | Describe flow<br>Required: `FlowId` |
| `DescribeDCDBInstanceDetail` | Describe dcdbinstance detail<br>Required: `InstanceId` |
| `DescribeDBParameters` | Describe dbparameters<br>Required: `InstanceId` |
| `DescribeOnlineDDLJob` | Describe online ddljob<br>Required: `InstanceId`, `FlowId` |
| `DescribeDBLogFiles` | Describe dblog files<br>Required: `InstanceId`, `ShardId`, `Type` |
| `DescribeDBSyncMode` | Describe dbsync mode<br>Required: `InstanceId` |
| `DescribeDCDBBinlogTime` | Describe dcdbbinlog time<br>Required: `InstanceId` |
| `DescribeProjectSecurityGroups` | Describe project security groups<br>Required: `Product` (dcdb) |
| `DescribeDCDBInstanceNodeInfo` | Describe dcdbinstance node info<br>Required: `InstanceId` |
| `DescribeLogFileRetentionPeriod` | Describe log file retention period<br>Required: `InstanceId` |
| `DescribeBackupFiles` | Describe backup files |
| `DescribeAccounts` | Describe accounts<br>Required: `InstanceId` |
| `DescribeDcnDetail` | Describe dcn detail<br>Required: `InstanceId` |
| `DescribeDBTmpInstances` | Describe dbtmp instances<br>Required: `InstanceId` |
| `DescribeDCDBShards` | Describe dcdbshards<br>Required: `InstanceId` |
| `DescribeDatabases` | Describe databases<br>Required: `InstanceId` |
| `DescribeProjects` | Describe projects |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `Product` (dcdb), `InstanceId` |
| `DescribeDCDBUpgradePrice` | Describe dcdbupgrade price<br>Required: `InstanceId`, `UpgradeType` |
| `DescribeBackupConfigs` | Describe backup configs<br>Required: `InstanceId` |
| `DescribeProcessList` | Describe process list<br>Required: `InstanceId`, `NodeId` |
| `DescribeDBEncryptAttributes` | Describe dbencrypt attributes<br>Required: `InstanceId` |
| `DescribeDCDBRenewalPrice` | Describe dcdbrenewal price<br>Required: `InstanceId` |
| `DescribeOrders` | Describe orders<br>Required: `DealNames` |
## Mutations (gated — need allowlist, 23)

| Action | What it does |
|---|---|
| `UpgradeDedicatedDCDBInstance` | Upgrade dedicated dcdbinstance<br>Required: `UpgradeType`, `InstanceId` |
| `ActiveHourDCDBInstance` | Run active hour dcdbinstance<br>Required: `InstanceIds` |
| `SwitchDBInstanceHA` | Switch db instance ha<br>Required: `InstanceId`, `Zone` |
| `InitDCDBInstances` | Run init dcdbinstances<br>Required: `InstanceIds`, `Params` (default 16K) |
| `CreateDedicatedClusterDCDBInstance` | Create dedicated cluster dcdbinstance<br>Required: `GoodsNum`, `ShardNum`, `ShardMemory`, `ShardStorage`, `ClusterId` |
| `CreateTmpDCDBInstance` | Create tmp dcdbinstance<br>Required: `InstanceId`, `RollbackTime` |
| `IsolateHourDCDBInstance` | Run isolate hour dcdbinstance<br>Required: `InstanceIds` |
| `UpgradeHourDCDBInstance` | Upgrade hour dcdbinstance<br>Required: `InstanceId`, `UpgradeType` |
| `UpgradeDCDBInstance` | Upgrade dcdbinstance<br>Required: `InstanceId`, `UpgradeType` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `Product` (dcdb), `SecurityGroupId`, `InstanceIds` |
| `CreateAccount` | Create account<br>Required: `InstanceId`, `UserName`, `Host` |
| `OpenDBExtranetAccess` | Open dbextranet access<br>Required: `InstanceId` |
| `CloseDBExtranetAccess` | Close dbextranet access<br>Required: `InstanceId` |
| `FlushBinlog` | Flush binlog<br>Required: `InstanceId` |
| `GrantAccountPrivileges` | Grant account privileges<br>Required: `InstanceId`, `UserName`, `Host`, `DbName`, `Privileges` |
| `CopyAccountPrivileges` | Copy account privileges<br>Required: `InstanceId`, `SrcUserName`, `SrcHost`, `DstUserName`, `DstHost` |
| `CreateDCDBInstance` | Create dcdbinstance<br>Required: `Zones`, `Period`, `ShardMemory` (unit: GB), `ShardStorage` (unit: GB), `ShardNodeCount`, `ShardCount` (range 2-8) |
| `IsolateDCDBInstance` | Run isolate dcdbinstance<br>Required: `InstanceIds` |
| `IsolateDedicatedDBInstance` | Run isolate dedicated dbinstance<br>Required: `InstanceId` |
| `CloneAccount` | Clone account<br>Required: `InstanceId`, `SrcUser`, `SrcHost`, `DstUser`, `DstHost` |
| `CreateOnlineDDLJob` | Create online ddljob<br>Required: `InstanceId`, `Alter`, `DbName`, `Table` |
| `CreateHourDCDBInstance` | Create hour dcdbinstance<br>Required: `ShardMemory` (unit: GB), `ShardStorage` (unit: GB), `ShardNodeCount`, `ShardCount` (range 2-8) |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `Product` (dcdb), `SecurityGroupId`, `InstanceIds` |

## Blocked destructive actions (25)

`ModifyAccountConfig`, `ResetAccountPassword`, `ModifyInstanceVip`, `ModifyRealServerAccessStrategy`, `ModifyAccountDescription`, `ModifyDBParameters`, `RenewDCDBInstance`, `DeleteAccount`, `ModifyDBInstancesProject`, `ModifyDBInstanceSecurityGroups`, `ModifyInstanceProtectedProperty`, `ModifyInstanceNetwork`, `KillSession`, `ModifyAccountPrivileges`, `DestroyDCDBInstance`, `ModifyDBSyncMode`, `ModifyInstanceSSLAttributes`, `ModifyDBEncryptAttributes`, `DestroyHourDCDBInstance`, `CancelOnlineDDLJob`, `ModifyInstanceVport`, `TerminateDedicatedDBInstance`, `CancelDcnJob`, `ModifyBackupConfigs`, `ModifyDBInstanceName` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dcdb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180411` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dcdb"`) for the allow/block decision and reason.

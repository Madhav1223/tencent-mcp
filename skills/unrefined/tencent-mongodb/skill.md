---
name: tencent-mongodb
description: Tencent Cloud MONGODB via the Tencent MCP server — 86 actions in API version v20190725 (31 read-only auto-allowed). Use for dbinstance, audit, backup, download, dbinstances, param. Triggers on mentions of mongodb, dbinstance, audit, backup, download, dbinstances, param, slow, srvconnection. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud MONGODB

Databases: 86 actions in API version `v20190725` — 31 read-only (auto-allowed), 35 gated mutations, 20 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mongodb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mongodb/v20190725 — action signatures in `mongodb_client.ts`, full request/response shapes in `mongodb_models.ts`.

## Read actions (auto-allowed, 31)

| Action | What it does |
|---|---|
| `DescribeCurrentOp` | Describe current op<br>Required: `InstanceId` |
| `DescribeClientConnections` | Describe client connections<br>Required: `InstanceId` |
| `DescribeDetailedSlowLogs` | Describe detailed slow logs<br>Required: `InstanceId`, `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`) |
| `DescribeDBInstanceNamespace` | Describe db instance namespace<br>Required: `InstanceId` |
| `DescribeMongodbLogs` | Describe mongodb logs<br>Required: `InstanceId`, `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`) |
| `DescribeInstanceSSL` | Describe instance ssl<br>Required: `InstanceId` |
| `DescribeDBBackups` | Describe dbbackups<br>Required: `InstanceId` |
| `DescribeBackupRules` | Describe backup rules<br>Required: `InstanceId` |
| `DescribeSlowLogPatterns` | Describe slow log patterns<br>Required: `InstanceId`, `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`), `SlowMS` |
| `DescribeSlowLogs` | Describe slow logs<br>Required: `InstanceId`, `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`), `SlowMS` |
| `DescribeInstanceParams` | Describe instance params<br>Required: `InstanceId` |
| `DescribeBackupDownloadTask` | Describe backup download task<br>Required: `InstanceId` |
| `DescribeAccountUsers` | Describe account users<br>Required: `InstanceId` |
| `DescribeAuditLogFiles` | Describe audit log files<br>Required: `InstanceId` |
| `DescribeDBInstanceParamTplDetail` | Describe db instance param tpl detail<br>Required: `TplId` |
| `DescribeDBInstanceURL` | Describe db instance url<br>Required: `InstanceId` |
| `DescribeDBInstanceNodeProperty` | Describe db instance node property<br>Required: `InstanceId` |
| `DescribeDBInstanceParamTpl` | Describe db instance param tpl |
| `DescribeDBInstanceDeal` | Describe db instance deal<br>Required: `DealId` |
| `DescribeSecurityGroup` | Describe security group<br>Required: `InstanceId` |
| `DescribeAuditInstanceList` | Describe audit instance list |
| `DescribeAuditConfig` | Describe audit config<br>Required: `InstanceId` |
| `DescribeAsyncRequestInfo` | Describe async request info<br>Required: `AsyncRequestId` |
| `DescribeAuditLogs` | Describe audit logs<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeDBInstances` | Describe db instances |
| `DescribeSpecInfo` | Describe spec info |
| `DescribeLogDownloadTasks` | Describe log download tasks<br>Required: `InstanceId` |
| `DescribeDBInstanceLogToCLS` | Describe db instance log to cls<br>Required: `InstanceId` |
| `DescribeSRVConnectionDomain` | Describe srvconnection domain<br>Required: `InstanceId` |
| `DescribePasswordRotation` | Describe password rotation |
| `DescribeTransparentDataEncryptionStatus` | Describe transparent data encryption status<br>Required: `InstanceId` |
## Mutations (gated — need allowlist, 35)

| Action | What it does |
|---|---|
| `InstanceEnableSSL` | Run instance enable ssl<br>Required: `InstanceId`, `Enable` |
| `CloseAuditService` | Close audit service<br>Required: `InstanceId` |
| `FlashBackDBInstance` | Run flash back dbinstance<br>Required: `InstanceId`, `TargetFlashbackTime`, `TargetDatabases` |
| `EnableWanService` | Enable wan service<br>Required: `InstanceId`, `LoadBalancerId`, `NodeList` |
| `RestoreDBInstance` | Restore db instance<br>Required: `InstanceId`, `RestoreTime` (format `YYYY-MM-DD…`), `Databases` |
| `CreateBackupDBInstance` | Create backup db instance<br>Required: `InstanceId`, `BackupMethod` |
| `InquirePriceModifyDBInstanceSpec` | Inquire the price of: modify db instance spec<br>Required: `InstanceId`, `Memory` (unit: GB), `Volume` (unit: GB) |
| `EnableSRVConnectionUrl` | Enable srvconnection url<br>Required: `InstanceId` |
| `CreateDBInstanceHour` | Create db instance hour<br>Required: `Memory` (unit: GB), `Volume` (unit: GB), `ReplicateSetNum`, `NodeNum`, `MongoVersion`, `MachineCode`, `GoodsNum`, `ClusterType`, `Zone` |
| `CreateDBInstanceParamTpl` | Create db instance param tpl<br>Required: `TplName` |
| `CreateDBInstance` | Create db instance<br>Required: `NodeNum`, `Memory` (unit: GB), `Volume` (unit: GB), `MongoVersion`, `GoodsNum`, `Zone`, `Period`, `MachineCode`, `ClusterType`, `ReplicateSetNum` |
| `DisableSRVConnectionUrl` | Disable srvconnection url<br>Required: `InstanceId` |
| `OfflineIsolatedDBInstance` | Run offline isolated dbinstance<br>Required: `InstanceId` |
| `UpgradeDBInstanceKernelVersion` | Upgrade db instance kernel version<br>Required: `InstanceId` |
| `SetAccountUserPrivilege` | Set account user privilege<br>Required: `InstanceId`, `UserName`, `AuthRole` |
| `FlushInstanceRouterConfig` | Flush instance router config<br>Required: `InstanceId` |
| `EnablePasswordRotation` | Enable password rotation |
| `CreateBackupDownloadTask` | Create backup download task<br>Required: `InstanceId`, `BackupName`, `BackupSets` |
| `IsolateDBInstance` | Run isolate dbinstance<br>Required: `InstanceId` |
| `SetDBInstanceDeletionProtection` | Set db instance deletion protection<br>Required: `InstanceIds`, `EnableDeletionProtection` |
| `IncreaseDBInstanceConnectionLimit` | Run increase dbinstance connection limit |
| `CreateAuditLogFile` | Create audit log file<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `SetInstanceMaintenance` | Set instance maintenance<br>Required: `InstanceId`, `MaintenanceStart`, `MaintenanceEnd` |
| `EnableTransparentDataEncryption` | Enable transparent data encryption<br>Required: `InstanceId`, `KmsRegion` |
| `PromoteDBInstanceToActive` | Promote db instance to active<br>Required: `InstanceId`, `MasterId` |
| `CreateLogDownloadTask` | Create log download task<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `CreateAccountUser` | Create account user<br>Required: `InstanceId`, `UserName`, `Password` |
| `SetBackupRules` | Set backup rules<br>Required: `InstanceId` |
| `InquirePriceCreateDBInstances` | Inquire the price of: create db instances<br>Required: `Zone`, `NodeNum`, `Memory` (unit: GB), `Volume` (unit: GB), `MongoVersion`, `MachineCode`, `GoodsNum`, `ClusterType`, `ReplicateSetNum` |
| `CreateSlowLogPatternDownloadTask` | Create slow log pattern download task<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `AssignProject` | Run assign project<br>Required: `InstanceIds`, `ProjectId` |
| `UpgradeDbInstanceVersion` | Upgrade db instance version<br>Required: `InstanceId`, `MongoVersion` |
| `OpenAuditService` | Open audit service<br>Required: `InstanceId`, `LogExpireDay` |
| `RenameInstance` | Run rename instance<br>Required: `InstanceId`, `NewName` |
| `InquirePriceRenewDBInstances` | Inquire the price of: renew db instances<br>Required: `InstanceIds`, `InstanceChargePrepaid` |

## Blocked destructive actions (20)

`ModifyDBInstanceParamTpl`, `ModifyDBInstanceLogToCLS`, `ModifyDBInstanceSpec`, `ModifyInstanceParams`, `TerminateDBInstances`, `ResetDBInstancePassword`, `ModifyDBInstanceNetworkAddress`, `DropDBInstanceParamTpl`, `DeleteDBBackups`, `ModifySRVConnectionUrl`, `ModifyInstanceAz`, `RenewDBInstances`, `ModifyBackupExpireTime`, `DeleteAccountUser`, `ModifyDBInstanceSecurityGroup`, `DeleteLogDownloadTask`, `DeleteAuditLogFile`, `RestartNodes`, `ModifyAuditService`, `KillOps` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mongodb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190725` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mongodb"`) for the allow/block decision and reason.

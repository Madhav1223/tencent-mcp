---
name: tencent-redis
description: Tencent Cloud REDIS via the Tencent MCP server — 121 actions in API version v20180412 (55 read-only auto-allowed). Use for backup, replication, monitor, param, security, upgrade. Triggers on mentions of redis, backup, replication, monitor, param, security, upgrade, password, template. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud REDIS

Databases: 121 actions in API version `v20180412` — 55 read-only (auto-allowed), 34 gated mutations, 32 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "redis"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/redis/v20180412 — action signatures in `redis_client.ts`, full request/response shapes in `redis_models.ts`.

## Read actions (auto-allowed, 55)

| Action | What it does |
|---|---|
| `DescribeInstanceMonitorBigKeySizeDist` | Describe instance monitor big key size dist<br>Required: `InstanceId`, `Date` |
| `DescribeTaskList` | Describe task list |
| `DescribeInstanceAccount` | Describe instance account<br>Required: `InstanceId`, `Limit` (default 20), `Offset` (default 0) |
| `DescribeInstanceMonitorTopNCmd` | Describe instance monitor top ncmd<br>Required: `InstanceId`, `SpanType` |
| `DescribeProductInfo` | Describe product info |
| `DescribeTaskInfo` | Describe task info<br>Required: `TaskId` |
| `DescribeInstanceSecurityGroup` | Describe instance security group<br>Required: `InstanceIds` |
| `DescribeBackupDetail` | Describe backup detail<br>Required: `InstanceId`, `BackupId` |
| `DescribeGlobalReplicationArea` | Describe global replication area |
| `DescribeBackupUrl` | Describe backup url<br>Required: `InstanceId`, `BackupId` |
| `DescribeSecondLevelBackupInfo` | Describe second level backup info |
| `DescribeInstanceLogDelivery` | Describe instance log delivery<br>Required: `InstanceId` |
| `DescribeInstanceNodeInfo` | Describe instance node info<br>Required: `InstanceId` |
| `DescribeInstanceMonitorTopNCmdTook` | Describe instance monitor top ncmd took<br>Required: `InstanceId`, `SpanType` |
| `DescribeInstanceDTSInfo` | Describe instance dtsinfo<br>Required: `InstanceId` |
| `InquiryPriceUpgradeInstance` | Inquire the price of: upgrade instance<br>Required: `InstanceId`, `MemSize` (unit: MB) |
| `DescribeProjectSecurityGroups` | Describe project security groups<br>Required: `Product` (redis) |
| `DescribeTendisSlowLog` | Describe tendis slow log<br>Required: `InstanceId`, `BeginTime`, `EndTime` |
| `InquiryPriceCreateInstance` | Inquire the price of: create instance<br>Required: `TypeId`, `MemSize`, `GoodsNum`, `Period`, `BillingMode` |
| `DescribeInstanceSupportFeature` | Describe instance support feature<br>Required: `InstanceId`, `FeatureName` |
| `DescribeInstanceParams` | Describe instance params<br>Required: `InstanceId` |
| `DescribeInstanceMonitorBigKeyTypeDist` | Describe instance monitor big key type dist<br>Required: `InstanceId`, `Date` |
| `DescribeInstanceSpecBandwidth` | Describe instance spec bandwidth |
| `DescribeInstanceParamRecords` | Describe instance param records<br>Required: `InstanceId` |
| `DescribeParamTemplateInfo` | Describe param template info<br>Required: `TemplateId` |
| `DescribeInstanceMonitorTookDist` | Describe instance monitor took dist<br>Required: `InstanceId`, `Date`, `SpanType` |
| `DescribeParamTemplates` | Describe param templates |
| `DescribeInstanceBackups` | Describe instance backups |
| `DescribeInstanceMonitorSIP` | Describe instance monitor sip<br>Required: `InstanceId` |
| `DescribeProjectSecurityGroup` | Describe project security group |
| `DescribeInstanceMonitorHotKey` | Describe instance monitor hot key<br>Required: `InstanceId`, `SpanType` |
| `DescribeExportTasks` | Describe export tasks<br>Required: `LogType`, `Limit` (default 20), `Offset` (default 0), `InstanceId` |
| `DescribeLogs` | Describe logs<br>Required: `InstanceId`, `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `LogType` |
| `DescribeSSLStatus` | Describe sslstatus<br>Required: `InstanceId` |
| `DescribeInstanceMonitorBigKey` | Describe instance monitor big key<br>Required: `InstanceId`, `ReqType`, `Date` |
| `DescribeRedisClusters` | Describe redis clusters |
| `DescribeCommonDBInstances` | Describe common db instances |
| `DescribeSlowLog` | Describe slow log<br>Required: `InstanceId`, `BeginTime`, `EndTime` |
| `DescribeBackupDownloadRestriction` | Describe backup download restriction |
| `DescribeInstanceZoneInfo` | Describe instance zone info |
| `DescribeInstanceEvents` | Describe instance events<br>Required: `ExecutionStartDate`, `ExecutionEndDate` |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `Product` (redis), `InstanceId` |
| `DescribeReplicationGroup` | Describe replication group<br>Required: `Limit` (default 20), `Offset` |
| `InquiryPriceRenewInstance` | Inquire the price of: renew instance<br>Required: `Period`, `InstanceId` |
| `DescribeLogInstanceList` | Describe log instance list<br>Required: `LogType` |
| `DescribeInstanceShards` | Describe instance shards<br>Required: `InstanceId` |
| `DescribeInstances` | Describe instances |
| `DescribeAutoBackupConfig` | Describe auto backup config<br>Required: `InstanceId` |
| `DescribeBandwidthRange` | Describe bandwidth range<br>Required: `InstanceId` |
| `DescribeReplicationGroupInstance` | Describe replication group instance<br>Required: `InstanceId` |
| `DescribeProxySlowLog` | Describe proxy slow log<br>Required: `InstanceId`, `BeginTime`, `EndTime` |
| `DescribeInstancePasswordPolicy` | Describe instance password policy<br>Required: `InstanceId` |
| `DescribeRedisClusterOverview` | Describe redis cluster overview |
| `DescribeMaintenanceWindow` | Describe maintenance window<br>Required: `InstanceId` |
| `DescribeInstanceDealDetail` | Describe instance deal detail |
## Mutations (gated — need allowlist, 34)

| Action | What it does |
|---|---|
| `CleanUpInstance` | Run clean up instance<br>Required: `InstanceId` |
| `SwitchAccessNewInstance` | Switch access new instance<br>Required: `InstanceId` |
| `ChangeReplicaToMaster` | Run change replica to master<br>Required: `InstanceId` |
| `UpgradeInstanceVersion` | Upgrade instance version<br>Required: `TargetInstanceType`, `SwitchOption`, `InstanceId` |
| `UpgradeVersionToMultiAvailabilityZones` | Upgrade version to multi availability zones<br>Required: `InstanceId` |
| `ClearInstance` | Run clear instance<br>Required: `InstanceId` |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `Product` (redis), `SecurityGroupId`, `InstanceIds` |
| `ChangeInstanceRole` | Run change instance role<br>Required: `GroupId`, `InstanceId`, `InstanceRole` |
| `CreateInstanceAccount` | Create instance account<br>Required: `InstanceId`, `AccountName`, `AccountPassword`, `ReadonlyPolicy`, `Privilege` |
| `UpgradeProxyVersion` | Upgrade proxy version<br>Required: `InstanceId`, `CurrentProxyVersion`, `UpgradeProxyVersion`, `InstanceTypeUpgradeNow` |
| `AddReplicationInstance` | Add replication instance<br>Required: `GroupId`, `InstanceId`, `InstanceRole` |
| `CloneInstances` | Clone instances<br>Required: `InstanceId`, `GoodsNum`, `ZoneId`, `BillingMode`, `Period`, `SecurityGroupIdList`, `BackupId` |
| `CreateParamTemplate` | Create param template<br>Required: `Name` |
| `DisableReplicaReadonly` | Disable replica readonly<br>Required: `InstanceId` |
| `AllocateWanAddress` | Allocate wan address<br>Required: `InstanceId` |
| `ManualBackupInstance` | Run manual backup instance<br>Required: `InstanceId` |
| `SwitchProxy` | Switch proxy<br>Required: `InstanceId` |
| `StartupInstance` | Start up instance<br>Required: `InstanceId` |
| `UpgradeSmallVersion` | Upgrade small version<br>Required: `InstanceId`, `CurrentRedisVersion`, `UpgradeRedisVersion`, `InstanceTypeUpgradeNow` |
| `CreateReplicationGroup` | Create replication group<br>Required: `InstanceId` |
| `ModfiyInstancePassword` | Run modfiy instance password<br>Required: `InstanceId`, `OldPassword`, `Password` |
| `EnableReplicaReadonly` | Enable replica readonly<br>Required: `InstanceId` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `Product` (redis), `SecurityGroupId`, `InstanceIds` |
| `CloseLog` | Close log<br>Required: `InstanceId`, `LogType` |
| `SwitchInstanceVip` | Switch instance vip<br>Required: `SrcInstanceId`, `DstInstanceId` |
| `CreateExportTask` | Create export task<br>Required: `InstanceId`, `LogType`, `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `RestoreInstance` | Restore instance<br>Required: `InstanceId`, `BackupId` |
| `OpenLog` | Open log<br>Required: `InstanceId`, `LogType`, `LogSubType`, `LogExpireDay` (default 7), `HighLogExpireDay` (default 7) |
| `OpenSSL` | Open ssl<br>Required: `InstanceId` |
| `ChangeMasterInstance` | Run change master instance<br>Required: `GroupId`, `InstanceId` |
| `UpgradeInstance` | Upgrade instance<br>Required: `InstanceId`, `MemSize` |
| `ApplyParamsTemplate` | Run apply params template<br>Required: `InstanceIds`, `TemplateId` |
| `CreateInstances` | Create instances<br>Required: `TypeId`, `MemSize`, `GoodsNum`, `Period`, `BillingMode` |
| `CloseSSL` | Close ssl<br>Required: `InstanceId` |

## Blocked destructive actions (32)

`ModifyInstanceReadOnly`, `DeleteReplicationInstance`, `ModifyInstanceBackupMode`, `ModifyBackupDownloadRestriction`, `ModifyInstanceAccount`, `ModifyInstanceParams`, `ModifyInstancePasswordPolicy`, `ModifyInstance`, `ModifyInstanceEvent`, `ModifyAutoBackupConfig`, `DeleteParamTemplate`, `DeleteExportTask`, `RenewInstance`, `ModifyInstanceLogDelivery`, `ModifyParamTemplate`, `ModifyReplicationGroup`, `ModifyInstanceChargeType`, `ReleaseWanAddress`, `ModifyConnectionConfig`, `DeleteInstanceAccount`, `DestroyPrepaidInstance`, `DestroyPostpaidInstance`, `ResetPassword`, `RemoveReplicationInstance`, `ModifyInstancePassword`, `ModifyLog`, `KillMasterGroup`, `ModifyMaintenanceWindow`, `RemoveReplicationGroup`, `ModifyNetworkConfig`, `ModifyInstanceAvailabilityZones`, `ModifyDBInstanceSecurityGroups` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `redis`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180412` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="redis"`) for the allow/block decision and reason.

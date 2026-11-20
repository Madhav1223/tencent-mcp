---
name: tencent-cdb
description: Tencent Cloud CDB via the Tencent MCP server — 179 actions in API version v20170320 (73 read-only auto-allowed). Use for audit, dbinstance, backup, proxy, param, upgrade. Triggers on mentions of cdb, audit, dbinstance, backup, proxy, param, upgrade, password, template. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud CDB

Databases: 179 actions in API version `v20170320` — 73 read-only (auto-allowed), 50 gated mutations, 56 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdb/v20170320 — action signatures in `cdb_client.ts`, full request/response shapes in `cdb_models.ts`.

## Read actions (auto-allowed, 73)

| Action | What it does |
|---|---|
| `DescribeDBInstanceGTID` | Describe db instance gtid<br>Required: `InstanceId` |
| `DescribeTableColumns` | Describe table columns<br>Required: `InstanceId`, `Database`, `Table` |
| `DescribeDBFeatures` | Describe dbfeatures<br>Required: `InstanceId` |
| `DescribeTimeWindow` | Describe time window<br>Required: `InstanceId` |
| `DescribeInstanceUpgradeCheckJob` | Describe instance upgrade check job<br>Required: `InstanceId`, `DstMysqlVersion` |
| `DescribeBackupOverview` | Describe backup overview<br>Required: `Product` |
| `DescribeCdbZoneConfig` | Describe cdb zone config |
| `DescribeInstanceUpgradeType` | Describe instance upgrade type<br>Required: `InstanceId`, `DstCpu`, `DstMemory` (unit: MB), `DstDisk` (unit: GB) |
| `DescribeRollbackTaskDetail` | Describe rollback task detail<br>Required: `InstanceId` |
| `CheckMigrateCluster` | Check migrate cluster<br>Required: `InstanceId` |
| `DescribeParamTemplates` | Describe param templates |
| `DescribeTasks` | Describe tasks |
| `DescribeBackupConfig` | Describe backup config<br>Required: `InstanceId` |
| `DescribeDefaultParams` | Describe default params |
| `DescribeAuditPolicies` | Describe audit policies |
| `DescribeTagsOfInstanceIds` | Describe tags of instance ids<br>Required: `InstanceIds` |
| `DescribeDatabases` | Describe databases<br>Required: `InstanceId` |
| `DescribeErrorLogData` | Describe error log data<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeCPUExpandStrategyInfo` | Describe cpuexpand strategy info<br>Required: `InstanceId` |
| `DescribeTables` | Describe tables<br>Required: `InstanceId`, `Database` |
| `DescribeAccountPrivileges` | Describe account privileges<br>Required: `InstanceId`, `User`, `Host` |
| `DescribeDataBackupOverview` | Describe data backup overview<br>Required: `Product` |
| `DescribeBackups` | Describe backups<br>Required: `InstanceId` |
| `DescribeCdbProxyInfo` | Describe cdb proxy info<br>Required: `InstanceId` |
| `DescribeProxySupportParam` | Describe proxy support param<br>Required: `InstanceId` |
| `DescribeLocalBinlogConfig` | Describe local binlog config<br>Required: `InstanceId` |
| `DescribeDBInstanceConfig` | Describe db instance config<br>Required: `InstanceId` |
| `DescribeInstancePasswordComplexity` | Describe instance password complexity<br>Required: `InstanceId` |
| `DescribeProjectSecurityGroups` | Describe project security groups |
| `DescribeSlowLogs` | Describe slow logs<br>Required: `InstanceId` |
| `InquiryPriceUpgradeInstances` | Inquire the price of: upgrade instances<br>Required: `InstanceId`, `Memory` (unit: MB), `Volume` (unit: GB) |
| `DescribeInstanceParams` | Describe instance params<br>Required: `InstanceId` |
| `DescribeBackupEncryptionStatus` | Describe backup encryption status<br>Required: `InstanceId` |
| `DescribeProxyCustomConf` | Describe proxy custom conf<br>Required: `InstanceId` |
| `DescribeDeployGroupList` | Describe deploy group list |
| `DescribeAuditLogFiles` | Describe audit log files<br>Required: `InstanceId` |
| `DescribeBackupDecryptionKey` | Describe backup decryption key<br>Required: `InstanceId`, `BackupId` |
| `DescribeInstanceParamRecords` | Describe instance param records<br>Required: `InstanceId` |
| `DescribeBackupSummaries` | Describe backup summaries<br>Required: `Product` |
| `DescribeParamTemplateInfo` | Describe param template info<br>Required: `TemplateId` |
| `DescribeBinlogBackupOverview` | Describe binlog backup overview<br>Required: `Product` |
| `DescribeDBInstanceInfo` | Describe db instance info<br>Required: `InstanceId` |
| `DescribeClusterInfo` | Describe cluster info<br>Required: `InstanceId` |
| `DescribeRollbackRangeTime` | Describe rollback range time<br>Required: `InstanceIds` |
| `DescribeRoMinScale` | Describe ro min scale |
| `DescribeAuditInstanceList` | Describe audit instance list |
| `DescribeAuditConfig` | Describe audit config<br>Required: `InstanceId` |
| `DescribeAsyncRequestInfo` | Describe async request info<br>Required: `AsyncRequestId` |
| `DescribeAuditLogs` | Describe audit logs<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeDBInstanceRebootTime` | Describe db instance reboot time<br>Required: `InstanceIds` |
| `DescribeDBInstances` | Describe db instances |
| `DescribeDBInstanceCharset` | Describe db instance charset<br>Required: `InstanceId` |
| `DescribeDBPrice` | Describe dbprice<br>Required: `Period` |
| `DescribeDBImportRecords` | Describe dbimport records<br>Required: `InstanceId` |
| `DescribeSSLStatus` | Describe sslstatus |
| `DescribeDBSwitchRecords` | Describe dbswitch records<br>Required: `InstanceId` |
| `DescribeAccounts` | Describe accounts<br>Required: `InstanceId` |
| `DescribeSlowLogData` | Describe slow log data<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeBackupDownloadRestriction` | Describe backup download restriction |
| `DescribeUploadedFiles` | Describe uploaded files<br>Required: `Path` |
| `DescribeCpuExpandHistory` | Describe cpu expand history<br>Required: `InstanceId` |
| `DescribeAuditRuleTemplates` | Describe audit rule templates |
| `DescribeAuditRules` | Describe audit rules |
| `DescribeRemoteBackupConfig` | Describe remote backup config<br>Required: `InstanceId` |
| `DescribeDBInstanceLogToCLS` | Describe db instance log to cls<br>Required: `InstanceId` |
| `DescribeAuditRuleTemplateModifyHistory` | Describe audit rule template modify history |
| `DescribeDeviceMonitorInfo` | Describe device monitor info<br>Required: `InstanceId` |
| `DescribeSupportedPrivileges` | Describe supported privileges<br>Required: `InstanceId` |
| `DescribeBinlogs` | Describe binlogs<br>Required: `InstanceId` |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `InstanceId` |
| `DescribeRoGroups` | Describe ro groups<br>Required: `InstanceId` |
| `DescribeCloneList` | Describe clone list<br>Required: `InstanceId` |
| `DescribeInstanceAlarmEvents` | Describe instance alarm events<br>Required: `InstanceId`, `StartTime`, `EndTime` |
## Mutations (gated — need allowlist, 50)

| Action | What it does |
|---|---|
| `CreateRoInstanceIp` | Create ro instance ip<br>Required: `InstanceId` |
| `CreateAuditPolicy` | Create audit policy<br>Required: `Name`, `RuleId`, `InstanceId` |
| `OpenSSL` | Open ssl |
| `CreateAuditRuleTemplate` | Create audit rule template<br>Required: `RuleFilters`, `RuleTemplateName` |
| `BalanceRoGroupLoad` | Run balance ro group load<br>Required: `RoGroupId` |
| `IsolateDBInstance` | Run isolate dbinstance<br>Required: `InstanceId` |
| `CloseAuditService` | Close audit service<br>Required: `InstanceId` |
| `OfflineIsolatedInstances` | Run offline isolated instances<br>Required: `InstanceIds` |
| `CreateAuditLogFile` | Create audit log file<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `OpenDBInstanceGTID` | Open db instance gtid<br>Required: `InstanceId` |
| `VerifyRootAccount` | Verify root account<br>Required: `InstanceId`, `Password` |
| `OpenDBInstanceEncryption` | Open db instance encryption<br>Required: `InstanceId` |
| `CloseWanService` | Close wan service<br>Required: `InstanceId` |
| `SwitchDBInstanceMasterSlave` | Switch db instance master slave<br>Required: `InstanceId` |
| `CreateDatabase` | Create database<br>Required: `InstanceId`, `DBName`, `CharacterSetName` (utf8 | gbk | latin1 | utf8mb4) |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `SecurityGroupId`, `InstanceIds` |
| `CreateCloneInstance` | Create clone instance<br>Required: `InstanceId` |
| `SwitchForUpgrade` | Switch for upgrade<br>Required: `InstanceId` |
| `CreateParamTemplate` | Create param template<br>Required: `Name` |
| `CreateDBInstanceHour` | Create db instance hour<br>Required: `GoodsNum` (default 1), `Memory` (unit: MB), `Volume` (unit: GB) |
| `AddTimeWindow` | Add time window<br>Required: `InstanceId` |
| `CreateBackup` | Create backup<br>Required: `InstanceId`, `BackupMethod` |
| `CreateCdbProxyAddress` | Create cdb proxy address<br>Required: `ProxyGroupId`, `WeightMode`, `IsKickOut`, `MinCount` (0), `MaxDelay` (1), `FailOver`, `AutoAddRo`, `ReadOnly`, `TransSplit`, `ProxyAllocation`, `UniqVpcId`, `UniqSubnetId` |
| `CreateDBInstance` | Create db instance<br>Required: `Memory` (unit: MB), `Volume` (unit: GB), `Period`, `GoodsNum` (default 1) |
| `AnalyzeAuditLogs` | Analyze audit logs<br>Required: `InstanceId`, `StartTime`, `EndTime`, `AggregationConditions` |
| `CreateAccounts` | Create accounts<br>Required: `InstanceId`, `Accounts`, `Password` |
| `AdjustCdbProxy` | Adjust cdb proxy<br>Required: `InstanceId`, `ProxyGroupId`, `ProxyNodeCustom` (unit: Mem), `ReloadBalance`, `UpgradeTime` |
| `UpgradeDBInstanceEngineVersion` | Upgrade db instance engine version<br>Required: `InstanceId`, `EngineVersion` |
| `SwitchDrInstanceToMaster` | Switch dr instance to master<br>Required: `InstanceId` |
| `CloseCdbProxyAddress` | Close cdb proxy address<br>Required: `ProxyGroupId`, `ProxyAddressId` |
| `StartReplication` | Start replication<br>Required: `InstanceId` |
| `AdjustCdbProxyAddress` | Adjust cdb proxy address<br>Required: `ProxyGroupId`, `WeightMode`, `IsKickOut`, `MinCount` (0), `MaxDelay` (1), `FailOver`, `AutoAddRo`, `ReadOnly`, `ProxyAddressId` |
| `CloseCDBProxy` | Close cdbproxy<br>Required: `InstanceId` |
| `UpgradeRoGroup` | Upgrade ro group<br>Required: `InstanceId`, `UniqRoGroupId` |
| `CreateAuditRule` | Create audit rule<br>Required: `RuleName` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `SecurityGroupId`, `InstanceIds` |
| `CreateRotationPassword` | Create rotation password<br>Required: `InstanceId`, `Accounts` |
| `CreateDBImportJob` | Create dbimport job<br>Required: `InstanceId`, `User` |
| `ReloadBalanceProxyNode` | Run reload balance proxy node<br>Required: `ProxyGroupId` |
| `SubmitInstanceUpgradeCheckJob` | Submit instance upgrade check job<br>Required: `InstanceId`, `DstMysqlVersion` |
| `OpenAuditService` | Open audit service<br>Required: `InstanceId`, `LogExpireDay` |
| `CreateCdbProxy` | Create cdb proxy<br>Required: `InstanceId`, `UniqVpcId`, `UniqSubnetId`, `ProxyNodeCustom` |
| `SwitchCDBProxy` | Switch cdbproxy<br>Required: `InstanceId`, `ProxyGroupId` |
| `StartBatchRollback` | Start batch rollback<br>Required: `Instances` |
| `OpenWanService` | Open wan service<br>Required: `InstanceId` |
| `StartCpuExpand` | Start cpu expand<br>Required: `InstanceId`, `Type` |
| `UpgradeCDBProxyVersion` | Upgrade cdbproxy version<br>Required: `InstanceId`, `ProxyGroupId`, `SrcProxyVersion`, `DstProxyVersion`, `UpgradeTime` |
| `UpgradeDBInstance` | Upgrade db instance<br>Required: `InstanceId`, `Memory` (unit: MB), `Volume` (unit: GB) |
| `CloseSSL` | Close ssl |
| `CreateDeployGroup` | Create deploy group<br>Required: `DeployGroupName` |

## Blocked destructive actions (56)

`ModifyInstanceDestroyProtect`, `ModifyRoGroupVipVport`, `RestartDBInstances`, `ModifyInstanceTag`, `StopReplication`, `ModifyDBInstanceLogToCLS`, `StopCpuExpand`, `ModifyDBInstanceName`, `StopRollback`, `ModifyBackupDownloadRestriction`, `DeleteDatabase`, `RenewDBInstance`, `ReleaseIsolatedDBInstances`, `ModifyAuditConfig`, `ModifyInstancePasswordComplexity`, `ModifyTimeWindow`, `DeleteDeployGroups`, `DeleteAuditRuleTemplates`, `ModifyDBInstanceVipVport`, `DeleteAuditPolicy`, `ModifyLocalBinlogConfig`, `ModifyParamTemplate`, `ModifyInstanceChargeType`, `StopDBImportJob`, `ModifyProtectMode`, `DeleteAccounts`, `DeleteBackup`, `ModifyDBInstanceModes`, `ModifyCdbProxyAddressDesc`, `ModifyAccountHost`, `ResetPassword`, `ModifyInstanceParam`, `ModifyNameOrDescByDpId`, `ModifyAccountMaxUserConnections`, `ModifyRoGroupInfo`, `ModifyAccountPrivileges`, `ModifyBackupEncryptionStatus`, `ResetRootAccount`, `ModifyAuditRuleTemplates`, `DeleteRotationPassword`, `ModifyAccountPassword`, `ModifyAccountDescription`, `DeleteAuditLogFile`, `ModifyBackupConfig`, `ModifyCdbProxyAddressVipAndVPort`, `ModifyDBInstanceProject`, `ModifyDBInstanceReadOnlyStatus`, `ModifyAutoRenewFlag`, `ModifyAuditService`, `ModifyCdbProxyParam`, `ModifyAuditRule`, `ModifyDBInstanceSecurityGroups`, `DeleteAuditRule`, `DeleteParamTemplate`, `ModifyRemoteBackupConfig`, `DeleteTimeWindow` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20170320` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdb"`) for the allow/block decision and reason.

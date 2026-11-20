---
name: tencent-cynosdb
description: Tencent Cloud CYNOSDB via the Tencent MCP server — 242 actions in API version v20190107 (96 read-only auto-allowed). Use for cluster, libra, dbcluster, backup, audit, proxy. Triggers on mentions of cynosdb, cluster, libra, dbcluster, backup, audit, proxy, vault, dbinstance. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud CYNOSDB

Databases: 242 actions in API version `v20190107` — 96 read-only (auto-allowed), 78 gated mutations, 68 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cynosdb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cynosdb/v20190107 — action signatures in `cynosdb_client.ts`, full request/response shapes in `cynosdb_models.ts`.

## Read actions (auto-allowed, 96)

| Action | What it does |
|---|---|
| `DescribeInstanceSpecs` | Describe instance specs<br>Required: `DbType` (MYSQL) |
| `DescribeLibraDBClusterAccounts` | Describe libra dbcluster accounts<br>Required: `ClusterId` |
| `DescribeBinlogListByVault` | Describe binlog list by vault<br>Required: `VaultId` |
| `DescribeVaultBackupClusterInfo` | Describe vault backup cluster info<br>Required: `VaultId` |
| `DescribeClusterParamLogs` | Describe cluster param logs<br>Required: `ClusterId` |
| `DescribeBackupOverview` | Describe backup overview<br>Required: `ClusterId` |
| `DescribeBackupListByVault` | Describe backup list by vault<br>Required: `VaultId` |
| `DescribeVaults` | Describe vaults |
| `DescribeSupportProxyVersion` | Describe support proxy version<br>Required: `ClusterId` |
| `DescribeLibraDBClusters` | Describe libra dbclusters |
| `DownloadLibraDBClusterList` | Download libra dbcluster list |
| `DescribeSlaveZones` | Describe slave zones<br>Required: `Zone` |
| `DescribeClusterLevels` | Describe cluster levels |
| `DescribeProxySpecs` | Describe proxy specs |
| `DescribeClusterDetail` | Describe cluster detail<br>Required: `ClusterId` |
| `DescribeTasks` | Describe tasks |
| `DescribeBackupConfig` | Describe backup config<br>Required: `ClusterId` |
| `DescribeBinlogDownloadUrl` | Describe binlog download url<br>Required: `ClusterId`, `BinlogId` |
| `DescribeClusterServerlessScalePlans` | Describe cluster serverless scale plans<br>Required: `ClusterId` |
| `DescribeRedoLogs` | Describe redo logs<br>Required: `ClusterId` |
| `DescribeProxyNodes` | Describe proxy nodes |
| `SearchClusterDatabases` | Search cluster databases<br>Required: `ClusterId` |
| `DescribeClusterTransparentEncryptInfo` | Describe cluster transparent encrypt info<br>Required: `ClusterId` |
| `ExportInstanceSlowQueries` | Export instance slow queries<br>Required: `InstanceId` |
| `DescribeChangedParamsAfterUpgrade` | Describe changed params after upgrade<br>Required: `InstanceId`, `DstCpu`, `DstMem` |
| `DescribeAccountPrivileges` | Describe account privileges<br>Required: `ClusterId`, `AccountName`, `Host` |
| `DescribeBinlogSaveDays` | Describe binlog save days<br>Required: `ClusterId` |
| `SearchClusterTables` | Search cluster tables<br>Required: `ClusterId` |
| `DescribeClusterInstanceGrps` | Describe cluster instance grps<br>Required: `ClusterId` |
| `DescribeIsolatedInstances` | Describe isolated instances |
| `DescribeInstancesWithinSameCluster` | Describe instances within same cluster<br>Required: `UniqVpcId`, `Vip` |
| `DescribeLibraDBVersion` | Describe libra dbversion |
| `DescribeClusters` | Describe clusters |
| `DescribeProjectSecurityGroups` | Describe project security groups |
| `DescribeBackupDownloadUserRestriction` | Describe backup download user restriction |
| `DescribeResourcesByDealName` | Describe resources by deal name |
| `DescribeLibraDBClusterDetail` | Describe libra dbcluster detail<br>Required: `ClusterId` |
| `DescribeInstanceParams` | Describe instance params<br>Required: `ClusterId`, `InstanceIds` |
| `DescribeInstanceSlowQueries` | Describe instance slow queries<br>Required: `InstanceId` |
| `DescribeParamTemplateDetail` | Describe param template detail<br>Required: `TemplateId` |
| `DescribeClusterDatabases` | Describe cluster databases<br>Required: `ClusterId` |
| `DescribeAuditLogFiles` | Describe audit log files<br>Required: `InstanceId` |
| `DescribeLibraDBClusterAccountPrivileges` | Describe libra dbcluster account privileges<br>Required: `ClusterId`, `AccountName`, `Host`, `Db`, `Type` |
| `DescribeClusterPeriodScalePolicy` | Describe cluster period scale policy<br>Required: `ClusterId` |
| `DescribeInstanceSpecsByOperationType` | Describe instance specs by operation type<br>Required: `ClusterId`, `OperationType` |
| `DescribeParamTemplates` | Describe param templates |
| `DescribeServerlessStrategy` | Describe serverless strategy<br>Required: `ClusterId` |
| `DescribeInstanceDetail` | Describe instance detail<br>Required: `InstanceId` |
| `DescribeAuditInstanceList` | Describe audit instance list |
| `DescribeRollbackTimeRange` | Describe rollback time range<br>Required: `ClusterId` |
| `DescribeFlow` | Describe flow<br>Required: `FlowId` |
| `DescribeInstanceCLSLogDelivery` | Describe instance clslog delivery<br>Required: `InstanceId` |
| `DescribeServerlessInstanceSpecs` | Describe serverless instance specs |
| `DescribeAuditLogs` | Describe audit logs<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeSaveBackupClusters` | Describe save backup clusters<br>Required: `Limit` |
| `DescribeProxies` | Describe proxies |
| `DescribeLibraDBClusterAccountAllPrivileges` | Describe libra dbcluster account all privileges<br>Required: `ClusterId`, `Account` |
| `DescribeLibraDBInstanceSpecs` | Describe libra db instance specs |
| `DescribeClusterReadOnly` | Describe cluster read only<br>Required: `ClusterIds` |
| `DescribeResourcePackageSaleSpec` | Describe resource package sale spec<br>Required: `InstanceType`, `PackageRegion`, `PackageType` |
| `DescribeLibraDBForwardConfig` | Describe libra dbforward config<br>Required: `InstanceId` |
| `DescribeAuditRuleWithInstanceIds` | Describe audit rule with instance ids<br>Required: `InstanceIds` |
| `DescribeSSLStatus` | Describe sslstatus<br>Required: `ClusterId` |
| `ExportInstanceErrorLogs` | Export instance error logs<br>Required: `InstanceId` |
| `DescribeAccounts` | Describe accounts<br>Required: `ClusterId` |
| `CheckCreateLibraDBInstance` | Check create libra db instance<br>Required: `ClusterId` |
| `DescribeClusterStorageAutoExpand` | Describe cluster storage auto expand<br>Required: `ClusterId` |
| `DescribeIntegrateTask` | Describe integrate task |
| `DescribeSQLExecutionPlan` | Describe sqlexecution plan<br>Required: `ClusterId`, `InstanceId`, `TemplateID`, `PlanDetailId` |
| `DescribeLibraDBClusterTableMapping` | Describe libra dbcluster table mapping<br>Required: `ClusterId`, `InstanceId` |
| `DescribeBackupDownloadRestriction` | Describe backup download restriction<br>Required: `ClusterIds` |
| `DescribeLibraDBDataSource` | Describe libra dbdata source<br>Required: `ClusterId`, `InstanceId` |
| `DescribeClusterDatabaseTables` | Describe cluster database tables<br>Required: `ClusterId`, `Db` |
| `DescribeLibraDBSlowLogs` | Describe libra dbslow logs |
| `DescribeBackupList` | Describe backup list<br>Required: `ClusterId` |
| `DescribeAuditRuleTemplates` | Describe audit rule templates |
| `DescribeResourcePackageDetail` | Describe resource package detail<br>Required: `PackageId` |
| `DescribeRedoLogListByVault` | Describe redo log list by vault<br>Required: `VaultId` |
| `DescribeInstances` | Describe instances |
| `DescribeBinlogConfig` | Describe binlog config<br>Required: `ClusterId` |
| `DescribeResourcePackageList` | Describe resource package list |
| `DescribeClusterParams` | Describe cluster params<br>Required: `ClusterId` |
| `DescribeMaintainPeriod` | Describe maintain period<br>Required: `InstanceId` |
| `ExportResourcePackageDeductDetails` | Export resource package deduct details<br>Required: `PackageId` |
| `DescribeClusterDetailDatabases` | Describe cluster detail databases<br>Required: `ClusterId` |
| `CheckTransferClusterZone` | Check transfer cluster zone<br>Required: `ClusterId`, `DstZone` |
| `DescribeZones` | Describe zones |
| `DescribeBackupDownloadUrl` | Describe backup download url<br>Required: `ClusterId`, `BackupId` |
| `DescribeLibraDBInstanceDetail` | Describe libra db instance detail<br>Required: `ClusterId`, `InstanceId` |
| `DescribeLibraDBClusterAutoMapRule` | Describe libra dbcluster auto map rule<br>Required: `ClusterId`, `InstanceId` |
| `DescribeAccountAllGrantPrivileges` | Describe account all grant privileges<br>Required: `ClusterId`, `Account` |
| `DescribeClusterPasswordComplexity` | Describe cluster password complexity<br>Required: `ClusterId` |
| `DescribeBinlogs` | Describe binlogs<br>Required: `ClusterId` |
| `DescribeClusterInstanceGroups` | Describe cluster instance groups<br>Required: `ClusterId` |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups |
| `DescribeInstanceErrorLogs` | Describe instance error logs<br>Required: `InstanceId` |
## Mutations (gated — need allowlist, 78)

| Action | What it does |
|---|---|
| `CreateIntegrateCluster` | Create integrate cluster<br>Required: `Zone`, `VpcId`, `SubnetId`, `DbVersion` (8.0) |
| `UpgradeProxyVersion` | Upgrade proxy version<br>Required: `ClusterId`, `SrcProxyVersion`, `DstProxyVersion` |
| `ReplayInstanceAuditLog` | Run replay instance audit log<br>Required: `SourceClusterId`, `SourceInstanceId`, `TargetClusterId`, `TargetInstanceId`, `TargetUserName`, `TargetPassword`, `StartTime`, `EndTime` |
| `CreateProxyEndPoint` | Create proxy end point<br>Required: `ClusterId`, `UniqueVpcId`, `UniqueSubnetId` |
| `CreateAuditRuleTemplate` | Create audit rule template<br>Required: `RuleFilters`, `RuleTemplateName` |
| `CloseAuditService` | Close audit service<br>Required: `InstanceId` |
| `OpenAIOptimizer` | Open aioptimizer<br>Required: `ClusterId`, `InstanceId` |
| `CreateAuditLogFile` | Create audit log file<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `CloseProxyEndPoint` | Close proxy end point<br>Required: `ClusterId`, `ProxyGroupId` |
| `CloseProxy` | Close proxy<br>Required: `ClusterId` |
| `OfflineCluster` | Run offline cluster<br>Required: `ClusterId` |
| `InquirePriceModify` | Inquire the price of: run modify<br>Required: `ClusterId` |
| `SwitchProxyVpc` | Switch proxy vpc<br>Required: `ClusterId`, `UniqVpcId`, `UniqSubnetId`, `OldIpReserveHours`, `ProxyGroupId` |
| `CopyClusterPasswordComplexity` | Copy cluster password complexity<br>Required: `ClusterIds`, `SourceClusterId` |
| `AddServerlessRoInstances` | Add serverless ro instances<br>Required: `ClusterId` |
| `ActivateInstance` | Activate instance<br>Required: `ClusterId`, `InstanceIdList` |
| `ReloadBalanceProxyNode` | Run reload balance proxy node<br>Required: `ClusterId`, `ProxyGroupId` |
| `TransferClusterZone` | Transfer cluster zone<br>Required: `ClusterId`, `DstZone`, `MaxLag`, `TransferType` |
| `IsolateLibraDBCluster` | Run isolate libra dbcluster<br>Required: `ClusterId` |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `InstanceIds`, `SecurityGroupIds` |
| `OpenClusterReadOnlyInstanceGroupAccess` | Open cluster read only instance group access<br>Required: `ClusterId`, `Port` |
| `CloseClusterPasswordComplexity` | Close cluster password complexity<br>Required: `ClusterIds` |
| `RollBackCluster` | Run roll back cluster<br>Required: `ClusterId`, `RollbackStrategy` |
| `OfflineLibraDBCluster` | Run offline libra dbcluster<br>Required: `ClusterId` |
| `CreateClusterPeriodScalePolicy` | Create cluster period scale policy<br>Required: `ClusterId`, `InstanceType`, `ScaleStartTime`, `ScaleEndTime`, `PolicyStartTime`, `PolicyEndTime`, `PeriodType` |
| `CreateParamTemplate` | Create param template<br>Required: `TemplateName`, `EngineVersion` |
| `SetLibraDBClusterRenewFlag` | Set libra dbcluster renew flag |
| `CreateBackup` | Create backup<br>Required: `ClusterId` |
| `OfflineInstance` | Run offline instance<br>Required: `ClusterId`, `InstanceIdList` |
| `IsolateCluster` | Run isolate cluster<br>Required: `ClusterId` |
| `UpgradeProxy` | Upgrade proxy<br>Required: `ClusterId`, `Cpu`, `Mem` |
| `CloseWan` | Close wan |
| `CreateClusters` | Create clusters<br>Required: `Zone`, `VpcId`, `SubnetId`, `DbType`, `DbVersion` |
| `CreateAccounts` | Create accounts<br>Required: `ClusterId`, `Accounts` |
| `TransferClusterPrepayToPostpay` | Transfer cluster prepay to postpay<br>Required: `ClusterId` |
| `RollbackToNewCluster` | Roll back to new cluster<br>Required: `Zone`, `OriginalClusterId` |
| `CreateResourcePackage` | Create resource package<br>Required: `InstanceType`, `PackageRegion`, `PackageType`, `PackageVersion`, `PackageSpec`, `ExpireDay`, `PackageCount` |
| `SwitchClusterZone` | Switch cluster zone<br>Required: `ClusterId`, `OldZone`, `NewZone` |
| `IsolateLibraDBInstance` | Run isolate libra dbinstance<br>Required: `ClusterId`, `InstanceIdList` |
| `AddInstances` | Add instances<br>Required: `ClusterId`, `Cpu`, `Memory`, `ReadOnlyCount` |
| `ResumeServerless` | Resume serverless<br>Required: `ClusterId` |
| `RevokeAccountPrivileges` | Revoke account privileges<br>Required: `ClusterId`, `Account`, `DbTablePrivileges`, `DbTables` |
| `OpenClusterTransparentEncrypt` | Open cluster transparent encrypt<br>Required: `ClusterId`, `KeyType` |
| `PauseServerless` | Pause serverless<br>Required: `ClusterId` |
| `GrantAccountPrivileges` | Grant account privileges<br>Required: `ClusterId`, `Account`, `DbTablePrivileges`, `DbTables` |
| `BindClusterResourcePackages` | Bind cluster resource packages<br>Required: `PackageIds`, `ClusterId` |
| `UnbindClusterResourcePackages` | Unbind cluster resource packages<br>Required: `ClusterId` |
| `OfflineLibraDBInstance` | Run offline libra dbinstance<br>Required: `ClusterId`, `InstanceIdList` |
| `OpenWan` | Open wan |
| `AddLibraDBInstances` | Add libra db instances<br>Required: `Zone`, `ClusterId`, `Cpu`, `Mem`, `StorageSize`, `PayMode`, `Objects` |
| `ActivateLibraDBInstance` | Activate libra db instance<br>Required: `ClusterId`, `InstanceIdList` |
| `InquirePriceCreate` | Inquire the price of: run create<br>Required: `Zone`, `GoodsNum`, `InstancePayMode`, `StoragePayMode` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `InstanceIds`, `SecurityGroupIds` |
| `AddClusterSlaveZone` | Add cluster slave zone<br>Required: `ClusterId`, `SlaveZone` |
| `SetRenewFlag` | Set renew flag<br>Required: `ResourceIds`, `AutoRenewFlag` |
| `InquirePriceRenew` | Inquire the price of: run renew<br>Required: `ClusterId`, `TimeSpan`, `TimeUnit` |
| `StartCLSDelivery` | Start clsdelivery<br>Required: `InstanceId`, `CLSTopicIds` |
| `CreateVault` | Create vault<br>Required: `VaultName`, `BackupSaveSeconds` |
| `ActivateLibraDBCluster` | Activate libra dbcluster<br>Required: `ClusterId` |
| `CalculateBackupSaveSecExpires` | Run calculate backup save sec expires<br>Required: `VaultId` |
| `TransferStoragePrepayToPostpay` | Transfer storage prepay to postpay |
| `CreateClusterDatabase` | Create cluster database<br>Required: `ClusterId`, `DbName`, `CharacterSet`, `CollateRule` |
| `OpenAuditService` | Open audit service<br>Required: `InstanceId`, `LogExpireDay` |
| `CopyBackupToVault` | Copy backup to vault |
| `InquirePriceMultiSpec` | Inquire the price of: run multi spec<br>Required: `Zone`, `InstancePayMode`, `StoragePayMode`, `GoodsSpecs` |
| `UpgradeClusterVersion` | Upgrade cluster version<br>Required: `ClusterId`, `CynosVersion`, `UpgradeType` |
| `OpenSSL` | Open ssl<br>Required: `ClusterId` |
| `RefundResourcePackage` | Refund resource package<br>Required: `PackageId` |
| `SwitchClusterVpc` | Switch cluster vpc<br>Required: `ClusterId`, `UniqVpcId`, `UniqSubnetId`, `OldIpReserveHours` |
| `CreateProxy` | Create proxy<br>Required: `ClusterId`, `Cpu`, `Mem` |
| `CreateCLSDelivery` | Create clsdelivery<br>Required: `InstanceId`, `CLSInfoList` |
| `OpenReadOnlyInstanceExclusiveAccess` | Open read only instance exclusive access<br>Required: `ClusterId`, `InstanceId`, `VpcId`, `SubnetId`, `Port` |
| `CreateLibraDBClusters` | Create libra dbclusters<br>Required: `Count`, `Zone`, `InstanceInitInfos` |
| `UpgradeInstance` | Upgrade instance<br>Required: `InstanceId`, `Cpu`, `Memory`, `UpgradeType` |
| `CreateLibraDBClusterAccounts` | Create libra dbcluster accounts<br>Required: `ClusterId`, `Accounts` |
| `OpenClusterPasswordComplexity` | Open cluster password complexity<br>Required: `ClusterId`, `ValidatePasswordLength`, `ValidatePasswordMixedCaseCount`, `ValidatePasswordSpecialCharCount`, `ValidatePasswordNumberCount`, `ValidatePasswordPolicy` |
| `CloseSSL` | Close ssl<br>Required: `ClusterId` |
| `IsolateInstance` | Run isolate instance<br>Required: `ClusterId`, `InstanceIdList` |

## Blocked destructive actions (68)

`ModifyVault`, `ModifyBinlogConfig`, `ModifyResourcePackageClusters`, `ModifyLibraDBForwardConfig`, `ModifyClusterPeriodScalePolicy`, `ModifyDBInstanceSecurityGroups`, `DeleteLibraDBCluster`, `ModifyClusterStorage`, `RenewClusters`, `DeleteCLSDelivery`, `ModifyLibraDBClusterReplicationObject`, `ModifyClusterName`, `ModifyLibraDBClusterName`, `ModifyProxyRwSplit`, `RenewLibraDBClusters`, `DeleteClusterPeriodScalePolicy`, `ModifyVipVport`, `DeleteAuditRuleTemplates`, `ModifyProxyDesc`, `ModifyClusterBinlogRedoLogAutoCopyVault`, `ModifyClusterSlaveZone`, `ModifyAccountParams`, `ModifyClusterPasswordComplexity`, `RestartInstance`, `StopCLSDelivery`, `ModifyClusterDatabase`, `ModifyAuditRuleTemplates`, `ModifyParamTemplate`, `ModifyResourcePackagesDeductionPriority`, `ModifyLibraDBClusterAccountDescription`, `ModifyClusterParam`, `ModifyBackupDownloadUserRestriction`, `DeleteClusterDatabase`, `DeleteLibraDBClusterAccounts`, `ModifyMaintainPeriodConfig`, `ModifyInstanceUpgradeLimitDays`, `DeleteAccounts`, `ModifyLibraDBClusterAccountPrivilege`, `ModifyLibraDBClusterProject`, `DeleteBackup`, `RestartLibraDBInstance`, `DeleteVaults`, `ModifyAccountHost`, `ResetAccountPassword`, `ModifyInstanceParam`, `ModifyClusterLevel`, `DeleteClusterSaveBackup`, `ModifySnapBackupCrossRegionConfig`, `ModifyLibraDBClusterAccountHost`, `ModifyAccountPrivileges`, `ModifyBackupName`, `CancelClusterServerlessScalePlan`, `ModifyClusterGlobalEncryption`, `ModifyAccountDescription`, `ModifyServerlessStrategy`, `ModifyClusterReadOnly`, `DeleteAuditLogFile`, `ModifyBackupConfig`, `ModifyLibraDBClusterDataSource`, `DeleteBackupVault`, `ResetLibraDBClusterAccountPassword`, `ModifyInstanceName`, `ModifyAuditService`, `ModifyBackupDownloadRestriction`, `ModifyBinlogSaveDays`, `DeleteParamTemplate`, `ModifyResourcePackageName`, `RemoveClusterSlaveZone` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cynosdb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190107` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cynosdb"`) for the allow/block decision and reason.

---
name: tencent-sqlserver
description: Tencent Cloud SQLSERVER via the Tencent MCP server — 156 actions in API version v20180328 (69 read-only auto-allowed). Use for migration, backup, dbinstance, only, read, dbinstances. Triggers on mentions of sqlserver, migration, backup, dbinstance, only, read, dbinstances, database, incremental. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud SQLSERVER

Databases: 156 actions in API version `v20180328` — 69 read-only (auto-allowed), 37 gated mutations, 50 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "sqlserver"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/sqlserver/v20180328 — action signatures in `sqlserver_client.ts`, full request/response shapes in `sqlserver_models.ts`.

## Read actions (auto-allowed, 69)

| Action | What it does |
|---|---|
| `DescribeSpecSellStatus` | Describe spec sell status<br>Required: `Zone`, `SpecIdSet`, `DBVersion`, `Pid`, `PayMode`, `Currency` |
| `QueryMigrationCheckProcess` | Query migration check process<br>Required: `MigrateId` |
| `DescribeUploadIncrementalInfo` | Describe upload incremental info<br>Required: `InstanceId`, `BackupMigrationId`, `IncrementalMigrationId` |
| `DescribeRegularBackupPlan` | Describe regular backup plan<br>Required: `InstanceId`, `RegularBackupSaveDays` (default 365), `RegularBackupStrategy` (default months), `RegularBackupCounts` (default 1), `RegularBackupStartTime`, `BackupCycle` |
| `DescribeReadOnlyGroupDetails` | Describe read only group details<br>Required: `InstanceId`, `ReadOnlyGroupId` |
| `DescribeBackupFiles` | Describe backup files<br>Required: `InstanceId`, `GroupId` |
| `DescribeMaintenanceSpan` | Describe maintenance span<br>Required: `InstanceId` |
| `DescribePublishSubscribe` | Describe publish subscribe<br>Required: `InstanceId` |
| `DescribeDatabases` | Describe databases<br>Required: `InstanceIdSet` |
| `DescribeReadOnlyGroupList` | Describe read only group list<br>Required: `InstanceId` |
| `DescribeMigrationDetail` | Describe migration detail<br>Required: `MigrateId` |
| `DescribeZones` | Describe zones |
| `DescribeUploadBackupInfo` | Describe upload backup info<br>Required: `InstanceId`, `BackupMigrationId` |
| `DescribeProductConfig` | Describe product config<br>Required: `Zone` |
| `DescribeUpgradeInstanceCheck` | Describe upgrade instance check<br>Required: `InstanceId` |
| `DescribeLogs` | Describe logs<br>Required: `InstanceId`, `StartTime`, `EndTime`, `LogType` |
| `InquiryPriceCreateDBInstances` | Inquire the price of: create db instances<br>Required: `Zone`, `Memory` (unit: GB), `Storage` (unit: GB) |
| `DescribeCrossRegionZone` | Describe cross region zone<br>Required: `InstanceId` |
| `DescribeBackups` | Describe backups<br>Required: `StartTime`, `EndTime`, `InstanceId` |
| `DescribeIncrementalMigration` | Describe incremental migration<br>Required: `BackupMigrationId`, `InstanceId` |
| `DescribeDBRestoreTime` | Describe dbrestore time<br>Required: `InstanceId` |
| `DescribeBackupMigration` | Describe backup migration<br>Required: `InstanceId` |
| `DescribeProjectSecurityGroups` | Describe project security groups<br>Required: `ProjectId` |
| `DescribeRegions` | Describe regions |
| `DescribeRestoreTask` | Describe restore task<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeInstanceParams` | Describe instance params<br>Required: `InstanceId` |
| `DescribeBackupStatistical` | Describe backup statistical<br>Required: `Limit` (default 100), `Offset` (default 0) |
| `DescribeCollationTimeZone` | Describe collation time zone |
| `DescribeInstanceParamRecords` | Describe instance param records<br>Required: `InstanceId` |
| `DescribeInstanceTasks` | Describe instance tasks<br>Required: `InstanceId`, `Limit` |
| `DescribeHASwitchLog` | Describe haswitch log<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeDBCharsets` | Describe dbcharsets<br>Required: `InstanceId` |
| `DescribeRestoreTimeRange` | Describe restore time range<br>Required: `InstanceId` |
| `DescribeSlowlogs` | Describe slowlogs<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeFlowStatus` | Describe flow status<br>Required: `FlowId` |
| `DescribeDBInstances` | Describe db instances |
| `DescribeBusinessIntelligenceFile` | Describe business intelligence file<br>Required: `InstanceId` |
| `DescribeExportTasks` | Describe export tasks<br>Required: `LogType`, `Limit` (range 1-100; default 100), `Offset`, `InstanceId` |
| `DescribeBackupUploadSize` | Describe backup upload size<br>Required: `InstanceId`, `BackupMigrationId` |
| `DescribeDatabaseNames` | Describe database names<br>Required: `InstanceId`, `AccountName` |
| `DescribeInstanceByOrders` | Describe instance by orders<br>Required: `DealNames` |
| `DescribeAccounts` | Describe accounts<br>Required: `InstanceId` |
| `DescribeCrossRegions` | Describe cross regions |
| `DescribeMigrationDatabases` | Describe migration databases<br>Required: `InstanceId`, `UserName`, `Password` |
| `DescribeDBInstanceInter` | Describe db instance inter<br>Required: `Limit` |
| `DescribeInquiryPriceParameter` | Describe inquiry price parameter<br>Required: `Zone`, `Memory` (unit: GB), `Storage` (unit: GB), `InstanceType` |
| `DescribeBackupSummary` | Describe backup summary |
| `DescribeOrders` | Describe orders<br>Required: `DealNames` |
| `DescribeInstanceTradeParameter` | Describe instance trade parameter<br>Required: `Zone`, `Cpu`, `Memory`, `Storage`, `InstanceType`, `MachineType` |
| `DescribeBackupMonitor` | Describe backup monitor<br>Required: `StartTime`, `EndTime` |
| `DescribeLogInstanceList` | Describe log instance list<br>Required: `LogType` |
| `DescribeCrossBackupStatistical` | Describe cross backup statistical<br>Required: `Offset`, `Limit` |
| `DescribeDBsNormal` | Describe dbs normal<br>Required: `InstanceId` |
| `DescribeMigrations` | Describe migrations |
| `DescribeDatabasesNormal` | Describe databases normal<br>Required: `InstanceId` |
| `DescribeDBs` | Describe dbs<br>Required: `InstanceIdSet` |
| `DescribeBackupCommand` | Describe backup command<br>Required: `BackupFileType`, `DataBaseName`, `IsRecovery` |
| `InquiryPriceUpgradeDBInstance` | Inquire the price of: upgrade db instance<br>Required: `InstanceId`, `Memory`, `Storage` |
| `DescribeReadOnlyGroupAutoWeight` | Describe read only group auto weight<br>Required: `InstanceId`, `ReadOnlyGroupId` |
| `InquiryPriceRenewDBInstance` | Inquire the price of: renew db instance<br>Required: `InstanceId` |
| `DescribeXEvents` | Describe xevents<br>Required: `InstanceId`, `EventType`, `StartTime`, `EndTime` |
| `DescribeDBPrivilegeByAccount` | Describe dbprivilege by account<br>Required: `InstanceId`, `AccountName` |
| `DescribeAccountPrivilegeByDB` | Describe account privilege by db<br>Required: `InstanceId`, `DBName` |
| `DescribeProductSpec` | Describe product spec |
| `DescribeBackupByFlowId` | Describe backup by flow id<br>Required: `InstanceId`, `FlowId` |
| `DescribeRollbackTime` | Describe rollback time<br>Required: `InstanceId`, `DBs` |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `InstanceId` |
| `DescribeDBInstancesAttribute` | Describe db instances attribute<br>Required: `InstanceId` |
| `DescribeReadOnlyGroupByReadOnlyInstance` | Describe read only group by read only instance<br>Required: `InstanceId` |
## Mutations (gated — need allowlist, 37)

| Action | What it does |
|---|---|
| `RecycleReadOnlyGroup` | Run recycle read only group<br>Required: `InstanceId`, `ReadOnlyGroupId` |
| `StartIncrementalMigration` | Start incremental migration<br>Required: `InstanceId`, `BackupMigrationId`, `IncrementalMigrationId` |
| `RunMigration` | Run migration<br>Required: `MigrateId` |
| `CreateCloudReadOnlyDBInstances` | Create cloud read only db instances<br>Required: `InstanceId`, `Zone`, `ReadOnlyGroupType`, `Memory`, `Storage`, `Cpu`, `MachineType` |
| `CreatePublishSubscribe` | Create publish subscribe<br>Required: `PublishInstanceId`, `SubscribeInstanceId`, `DatabaseTupleSet` |
| `CutXEvents` | Run cut xevents<br>Required: `InstanceId` |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `SecurityGroupId`, `InstanceIdSet` |
| `CreateBusinessDBInstances` | Create business db instances<br>Required: `Zone`, `Memory`, `Storage`, `Cpu`, `MachineType` |
| `CreateBackup` | Create backup |
| `BalanceReadOnlyGroup` | Run balance read only group<br>Required: `InstanceId`, `ReadOnlyGroupId` |
| `CompleteMigration` | Complete migration<br>Required: `MigrateId` |
| `CreateAccount` | Create account<br>Required: `InstanceId`, `Accounts` |
| `CompleteExpansion` | Complete expansion<br>Required: `InstanceId` |
| `CreateDB` | Create db<br>Required: `InstanceId`, `DBs` |
| `CreateCloudDBInstances` | Create cloud db instances<br>Required: `Zone`, `Memory`, `Storage`, `Cpu`, `MachineType` |
| `CreateBusinessIntelligenceFile` | Create business intelligence file<br>Required: `InstanceId`, `FileURL`, `FileType` |
| `StartMigrationCheck` | Start migration check<br>Required: `MigrateId` |
| `CreateBasicDBInstances` | Create basic db instances<br>Required: `Zone`, `Cpu`, `Memory`, `Storage`, `SubnetId`, `VpcId`, `MachineType` |
| `CreateDBInstances` | Create db instances<br>Required: `Zone`, `Memory`, `Storage` |
| `CreateMigration` | Create migration<br>Required: `MigrateName`, `MigrateType`, `SourceType`, `Source`, `Target` |
| `CreateBackupMigration` | Create backup migration<br>Required: `InstanceId`, `RecoveryType`, `UploadType`, `MigrationName` |
| `StartBackupMigration` | Start backup migration<br>Required: `InstanceId`, `BackupMigrationId` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `SecurityGroupId`, `InstanceIdSet` |
| `OpenInterCommunication` | Open inter communication<br>Required: `InstanceIdSet` |
| `CreateIncrementalMigration` | Create incremental migration<br>Required: `InstanceId`, `BackupMigrationId` |
| `StartInstanceXEvent` | Start instance xevent<br>Required: `InstanceId`, `EventConfig` |
| `SwitchCloudInstanceHA` | Switch cloud instance ha<br>Required: `InstanceId` |
| `RecycleDBInstance` | Run recycle dbinstance<br>Required: `InstanceId` |
| `CreateReadOnlyDBInstances` | Create read only db instances<br>Required: `InstanceId`, `Zone`, `ReadOnlyGroupType`, `Memory`, `Storage` |
| `CloseLog` | Close log<br>Required: `InstanceId`, `LogType` |
| `CloseInterCommunication` | Close inter communication<br>Required: `InstanceIdSet` |
| `CreateExportTask` | Create export task<br>Required: `InstanceId`, `LogType`, `StartTime`, `EndTime` |
| `CloneDB` | Clone db<br>Required: `InstanceId`, `RenameRestore` |
| `RestoreInstance` | Restore instance<br>Required: `InstanceId`, `BackupId` |
| `OpenLog` | Open log<br>Required: `InstanceId`, `LogType`, `LogExpireDay` (default 7), `HighLogExpireDay` (default 7) |
| `RollbackInstance` | Roll back instance<br>Required: `InstanceId`, `Type`, `Time` |
| `UpgradeDBInstance` | Upgrade db instance<br>Required: `InstanceId` |

## Blocked destructive actions (50)

`ModifyAccountPrivilege`, `ModifyBackupName`, `ModifyAccountRemark`, `ModifyPublishSubscribe`, `ModifyDBInstanceName`, `ModifyDatabaseMdf`, `ModifyDBRemark`, `DeleteIncrementalMigration`, `ModifyDBInstanceNetwork`, `ModifyDBInstanceSecurityGroups`, `ModifyMaintenanceSpan`, `TerminateDBInstance`, `ModifyDBInstanceNote`, `DeleteDBInstance`, `ModifyDBName`, `ModifyDatabaseCT`, `ModifyPublishSubscribeName`, `RenewPostpaidDBInstance`, `DeleteExportTask`, `ModifyDatabaseCDC`, `DeleteRestoreTask`, `StopMigration`, `ModifyDatabasePrivilege`, `ModifyCloseWanIp`, `DeletePublishSubscribe`, `ModifyDatabaseShrinkMDF`, `ResetAccountPassword`, `ModifyInstanceParam`, `ModifyCrossBackupStrategy`, `DeleteDB`, `RestartDBInstance`, `DeleteBusinessIntelligenceFile`, `ModifyLog`, `DeleteMigration`, `ModifyInstanceEncryptAttributes`, `ModifyIncrementalMigration`, `ModifyDBEncryptAttributes`, `ModifyDReadable`, `RemoveBackups`, `ModifyMigration`, `ModifyDBInstanceProject`, `DeleteAccount`, `ModifyDBInstanceSSL`, `ModifyBackupStrategy`, `ModifyOpenWanIp`, `RenewDBInstance`, `ModifyBackupMigration`, `ModifyReadOnlyGroupDetails`, `DeleteBackupMigration`, `ModifyDBInstanceRenewFlag` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `sqlserver`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180328` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="sqlserver"`) for the allow/block decision and reason.

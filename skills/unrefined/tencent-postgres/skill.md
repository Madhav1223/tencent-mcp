---
name: tencent-postgres
description: Tencent Cloud POSTGRES via the Tencent MCP server — 124 actions in API version v20170312 (48 read-only auto-allowed). Use for dbinstance, backup, only, read, dbproxy, audit. Triggers on mentions of postgres, dbinstance, backup, only, read, dbproxy, audit, access, dbinstances. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud POSTGRES

Databases: 124 actions in API version `v20170312` — 48 read-only (auto-allowed), 34 gated mutations, 42 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "postgres"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/postgres/v20170312 — action signatures in `postgres_client.ts`, full request/response shapes in `postgres_models.ts`.

## Read actions (auto-allowed, 48)

| Action | What it does |
|---|---|
| `DescribeBackupDownloadURL` | Describe backup download url<br>Required: `DBInstanceId`, `BackupType` (LogBackup | BaseBackup), `BackupId` |
| `DescribeDBProxySSLConfig` | Describe dbproxy sslconfig<br>Required: `DBInstanceId`, `ProxyGroupId`, `ProxyAddressId` |
| `DescribeDefaultParameters` | Describe default parameters<br>Required: `DBMajorVersion`, `DBEngine` |
| `DescribeDBErrlogs` | Describe dberrlogs<br>Required: `DBInstanceId`, `StartTime` (default 7), `EndTime` |
| `DescribeBackupOverview` | Describe backup overview |
| `DescribeDatabaseObjects` | Describe database objects<br>Required: `DBInstanceId`, `ObjectType` |
| `DescribeMaintainTimeWindow` | Describe maintain time window<br>Required: `DBInstanceId` |
| `DescribeDedicatedClusters` | Describe dedicated clusters |
| `DescribeDBInstanceParameters` | Describe db instance parameters<br>Required: `DBInstanceId` |
| `DescribeTasks` | Describe tasks |
| `DescribeDatabases` | Describe databases<br>Required: `DBInstanceId` |
| `DescribeParameterTemplates` | Describe parameter templates |
| `DescribeProductConfig` | Describe product config |
| `DescribeAccountPrivileges` | Describe account privileges<br>Required: `DBInstanceId`, `UserName`, `DatabaseObjectSet` |
| `DescribeDBBackups` | Describe dbbackups<br>Required: `DBInstanceId`, `Type`, `StartTime`, `EndTime` |
| `DescribeSlowQueryAnalysis` | Describe slow query analysis<br>Required: `DBInstanceId`, `StartTime` (default 7), `EndTime` |
| `InquiryPriceCreateDBInstances` | Inquire the price of: create db instances<br>Required: `Zone`, `SpecCode`, `Storage` (unit: GB), `InstanceCount`, `Period` |
| `DescribeDBInstanceSecurityGroups` | Describe db instance security groups |
| `DescribeParameterTemplateAttributes` | Describe parameter template attributes<br>Required: `TemplateId` |
| `DescribeDBInstanceHAConfig` | Describe db instance haconfig<br>Required: `DBInstanceId` |
| `DescribeBaseBackups` | Describe base backups |
| `DescribeAvailableRecoveryTime` | Describe available recovery time<br>Required: `DBInstanceId` |
| `DescribeRegions` | Describe regions |
| `DescribeDBVersions` | Describe dbversions |
| `DescribeAuditLogFiles` | Describe audit log files<br>Required: `InstanceId`, `Product` |
| `DescribeBackupSummaries` | Describe backup summaries |
| `DescribeEncryptionKeys` | Describe encryption keys<br>Required: `DBInstanceId` |
| `DescribeAuditInstanceList` | Describe audit instance list<br>Required: `Product`, `AuditSwitch`, `Limit` |
| `DescribeAuditLogs` | Describe audit logs<br>Required: `InstanceId`, `StartTime` (format `2026-03-25…`), `EndTime` (format `2026-03-25…`), `Limit`, `Product` (format `postgres…`) |
| `DescribeDBXlogs` | Describe dbxlogs<br>Required: `DBInstanceId`, `StartTime`, `EndTime` |
| `DescribeDBInstanceAttribute` | Describe db instance attribute<br>Required: `DBInstanceId` |
| `DescribeSlowQueryList` | Describe slow query list<br>Required: `DBInstanceId`, `StartTime` (default 7), `EndTime` |
| `DescribeLogBackups` | Describe log backups |
| `DescribeAccounts` | Describe accounts<br>Required: `DBInstanceId` |
| `DescribeCloneDBInstanceSpec` | Describe clone db instance spec<br>Required: `DBInstanceId` |
| `DescribeDBInstances` | Describe db instances |
| `DescribeBackupDownloadRestriction` | Describe backup download restriction |
| `DescribeParamsEvent` | Describe params event<br>Required: `DBInstanceId` |
| `DescribeDBProxySpecs` | Describe dbproxy specs |
| `DescribeClasses` | Describe classes<br>Required: `Zone`, `DBEngine` (1 | postgresql), `DBMajorVersion` |
| `DescribeOrders` | Describe orders<br>Required: `DealNames` |
| `DescribeBackupPlans` | Describe backup plans<br>Required: `DBInstanceId` |
| `DescribeZones` | Describe zones |
| `DescribeDBInstanceSSLConfig` | Describe db instance sslconfig<br>Required: `DBInstanceId` |
| `InquiryPriceUpgradeDBInstance` | Inquire the price of: upgrade db instance<br>Required: `Storage`, `Memory`, `DBInstanceId` |
| `InquiryPriceRenewDBInstance` | Inquire the price of: renew db instance<br>Required: `DBInstanceId`, `Period` |
| `DescribeDBProxy` | Describe dbproxy<br>Required: `DBInstanceId` |
| `DescribeReadOnlyGroups` | Describe read only groups |
## Mutations (gated — need allowlist, 34)

| Action | What it does |
|---|---|
| `OpenAccountCAM` | Open account cam<br>Required: `DBInstanceId`, `UserName` |
| `CloseDBProxyAddress` | Close dbproxy address<br>Required: `DBInstanceId`, `AddressId` |
| `SetAutoRenewFlag` | Set auto renew flag<br>Required: `DBInstanceIdSet`, `AutoRenewFlag` |
| `CloseAuditService` | Close audit service<br>Required: `InstanceId`, `Product` |
| `CreateAuditLogFile` | Create audit log file<br>Required: `InstanceId`, `StartTime` (format `2026-03-25…`), `EndTime` (format `2026-03-25…`), `Product` |
| `CreateDBInstanceNetworkAccess` | Create db instance network access<br>Required: `DBInstanceId`, `VpcId`, `SubnetId`, `IsAssignVip` |
| `ReloadBalanceDBProxyNode` | Run reload balance dbproxy node<br>Required: `DBInstanceId` |
| `UnlockAccount` | Unlock account<br>Required: `DBInstanceId`, `UserName` |
| `CreateBaseBackup` | Create base backup<br>Required: `DBInstanceId` |
| `RestoreDBInstanceObjects` | Restore db instance objects<br>Required: `DBInstanceId`, `RestoreObjects` |
| `CreateDatabase` | Create database<br>Required: `DBInstanceId`, `DatabaseName`, `DatabaseOwner` |
| `CreateAccount` | Create account<br>Required: `DBInstanceId`, `UserName`, `Type` |
| `CloseAccountCAM` | Close account cam<br>Required: `DBInstanceId`, `UserName`, `Password` |
| `CloneDBInstance` | Clone db instance<br>Required: `DBInstanceId`, `SpecCode`, `Storage` (unit: GB), `Period`, `AutoRenewFlag` (default 0), `VpcId`, `SubnetId` |
| `DisIsolateDBInstances` | Run dis isolate dbinstances<br>Required: `DBInstanceIdSet` |
| `CreateParameterTemplate` | Create parameter template<br>Required: `TemplateName`, `DBMajorVersion`, `DBEngine` |
| `CreateReadOnlyDBInstance` | Create read only db instance<br>Required: `Zone`, `MasterDBInstanceId`, `SpecCode`, `Storage` (unit: GB), `InstanceCount`, `Period` |
| `RefreshAccountPassword` | Refresh account password<br>Required: `DBInstanceId`, `UserName` |
| `UpgradeDBInstanceMajorVersion` | Upgrade db instance major version<br>Required: `DBInstanceId`, `TargetDBKernelVersion` |
| `RebalanceReadOnlyGroup` | Run rebalance read only group<br>Required: `ReadOnlyGroupId` |
| `CreateReadOnlyGroupNetworkAccess` | Create read only group network access<br>Required: `ReadOnlyGroupId`, `VpcId`, `SubnetId`, `IsAssignVip` |
| `UpgradeDBInstanceKernelVersion` | Upgrade db instance kernel version<br>Required: `DBInstanceId`, `TargetDBKernelVersion` |
| `IsolateDBInstances` | Run isolate dbinstances<br>Required: `DBInstanceIdSet` |
| `CloseDBExtranetAccess` | Close dbextranet access<br>Required: `DBInstanceId` |
| `AddDBInstanceToReadOnlyGroup` | Add db instance to read only group<br>Required: `DBInstanceId`, `ReadOnlyGroupId` |
| `CreateBackupPlan` | Create backup plan<br>Required: `DBInstanceId`, `PlanName`, `BackupPeriodType`, `BackupPeriod` |
| `SwitchDBInstancePrimary` | Switch db instance primary<br>Required: `DBInstanceId` |
| `OpenDBExtranetAccess` | Open dbextranet access<br>Required: `DBInstanceId` |
| `CreateDBProxyAddress` | Create dbproxy address<br>Required: `DBInstanceId`, `VpcId`, `SubnetId` |
| `CreateReadOnlyGroup` | Create read only group<br>Required: `MasterDBInstanceId`, `Name` |
| `CreateDBProxy` | Create dbproxy<br>Required: `DBInstanceId`, `VpcId`, `SubnetId`, `ProxyNodeCustom` |
| `LockAccount` | Lock account<br>Required: `DBInstanceId`, `UserName` |
| `OpenAuditService` | Open audit service<br>Required: `InstanceId`, `LogExpireDay`, `HotLogExpireDay`, `AuditType`, `Product` |
| `CreateInstances` | Create instances<br>Required: `SpecCode`, `Storage` (unit: GB), `InstanceCount`, `Period`, `Charset`, `AdminName`, `AdminPassword`, `Zone` |

## Blocked destructive actions (42)

`ModifyMaintainTimeWindow`, `ModifyAccountRemark`, `ModifyDBInstanceName`, `DeleteParameterTemplate`, `ModifyDBInstanceSpec`, `ModifyBackupDownloadRestriction`, `ModifyDBProxyAddress`, `DeleteDatabase`, `DeleteReadOnlyGroupNetworkAccess`, `ModifyDBInstanceChargeType`, `DestroyDBInstance`, `ModifyDBInstanceDeployment`, `RenewInstance`, `ModifyDBInstanceParameters`, `ModifyDBInstanceReadOnlyGroup`, `ModifyParameterTemplate`, `ModifyDBInstanceDeletionProtection`, `ModifyDBInstancesProject`, `ResetAccountPassword`, `RestartDBInstance`, `DeleteDBInstanceNetworkAccess`, `DeleteReadOnlyGroup`, `ModifyDBInstanceHAConfig`, `DeleteLogBackup`, `ModifyBaseBackupExpireTime`, `ModifyAccountPrivileges`, `ModifyReadOnlyGroupConfig`, `RemoveDBInstanceFromReadOnlyGroup`, `ModifyReadOnlyDBInstanceWeight`, `ModifyDBProxy`, `DeleteAuditLogFile`, `ModifySwitchTimePeriod`, `ModifyDatabaseOwner`, `DeleteAccount`, `ModifyBackupPlan`, `ModifyAuditService`, `DeleteBackupPlan`, `DestroyDBProxy`, `ModifyDBInstanceSecurityGroups`, `DeleteBaseBackup`, `ModifyDBProxySSLConfig`, `ModifyDBInstanceSSLConfig` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `postgres`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20170312` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="postgres"`) for the allow/block decision and reason.

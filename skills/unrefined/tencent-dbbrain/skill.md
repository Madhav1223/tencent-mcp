---
name: tencent-dbbrain
description: Tencent Cloud DBBRAIN via the Tencent MCP server — 92 actions in API version v20210527 (56 read-only auto-allowed). Use for redis, audit, dbdiag, slow, time, profile. Triggers on mentions of dbbrain, redis, audit, dbdiag, slow, time, profile, report, series. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud DBBRAIN

Databases: 92 actions in API version `v20210527` — 56 read-only (auto-allowed), 21 gated mutations, 15 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dbbrain"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dbbrain/v20210527 — action signatures in `dbbrain_client.ts`, full request/response shapes in `dbbrain_models.ts`.

## Read actions (auto-allowed, 56)

| Action | What it does |
|---|---|
| `DescribeMySqlProcessList` | Describe my sql process list<br>Required: `InstanceId` |
| `DescribeDBAutonomyAction` | Describe dbautonomy action<br>Required: `ActionId`, `InstanceId`, `Product` |
| `DescribeRedisTopBigKeys` | Describe redis top big keys<br>Required: `InstanceId`, `Product` |
| `DescribeRedisBigKeyAnalysisTasks` | Describe redis big key analysis tasks<br>Required: `Product`, `InstanceId` |
| `DescribeRedisCommandOverview` | Describe redis command overview<br>Required: `InstanceId`, `StartTime`, `EndTime`, `Product` |
| `DescribeDBDiagEvent` | Describe dbdiag event<br>Required: `InstanceId`, `EventId` |
| `DescribeRedisTopKeyPrefixList` | Describe redis top key prefix list<br>Required: `InstanceId`, `Date`, `Product` |
| `DescribeIndexRecommendAggregationSlowLogs` | Describe index recommend aggregation slow logs<br>Required: `Product`, `InstanceId`, `Db`, `Collection`, `Signs` |
| `DescribeMetricTopProxies` | Describe metric top proxies<br>Required: `StartTime`, `EndTime`, `InstanceId`, `Product` (default mysql), `Metric` |
| `DescribeNoPrimaryKeyTables` | Describe no primary key tables<br>Required: `InstanceId`, `Date` |
| `DescribeDBDiagReportContent` | Describe dbdiag report content<br>Required: `InstanceId`, `AsyncRequestId` |
| `DescribeRedisCommandCostStatistics` | Describe redis command cost statistics<br>Required: `InstanceId`, `StartTime`, `EndTime`, `Product` |
| `DescribeMailProfile` | Describe mail profile<br>Required: `ProfileType`, `Product` (default mysql), `Offset`, `Limit` |
| `DescribeIndexRecommendInfo` | Describe index recommend info<br>Required: `Product`, `InstanceId` |
| `DescribeDatabaseAutonomyStatus` | Describe database autonomy status<br>Required: `InstanceId`, `Product` (mongodb), `Type` (AutoIndexAdvice) |
| `DescribeTopSpaceTableTimeSeries` | Describe top space table time series<br>Required: `InstanceId` |
| `DescribeSlowLogUserHostStats` | Describe slow log user host stats<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeTopSpaceTables` | Describe top space tables<br>Required: `InstanceId` |
| `DescribeHealthScore` | Describe health score<br>Required: `InstanceId`, `Time`, `Product` (default quot) |
| `DescribeDBAutonomyActions` | Describe dbautonomy actions<br>Required: `EventId`, `InstanceId`, `Product` |
| `DescribeSlowLogs` | Describe slow logs<br>Required: `Product` (default quot), `InstanceId`, `Md5`, `StartTime`, `EndTime`, `Offset` (default 0), `Limit` (default 20) |
| `DescribeTopSpaceSchemaTimeSeries` | Describe top space schema time series<br>Required: `InstanceId` |
| `DescribeRedisUnExpiredKeyStatistics` | Describe redis un expired key statistics<br>Required: `InstanceId`, `Product` |
| `DescribeRedisSlowLogTopSqls` | Describe redis slow log top sqls<br>Required: `InstanceId`, `StartTime`, `EndTime`, `Product` |
| `DescribeSlowLogQueryTimeStats` | Describe slow log query time stats<br>Required: `InstanceId`, `StartTime`, `EndTime`, `Product` (default mysql) |
| `DescribeDBAutonomyEvents` | Describe dbautonomy events<br>Required: `Product`, `InstanceId`, `StartTime`, `EndTime` |
| `DescribeSecurityAuditLogDownloadUrls` | Describe security audit log download urls<br>Required: `SecAuditGroupId`, `AsyncRequestId`, `Product` |
| `DescribeSqlTemplate` | Describe sql template<br>Required: `InstanceId`, `Schema`, `SqlText` |
| `DescribeDBPerfTimeSeries` | Describe dbperf time series<br>Required: `InstanceId`, `StartTime`, `EndTime`, `Metric`, `Product` |
| `DescribeDBDiagReportTasks` | Describe dbdiag report tasks |
| `DescribeAllUserGroup` | Describe all user group<br>Required: `Product` |
| `DescribeAuditInstanceList` | Describe audit instance list<br>Required: `Product`, `NodeRequestType` |
| `DescribeSlowLogTimeSeriesStats` | Describe slow log time series stats<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeDBAuditLogTopSqls` | Describe dbaudit log top sqls<br>Required: `StartTime`, `EndTime`, `Product` (default quot), `InstanceId` |
| `DescribeRedisCmdPerfTimeSeries` | Describe redis cmd perf time series<br>Required: `InstanceId`, `Product`, `StartTime`, `EndTime`, `CommandList`, `Metric` |
| `DescribeDBSpaceStatus` | Describe dbspace status<br>Required: `InstanceId` |
| `DescribeDBInstances` | Describe db instances<br>Required: `InstanceIds` |
| `DescribeSecurityAuditLogExportTasks` | Describe security audit log export tasks<br>Required: `SecAuditGroupId`, `Product` |
| `DescribeAllUserContact` | Describe all user contact<br>Required: `Product` |
| `DescribeUserAutonomyProfile` | Describe user autonomy profile<br>Required: `ProfileType`, `InstanceId`, `Product` |
| `DescribeDBDiagHistory` | Describe dbdiag history<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeProxyProcessStatistics` | Describe proxy process statistics<br>Required: `InstanceId`, `InstanceProxyId`, `Limit`, `Product` |
| `DescribeSqlFilters` | Describe sql filters<br>Required: `InstanceId` |
| `DescribeAlarmTemplate` | Describe alarm template<br>Required: `TemplateNameRegexp`, `Limit` (default 50), `Offset` (default 0) |
| `DescribeProxySessionKillTasks` | Describe proxy session kill tasks<br>Required: `InstanceId`, `AsyncRequestIds`, `Product` |
| `DescribeTopSpaceSchemas` | Describe top space schemas<br>Required: `InstanceId` |
| `DescribeHealthScoreTimeSeries` | Describe health score time series<br>Required: `StartTime`, `EndTime`, `InstanceId`, `Product` (default mysql) |
| `DescribeAuditLogFiles` | Describe audit log files<br>Required: `Product`, `NodeRequestType`, `InstanceId` |
| `DescribeDBDiagEvents` | Describe dbdiag events<br>Required: `StartTime`, `EndTime` |
| `DescribeRedisTopHotKeys` | Describe redis top hot keys<br>Required: `InstanceId`, `StartTime`, `EndTime`, `Product` |
| `DescribeMongoDBProcessList` | Describe mongo dbprocess list<br>Required: `InstanceId`, `Product` |
| `DescribeUserSqlAdvice` | Describe user sql advice<br>Required: `InstanceId`, `SqlText` |
| `DescribeRedisTopCostCommands` | Describe redis top cost commands<br>Required: `StartTime`, `EndTime`, `InstanceId`, `Product` (default mysql) |
| `DescribeSlowLogTopSqls` | Describe slow log top sqls<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeDiagDBInstances` | Describe diag db instances<br>Required: `IsSupported`, `Product` (default mysql), `Offset`, `Limit` |
| `DescribeRedisProcessList` | Describe redis process list<br>Required: `InstanceId`, `Product` |
## Mutations (gated — need allowlist, 21)

| Action | What it does |
|---|---|
| `CreateProxySessionKillTask` | Create proxy session kill task<br>Required: `InstanceId`, `Product` |
| `CreateSecurityAuditLogExportTask` | Create security audit log export task<br>Required: `SecAuditGroupId`, `StartTime`, `EndTime`, `Product` |
| `CloseAuditService` | Close audit service<br>Required: `Product`, `NodeRequestType`, `InstanceId` |
| `CreateAuditLogFile` | Create audit log file<br>Required: `Product`, `NodeRequestType`, `InstanceId`, `StartTime`, `EndTime` |
| `CreateDBDiagReportUrls` | Create dbdiag report urls<br>Required: `Product`, `AsyncRequestIds` |
| `AddUserContact` | Add user contact<br>Required: `Name`, `ContactInfo`, `Product` |
| `CreateKillTask` | Create kill task<br>Required: `InstanceId`, `Duration` |
| `CreateSchedulerMailProfile` | Create scheduler mail profile<br>Required: `WeekConfiguration` (range 1-7), `ProfileInfo`, `ProfileName`, `BindInstanceId`, `Product` |
| `CreateRedisBigKeyAnalysisTask` | Create redis big key analysis task<br>Required: `InstanceId`, `Product` |
| `CreateSqlFilter` | Create sql filter<br>Required: `InstanceId`, `SqlType`, `FilterKey`, `MaxConcurrency`, `Duration` |
| `UpdateAgentSwitch` | Update agent switch<br>Required: `AgentId`, `Switch`, `Product` |
| `VerifyUserAccount` | Verify user account<br>Required: `InstanceId`, `User`, `Password` |
| `CreateIgnoreDiagRecord` | Create ignore diag record<br>Required: `InstanceId`, `Product` (mysql | cynosdb | dcdb | mariadb | redis | mongodb | postgres), `DiagItem`, `Status` (1 | 2) |
| `UpdateMonitorSwitch` | Update monitor switch<br>Required: `Switch`, `InstanceId`, `Product` |
| `CreateMongoDBKillTask` | Create mongo dbkill task<br>Required: `InstanceId`, `Duration`, `Product` (default mysql) |
| `CreateDBDiagReportUrl` | Create dbdiag report url<br>Required: `InstanceId`, `AsyncRequestId` |
| `CreateMailProfile` | Create mail profile<br>Required: `ProfileInfo`, `ProfileLevel`, `ProfileName`, `ProfileType`, `Product` |
| `CreateDBDiagReportTask` | Create dbdiag report task<br>Required: `InstanceId`, `StartTime`, `EndTime`, `SendMailFlag` |
| `CreateUserAutonomyProfile` | Create user autonomy profile<br>Required: `ProfileType`, `InstanceId`, `Product` |
| `UpdateDatabaseAutonomyStatus` | Update database autonomy status<br>Required: `InstanceId`, `Product` (mongodb), `Type` (AutoIndexAdvice), `Status` (0 | 1) |
| `OpenAuditService` | Open audit service<br>Required: `Product`, `NodeRequestType`, `InstanceId`, `LogExpireDay`, `HotLogExpireDay` |

## Blocked destructive actions (15)

`CancelKillTask`, `ModifySqlFilters`, `ModifyUserAutonomyProfile`, `ModifyAlarmPolicy`, `CancelDBAutonomyAction`, `DeleteSecurityAuditLogExportTasks`, `ModifyDiagDBInstanceConf`, `KillMySqlThreads`, `DeleteDBDiagReportTasks`, `DeleteAuditLogFile`, `DeleteRedisBigKeyAnalysisTasks`, `CancelRedisBigKeyAnalysisTasks`, `ModifyAuditService`, `CancelDBAutonomyEvent`, `DeleteSqlFilters` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dbbrain`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210527` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dbbrain"`) for the allow/block decision and reason.

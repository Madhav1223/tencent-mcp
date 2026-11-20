---
name: tencent-dts
description: Tencent Cloud DTS via the Tencent MCP server — 84 actions in API version v20211206 (21 read-only auto-allowed). Use for sync, compare, migrate, subscribe, check, consumer. Triggers on mentions of dts, sync, compare, migrate, subscribe, check, consumer, migration, name. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud DTS

Databases: 84 actions in API version `v20211206` — 21 read-only (auto-allowed), 32 gated mutations, 31 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dts"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dts/v20211206 — action signatures in `dts_client.ts`, full request/response shapes in `dts_models.ts`.

## Read actions (auto-allowed, 21)

| Action | What it does |
|---|---|
| `DescribeSyncGtidCompareReport` | Describe sync gtid compare report<br>Required: `JobId` |
| `DescribeSyncJobs` | Describe sync jobs |
| `DescribeSubscribeJobs` | Describe subscribe jobs |
| `DescribeSubscribeReturnable` | Describe subscribe returnable<br>Required: `SubscribeId` |
| `DescribeConsumerGroups` | Describe consumer groups<br>Required: `SubscribeId` |
| `DescribeSyncCompareTasks` | Describe sync compare tasks<br>Required: `JobId` |
| `DescribeCompareReport` | Describe compare report<br>Required: `JobId`, `CompareTaskId` |
| `DescribeMigrateGtidCompareReport` | Describe migrate gtid compare report<br>Required: `JobId` |
| `DescribeSubscribeCheckJob` | Describe subscribe check job<br>Required: `SubscribeId` |
| `DescribeCompareDiffItems` | Describe compare diff items<br>Required: `JobId`, `CompareTaskId` |
| `DescribeSyncCompareReport` | Describe sync compare report<br>Required: `JobId`, `CompareTaskId` |
| `DescribeMigrateDBInstances` | Describe migrate db instances<br>Required: `DatabaseType` |
| `DescribeSyncCompareDiffItems` | Describe sync compare diff items<br>Required: `JobId`, `CompareTaskId` |
| `DescribeCheckSyncJobResult` | Describe check sync job result |
| `DescribeCompareTasks` | Describe compare tasks<br>Required: `JobId` |
| `DescribeSubscribeDetail` | Describe subscribe detail<br>Required: `SubscribeId` |
| `DescribeMigrationJobs` | Describe migration jobs |
| `DescribeModifyCheckSyncJobResult` | Describe modify check sync job result<br>Required: `JobId` |
| `DescribeMigrationDetail` | Describe migration detail<br>Required: `JobId` |
| `DescribeOffsetByTime` | Describe offset by time<br>Required: `SubscribeId`, `Time` |
| `DescribeMigrationCheckJob` | Describe migration check job<br>Required: `JobId` |
## Mutations (gated — need allowlist, 32)

| Action | What it does |
|---|---|
| `ResumeSubscribe` | Resume subscribe<br>Required: `SubscribeId` |
| `SkipSyncCheckItem` | Run skip sync check item<br>Required: `JobId`, `StepIds` |
| `CreateModifyCheckSyncJob` | Create modify check sync job<br>Required: `JobId` |
| `CreateMigrationService` | Create migration service<br>Required: `SrcDatabaseType`, `DstDatabaseType`, `SrcRegion`, `DstRegion`, `InstanceClass` |
| `IsolateSyncJob` | Run isolate sync job<br>Required: `JobId` |
| `CreateSyncJob` | Create sync job<br>Required: `PayMode`, `SrcDatabaseType`, `SrcRegion`, `DstDatabaseType`, `DstRegion` |
| `ConfigureSubscribeJob` | Run configure subscribe job<br>Required: `SubscribeId`, `SubscribeMode`, `AccessType`, `Endpoints`, `KafkaConfig` |
| `CreateConsumerGroup` | Create consumer group<br>Required: `SubscribeId`, `ConsumerGroupName`, `AccountName`, `Password` |
| `StartSubscribe` | Start subscribe<br>Required: `SubscribeId` |
| `SkipCheckItem` | Run skip check item<br>Required: `JobId`, `StepIds` |
| `CreateCheckSyncJob` | Create check sync job<br>Required: `JobId` |
| `ContinueMigrateJob` | Run continue migrate job<br>Required: `JobId` |
| `PauseMigrateJob` | Pause migrate job<br>Required: `JobId` |
| `ConfigureSyncJob` | Run configure sync job<br>Required: `JobId`, `SrcAccessType`, `DstAccessType`, `Objects` |
| `IsolateSubscribe` | Run isolate subscribe<br>Required: `SubscribeId` |
| `StartModifySyncJob` | Start modify sync job<br>Required: `JobId` |
| `StartCompare` | Start compare<br>Required: `JobId`, `CompareTaskId` |
| `ResizeSyncJob` | Resize sync job<br>Required: `JobId`, `NewInstanceClass` |
| `ResumeMigrateJob` | Resume migrate job<br>Required: `JobId` |
| `PauseSyncJob` | Pause sync job<br>Required: `JobId` |
| `ContinueSyncJob` | Run continue sync job<br>Required: `JobId` |
| `IsolateMigrateJob` | Run isolate migrate job<br>Required: `JobId` |
| `CreateSubscribeCheckJob` | Create subscribe check job<br>Required: `SubscribeId` |
| `CreateMigrateCheckJob` | Create migrate check job<br>Required: `JobId` |
| `StartSyncCompare` | Start sync compare<br>Required: `JobId`, `CompareTaskId` |
| `CreateSubscribe` | Create subscribe<br>Required: `Product`, `PayType` |
| `CreateCompareTask` | Create compare task<br>Required: `JobId` |
| `StartSyncJob` | Start sync job |
| `ResumeSyncJob` | Resume sync job<br>Required: `JobId` |
| `StartMigrateJob` | Start migrate job<br>Required: `JobId` |
| `CreateSyncCompareTask` | Create sync compare task<br>Required: `JobId` |
| `CompleteMigrateJob` | Complete migrate job<br>Required: `JobId` |

## Blocked destructive actions (31)

`DestroyIsolatedSubscribe`, `ModifyMigrationJob`, `ModifyMigrateRuntimeAttribute`, `ModifyMigrateRateLimit`, `StopCompare`, `ResetConsumerGroupOffset`, `DeleteCompareTask`, `ModifySubscribeObjects`, `StopSyncJob`, `ResetSyncJob`, `ModifySubscribeAutoRenewFlag`, `ModifySyncJobConfig`, `StopMigrateJob`, `ModifySyncRateLimit`, `ModifySyncCompareTaskName`, `ModifyConsumerGroupDescription`, `DeleteSyncCompareTask`, `ModifyConsumerGroupPassword`, `ModifyCompareTask`, `DeleteConsumerGroup`, `RecoverMigrateJob`, `RecoverSyncJob`, `ResetSubscribe`, `ModifySyncCompareTask`, `ModifySubscribeName`, `DestroyMigrateJob`, `ModifyMigrateJobSpec`, `DestroySyncJob`, `ModifyCompareTaskName`, `StopSyncCompare`, `ModifyMigrateName` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dts`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20211206` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dts"`) for the allow/block decision and reason.

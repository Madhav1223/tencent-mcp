---
name: tencent-oceanus
description: Tencent Cloud OCEANUS via the Tencent MCP server — 53 actions in API version v20190422 (20 read-only auto-allowed). Use for jobs, work, cluster, connector, meta, oceanus. Triggers on mentions of oceanus, jobs, work, cluster, connector, meta, oceanus, space, table. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Analytics & streaming jobs
metadata:
  version: "4"
---

# Tencent Cloud OCEANUS

Analytics & streaming jobs: 53 actions in API version `v20190422` — 20 read-only (auto-allowed), 18 gated mutations, 15 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "oceanus"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Streaming jobs are long-running and billed while active — stop or suspend idle jobs; confirm job state after every start/stop call.
Job SQL/configuration is versioned separately from the running job — updating code requires an explicit restart/redeploy to take effect.
Checkpoints/savepoints guard exactly-once semantics: trigger one before any stop or upgrade, and resume from it on restart.
Scale parallelism from observed backpressure, not guesses — read the job metrics first.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/oceanus/v20190422 — action signatures in `oceanus_client.ts`, full request/response shapes in `oceanus_models.ts`.

## Read actions (auto-allowed, 20)

| Action | What it does |
|---|---|
| `DescribeTreeJobs` | Describe tree jobs |
| `DescribeTreeResources` | Describe tree resources |
| `DescribeFolder` | Describe folder<br>Required: `FolderId`, `WorkSpaceId`, `FolderType` |
| `DescribeJobSavepoint` | Describe job savepoint<br>Required: `JobId`, `Limit`, `Offset` |
| `DescribeJobSubmissionLog` | Describe job submission log<br>Required: `JobId`, `StartTime`, `EndTime` |
| `DescribeResources` | Describe resources |
| `DescribeJobRuntimeInfo` | Describe job runtime info<br>Required: `JobId`, `WorkSpaceId`, `IncludeInfo` |
| `DescribeClusters` | Describe clusters |
| `DescribeResourceConfigs` | Describe resource configs |
| `DescribeWorkSpaces` | Describe work spaces |
| `DescribeWorkSpaceUsers` | Describe work space users<br>Required: `WorkSpaceId` |
| `CheckConnectorName` | Check connector name<br>Required: `Name` |
| `DescribeSystemResources` | Describe system resources |
| `CheckSavepoint` | Check savepoint<br>Required: `JobId`, `SerialId`, `RecordType`, `SavepointPath`, `WorkSpaceId` |
| `DescribeJobEvents` | Describe job events<br>Required: `JobId`, `StartTimestamp`, `EndTimestamp` |
| `DescribeResourceRelatedJobs` | Describe resource related jobs<br>Required: `ResourceId` |
| `DescribeVariables` | Describe variables |
| `DescribeJobs` | Describe jobs |
| `GetMetaTable` | Get meta table<br>Required: `Catalog`, `Database`, `Table`, `WorkSpaceId` |
| `DescribeJobConfigs` | Describe job configs<br>Required: `JobId` |
## Mutations (gated — need allowlist, 18)

| Action | What it does |
|---|---|
| `CopyJobs` | Copy jobs<br>Required: `JobItems` |
| `RunSqlGatewayStatement` | Run sql gateway statement<br>Required: `ClusterId`, `Sql` |
| `CreateWorkSpace` | Create work space<br>Required: `WorkSpaceName` |
| `CreateResourceConfig` | Create resource config<br>Required: `ResourceId`, `ResourceLoc` |
| `CreateConnector` | Create connector<br>Required: `ResourceId`, `WorkSpaceId`, `VersionId`, `Connector`, `ConnectionMethod` |
| `CreateMetaDatabase` | Create meta database<br>Required: `CatalogId`, `DatabaseName` |
| `FetchSqlGatewayStatementResult` | Fetch sql gateway statement result<br>Required: `ClusterId` |
| `RunJobs` | Run jobs<br>Required: `RunJobDescriptions` |
| `CreateVariable` | Create variable<br>Required: `Name`, `Value`, `Type` |
| `CreateJob` | Create job<br>Required: `Name`, `JobType`, `ClusterType` |
| `TriggerJobSavepoint` | Trigger job savepoint<br>Required: `JobId` |
| `ParseConnector` | Run parse connector<br>Required: `ResourceId`, `VersionId` |
| `CreateFolder` | Create folder<br>Required: `FolderName`, `ParentId` |
| `CreateJobConfig` | Create job config<br>Required: `JobId` |
| `CreateMetaTable` | Create meta table<br>Required: `CatalogId`, `DatabaseId`, `SqlCode` |
| `CreateResource` | Create resource<br>Required: `ResourceLoc`, `ResourceType` |
| `ScaleOceanusCluster` | Scale oceanus cluster<br>Required: `ClusterId`, `NewCU` |
| `CreateOceanusCluster` | Create oceanus cluster<br>Required: `ClusterName`, `RegionId`, `ZoneId`, `LoginPassword`, `VpcDescriptions`, `DefaultCOSBucket` |

## Blocked destructive actions (15)

`ModifyMetaTable`, `DeleteResourceConfigs`, `DeleteTableConfig`, `DeleteWorkSpace`, `DeleteOceanusCluster`, `DeleteFolders`, `DeleteJobs`, `DeleteJobConfigs`, `StopJobs`, `RenewOceanusCluster`, `ModifyFolder`, `ModifyWorkSpace`, `DeleteResources`, `ModifyJob`, `ModifyConnector` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `oceanus`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190422` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="oceanus"`) for the allow/block decision and reason.

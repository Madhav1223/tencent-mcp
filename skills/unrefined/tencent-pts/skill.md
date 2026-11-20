---
name: tencent-pts
description: Tencent Cloud PTS via the Tencent MCP server — 48 actions in API version v20210728 (22 read-only auto-allowed). Use for jobs, cron, sample, scenario, alert, query. Triggers on mentions of pts, jobs, cron, sample, scenario, alert, query, summary, abort. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Observability & ops tooling
metadata:
  version: "4"
---

# Tencent Cloud PTS

Observability & ops tooling: 48 actions in API version `v20210728` — 22 read-only (auto-allowed), 18 gated mutations, 8 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "pts"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Metric namespaces and instance IDs must match exactly — list the monitored objects first; a wrong ID yields empty data, not an error.
Alarm policies need both a trigger condition and a notification channel — a policy without receivers never pages anyone; verify both halves.
Retention on logs/metrics/traces is finite — export or ship anything needed for post-incident review before it ages out.
Load-test and chaos actions generate real traffic/faults — scope them to non-production or maintenance windows with explicit confirmation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/pts/v20210728 — action signatures in `pts_client.ts`, full request/response shapes in `pts_models.ts`.

## Read actions (auto-allowed, 22)

| Action | What it does |
|---|---|
| `DescribeScenarioWithJobs` | Describe scenario with jobs |
| `DescribeFiles` | Describe files<br>Required: `ProjectIds` |
| `DescribeSampleQuery` | Describe sample query<br>Required: `JobId`, `ScenarioId`, `Metric`, `Aggregation` (Rate | Count | Avg | P90 | P95 | P99 | Gauge), `ProjectId` |
| `DescribeJobs` | Describe jobs<br>Required: `ScenarioIds`, `ProjectIds` |
| `DescribeRegions` | Describe regions |
| `DescribeCheckSummary` | Describe check summary<br>Required: `JobId`, `ScenarioId`, `ProjectId` |
| `DescribeSampleMatrixBatchQuery` | Describe sample matrix batch query<br>Required: `JobId`, `ProjectId`, `ScenarioId`, `Queries` |
| `DescribeSampleMatrixQuery` | Describe sample matrix query<br>Required: `JobId`, `ProjectId`, `ScenarioId`, `Metric`, `Aggregation` (Rate | Count | Avg | P90 | P95 | P99 | Gauge) |
| `DescribeRequestSummary` | Describe request summary<br>Required: `JobId`, `ScenarioId`, `ProjectId` |
| `DescribeProjects` | Describe projects |
| `DescribeAlertRecords` | Describe alert records<br>Required: `ProjectIds` |
| `DescribeSampleBatchQuery` | Describe sample batch query<br>Required: `JobId`, `ScenarioId`, `Queries`, `ProjectId` |
| `DescribeAlertChannels` | Describe alert channels<br>Required: `ProjectIds` |
| `DescribeAvailableMetrics` | Describe available metrics |
| `DescribeLabelValues` | Describe label values<br>Required: `JobId`, `ScenarioId`, `Metric`, `LabelName`, `ProjectId` |
| `DescribeEnvironments` | Describe environments |
| `DescribeErrorSummary` | Describe error summary<br>Required: `JobId`, `ScenarioId`, `ProjectId` |
| `DescribeNormalLogs` | Describe normal logs<br>Required: `ProjectId`, `ScenarioId`, `JobId` |
| `DescribeSampleLogs` | Describe sample logs<br>Required: `ProjectId`, `ScenarioId`, `JobId` |
| `DescribeScenarios` | Describe scenarios |
| `DescribeCronJobs` | Describe cron jobs<br>Required: `ProjectIds` |
| `DescribeMetricLabelWithValues` | Describe metric label with values<br>Required: `JobId`, `ProjectId`, `ScenarioId` |
## Mutations (gated — need allowlist, 18)

| Action | What it does |
|---|---|
| `UpdateJob` | Update job<br>Required: `JobId`, `ProjectId`, `ScenarioId` |
| `UpdateCronJob` | Update cron job<br>Required: `ProjectId`, `CronJobId`, `Note`, `CronExpression`, `FrequencyType`, `Name`, `ScenarioId`, `ScenarioName`, `JobOwner` |
| `StartJob` | Start job<br>Required: `ScenarioId`, `JobOwner`, `ProjectId` |
| `UpdateScenario` | Update scenario<br>Required: `ScenarioId` |
| `CreateScenario` | Create scenario<br>Required: `Name`, `Type`, `ProjectId` |
| `AbortCronJobs` | Abort cron jobs<br>Required: `ProjectId`, `CronJobIds` |
| `UpdateFileScenarioRelation` | Update file scenario relation<br>Required: `FileId`, `ProjectId` |
| `UpdateEnvironment` | Update environment |
| `CreateAlertChannel` | Create alert channel<br>Required: `NoticeId`, `ProjectId` |
| `CopyScenario` | Copy scenario<br>Required: `ProjectId`, `ScenarioId` |
| `CreateEnvironment` | Create environment<br>Required: `ProjectId`, `Name`, `EnvVars` |
| `CreateFile` | Create file<br>Required: `FileId`, `ProjectId`, `Kind`, `Name`, `Size`, `Type` |
| `AdjustJobSpeed` | Adjust job speed<br>Required: `JobId`, `TargetRequestsPerSecond` |
| `CreateProject` | Create project<br>Required: `Name` |
| `AbortJob` | Abort job<br>Required: `JobId`, `ProjectId`, `ScenarioId` |
| `UpdateProject` | Update project<br>Required: `ProjectId` |
| `GenerateTmpKey` | Generate tmp key<br>Required: `ProjectId` |
| `CreateCronJob` | Create cron job<br>Required: `Name`, `ProjectId`, `ScenarioId`, `ScenarioName`, `FrequencyType`, `CronExpression`, `JobOwner` |

## Blocked destructive actions (8)

`DeleteEnvironments`, `DeleteProjects`, `DeleteFiles`, `DeleteScenarios`, `RestartCronJobs`, `DeleteJobs`, `DeleteCronJobs`, `DeleteAlertChannel` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `pts`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210728` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="pts"`) for the allow/block decision and reason.

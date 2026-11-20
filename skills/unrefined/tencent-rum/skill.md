---
name: tencent-rum
description: Tencent Cloud RUM via the Tencent MCP server — 90 actions in API version v20210622 (75 read-only auto-allowed). Use for statistics, report, static, fetch, issues, page. Triggers on mentions of rum, statistics, report, static, fetch, issues, page, release, anrproblem. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Observability & ops tooling
metadata:
  version: "4"
---

# Tencent Cloud RUM

Observability & ops tooling: 90 actions in API version `v20210622` — 75 read-only (auto-allowed), 5 gated mutations, 10 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "rum"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Metric namespaces and instance IDs must match exactly — list the monitored objects first; a wrong ID yields empty data, not an error.
Alarm policies need both a trigger condition and a notification channel — a policy without receivers never pages anyone; verify both halves.
Retention on logs/metrics/traces is finite — export or ship anything needed for post-incident review before it ages out.
Load-test and chaos actions generate real traffic/faults — scope them to non-production or maintenance windows with explicit confirmation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/rum/v20210622 — action signatures in `rum_client.ts`, full request/response shapes in `rum_models.ts`.

## Read actions (auto-allowed, 75)

| Action | What it does |
|---|---|
| `DescribeRumStatsLogList` | Describe rum stats log list<br>Required: `StartTime`, `Limit`, `Query`, `EndTime`, `ID` |
| `DescribeDataFetchUrl` | Describe data fetch url<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeRumLogExport` | Describe rum log export<br>Required: `Name`, `StartTime`, `Query`, `EndTime`, `ID` |
| `DescribeExceptionReportList` | Describe exception report list |
| `DescribeDataFetchUrlInfo` | Describe data fetch url info<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataCustomUrlV2` | Describe data custom url v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataStaticProjectV2` | Describe data static project v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataCustomUrl` | Describe data custom url<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeFOOMMallocProblemList` | Describe foommalloc problem list<br>Required: `ProductId` |
| `DescribeRumLogExportV2` | Describe rum log export v2<br>Required: `Name`, `StartTime`, `Filter`, `EndTime`, `ID` |
| `DescribeDataEventUrl` | Describe data event url<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeScores` | Describe scores<br>Required: `EndTime`, `StartTime` |
| `DescribeRumGroupLogV2` | Describe rum group log v2<br>Required: `OrderBy`, `StartTime`, `Limit`, `Filter`, `EndTime`, `ID`, `Label` |
| `DescribeRumLogTotalV2` | Describe rum log total v2<br>Required: `OrderBy`, `StartTime`, `Limit`, `Filter`, `EndTime`, `ID` |
| `DescribeTawInstances` | Describe taw instances |
| `DescribeTopIssues` | Describe top issues<br>Required: `ProductId` |
| `DescribeDataPerformancePageV2` | Describe data performance page v2<br>Required: `ID`, `StartTime`, `EndTime`, `Type` |
| `DescribeRumStatsLogListV2` | Describe rum stats log list v2<br>Required: `StartTime`, `Limit`, `Filter`, `EndTime`, `ID` |
| `DescribeDataStaticUrl` | Describe data static url<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeRumGroupLog` | Describe rum group log<br>Required: `OrderBy`, `StartTime`, `Limit`, `Page`, `Query`, `EndTime`, `ID`, `GroupField` |
| `DescribeDataFetchUrlV2` | Describe data fetch url v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataPvUrlStatisticsV2` | Describe data pv url statistics v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeRumLogExports` | Describe rum log exports<br>Required: `PageSize`, `PageNum`, `ID` |
| `DescribeDataPvUrlStatistics` | Describe data pv url statistics<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeReleaseFileSign` | Describe release file sign |
| `DescribeDataEventUrlV2` | Describe data event url v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataStaticResource` | Describe data static resource<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeRumLogExportsV2` | Describe rum log exports v2<br>Required: `PageSize`, `PageNum`, `ID` |
| `DescribeDataStaticUrlV2` | Describe data static url v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeWhitelists` | Describe whitelists<br>Required: `InstanceID` |
| `DescribeApplicationExitReportList` | Describe application exit report list<br>Required: `ProductId` |
| `DescribeDataWebVitalsPageV2` | Describe data web vitals page v2<br>Required: `StartTime`, `EndTime`, `ID` |
| `DescribeUvList` | Describe uv list<br>Required: `ProjectId`, `EndTime`, `StartTime` |
| `DescribeDataStaticProject` | Describe data static project<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeTawAreas` | Describe taw areas |
| `DescribeToken` | Describe token |
| `DescribeDataPerformancePage` | Describe data performance page<br>Required: `ID`, `StartTime`, `EndTime`, `Type` |
| `DescribeAppSingleCaseList` | Describe app single case list<br>Required: `ProjectID`, `From`, `Fields`, `Filter` |
| `DescribeLagANRProblemFeatureAccounts` | Describe lag anrproblem feature accounts<br>Required: `ProductId` |
| `DescribeDataSetUrlStatisticsV2` | Describe data set url statistics v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataStaticResourceV2` | Describe data static resource v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeIssuesStatisticsTrend` | Describe issues statistics trend<br>Required: `ProductId` |
| `DescribeDataSetUrlStatistics` | Describe data set url statistics<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeAppDimensionMetrics` | Describe app dimension metrics<br>Required: `ProjectID`, `From`, `Fields`, `Filter` |
| `DescribeFOOMProblemDetail` | Describe foomproblem detail<br>Required: `ProductId` |
| `DescribeProjects` | Describe projects<br>Required: `Limit`, `Offset` |
| `DescribeFOOMMallocProblemDetail` | Describe foommalloc problem detail<br>Required: `ProductId` |
| `DescribeRumLogList` | Describe rum log list<br>Required: `OrderBy`, `StartTime`, `Limit`, `Page`, `Query`, `EndTime`, `ID` |
| `DescribeDataLogUrlStatisticsV2` | Describe data log url statistics v2<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeIssuesList` | Describe issues list |
| `DescribeFOOMProblemList` | Describe foomproblem list<br>Required: `ProductId` |
| `DescribeDataReportCountV2` | Describe data report count v2<br>Required: `StartTime`, `EndTime` |
| `DescribeLagANRProblemList` | Describe lag anrproblem list<br>Required: `ProductId` |
| `DescribeDataReportCount` | Describe data report count<br>Required: `StartTime`, `EndTime` |
| `DescribeExceptionDetail` | Describe exception detail<br>Required: `ProductId` |
| `DescribeDataLogUrlInfo` | Describe data log url info<br>Required: `ID`, `StartTime`, `EndTime` |
| `DescribeDataLogUrlStatistics` | Describe data log url statistics<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeDataFetchProject` | Describe data fetch project<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeApplicationExitReportDetail` | Describe application exit report detail<br>Required: `ProductId` |
| `DescribeError` | Describe error<br>Required: `Date`, `ID` |
| `DescribeFOOMReportList` | Describe foomreport list<br>Required: `ProductId` |
| `DescribePvList` | Describe pv list<br>Required: `ProjectId`, `EndTime`, `StartTime` |
| `DescribeDataWebVitalsPage` | Describe data web vitals page<br>Required: `StartTime`, `EndTime`, `ID` |
| `DescribeAppSingleCaseDetailList` | Describe app single case detail list<br>Required: `ProjectID`, `From`, `Fields`, `Filter` |
| `DescribeAppMetricsData` | Describe app metrics data<br>Required: `ProjectID`, `From`, `Fields`, `Filter` |
| `DescribeFOOMMallocReportList` | Describe foommalloc report list<br>Required: `ProductId` |
| `DescribeProjectLimits` | Describe project limits<br>Required: `ProjectID` |
| `DescribeIssuesDistribution` | Describe issues distribution |
| `DescribeDataBridgeUrlV2` | Describe data bridge url v2<br>Required: `ID`, `StartTime`, `EndTime`, `Type` |
| `DescribeDataPvUrlInfo` | Describe data pv url info<br>Required: `StartTime`, `Type`, `EndTime`, `ID` |
| `DescribeScoresV2` | Describe scores v2<br>Required: `StartTime`, `EndTime` |
| `DescribeLagANRProblemAccountDetail` | Describe lag anrproblem account detail<br>Required: `ProductId` |
| `DescribeRumLogDetailsV2` | Describe rum log details v2<br>Required: `OrderBy`, `StartTime`, `Limit`, `Filter`, `EndTime`, `ID` |
| `DescribeReleaseFiles` | Describe release files<br>Required: `ProjectID` |
| `DescribeData` | Describe data<br>Required: `Query`, `ID` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `ResumeInstance` | Resume instance<br>Required: `InstanceId` |
| `CreateStarProject` | Create star project<br>Required: `InstanceID`, `ID` |
| `CreateReleaseFile` | Create release file<br>Required: `ProjectID`, `Files` |
| `CreateWhitelist` | Create whitelist<br>Required: `InstanceID`, `Remark`, `WhitelistUin` |
| `ResumeProject` | Resume project<br>Required: `ProjectId` |

## Blocked destructive actions (10)

`DeleteWhitelist`, `ModifyProjectLimit`, `ModifyInstance`, `StopInstance`, `DeleteProject`, `DeleteReleaseFile`, `DeleteInstance`, `DeleteStarProject`, `StopProject`, `ModifyProject` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `rum`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210622` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="rum"`) for the allow/block decision and reason.

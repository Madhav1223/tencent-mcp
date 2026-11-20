---
name: tencent-mmps
description: Tencent Cloud MMPS via the Tencent MCP server — 15 actions in API version v20200710 (10 read-only auto-allowed). Use for scan, mini, report, repeat, usage, basic. Triggers on mentions of mmps, scan, mini, report, repeat, usage, basic, diagnosis, param. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud MMPS

General service: 15 actions in API version `v20200710` — 10 read-only (auto-allowed), 5 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mmps"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mmps/v20200710 — action signatures in `mmps_client.ts`, full request/response shapes in `mmps_models.ts`.

## Read actions (auto-allowed, 10)

| Action | What it does |
|---|---|
| `DescribeFlySecMiniAppScanReportList` | Describe fly sec mini app scan report list<br>Required: `MiniAppID`, `Mode`, `Status`, `Size` |
| `DescribeFlySecMiniAppReportUrl` | Describe fly sec mini app report url<br>Required: `TaskID`, `MiniAppID`, `Mode` |
| `DescribeFlySecMiniAppScanTaskStatus` | Describe fly sec mini app scan task status<br>Required: `TaskID` |
| `DescribeResourceUsageInfo` | Describe resource usage info |
| `DescribeScanTaskReportUrl` | Describe scan task report url<br>Required: `Source`, `TaskID`, `Platform`, `ReportType`, `TaskType` |
| `DescribeScanTaskList` | Describe scan task list<br>Required: `Source`, `Platform`, `TaskStatuses` (default 1.), `TaskTypes`, `PageNo`, `PageSize` |
| `DescribeFlySecMiniAppScanTaskList` | Describe fly sec mini app scan task list<br>Required: `Mode`, `Status`, `Size` |
| `DescribeScanTaskStatus` | Describe scan task status<br>Required: `TaskType`, `Source`, `TaskID`, `Platform` |
| `DescribeBasicDiagnosisResourceUsageInfo` | Describe basic diagnosis resource usage info<br>Required: `Mode` |
| `DescribeFlySecMiniAppScanTaskParam` | Describe fly sec mini app scan task param<br>Required: `TaskID` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `CreateAppScanTask` | Create app scan task<br>Required: `TaskType`, `Source`, `AppPackage`, `Platform` |
| `CreateFlySecMiniAppProfessionalScanTask` | Create fly sec mini app professional scan task<br>Required: `MiniAppID`, `MiniAppName`, `Mode`, `CorpName`, `Mobile`, `Email` |
| `CreateFlySecMiniAppScanTask` | Create fly sec mini app scan task<br>Required: `MiniAppID`, `Mode` |
| `CreateFlySecMiniAppScanTaskRepeat` | Create fly sec mini app scan task repeat<br>Required: `MiniAppID`, `Mode`, `OrgTaskID` |
| `CreateAppScanTaskRepeat` | Create app scan task repeat<br>Required: `TaskType`, `Source`, `AppPackage`, `Platform`, `OrgTaskID` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mmps`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200710` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mmps"`) for the allow/block decision and reason.

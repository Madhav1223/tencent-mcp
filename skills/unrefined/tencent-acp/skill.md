---
name: tencent-acp
description: Tencent Cloud ACP via the Tencent MCP server — 8 actions in API version v20220105 (6 read-only auto-allowed). Use for scan, report, channel, repeat, ticket, usage. Triggers on mentions of acp, scan, report, channel, repeat, ticket, usage. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud ACP

General service: 8 actions in API version `v20220105` — 6 read-only (auto-allowed), 2 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "acp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/acp/v20220105 — action signatures in `acp_client.ts`, full request/response shapes in `acp_models.ts`.

## Read actions (auto-allowed, 6)

| Action | What it does |
|---|---|
| `DescribeChannelTaskReportUrl` | Describe channel task report url<br>Required: `Source`, `Platform`, `TaskID`, `TaskType`, `ReportType`, `AppMD5` |
| `DescribeResourceUsageInfo` | Describe resource usage info |
| `DescribeScanTaskStatus` | Describe scan task status<br>Required: `Source`, `Platform`, `TaskID`, `TaskType` |
| `DescribeScanTaskReportUrl` | Describe scan task report url<br>Required: `Source`, `Platform`, `TaskID`, `TaskType`, `ReportType` |
| `DescribeFileTicket` | Describe file ticket<br>Required: `Source`, `Platform` |
| `DescribeScanTaskList` | Describe scan task list<br>Required: `Source`, `Platform`, `TaskStatuses` (default 1.), `TaskTypes`, `PageNo`, `PageSize` |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `CreateAppScanTask` | Create app scan task<br>Required: `TaskType`, `Source`, `Platform` |
| `CreateAppScanTaskRepeat` | Create app scan task repeat<br>Required: `Source`, `Platform`, `TaskType`, `OrgTaskID` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `acp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220105` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="acp"`) for the allow/block decision and reason.

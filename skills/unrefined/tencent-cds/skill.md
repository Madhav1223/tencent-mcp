---
name: tencent-cds
description: Tencent Cloud CDS via the Tencent MCP server — 10 actions in API version v20180420 (7 read-only auto-allowed). Use for dbaudit, report, instances, assets, flag, mission. Triggers on mentions of cds, dbaudit, report, instances, assets, flag, mission, price, regions. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CDS

General service: 10 actions in API version `v20180420` — 7 read-only (auto-allowed), 2 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cds"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cds/v20180420 — action signatures in `cds_client.ts`, full request/response shapes in `cds_models.ts`.

## Read actions (auto-allowed, 7)

| Action | What it does |
|---|---|
| `DescribeReportList` | Describe report list |
| `DescribeDbauditInstances` | Describe dbaudit instances |
| `InquiryPriceDbauditInstance` | Inquire the price of: run dbaudit instance<br>Required: `InstanceVersion` (cdsaudit | cdsaudit_adv), `InquiryType`, `TimeSpan` (1 | 2 | 3 | 4 | m | 5 | m | 6), `TimeUnit`, `ServiceRegion` |
| `DescribeReportMissionList` | Describe report mission list |
| `DescribeDbauditUsedRegions` | Describe dbaudit used regions |
| `DescribeAssetsList` | Describe assets list |
| `DescribeDbauditInstanceType` | Describe dbaudit instance type |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `CreateTimerReport` | Create timer report |
| `CreateReportPdf` | Create report pdf<br>Required: `Id` |

## Blocked destructive actions (1)

`ModifyDbauditInstancesRenewFlag` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cds`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180420` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cds"`) for the allow/block decision and reason.

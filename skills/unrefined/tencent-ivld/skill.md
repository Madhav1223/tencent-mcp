---
name: tencent-ivld
description: Tencent Cloud IVLD via the Tencent MCP server — 28 actions in API version v20210903 (12 read-only auto-allowed). Use for custom, person, category, media, callback, categories. Triggers on mentions of ivld, custom, person, category, media, callback, categories, image, summary. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud IVLD

General service: 28 actions in API version `v20210903` — 12 read-only (auto-allowed), 10 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ivld"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ivld/v20210903 — action signatures in `ivld_client.ts`, full request/response shapes in `ivld_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `QueryCallback` | Query callback |
| `DescribeVideoSummaryDetail` | Describe video summary detail<br>Required: `TaskId` |
| `DescribeTaskDetail` | Describe task detail<br>Required: `TaskId` |
| `DescribeTask` | Describe task<br>Required: `TaskId` |
| `DescribeCustomPersonDetail` | Describe custom person detail<br>Required: `PersonId` |
| `DescribeCustomPersons` | Describe custom persons<br>Required: `PageNumber`, `PageSize` |
| `DescribeMedia` | Describe media<br>Required: `MediaId` |
| `DescribeUsageAmount` | Describe usage amount |
| `DescribeTasks` | Describe tasks |
| `DescribeCustomCategories` | Describe custom categories |
| `DescribeCustomGroup` | Describe custom group |
| `DescribeMedias` | Describe medias<br>Required: `PageNumber`, `PageSize` |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `CreateTask` | Create task<br>Required: `MediaId`, `MediaPreknownInfo` |
| `ImportMedia` | Import media<br>Required: `URL` |
| `CreateCustomPerson` | Create custom person<br>Required: `Name`, `BasicInfo`, `CategoryId` |
| `UpdateCustomCategory` | Update custom category<br>Required: `CategoryId`, `L1Category` |
| `UpdateCustomPerson` | Update custom person<br>Required: `PersonId` |
| `AddCustomPersonImage` | Add custom person image<br>Required: `PersonId` |
| `CreateDefaultCategories` | Create default categories |
| `CreateVideoSummaryTask` | Create video summary task<br>Required: `SummaryType`, `VideoURL` |
| `CreateCustomCategory` | Create custom category<br>Required: `L1Category`, `L2Category` |
| `CreateCustomGroup` | Create custom group<br>Required: `Bucket` |

## Blocked destructive actions (6)

`DeleteCustomPersonImage`, `DeleteCustomCategory`, `DeleteCustomPerson`, `DeleteMedia`, `ModifyCallback`, `DeleteTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ivld`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210903` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ivld"`) for the allow/block decision and reason.

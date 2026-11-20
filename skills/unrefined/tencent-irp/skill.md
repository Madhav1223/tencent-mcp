---
name: tencent-irp
description: Tencent Cloud IRP via the Tencent MCP server — 7 actions in API version v20220805 (1 read-only auto-allowed). Use for report, feed, goods, behavior, recommend, item. Triggers on mentions of irp, report, feed, goods, behavior, recommend, item. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud IRP

General service: 7 actions in API version `v20220805` — 1 read-only (auto-allowed), 6 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "irp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/irp/v20220805 — action signatures in `irp_client.ts`, full request/response shapes in `irp_models.ts`.

## Read actions (auto-allowed, 1)

| Action | What it does |
|---|---|
| `DescribeGoodsRecommend` | Describe goods recommend<br>Required: `InstanceId`, `SceneId`, `UserId` |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `ReportGoodsInfo` | Report goods info<br>Required: `InstanceId`, `GoodsList` |
| `ReportGoodsBehavior` | Report goods behavior<br>Required: `InstanceId`, `GoodsBehaviorList` |
| `ReportFeedBehavior` | Report feed behavior<br>Required: `InstanceId`, `FeedBehaviorList` |
| `ReportFeedUser` | Report feed user<br>Required: `InstanceId`, `FeedUserList` |
| `ReportFeedItem` | Report feed item<br>Required: `InstanceId`, `FeedItemList` |
| `FeedRecommend` | Run feed recommend<br>Required: `InstanceId`, `SceneId`, `UserId` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `irp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220805` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="irp"`) for the allow/block decision and reason.

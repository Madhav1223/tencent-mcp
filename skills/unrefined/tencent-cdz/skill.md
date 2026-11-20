---
name: tencent-cdz
description: Tencent Cloud CDZ via the Tencent MCP server — 2 actions in API version v20221123 (2 read-only auto-allowed). Use for cloud, dedicated, zone, hosts, summary. Triggers on mentions of cdz, cloud, dedicated, zone, hosts, summary. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CDZ

General service: 2 actions in API version `v20221123` — 2 read-only (auto-allowed), 0 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdz"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdz/v20221123 — action signatures in `cdz_client.ts`, full request/response shapes in `cdz_models.ts`.

## Read actions (auto-allowed, 2)

| Action | What it does |
|---|---|
| `DescribeCloudDedicatedZoneResourceSummary` | Describe cloud dedicated zone resource summary<br>Required: `CdzId` |
| `DescribeCloudDedicatedZoneHosts` | Describe cloud dedicated zone hosts<br>Required: `CloudDedicatedZoneID` |
## Mutations (gated — need allowlist, 0)

| Action | What it does |
|---|---|
| — |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdz`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20221123` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdz"`) for the allow/block decision and reason.

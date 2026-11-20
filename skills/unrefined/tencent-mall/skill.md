---
name: tencent-mall
description: Tencent Cloud MALL via the Tencent MCP server — 1 actions in API version v20230518 (1 read-only auto-allowed). Use for draw. Triggers on mentions of mall, draw. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Commerce & marketplace
metadata:
  version: "4"
---

# Tencent Cloud MALL

Commerce & marketplace: 1 actions in API version `v20230518` — 1 read-only (auto-allowed), 0 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mall"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Catalog, order, and settlement objects reference each other by ID — resolve IDs with list actions before creating dependent records.
Pricing and promotion rules have effective windows — confirm start/end times in the right timezone.
Settlement and invoicing actions move money — double-confirm amounts, accounts, and windows with the user before executing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mall/v20230518 — action signatures in `mall_client.ts`, full request/response shapes in `mall_models.ts`.

## Read actions (auto-allowed, 1)

| Action | What it does |
|---|---|
| `DescribeDrawResourceList` | Describe draw resource list<br>Required: `PageNumber`, `PageSize` |
## Mutations (gated — need allowlist, 0)

| Action | What it does |
|---|---|
| — |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mall`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230518` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mall"`) for the allow/block decision and reason.

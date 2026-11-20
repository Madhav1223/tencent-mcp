---
name: tencent-region
description: Tencent Cloud REGION via the Tencent MCP server — 3 actions in API version v20220627 (3 read-only auto-allowed). Use for products, regions, zones. Triggers on mentions of region, products, regions, zones. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Meta services (tags, regions, quotas)
metadata:
  version: "4"
---

# Tencent Cloud REGION

Meta services (tags, regions, quotas): 3 actions in API version `v20220627` — 3 read-only (auto-allowed), 0 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "region"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Tag, region, and quota services describe the account itself — use them to ground every other task (valid regions, limits, tag coverage).
Quota increases are requests, not instant grants — submit early and track status.
Tagging is eventually consistent in cost views — allow lag before reconciling spend by tag.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/region/v20220627 — action signatures in `region_client.ts`, full request/response shapes in `region_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `DescribeProducts` | Describe products |
| `DescribeRegions` | Describe regions<br>Required: `Product` |
| `DescribeZones` | Describe zones<br>Required: `Product` |
## Mutations (gated — need allowlist, 0)

| Action | What it does |
|---|---|
| — |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `region`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220627` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="region"`) for the allow/block decision and reason.

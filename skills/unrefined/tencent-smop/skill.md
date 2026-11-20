---
name: tencent-smop
description: Tencent Cloud SMOP via the Tencent MCP server — 1 actions in API version v20201203 (0 read-only auto-allowed). Use for event, submit. Triggers on mentions of smop, event, submit. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Collaboration & office
metadata:
  version: "4"
---

# Tencent Cloud SMOP

Collaboration & office: 1 actions in API version `v20201203` — 0 read-only (auto-allowed), 1 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "smop"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Users, departments, and permissions form a hierarchy — resolve org IDs before creating members or granting roles.
Meetings, docs, and messages reference each other by ID — list first, act second.
Retention and permission scopes decide visibility — confirm sharing scope before publishing anything broadly.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/smop/v20201203 — action signatures in `smop_client.ts`, full request/response shapes in `smop_models.ts`.

## Read actions (auto-allowed, 0)

| Action | What it does |
|---|---|

## Mutations (gated — need allowlist, 1)

| Action | What it does |
|---|---|
| `SubmitTaskEvent` | Submit task event<br>Required: `AccountId`, `DeviceId`, `OrderId`, `Code`, `Async`, `ProductId` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `smop`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201203` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="smop"`) for the allow/block decision and reason.

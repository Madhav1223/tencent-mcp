---
name: tencent-iap
description: Tencent Cloud IAP via the Tencent MCP server — 6 actions in API version v20240713 (2 read-only auto-allowed). Use for iapuser, oidcconfig, duration, iaplogin, session. Triggers on mentions of iap, iapuser, oidcconfig, duration, iaplogin, session. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud IAP

General service: 6 actions in API version `v20240713` — 2 read-only (auto-allowed), 3 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iap"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iap/v20240713 — action signatures in `iap_client.ts`, full request/response shapes in `iap_models.ts`.

## Read actions (auto-allowed, 2)

| Action | What it does |
|---|---|
| `DescribeIAPLoginSessionDuration` | Describe iaplogin session duration |
| `DescribeIAPUserOIDCConfig` | Describe iapuser oidcconfig |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `UpdateIAPUserOIDCConfig` | Update iapuser oidcconfig<br>Required: `IdentityUrl`, `ClientId`, `AuthorizationEndpoint`, `ResponseType`, `ResponseMode`, `MappingFiled`, `IdentityKey` |
| `DisableIAPUserSSO` | Disable iapuser sso |
| `CreateIAPUserOIDCConfig` | Create iapuser oidcconfig<br>Required: `IdentityUrl`, `ClientId`, `AuthorizationEndpoint`, `ResponseType`, `ResponseMode`, `MappingFiled`, `IdentityKey` |

## Blocked destructive actions (1)

`ModifyIAPLoginSessionDuration` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iap`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240713` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iap"`) for the allow/block decision and reason.

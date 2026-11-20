---
name: tencent-ft
description: Tencent Cloud FT via the Tencent MCP server — 6 actions in API version v20200304 (1 read-only auto-allowed). Use for face, morph, cancel, cartoon, change, gender. Triggers on mentions of ft, face, morph, cancel, cartoon, change, gender, swap. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud FT

General service: 6 actions in API version `v20200304` — 1 read-only (auto-allowed), 4 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ft"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ft/v20200304 — action signatures in `ft_client.ts`, full request/response shapes in `ft_models.ts`.

## Read actions (auto-allowed, 1)

| Action | What it does |
|---|---|
| `QueryFaceMorphJob` | Query face morph job<br>Required: `JobId` |
## Mutations (gated — need allowlist, 4)

| Action | What it does |
|---|---|
| `SwapGenderPic` | Run swap gender pic<br>Required: `GenderInfos` |
| `MorphFace` | Run morph face |
| `ChangeAgePic` | Run change age pic<br>Required: `AgeInfos` |
| `FaceCartoonPic` | Run face cartoon pic |

## Blocked destructive actions (1)

`CancelFaceMorphJob` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ft`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200304` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ft"`) for the allow/block decision and reason.

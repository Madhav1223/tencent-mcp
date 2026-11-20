---
name: tencent-ams
description: Tencent Cloud AMS via the Tencent MCP server — 5 actions in API version v20201229 (2 read-only auto-allowed). Use for audio, moderation, cancel, sync. Triggers on mentions of ams, audio, moderation, cancel, sync. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud AMS

General service: 5 actions in API version `v20201229` — 2 read-only (auto-allowed), 2 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ams"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ams/v20201229 — action signatures in `ams_client.ts`, full request/response shapes in `ams_models.ts`.

## Read actions (auto-allowed, 2)

| Action | What it does |
|---|---|
| `DescribeTaskDetail` | Describe task detail<br>Required: `TaskId` |
| `DescribeTasks` | Describe tasks |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `CreateAudioModerationTask` | Create audio moderation task<br>Required: `Tasks` |
| `CreateAudioModerationSyncTask` | Create audio moderation sync task<br>Required: `BizType`, `DataId`, `FileFormat` (format `wav…`) |

## Blocked destructive actions (1)

`CancelTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ams`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201229` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ams"`) for the allow/block decision and reason.

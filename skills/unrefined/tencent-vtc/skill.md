---
name: tencent-vtc
description: Tencent Cloud VTC via the Tencent MCP server — 3 actions in API version v20240223 (1 read-only auto-allowed). Use for translate, video, confirm, submit. Triggers on mentions of vtc, translate, video, confirm, submit. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud VTC

Media & real-time communication: 3 actions in API version `v20240223` — 1 read-only (auto-allowed), 2 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vtc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vtc/v20240223 — action signatures in `vtc_client.ts`, full request/response shapes in `vtc_models.ts`.

## Read actions (auto-allowed, 1)

| Action | What it does |
|---|---|
| `DescribeVideoTranslateJob` | Describe video translate job<br>Required: `JobId` |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `SubmitVideoTranslateJob` | Submit video translate job<br>Required: `VideoUrl`, `SrcLang`, `DstLang` |
| `ConfirmVideoTranslateJob` | Confirm video translate job<br>Required: `JobId`, `TranslateResults` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vtc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240223` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vtc"`) for the allow/block decision and reason.

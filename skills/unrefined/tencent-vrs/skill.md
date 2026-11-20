---
name: tencent-vrs
description: Tencent Cloud VRS via the Tencent MCP server — 8 actions in API version v20200824 (5 read-only auto-allowed). Use for vrstask, vrsvoice, cancel, detect, download, quality. Triggers on mentions of vrs, vrstask, vrsvoice, cancel, detect, download, quality, sound, text. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud VRS

Media & real-time communication: 8 actions in API version `v20200824` — 5 read-only (auto-allowed), 2 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vrs"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vrs/v20200824 — action signatures in `vrs_client.ts`, full request/response shapes in `vrs_models.ts`.

## Read actions (auto-allowed, 5)

| Action | What it does |
|---|---|
| `GetVRSVoiceTypeInfo` | Get vrsvoice type info<br>Required: `VoiceType` |
| `DownloadVRSModel` | Download vrsmodel<br>Required: `TaskId` |
| `DescribeVRSTaskStatus` | Describe vrstask status<br>Required: `TaskId` |
| `GetVRSVoiceTypes` | Get vrsvoice types |
| `GetTrainingText` | Get training text |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `DetectEnvAndSoundQuality` | Detect env and sound quality<br>Required: `TextId`, `AudioData`, `TypeId` |
| `CreateVRSTask` | Create vrstask<br>Required: `SessionId`, `VoiceName`, `VoiceGender`, `VoiceLanguage`, `AudioIdList` |

## Blocked destructive actions (1)

`CancelVRSTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vrs`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200824` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vrs"`) for the allow/block decision and reason.

---
name: tencent-bizlive
description: Tencent Cloud BIZLIVE via the Tencent MCP server — 6 actions in API version v20190313 (2 read-only auto-allowed). Use for stream, forbid, game, live, play, register. Triggers on mentions of bizlive, stream, forbid, game, live, play, register, session, stop. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud BIZLIVE

Media & real-time communication: 6 actions in API version `v20190313` — 2 read-only (auto-allowed), 3 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bizlive"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bizlive/v20190313 — action signatures in `bizlive_client.ts`, full request/response shapes in `bizlive_models.ts`.

## Read actions (auto-allowed, 2)

| Action | What it does |
|---|---|
| `DescribeWorkers` | Describe workers |
| `DescribeStreamPlayInfoList` | Describe stream play info list<br>Required: `EndTime` (format `2019-04-28…`), `PlayDomain`, `StartTime` (format `2019-04-28…`) |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `ForbidLiveStream` | Forbid live stream<br>Required: `AppName`, `DomainName`, `StreamName` |
| `RegisterIM` | Register im<br>Required: `Nickname`, `UserId` |
| `CreateSession` | Create session<br>Required: `ClientSession`, `GameId`, `UserId` |

## Blocked destructive actions (1)

`StopGame` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bizlive`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190313` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bizlive"`) for the allow/block decision and reason.

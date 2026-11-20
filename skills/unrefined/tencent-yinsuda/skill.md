---
name: tencent-yinsuda
description: Tencent Cloud YINSUDA via the Tencent MCP server — 20 actions in API version v20220527 (13 read-only auto-allowed). Use for ktvmusic, ktvrobot, accompany, ktvmusics, live, recharge. Triggers on mentions of yinsuda, ktvmusic, ktvrobot, accompany, ktvmusics, live, recharge, segment, batch. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud YINSUDA

General service: 20 actions in API version `v20220527` — 13 read-only (auto-allowed), 6 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "yinsuda"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/yinsuda/v20220527 — action signatures in `yinsuda_client.ts`, full request/response shapes in `yinsuda_models.ts`.

## Read actions (auto-allowed, 13)

| Action | What it does |
|---|---|
| `DescribeKTVTags` | Describe ktvtags<br>Required: `AppName`, `UserId` |
| `DescribeKTVPlaylistDetail` | Describe ktvplaylist detail<br>Required: `AppName`, `UserId`, `PlaylistId` |
| `DescribeVipUserInfo` | Describe vip user info<br>Required: `AppName`, `UserId` |
| `DescribeKTVMusicAccompanySegmentUrlVip` | Describe ktvmusic accompany segment url vip<br>Required: `AppName`, `UserId`, `MusicId` |
| `DescribeKTVSuggestions` | Describe ktvsuggestions<br>Required: `AppName`, `UserId`, `KeyWord` |
| `DescribeUserInfo` | Describe user info<br>Required: `AppName`, `UserId` |
| `DescribeLiveVipTradeInfos` | Describe live vip trade infos<br>Required: `AppName` |
| `DescribeKTVPlaylists` | Describe ktvplaylists<br>Required: `AppName`, `UserId` |
| `DescribeKTVRobots` | Describe ktvrobots<br>Required: `AppName`, `UserId` |
| `DescribeKTVMusicAccompanySegmentUrl` | Describe ktvmusic accompany segment url<br>Required: `AppName`, `UserId`, `MusicId` |
| `DescribeKTVMatchMusics` | Describe ktvmatch musics<br>Required: `AppName`, `UserId`, `Rules` |
| `SearchKTVMusics` | Search ktvmusics<br>Required: `AppName`, `UserId`, `KeyWord` |
| `DescribeKTVMusicsByTag` | Describe ktvmusics by tag<br>Required: `AppName`, `UserId`, `TagId` |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `CreateKTVRobot` | Create ktvrobot<br>Required: `AppName`, `UserId`, `RTCSystem`, `JoinRoomInput` |
| `RechargeLiveVip` | Run recharge live vip<br>Required: `AppName`, `UserId`, `TradeSerialNo`, `RoomId`, `VipDays` |
| `RechargeVip` | Run recharge vip<br>Required: `AppName`, `UserId`, `RoomId`, `VipDays`, `AnchorId` |
| `BatchDescribeKTVMusicDetails` | Run batch describe ktvmusic details<br>Required: `AppName`, `UserId`, `MusicIds` |
| `ApplyChorus` | Run apply chorus<br>Required: `AppName`, `UserId`, `RoomId`, `MusicId` |
| `SyncKTVRobotCommand` | Sync ktvrobot command<br>Required: `AppName`, `UserId`, `RobotId`, `SyncRobotCommands` |

## Blocked destructive actions (1)

`DestroyKTVRobot` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `yinsuda`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220527` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="yinsuda"`) for the allow/block decision and reason.

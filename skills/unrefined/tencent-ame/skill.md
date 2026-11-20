---
name: tencent-ame
description: Tencent Cloud AME via the Tencent MCP server — 31 actions in API version v20190916 (23 read-only auto-allowed). Use for music, ktvmusic, ktvrobot, shelves, cloud, items. Triggers on mentions of ame, music, ktvmusic, ktvrobot, shelves, cloud, items, ktvsinger, auth. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud AME

General service: 31 actions in API version `v20190916` — 23 read-only (auto-allowed), 6 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ame"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ame/v20190916 — action signatures in `ame_client.ts`, full request/response shapes in `ame_models.ts`.

## Read actions (auto-allowed, 23)

| Action | What it does |
|---|---|
| `DescribePackages` | Describe packages |
| `DescribeLyric` | Describe lyric<br>Required: `ItemId` |
| `DescribeItems` | Describe items<br>Required: `Offset`, `Limit` |
| `DescribeAuthInfo` | Describe auth info |
| `DescribeCloudMusicPurchased` | Describe cloud music purchased<br>Required: `AuthInfoId` |
| `DescribePkgOfflineMusic` | Describe pkg offline music<br>Required: `PackageOrderId` |
| `DescribeKTVSingerMusics` | Describe ktvsinger musics<br>Required: `SingerId` |
| `DescribeMusic` | Describe music<br>Required: `ItemId`, `IdentityId` |
| `DescribeKTVSuggestions` | Describe ktvsuggestions<br>Required: `KeyWord` |
| `DescribeKTVMusicTags` | Describe ktvmusic tags |
| `DescribePackageItems` | Describe package items<br>Required: `OrderId` |
| `DescribeKTVPlaylists` | Describe ktvplaylists |
| `DescribeKTVTopList` | Describe ktvtop list |
| `DescribeKTVPlaylistDetail` | Describe ktvplaylist detail<br>Required: `PlaylistId` |
| `DescribeKTVSingerCategories` | Describe ktvsinger categories |
| `DescribeStations` | Describe stations<br>Required: `Limit`, `Offset` |
| `DescribeKTVMusicDetail` | Describe ktvmusic detail<br>Required: `MusicId` |
| `DescribeItemById` | Describe item by id<br>Required: `ItemIDs` |
| `DescribeMusicSaleStatus` | Describe music sale status<br>Required: `MusicIds`, `PurchaseType` |
| `DescribeKTVSingers` | Describe ktvsingers |
| `DescribeCloudMusic` | Describe cloud music<br>Required: `MusicId` |
| `DescribeKTVRobots` | Describe ktvrobots |
| `SearchKTVMusics` | Search ktvmusics<br>Required: `KeyWord`, `Offset` (default 0), `Limit` (default 50) |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `BatchDescribeKTVMusicDetails` | Run batch describe ktvmusic details<br>Required: `MusicIds` |
| `TakeMusicOffShelves` | Run take music off shelves<br>Required: `TakeMusicOffShelves` |
| `CreateKTVRobot` | Create ktvrobot<br>Required: `RTCSystem`, `JoinRoomInput` |
| `SyncKTVRobotCommand` | Sync ktvrobot command<br>Required: `RobotId`, `Command` |
| `ReportData` | Report data<br>Required: `ReportData` |
| `PutMusicOnTheShelves` | Put music on the shelves<br>Required: `MusicIds` |

## Blocked destructive actions (2)

`ModifyMusicOnShelves`, `DestroyKTVRobot` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ame`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190916` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ame"`) for the allow/block decision and reason.

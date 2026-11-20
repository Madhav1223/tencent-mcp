---
name: tencent-gme
description: Tencent Cloud GME via the Tencent MCP server — 38 actions in API version v20180711 (14 read-only auto-allowed). Use for scan, aiconversation, customization, voice, print, application. Triggers on mentions of gme, scan, aiconversation, customization, voice, print, application, detect, result. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud GME

Media & real-time communication: 38 actions in API version `v20180711` — 14 read-only (auto-allowed), 13 gated mutations, 11 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "gme"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/gme/v20180711 — action signatures in `gme_client.ts`, full request/response shapes in `gme_models.ts`.

## Read actions (auto-allowed, 14)

| Action | What it does |
|---|---|
| `DescribeRoomInfo` | Describe room info<br>Required: `SdkAppId` |
| `DescribeAuditResultExternal` | Describe audit result external<br>Required: `BizId`, `PageNo`, `PageSize`, `BeginTime`, `EndTime`, `MinRate`, `MaxRate`, `OpenId` |
| `GetCustomizationList` | Get customization list<br>Required: `BizId` |
| `DescribeUserInAndOutTime` | Describe user in and out time<br>Required: `BizId`, `RoomId`, `UserId` |
| `DescribeTaskInfo` | Describe task info<br>Required: `BizId`, `RoomId` |
| `DescribeApplicationData` | Describe application data<br>Required: `BizId`, `StartDate`, `EndDate` |
| `DescribeAIConversation` | Describe aiconversation |
| `DescribeAppStatistics` | Describe app statistics<br>Required: `BizId`, `StartDate`, `EndDate`, `Services` |
| `DescribeRealtimeScanConfig` | Describe realtime scan config<br>Required: `BizId` |
| `DescribeVoicePrint` | Describe voice print<br>Required: `DescribeMode` |
| `DescribeScanResultList` | Describe scan result list<br>Required: `BizId`, `TaskIdList` |
| `DescribeApplicationList` | Describe application list<br>Required: `ProjectId`, `PageNo` (default 0), `PageSize` (default 200), `SearchText` |
| `DescribeRecordInfo` | Describe record info<br>Required: `TaskId`, `BizId` |
| `DescribeAgeDetectTask` | Describe age detect task<br>Required: `BizId`, `TaskId` |
## Mutations (gated — need allowlist, 13)

| Action | What it does |
|---|---|
| `UpdateAIConversation` | Update aiconversation<br>Required: `TaskId` |
| `UpdateScanUsers` | Update scan users<br>Required: `BizId` |
| `UpdateScanRooms` | Update scan rooms<br>Required: `BizId` |
| `StartAIConversation` | Start aiconversation<br>Required: `SdkAppId`, `RoomId`, `AgentConfig` |
| `CreateCustomization` | Create customization<br>Required: `BizId`, `TextUrl` |
| `RegisterVoicePrint` | Register voice print<br>Required: `Audio`, `ReqTimestamp`, `AudioFormat`, `AudioName` |
| `CreateAgeDetectTask` | Create age detect task<br>Required: `BizId`, `Tasks` |
| `UpdateVoicePrint` | Update voice print<br>Required: `VoicePrintId`, `ReqTimestamp` |
| `ScanVoice` | Scan voice<br>Required: `BizId`, `Scenes`, `Live`, `Tasks` |
| `CreateScanUser` | Create scan user<br>Required: `BizId` |
| `CreateApp` | Create app<br>Required: `AppName` |
| `ControlAIConversation` | Run control aiconversation<br>Required: `TaskId`, `Command` |
| `StartRecord` | Start record<br>Required: `BizId`, `RoomId`, `RecordMode` |

## Blocked destructive actions (11)

`StopRecord`, `StopAIConversation`, `DeleteScanUser`, `DeleteVoicePrint`, `DeleteRoomMember`, `ModifyCustomization`, `ModifyRecordInfo`, `ModifyCustomizationState`, `ModifyUserMicStatus`, `DeleteCustomization`, `ModifyAppStatus` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `gme`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180711` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="gme"`) for the allow/block decision and reason.

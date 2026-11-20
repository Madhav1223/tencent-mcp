---
name: tencent-tiw
description: Tencent Cloud TIW via the Tencent MCP server — 35 actions in API version v20190919 (14 read-only auto-allowed). Use for callback, online, push, transcode, whiteboard, generation. Triggers on mentions of tiw, callback, online, push, transcode, whiteboard, generation, pptcheck, video. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud TIW

General service: 35 actions in API version `v20190919` — 14 read-only (auto-allowed), 19 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tiw"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tiw/v20190919 — action signatures in `tiw_client.ts`, full request/response shapes in `tiw_models.ts`.

## Read actions (auto-allowed, 14)

| Action | What it does |
|---|---|
| `DescribePPTCheckCallback` | Describe pptcheck callback<br>Required: `SdkAppId` |
| `DescribeTranscodeByUrl` | Describe transcode by url<br>Required: `SdkAppId`, `Url` |
| `DescribeOnlineRecord` | Describe online record<br>Required: `SdkAppId`, `TaskId` |
| `DescribeOnlineRecordCallback` | Describe online record callback<br>Required: `SdkAppId` |
| `DescribeWhiteboardPushCallback` | Describe whiteboard push callback<br>Required: `SdkAppId` |
| `DescribeVideoGenerationTaskCallback` | Describe video generation task callback<br>Required: `SdkAppId` |
| `DescribeWarningCallback` | Describe warning callback<br>Required: `SdkAppId` |
| `DescribeTranscode` | Describe transcode<br>Required: `SdkAppId`, `TaskId` |
| `DescribeRunningTasks` | Describe running tasks<br>Required: `SdkAppID`, `TaskType` |
| `DescribeTranscodeCallback` | Describe transcode callback<br>Required: `SdkAppId` |
| `DescribeWhiteboardPush` | Describe whiteboard push<br>Required: `SdkAppId`, `TaskId` |
| `DescribeVideoGenerationTask` | Describe video generation task<br>Required: `SdkAppId`, `TaskId` |
| `DescribePPTCheck` | Describe pptcheck<br>Required: `SdkAppId`, `TaskId` |
| `DescribeSnapshotTask` | Describe snapshot task<br>Required: `TaskID`, `SdkAppId` |
## Mutations (gated — need allowlist, 19)

| Action | What it does |
|---|---|
| `SetOnlineRecordCallback` | Set online record callback<br>Required: `SdkAppId`, `Callback` |
| `SetVideoGenerationTaskCallback` | Set video generation task callback<br>Required: `SdkAppId`, `Callback` |
| `CreateVideoGenerationTask` | Create video generation task<br>Required: `OnlineRecordTaskId`, `SdkAppId` |
| `SetOnlineRecordCallbackKey` | Set online record callback key<br>Required: `SdkAppId`, `CallbackKey` |
| `SetTranscodeCallback` | Set transcode callback<br>Required: `SdkAppId`, `Callback` |
| `ResumeOnlineRecord` | Resume online record<br>Required: `SdkAppId`, `TaskId` |
| `SetWarningCallback` | Set warning callback<br>Required: `SdkAppId`, `Callback`, `CallbackKey` |
| `SetTranscodeCallbackKey` | Set transcode callback key<br>Required: `SdkAppId`, `CallbackKey` |
| `SetPPTCheckCallbackKey` | Set pptcheck callback key<br>Required: `SdkAppId`, `CallbackKey` |
| `CreateSnapshotTask` | Create snapshot task<br>Required: `Whiteboard`, `SdkAppId`, `RoomId` |
| `SetPPTCheckCallback` | Set pptcheck callback<br>Required: `SdkAppId`, `Callback` |
| `StartWhiteboardPush` | Start whiteboard push<br>Required: `SdkAppId`, `RoomId` (1 | 4294967295; default RoomId), `PushUserId`, `PushUserSig` |
| `StartOnlineRecord` | Start online record<br>Required: `SdkAppId`, `RoomId` (1 | 4294967295; default RoomId), `RecordUserId` (format `tic_record_user_…`), `RecordUserSig` |
| `CreateTranscode` | Create transcode<br>Required: `SdkAppId`, `Url` |
| `SetWhiteboardPushCallback` | Set whiteboard push callback<br>Required: `SdkAppId`, `Callback` |
| `CreatePPTCheckTask` | Create pptcheck task<br>Required: `SdkAppId`, `Url` |
| `SetWhiteboardPushCallbackKey` | Set whiteboard push callback key<br>Required: `SdkAppId`, `CallbackKey` |
| `PauseOnlineRecord` | Pause online record<br>Required: `SdkAppId`, `TaskId` |
| `SetVideoGenerationTaskCallbackKey` | Set video generation task callback key<br>Required: `SdkAppId`, `CallbackKey` |

## Blocked destructive actions (2)

`StopOnlineRecord`, `StopWhiteboardPush` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tiw`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190919` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tiw"`) for the allow/block decision and reason.

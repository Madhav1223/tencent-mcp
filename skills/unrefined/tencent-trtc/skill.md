---
name: tencent-trtc
description: Tencent Cloud TRTC via the Tencent MCP server — 85 actions in API version v20190722 (36 read-only auto-allowed). Use for cloud, stream, moderation, room, usage, stop. Triggers on mentions of trtc, cloud, stream, moderation, room, usage, stop, vocab, recognize. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud TRTC

Media & real-time communication: 85 actions in API version `v20190722` — 36 read-only (auto-allowed), 28 gated mutations, 21 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "trtc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/trtc/v20190722 — action signatures in `trtc_client.ts`, full request/response shapes in `trtc_models.ts`.

## Read actions (auto-allowed, 36)

| Action | What it does |
|---|---|
| `DescribeTRTCRealTimeQualityData` | Describe trtcreal time quality data<br>Required: `SdkAppId`, `StartTime`, `EndTime` |
| `DescribeTrtcUsage` | Describe trtc usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeRoomInfo` | Describe room info<br>Required: `SdkAppId`, `StartTime`, `EndTime` |
| `DescribeWebRecord` | Describe web record |
| `DownloadRecognizeVocabV3` | Download recognize vocab v3 |
| `DescribeCallDetailInfo` | Describe call detail info<br>Required: `CommId`, `StartTime`, `EndTime`, `SdkAppId` |
| `DescribeStreamIngest` | Describe stream ingest<br>Required: `SdkAppId`, `TaskId` |
| `DescribeTRTCMarketScaleMetricData` | Describe trtcmarket scale metric data<br>Required: `SdkAppId`, `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `Period` |
| `DescribeRecordStatistic` | Describe record statistic<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeTRTCRealTimeScaleData` | Describe trtcreal time scale data<br>Required: `SdkAppId`, `StartTime`, `EndTime` |
| `DescribeAIConversation` | Describe aiconversation |
| `DescribeTRTCSegmentModerationUsage` | Describe trtcsegment moderation usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `Type`, `Business` |
| `DescribeLiveStreamModeration` | Describe live stream moderation<br>Required: `SdkAppId`, `TaskId` |
| `DescribeUserEvent` | Describe user event<br>Required: `CommId`, `StartTime`, `EndTime`, `UserId`, `RoomId`, `SdkAppId` |
| `DescribeTRTCMarketScaleData` | Describe trtcmarket scale data<br>Required: `SdkAppId`, `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `Period` |
| `DescribeCloudSliceTask` | Describe cloud slice task<br>Required: `SdkAppId`, `TaskId` |
| `DescribeScaleInfo` | Describe scale info<br>Required: `SdkAppId`, `StartTime`, `EndTime` |
| `DescribeCloudTranscription` | Describe cloud transcription<br>Required: `SdkAppId`, `TaskId` |
| `DescribeUserInfo` | Describe user info<br>Required: `CommId`, `StartTime`, `EndTime`, `SdkAppId` |
| `DescribeUnusualEvent` | Describe unusual event<br>Required: `SdkAppId`, `StartTime`, `EndTime` |
| `DescribeRecordingUsage` | Describe recording usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `MixType` |
| `DescribeAsyncTextToSpeech` | Describe async text to speech<br>Required: `TaskId` |
| `DescribeMixTranscodingUsage` | Describe mix transcoding usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeTrtcRoomUsage` | Describe trtc room usage<br>Required: `SdkAppid`, `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeTRTCDedicatedCloudAccUsage` | Describe trtcdedicated cloud acc usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeTrtcMcuTranscodeTime` | Describe trtc mcu transcode time<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeCloudRecording` | Describe cloud recording<br>Required: `SdkAppId`, `TaskId` |
| `DescribeRelayUsage` | Describe relay usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`) |
| `DescribeAITranscription` | Describe aitranscription<br>Required: `TaskId` |
| `DescribePicture` | Describe picture<br>Required: `SdkAppId` |
| `DescribeCloudModeration` | Describe cloud moderation<br>Required: `SdkAppId`, `TaskId` |
| `GetRecognizeVocabListV3` | Get recognize vocab list v3 |
| `DescribeTRTCMarketQualityData` | Describe trtcmarket quality data<br>Required: `SdkAppId`, `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `Period` |
| `DescribeTRTCAIRecognitionUsage` | Describe trtcairecognition usage<br>Required: `StartTime` (format `YYYY-MM-DD…`), `EndTime` (format `YYYY-MM-DD…`), `AuType` |
| `DescribeVoicePrint` | Describe voice print<br>Required: `DescribeMode` |
| `GetRecognizeVocabV3` | Get recognize vocab v3 |
## Mutations (gated — need allowlist, 28)

| Action | What it does |
|---|---|
| `CreateCloudModeration` | Create cloud moderation<br>Required: `SdkAppId`, `RoomId`, `UserId`, `ModerationParams`, `UserSig` |
| `UpdateVoicePrint` | Update voice print<br>Required: `VoicePrintId`, `ReqTimestamp` |
| `UpdateAIConversation` | Update aiconversation<br>Required: `TaskId` |
| `UpdateRecognizeVocabV3` | Update recognize vocab v3 |
| `SetVocabStateV3` | Set vocab state v3 |
| `StartMCUMixTranscodeByStrRoomId` | Start mcumix transcode by str room id<br>Required: `SdkAppId`, `StrRoomId`, `OutputParams`, `EncodeParams`, `LayoutParams` |
| `TextToSpeech` | Run text to speech<br>Required: `Text`, `Voice`, `SdkAppId` |
| `StartStreamIngest` | Start stream ingest<br>Required: `SdkAppId`, `RoomId`, `RoomIdType`, `UserId`, `UserSig` |
| `StartAIConversation` | Start aiconversation<br>Required: `SdkAppId`, `RoomId`, `AgentConfig` |
| `CreatePicture` | Create picture<br>Required: `SdkAppId`, `Content`, `Suffix`, `Height`, `Width`, `XPosition`, `YPosition` |
| `CreateLiveStreamModeration` | Create live stream moderation<br>Required: `SdkAppId`, `Input`, `LiveModerationParams` |
| `CreateRecognizeVocabV3` | Create recognize vocab v3<br>Required: `SdkAppId` |
| `StartPublishCdnStream` | Start publish cdn stream<br>Required: `SdkAppId`, `RoomId`, `RoomIdType`, `AgentParams`, `WithTranscoding` |
| `StartWebRecord` | Start web record<br>Required: `RecordUrl`, `StorageParams`, `SdkAppId` |
| `StartMCUMixTranscode` | Start mcumix transcode<br>Required: `SdkAppId`, `RoomId`, `OutputParams`, `EncodeParams`, `LayoutParams` |
| `StartAITranscription` | Start aitranscription<br>Required: `SdkAppId`, `RoomId`, `TranscriptionParams` |
| `RegisterVoicePrint` | Register voice print<br>Required: `Audio`, `ReqTimestamp`, `AudioFormat`, `AudioName` |
| `CreateCloudRecording` | Create cloud recording<br>Required: `SdkAppId`, `RoomId`, `UserId`, `UserSig`, `RecordParams`, `StorageParams` |
| `AsyncTextToSpeech` | Run async text to speech<br>Required: `Text`, `Voice`, `SdkAppId` |
| `DismissRoomByStrRoomId` | Dismiss room by str room id<br>Required: `SdkAppId`, `RoomId` |
| `CreateCloudTranscription` | Create cloud transcription<br>Required: `SdkAppId`, `RoomId`, `RoomIdType`, `TranscriptionParam`, `AsrParam` |
| `VoiceClone` | Run voice clone<br>Required: `SdkAppId`, `VoiceName`, `PromptAudio` |
| `DismissRoom` | Dismiss room<br>Required: `SdkAppId`, `RoomId` |
| `UpdatePublishCdnStream` | Update publish cdn stream<br>Required: `SdkAppId`, `TaskId`, `SequenceNumber`, `WithTranscoding` |
| `CreateCloudSliceTask` | Create cloud slice task<br>Required: `SdkAppId`, `RoomId`, `UserId`, `UserSig`, `SliceParams`, `SliceStorageParams` |
| `ControlAIConversation` | Run control aiconversation<br>Required: `TaskId`, `Command` |
| `UpdateStreamIngest` | Update stream ingest<br>Required: `SdkAppId`, `TaskId` |
| `TextToSpeechSSE` | Run text to speech sse<br>Required: `Text`, `Voice`, `SdkAppId` |

## Blocked destructive actions (21)

`StopWebRecord`, `ModifyPicture`, `StopMCUMixTranscodeByStrRoomId`, `RemoveUserByStrRoomId`, `DeleteRecognizeVocabV3`, `DeletePicture`, `RemoveUser`, `ModifyCloudRecording`, `DeleteCloudTranscription`, `ModifyCloudModeration`, `StopPublishCdnStream`, `DeleteCloudModeration`, `DeleteLiveStreamModeration`, `ModifyCloudSliceTask`, `StopStreamIngest`, `DeleteCloudSliceTask`, `DeleteVoicePrint`, `DeleteCloudRecording`, `StopAIConversation`, `StopAITranscription`, `StopMCUMixTranscode` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `trtc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190722` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="trtc"`) for the allow/block decision and reason.

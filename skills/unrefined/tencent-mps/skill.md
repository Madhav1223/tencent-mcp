---
name: tencent-mps
description: Tencent Cloud MPS via the Tencent MCP server — 229 actions in API version v20190612 (76 read-only auto-allowed). Use for stream, template, package, link, assembly, linear. Triggers on mentions of mps, stream, template, package, link, assembly, linear, templates, image. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud MPS

Media & real-time communication: 229 actions in API version `v20190612` — 76 read-only (auto-allowed), 83 gated mutations, 70 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mps"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mps/v20190612 — action signatures in `mps_client.ts`, full request/response shapes in `mps_models.ts`.

## Read actions (auto-allowed, 76)

| Action | What it does |
|---|---|
| `DescribeAsrHotwords` | Describe asr hotwords |
| `DescribeStreamLinkFlowRealtimeStatus` | Describe stream link flow realtime status<br>Required: `FlowId` |
| `DescribeBatchTaskDetail` | Describe batch task detail<br>Required: `TaskId` |
| `DescribeStreamLinkEvent` | Describe stream link event<br>Required: `EventId` |
| `DescribeAIAnalysisTemplates` | Describe aianalysis templates |
| `DescribeTaskDetail` | Describe task detail<br>Required: `TaskId` |
| `DescribeWordSamples` | Describe word samples |
| `DescribeSampleSnapshotTemplates` | Describe sample snapshot templates |
| `DescribeStreamLinkFlowStatistics` | Describe stream link flow statistics<br>Required: `FlowId`, `Type`, `InputOutputId`, `Pipeline`, `Period`, `StartTime`, `EndTime` (default StartTime) |
| `DescribeLiveRecordTemplates` | Describe live record templates |
| `DescribeAsrHotwordsList` | Describe asr hotwords list |
| `DescribeTasks` | Describe tasks<br>Required: `Status` |
| `DescribeStreamPackageLinearAssemblyProgramSchedules` | Describe stream package linear assembly program schedules<br>Required: `ChannelId` |
| `DescribeStreamPackageSSAIChannels` | Describe stream package ssaichannels |
| `DescribeStreamPackageSourceLocation` | Describe stream package source location<br>Required: `Id` |
| `DescribeAigcTaskStatus` | Describe aigc task status<br>Required: `TaskId` |
| `DescribeImageTasks` | Describe image tasks<br>Required: `Status` |
| `DescribeStreamPackageLinearAssemblyUsage` | Describe stream package linear assembly usage |
| `DescribeImageTaskDetail` | Describe image task detail<br>Required: `TaskId` |
| `DescribeStreamPackageLinearAssemblyProgram` | Describe stream package linear assembly program<br>Required: `Id` |
| `DescribeGroupAttachFlowsById` | Describe group attach flows by id |
| `DescribeMediaMetaData` | Describe media meta data<br>Required: `InputInfo` |
| `DescribeVideoSearchTaskDetail` | Describe video search task detail<br>Required: `TaskId` |
| `DescribeStreamLinkFlows` | Describe stream link flows |
| `DescribeVoices` | Describe voices |
| `DescribeStreamPackageSSAIUsage` | Describe stream package ssaiusage |
| `DescribeStreamPackageLinearAssemblyChannel` | Describe stream package linear assembly channel<br>Required: `Id` |
| `DescribeTranscodeTemplates` | Describe transcode templates |
| `DescribeSSAIActivateState` | Describe ssaiactivate state |
| `DescribeSmartEraseTemplates` | Describe smart erase templates |
| `DescribeStreamLinkRegions` | Describe stream link regions |
| `DescribeSchedules` | Describe schedules |
| `DescribeDesignTask` | Describe design task<br>Required: `TaskId` |
| `DescribeStreamLinkSecurityGroups` | Describe stream link security groups |
| `DescribeStreamPackageLinearAssemblyChannels` | Describe stream package linear assembly channels |
| `DescribeStreamLinkEventAttachedFlows` | Describe stream link event attached flows<br>Required: `EventId` |
| `DescribeSmartSubtitleTemplates` | Describe smart subtitle templates |
| `DescribeStreamPackageSource` | Describe stream package source<br>Required: `Id` |
| `DescribeSnapshotByTimeOffsetTemplates` | Describe snapshot by time offset templates |
| `DescribeContentReviewTemplates` | Describe content review templates |
| `DescribeStreamLinkEvents` | Describe stream link events |
| `DescribeStreamLinkFlowSRTStatistics` | Describe stream link flow srtstatistics<br>Required: `FlowId`, `Type`, `InputOutputId`, `Pipeline`, `StartTime`, `EndTime` (default StartTime), `Period` |
| `DescribeStreamPackageLinearAssemblyPrograms` | Describe stream package linear assembly programs |
| `DescribeStreamLinkActivateState` | Describe stream link activate state |
| `DescribeAgentRecordTask` | Describe agent record task<br>Required: `TaskId` |
| `DescribePersonSamples` | Describe person samples |
| `DescribeStreamPackageSourceAlerts` | Describe stream package source alerts<br>Required: `SourceId` |
| `DescribeAigcVideoTask` | Describe aigc video task<br>Required: `TaskId` |
| `DescribeStreamPackageSources` | Describe stream package sources |
| `DescribeVideoDatabaseEntryTaskDetail` | Describe video database entry task detail<br>Required: `TaskId` |
| `DescribeWorkflows` | Describe workflows |
| `DescribeStreamPackageLinearAssemblyChannelAlerts` | Describe stream package linear assembly channel alerts<br>Required: `ChannelId` |
| `QueryProject` | Query project |
| `DescribeStreamPackageActivateState` | Describe stream package activate state |
| `DescribeAdaptiveDynamicStreamingTemplates` | Describe adaptive dynamic streaming templates |
| `DescribeUsageData` | Describe usage data<br>Required: `StartTime`, `EndTime` (format `2019-07-16T06…`) |
| `DescribeAigcImageTask` | Describe aigc image task<br>Required: `TaskId` |
| `DescribeImageSpriteTemplates` | Describe image sprite templates |
| `DescribeCloneViralTask` | Describe clone viral task<br>Required: `TaskId` |
| `DescribeWatermarkTemplates` | Describe watermark templates |
| `DescribeAIRecognitionTemplates` | Describe airecognition templates |
| `DescribeBlindWatermarkTemplates` | Describe blind watermark templates |
| `DescribeAigcAudioTask` | Describe aigc audio task<br>Required: `TaskId` |
| `DescribeTextToSpeechAsyncTask` | Describe text to speech async task<br>Required: `TaskId` |
| `DescribeStreamLinkFlow` | Describe stream link flow<br>Required: `FlowId` |
| `DescribeSubtitleEmbedTemplates` | Describe subtitle embed templates |
| `DescribeAnimatedGraphicsTemplates` | Describe animated graphics templates |
| `QueryHunyuan3DTask` | Query hunyuan3 dtask |
| `DescribeStreamLinkFlowMediaStatistics` | Describe stream link flow media statistics<br>Required: `FlowId`, `Type`, `InputOutputId`, `Pipeline`, `Period`, `StartTime`, `EndTime` (default StartTime) |
| `DescribeStreamPackageSourceLocations` | Describe stream package source locations |
| `DescribeQualityControlTemplates` | Describe quality control templates |
| `DescribeProcessImageTemplates` | Describe process image templates |
| `DescribeAigcTaskList` | Describe aigc task list |
| `DescribeStreamLinkFlowLogs` | Describe stream link flow logs<br>Required: `FlowId`, `StartTime`, `EndTime` (default StartTime), `Type`, `Pipeline`, `PageSize` (default 100) |
| `DescribeMDPMPSUserInfo` | Describe mdpmpsuser info |
| `DescribeStreamPackageSSAIChannel` | Describe stream package ssaichannel<br>Required: `ID` |
## Mutations (gated — need allowlist, 83)

| Action | What it does |
|---|---|
| `CreateSnapshotByTimeOffsetTemplate` | Create snapshot by time offset template |
| `CreateAnimatedGraphicsTemplate` | Create animated graphics template<br>Required: `Fps` (unit: Hz) |
| `EditMedia` | Run edit media<br>Required: `FileInfos`, `OutputStorage`, `OutputObjectPath` |
| `CreateAigcImageTask` | Create aigc image task |
| `CreateAiFissionTask` | Create ai fission task<br>Required: `Input` |
| `CloneVoice` | Clone voice |
| `ParseLiveStreamProcessNotification` | Run parse live stream process notification<br>Required: `Content` |
| `CloneViral` | Clone viral<br>Required: `VideoUrl`, `Product` |
| `CreateStreamPackageSource` | Create stream package source<br>Required: `AttachedLocation`, `Name`, `Type` (Live | VOD) |
| `ProcessMedia` | Run process media<br>Required: `InputInfo` |
| `CreateAdaptiveDynamicStreamingTemplate` | Create adaptive dynamic streaming template<br>Required: `Format` (HLS | MPEG-DASH), `StreamInfos` |
| `DisableWorkflow` | Disable workflow<br>Required: `WorkflowId` |
| `BatchDeleteStreamLinkFlow` | Run batch delete stream link flow<br>Required: `EventId` |
| `EnableWorkflow` | Enable workflow<br>Required: `WorkflowId` |
| `ChangeVoice` | Run change voice |
| `BatchStartStreamLinkFlow` | Run batch start stream link flow<br>Required: `EventId` |
| `CreateTranscodeTemplate` | Create transcode template<br>Required: `Container` (mp4 | flv | hls | ts | webm | mkv | mxf | mov) |
| `DetectVideoSubtitleArea` | Detect video subtitle area<br>Required: `InputInfo` |
| `CreateStreamLinkFlow` | Create stream link flow<br>Required: `FlowName`, `MaxBandwidth` |
| `CreateAgentRecordTask` | Create agent record task<br>Required: `LiveRoomUrl`, `MaxDurationMinutes` (unit: 720), `StoreCosParam` |
| `UpdateProject` | Update project<br>Required: `ProjectId` |
| `ExecuteFunction` | Execute function<br>Required: `FunctionName`, `FunctionArg` |
| `RecognizeAudio` | Recognize audio<br>Required: `AudioData` |
| `BatchProcessMedia` | Run batch process media<br>Required: `InputInfo` |
| `DetectVideoWatermark` | Detect video watermark<br>Required: `InputInfo` |
| `CreateContentReviewTemplate` | Create content review template |
| `CreateSampleSnapshotTemplate` | Create sample snapshot template<br>Required: `SampleType`, `SampleInterval` |
| `RecognizeMediaForZhiXue` | Recognize media for zhi xue<br>Required: `InputInfo` |
| `DesignVoiceAsync` | Run design voice async<br>Required: `Prompt` |
| `StartStreamPackageLinearAssemblyChannel` | Start stream package linear assembly channel<br>Required: `Id` |
| `SubmitHunyuan3DTask` | Submit hunyuan3 dtask |
| `CreateSubtitleEmbedTemplate` | Create subtitle embed template<br>Required: `Name` |
| `CreateMediaEvaluation` | Create media evaluation<br>Required: `InputInfo`, `EvaluationTask` |
| `CreateQualityControlTemplate` | Create quality control template<br>Required: `Name`, `QualityControlItemSet` |
| `CreateStreamPackageLinearAssemblyChannel` | Create stream package linear assembly channel<br>Required: `Name` |
| `StartStreamLinkFlow` | Start stream link flow<br>Required: `FlowId` |
| `ProcessImage` | Run process image |
| `CreateStreamPackageSourceLocation` | Create stream package source location<br>Required: `Name`, `BaseUrl` |
| `CreateStreamPackageLinearAssemblyProgram` | Create stream package linear assembly program<br>Required: `Name`, `AttachedChannel` |
| `CreateSmartSubtitleTemplate` | Create smart subtitle template<br>Required: `Name`, `VideoSrcLanguage`, `SubtitleType` |
| `TextToSpeech` | Run text to speech<br>Required: `Text`, `VoiceId` |
| `CreateVideoRedrawTask` | Create video redraw task<br>Required: `Input` |
| `CreateLiveRecordTemplate` | Create live record template |
| `CreateProject` | Create project<br>Required: `ProjectName` |
| `CreateBlindWatermarkTemplate` | Create blind watermark template<br>Required: `Type`, `TextContent` |
| `CreateAIAnalysisTemplate` | Create aianalysis template |
| `CreateStreamPackageSSAIChannel` | Create stream package ssaichannel<br>Required: `Name`, `ContentSource`, `SSAIInfo` |
| `CreateStreamLinkOutputInfo` | Create stream link output info<br>Required: `FlowId`, `Output` |
| `EmbeddingData` | Run embedding data<br>Required: `Model`, `Files` |
| `CreateVideoSearchTask` | Create video search task<br>Required: `SearchValueInput` |
| `ExtractBlindWatermark` | Run extract blind watermark<br>Required: `Type`, `InputInfo` |
| `CreateImageSpriteTemplate` | Create image sprite template<br>Required: `SampleType`, `SampleInterval`, `RowCount`, `ColumnCount` |
| `CreateAigcVideoTask` | Create aigc video task |
| `CreateVideoDatabaseEntryTask` | Create video database entry task<br>Required: `InputInfo` |
| `ManageTask` | Run manage task<br>Required: `OperationType`, `TaskId` |
| `CreateAiDramaTask` | Create ai drama task<br>Required: `Input` |
| `CreateWordSamples` | Create word samples<br>Required: `Usages`, `Words` |
| `CreateWorkflow` | Create workflow<br>Required: `WorkflowName`, `Trigger` |
| `TextToSpeechAsync` | Run text to speech async<br>Required: `Text`, `VoiceId` |
| `CreateProcessImageTemplate` | Create process image template<br>Required: `ProcessImageTemplate` |
| `CreateSchedule` | Create schedule<br>Required: `ScheduleName`, `Trigger`, `Activities` |
| `CreateWatermarkTemplate` | Create watermark template<br>Required: `Type` |
| `CreateAigcAudioTask` | Create aigc audio task |
| `ParseNotification` | Run parse notification<br>Required: `Content` |
| `ActivateSSAI` | Activate ssai |
| `WithdrawsWatermark` | Run withdraws watermark<br>Required: `InputInfo` |
| `UpdateVoice` | Update voice<br>Required: `VoiceId`, `VoiceFields` |
| `CreateDocToVideoTask` | Create doc to video task<br>Required: `Input` |
| `EnableSchedule` | Enable schedule<br>Required: `ScheduleId` |
| `ProcessLiveStream` | Run process live stream<br>Required: `Url`, `TaskNotifyConfig` |
| `TextTranslation` | Run text translation<br>Required: `SourceText`, `Source`, `Target` |
| `ActivateStreamPackage` | Activate stream package |
| `CreateAsrHotwords` | Create asr hotwords<br>Required: `Type`, `Name` |
| `CreateStreamLinkEvent` | Create stream link event<br>Required: `EventName` |
| `CreatePersonSample` | Create person sample<br>Required: `Name`, `Usages` |
| `CreateStreamLinkSecurityGroup` | Create stream link security group<br>Required: `Name`, `Whitelist` |
| `SyncDubbing` | Sync dubbing |
| `DisableSchedule` | Disable schedule<br>Required: `ScheduleId` |
| `CreateStreamLinkInput` | Create stream link input<br>Required: `FlowId` |
| `DisassociateSecurityGroup` | Run disassociate security group |
| `CreateSmartEraseTemplate` | Create smart erase template<br>Required: `Name`, `EraseType` |
| `CreateAIRecognitionTemplate` | Create airecognition template |
| `BatchStopStreamLinkFlow` | Run batch stop stream link flow<br>Required: `EventId` |

## Blocked destructive actions (70)

`DeleteWatermarkTemplate`, `ModifyLiveRecordTemplate`, `DeleteVoice`, `DeletePersonSample`, `DeleteSmartSubtitleTemplate`, `ModifyStreamPackageSourceLocation`, `DeleteTranscodeTemplate`, `ModifyAIAnalysisTemplate`, `DeleteAdaptiveDynamicStreamingTemplate`, `DeleteAsrHotwords`, `ModifyStreamLinkFlow`, `DeleteSubtitleEmbedTemplate`, `DeleteStreamPackageSourceLocation`, `DeleteStreamPackageLinearAssemblyChannels`, `DeleteContentReviewTemplate`, `DeleteProcessImageTemplate`, `ModifyProcessImageTemplate`, `DeleteStreamPackageLinearAssemblyChannel`, `ModifyAnimatedGraphicsTemplate`, `DeleteStreamLinkOutput`, `DeleteStreamPackageSource`, `DeleteAIAnalysisTemplate`, `ModifySchedule`, `ModifyStreamLinkSecurityGroup`, `ModifyWordSample`, `ModifyStreamLinkOutputInfo`, `ModifySampleSnapshotTemplate`, `ModifySmartSubtitleTemplate`, `ResetWorkflow`, `DeleteQualityControlTemplate`, `DeleteWorkflow`, `ModifyImageSpriteTemplate`, `DeleteStreamLinkFlow`, `ModifyStreamLinkInput`, `ModifySmartEraseTemplate`, `ModifyPersonSample`, `StopStreamPackageLinearAssemblyChannel`, `DeleteAnimatedGraphicsTemplate`, `DeleteStreamLinkSecurityGroup`, `ModifySubtitleEmbedTemplate`, `ModifyQualityControlTemplate`, `StopStreamLinkFlow`, `ModifyAIRecognitionTemplate`, `ModifyTranscodeTemplate`, `ModifyAsrHotwords`, `DeleteBlindWatermarkTemplate`, `ModifyWatermarkTemplate`, `DeleteAIRecognitionTemplate`, `DeleteWordSamples`, `ModifyBlindWatermarkTemplate`, `ModifySnapshotByTimeOffsetTemplate`, `ModifyStreamLinkEvent`, `ModifyStreamPackageLinearAssemblyProgram`, `ModifyStreamPackageSource`, `DeleteSmartEraseTemplate`, `ModifyAdaptiveDynamicStreamingTemplate`, `DeleteStreamPackageLinearAssemblyProgram`, `DeleteStreamPackageSSAIChannel`, `DeleteSnapshotByTimeOffsetTemplate`, `ModifyStreamPackageSSAIChannel`, `DeleteLiveRecordTemplate`, `DeleteProject`, `DeleteSampleSnapshotTemplate`, `ModifyStreamPackageLinearAssemblyChannel`, `DeleteStreamPackageLinearAssemblyPrograms`, `ModifyContentReviewTemplate`, `DeleteSchedule`, `DeleteStreamLinkEvent`, `DeleteStreamPackageLinearAssemblyProgramsByChannel`, `DeleteImageSpriteTemplate` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mps`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190612` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mps"`) for the allow/block decision and reason.

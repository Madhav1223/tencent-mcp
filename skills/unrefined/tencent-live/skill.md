---
name: tencent-live
description: Tencent Cloud LIVE via the Tencent MCP server — 231 actions in API version v20180801 (104 read-only auto-allowed). Use for live, stream, caster, template, avatar, domain. Triggers on mentions of live, live, stream, caster, template, avatar, domain, play, pull. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud LIVE

Media & real-time communication: 231 actions in API version `v20180801` — 104 read-only (auto-allowed), 61 gated mutations, 66 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "live"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/live/v20180801 — action signatures in `live_client.ts`, full request/response shapes in `live_models.ts`.

## Read actions (auto-allowed, 104)

| Action | What it does |
|---|---|
| `DescribeCasterList` | Describe caster list |
| `DescribeLiveAvatarScripts` | Describe live avatar scripts<br>Required: `RoomId` |
| `DescribeLiveWatermarks` | Describe live watermarks |
| `DescribeConcurrentRecordStreamNum` | Describe concurrent record stream num<br>Required: `LiveType`, `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeRecordTask` | Describe record task<br>Required: `StartTime`, `EndTime` |
| `DescribeLiveStreamEventList` | Describe live stream event list<br>Required: `StartTime`, `EndTime` |
| `DescribeHttpStatusInfoList` | Describe http status info list<br>Required: `StartTime`, `EndTime` |
| `DescribeProvinceIspPlayInfoList` | Describe province isp play info list<br>Required: `StartTime`, `EndTime`, `Granularity`, `StatType` |
| `DescribeStreamPushInfoList` | Describe stream push info list<br>Required: `StreamName`, `StartTime`, `EndTime` |
| `DescribeLiveSnapshotRules` | Describe live snapshot rules |
| `DescribeLiveCloudEffectList` | Describe live cloud effect list |
| `DescribeTimeShiftStreamList` | Describe time shift stream list<br>Required: `StartTime`, `EndTime` |
| `DescribeLiveSnapshotTemplates` | Describe live snapshot templates |
| `DescribeLiveDomainReferer` | Describe live domain referer<br>Required: `DomainName` |
| `DescribeLiveTimeShiftWriteSizeInfoList` | Describe live time shift write size info list<br>Required: `StartTime`, `EndTime` |
| `DescribeTopClientIpSumInfoList` | Describe top client ip sum info list<br>Required: `StartTime`, `EndTime` |
| `DescribeCasterOutputInfos` | Describe caster output infos<br>Required: `CasterId` |
| `DescribeOriginStreamInfo` | Describe origin stream info<br>Required: `DomainName` |
| `DescribeLiveRecordTemplates` | Describe live record templates |
| `DescribeVisitTopSumInfoList` | Describe visit top sum info list<br>Required: `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`), `TopIndex` |
| `DescribeLiveDomainCert` | Describe live domain cert<br>Required: `DomainName` |
| `DescribeAreaBillBandwidthAndFluxList` | Describe area bill bandwidth and flux list<br>Required: `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`) |
| `DescribeCasterMarkWordInfos` | Describe caster mark word infos<br>Required: `CasterId` |
| `DescribeDeliverBandwidthList` | Describe deliver bandwidth list<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeLiveStreamOnlineList` | Describe live stream online list |
| `DescribeCasterPlayUrl` | Describe caster play url<br>Required: `CasterId`, `PlayUrlType` |
| `DescribeLivePushAuthKey` | Describe live push auth key<br>Required: `DomainName` |
| `DescribeTimeShiftRecordDetail` | Describe time shift record detail<br>Required: `Domain`, `AppName`, `StreamName`, `StartTime`, `EndTime` |
| `DescribeLiveRecordTemplate` | Describe live record template<br>Required: `TemplateId` |
| `DescribeLiveTranscodeTemplate` | Describe live transcode template<br>Required: `TemplateId` |
| `DescribeMonitorReport` | Describe monitor report<br>Required: `MonitorId` |
| `DescribePullStreamConfigs` | Describe pull stream configs |
| `DescribeLiveStreamMonitor` | Describe live stream monitor<br>Required: `MonitorId` |
| `DescribeLiveCloudEffectConfig` | Describe live cloud effect config |
| `DescribeLiveDomainCertBindings` | Describe live domain cert bindings |
| `DescribePlayErrorCodeSumInfoList` | Describe play error code sum info list<br>Required: `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`) |
| `DescribeUploadStreamNums` | Describe upload stream nums<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeStreamDayPlayInfoList` | Describe stream day play info list<br>Required: `DayTime` (format `YYYY-mm-dd…`) |
| `DescribeLivePadStreamList` | Describe live pad stream list |
| `DescribeLiveTranscodeTotalInfo` | Describe live transcode total info<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeLiveTranscodeDetailInfo` | Describe live transcode detail info |
| `DescribeLiveWatermark` | Describe live watermark<br>Required: `WatermarkId` |
| `DescribeLiveCert` | Describe live cert<br>Required: `CertId` |
| `DescribeDeliverLogDownList` | Describe deliver log down list<br>Required: `StartTime`, `EndTime`, `DeliverDomains` |
| `DescribeLiveEnhanceInfoList` | Describe live enhance info list<br>Required: `StartTime`, `EndTime` |
| `DescribePullTransformPushInfo` | Describe pull transform push info<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeLiveDomains` | Describe live domains |
| `DescribeCasterLayoutInfos` | Describe caster layout infos<br>Required: `CasterId` |
| `DescribeSceneVideoTask` | Describe scene video task<br>Required: `TaskId` |
| `DescribeCasterMarkPicInfos` | Describe caster mark pic infos<br>Required: `CasterId` |
| `DescribeLiveCallbackTemplate` | Describe live callback template<br>Required: `TemplateId` |
| `DescribeGroupProIspPlayInfoList` | Describe group pro isp play info list<br>Required: `StartTime`, `EndTime` |
| `DescribePullTransformPushInfoList` | Describe pull transform push info list<br>Required: `StartTime`, `EndTime`, `TaskId` |
| `DescribeLivePullStreamTaskStatus` | Describe live pull stream task status<br>Required: `TaskId` |
| `DescribeLiveSnapshotTemplate` | Describe live snapshot template<br>Required: `TemplateId` |
| `DescribeLiveCallbackTemplates` | Describe live callback templates |
| `DescribeAIGCTaskStatus` | Describe aigctask status<br>Required: `TaskId` |
| `DescribeLivePadTemplate` | Describe live pad template<br>Required: `TemplateId` |
| `DescribeScreenShotSheetNumList` | Describe screen shot sheet num list<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeLiveAvatarImageList` | Describe live avatar image list |
| `DescribeLogDownloadList` | Describe log download list<br>Required: `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`), `PlayDomains` |
| `DescribeLiveTimeShiftTemplates` | Describe live time shift templates |
| `DescribeLiveRecordRules` | Describe live record rules |
| `DescribeLiveXP2PDetailInfoList` | Describe live xp2 pdetail info list |
| `DescribeLiveDelayInfoList` | Describe live delay info list |
| `DescribeLiveTimeShiftRules` | Describe live time shift rules |
| `DescribeLiveDomain` | Describe live domain<br>Required: `DomainName` |
| `DescribeLiveAvatarBackgroundList` | Describe live avatar background list |
| `DescribeStreamPlayInfoList` | Describe stream play info list<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeLiveCallbackRules` | Describe live callback rules |
| `DescribePlayErrorCodeDetailInfoList` | Describe play error code detail info list<br>Required: `StartTime`, `EndTime`, `Granularity`, `StatType` |
| `DescribeLiveTimeShiftBillInfoList` | Describe live time shift bill info list<br>Required: `StartTime`, `EndTime` |
| `DescribeLiveStreamPublishedList` | Describe live stream published list<br>Required: `DomainName`, `EndTime`, `StartTime` |
| `DescribeScreenshotTask` | Describe screenshot task<br>Required: `StartTime`, `EndTime` |
| `DescribePushBandwidthAndFluxList` | Describe push bandwidth and flux list<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeCasterEmergencyStatus` | Describe caster emergency status<br>Required: `CasterId` |
| `DescribeLiveDomainPlayInfoList` | Describe live domain play info list |
| `DescribeCallbackRecordsList` | Describe callback records list<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`), `StreamName`, `PageNum`, `PageSize` |
| `DescribeLiveTranscodeTemplates` | Describe live transcode templates |
| `DescribeBillBandwidthAndFluxList` | Describe bill bandwidth and flux list<br>Required: `StartTime` (format `1…`), `EndTime` (format `1…`) |
| `DescribeLivePadTemplates` | Describe live pad templates |
| `DescribeLiveAvatarTimbreList` | Describe live avatar timbre list |
| `DescribeLiveAvatarTemporaryScriptList` | Describe live avatar temporary script list<br>Required: `RoomId` |
| `DescribeLiveWatermarkRules` | Describe live watermark rules |
| `DescribeLivePadRules` | Describe live pad rules |
| `DescribeLiveStreamMonitorList` | Describe live stream monitor list<br>Required: `Index`, `Count` |
| `DescribeAuditKeywords` | Describe audit keywords<br>Required: `Offset`, `Limit`, `LibId`, `Content` |
| `DescribeLivePullStreamTasks` | Describe live pull stream tasks |
| `DescribeProIspPlaySumInfoList` | Describe pro isp play sum info list<br>Required: `StartTime`, `EndTime`, `StatType` (CountryOrArea) |
| `DescribeAllStreamPlayInfoList` | Describe all stream play info list<br>Required: `QueryTime` (format `1…`) |
| `DescribeLivePlayAuthKey` | Describe live play auth key<br>Required: `DomainName` |
| `DescribeCasterTransitionTypes` | Describe caster transition types<br>Required: `CasterId` |
| `DescribeLiveAvatarRooms` | Describe live avatar rooms |
| `DescribeCasterDisplayInfo` | Describe caster display info<br>Required: `CasterId` |
| `DescribeCasterUserStatus` | Describe caster user status |
| `DescribeLiveStreamState` | Describe live stream state<br>Required: `AppName` (default live), `DomainName`, `StreamName` |
| `DescribeCasterInputInfos` | Describe caster input infos<br>Required: `CasterId` |
| `DescribeBackupStreamList` | Describe backup stream list |
| `DescribeLiveCerts` | Describe live certs |
| `DescribeLiveTranscodeRules` | Describe live transcode rules |
| `DescribeCaster` | Describe caster<br>Required: `CasterId` |
| `DescribeLivePackageInfo` | Describe live package info<br>Required: `PackageType` |
| `DescribeTranscodeTaskNum` | Describe transcode task num<br>Required: `StartTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`) |
| `DescribeLiveStreamPushInfoList` | Describe live stream push info list |
## Mutations (gated — need allowlist, 61)

| Action | What it does |
|---|---|
| `CreateLiveRecord` | Create live record<br>Required: `StreamName` |
| `UpdateLiveWatermark` | Update live watermark<br>Required: `WatermarkId`, `PictureUrl`, `XPosition` (default 0), `YPosition` (default 0) |
| `CreateLiveWatermarkRule` | Create live watermark rule<br>Required: `DomainName`, `AppName` (default live), `StreamName`, `TemplateId` |
| `CreateCommonMixStream` | Create common mix stream<br>Required: `MixStreamSessionId`, `InputStreamList`, `OutputParams` |
| `StartLiveStreamMonitor` | Start live stream monitor<br>Required: `MonitorId` |
| `StartLiveAvatarRoom` | Start live avatar room<br>Required: `RoomId`, `Comment`, `ToUrl` |
| `AddCasterInputInfo` | Add caster input info<br>Required: `CasterId`, `InputInfo` |
| `CreateLivePadTemplate` | Create live pad template<br>Required: `TemplateName`, `Url` |
| `CreateAuditKeywordLib` | Create audit keyword lib<br>Required: `Name`, `Description`, `Suggestion`, `MatchType` |
| `CreateCasterInputPushUrl` | Create caster input push url<br>Required: `CasterId`, `InputIndex` |
| `CreateScreenshotTask` | Create screenshot task<br>Required: `StreamName`, `DomainName`, `AppName`, `EndTime`, `TemplateId` |
| `AuthenticateDomainOwner` | Run authenticate domain owner<br>Required: `DomainName`, `VerifyType` |
| `AddCasterLayoutInfo` | Add caster layout info<br>Required: `CasterId`, `LayoutInfo` |
| `AddLiveWatermark` | Add live watermark<br>Required: `PictureUrl`, `WatermarkName` |
| `CreateLiveSnapshotTemplate` | Create live snapshot template<br>Required: `TemplateName`, `CosAppId`, `CosBucket`, `CosRegion` |
| `EnableOptimalSwitching` | Enable optimal switching<br>Required: `StreamName` |
| `AddCasterMarkWordInfo` | Add caster mark word info<br>Required: `CasterId`, `MarkWordInfo` |
| `SendLiveCloudEffect` | Send live cloud effect<br>Required: `AppName` (default live), `PushDomainName`, `StreamName`, `Id` |
| `CreateLiveTimeShiftRule` | Create live time shift rule<br>Required: `DomainName`, `AppName` (default live), `StreamName`, `TemplateId` |
| `AddDelayLiveStream` | Add delay live stream<br>Required: `AppName` (default live), `DomainName`, `StreamName`, `DelayTime` |
| `CreateCasterPgm` | Create caster pgm<br>Required: `PgmDisplayInfo`, `CasterId` |
| `CreateLiveCallbackTemplate` | Create live callback template<br>Required: `TemplateName` |
| `CreateCasterPvw` | Create caster pvw<br>Required: `PvwDisplayInfo`, `CasterId` |
| `AddCasterMarkPicInfo` | Add caster mark pic info<br>Required: `CasterId`, `MarkPicInfo` |
| `CreateCaster` | Create caster |
| `SwitchBackupStream` | Switch backup stream<br>Required: `PushDomainName`, `AppName`, `StreamName`, `UpstreamSequence` |
| `CreateLiveStreamMonitor` | Create live stream monitor<br>Required: `OutputInfo`, `InputList` |
| `CreateLivePadRule` | Create live pad rule<br>Required: `DomainName`, `TemplateId` |
| `UnBindLiveDomainCert` | Run un bind live domain cert<br>Required: `DomainName` |
| `GenerateLiveAvatarScriptBroadcast` | Generate live avatar script broadcast<br>Required: `RoomId`, `ScriptId` |
| `AddCasterOutputInfo` | Add caster output info<br>Required: `CasterId`, `OutputInfo` |
| `CreateLiveCallbackRule` | Create live callback rule<br>Required: `DomainName`, `AppName` (default live), `TemplateId` |
| `CreateLiveAvatarScript` | Create live avatar script<br>Required: `Title`, `Content`, `RoomId` |
| `CreateVideoRedrawTask` | Create video redraw task<br>Required: `Input` |
| `SwitchCasterToEmergency` | Switch caster to emergency<br>Required: `CasterId` |
| `CloseSourceStream` | Close source stream<br>Required: `DomainName` |
| `ResumeLiveStream` | Resume live stream<br>Required: `AppName` (default live), `DomainName`, `StreamName` |
| `ForbidLiveStream` | Forbid live stream<br>Required: `AppName` (default live), `DomainName`, `StreamName` |
| `AddLiveDomain` | Add live domain<br>Required: `DomainName`, `DomainType` |
| `CreateLiveAvatarRoom` | Create live avatar room<br>Required: `Name` |
| `CreateAuditKeywords` | Create audit keywords<br>Required: `Keywords`, `LibId` |
| `CreateLiveRecordRule` | Create live record rule<br>Required: `DomainName`, `TemplateId` |
| `CreateLivePullStreamTask` | Create live pull stream task<br>Required: `SourceType`, `SourceUrls` (format `flv…`), `DomainName`, `AppName`, `StreamName`, `StartTime`, `EndTime`, `Operator` |
| `CreateLiveRecordTemplate` | Create live record template<br>Required: `TemplateName` |
| `ForbidLiveDomain` | Forbid live domain<br>Required: `DomainName` |
| `CopyLiveAvatarRoom` | Copy live avatar room<br>Required: `Name`, `SourceRoomId` |
| `CreateLiveTranscodeRule` | Create live transcode rule<br>Required: `DomainName`, `AppName`, `StreamName`, `TemplateId` |
| `CreateSceneVideoTask` | Create scene video task |
| `CreateLiveSnapshotRule` | Create live snapshot rule<br>Required: `DomainName`, `TemplateId` |
| `CreateLiveTimeShiftTemplate` | Create live time shift template<br>Required: `TemplateName`, `Duration` (unit: s) |
| `CreateCasterPgmFromPvw` | Create caster pgm from pvw<br>Required: `CasterId` |
| `SendTemporaryScriptToAvatarRoom` | Send temporary script to avatar room<br>Required: `RoomId`, `Content` |
| `CopyCaster` | Copy caster<br>Required: `CasterId` |
| `InsertTaskTemporaryFiles` | Run insert task temporary files<br>Required: `TaskId`, `TemporaryFiles`, `Operator` |
| `CreateRecordTask` | Create record task<br>Required: `StreamName`, `DomainName`, `AppName`, `EndTime` |
| `CreateLiveTranscodeTemplate` | Create live transcode template<br>Required: `TemplateName`, `VideoBitrate` |
| `EnableLiveDomain` | Enable live domain<br>Required: `DomainName` |
| `CreatePullStreamConfig` | Create pull stream config<br>Required: `FromUrl` (format `flv…`), `ToUrl`, `AreaId`, `IspId`, `StartTime`, `EndTime` |
| `ResumeDelayLiveStream` | Resume delay live stream<br>Required: `AppName` (default live), `DomainName`, `StreamName` |
| `CreateLiveCloudEffect` | Create live cloud effect |
| `StartLivePadStream` | Start live pad stream<br>Required: `AppName` (default live), `PushDomainName`, `StreamName` |

## Blocked destructive actions (66)

`ModifyLiveRecordTemplate`, `StopCasterPvw`, `DropLiveStream`, `ModifyLivePlayDomain`, `ReleaseCaster`, `ModifyLiveDomainReferer`, `StopLiveAvatarRoom`, `StopLiveStreamMonitor`, `ModifyLivePlayAuthKey`, `ModifyCasterMarkWordInfo`, `DeleteCasterLayoutInfo`, `DeleteLiveWatermarkRule`, `DeleteLiveCallbackRule`, `ModifyPullStreamConfig`, `DeleteLiveCallbackTemplate`, `ModifyCasterMarkPicInfo`, `DeletePullStreamConfig`, `ModifyCasterLayoutInfo`, `StopScreenshotTask`, `DeleteLiveWatermark`, `ModifyCaster`, `ModifyLiveTranscodeTemplate`, `DeleteLiveTranscodeRule`, `DeleteLiveSnapshotRule`, `DeleteLivePullStreamTask`, `ModifyLivePadTemplate`, `ModifyLiveAvatarRoom`, `ModifyLiveDomainCertBindings`, `ModifyLivePullStreamTask`, `DeleteAuditKeywords`, `ModifyCasterOutputInfo`, `DeleteLiveDomain`, `ModifyLiveAvatarScript`, `ModifyLiveCallbackTemplate`, `DeleteLiveTimeShiftTemplate`, `DeleteLiveTranscodeTemplate`, `StopRecordTask`, `ModifyLiveTimeShiftTemplate`, `StopLiveRecord`, `DeleteCaster`, `DeleteRecordTask`, `DeleteCasterOutputInfo`, `DeleteLiveAvatarRoom`, `DeleteLiveRecordRule`, `DeleteLivePadRule`, `DeleteScreenshotTask`, `ModifyPullStreamStatus`, `DeleteLivePadTemplate`, `StopLivePadStream`, `ModifyOriginStreamInfo`, `DeleteLiveTimeShiftRule`, `RestartLivePullStreamTask`, `ModifyLivePushAuthKey`, `DeleteCasterInputInfo`, `DeleteLiveRecord`, `ModifyLiveSnapshotTemplate`, `DeleteLiveStreamMonitor`, `StopCasterPgm`, `ModifyLiveStreamMonitor`, `DeleteLiveRecordTemplate`, `ModifyCasterInputInfo`, `DeleteCasterMarkPicInfo`, `DeleteCasterMarkWordInfo`, `DeleteLiveAvatarScript`, `CancelCommonMixStream`, `DeleteLiveSnapshotTemplate` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `live`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180801` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="live"`) for the allow/block decision and reason.

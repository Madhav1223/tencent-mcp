---
name: tencent-iotvideoindustry
description: Tencent Cloud IOTVIDEOINDUSTRY via the Tencent MCP server — 104 actions in API version v20201201 (56 read-only auto-allowed). Use for device, live, plan, channel, scene, video. Triggers on mentions of iotvideoindustry, device, live, plan, channel, scene, video, bind, control. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: IoT devices & spaces
metadata:
  version: "4"
---

# Tencent Cloud IOTVIDEOINDUSTRY

IoT devices & spaces: 104 actions in API version `v20201201` — 56 read-only (auto-allowed), 20 gated mutations, 28 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iotvideoindustry"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Devices authenticate with per-device credentials (certificates or keys) created at device registration — capture them then; they are not re-readable.
Products define the device model (data template) — create and finalize the product before bulk-registering devices under it.
Rules bridge device data to downstream services — test rules with a single device's shadow/message before enabling fleet-wide.
Firmware/OTA tasks roll out async across the fleet — stage by batches and monitor upgrade status per device cohort.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iotvideoindustry/v20201201 — action signatures in `iotvideoindustry_client.ts`, full request/response shapes in `iotvideoindustry_models.ts`.

## Read actions (auto-allowed, 56)

| Action | What it does |
|---|---|
| `DescribeIPCChannels` | Describe ipcchannels |
| `DescribeSubGroups` | Describe sub groups |
| `DescribeStatisticSummary` | Describe statistic summary<br>Required: `Date` |
| `DescribeScene` | Describe scene<br>Required: `IntId` |
| `DescribeDevice` | Describe device<br>Required: `DeviceId` |
| `DescribeVideoListByChannel` | Describe video list by channel<br>Required: `DeviceId`, `ChannelId`, `Type` |
| `DescribeLiveStream` | Describe live stream<br>Required: `LiveChannelId`, `ExpireTime` |
| `DescribeRecordingPlanById` | Describe recording plan by id<br>Required: `PlanId` |
| `DescribeGroupDevices` | Describe group devices<br>Required: `GroupId` |
| `DescribeCurrentDeviceData` | Describe current device data |
| `DescribeDeviceStreams` | Describe device streams<br>Required: `DeviceId`, `ExpireTime` |
| `GetVideoListByCon` | Get video list by con<br>Required: `DeviceId`, `Offset`, `Limit` |
| `DescribeRecordingPlans` | Describe recording plans |
| `DescribeDeviceGroup` | Describe device group |
| `DescribeChannels` | Describe channels<br>Required: `DeviceId` |
| `GetRecordDatesByDev` | Get record dates by dev<br>Required: `DeviceId`, `Limit` (default 200), `Offset` (default 0) |
| `DescribeStatisticDetails` | Describe statistic details<br>Required: `StartDate`, `EndDate`, `StatisticField` |
| `DescribeGroupById` | Describe group by id<br>Required: `GroupId` |
| `DescribeChannelLocalRecordURL` | Describe channel local record url<br>Required: `DeviceId`, `ChannelId`, `RecordId`, `ExpireTime` |
| `DescribeWarnMod` | Describe warn mod |
| `DescribeDeviceEvent` | Describe device event<br>Required: `StartTime`, `EndTime` |
| `DescribeChannelsByLiveRecordPlan` | Describe channels by live record plan<br>Required: `PlanId` |
| `DescribeRecordDatesByLive` | Describe record dates by live<br>Required: `LiveChannelId`, `Offset`, `Limit` |
| `DescribeChannelLiveStreamURL` | Describe channel live stream url<br>Required: `DeviceId`, `ChannelId` |
| `DescribeSubscriptionStatus` | Describe subscription status<br>Required: `DeviceId` |
| `DescribeGroups` | Describe groups |
| `DescribeLiveRecordPlanIds` | Describe live record plan ids |
| `DescribeBindSceneDevices` | Describe bind scene devices |
| `DescribeDeviceMonitorData` | Describe device monitor data<br>Required: `StartTime`, `EndTime`, `Type`, `TimesSpec` |
| `GetTimeTemplateById` | Get time template by id<br>Required: `TemplateId` |
| `DescribeMessageForwards` | Describe message forwards<br>Required: `Limit` |
| `DescribePresetList` | Describe preset list<br>Required: `ChannelId`, `DeviceId` |
| `DescribeDeviceList` | Describe device list |
| `DescribeMessageForward` | Describe message forward<br>Required: `IntId` |
| `GetTimeTemplates` | Get time templates |
| `DescribeAbnormalEvents` | Describe abnormal events<br>Required: `StartTime`, `EndTime` |
| `GetRecordPlanById` | Get record plan by id<br>Required: `PlanId` |
| `DescribeRecordStream` | Describe record stream<br>Required: `DeviceId`, `ExpireTime` |
| `DescribeMonitorDataByDate` | Describe monitor data by date<br>Required: `StartTime`, `EndTime` |
| `DescribeWarnings` | Describe warnings<br>Required: `OrderType` |
| `DescribeChannelStreamURL` | Describe channel stream url<br>Required: `DeviceId`, `ExpireTime` |
| `DescribeLiveChannel` | Describe live channel<br>Required: `LiveChannelId` |
| `DescribeAllDeviceList` | Describe all device list |
| `DescribeBindSceneChannels` | Describe bind scene channels<br>Required: `Limit` |
| `DescribeLiveVideoList` | Describe live video list<br>Required: `Offset`, `Limit`, `LiveChannelId` |
| `DescribeDevicePassWord` | Describe device pass word<br>Required: `DeviceId` |
| `DescribeLiveChannelList` | Describe live channel list<br>Required: `Offset`, `Limit` |
| `DescribeGroupByPath` | Describe group by path<br>Required: `GroupPath` |
| `GetRecordPlans` | Get record plans |
| `GetRecordPlanByDev` | Get record plan by dev<br>Required: `DeviceId` |
| `DescribeSIPServer` | Describe sipserver |
| `DescribeVideoList` | Describe video list<br>Required: `Offset`, `Limit` |
| `DescribeXP2PData` | Describe xp2 pdata<br>Required: `P2PAppId`, `From`, `To` |
| `DescribeScenes` | Describe scenes<br>Required: `Limit` |
| `DescribeLiveRecordPlanById` | Describe live record plan by id<br>Required: `PlanId` |
| `DescribeRecordDatesByChannel` | Describe record dates by channel<br>Required: `DeviceId`, `ChannelId`, `Type` |
## Mutations (gated — need allowlist, 20)

| Action | What it does |
|---|---|
| `CreateScene` | Create scene<br>Required: `SceneName`, `SceneTrigger`, `RecordDuration`, `StoreDuration` |
| `CreateMessageForward` | Create message forward<br>Required: `RegionId`, `RegionName`, `Instance`, `InstanceName`, `MessageType`, `TopicId`, `TopicName` |
| `ControlDevicePTZ` | Run control device ptz<br>Required: `DeviceId`, `Command` |
| `ControlHomePosition` | Run control home position<br>Required: `ChannelId`, `DeviceId` |
| `CreateTimeTemplate` | Create time template<br>Required: `Name`, `IsAllWeek` (default 0) |
| `CreateDeviceGroup` | Create device group<br>Required: `GroupName`, `ParentId` |
| `ControlChannelLocalRecord` | Run control channel local record<br>Required: `DeviceId`, `ChannelId`, `StreamId`, `Command` |
| `UpdateDevicePassWord` | Update device pass word<br>Required: `PassWord`, `DeviceId` |
| `CreateDevice` | Create device<br>Required: `NickName`, `PassWord` |
| `ControlPreset` | Run control preset<br>Required: `ChannelId`, `Command`, `PresetId` (range 1-8), `DeviceId` |
| `CreateRecordPlan` | Create record plan<br>Required: `Name`, `TimeTemplateId`, `EventId` |
| `UpdateDeviceGroup` | Update device group<br>Required: `GroupName`, `GroupId` |
| `UpdateTimeTemplate` | Update time template<br>Required: `TemplateId` |
| `CreateRecordingPlan` | Create recording plan<br>Required: `Name`, `TimeTemplateId` |
| `CreateLiveRecordPlan` | Create live record plan<br>Required: `PlanName`, `PlanType` |
| `CreateLiveChannel` | Create live channel<br>Required: `LiveChannelName`, `LiveChannelType` |
| `UpdateRecordPlan` | Update record plan<br>Required: `PlanId` |
| `ControlChannelPTZ` | Run control channel ptz<br>Required: `DeviceId`, `ChannelId`, `Command` |
| `ControlRecordStream` | Run control record stream<br>Required: `DeviceId`, `StreamId`, `Command` (unit: command) |
| `BindGroupDevices` | Bind group devices<br>Required: `GroupId`, `DeviceList` |

## Blocked destructive actions (28)

`ModifyVideoInfo`, `ModifyBindRecordingPlan`, `ModifyScene`, `DeleteRecordPlan`, `DeleteTimeTemplate`, `ModifyLiveChannel`, `ResetWarning`, `ModifySubscriptionStatus`, `ModifyBindPlanLiveChannel`, `ModifyLiveRecordPlan`, `DeleteChannel`, `ModifyBindSceneDevice`, `DeleteWarning`, `DeleteVideoList`, `ModifyMessageForward`, `DeleteLiveRecordPlan`, `DeleteDeviceGroup`, `ModifyRecordingPlan`, `DeleteScene`, `DeleteRecordingPlan`, `ModifyBindSceneChannels`, `DeleteMessageForward`, `ModifyPreset`, `DeleteDevice`, `ModifyDeviceData`, `DeleteLiveChannel`, `DeleteLiveVideoList`, `ModifyLiveVideo` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iotvideoindustry`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201201` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iotvideoindustry"`) for the allow/block decision and reason.

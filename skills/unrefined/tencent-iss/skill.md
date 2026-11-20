---
name: tencent-iss
description: Tencent Cloud ISS via the Tencent MCP server — 76 actions in API version v20230517 (38 read-only auto-allowed). Use for device, backup, plan, template, organization, control. Triggers on mentions of iss, device, backup, plan, template, organization, control, video, channel. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: IoT devices & spaces
metadata:
  version: "4"
---

# Tencent Cloud ISS

IoT devices & spaces: 76 actions in API version `v20230517` — 38 read-only (auto-allowed), 29 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iss"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Devices authenticate with per-device credentials (certificates or keys) created at device registration — capture them then; they are not re-readable.
Products define the device model (data template) — create and finalize the product before bulk-registering devices under it.
Rules bridge device data to downstream services — test rules with a single device's shadow/message before enabling fleet-wide.
Firmware/OTA tasks roll out async across the fleet — stage by batches and monitor upgrade status per device cohort.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iss/v20230517 — action signatures in `iss_client.ts`, full request/response shapes in `iss_models.ts`.

## Read actions (auto-allowed, 38)

| Action | What it does |
|---|---|
| `ListRecordRetrieveTasks` | List record retrieve tasks |
| `ListRecordBackupPlans` | List record backup plans |
| `DescribeDeviceChannel` | Describe device channel<br>Required: `DeviceId` |
| `DescribeDomainRegion` | Describe domain region |
| `DescribeRecordSlice` | Describe record slice<br>Required: `ChannelId`, `StartTime`, `EndTime` |
| `DescribeRecordBackupTemplate` | Describe record backup template<br>Required: `TemplateId` |
| `DescribeUserDeviceList` | Describe user device list<br>Required: `DeviceIds` |
| `DescribeVideoBitRate` | Describe video bit rate<br>Required: `ChannelIds` |
| `QueryForbidPlayChannelList` | Query forbid play channel list<br>Required: `UserId`, `PageSize`, `PageNumber` |
| `ListRecordPlanChannels` | List record plan channels |
| `DescribeDeviceRegion` | Describe device region |
| `DescribeDevicePreset` | Describe device preset<br>Required: `ChannelId` |
| `DescribeRecordBackupPlan` | Describe record backup plan<br>Required: `PlanId` |
| `DescribeRecordFile` | Describe record file<br>Required: `DeviceId`, `ChannelId`, `StartTime`, `EndTime` |
| `DescribeRecordRetrieveTask` | Describe record retrieve task<br>Required: `TaskId` |
| `DescribeUserDevice` | Describe user device<br>Required: `DeviceId` |
| `ListDeviceSnapshots` | List device snapshots<br>Required: `ChannelId` |
| `DescribeGBDeviceAddr` | Describe gbdevice addr<br>Required: `DeviceIds` |
| `DescribeCNAME` | Describe cname<br>Required: `ClusterId` |
| `DescribeRecordPlaybackUrl` | Describe record playback url<br>Required: `ChannelId`, `StartTime`, `EndTime` |
| `DescribeDomain` | Describe domain |
| `DescribeVideoDownloadUrl` | Describe video download url<br>Required: `ChannelId`, `BeginTime`, `EndTime`, `FileType` |
| `DescribeRecordPlan` | Describe record plan<br>Required: `PlanId` |
| `ListVideoDownloadTask` | List video download task |
| `ListOrganizationChannelNumbers` | List organization channel numbers<br>Required: `OrganizationId` |
| `ListRecordTemplates` | List record templates |
| `DescribeOrganization` | Describe organization |
| `ListDevices` | List devices<br>Required: `OrganizationId` |
| `ListRecordBackupTemplates` | List record backup templates |
| `DescribeRecordTemplate` | Describe record template<br>Required: `TemplateId` |
| `ListRecordBackupPlanDevices` | List record backup plan devices<br>Required: `PlanId` |
| `DescribeTask` | Describe task<br>Required: `TaskId` |
| `ListRecordPlanDevices` | List record plan devices<br>Required: `PlanId`, `PageSize`, `PageNumber` |
| `ListTasks` | List tasks |
| `ListSubTasks` | List sub tasks<br>Required: `TaskId` |
| `DescribeStreamAuth` | Describe stream auth |
| `ListRecordPlans` | List record plans |
| `ListOrganizationChannels` | List organization channels<br>Required: `OrganizationId`, `PageSize`, `PageNumber` |
## Mutations (gated — need allowlist, 29)

| Action | What it does |
|---|---|
| `UpdateDeviceStatus` | Update device status<br>Required: `DeviceId`, `Status` |
| `AddRecordRetrieveTask` | Add record retrieve task<br>Required: `TaskName`, `StartTime`, `EndTime`, `Mode`, `Expiration`, `Channels` |
| `UpdateRecordBackupTemplate` | Update record backup template<br>Required: `TemplateId`, `Mod` |
| `CreateVideoDownloadTask` | Create video download task<br>Required: `ChannelId`, `BeginTime`, `EndTime` |
| `AddOrganization` | Add organization<br>Required: `Name`, `ParentId` |
| `BatchDeleteVideoDownloadTask` | Run batch delete video download task |
| `UpdateRecordTemplate` | Update record template<br>Required: `TemplateId`, `Mod` |
| `AddUserDevice` | Add user device<br>Required: `Name`, `AccessProtocol`, `Type`, `OrganizationId`, `ClusterId` |
| `UpdateDeviceOrganization` | Update device organization<br>Required: `DeviceIds`, `OrganizationId` |
| `ControlDeviceStream` | Run control device stream<br>Required: `ChannelId` |
| `RefreshDeviceChannel` | Refresh device channel<br>Required: `DeviceId` |
| `ControlDevicePreset` | Run control device preset<br>Required: `ChannelId`, `Cmd`, `Index` |
| `BatchOperateDevice` | Run batch operate device<br>Required: `DeviceIds`, `Cmd` |
| `CallISAPI` | Run call isapi<br>Required: `DeviceId`, `Url` |
| `ControlDeviceSnapshot` | Run control device snapshot<br>Required: `ChannelId`, `SnapNum` (range 1～10), `Interval` (range 1～1800) |
| `UpdateRecordPlan` | Update record plan<br>Required: `PlanId`, `Mod` |
| `UpdateOrganization` | Update organization<br>Required: `OrganizationId`, `Name` |
| `AddRecordTemplate` | Add record template<br>Required: `TemplateName`, `TimeSections` |
| `AddRecordPlan` | Add record plan<br>Required: `PlanName`, `TemplateId`, `LifeCycle` |
| `SetForbidPlayChannels` | Set forbid play channels<br>Required: `Channels`, `UserId` |
| `UpdateRecordBackupPlan` | Update record backup plan<br>Required: `PlanId`, `Mod` |
| `ControlRecord` | Run control record<br>Required: `ChannelId`, `Session`, `ControlAction` |
| `ControlDevicePTZ` | Run control device ptz<br>Required: `ChannelId`, `Type`, `Speed` (range 1-8) |
| `UpdateUserDevice` | Update user device<br>Required: `DeviceId` |
| `AddStreamAuth` | Add stream auth<br>Required: `Id`, `PullState`, `PullSecret`, `PullExpired`, `PushState`, `PushSecret`, `PushExpired` |
| `AddRecordBackupPlan` | Add record backup plan<br>Required: `TemplateId`, `PlanName`, `Describe`, `LifeCycle` |
| `ControlRecordTimeline` | Run control record timeline<br>Required: `ChannelId`, `Start`, `End` |
| `PlayRecord` | Play record<br>Required: `ChannelId`, `Start`, `End` |
| `AddRecordBackupTemplate` | Add record backup template<br>Required: `TemplateName`, `TimeSections`, `DevTimeSections`, `Scale` |

## Blocked destructive actions (9)

`DeleteRecordTemplate`, `DeleteUserDevice`, `DeleteRecordBackupTemplate`, `DeleteTask`, `DeleteOrganization`, `DeleteRecordPlan`, `DeleteRecordRetrieveTask`, `DeleteRecordBackupPlan`, `DeleteDomain` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iss`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230517` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iss"`) for the allow/block decision and reason.

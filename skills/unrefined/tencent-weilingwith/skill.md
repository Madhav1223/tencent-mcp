---
name: tencent-weilingwith
description: Tencent Cloud WEILINGWITH via the Tencent MCP server — 63 actions in API version v20230427 (45 read-only auto-allowed). Use for device, space, building, batch, video, application. Triggers on mentions of weilingwith, device, space, building, batch, video, application, profile, tenant. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: IoT devices & spaces
metadata:
  version: "4"
---

# Tencent Cloud WEILINGWITH

IoT devices & spaces: 63 actions in API version `v20230427` — 45 read-only (auto-allowed), 12 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "weilingwith"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Devices authenticate with per-device credentials (certificates or keys) created at device registration — capture them then; they are not re-readable.
Products define the device model (data template) — create and finalize the product before bulk-registering devices under it.
Rules bridge device data to downstream services — test rules with a single device's shadow/message before enabling fleet-wide.
Firmware/OTA tasks roll out async across the fleet — stage by batches and monitor upgrade status per device cohort.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/weilingwith/v20230427 — action signatures in `weilingwith_client.ts`, full request/response shapes in `weilingwith_models.ts`.

## Read actions (auto-allowed, 45)

| Action | What it does |
|---|---|
| `DescribeVideoCloudRecord` | Describe video cloud record<br>Required: `WID`, `StartTime`, `EndTime`, `WorkspaceId`, `ApplicationToken` |
| `DescribeBuildingProfile` | Describe building profile<br>Required: `BuildingId`, `WorkspaceId`, `ApplicationToken` |
| `DescribeLinkRuleList` | Describe link rule list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeElementProfileTree` | Describe element profile tree<br>Required: `BuildingId`, `WorkspaceId`, `ApplicationToken` |
| `DescribeAlarmStatusList` | Describe alarm status list<br>Required: `ApplicationToken`, `WorkspaceId` |
| `DescribeDeviceStatusStat` | Describe device status stat<br>Required: `Level`, `WorkspaceId`, `ApplicationToken` |
| `DescribeSpaceDeviceIdList` | Describe space device id list<br>Required: `ElementIds`, `IsCascade`, `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeVideoLiveStream` | Describe video live stream<br>Required: `WID`, `Protocol`, `WorkspaceId`, `ApplicationToken` |
| `DescribeTenantDepartmentList` | Describe tenant department list<br>Required: `Offset`, `Limit`, `ApplicationToken` |
| `DescribeTenantBuildingCountAndArea` | Describe tenant building count and area<br>Required: `WorkspaceIdList`, `ApplicationToken` |
| `DescribeWorkSpaceBuildingCountAndArea` | Describe work space building count and area<br>Required: `WorkspaceIdList`, `ApplicationToken` |
| `DescribeDeviceShadowList` | Describe device shadow list<br>Required: `WorkspaceId`, `WIDSet`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeDeviceTagList` | Describe device tag list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeAlarmTypeList` | Describe alarm type list<br>Required: `WorkspaceId`, `ApplicationToken` |
| `DescribeSpaceTypeList` | Describe space type list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeDeviceTypeList` | Describe device type list<br>Required: `WorkspaceId`, `ApplicationToken` |
| `DescribeSpaceInfoByDeviceId` | Describe space info by device id<br>Required: `DeviceId`, `WorkspaceId`, `ApplicationToken` |
| `DescribeWorkspaceList` | Describe workspace list<br>Required: `ApplicationToken` |
| `DescribeRuleDetail` | Describe rule detail<br>Required: `WorkspaceId`, `Id`, `ApplicationToken` |
| `DescribeModelList` | Describe model list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribePropertyList` | Describe property list<br>Required: `BuildingId`, `ElementId`, `WorkspaceId`, `ApplicationToken` |
| `DescribeProductList` | Describe product list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeActionList` | Describe action list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeSceneList` | Describe scene list<br>Required: `WorkspaceId`, `ApplicationToken` |
| `DescribeSpaceRelationByDeviceId` | Describe space relation by device id<br>Required: `DeviceId`, `WorkspaceId`, `ApplicationToken` |
| `DescribeDeviceList` | Describe device list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeWorkspaceUserList` | Describe workspace user list<br>Required: `Offset`, `Limit`, `WorkspaceId`, `ApplicationToken` |
| `DescribeElementProfilePage` | Describe element profile page<br>Required: `BuildingId`, `PageNumber`, `PageSize`, `WorkspaceId`, `ApplicationToken` |
| `DescribeEventList` | Describe event list<br>Required: `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeAdministrationByTag` | Describe administration by tag<br>Required: `ApplicationToken`, `WorkspaceId`, `Tag` |
| `DescribeCameraExtendInfo` | Describe camera extend info<br>Required: `WID`, `WorkspaceId`, `ApplicationToken` |
| `DescribeFileDownloadURL` | Describe file download url<br>Required: `WorkspaceId`, `FileId`, `ApplicationToken` |
| `DescribeEdgeApplicationToken` | Describe edge application token<br>Required: `ApplicationToken` |
| `DescribeBuildingModel` | Describe building model<br>Required: `BuildingId`, `WorkspaceId`, `ApplicationToken` |
| `DescribeDeviceGroupList` | Describe device group list<br>Required: `ApplicationToken`, `WorkspaceId` |
| `DescribeSpaceDeviceRelationList` | Describe space device relation list<br>Required: `ElementIds`, `IsCascade`, `WorkspaceId`, `PageNumber`, `PageSize`, `ApplicationToken` |
| `DescribeBuildingList` | Describe building list<br>Required: `WorkspaceId`, `ApplicationToken` |
| `DescribeInterfaceList` | Describe interface list<br>Required: `ApplicationToken` |
| `DescribeVideoRecordStream` | Describe video record stream<br>Required: `WID`, `Protocol`, `StartTime`, `EndTime`, `PlayBackRate`, `WorkspaceId`, `ApplicationToken` |
| `DescribeAlarmList` | Describe alarm list<br>Required: `BeginTime`, `EndTime`, `PageNumber`, `PageSize`, `WorkspaceId`, `ApplicationToken` |
| `DescribeApplicationList` | Describe application list<br>Required: `WorkspaceId`, `ApplicationToken` |
| `DescribeFileUploadURL` | Describe file upload url<br>Required: `WorkspaceId`, `FileName`, `FileSize`, `ApplicationToken` |
| `DescribeTenantUserList` | Describe tenant user list<br>Required: `Offset`, `Limit`, `ApplicationToken` |
| `DescribeAlarmLevelList` | Describe alarm level list<br>Required: `WorkspaceId`, `ApplicationToken` |
| `DescribeDeviceStatusList` | Describe device status list<br>Required: `WorkspaceId`, `ApplicationToken`, `PageNumber`, `PageSize` |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `ChangeAlarmStatus` | Run change alarm status<br>Required: `Id`, `Status`, `ProcessTime`, `ProcessType`, `WorkspaceId`, `UserId`, `UserName`, `ApplicationToken` |
| `ReportAppMessage` | Report app message<br>Required: `WorkspaceId`, `Profile`, `ReportTs`, `Properties`, `ApplicationToken` |
| `UpdateWorkspaceParkAttributes` | Update workspace park attributes<br>Required: `WorkspaceId`, `ApplicationToken` |
| `BatchDeleteDevice` | Run batch delete device<br>Required: `WorkspaceId`, `WIDSet`, `ApplicationToken` |
| `BatchKillAlarm` | Run batch kill alarm<br>Required: `BeginTime`, `EndTime`, `StatusSet`, `WorkspaceId`, `UserId`, `UserName`, `ApplicationToken` |
| `ControlDevice` | Run control device<br>Required: `WorkspaceId`, `WIDSet`, `ControlData`, `ApplicationToken` |
| `BatchReportAppMessage` | Run batch report app message<br>Required: `WorkspaceId`, `ApplicationToken` |
| `BatchCreateDevice` | Run batch create device<br>Required: `WorkspaceId`, `AddDeviceSet`, `ApplicationToken` |
| `SaveDeviceGroup` | Run save device group<br>Required: `Name`, `Description`, `WorkspaceId`, `ApplicationToken` |
| `ControlCameraPTZ` | Run control camera ptz<br>Required: `WID`, `CMD`, `WorkspaceId`, `ApplicationToken` |
| `AddAlarmProcessRecord` | Add alarm process record<br>Required: `RecordSet`, `WorkspaceId`, `ApplicationToken` |
| `CreateApplicationToken` | Create application token<br>Required: `ApplicationId`, `Nonce`, `TenantId`, `RequestTime`, `Signature` |

## Blocked destructive actions (6)

`DeleteDeviceGroup`, `ModifyDeviceGroup`, `StopVideoStreaming`, `ModifyDeviceName`, `ModifyDeviceTag`, `ModifyDeviceField` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `weilingwith`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230427` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="weilingwith"`) for the allow/block decision and reason.

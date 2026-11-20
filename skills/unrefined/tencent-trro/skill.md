---
name: tencent-trro
description: Tencent Cloud TRRO via the Tencent MCP server — 31 actions in API version v20220325 (16 read-only auto-allowed). Use for device, session, batch, cloud, delete, devices. Triggers on mentions of trro, device, session, batch, cloud, delete, devices, duration, license. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud TRRO

General service: 31 actions in API version `v20220325` — 16 read-only (auto-allowed), 7 gated mutations, 8 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "trro"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/trro/v20220325 — action signatures in `trro_client.ts`, full request/response shapes in `trro_models.ts`.

## Read actions (auto-allowed, 16)

| Action | What it does |
|---|---|
| `GetTotalDuration` | Get total duration<br>Required: `StartTime`, `EndTime`, `ProjectId` |
| `DescribeProjectInfo` | Describe project info<br>Required: `ProjectId` |
| `GetDevices` | Get devices<br>Required: `PageNum`, `PageSize` |
| `DescribePolicy` | Describe policy<br>Required: `ProjectId` |
| `GetLicenseStat` | Get license stat |
| `DescribeSessionStatisticsByInterval` | Describe session statistics by interval<br>Required: `ProjectId`, `StatisticInterval` |
| `GetLicenses` | Get licenses<br>Required: `PageNum`, `PageSize` |
| `DescribeDeviceList` | Describe device list<br>Required: `ProjectId` |
| `DescribeDeviceSessionDetails` | Describe device session details<br>Required: `SessionId` |
| `GetDurationDetails` | Get duration details<br>Required: `StartTime`, `EndTime`, `PageNum`, `PageSize`, `ProjectId` |
| `DescribeSessionStatistics` | Describe session statistics<br>Required: `ProjectId` |
| `DescribeDeviceInfo` | Describe device info<br>Required: `ProjectId`, `DeviceId` |
| `DescribeDeviceSessionList` | Describe device session list<br>Required: `ProjectId`, `PageNumber`, `PageSize` |
| `DescribeRecentSessionList` | Describe recent session list<br>Required: `ProjectId`, `PageNumber`, `PageSize` |
| `GetDeviceLicense` | Get device license<br>Required: `ProjectId`, `DeviceId` |
| `DescribeProjectList` | Describe project list |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `BoundLicenses` | Run bound licenses<br>Required: `Count`, `DeviceId`, `ProjectId` |
| `BatchDeletePolicy` | Run batch delete policy<br>Required: `ProjectId`, `RemoteDeviceIds`, `PolicyMode` |
| `StartPublishLiveStream` | Start publish live stream<br>Required: `WithTranscoding`, `MaxIdleTime` (default 30), `VideoParams`, `PublishParams` |
| `CreateCloudRecording` | Create cloud recording<br>Required: `ProjectId`, `DeviceId`, `VideoStreamId`, `CloudStorage` |
| `CreateDevice` | Create device<br>Required: `ProjectId`, `DeviceId`, `DeviceName`, `DeviceType`, `DeviceToken` |
| `BatchDeleteDevices` | Run batch delete devices<br>Required: `ProjectId`, `DeviceIds` |
| `CreateProject` | Create project<br>Required: `ProjectName` |

## Blocked destructive actions (8)

`ModifyCallbackUrl`, `StopPublishLiveStream`, `ModifyDevice`, `ModifyProject`, `ModifyPolicy`, `ModifyProjectSecMode`, `DeleteCloudRecording`, `DeleteProject` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `trro`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220325` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="trro"`) for the allow/block decision and reason.

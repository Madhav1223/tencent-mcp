---
name: tencent-mna
description: Tencent Cloud MNA via the Tencent MCP server — 63 actions in API version v20210119 (30 read-only auto-allowed). Use for device, gateway, statistic, hardware, application, name. Triggers on mentions of mna, device, gateway, statistic, hardware, application, name, access, cluster. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Game services
metadata:
  version: "4"
---

# Tencent Cloud MNA

Game services: 63 actions in API version `v20210119` — 30 read-only (auto-allowed), 24 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mna"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Game backends are region-scoped with player-routing implications — confirm the serving region before fleet changes.
Matchmaking queues and fleet capacity interact — scale fleets before opening queues to production traffic.
Security (anti-cheat, anti-DDoS) policies apply per title/project — scope every change to the right project ID.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mna/v20210119 — action signatures in `mna_client.ts`, full request/response shapes in `mna_models.ts`.

## Read actions (auto-allowed, 30)

| Action | What it does |
|---|---|
| `GetGatewayList` | Get gateway list<br>Required: `PageNumber`, `PageSize` |
| `GetApplication` | Get application |
| `GetFlowStatistic` | Get flow statistic<br>Required: `DeviceId`, `BeginTime`, `EndTime`, `Type`, `TimeGranularity` |
| `GetFlowStatisticByGroup` | Get flow statistic by group<br>Required: `GroupId`, `BeginTime`, `EndTime`, `Type`, `TimeGranularity` |
| `GetMultiFlowStatistic` | Get multi flow statistic<br>Required: `DeviceIds`, `BeginTime`, `EndTime`, `Type`, `TimeGranularity` |
| `GetDevices` | Get devices<br>Required: `PageSize`, `PageNumber` |
| `GetPublicKey` | Get public key |
| `GetFlowPackages` | Get flow packages<br>Required: `PageNumber`, `PageSize` |
| `GetDevice` | Get device<br>Required: `DeviceId` |
| `GetDestIPByName` | Get dest ipby name<br>Required: `DeviceName`, `BeginTime`, `EndTime` |
| `DescribeAccessRegions` | Describe access regions |
| `GetActiveDeviceCount` | Get active device count |
| `GetFlowAlarmInfo` | Get flow alarm info |
| `GetFlowStatisticByName` | Get flow statistic by name<br>Required: `DeviceName`, `BeginTime`, `EndTime`, `Type`, `TimeGranularity` |
| `GetNetMonitor` | Get net monitor<br>Required: `DeviceId`, `BeginTime`, `EndTime`, `Metrics` |
| `GetDevicePayMode` | Get device pay mode<br>Required: `DeviceIdList` |
| `GetGroupDetail` | Get group detail<br>Required: `GroupId`, `PageSize`, `PageNumber` |
| `GetL3ConnList` | Get l3 conn list<br>Required: `PageSize`, `PageNumber` |
| `DescribeAccessPointList` | Describe access point list |
| `GetVendorHardware` | Get vendor hardware<br>Required: `PageNumber`, `PageSize` |
| `GetNetMonitorByName` | Get net monitor by name<br>Required: `DeviceName`, `BeginTime`, `EndTime`, `Metrics` |
| `GetStatisticDataByName` | Get statistic data by name<br>Required: `DeviceName`, `BeginTime` (unit: s), `EndTime` (unit: s), `TimeGranularity` |
| `GetStatisticData` | Get statistic data<br>Required: `DeviceId`, `BeginTime` (unit: s), `EndTime` (unit: s), `TimeGranularity` |
| `GetHardwareList` | Get hardware list<br>Required: `PageNumber`, `PageSize` |
| `GetMonitorDataByName` | Get monitor data by name<br>Required: `DeviceName`, `BeginTime`, `EndTime` |
| `GetCustomerGatewayClusterList` | Get customer gateway cluster list |
| `GetFlowStatisticByRegion` | Get flow statistic by region<br>Required: `BeginTime`, `EndTime`, `Type`, `TimeGranularity`, `GatewayType` |
| `DownloadActiveDeviceCount` | Download active device count |
| `GetHardwareInfo` | Get hardware info<br>Required: `Vendor`, `SN` |
| `GetGroupList` | Get group list<br>Required: `PageSize`, `PageNumber` |
## Mutations (gated — need allowlist, 24)

| Action | What it does |
|---|---|
| `UpdateL3Cidr` | Update l3 cidr<br>Required: `L3ConnId`, `Cidr1` |
| `SetNotifyUrl` | Set notify url<br>Required: `NotifyUrl`, `CallbackKey` |
| `UpdateHardware` | Update hardware<br>Required: `HardwareId` |
| `UpdateApplicationInfo` | Update application info<br>Required: `MpApplicationId` |
| `GroupAddDevice` | Group add device<br>Required: `GroupId`, `DeviceList` |
| `ActivateHardware` | Activate hardware<br>Required: `Hardware` |
| `AddHardware` | Add hardware<br>Required: `Hardware` |
| `AddApplication` | Add application<br>Required: `MpApplicationName` |
| `ReportOrder` | Report order<br>Required: `OrderId` |
| `UpdateApplicationKey` | Update application key<br>Required: `MpApplicationKey`, `MpApplicationId` |
| `UpdateDevice` | Update device<br>Required: `DeviceId` |
| `UpdateCustomerGatewayCluster` | Update customer gateway cluster<br>Required: `ClusterId`, `PublicIp` |
| `CreateEncryptedKey` | Create encrypted key |
| `AddGateway` | Add gateway<br>Required: `ClusterId`, `Username`, `Password`, `GatewayIp` |
| `OrderPerLicense` | Order per license<br>Required: `DeviceId`, `Type` |
| `GroupDeleteDevice` | Group delete device<br>Required: `GroupId`, `DeviceList` |
| `OrderFlowPackage` | Order flow package<br>Required: `PackageType`, `DeviceList`, `AutoRenewFlag`, `PackageRegion` |
| `UpdateL3Switch` | Update l3 switch<br>Required: `L3ConnId` |
| `AddL3Conn` | Add l3 conn<br>Required: `Cidr1`, `Cidr2`, `DeviceId1`, `DeviceId2` |
| `AddDevice` | Add device<br>Required: `DeviceName` |
| `UpdateGroup` | Update group<br>Required: `GroupId` |
| `AddGroup` | Add group<br>Required: `GroupName` |
| `AddCustomerGatewayCluster` | Add customer gateway cluster<br>Required: `ClusterName`, `BigArea` |
| `UpdateL3Conn` | Update l3 conn<br>Required: `L3ConnId` |

## Blocked destructive actions (9)

`ModifyPackageRenewFlag`, `DeleteApplication`, `ModifyDeviceAccessRegions`, `ModifyDeviceAccessScope`, `DeleteL3Conn`, `DeleteGroup`, `DeleteDevice`, `DeleteCustomerGatewayCluster`, `DeleteGateway` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mna`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210119` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mna"`) for the allow/block decision and reason.

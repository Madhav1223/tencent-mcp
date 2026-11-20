---
name: tencent-iotcloud
description: Tencent Cloud IOTCLOUD via the Tencent MCP server — 73 actions in API version v20210408 (34 read-only auto-allowed). Use for device, firmware, product, private, topic, devices. Triggers on mentions of iotcloud, device, firmware, product, private, topic, devices, products, publish. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: IoT devices & spaces
metadata:
  version: "4"
---

# Tencent Cloud IOTCLOUD

IoT devices & spaces: 73 actions in API version `v20210408` — 34 read-only (auto-allowed), 30 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iotcloud"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Devices authenticate with per-device credentials (certificates or keys) created at device registration — capture them then; they are not re-readable.
Products define the device model (data template) — create and finalize the product before bulk-registering devices under it.
Rules bridge device data to downstream services — test rules with a single device's shadow/message before enabling fleet-wide.
Firmware/OTA tasks roll out async across the fleet — stage by batches and monitor upgrade status per device cohort.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iotcloud/v20210408 — action signatures in `iotcloud_client.ts`, full request/response shapes in `iotcloud_models.ts`.

## Read actions (auto-allowed, 34)

| Action | What it does |
|---|---|
| `GetCOSURL` | Get cosurl<br>Required: `ProductId`, `FirmwareVersion` |
| `DescribeGatewayBindDevices` | Describe gateway bind devices<br>Required: `GatewayProductId`, `GatewayDeviceName`, `Offset`, `Limit` |
| `ListLogPayload` | List log payload<br>Required: `MinTime`, `MaxTime`, `Keywords` |
| `DescribeFirmware` | Describe firmware<br>Required: `ProductId`, `FirmwareVersion` |
| `DescribeDeviceShadow` | Describe device shadow<br>Required: `ProductId`, `DeviceName` |
| `DescribeDevice` | Describe device<br>Required: `ProductId`, `DeviceName` |
| `DescribeProduct` | Describe product<br>Required: `ProductId` |
| `DescribePrivateCABindedProducts` | Describe private cabinded products<br>Required: `CertName`, `Offset`, `Limit` (default 20) |
| `GetUserResourceInfo` | Get user resource info |
| `DescribeProductCA` | Describe product ca<br>Required: `ProductId` |
| `DescribeDeviceClientKey` | Describe device client key<br>Required: `ProductId`, `DeviceName` |
| `DescribeProducts` | Describe products<br>Required: `Offset`, `Limit` (range 10-250) |
| `DescribeResourceTasks` | Describe resource tasks<br>Required: `ProductID`, `Name`, `Offset`, `Limit` |
| `DescribeFirmwareTaskStatistics` | Describe firmware task statistics<br>Required: `ProductId`, `FirmwareVersion` |
| `DescribePushResourceTaskStatistics` | Describe push resource task statistics<br>Required: `ProductID`, `Name` |
| `DescribeProductTask` | Describe product task<br>Required: `ProductId`, `TaskId` |
| `ListFirmwares` | List firmwares<br>Required: `PageNum`, `PageSize` |
| `ListSDKLog` | List sdklog<br>Required: `MinTime`, `MaxTime`, `Keywords` |
| `DescribeProductResource` | Describe product resource |
| `DescribeDeviceResource` | Describe device resource<br>Required: `DeviceName` |
| `DescribeFirmwareTaskDistribution` | Describe firmware task distribution<br>Required: `ProductId`, `FirmwareVersion`, `TaskId` |
| `DownloadDeviceResource` | Download device resource<br>Required: `ProductID`, `Name`, `DeviceName` |
| `DescribeFirmwareTask` | Describe firmware task<br>Required: `ProductId`, `FirmwareVersion`, `TaskId` |
| `DescribeDeviceResources` | Describe device resources<br>Required: `Offset`, `Limit` (range 10-250) |
| `ListLog` | List log<br>Required: `MinTime`, `MaxTime` |
| `DescribeFirmwareTaskDevices` | Describe firmware task devices<br>Required: `ProductId` |
| `DescribePrivateCA` | Describe private ca<br>Required: `CertName` |
| `DescribeProductTasks` | Describe product tasks<br>Required: `ProductId`, `Offset`, `Limit` |
| `DescribeDevices` | Describe devices<br>Required: `ProductId`, `Offset`, `Limit` (range 10-250) |
| `GetAllVersion` | Get all version<br>Required: `ProductId` |
| `DescribeFirmwareTasks` | Describe firmware tasks<br>Required: `ProductId`, `FirmwareVersion`, `Offset`, `Limit` |
| `ListTopicRules` | List topic rules<br>Required: `PageNum`, `PageSize` |
| `DescribeProductResources` | Describe product resources<br>Required: `Offset`, `Limit` (range 10-250) |
| `DescribePrivateCAs` | Describe private cas |
## Mutations (gated — need allowlist, 30)

| Action | What it does |
|---|---|
| `ReplaceTopicRule` | Replace topic rule<br>Required: `RuleName`, `TopicRulePayload` |
| `PublishRRPCMessage` | Publish rrpcmessage<br>Required: `ProductId`, `DeviceName`, `Payload` |
| `UpdateDeviceLogLevel` | Update device log level<br>Required: `ProductId`, `DeviceName`, `LogLevel` |
| `UpdateTopicPolicy` | Update topic policy<br>Required: `ProductId`, `TopicName`, `NewTopicName`, `Privilege` |
| `PublishBroadcastMessage` | Publish broadcast message<br>Required: `ProductId`, `Payload`, `Qos` |
| `UpdateDeviceAvailableState` | Update device available state<br>Required: `ProductId`, `DeviceName`, `EnableState` |
| `CreateTopicRule` | Create topic rule<br>Required: `RuleName`, `TopicRulePayload` |
| `RetryDeviceFirmwareTask` | Retry device firmware task<br>Required: `ProductId`, `DeviceName`, `FirmwareVersion`, `TaskId` |
| `CreateTopicPolicy` | Create topic policy<br>Required: `ProductId`, `TopicName`, `Privilege` |
| `UpdateProductPrivateCA` | Update product private ca<br>Required: `ProductId`, `CertName` |
| `BatchUpdateFirmware` | Run batch update firmware<br>Required: `ProductId`, `FirmwareVersion` |
| `CreateProduct` | Create product<br>Required: `ProductName` |
| `SetProductsForbiddenStatus` | Set products forbidden status<br>Required: `ProductId`, `Status` |
| `CreateMultiDevicesTask` | Create multi devices task<br>Required: `ProductId`, `ParametersType` |
| `UpdateDevicesEnableState` | Update devices enable state<br>Required: `ProductId`, `DeviceNames`, `Status` |
| `UpdateOtaTaskStatus` | Update ota task status<br>Required: `ProductId`, `TaskId`, `Status` |
| `EditFirmware` | Run edit firmware<br>Required: `ProductId`, `FirmwareVersion`, `FirmwareName` |
| `CreateDevice` | Create device<br>Required: `ProductId`, `DeviceName` |
| `PublishMessage` | Publish message<br>Required: `Topic`, `Payload`, `ProductId`, `DeviceName` |
| `CreatePrivateCA` | Create private ca<br>Required: `CertName`, `CertText`, `VerifyCertText` |
| `UpdatePrivateCA` | Update private ca<br>Required: `CertName`, `CertText`, `VerifyCertText` |
| `UploadFirmware` | Upload firmware<br>Required: `ProductId`, `FirmwareVersion`, `Md5sum`, `FileSize` |
| `UpdateProductDynamicRegister` | Update product dynamic register<br>Required: `ProductId`, `RegisterType`, `RegisterLimit` |
| `EnableTopicRule` | Enable topic rule<br>Required: `RuleName` |
| `BindDevices` | Bind devices<br>Required: `GatewayProductId`, `GatewayDeviceName`, `ProductId`, `DeviceNames` |
| `CreateTaskFileUrl` | Create task file url<br>Required: `ProductId` |
| `UnbindDevices` | Unbind devices<br>Required: `GatewayProductId`, `GatewayDeviceName`, `ProductId`, `DeviceNames` |
| `DisableTopicRule` | Disable topic rule<br>Required: `RuleName` |
| `UpdateDeviceShadow` | Update device shadow<br>Required: `ProductId`, `DeviceName`, `State`, `ShadowVersion` |
| `UpdateDevicePSK` | Update device psk<br>Required: `ProductId`, `DeviceName`, `Psk` |

## Blocked destructive actions (9)

`DeleteProductPrivateCA`, `DeleteDevice`, `DeleteDeviceShadow`, `DeleteProduct`, `DeletePrivateCA`, `ResetDeviceState`, `CancelDeviceFirmwareTask`, `DeleteDeviceResource`, `DeleteTopicRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iotcloud`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210408` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iotcloud"`) for the allow/block decision and reason.

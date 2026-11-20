---
name: tencent-iotvideo
description: Tencent Cloud IOTVIDEO via the Tencent MCP server — 108 actions in API version v20211125 (59 read-only auto-allowed). Use for cloud, device, storage, firmware, forward, aimodel. Triggers on mentions of iotvideo, cloud, device, storage, firmware, forward, aimodel, product, channel. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: IoT devices & spaces
metadata:
  version: "4"
---

# Tencent Cloud IOTVIDEO

IoT devices & spaces: 108 actions in API version `v20211125` — 59 read-only (auto-allowed), 31 gated mutations, 18 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iotvideo"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Devices authenticate with per-device credentials (certificates or keys) created at device registration — capture them then; they are not re-readable.
Products define the device model (data template) — create and finalize the product before bulk-registering devices under it.
Rules bridge device data to downstream services — test rules with a single device's shadow/message before enabling fleet-wide.
Firmware/OTA tasks roll out async across the fleet — stage by batches and monitor upgrade status per device cohort.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iotvideo/v20211125 — action signatures in `iotvideo_client.ts`, full request/response shapes in `iotvideo_models.ts`.

## Read actions (auto-allowed, 59)

| Action | What it does |
|---|---|
| `DescribeDevicePackages` | Describe device packages<br>Required: `ProductId`, `DeviceName`, `Limit`, `Offset` |
| `DescribeAIModels` | Describe aimodels<br>Required: `ModelId`, `Status`, `Offset`, `Limit` |
| `DescribeAIModelApplications` | Describe aimodel applications<br>Required: `ModelId`, `Limit`, `Offset` |
| `DescribeProduct` | Describe product<br>Required: `ProductId` |
| `GetAllFirmwareVersion` | Get all firmware version<br>Required: `ProductID` |
| `DescribeProducts` | Describe products<br>Required: `Limit`, `Offset` |
| `DescribeUser` | Describe user |
| `DescribeFirmwareTaskStatistics` | Describe firmware task statistics<br>Required: `ProductID`, `FirmwareVersion` |
| `DescribeDeviceEventHistory` | Describe device event history<br>Required: `ProductId`, `DeviceName` |
| `DescribeCloudStorageThumbnailList` | Describe cloud storage thumbnail list<br>Required: `ProductId`, `DeviceName`, `ThumbnailList` |
| `DescribeForwardRule` | Describe forward rule<br>Required: `ProductID`, `Skey`, `QueueType` |
| `DescribePackageConsumeTasks` | Describe package consume tasks<br>Required: `Limit`, `Offset` |
| `DescribeAccount` | Describe account<br>Required: `AccountType` |
| `DescribeCloudStoragePackageConsumeStats` | Describe cloud storage package consume stats<br>Required: `StartDate`, `EndDate` |
| `DescribeFirmwareTasks` | Describe firmware tasks<br>Required: `ProductID`, `FirmwareVersion`, `Offset`, `Limit` |
| `DescribeDeviceCommLog` | Describe device comm log<br>Required: `MinTime`, `MaxTime`, `ProductId`, `DeviceName` |
| `DescribeP2PRoute` | Describe p2 proute<br>Required: `ProductId`, `DeviceName` |
| `DescribeFirmware` | Describe firmware<br>Required: `ProductID`, `FirmwareVersion` |
| `DescribeCloudStorageDate` | Describe cloud storage date<br>Required: `ProductId`, `DeviceName` |
| `DescribeFreeCloudStorageNum` | Describe free cloud storage num |
| `DescribeCloudStorageUsers` | Describe cloud storage users<br>Required: `ProductId`, `DeviceName`, `Limit`, `Offset` |
| `GetFirmwareURL` | Get firmware url<br>Required: `ProductID`, `FirmwareVersion` |
| `DescribeBatch` | Describe batch<br>Required: `BatchId` |
| `ListFirmwares` | List firmwares<br>Required: `PageNum`, `PageSize` |
| `DescribeCategory` | Describe category<br>Required: `Id` |
| `DescribeFirmwareTask` | Describe firmware task<br>Required: `ProductID`, `FirmwareVersion`, `TaskId` |
| `DescribeFirmwareTaskDevices` | Describe firmware task devices<br>Required: `ProductID` |
| `DescribeDataForwardList` | Describe data forward list<br>Required: `ProductIds` |
| `DescribeCloudStorageTime` | Describe cloud storage time<br>Required: `ProductId`, `DeviceName`, `Date` |
| `DescribeCloudStorageThumbnail` | Describe cloud storage thumbnail<br>Required: `ProductId`, `DeviceName`, `Thumbnail` |
| `DescribeCloudStorageMultiThumbnail` | Describe cloud storage multi thumbnail<br>Required: `ProductId`, `DeviceName`, `MultiThumbnail` |
| `CheckForwardAuth` | Check forward auth<br>Required: `Skey`, `QueueType` |
| `DescribeDeviceData` | Describe device data<br>Required: `ProductId`, `DeviceName` |
| `DescribeAIModelUsage` | Describe aimodel usage<br>Required: `ModelId`, `ProductId`, `Offset`, `Limit` |
| `DescribeCloudStorage` | Describe cloud storage<br>Required: `ProductId`, `DeviceName` |
| `DescribeBatchs` | Describe batchs<br>Required: `ProductId`, `Limit`, `Offset` |
| `DescribeDeviceActionHistory` | Describe device action history<br>Required: `ProductId`, `DeviceName`, `MinTime`, `MaxTime` |
| `DescribePushChannel` | Describe push channel<br>Required: `ProductId` |
| `DescribeProductDynamicRegister` | Describe product dynamic register<br>Required: `ProductId` |
| `DescribeDeviceDataStats` | Describe device data stats<br>Required: `StartDate`, `EndDate` |
| `DescribeDeviceStatusLog` | Describe device status log<br>Required: `MinTime`, `MaxTime`, `ProductId`, `DeviceName` |
| `DescribeAIModelChannel` | Describe aimodel channel<br>Required: `ModelId`, `ProductId` |
| `DescribeBalance` | Describe balance<br>Required: `AccountType` |
| `DescribeSDKLog` | Describe sdklog<br>Required: `MinTime`, `MaxTime`, `Keywords` |
| `DescribeDevice` | Describe device<br>Required: `ProductId`, `DeviceName` |
| `DescribeMessageDataStats` | Describe message data stats<br>Required: `StartDate`, `EndDate` |
| `DescribeP2PInfo` | Describe p2 pinfo<br>Required: `ProductId`, `DeviceName` |
| `DescribeCloudStorageOrder` | Describe cloud storage order<br>Required: `OrderId` |
| `DescribeBalanceTransactions` | Describe balance transactions<br>Required: `AccountType`, `Offset` (default 0), `Limit` |
| `DescribeDeviceDataHistory` | Describe device data history<br>Required: `MinTime`, `MaxTime`, `ProductId`, `DeviceName`, `FieldName` |
| `DescribePackageConsumeTask` | Describe package consume task<br>Required: `TaskId` |
| `DescribeFirmwareTaskDistribution` | Describe firmware task distribution<br>Required: `ProductID`, `FirmwareVersion`, `TaskId` |
| `DescribeCloudStorageStreamData` | Describe cloud storage stream data<br>Required: `ProductId`, `DeviceName`, `StartTime` |
| `DescribeBonuses` | Describe bonuses<br>Required: `Offset`, `Limit` |
| `DescribeCsReportCountDataInfo` | Describe cs report count data info<br>Required: `ProductId`, `DeviceName`, `StartTime`, `EndTime` |
| `DescribeCloudStorageEvents` | Describe cloud storage events<br>Required: `ProductId`, `DeviceName` |
| `DescribeModelDefinition` | Describe model definition<br>Required: `ProductId` |
| `DescribeDevices` | Describe devices<br>Required: `ProductId`, `Offset`, `Limit` |
| `DescribeCloudStoragePackageConsumeDetails` | Describe cloud storage package consume details<br>Required: `StartDate`, `EndDate` |
## Mutations (gated — need allowlist, 31)

| Action | What it does |
|---|---|
| `CallTRTCDevice` | Run call trtcdevice<br>Required: `ProductId`, `DeviceName` |
| `CreateAIDetection` | Create aidetection<br>Required: `ProductId`, `DeviceName`, `ModelId`, `StartTime`, `EndTime` |
| `CallDeviceActionSync` | Run call device action sync<br>Required: `ProductId`, `DeviceName`, `ActionId` |
| `GenerateSignedVideoURL` | Generate signed video url<br>Required: `VideoURL`, `ExpireTime` |
| `EditFirmware` | Run edit firmware<br>Required: `ProductID`, `FirmwareVersion`, `FirmwareName` |
| `PublishMessage` | Publish message<br>Required: `ProductId`, `DeviceName`, `Topic`, `Payload` |
| `ImportModelDefinition` | Import model definition<br>Required: `ProductId`, `ModelSchema` |
| `ReportAliveDevice` | Report alive device<br>Required: `ProductId`, `DeviceName` |
| `ControlDeviceData` | Run control device data<br>Required: `ProductId`, `DeviceName`, `Data` |
| `SetForwardAuth` | Set forward auth<br>Required: `Skey`, `QueueType` |
| `TransferCloudStorage` | Transfer cloud storage<br>Required: `ProductId`, `DeviceName`, `ToDeviceName` |
| `RetryDeviceFirmwareTask` | Retry device firmware task<br>Required: `ProductID`, `DeviceName`, `FirmwareVersion`, `TaskId` |
| `BatchUpdateFirmware` | Run batch update firmware<br>Required: `ProductID`, `FirmwareVersion` |
| `CreateProduct` | Create product<br>Required: `ProductName`, `DeviceType`, `ProductVaildYears`, `Features`, `ChipManufactureId`, `ChipId`, `ProductDescription`, `ChipOs` |
| `ChangeP2PRoute` | Run change p2 proute<br>Required: `ProductId`, `DeviceName`, `RouteId` |
| `InheritCloudStorageUser` | Run inherit cloud storage user<br>Required: `ProductId`, `DeviceName`, `UserId`, `ToUserId` |
| `UpdateAIModelChannel` | Update aimodel channel<br>Required: `ModelId`, `ProductId`, `Type` |
| `CallDeviceActionAsync` | Run call device action async<br>Required: `ProductId`, `DeviceName`, `ActionId` |
| `CreateCOSCredentials` | Create coscredentials<br>Required: `ProductId`, `DeviceName` |
| `CreateFreeCloudStorage` | Create free cloud storage<br>Required: `ProductId`, `DeviceName`, `PackageId` |
| `CreateBatch` | Create batch<br>Required: `ProductId`, `DevNum`, `DevPre` |
| `CreateCloudStorage` | Create cloud storage<br>Required: `ProductId`, `DeviceName`, `PackageId` |
| `WakeUpDevice` | Run wake up device<br>Required: `ProductId`, `DeviceName` |
| `CreateForwardRule` | Create forward rule<br>Required: `ProductID`, `MsgType`, `Skey`, `QueueRegion`, `QueueType` |
| `BindCloudStorageUser` | Bind cloud storage user<br>Required: `ProductId`, `DeviceName`, `UserId` |
| `CreateDeviceChannel` | Create device channel<br>Required: `ProductId`, `DeviceName`, `ChannelId` |
| `GenSingleDeviceSignatureOfPublic` | Run gen single device signature of public<br>Required: `ProductId`, `DeviceName`, `Expire` |
| `CreateTaskFileUrl` | Create task file url<br>Required: `ProductId` |
| `UploadFirmware` | Upload firmware<br>Required: `ProductID`, `FirmwareVersion`, `Md5sum`, `FileSize` |
| `CreateDataForward` | Create data forward<br>Required: `ProductId`, `ForwardAddr` |
| `ApplyAIModel` | Run apply aimodel<br>Required: `ModelId`, `ProductId` |

## Blocked destructive actions (18)

`ModifyDeviceLogLevel`, `ModifyPushChannel`, `CancelDeviceFirmwareTask`, `ModifyDevice`, `ModifyDataForward`, `DeleteProduct`, `ModifyDataForwardStatus`, `ResetCloudStorage`, `DeleteFirmware`, `ModifyProduct`, `ModifyForwardRule`, `CancelAIModelApplication`, `DeleteCloudStorageEvent`, `DeleteForwardRule`, `ModifyProductDynamicRegister`, `DeleteDevice`, `ResetCloudStorageEvent`, `ModifyModelDefinition` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iotvideo`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20211125` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iotvideo"`) for the allow/block decision and reason.

---
name: tencent-iotexplorer
description: Tencent Cloud IOTEXPLORER via the Tencent MCP server — 252 actions in API version v20190423 (107 read-only auto-allowed). Use for device, cloud, storage, talk, product, aiservice. Triggers on mentions of iotexplorer, device, cloud, storage, talk, product, aiservice, bind, topic. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: IoT devices & spaces
metadata:
  version: "4"
---

# Tencent Cloud IOTEXPLORER

IoT devices & spaces: 252 actions in API version `v20190423` — 107 read-only (auto-allowed), 89 gated mutations, 56 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iotexplorer"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Devices authenticate with per-device credentials (certificates or keys) created at device registration — capture them then; they are not re-readable.
Products define the device model (data template) — create and finalize the product before bulk-registering devices under it.
Rules bridge device data to downstream services — test rules with a single device's shadow/message before enabling fleet-wide.
Firmware/OTA tasks roll out async across the fleet — stage by batches and monitor upgrade status per device cohort.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iotexplorer/v20190423 — action signatures in `iotexplorer_client.ts`, full request/response shapes in `iotexplorer_models.ts`.

## Read actions (auto-allowed, 107)

| Action | What it does |
|---|---|
| `GetCOSURL` | Get cosurl<br>Required: `ProductID`, `FirmwareVersion` |
| `DescribeDevicePackages` | Describe device packages<br>Required: `ProductId`, `DeviceName`, `Limit`, `Offset` |
| `DescribeFirmwareUpdateStatus` | Describe firmware update status<br>Required: `ProductId`, `DeviceName` |
| `DescribeAISearchTaskAsync` | Describe aisearch task async<br>Required: `TaskId` |
| `DescribeP2PRoute` | Describe p2 proute<br>Required: `ProductId`, `DeviceName` |
| `DescribeCloudStorageEventsWithAITasks` | Describe cloud storage events with aitasks<br>Required: `ProductId`, `DeviceName`, `ServiceTypes` |
| `DescribeTopicPolicy` | Describe topic policy<br>Required: `ProductId`, `TopicName` |
| `GetProjectList` | Get project list |
| `ListTWeSeePersons` | List twe see persons<br>Required: `ProductId`, `DeviceName`, `Limit` |
| `CheckFirmwareUpdate` | Check firmware update<br>Required: `ProductId`, `DeviceName` |
| `GetDeviceLocationHistory` | Get device location history<br>Required: `ProductId`, `DeviceName`, `StartTime`, `EndTime` |
| `ListEventHistory` | List event history<br>Required: `ProductId`, `DeviceName` |
| `DescribeStudioProduct` | Describe studio product<br>Required: `ProductId` |
| `ListProductOtaModules` | List product ota modules<br>Required: `ProductID` |
| `GetLoRaGatewayList` | Get lo ra gateway list<br>Required: `IsCommunity` |
| `DescribeTWeSeePerson` | Describe twe see person<br>Required: `DeviceName`, `PersonId`, `ProductId` |
| `GetBatchProductionsList` | Get batch productions list<br>Required: `ProjectId` |
| `DescribeCloudStorageThumbnailList` | Describe cloud storage thumbnail list<br>Required: `ProductId`, `DeviceName`, `ThumbnailList` |
| `GetTWeTalkActiveStatus` | Get twe talk active status |
| `DescribeProductCloudStorageAIService` | Describe product cloud storage aiservice<br>Required: `ProductId` |
| `DescribePackageConsumeTasks` | Describe package consume tasks<br>Required: `Limit`, `Offset` |
| `DescribeCloudStoragePackageConsumeStats` | Describe cloud storage package consume stats<br>Required: `StartDate`, `EndDate` |
| `GetGatewaySubDeviceList` | Get gateway sub device list<br>Required: `GatewayProductId`, `GatewayDeviceName`, `Offset`, `Limit` |
| `DescribeActivateDevice` | Describe activate device<br>Required: `InstanceId` |
| `DescribeBindedProducts` | Describe binded products<br>Required: `GatewayProductId`, `Offset`, `Limit` |
| `DescribeDevice` | Describe device<br>Required: `ProductId`, `DeviceName` |
| `DescribeUnbindedDevices` | Describe unbinded devices<br>Required: `ProductId`, `Offset`, `Limit` |
| `DescribeTWeTalkProductConfigV2` | Describe twe talk product config v2<br>Required: `ProductId` |
| `DescribeCloudStorageAIService` | Describe cloud storage aiservice<br>Required: `ProductId`, `DeviceName`, `ServiceType` |
| `DescribeTWeSeeTaskStatistics` | Describe twe see task statistics |
| `DescribeFenceBindList` | Describe fence bind list<br>Required: `FenceId` |
| `DescribeCloudStorageDate` | Describe cloud storage date<br>Required: `ProductId`, `DeviceName` |
| `DescribeFreeCloudStorageNum` | Describe free cloud storage num |
| `DescribeTWeTalkAIBot` | Describe twe talk aibot<br>Required: `BotId` |
| `DescribeCloudStorageUsers` | Describe cloud storage users<br>Required: `ProductId`, `DeviceName`, `Limit`, `Offset` |
| `DescribeVideoLicense` | Describe video license<br>Required: `InstanceId` |
| `GetTWeTalkProductConfigList` | Get twe talk product config list |
| `SearchStudioProduct` | Search studio product |
| `ListOtaModules` | List ota modules<br>Required: `PageNum`, `PageSize` |
| `DescribeFirmwareTasks` | Describe firmware tasks<br>Required: `ProductID`, `FirmwareVersion`, `Offset`, `Limit` |
| `DescribeTWeTalkAgentList` | Describe twe talk agent list |
| `ListTWeSeeTasks` | List twe see tasks<br>Required: `DeviceName`, `Limit`, `ProductId`, `ServiceCategory` |
| `ListFirmwares` | List firmwares<br>Required: `PageNum`, `PageSize` |
| `GetTWeTalkAIBotList` | Get twe talk aibot list |
| `DescribeFenceEventList` | Describe fence event list<br>Required: `StartTime`, `EndTime` |
| `DescribeFirmwareTask` | Describe firmware task<br>Required: `ProductID`, `FirmwareVersion`, `TaskId` |
| `DescribeFirmwareTaskDevices` | Describe firmware task devices<br>Required: `ProductID`, `FirmwareVersion` |
| `DescribeLoRaFrequency` | Describe lo ra frequency |
| `DescribeCloudStorageTime` | Describe cloud storage time<br>Required: `ProductId`, `DeviceName`, `Date` |
| `GetTopicRuleList` | Get topic rule list<br>Required: `PageNum`, `PageSize` |
| `DescribeCloudStorageThumbnail` | Describe cloud storage thumbnail<br>Required: `ProductId`, `DeviceName`, `Thumbnail` |
| `DescribeCloudStorageMultiThumbnail` | Describe cloud storage multi thumbnail<br>Required: `ProductId`, `DeviceName`, `MultiThumbnail` |
| `DescribeTWeSeePostPaidService` | Describe twe see post paid service<br>Required: `ServiceType` |
| `DescribeTWeSeeSubscription` | Describe twe see subscription<br>Required: `ProductId`, `DeviceName`, `ServiceType` |
| `DescribeTopicRule` | Describe topic rule<br>Required: `RuleName` |
| `GetPositionSpaceList` | Get position space list<br>Required: `ProjectId`, `Offset`, `Limit` |
| `DescribeDeviceData` | Describe device data<br>Required: `ProductId`, `DeviceName` |
| `DescribeGatewayBindDevices` | Describe gateway bind devices<br>Required: `GatewayProductId`, `GatewayDeviceName`, `ProductId`, `Offset`, `Limit` |
| `GetTWeTalkActiveRecordList` | Get twe talk active record list |
| `DescribeLicenseOverview` | Describe license overview<br>Required: `InstanceId` |
| `DescribeCloudStorage` | Describe cloud storage<br>Required: `ProductId`, `DeviceName` |
| `GetWechatDeviceTicket` | Get wechat device ticket<br>Required: `ProductId`, `DeviceName` |
| `DescribeActivateLicenseService` | Describe activate license service<br>Required: `InstanceId` |
| `DescribeSubscribedTopicPolicy` | Describe subscribed topic policy<br>Required: `ProductId`, `DeviceName` |
| `SearchPositionSpace` | Search position space<br>Required: `ProjectId`, `SpaceName`, `Offset`, `Limit` |
| `DescribeSpaceFenceEventList` | Describe space fence event list<br>Required: `SpaceId`, `StartTime`, `EndTime` |
| `DescribeTWeSeeCallback` | Describe twe see callback<br>Required: `CallbackId` |
| `GetTWeTalkProductConfigListV2` | Get twe talk product config list v2<br>Required: `ProductId` |
| `DescribeProductDynamicRegister` | Describe product dynamic register<br>Required: `ProductId` |
| `DescribeGatewaySubProducts` | Describe gateway sub products<br>Required: `GatewayProductId` |
| `DescribeTWeSeeTask` | Describe twe see task<br>Required: `TaskId` |
| `DescribeDevicePositionList` | Describe device position list<br>Required: `ProductIdList` |
| `DescribeFirmware` | Describe firmware<br>Required: `ProductID`, `FirmwareVersion` |
| `DescribeDeviceFirmwares` | Describe device firmwares<br>Required: `ProductId`, `DeviceName` |
| `DescribeTWeTalkAgentBinding` | Describe twe talk agent binding |
| `DescribeTWeTalkProductConfig` | Describe twe talk product config<br>Required: `ProductId` |
| `GetStudioProductList` | Get studio product list |
| `DescribeModelDefinition` | Describe model definition<br>Required: `ProductId` |
| `DescribeGatewaySubDeviceList` | Describe gateway sub device list<br>Required: `GatewayProductId`, `GatewayDeviceName`, `Offset`, `Limit` |
| `GetDeviceSumStatistics` | Get device sum statistics<br>Required: `ProjectId` |
| `DescribeBatchProduction` | Describe batch production<br>Required: `ProductId`, `BatchProductionId` |
| `DescribeDeviceBindGateway` | Describe device bind gateway<br>Required: `ProductId`, `DeviceName` |
| `DescribeCloudStorageOrder` | Describe cloud storage order<br>Required: `OrderId` |
| `DescribeDeviceDataHistory` | Describe device data history<br>Required: `MinTime`, `MaxTime`, `ProductId`, `DeviceName`, `FieldName` |
| `DescribeTWeSeeFace` | Describe twe see face<br>Required: `ProductId`, `DeviceName`, `FaceId` |
| `DescribePackageConsumeTask` | Describe package consume task<br>Required: `TaskId` |
| `DescribeCloudStorageAIServiceCallback` | Describe cloud storage aiservice callback<br>Required: `ProductId` |
| `GetDeviceList` | Get device list<br>Required: `ProductId` |
| `ListTopicPolicy` | List topic policy<br>Required: `ProductId` |
| `DescribeCloudStorageAIServiceTask` | Describe cloud storage aiservice task<br>Required: `TaskId` |
| `DescribeInstance` | Describe instance<br>Required: `InstanceId` |
| `DescribeCloudStorageStreamData` | Describe cloud storage stream data<br>Required: `ProductId`, `DeviceName`, `StartTime` |
| `GetAuthMiniProgramAppList` | Get auth mini program app list |
| `GetTWeCallActiveStatus` | Get twe call active status |
| `DescribePositionFenceList` | Describe position fence list<br>Required: `SpaceId` |
| `DescribeCloudStorageAIServiceTasks` | Describe cloud storage aiservice tasks<br>Required: `ProductId`, `DeviceName`, `ServiceType`, `Limit` |
| `ListTWeSeeCallback` | List twe see callback<br>Required: `Limit` (range 1-100) |
| `SearchTopicRule` | Search topic rule<br>Required: `RuleName` |
| `DescribeCsReportCountDataInfo` | Describe cs report count data info<br>Required: `ProductId`, `DeviceName`, `StartTime`, `EndTime` |
| `DescribeCloudStorageEvents` | Describe cloud storage events<br>Required: `ProductId`, `DeviceName` |
| `GetFamilyDeviceUserList` | Get family device user list<br>Required: `ProductId`, `DeviceName` |
| `DescribeProject` | Describe project<br>Required: `ProjectId` |
| `DescribeTWeTalkAgent` | Describe twe talk agent<br>Required: `AgentId` |
| `DescribeTWeSeeConfig` | Describe twe see config<br>Required: `ProductId`, `DeviceName` |
| `DescribeDeviceFirmWare` | Describe device firm ware<br>Required: `ProductId`, `DeviceName` |
| `DescribeTWeSeeRecognitionTask` | Describe twe see recognition task<br>Required: `TaskId` |
| `DescribeCloudStoragePackageConsumeDetails` | Describe cloud storage package consume details<br>Required: `StartDate`, `EndDate` |
## Mutations (gated — need allowlist, 89)

| Action | What it does |
|---|---|
| `InquireTWeSeeSubscriptionCreatePrice` | Run inquire twe see subscription create price<br>Required: `ServiceType`, `ServiceTier`, `Period` |
| `ActivateTWeTalk` | Activate twe talk<br>Required: `ServiceType` |
| `InvokeVideosKeywordsAnalyzer` | Invoke videos keywords analyzer<br>Required: `ProductId`, `DeviceName`, `StartTimeMs`, `EndTimeMs` |
| `RevokeShareDeviceFromUser` | Revoke share device from user<br>Required: `AppKey`, `ProductId`, `DeviceName`, `OwnerOpenID`, `ToOpenID` |
| `CreateCloudStorageAIService` | Create cloud storage aiservice<br>Required: `ProductId`, `DeviceName`, `PackageId` |
| `CreateTWeSeeCallback` | Create twe see callback<br>Required: `Type`, `CallbackUrl` |
| `UnbindTWeTalkAgent` | Unbind twe talk agent<br>Required: `ProductId`, `AgentId` |
| `CallDeviceActionSync` | Run call device action sync<br>Required: `ProductId`, `DeviceName`, `ActionId` |
| `DirectBindDeviceInFamily` | Run direct bind device in family<br>Required: `IotAppID`, `UserID`, `FamilyId`, `ProductId`, `DeviceName` |
| `GenerateSignedVideoURL` | Generate signed video url<br>Required: `VideoURL`, `ExpireTime` |
| `CreateTWeSeeRecognitionTask` | Create twe see recognition task<br>Required: `ProductId`, `DeviceName`, `InputURL` |
| `CreateTRTCSignaturesWithRoomId` | Create trtcsignatures with room id<br>Required: `TRTCUserIds`, `RoomId` |
| `InvokeAISearchService` | Invoke aisearch service<br>Required: `ProductId`, `DeviceName`, `Query` |
| `BatchInvokeTWeSeeRecognitionTask` | Run batch invoke twe see recognition task<br>Required: `Inputs` |
| `ControlDeviceData` | Run control device data<br>Required: `ProductId`, `DeviceName`, `Data` |
| `CreateIotVideoCloudStorage` | Create iot video cloud storage<br>Required: `ProductId`, `DeviceName`, `PackageId` |
| `PublishFirmwareUpdateMessage` | Publish firmware update message<br>Required: `ProductID` |
| `CreateStudioProduct` | Create studio product<br>Required: `ProductName`, `CategoryId`, `ProductType`, `EncryptionType`, `NetType`, `DataProtocol`, `ProductDesc`, `ProjectId` |
| `CreateTWeSeePostPaidService` | Create twe see post paid service<br>Required: `ServiceType` |
| `TransferCloudStorage` | Transfer cloud storage<br>Required: `ProductId`, `DeviceName`, `ToDeviceName` |
| `CreateTWeSeeDirectUploadCredential` | Create twe see direct upload credential<br>Required: `ProductId`, `DeviceName`, `ServiceType` |
| `BatchUpdateFirmware` | Run batch update firmware<br>Required: `ProductID`, `FirmwareVersion` |
| `CreateDevicePublishSDPAnswer` | Create device publish sdpanswer<br>Required: `ProductId`, `DeviceName`, `SDPOffer` |
| `CallDeviceRRPCSync` | Run call device rrpcsync<br>Required: `ProductId`, `DeviceName` |
| `ChangeP2PRoute` | Run change p2 proute<br>Required: `ProductId`, `DeviceName`, `RouteId` |
| `CreateTWeSeeSubscription` | Create twe see subscription<br>Required: `ProductId`, `DeviceName`, `ServiceType`, `ServiceTier`, `Period` |
| `CreateTWeTalkAgent` | Create twe talk agent<br>Required: `STTConfig`, `LLMConfig`, `TTSConfig` |
| `InheritCloudStorageUser` | Run inherit cloud storage user<br>Required: `ProductId`, `DeviceName`, `UserId`, `ToUserId` |
| `RevokeBindUserDevice` | Revoke bind user device<br>Required: `AppKey`, `ProductId`, `DeviceName`, `OpenID` |
| `TransferTWeCallDevice` | Transfer twe call device |
| `CreateDevice` | Create device<br>Required: `ProductId`, `DeviceName` |
| `CreateTWeTalkProductConfig` | Create twe talk product config<br>Required: `ProductId`, `SystemPrompt`, `GreetingMessage` |
| `GenSingleDeviceSignatureOfPublic` | Run gen single device signature of public<br>Required: `ProductId`, `DeviceName`, `Expire` |
| `InvokeExternalSourceAIServiceTask` | Invoke external source aiservice task<br>Required: `ProductId`, `ServiceType`, `VideoURLs` |
| `CreateTWeTalkProductConfigV2` | Create twe talk product config v2<br>Required: `ProductId` |
| `CallDeviceActionAsync` | Run call device action async<br>Required: `ProductId`, `DeviceName`, `ActionId` |
| `InvokeTWeSeeComprehension` | Invoke twe see comprehension<br>Required: `InputURL`, `ServiceType` |
| `CreateAISearchTaskAsync` | Create aisearch task async<br>Required: `ProductId`, `DeviceName`, `Query` |
| `CreateTWeTalkAIBot` | Create twe talk aibot<br>Required: `Name` |
| `PublishBroadcastMessage` | Publish broadcast message<br>Required: `ProductId`, `Payload`, `Qos` |
| `UnbindProducts` | Unbind products<br>Required: `GatewayProductId`, `ProductIds` |
| `DismissRoomByStrRoomIdFromTRTC` | Dismiss room by str room id from trtc<br>Required: `RoomId` |
| `CreatePositionFence` | Create position fence<br>Required: `SpaceId`, `FenceName`, `FenceArea` |
| `CreateLoRaGateway` | Create lo ra gateway<br>Required: `GatewayId`, `Name`, `Description`, `Location` |
| `CreateTopicRule` | Create topic rule<br>Required: `RuleName`, `TopicRulePayload` |
| `UpdateOtaModule` | Update ota module<br>Required: `ProductID`, `FwType` |
| `CreateLoRaFrequency` | Create lo ra frequency |
| `CreateTopicPolicy` | Create topic policy<br>Required: `ProductId`, `TopicName`, `Privilege` |
| `PublishRRPCMessage` | Publish rrpcmessage<br>Required: `ProductId`, `DeviceName`, `Payload` |
| `UpdateOtaTaskStatus` | Update ota task status<br>Required: `ProductId`, `TaskId`, `Status` |
| `BindUserDevice` | Bind user device<br>Required: `AppKey`, `ProductId`, `DeviceName`, `OpenID` |
| `UploadFirmware` | Upload firmware<br>Required: `ProductID`, `FirmwareVersion`, `Md5sum`, `FileSize` |
| `CreateFreeCloudStorage` | Create free cloud storage<br>Required: `ProductId`, `DeviceName`, `PackageId` |
| `UpdateDevicesEnableState` | Update devices enable state<br>Required: `DevicesItems`, `Status` |
| `InvokeCloudStorageAIServiceTask` | Invoke cloud storage aiservice task<br>Required: `ProductId`, `DeviceName`, `ServiceType`, `StartTime`, `EndTime` |
| `BindProducts` | Bind products<br>Required: `GatewayProductId`, `ProductIds` |
| `CreateDeviceSDPAnswer` | Create device sdpanswer<br>Required: `ProductId`, `DeviceName`, `SDPOffer` |
| `InquireTWeSeeSubscriptionRenewPrice` | Run inquire twe see subscription renew price<br>Required: `ProductId`, `DeviceName`, `ServiceType`, `Period` |
| `UpdateFirmware` | Update firmware<br>Required: `ProductID`, `DeviceName`, `FirmwareVersion`, `FirmwareOriVersion` |
| `CreateTWeSeeService` | Create twe see service<br>Required: `Service` |
| `CreateTWeSeePerson` | Create twe see person<br>Required: `ProductId`, `DeviceName`, `Name` |
| `CreateOtaModule` | Create ota module<br>Required: `ProductID`, `FwType` |
| `BindDevices` | Bind devices<br>Required: `GatewayProductId`, `GatewayDeviceName`, `ProductId`, `DeviceNames` |
| `UnbindTWeTalkAIBot` | Unbind twe talk aibot<br>Required: `BotId`, `ProductId` |
| `CreateBatchProduction` | Create batch production<br>Required: `ProjectId`, `ProductId`, `BurnMethod`, `GenerationMethod` |
| `CreateCloudStorageAIServiceTask` | Create cloud storage aiservice task<br>Required: `ProductId`, `DeviceName`, `ServiceType`, `StartTime`, `EndTime` |
| `DisableTopicRule` | Disable topic rule<br>Required: `RuleName` |
| `UnbindDevices` | Unbind devices<br>Required: `GatewayProductId`, `GatewayDeviceName`, `ProductId`, `DeviceNames` |
| `EnableTopicRule` | Enable topic rule<br>Required: `RuleName` |
| `ResumeWeCallDevice` | Resume we call device |
| `CreateExternalSourceAIServiceTask` | Create external source aiservice task<br>Required: `ProductId`, `ServiceType`, `VideoURLs` |
| `ActivateTWeCallLicense` | Activate twe call license<br>Required: `PkgType` |
| `UpdateDeviceTWeCallAuthorizeStatus` | Update device twe call authorize status |
| `CreateDeviceChannel` | Create device channel<br>Required: `ProductId`, `DeviceName`, `ChannelId` |
| `BindTWeTalkAgent` | Bind twe talk agent<br>Required: `ProductId`, `AgentId`, `BindingScope` |
| `CreateProject` | Create project<br>Required: `ProjectName`, `ProjectDesc` |
| `PublishMessage` | Publish message<br>Required: `ProductId`, `DeviceName`, `Topic`, `Payload` |
| `GenerateCloudStorageAIServiceTaskFileURL` | Generate cloud storage aiservice task file url<br>Required: `TaskId`, `FileName` |
| `ShareDeviceToUser` | Run share device to user<br>Required: `AppKey`, `ProductId`, `DeviceName`, `OwnerOpenID`, `ToOpenID` |
| `InvokeTWeSeeRecognitionTask` | Invoke twe see recognition task<br>Required: `ProductId`, `DeviceName`, `InputURL` |
| `CreateTWeSeeRecognitionTaskWithFile` | Create twe see recognition task with file<br>Required: `ProductId`, `DeviceName`, `InputBase64` |
| `BatchCreateTWeSeeRecognitionTask` | Run batch create twe see recognition task<br>Required: `Inputs` |
| `InvokeTWeSeeRecognitionTaskWithFile` | Invoke twe see recognition task with file<br>Required: `ProductId`, `DeviceName`, `InputBase64` |
| `PauseTWeCallDevice` | Pause twe call device |
| `ImportTWeSeeFaces` | Import twe see faces<br>Required: `ProductId`, `DeviceName`, `ImageURL` |
| `BindTWeTalkAIBot` | Bind twe talk aibot<br>Required: `BotId`, `ProductId` |
| `BindCloudStorageUser` | Bind cloud storage user<br>Required: `ProductId`, `DeviceName`, `UserId` |
| `CreatePositionSpace` | Create position space<br>Required: `ProjectId`, `SpaceName`, `AuthorizeType`, `ProductIdList` |
| `CreateFenceBind` | Create fence bind<br>Required: `FenceId`, `Items` |

## Blocked destructive actions (56)

`ModifyStudioProduct`, `DeleteTWeSeePerson`, `RenewTWeSeeSubscription`, `ReleaseStudioProduct`, `ModifyFenceBind`, `DeletePositionSpace`, `ModifyLoRaGateway`, `DeleteTopicRule`, `DeleteOtaModule`, `ModifyTWeSeeConfig`, `DeleteLoRaGateway`, `DeleteTWeSeeCallback`, `ModifyTWeTalkProductConfig`, `ModifyTWeSeeCallback`, `ModifyCloudStorageAIServiceCallback`, `ModifyTWeSeeSubscription`, `DeleteFenceBind`, `DeleteTWeTalkProductConfigV2`, `ModifyTWeTalkProductConfigV2`, `ResetCloudStorage`, `ModifyTWeSeePerson`, `ModifyPositionSpace`, `ModifyTWeSeeFace`, `ModifyLoRaFrequency`, `DeleteProject`, `TerminateTWeSeeSubscription`, `DeleteStudioProduct`, `ModifyTWeTalkAgent`, `ModifyProductCloudStorageAIService`, `ModifyTWeTalkAIBot`, `ModifyApplication`, `ModifyTWeSeeSubscriptionRenewFlag`, `ModifyProject`, `ResetTWeCallDevice`, `ModifyTopicPolicy`, `RemoveUserByRoomIdFromTRTC`, `DestroyTWeSeeSubscription`, `ModifyCloudStorageAIService`, `ResetCloudStorageAIService`, `DeleteCloudStorageEvent`, `DeleteDevices`, `DeleteTWeTalkAIBot`, `ModifyProductDynamicRegister`, `DeleteTWeSeeTasksByCondition`, `ModifyPositionFence`, `DeleteDevice`, `DeleteDeviceSDP`, `DeleteLoRaFrequency`, `ResetCloudStorageEvent`, `ModifySpaceProperty`, `DeleteTopicPolicy`, `DeleteTWeTalkAgent`, `DeletePositionFence`, `ModifyModelDefinition`, `DeleteTWeSeeFace`, `ModifyTopicRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iotexplorer`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190423` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iotexplorer"`) for the allow/block decision and reason.

---
name: tencent-ckafka
description: Tencent Cloud CKAFKA via the Tencent MCP server — 105 actions in API version v20190819 (37 read-only auto-allowed). Use for datahub, topic, message, attributes, connect, fetch. Triggers on mentions of ckafka, datahub, topic, message, attributes, connect, fetch, route, ckafka. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud CKAFKA

Messaging & eventing: 105 actions in API version `v20190819` — 37 read-only (auto-allowed), 38 gated mutations, 30 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ckafka"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ckafka/v20190819 — action signatures in `ckafka_client.ts`, full request/response shapes in `ckafka_models.ts`.

## Read actions (auto-allowed, 37)

| Action | What it does |
|---|---|
| `DescribeGroupInfo` | Describe group info<br>Required: `InstanceId`, `GroupList` |
| `DescribeCvmInfo` | Describe cvm info<br>Required: `InstanceId` |
| `DescribeUser` | Describe user<br>Required: `InstanceId` |
| `DescribeDatahubGroupOffsets` | Describe datahub group offsets<br>Required: `Name`, `Group` |
| `DescribeConsumerGroup` | Describe consumer group<br>Required: `InstanceId` |
| `DescribeDatahubTask` | Describe datahub task<br>Required: `TaskId` |
| `CheckCdcCluster` | Check cdc cluster<br>Required: `TaskId` |
| `DescribeTopicFlowRanking` | Describe topic flow ranking<br>Required: `InstanceId`, `RankingType` |
| `DescribeInstancesDetail` | Describe instances detail |
| `DescribeTopicAttributes` | Describe topic attributes<br>Required: `InstanceId`, `TopicName` |
| `DescribeAclRule` | Describe acl rule<br>Required: `InstanceId` |
| `DescribePrometheus` | Describe prometheus<br>Required: `InstanceId` |
| `DescribeDatahubTasks` | Describe datahub tasks |
| `DescribeInstanceAttributes` | Describe instance attributes<br>Required: `InstanceId` |
| `DescribeTopicSyncReplica` | Describe topic sync replica<br>Required: `InstanceId`, `TopicName` |
| `DescribeDatahubTopic` | Describe datahub topic<br>Required: `Name` |
| `DescribeCkafkaZone` | Describe ckafka zone |
| `DescribeRoute` | Describe route<br>Required: `InstanceId` |
| `DescribeConnectResource` | Describe connect resource<br>Required: `ResourceId` |
| `DescribeCkafkaVersion` | Describe ckafka version<br>Required: `InstanceId` |
| `DescribeACL` | Describe acl<br>Required: `InstanceId`, `ResourceType` |
| `DescribeTaskStatus` | Describe task status<br>Required: `FlowId` |
| `DescribeThrottleRules` | Describe throttle rules<br>Required: `InstanceId` |
| `DescribeTopicProduceConnection` | Describe topic produce connection<br>Required: `InstanceId`, `TopicName` |
| `DescribeTopic` | Describe topic<br>Required: `InstanceId` |
| `DescribeConnectResources` | Describe connect resources |
| `DescribeModifyType` | Describe modify type<br>Required: `InstanceId`, `BandWidth`, `DiskSize`, `DiskType`, `Partition`, `Topic`, `Type` |
| `DescribeTypeInstances` | Describe type instances |
| `DescribeDatahubTopics` | Describe datahub topics |
| `DescribeSecurityGroupRoutes` | Describe security group routes |
| `DescribeGroup` | Describe group<br>Required: `InstanceId` |
| `DescribeInstances` | Describe instances |
| `DescribeAccessPolicy` | Describe access policy<br>Required: `InstanceId`, `RouteId` |
| `DescribeTopicDetail` | Describe topic detail<br>Required: `InstanceId` |
| `DescribeTopicSubscribeGroup` | Describe topic subscribe group<br>Required: `InstanceId`, `TopicName` |
| `DescribeGroupOffsets` | Describe group offsets<br>Required: `InstanceId`, `Group` |
| `DescribeRegion` | Describe region |
## Mutations (gated — need allowlist, 38)

| Action | What it does |
|---|---|
| `CreateMetaSyncDatahubTask` | Create meta sync datahub task<br>Required: `TaskName`, `SourceResourceId` (format `resource-test…`), `TargetResourceId` (format `resource-test…`) |
| `SendMessage` | Send message<br>Required: `DataHubId`, `Message` |
| `CreateTopic` | Create topic<br>Required: `InstanceId`, `TopicName`, `PartitionNum`, `ReplicaNum` |
| `CreatePartition` | Create partition<br>Required: `InstanceId`, `TopicName`, `PartitionNum` |
| `FetchLatestDatahubMessageList` | Fetch latest datahub message list<br>Required: `Name`, `Partition` |
| `CreateToken` | Create token<br>Required: `InstanceId`, `User` |
| `CreateMetaDataAndOffsetSyncDatahubTask` | Create meta data and offset sync datahub task<br>Required: `TaskName` (format `task-test…`), `SourceResourceId` (format `resource-test…`), `TargetResourceId` (format `resource-test…`) |
| `CreateMetaAndDataSyncDatahubTask` | Create meta and data sync datahub task<br>Required: `TaskName`, `SourceResourceId` (format `resource-test…`), `TargetResourceId` (format `resource-test…`) |
| `InstanceScalingDown` | Run instance scaling down<br>Required: `InstanceId`, `UpgradeStrategy` |
| `FetchMessageListByTimestamp` | Fetch message list by timestamp<br>Required: `InstanceId`, `Topic` |
| `ResumeDatahubTask` | Resume datahub task<br>Required: `TaskId` |
| `CreateAclRule` | Create acl rule<br>Required: `InstanceId`, `ResourceType`, `PatternType`, `RuleName`, `RuleList` |
| `CreateUser` | Create user<br>Required: `InstanceId`, `Name` |
| `CreateThrottleRule` | Create throttle rule<br>Required: `InstanceId`, `ThrottleType` |
| `UpgradeBrokerVersion` | Upgrade broker version<br>Required: `InstanceId`, `Type`, `SourceVersion`, `TargetVersion` |
| `AssociateRoutesSecurityGroup` | Associate routes security group<br>Required: `InstanceRoutes`, `SecurityGroupId` |
| `FetchMessageListByOffset` | Fetch message list by offset<br>Required: `InstanceId`, `Topic`, `Partition`, `Offset` |
| `CreateDatahubTopic` | Create datahub topic<br>Required: `Name`, `PartitionNum`, `RetentionMs` |
| `CreateConnectResource` | Create connect resource<br>Required: `ResourceName`, `Type` |
| `FetchDatahubMessageByOffset` | Fetch datahub message by offset<br>Required: `Name`, `Partition`, `Offset` |
| `AuthorizeToken` | Authorize token<br>Required: `InstanceId`, `User`, `Tokens` |
| `DisassociateRoutesSecurityGroup` | Run disassociate routes security group<br>Required: `InstanceRoutes`, `SecurityGroupId` |
| `BatchModifyTopicAttributes` | Run batch modify topic attributes<br>Required: `InstanceId`, `Topic` |
| `CreateTopicIpWhiteList` | Create topic ip white list<br>Required: `InstanceId`, `TopicName`, `IpWhiteList` |
| `CreateInstancePre` | Create instance pre<br>Required: `InstanceName`, `ZoneId`, `Period`, `InstanceType`, `VpcId`, `SubnetId` |
| `CreatePostPaidInstance` | Create post paid instance<br>Required: `VpcId`, `SubnetId` |
| `BatchCreateAcl` | Run batch create acl<br>Required: `InstanceId`, `ResourceType`, `ResourceNames`, `RuleList` |
| `CreateDatahubTask` | Create datahub task<br>Required: `TaskName`, `TaskType` |
| `IsolatedInstancePre` | Run isolated instance pre<br>Required: `InstanceId` |
| `PauseDatahubTask` | Pause datahub task<br>Required: `TaskId` |
| `CreateConsumer` | Create consumer<br>Required: `InstanceId`, `GroupName` |
| `CreateRoute` | Create route<br>Required: `InstanceId`, `VipType` |
| `FetchMessageByOffset` | Fetch message by offset<br>Required: `InstanceId`, `Topic`, `Partition`, `Offset` |
| `CreateAcl` | Create acl<br>Required: `InstanceId`, `ResourceType`, `Operation`, `PermissionType` |
| `CreatePrometheus` | Create prometheus<br>Required: `InstanceId`, `VpcId`, `SubnetId` |
| `BatchModifyGroupOffsets` | Run batch modify group offsets<br>Required: `GroupName`, `InstanceId`, `Partitions` |
| `CreateCdcCluster` | Create cdc cluster<br>Required: `CdcId`, `CdcVpcId`, `CdcSubnetId`, `ZoneId`, `Bandwidth`, `DiskSize`, `DiskType`, `SystemDiskType` |
| `InquireCkafkaPrice` | Run inquire ckafka price<br>Required: `InstanceType` |

## Blocked destructive actions (30)

`ModifyInstancePre`, `DeleteConnectResource`, `DeleteGroupSubscribeTopic`, `ModifyAclRule`, `DeleteInstancePre`, `ModifyPassword`, `ModifyRouteSecurityGroups`, `ModifyDatahubTopic`, `CancelAuthorizationToken`, `DeleteDatahubTopic`, `DeleteAcl`, `DeleteThrottleRule`, `RestartDatahubTask`, `ModifyAccessPolicy`, `ModifyDatahubTask`, `RenewCkafkaInstance`, `DeleteRoute`, `ModifyTopicAttributes`, `ModifyGroupOffsets`, `ModifyInstanceAttributes`, `DeleteGroup`, `DeleteInstancePost`, `DeleteAclRule`, `DeleteUser`, `DeleteDatahubTask`, `ModifyThrottleRule`, `ModifyConnectResource`, `ModifyRoutineMaintenanceTask`, `DeleteRouteTriggerTime`, `DeleteTopic` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ckafka`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190819` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ckafka"`) for the allow/block decision and reason.

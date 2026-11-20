---
name: tencent-tdmq
description: Tencent Cloud TDMQ via the Tencent MCP server — 152 actions in API version v20200217 (65 read-only auto-allowed). Use for rocket, rabbit, mqvip, topic, environment, mqtopic. Triggers on mentions of tdmq, rocket, rabbit, mqvip, topic, environment, mqtopic, queue, role. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud TDMQ

Messaging & eventing: 152 actions in API version `v20200217` — 65 read-only (auto-allowed), 42 gated mutations, 45 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tdmq"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tdmq/v20200217 — action signatures in `tdmq_client.ts`, full request/response shapes in `tdmq_models.ts`.

## Read actions (auto-allowed, 65)

| Action | What it does |
|---|---|
| `DescribeRocketMQConsumeStats` | Describe rocket mqconsume stats<br>Required: `ClusterId`, `NamespaceId`, `ConsumerGroup` |
| `DescribeRabbitMQVirtualHost` | Describe rabbit mqvirtual host<br>Required: `InstanceId` |
| `DescribeRabbitMQExchanges` | Describe rabbit mqexchanges<br>Required: `InstanceId`, `VirtualHost` |
| `DescribeRocketMQMsgTrace` | Describe rocket mqmsg trace<br>Required: `ClusterId`, `EnvironmentId`, `TopicName`, `MsgId` |
| `DescribeRocketMQGeneralSKUs` | Describe rocket mqgeneral skus |
| `DescribeCmqTopics` | Describe cmq topics |
| `DescribeRocketMQConsumerConnections` | Describe rocket mqconsumer connections<br>Required: `ClusterId`, `NamespaceId`, `GroupId`, `Offset`, `Limit` |
| `DescribeRabbitMQVipInstances` | Describe rabbit mqvip instances |
| `DescribeRocketMQTopicStats` | Describe rocket mqtopic stats<br>Required: `ClusterId`, `NamespaceId`, `TopicName` |
| `DescribeRocketMQNamespaces` | Describe rocket mqnamespaces<br>Required: `ClusterId`, `Offset`, `Limit` |
| `DescribeCmqQueues` | Describe cmq queues |
| `DescribeEnvironments` | Describe environments<br>Required: `ClusterId` |
| `DescribeClusterDetail` | Describe cluster detail<br>Required: `ClusterId` |
| `DescribeRabbitMQPermission` | Describe rabbit mqpermission<br>Required: `InstanceId` |
| `DescribeRocketMQTopicMsgs` | Describe rocket mqtopic msgs<br>Required: `ClusterId`, `EnvironmentId`, `TopicName`, `StartTime`, `EndTime` |
| `DescribeRocketMQProducers` | Describe rocket mqproducers<br>Required: `ClusterId`, `NamespaceId`, `Topic`, `Offset`, `Limit` |
| `DescribeEnvironmentAttributes` | Describe environment attributes<br>Required: `EnvironmentId`, `ClusterId` |
| `DescribePublisherSummary` | Describe publisher summary<br>Required: `ClusterId`, `Namespace`, `Topic` |
| `DescribeRocketMQTopic` | Describe rocket mqtopic<br>Required: `ClusterId`, `NamespaceId`, `TopicName` |
| `DescribeRocketMQMigratingTopicList` | Describe rocket mqmigrating topic list<br>Required: `TaskId`, `Limit`, `Offset` |
| `DescribeCmqSubscriptionDetail` | Describe cmq subscription detail |
| `DescribeClusters` | Describe clusters |
| `GetTopicList` | Get topic list<br>Required: `EnvironmentId`, `ClusterId` |
| `DescribeRocketMQConsumerConnectionDetail` | Describe rocket mqconsumer connection detail<br>Required: `ClusterId`, `NamespaceId`, `GroupId`, `ClientId`, `Offset`, `Limit` |
| `DescribeRabbitMQVipInstance` | Describe rabbit mqvip instance<br>Required: `ClusterId` |
| `DescribeRocketMQTopicsByGroup` | Describe rocket mqtopics by group<br>Required: `ClusterId`, `NamespaceId`, `GroupId` |
| `DescribeRocketMQPublicAccessMonitorData` | Describe rocket mqpublic access monitor data<br>Required: `InstanceId`, `MetricName` |
| `DescribeSubscriptions` | Describe subscriptions<br>Required: `EnvironmentId`, `TopicName`, `ClusterId` |
| `DescribeCmqTopicDetail` | Describe cmq topic detail |
| `DescribeRocketMQVipInstanceDetail` | Describe rocket mqvip instance detail<br>Required: `ClusterId` |
| `DescribeRocketMQRoles` | Describe rocket mqroles<br>Required: `Offset` (default 0), `Limit` (default 10), `ClusterId` |
| `DescribeRabbitMQUser` | Describe rabbit mquser<br>Required: `InstanceId` |
| `DescribePulsarProInstanceDetail` | Describe pulsar pro instance detail<br>Required: `ClusterId` |
| `DescribeRocketMQSubscriptions` | Describe rocket mqsubscriptions<br>Required: `ClusterId`, `Namespace`, `Group`, `Offset`, `Limit` |
| `DescribeRocketMQCluster` | Describe rocket mqcluster<br>Required: `ClusterId` |
| `DescribeMsgTrace` | Describe msg trace<br>Required: `EnvironmentId`, `MsgId`, `ProduceTime` |
| `DescribeRabbitMQNodeList` | Describe rabbit mqnode list<br>Required: `InstanceId` |
| `DescribeBindVpcs` | Describe bind vpcs |
| `ExportRocketMQMessageDetail` | Export rocket mqmessage detail<br>Required: `ClusterId`, `EnvironmentId`, `TopicName`, `MsgId`, `IncludeMsgBody` |
| `DescribeRabbitMQQueues` | Describe rabbit mqqueues<br>Required: `InstanceId` |
| `DescribeRocketMQVipInstances` | Describe rocket mqvip instances |
| `DescribeRocketMQTopUsages` | Describe rocket mqtop usages<br>Required: `ClusterId`, `MetricName`, `Limit` |
| `DescribeAMQPClusters` | Describe amqpclusters<br>Required: `Offset`, `Limit` |
| `DescribeMqMsgTrace` | Describe mq msg trace<br>Required: `Protocol`, `MsgId` |
| `DescribeRocketMQGroups` | Describe rocket mqgroups<br>Required: `ClusterId`, `NamespaceId`, `Offset`, `Limit` (default 20) |
| `DescribeRocketMQEnvironmentRoles` | Describe rocket mqenvironment roles<br>Required: `ClusterId` |
| `DescribeRocketMQSmoothMigrationTask` | Describe rocket mqsmooth migration task<br>Required: `TaskId` |
| `DescribeRoles` | Describe roles<br>Required: `ClusterId` |
| `DescribeMsg` | Describe msg<br>Required: `EnvironmentId`, `MsgId`, `TopicName` |
| `DescribeRocketMQTopics` | Describe rocket mqtopics<br>Required: `Offset`, `Limit`, `ClusterId`, `NamespaceId` |
| `DescribeRocketMQClusters` | Describe rocket mqclusters<br>Required: `Offset`, `Limit` |
| `DescribeRabbitMQBindings` | Describe rabbit mqbindings<br>Required: `InstanceId`, `VirtualHost` |
| `DescribeNodeHealthOpt` | Describe node health opt<br>Required: `InstanceId` |
| `DescribeTopicMsgs` | Describe topic msgs<br>Required: `EnvironmentId`, `TopicName`, `StartTime`, `EndTime` |
| `DescribePulsarProInstances` | Describe pulsar pro instances |
| `DescribeRabbitMQQueueDetail` | Describe rabbit mqqueue detail<br>Required: `InstanceId`, `VirtualHost`, `QueueName` |
| `DescribeRocketMQMsg` | Describe rocket mqmsg<br>Required: `ClusterId`, `EnvironmentId`, `TopicName`, `MsgId`, `PulsarMsgId` |
| `DescribeTopics` | Describe topics<br>Required: `EnvironmentId`, `ClusterId` |
| `DescribeEnvironmentRoles` | Describe environment roles<br>Required: `ClusterId` |
| `DescribeBindClusters` | Describe bind clusters |
| `DescribeCmqQueueDetail` | Describe cmq queue detail<br>Required: `QueueName` |
| `DescribePublishers` | Describe publishers<br>Required: `ClusterId`, `Namespace`, `Topic` |
| `DescribeRocketMQPublicAccessPoint` | Describe rocket mqpublic access point<br>Required: `InstanceId` |
| `DescribeAllTenants` | Describe all tenants<br>Required: `Offset`, `Limit` |
| `DescribeNamespaceBundlesOpt` | Describe namespace bundles opt<br>Required: `ClusterName`, `TenantId`, `NamespaceName`, `NeedMetrics` |
## Mutations (gated — need allowlist, 42)

| Action | What it does |
|---|---|
| `CreateRocketMQRole` | Create rocket mqrole<br>Required: `RoleName`, `ClusterId` |
| `CreateCmqTopic` | Create cmq topic<br>Required: `TopicName` |
| `CreateRabbitMQUser` | Create rabbit mquser<br>Required: `InstanceId`, `User`, `Password` |
| `RewindCmqQueue` | Run rewind cmq queue<br>Required: `QueueName`, `StartConsumeTime` |
| `CreateTopic` | Create topic<br>Required: `EnvironmentId`, `TopicName`, `Partitions`, `ClusterId` |
| `CreateRocketMQGroup` | Create rocket mqgroup<br>Required: `GroupId`, `Namespaces`, `ReadEnable`, `BroadcastEnable`, `ClusterId` |
| `AcknowledgeMessage` | Run acknowledge message<br>Required: `MessageId`, `AckTopic` (default public/default), `SubName` |
| `CreateEnvironment` | Create environment<br>Required: `EnvironmentId`, `MsgTTL`, `ClusterId` |
| `ExecuteDisasterRecovery` | Execute disaster recovery |
| `CreateCmqSubscribe` | Create cmq subscribe<br>Required: `TopicName`, `SubscriptionName`, `Protocol`, `Endpoint` |
| `CreateRabbitMQVirtualHost` | Create rabbit mqvirtual host<br>Required: `InstanceId`, `VirtualHost` |
| `CreateCmqQueue` | Create cmq queue<br>Required: `QueueName` |
| `CreateRocketMQEnvironmentRole` | Create rocket mqenvironment role<br>Required: `EnvironmentId`, `RoleName`, `Permissions`, `ClusterId` |
| `ImportRocketMQTopics` | Import rocket mqtopics<br>Required: `Topics`, `TaskId` |
| `SetRocketMQPublicAccessPoint` | Set rocket mqpublic access point<br>Required: `InstanceId`, `Enabled` |
| `SendBatchMessages` | Send batch messages<br>Required: `Topic` (default public/default), `Payload` |
| `CreateSubscription` | Create subscription<br>Required: `EnvironmentId`, `TopicName`, `SubscriptionName`, `IsIdempotent`, `ClusterId` |
| `CreateRabbitMQBinding` | Create rabbit mqbinding<br>Required: `InstanceId`, `VirtualHost`, `Source`, `DestinationType`, `Destination` |
| `RetryRocketMQDlqMessage` | Retry rocket mqdlq message<br>Required: `ClusterId`, `NamespaceId`, `GroupName`, `MessageIds` |
| `ImportRocketMQConsumerGroups` | Import rocket mqconsumer groups<br>Required: `Groups`, `TaskId` |
| `VerifyRocketMQConsume` | Verify rocket mqconsume<br>Required: `ClusterId`, `NamespaceId`, `GroupId`, `MsgId`, `TopicName` |
| `CreateRabbitMQVipInstance` | Create rabbit mqvip instance<br>Required: `ZoneIds`, `VpcId`, `SubnetId`, `ClusterName` |
| `CreateRocketMQTopic` | Create rocket mqtopic<br>Required: `Topic`, `Namespaces`, `Type`, `ClusterId` |
| `CreateProCluster` | Create pro cluster<br>Required: `ZoneIds`, `ProductName`, `AutoRenewFlag`, `TimeSpan`, `ClusterName`, `AutoVoucher` (default 0) |
| `ReceiveMessage` | Run receive message<br>Required: `Topic` (default public/default), `SubscriptionName` |
| `SendCmqMsg` | Send cmq msg<br>Required: `QueueName`, `MsgContent`, `DelaySeconds` (default 0) |
| `UnbindCmqDeadLetter` | Unbind cmq dead letter<br>Required: `SourceQueueName` |
| `CreateRocketMQNamespace` | Create rocket mqnamespace<br>Required: `ClusterId`, `NamespaceId` |
| `CreateRocketMQTopicV2` | Create rocket mqtopic v2<br>Required: `Topic`, `Type`, `ClusterId`, `Namespace` |
| `CreateEnvironmentRole` | Create environment role<br>Required: `EnvironmentId`, `RoleName`, `Permissions`, `ClusterId` |
| `CreateRocketMQGroupV2` | Create rocket mqgroup v2<br>Required: `GroupId`, `Namespace`, `ReadEnable`, `BroadcastEnable`, `ClusterId` |
| `SendMessages` | Send messages<br>Required: `Topic` (default public/default), `Payload` |
| `CreateRole` | Create role<br>Required: `RoleName`, `Remark`, `ClusterId` |
| `ClearCmqQueue` | Run clear cmq queue<br>Required: `QueueName` |
| `CreateRocketMQMigrationTask` | Create rocket mqmigration task<br>Required: `ClusterId`, `Type` |
| `CreateRocketMQCluster` | Create rocket mqcluster<br>Required: `Name` |
| `PublishCmqMsg` | Publish cmq msg<br>Required: `TopicName`, `MsgContent` |
| `SendMsg` | Send msg<br>Required: `EnvironmentId`, `TopicName` (default 0), `MsgContent` |
| `SendRocketMQMessage` | Send rocket mqmessage<br>Required: `ClusterId`, `NamespaceId`, `TopicName`, `MsgBody` |
| `ClearCmqSubscriptionFilterTags` | Run clear cmq subscription filter tags<br>Required: `TopicName`, `SubscriptionName` |
| `CreateRocketMQVipInstance` | Create rocket mqvip instance<br>Required: `Name`, `Spec`, `StorageSize`, `ZoneIds`, `VpcInfo`, `TimeSpan` |
| `CreateRocketMQRouterRule` | Create rocket mqrouter rule<br>Required: `StartNow`, `Rule`, `SyncType` |

## Blocked destructive actions (45)

`DeleteEnvironments`, `DeleteCmqQueue`, `DeleteTopics`, `DeleteRocketMQGroup`, `DeleteProCluster`, `DeleteRocketMQRoles`, `ModifyPublicNetworkSecurityPolicy`, `ModifyRocketMQEnvironmentRole`, `ModifyRocketMQTopic`, `DeleteRocketMQNamespace`, `DeleteCmqTopic`, `ModifyRocketMQInstance`, `ModifyRocketMQGroup`, `DeleteCluster`, `ResetRocketMQConsumerOffSet`, `DeleteRabbitMQPermission`, `ModifyRabbitMQVirtualHost`, `ModifyRocketMQCluster`, `ModifyCluster`, `ModifyCmqSubscriptionAttribute`, `DeleteEnvironmentRoles`, `ResetMsgSubOffsetByTimestamp`, `ModifyRocketMQRole`, `DeleteRocketMQTopic`, `ModifyCmqQueueAttribute`, `ModifyRocketMQInstanceSpec`, `ModifyRabbitMQPermission`, `DeleteRocketMQCluster`, `DeleteRabbitMQUser`, `DeleteRoles`, `DeleteRabbitMQVirtualHost`, `ModifyEnvironmentAttributes`, `ModifyRabbitMQUser`, `ModifyCmqTopicAttribute`, `ModifyRabbitMQVipInstance`, `ModifyEnvironmentRole`, `ModifyTopic`, `ModifyRocketMQNamespace`, `DeleteRabbitMQVipInstance`, `DeleteRocketMQVipInstance`, `DeleteCmqSubscribe`, `DeleteRabbitMQBinding`, `ModifyRole`, `DeleteRocketMQEnvironmentRoles`, `DeleteSubscriptions` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tdmq`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200217` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tdmq"`) for the allow/block decision and reason.

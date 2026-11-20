---
name: tencent-trocket
description: Tencent Cloud TROCKET via the Tencent MCP server — 57 actions in API version v20230308 (28 read-only auto-allowed). Use for consumer, topic, migrating, message, label, migration. Triggers on mentions of trocket, consumer, topic, migrating, message, label, migration, role, route. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud TROCKET

Messaging & eventing: 57 actions in API version `v20230308` — 28 read-only (auto-allowed), 15 gated mutations, 14 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "trocket"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/trocket/v20230308 — action signatures in `trocket_client.ts`, full request/response shapes in `trocket_models.ts`.

## Read actions (auto-allowed, 28)

| Action | What it does |
|---|---|
| `DescribeSourceClusterGroupList` | Describe source cluster group list<br>Required: `TaskId` |
| `DescribeMigratingTopicList` | Describe migrating topic list<br>Required: `TaskId` |
| `DescribeMessageTrace` | Describe message trace<br>Required: `InstanceId`, `Topic`, `MsgId` |
| `DescribeTopicListByGroup` | Describe topic list by group<br>Required: `InstanceId` |
| `DescribeSmoothMigrationTaskList` | Describe smooth migration task list |
| `DescribeRoleList` | Describe role list<br>Required: `InstanceId` |
| `DescribeConsumerLabel` | Describe consumer label<br>Required: `InstanceId`, `Group`, `Label` |
| `DescribeMessage` | Describe message<br>Required: `InstanceId`, `Topic`, `MsgId` |
| `DescribeConsumerLabelList` | Describe consumer label list<br>Required: `InstanceId`, `Group` |
| `DescribeConsumerClient` | Describe consumer client<br>Required: `InstanceId`, `ClientId` |
| `DescribeMigratingGroupStats` | Describe migrating group stats<br>Required: `TaskId`, `GroupName` |
| `DescribeProductSKUs` | Describe product skus |
| `DescribeTopicStats` | Describe topic stats<br>Required: `Topic`, `InstanceId`, `GroupId` |
| `DescribeConsumerLag` | Describe consumer lag<br>Required: `InstanceId` |
| `DescribeConsumerGroup` | Describe consumer group<br>Required: `InstanceId` |
| `DescribeMessageList` | Describe message list<br>Required: `InstanceId`, `Topic`, `StartTime`, `EndTime`, `TaskRequestId` |
| `DescribeInstance` | Describe instance<br>Required: `InstanceId` |
| `DescribeTopicList` | Describe topic list<br>Required: `InstanceId` |
| `DescribeConsumerRouteVersionList` | Describe consumer route version list<br>Required: `Topic`, `InstanceId`, `Group` |
| `DescribeProducerList` | Describe producer list<br>Required: `InstanceId`, `Topic` |
| `DescribeInstanceList` | Describe instance list |
| `DescribeFusionInstanceList` | Describe fusion instance list |
| `DescribeConsumerGroupList` | Describe consumer group list<br>Required: `InstanceId` |
| `DescribeTopic` | Describe topic<br>Required: `InstanceId`, `Topic` |
| `DescribeMigrationTaskList` | Describe migration task list |
| `DescribeConsumerRouteConfig` | Describe consumer route config<br>Required: `Topic`, `InstanceId`, `Group` |
| `DescribeConsumerClientList` | Describe consumer client list<br>Required: `InstanceId` |
| `DescribeMigratingTopicStats` | Describe migrating topic stats<br>Required: `TaskId`, `TopicName` |
## Mutations (gated — need allowlist, 15)

| Action | What it does |
|---|---|
| `VerifyMessageConsumption` | Verify message consumption<br>Required: `InstanceId`, `Topic`, `MsgId` |
| `PutConsumerRouteConfig` | Put consumer route config<br>Required: `Topic`, `InstanceId`, `Group`, `Rules` |
| `CreateRole` | Create role<br>Required: `InstanceId`, `Role`, `PermWrite`, `PermRead`, `Remark` |
| `ImportSourceClusterConsumerGroups` | Import source cluster consumer groups<br>Required: `TaskId`, `GroupList` |
| `CreateConsumerLabel` | Create consumer label<br>Required: `InstanceId`, `Label`, `Group` |
| `SendMessage` | Send message<br>Required: `InstanceId`, `Topic`, `MsgBody` |
| `CreateConsumerGroup` | Create consumer group<br>Required: `InstanceId`, `MaxRetryTimes` (range 0～1000), `ConsumeEnable`, `ConsumeMessageOrderly` |
| `DoHealthCheckOnMigratingTopic` | Run do health check on migrating topic<br>Required: `TaskId`, `TopicName` |
| `ChangeMigratingTopicToNextStage` | Run change migrating topic to next stage<br>Required: `TaskId`, `TopicNameList` |
| `ImportSourceClusterTopics` | Import source cluster topics<br>Required: `TaskId`, `TopicList` |
| `CreateTopic` | Create topic<br>Required: `InstanceId`, `Topic`, `TopicType` |
| `CreateInstance` | Create instance<br>Required: `InstanceType`, `Name`, `SkuCode`, `VpcList` |
| `ResendDeadLetterMessage` | Run resend dead letter message<br>Required: `InstanceId`, `MessageIds` |
| `CreateMigrationTask` | Create migration task<br>Required: `InstanceId`, `Type` |
| `RollbackMigratingTopicStage` | Roll back migrating topic stage<br>Required: `TaskId`, `TopicName` |

## Blocked destructive actions (14)

`ModifyTopic`, `RemoveMigratingTopic`, `DeleteInstance`, `ResetConsumerGroupOffset`, `DeleteConsumerGroup`, `ModifyConsumerGroup`, `DeleteRole`, `ModifyInstanceEndpoint`, `ModifyRole`, `DeleteConsumerRouteConfig`, `DeleteConsumerLabel`, `DeleteTopic`, `DeleteSmoothMigrationTask`, `ModifyInstance` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `trocket`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230308` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="trocket"`) for the allow/block decision and reason.

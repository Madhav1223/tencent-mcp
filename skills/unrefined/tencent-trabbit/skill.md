---
name: tencent-trabbit
description: Tencent Cloud TRABBIT via the Tencent MCP server — 29 actions in API version v20230418 (12 read-only auto-allowed). Use for mqserverless, rabbit, exchange, host, queue, virtual. Triggers on mentions of trabbit, mqserverless, rabbit, exchange, host, queue, virtual, permission, binding. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud TRABBIT

Messaging & eventing: 29 actions in API version `v20230418` — 12 read-only (auto-allowed), 5 gated mutations, 12 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "trabbit"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/trabbit/v20230418 — action signatures in `trabbit_client.ts`, full request/response shapes in `trabbit_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `DescribeRabbitMQServerlessInstance` | Describe rabbit mqserverless instance<br>Required: `InstanceId` |
| `DescribeRabbitMQServerlessConsumers` | Describe rabbit mqserverless consumers<br>Required: `InstanceId` |
| `DescribeRabbitMQServerlessUser` | Describe rabbit mqserverless user<br>Required: `InstanceId` |
| `DescribeRabbitMQServerlessExchangeDetail` | Describe rabbit mqserverless exchange detail<br>Required: `InstanceId`, `VirtualHost`, `ExchangeName` |
| `DescribeRabbitMQServerlessVirtualHost` | Describe rabbit mqserverless virtual host<br>Required: `InstanceId` |
| `DescribeRabbitMQServerlessExchanges` | Describe rabbit mqserverless exchanges<br>Required: `InstanceId`, `VirtualHost` |
| `DescribeRabbitMQServerlessBindings` | Describe rabbit mqserverless bindings<br>Required: `InstanceId`, `VirtualHost` |
| `DescribeRabbitMQServerlessQueues` | Describe rabbit mqserverless queues<br>Required: `InstanceId` |
| `DescribeRabbitMQServerlessPermission` | Describe rabbit mqserverless permission<br>Required: `InstanceId` |
| `DescribeRabbitMQServerlessQueueDetail` | Describe rabbit mqserverless queue detail<br>Required: `InstanceId`, `VirtualHost`, `QueueName` |
| `DescribeRabbitMQServerlessConnection` | Describe rabbit mqserverless connection<br>Required: `InstanceId`, `VirtualHost` |
| `ListRabbitMQServerlessInstances` | List rabbit mqserverless instances |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `CreateRabbitMQServerlessVirtualHost` | Create rabbit mqserverless virtual host<br>Required: `InstanceId`, `VirtualHost` |
| `CreateRabbitMQServerlessUser` | Create rabbit mqserverless user<br>Required: `InstanceId`, `User`, `Password` |
| `CreateRabbitMQServerlessQueue` | Create rabbit mqserverless queue<br>Required: `InstanceId`, `VirtualHost`, `QueueName` |
| `CreateRabbitMQServerlessBinding` | Create rabbit mqserverless binding<br>Required: `InstanceId`, `VirtualHost`, `Source`, `DestinationType`, `Destination` |
| `CreateRabbitMQServerlessExchange` | Create rabbit mqserverless exchange<br>Required: `InstanceId`, `VirtualHost`, `ExchangeName`, `ExchangeType` |

## Blocked destructive actions (12)

`DeleteRabbitMQServerlessBinding`, `ModifyRabbitMQServerlessInstance`, `DeleteRabbitMQServerlessQueue`, `DeleteRabbitMQServerlessUser`, `DeleteRabbitMQServerlessVirtualHost`, `ModifyRabbitMQServerlessUser`, `ModifyRabbitMQServerlessVirtualHost`, `DeleteRabbitMQServerlessExchange`, `ModifyRabbitMQServerlessQueue`, `ModifyRabbitMQServerlessExchange`, `DeleteRabbitMQServerlessPermission`, `ModifyRabbitMQServerlessPermission` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `trabbit`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230418` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="trabbit"`) for the allow/block decision and reason.

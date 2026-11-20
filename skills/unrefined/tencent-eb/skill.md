---
name: tencent-eb
description: Tencent Cloud EB via the Tencent MCP server — 32 actions in API version v20210416 (15 read-only auto-allowed). Use for event, transformation, platform, connection, target, buses. Triggers on mentions of eb, event, transformation, platform, connection, target, buses, connections, events. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud EB

Messaging & eventing: 32 actions in API version `v20210416` — 15 read-only (auto-allowed), 12 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "eb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/eb/v20210416 — action signatures in `eb_client.ts`, full request/response shapes in `eb_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `GetPlatformEventTemplate` | Get platform event template<br>Required: `EventType` |
| `ListPlatformEventPatterns` | List platform event patterns<br>Required: `ProductType` |
| `ListTargets` | List targets<br>Required: `EventBusId`, `RuleId` |
| `CheckRule` | Check rule<br>Required: `Event`, `EventPattern` |
| `ListPlatformProducts` | List platform products |
| `GetTransformation` | Get transformation<br>Required: `EventBusId`, `RuleId`, `TransformationId` |
| `ListRules` | List rules<br>Required: `EventBusId` |
| `ListPlatformEventNames` | List platform event names<br>Required: `ProductType` |
| `DescribeLogTagValue` | Describe log tag value<br>Required: `StartTime`, `EndTime`, `EventBusId`, `GroupField`, `Page`, `Limit` |
| `GetRule` | Get rule<br>Required: `EventBusId`, `RuleId` |
| `SearchLog` | Search log<br>Required: `StartTime`, `EndTime`, `EventBusId`, `Page`, `Limit` (default 10) |
| `ListEventBuses` | List event buses |
| `GetEventBus` | Get event bus<br>Required: `EventBusId` |
| `CheckTransformation` | Check transformation<br>Required: `Input`, `Transformations` |
| `ListConnections` | List connections<br>Required: `EventBusId` |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `CreateTransformation` | Create transformation<br>Required: `EventBusId`, `RuleId`, `Transformations` |
| `CreateEventBus` | Create event bus<br>Required: `EventBusName` |
| `CreateRule` | Create rule<br>Required: `EventPattern`, `EventBusId`, `RuleName` |
| `PublishEvent` | Publish event<br>Required: `EventList`, `EventBusId` |
| `PutEvents` | Put events<br>Required: `EventList`, `EventBusId` |
| `UpdateTarget` | Update target<br>Required: `EventBusId`, `RuleId`, `TargetId` |
| `UpdateEventBus` | Update event bus<br>Required: `EventBusId` |
| `CreateTarget` | Create target<br>Required: `EventBusId`, `Type` (scf), `TargetDescription`, `RuleId` |
| `UpdateRule` | Update rule<br>Required: `RuleId`, `EventBusId` |
| `CreateConnection` | Create connection<br>Required: `ConnectionDescription`, `EventBusId`, `ConnectionName` |
| `UpdateTransformation` | Update transformation<br>Required: `EventBusId`, `RuleId`, `TransformationId`, `Transformations` |
| `UpdateConnection` | Update connection<br>Required: `ConnectionId`, `EventBusId` |

## Blocked destructive actions (5)

`DeleteEventBus`, `DeleteTarget`, `DeleteRule`, `DeleteTransformation`, `DeleteConnection` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `eb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210416` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="eb"`) for the allow/block decision and reason.

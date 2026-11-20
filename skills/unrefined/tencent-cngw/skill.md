---
name: tencent-cngw
description: Tencent Cloud CNGW via the Tencent MCP server — 52 actions in API version v20230418 (19 read-only auto-allowed). Use for apigateway, cloud, native, consumer, llmmodel, mcpserver. Triggers on mentions of cngw, apigateway, cloud, native, consumer, llmmodel, mcpserver, mcptool, secret. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud CNGW

Networking & traffic: 52 actions in API version `v20230418` — 19 read-only (auto-allowed), 12 gated mutations, 21 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cngw"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cngw/v20230418 — action signatures in `cngw_client.ts`, full request/response shapes in `cngw_models.ts`.

## Read actions (auto-allowed, 19)

| Action | What it does |
|---|---|
| `DescribeCloudNativeAPIGatewayLLMModelAPI` | Describe cloud native apigateway llmmodel api<br>Required: `GatewayId`, `ModelAPIId` |
| `DescribeCloudNativeAPIGatewayConsumerGroup` | Describe cloud native apigateway consumer group<br>Required: `GatewayId`, `ConsumerGroupId` |
| `DescribeCloudNativeAPIGatewayMCPServerACL` | Describe cloud native apigateway mcpserver acl<br>Required: `GatewayId`, `ServerId` |
| `DescribeCloudNativeAPIGatewayMCPToolACLList` | Describe cloud native apigateway mcptool acllist<br>Required: `GatewayId`, `ServerId`, `Limit`, `Offset` |
| `DescribeCloudNativeAPIGatewayMCPServer` | Describe cloud native apigateway mcpserver<br>Required: `GatewayId`, `ServerId` |
| `DescribeCloudNativeAPIGatewayLLMModelAPIs` | Describe cloud native apigateway llmmodel apis<br>Required: `GatewayId` |
| `DescribeCNGWServicesWithRoutes` | Describe cngwservices with routes<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayMCPServerList` | Describe cloud native apigateway mcpserver list<br>Required: `GatewayId`, `Limit`, `Offset` |
| `DescribeCloudNativeAPIGatewayMCPServerAuth` | Describe cloud native apigateway mcpserver auth<br>Required: `GatewayId`, `ServerId` |
| `DescribeCloudNativeAPIGatewayLLMModelService` | Describe cloud native apigateway llmmodel service<br>Required: `GatewayId`, `ModelServiceId` |
| `DescribeCloudNativeAPIGatewayLLMTokenUsageStatistics` | Describe cloud native apigateway llmtoken usage statistics<br>Required: `GatewayId`, `StartTime`, `EndTime` |
| `DescribeCloudNativeAPIGatewayMCPTool` | Describe cloud native apigateway mcptool<br>Required: `GatewayId`, `ServerId`, `ToolId` |
| `DescribeCloudNativeAPIGatewaySecretKeyValue` | Describe cloud native apigateway secret key value<br>Required: `GatewayId`, `SecretKeyId` |
| `DescribeCloudNativeAPIGatewayLLMTokenUsageList` | Describe cloud native apigateway llmtoken usage list<br>Required: `GatewayId`, `StartTime`, `EndTime` |
| `DescribeCloudNativeAPIGatewayMCPToolList` | Describe cloud native apigateway mcptool list<br>Required: `GatewayId`, `ServerId`, `Limit`, `Offset` |
| `DescribeCloudNativeAPIGatewayConsumer` | Describe cloud native apigateway consumer<br>Required: `GatewayId`, `ConsumerId` |
| `DescribeCloudNativeAPIGatewaySecretKey` | Describe cloud native apigateway secret key<br>Required: `GatewayId`, `SecretKeyId` |
| `DescribeCloudNativeAPIGatewayLLMModelServices` | Describe cloud native apigateway llmmodel services<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayMCPToolsFromFile` | Describe cloud native apigateway mcptools from file<br>Required: `Content`, `Format`, `GatewayId`, `MCPServerId` |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `CreateCloudNativeAPIGatewaySecretKey` | Create cloud native apigateway secret key<br>Required: `GatewayId`, `GenerateType`, `Name`, `ResourceType`, `SecretType` |
| `CreateCloudNativeAPIGatewayLLMModelAPI` | Create cloud native apigateway llmmodel api<br>Required: `GatewayId`, `Name`, `SceneType`, `RequestProtocol` (openai), `ListModelServiceId`, `RouteList` |
| `UnbindCloudNativeAPIGatewaySecretKey` | Unbind cloud native apigateway secret key<br>Required: `GatewayId`, `ResourceType`, `ResourceIds`, `SecretKeyId` |
| `CreateCloudNativeAPIGatewayLLMModelService` | Create cloud native apigateway llmmodel service<br>Required: `GatewayId`, `Name`, `ServiceType`, `ModelProvider`, `ModelProtocol`, `ModelSelector` |
| `AddCloudNativeAPIGatewayConsumerInGroup` | Add cloud native apigateway consumer in group<br>Required: `GatewayId`, `ConsumerGroupId`, `ConsumerIds` |
| `CreateCloudNativeAPIGatewayConsumerGroup` | Create cloud native apigateway consumer group<br>Required: `GatewayId`, `Name`, `Status` |
| `CreateCloudNativeAPIGatewayMCPTool` | Create cloud native apigateway mcptool<br>Required: `ContentType` |
| `UpdateCloudNativeAPIGatewayMCPTools` | Update cloud native apigateway mcptools<br>Required: `GatewayId`, `MCPServerId`, `Tools` |
| `CreateCloudNativeAPIGatewayMCPServer` | Create cloud native apigateway mcpserver<br>Required: `GatewayId`, `Name`, `DisplayName`, `ServerType`, `Transport`, `UpstreamType` |
| `AddCloudNativeAPIGatewayConsumerGroupAuth` | Add cloud native apigateway consumer group auth<br>Required: `GatewayId`, `ResourceType`, `ResourceId`, `ConsumerGroupIds` |
| `BindCloudNativeAPIGatewaySecretKey` | Bind cloud native apigateway secret key<br>Required: `GatewayId`, `ResourceType`, `ResourceIds`, `SecretKeyId` |
| `CreateCloudNativeAPIGatewayConsumer` | Create cloud native apigateway consumer<br>Required: `GatewayId`, `Name` |

## Blocked destructive actions (21)

`DeleteCloudNativeAPIGatewayConsumer`, `ModifyCloudNativeAPIGatewayConsumerGroup`, `DeleteCloudNativeAPIGatewayMCPServer`, `ModifyCloudNativeAPIGatewayMCPServerACL`, `RemoveCloudNativeAPIGatewayConsumerGroupAuth`, `DeleteCloudNativeAPIGatewayMCPTool`, `ModifyCloudNativeAPIGatewayMCPToolACL`, `ModifyCloudNativeAPIGatewayMCPToolStatus`, `ModifyCloudNativeAPIGatewayLLMModelService`, `RemoveCloudNativeAPIGatewayConsumerInGroup`, `ModifyCloudNativeAPIGatewayConsumer`, `ModifyCloudNativeAPIGatewayMCPServer`, `DeleteCloudNativeAPIGatewayLLMModelAPI`, `DeleteCloudNativeAPIGatewaySecretKey`, `ModifyCloudNativeAPIGatewayLLMModelAPI`, `ModifyCloudNativeAPIGatewayMCPTool`, `ModifyCloudNativeAPIGatewayMCPServerAuth`, `ModifyCloudNativeAPIGatewayMCPServerStatus`, `ModifyCloudNativeAPIGatewaySecretKey`, `DeleteCloudNativeAPIGatewayLLMModelService`, `DeleteCloudNativeAPIGatewayConsumerGroup` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cngw`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230418` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cngw"`) for the allow/block decision and reason.

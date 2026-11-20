---
name: tencent-tse
description: Tencent Cloud TSE via the Tencent MCP server — 161 actions in API version v20201207 (62 read-only auto-allowed). Use for native, cloud, apigateway, governance, consumer, llmmodel. Triggers on mentions of tse, native, cloud, apigateway, governance, consumer, llmmodel, gateway, limit. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: DevOps & app platforms
metadata:
  version: "4"
---

# Tencent Cloud TSE

DevOps & app platforms: 161 actions in API version `v20201207` — 62 read-only (auto-allowed), 41 gated mutations, 58 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tse"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Environments (dev/test/prod) are isolated — confirm which environment every deploy or config change targets.
Deployments are async with revisions — after release, poll the deployment/revision status until stable and keep the previous revision for rollback.
Service discovery and config centers decouple code from endpoints — update config entries explicitly; code deploys alone don't move traffic.
Microservice gateways need route publication after changes — unpublished edits serve stale behavior.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tse/v20201207 — action signatures in `tse_client.ts`, full request/response shapes in `tse_models.ts`.

## Read actions (auto-allowed, 62)

| Action | What it does |
|---|---|
| `DescribeOneCloudNativeAPIGatewayService` | Describe one cloud native apigateway service<br>Required: `GatewayId`, `Name` |
| `DescribeCloudNativeAPIGatewayServiceRateLimit` | Describe cloud native apigateway service rate limit<br>Required: `GatewayId`, `Name` |
| `DescribeGovernanceAliases` | Describe governance aliases<br>Required: `InstanceId` |
| `DescribeUpstreamHealthCheckConfig` | Describe upstream health check config<br>Required: `GatewayId`, `Name` |
| `DescribeCloudNativeAPIGateways` | Describe cloud native apigateways |
| `DescribeCloudNativeAPIGatewayServices` | Describe cloud native apigateway services<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayServicesLight` | Describe cloud native apigateway services light<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayLLMModelService` | Describe cloud native apigateway llmmodel service<br>Required: `GatewayId`, `ModelServiceId` |
| `DescribeZookeeperReplicas` | Describe zookeeper replicas<br>Required: `InstanceId` |
| `DescribeCloudNativeAPIGatewayCertificateDetails` | Describe cloud native apigateway certificate details<br>Required: `GatewayId`, `Id` |
| `DescribeAutoScalerResourceStrategies` | Describe auto scaler resource strategies<br>Required: `GatewayId` |
| `DescribeGovernanceServiceContracts` | Describe governance service contracts<br>Required: `InstanceId` |
| `DescribeCloudNativeAPIGatewayConsumerList` | Describe cloud native apigateway consumer list<br>Required: `GatewayId`, `Limit`, `Offset` |
| `DescribeAllConfigFileTemplates` | Describe all config file templates<br>Required: `InstanceId` |
| `DescribePublicNetwork` | Describe public network<br>Required: `GatewayId`, `GroupId`, `NetworkId` |
| `DescribeZookeeperServerInterfaces` | Describe zookeeper server interfaces |
| `DescribeCloudNativeAPIGatewayLLMModelAPI` | Describe cloud native apigateway llmmodel api<br>Required: `GatewayId`, `ModelAPIId` |
| `DescribeWafDomains` | Describe waf domains<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayConsumerGroup` | Describe cloud native apigateway consumer group<br>Required: `GatewayId`, `ConsumerGroupId` |
| `DescribeCloudNativeAPIGatewayLLMModelAPIs` | Describe cloud native apigateway llmmodel apis<br>Required: `GatewayId` |
| `DescribeInstanceTagInfos` | Describe instance tag infos<br>Required: `InstanceId` |
| `DescribeConfigFile` | Describe config file<br>Required: `InstanceId` |
| `DescribeConfigFileReleases` | Describe config file releases<br>Required: `InstanceId`, `Limit`, `Offset` |
| `DescribeCloudNativeAPIGatewayRouteRateLimit` | Describe cloud native apigateway route rate limit<br>Required: `GatewayId`, `Id` |
| `DescribeAutoScalerResourceStrategyBindingGroups` | Describe auto scaler resource strategy binding groups<br>Required: `GatewayId`, `StrategyId` |
| `DescribeCloudNativeAPIGatewayIPRestriction` | Describe cloud native apigateway iprestriction<br>Required: `GatewayId`, `SourceType`, `SourceId` |
| `DescribeConfigFileRelease` | Describe config file release<br>Required: `InstanceId` |
| `DescribeGovernanceNamespaces` | Describe governance namespaces<br>Required: `InstanceId` |
| `DescribeGovernanceServiceContractVersions` | Describe governance service contract versions<br>Required: `InstanceId`, `Namespace` |
| `DescribeCloudNativeAPIGatewayLLMModelServices` | Describe cloud native apigateway llmmodel services<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayPorts` | Describe cloud native apigateway ports<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayCanaryRules` | Describe cloud native apigateway canary rules<br>Required: `GatewayId`, `ServiceId` |
| `DescribeSREInstanceAccessAddress` | Describe sreinstance access address |
| `DescribeConfigFiles` | Describe config files<br>Required: `Namespace` |
| `DescribeNacosReplicas` | Describe nacos replicas<br>Required: `InstanceId` |
| `DescribeNativeGatewayServiceSources` | Describe native gateway service sources<br>Required: `GatewayID`, `Limit`, `Offset` |
| `DescribeCloudNativeAPIGatewayInfoByIp` | Describe cloud native apigateway info by ip<br>Required: `PublicNetworkIP` |
| `DescribeCloudNativeAPIGatewayCertificates` | Describe cloud native apigateway certificates<br>Required: `GatewayId` |
| `DescribeGovernanceInstances` | Describe governance instances<br>Required: `Service`, `Namespace`, `InstanceId` |
| `DescribeGovernanceServices` | Describe governance services |
| `DescribeGovernanceLaneGroups` | Describe governance lane groups<br>Required: `InstanceId`, `Offset`, `Limit` |
| `DescribeConfigFileReleaseVersions` | Describe config file release versions<br>Required: `InstanceId` |
| `DescribeSREInstances` | Describe sreinstances |
| `DescribeConfigFilesByGroup` | Describe config files by group<br>Required: `InstanceId`, `Namespace`, `Group` |
| `DescribeWafProtection` | Describe waf protection<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayConfig` | Describe cloud native apigateway config<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewaySecretKeyValue` | Describe cloud native apigateway secret key value<br>Required: `GatewayId`, `SecretKeyId` |
| `DescribeCloudNativeAPIGatewaySecretKey` | Describe cloud native apigateway secret key<br>Required: `GatewayId`, `SecretKeyId` |
| `DescribeConfigFileReleaseHistories` | Describe config file release histories<br>Required: `InstanceId` |
| `DescribeCloudNativeAPIGatewayUpstream` | Describe cloud native apigateway upstream<br>Required: `GatewayId`, `ServiceName` |
| `DescribeCloudNativeAPIGatewayConsumerGroupList` | Describe cloud native apigateway consumer group list<br>Required: `GatewayId`, `Limit` (default 10), `Offset` |
| `DescribePublicAddressConfig` | Describe public address config<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayRoutes` | Describe cloud native apigateway routes<br>Required: `GatewayId` |
| `DescribeConfigFileGroups` | Describe config file groups<br>Required: `InstanceId` |
| `DescribeCloudNativeAPIGateway` | Describe cloud native apigateway<br>Required: `GatewayId` |
| `DescribeCNGWServicesWithRoutes` | Describe cngwservices with routes<br>Required: `GatewayId` |
| `DescribeNacosServerInterfaces` | Describe nacos server interfaces |
| `DescribeCloudNativeAPIGatewayNodes` | Describe cloud native apigateway nodes<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewaySecretKeyList` | Describe cloud native apigateway secret key list<br>Required: `GatewayId`, `Limit` (default 10), `Offset` |
| `DescribeCloudNativeAPIGatewayConsumer` | Describe cloud native apigateway consumer<br>Required: `GatewayId`, `ConsumerId` |
| `DescribeNativeGatewayServerGroups` | Describe native gateway server groups<br>Required: `GatewayId` |
| `DescribeCloudNativeAPIGatewayCORS` | Describe cloud native apigateway cors<br>Required: `GatewayId`, `SourceType`, `SourceId` |
## Mutations (gated — need allowlist, 41)

| Action | What it does |
|---|---|
| `UpdateEngineInternetAccess` | Update engine internet access<br>Required: `InstanceId`, `EngineType` |
| `CreateGovernanceLaneGroups` | Create governance lane groups<br>Required: `InstanceId`, `LaneGroups` |
| `CreateConfigFileGroup` | Create config file group<br>Required: `InstanceId`, `ConfigFileGroup` |
| `CreateCloudNativeAPIGatewayCertificate` | Create cloud native apigateway certificate<br>Required: `GatewayId`, `CertId` |
| `CreateCloudNativeAPIGatewayCanaryRule` | Create cloud native apigateway canary rule<br>Required: `GatewayId`, `ServiceId` |
| `CreateOrModifyCloudNativeAPIGatewayCORS` | Create or modify cloud native apigateway cors<br>Required: `GatewayId`, `SourceType`, `SourceId`, `Enabled` |
| `UpdateCloudNativeAPIGatewayCertificateInfo` | Update cloud native apigateway certificate info<br>Required: `GatewayId`, `Id` |
| `CreateCloudNativeAPIGatewayLLMModelService` | Create cloud native apigateway llmmodel service<br>Required: `GatewayId`, `Name`, `ServiceType`, `ModelProvider`, `ModelProtocol`, `ModelSelector` |
| `PublishConfigFiles` | Publish config files<br>Required: `InstanceId`, `ConfigFileReleases` |
| `CloseWafProtection` | Close waf protection<br>Required: `GatewayId`, `Type` |
| `CreateCloudNativeAPIGateway` | Create cloud native apigateway<br>Required: `Name`, `Type`, `GatewayVersion`, `NodeConfig`, `VpcConfig` |
| `UpdateUpstreamTargets` | Update upstream targets<br>Required: `GatewayId`, `Name` |
| `CreateCloudNativeAPIGatewayRoute` | Create cloud native apigateway route<br>Required: `GatewayId`, `ServiceID` |
| `CreateGovernanceInstances` | Create governance instances<br>Required: `InstanceId`, `GovernanceInstances` |
| `CreateCloudNativeAPIGatewaySecretKey` | Create cloud native apigateway secret key<br>Required: `GatewayId`, `SecretType`, `Name`, `GenerateType`, `ResourceType` |
| `CreateCloudNativeAPIGatewayLLMModelAPI` | Create cloud native apigateway llmmodel api<br>Required: `GatewayId`, `Name`, `SceneType`, `RequestProtocol`, `ListModelServiceId`, `RouteList` |
| `CreateNativeGatewayServiceSource` | Create native gateway service source<br>Required: `GatewayID`, `SourceType` |
| `CreateGovernanceAlias` | Create governance alias<br>Required: `InstanceId`, `Alias`, `AliasNamespace`, `Service`, `Namespace` |
| `UnbindAutoScalerResourceStrategyFromGroups` | Unbind auto scaler resource strategy from groups<br>Required: `GatewayId`, `StrategyId`, `GroupIds` |
| `CreateCloudNativeAPIGatewayConsumerGroup` | Create cloud native apigateway consumer group<br>Required: `GatewayId`, `Name`, `Status` |
| `CreateOrModifyCloudNativeAPIGatewayIPRestriction` | Create or modify cloud native apigateway iprestriction<br>Required: `GatewayId`, `SourceType`, `SourceId`, `Enabled`, `RestrictionType`, `AddressList` |
| `CreateGovernanceNamespaces` | Create governance namespaces<br>Required: `InstanceId`, `GovernanceNamespaces` |
| `AddCloudNativeAPIGatewayConsumerInGroup` | Add cloud native apigateway consumer in group<br>Required: `GatewayId`, `ConsumerGroupId`, `ConsumerIds` |
| `OpenWafProtection` | Open waf protection<br>Required: `GatewayId`, `Type` |
| `CreateCloudNativeAPIGatewayService` | Create cloud native apigateway service<br>Required: `GatewayId`, `Name`, `Protocol`, `Timeout`, `Retries`, `UpstreamType`, `UpstreamInfo` |
| `RollbackConfigFileReleases` | Roll back config file releases<br>Required: `InstanceId`, `RollbackConfigFileReleases` |
| `CreateNativeGatewayServerGroup` | Create native gateway server group<br>Required: `GatewayId`, `Name`, `NodeConfig`, `SubnetId` |
| `CreateAutoScalerResourceStrategy` | Create auto scaler resource strategy<br>Required: `GatewayId`, `StrategyName` |
| `CreateConfigFile` | Create config file<br>Required: `InstanceId`, `ConfigFile` |
| `CreateCloudNativeAPIGatewayConsumer` | Create cloud native apigateway consumer<br>Required: `GatewayId`, `Name` |
| `CreateOrUpdateConfigFileAndRelease` | Create or update config file and release<br>Required: `InstanceId`, `ConfigFilePublishInfo` |
| `CreateWafDomains` | Create waf domains<br>Required: `GatewayId`, `Domains` |
| `CreateEngine` | Create engine<br>Required: `EngineType`, `EngineVersion`, `EngineProductVersion`, `EngineRegion`, `EngineName`, `TradeType` |
| `BindAutoScalerResourceStrategyToGroups` | Bind auto scaler resource strategy to groups<br>Required: `GatewayId`, `StrategyId`, `GroupIds` |
| `CreateCloudNativeAPIGatewayRouteRateLimit` | Create cloud native apigateway route rate limit<br>Required: `GatewayId`, `Id`, `LimitDetail` |
| `CreateCloudNativeAPIGatewayPublicNetwork` | Create cloud native apigateway public network<br>Required: `GatewayId` |
| `UpdateCloudNativeAPIGatewaySpec` | Update cloud native apigateway spec<br>Required: `GatewayId`, `GroupId`, `NodeConfig` |
| `CreateGovernanceServices` | Create governance services<br>Required: `InstanceId`, `GovernanceServices` |
| `CreateCloudNativeAPIGatewayServiceRateLimit` | Create cloud native apigateway service rate limit<br>Required: `GatewayId`, `Name`, `LimitDetail` |
| `AddCloudNativeAPIGatewayConsumerGroupAuth` | Add cloud native apigateway consumer group auth<br>Required: `GatewayId`, `ResourceType`, `ResourceId`, `ConsumerGroupIds` |
| `UpdateUpstreamHealthCheckConfig` | Update upstream health check config<br>Required: `GatewayId`, `Name`, `HealthCheckConfig` |

## Blocked destructive actions (58)

`DeleteCloudNativeAPIGatewayConsumer`, `DeleteGovernanceLaneGroups`, `ModifyCloudNativeAPIGatewayCertificate`, `DeleteCloudNativeAPIGatewayPublicNetwork`, `ModifyCloudNativeAPIGatewayLLMModelAPI`, `DeleteConfigFileGroup`, `DeleteEngine`, `ModifyGovernanceServices`, `DeleteCloudNativeAPIGatewaySecretKey`, `DeleteGovernanceInstances`, `DeleteNativeGatewayServiceSource`, `ModifyNativeGatewayServiceSource`, `ModifyNetworkBasicInfo`, `DeleteCloudNativeAPIGatewayCertificate`, `DeleteCloudNativeAPIGatewayServiceRateLimit`, `DeleteConfigFiles`, `ModifyAutoScalerResourceStrategy`, `DeleteGovernanceServices`, `DeleteCloudNativeAPIGatewayLLMModelAPI`, `DeleteGovernanceAliases`, `ModifyCloudNativeAPIGatewayService`, `ModifyCloudNativeAPIGatewayConsumerGroup`, `DeleteCloudNativeAPIGatewayRouteRateLimit`, `DeleteConfigFileReleases`, `DeleteAutoScalerResourceStrategy`, `ModifyCloudNativeAPIGatewayRoute`, `DeleteNativeGatewayServerGroup`, `ModifyConsoleNetwork`, `ModifyNativeGatewayServerGroup`, `ModifyCloudNativeAPIGatewayServiceRateLimit`, `ModifyCloudNativeAPIGateway`, `RemoveCloudNativeAPIGatewayConsumerInGroup`, `RestartSREInstance`, `DeleteCloudNativeAPIGatewayCanaryRule`, `ModifyGovernanceLaneGroups`, `ModifyCloudNativeAPIGatewayRouteRateLimit`, `RemoveCloudNativeAPIGatewayConsumerGroupAuth`, `DeleteCloudNativeAPIGatewayIPRestriction`, `ModifyCloudNativeAPIGatewayCanaryRule`, `DeleteCloudNativeAPIGateway`, `ModifyGovernanceNamespaces`, `DeleteCloudNativeAPIGatewayLLMModelService`, `ModifyCloudNativeAPIGatewaySecretKeyStatus`, `ModifyNetworkAccessStrategy`, `ModifyGovernanceAlias`, `ModifyConfigFileGroup`, `ModifyUpstreamNodeStatus`, `DeleteWafDomains`, `DeleteCloudNativeAPIGatewayService`, `DeleteCloudNativeAPIGatewayRoute`, `ModifyCloudNativeAPIGatewayConsumer`, `ModifyConfigFiles`, `ModifyGovernanceInstances`, `ModifyCloudNativeAPIGatewayLLMModelService`, `DeleteGovernanceNamespaces`, `DeleteCloudNativeAPIGatewayCORS`, `DeleteGovernanceInstancesByHost`, `DeleteCloudNativeAPIGatewayConsumerGroup` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tse`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201207` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tse"`) for the allow/block decision and reason.

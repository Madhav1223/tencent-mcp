---
name: tencent-apigateway
description: Tencent Cloud APIGATEWAY via the Tencent MCP server — 98 actions in API version v20180808 (42 read-only auto-allowed). Use for bind, usage, plan, environment, plugin, ipstrategy. Triggers on mentions of apigateway, bind, usage, plan, environment, plugin, ipstrategy, apidoc, apis. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Serverless functions & APIs
metadata:
  version: "4"
---

# Tencent Cloud APIGATEWAY

Serverless functions & APIs: 98 actions in API version `v20180808` — 42 read-only (auto-allowed), 31 gated mutations, 25 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "apigateway"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Functions deploy async — after create/update, poll the function status until active before invoking or binding triggers.
Triggers (API Gateway, timers, COS, timers) are separate resources: creating the function alone exposes nothing. Bind and test each trigger explicitly.
Environment variables and VPC config change at update time; cold starts follow VPC attachment and large packages — keep packages lean and reuse execution contexts.
API Gateway needs explicit release/deploy to a stage after any route change — edits without release serve stale config.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/apigateway/v20180808 — action signatures in `apigateway_client.ts`, full request/response shapes in `apigateway_models.ts`.

## Read actions (auto-allowed, 42)

| Action | What it does |
|---|---|
| `DescribeUsagePlansStatus` | Describe usage plans status |
| `DescribeAPIDocDetail` | Describe apidoc detail<br>Required: `ApiDocId` |
| `DescribeApiAppBindApisStatus` | Describe api app bind apis status<br>Required: `ApiAppId` |
| `DescribeUsagePlanSecretIds` | Describe usage plan secret ids<br>Required: `UsagePlanId` |
| `DescribeServiceForApiApp` | Describe service for api app<br>Required: `ServiceId`, `ApiRegion` |
| `DescribePluginsByApi` | Describe plugins by api<br>Required: `ApiId`, `ServiceId` |
| `DescribeServicesStatus` | Describe services status |
| `DescribeAPIDocs` | Describe apidocs |
| `DescribeAllPluginApis` | Describe all plugin apis<br>Required: `ServiceId`, `PluginId`, `EnvironmentName` |
| `DescribePluginApis` | Describe plugin apis<br>Required: `PluginId` |
| `DescribeApiEnvironmentStrategy` | Describe api environment strategy<br>Required: `ServiceId` |
| `DescribeApiAppsStatus` | Describe api apps status |
| `DescribeUpstreams` | Describe upstreams<br>Required: `Limit`, `Offset` |
| `DescribeApi` | Describe api<br>Required: `ServiceId`, `ApiId` |
| `DescribeApiKeysStatus` | Describe api keys status |
| `DescribeIPStrategyApisStatus` | Describe ipstrategy apis status<br>Required: `ServiceId`, `StrategyId`, `EnvironmentName` |
| `DescribeServiceEnvironmentReleaseHistory` | Describe service environment release history<br>Required: `ServiceId` |
| `DescribeServiceSubDomainMappings` | Describe service sub domain mappings<br>Required: `ServiceId`, `SubDomain` |
| `DescribeIPStrategy` | Describe ipstrategy<br>Required: `ServiceId`, `StrategyId` |
| `DescribeServiceReleaseVersion` | Describe service release version<br>Required: `ServiceId` |
| `DescribeApisStatus` | Describe apis status<br>Required: `ServiceId` |
| `DescribeExclusiveInstances` | Describe exclusive instances<br>Required: `Limit`, `Offset` |
| `DescribeService` | Describe service<br>Required: `ServiceId` |
| `DescribePlugins` | Describe plugins |
| `DescribeExclusiveInstanceDetail` | Describe exclusive instance detail<br>Required: `InstanceId` |
| `DescribeApiBindApiAppsStatus` | Describe api bind api apps status<br>Required: `ServiceId`, `ApiIds` |
| `DescribeLogSearch` | Describe log search<br>Required: `StartTime`, `EndTime`, `ServiceId` |
| `DescribeApiUsagePlan` | Describe api usage plan<br>Required: `ServiceId` |
| `DescribeInstancesNetworkConfig` | Describe instances network config |
| `DescribeIPStrategysStatus` | Describe ipstrategys status<br>Required: `ServiceId` |
| `DescribeUsagePlanEnvironments` | Describe usage plan environments<br>Required: `UsagePlanId`, `BindType` (default SERVICE) |
| `DescribePlugin` | Describe plugin<br>Required: `PluginId` |
| `DescribeServiceEnvironmentList` | Describe service environment list<br>Required: `ServiceId` |
| `DescribeServiceEnvironmentStrategy` | Describe service environment strategy<br>Required: `ServiceId` |
| `DescribeApiKey` | Describe api key<br>Required: `AccessKeyId` |
| `DescribeUpstreamBindApis` | Describe upstream bind apis<br>Required: `Limit`, `Offset`, `UpstreamId` |
| `DescribeApiForApiApp` | Describe api for api app<br>Required: `ServiceId`, `ApiId`, `ApiRegion` |
| `DescribeServiceSubDomains` | Describe service sub domains<br>Required: `ServiceId` |
| `DescribeServiceUsagePlan` | Describe service usage plan<br>Required: `ServiceId` |
| `DescribeExclusiveInstanceRegions` | Describe exclusive instance regions |
| `DescribeExclusiveInstancesStatus` | Describe exclusive instances status<br>Required: `Limit`, `Offset` |
| `DescribeUsagePlan` | Describe usage plan<br>Required: `UsagePlanId` |
## Mutations (gated — need allowlist, 31)

| Action | What it does |
|---|---|
| `CreateService` | Create service<br>Required: `ServiceName`, `Protocol` |
| `UpdateService` | Update service<br>Required: `ServiceId`, `EnvironmentName`, `VersionName` |
| `CreateUsagePlan` | Create usage plan<br>Required: `UsagePlanName` |
| `UnBindIPStrategy` | Run un bind ipstrategy<br>Required: `ServiceId`, `StrategyId`, `EnvironmentName`, `UnBindApiIds` |
| `DisableApiKey` | Disable api key<br>Required: `AccessKeyId` |
| `UnbindApiApp` | Unbind api app<br>Required: `ApiAppId`, `Environment`, `ServiceId`, `ApiId` |
| `CreateApiApp` | Create api app<br>Required: `ApiAppName` |
| `CreateAPIDoc` | Create apidoc<br>Required: `ApiDocName`, `ServiceId`, `Environment`, `ApiIds` |
| `UnReleaseService` | Run un release service<br>Required: `ServiceId`, `EnvironmentName` |
| `UpdateApiAppKey` | Update api app key<br>Required: `ApiAppId`, `ApiAppKey` |
| `CreateExclusiveInstances` | Create exclusive instances<br>Required: `Zones`, `InstanceType`, `NetworkConfig`, `VpcConfig`, `PayMode` |
| `BindEnvironment` | Bind environment<br>Required: `UsagePlanIds`, `BindType` (default SERVICE), `Environment`, `ServiceId` |
| `UnBindSecretIds` | Run un bind secret ids<br>Required: `UsagePlanId`, `AccessKeyIds` |
| `CreateApiKey` | Create api key<br>Required: `SecretName` |
| `CreatePlugin` | Create plugin<br>Required: `PluginName`, `PluginType`, `PluginData` |
| `CreateApi` | Create api<br>Required: `ServiceId`, `ServiceType`, `ServiceTimeout`, `Protocol`, `RequestConfig` |
| `AttachPlugin` | Attach plugin<br>Required: `PluginId`, `ServiceId`, `EnvironmentName`, `ApiIds` |
| `BindApiApp` | Bind api app<br>Required: `ApiAppId`, `Environment`, `ServiceId`, `ApiId` |
| `CreateUpstream` | Create upstream<br>Required: `Scheme` (HTTP | HTTPS | gRPC | gRPCs), `Algorithm` (ROUND-ROBIN), `UniqVpcId` |
| `DetachPlugin` | Detach plugin<br>Required: `PluginId`, `ServiceId`, `EnvironmentName`, `ApiId` |
| `UnBindSubDomain` | Run un bind sub domain<br>Required: `ServiceId`, `SubDomain` |
| `ImportOpenApi` | Import open api<br>Required: `ServiceId`, `Content` |
| `BindSecretIds` | Bind secret ids<br>Required: `UsagePlanId`, `AccessKeyIds` |
| `BuildAPIDoc` | Run build apidoc<br>Required: `ApiDocId` |
| `DemoteServiceUsagePlan` | Demo te service usage plan<br>Required: `UsagePlanId`, `ServiceId`, `Environment` |
| `UpdateApiKey` | Update api key<br>Required: `AccessKeyId` |
| `BindIPStrategy` | Bind ipstrategy<br>Required: `ServiceId`, `StrategyId`, `EnvironmentName`, `BindApiIds` |
| `EnableApiKey` | Enable api key<br>Required: `AccessKeyId` |
| `CreateIPStrategy` | Create ipstrategy<br>Required: `ServiceId`, `StrategyName`, `StrategyType`, `StrategyData` |
| `UnBindEnvironment` | Run un bind environment<br>Required: `BindType` (default SERVICE), `UsagePlanIds`, `Environment`, `ServiceId` |
| `BindSubDomain` | Bind sub domain<br>Required: `ServiceId`, `SubDomain`, `Protocol`, `NetType`, `IsDefaultMapping`, `NetSubDomain` |

## Blocked destructive actions (25)

`ModifyIPStrategy`, `ModifyPlugin`, `DeleteApiApp`, `ResetAPIDocPassword`, `ModifyUsagePlan`, `DeleteUsagePlan`, `DeleteApi`, `ModifyAPIDoc`, `ModifyUpstream`, `ModifySubDomain`, `DeleteIPStrategy`, `ReleaseService`, `DeleteApiKey`, `DeleteService`, `ModifyApiIncrement`, `ModifyServiceEnvironmentStrategy`, `ModifyExclusiveInstance`, `DeleteUpstream`, `DeleteServiceSubDomainMapping`, `ModifyService`, `ModifyApiEnvironmentStrategy`, `ModifyApi`, `DeletePlugin`, `DeleteAPIDoc`, `ModifyApiApp` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `apigateway`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180808` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="apigateway"`) for the allow/block decision and reason.

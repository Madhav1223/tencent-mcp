---
name: tencent-tsf
description: Tencent Cloud TSF via the Tencent MCP server — 204 actions in API version v20180326 (93 read-only auto-allowed). Use for unit, container, lane, public, instances, resp. Triggers on mentions of tsf, unit, container, lane, public, instances, resp, gateway, release. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: DevOps & app platforms
metadata:
  version: "4"
---

# Tencent Cloud TSF

DevOps & app platforms: 204 actions in API version `v20180326` — 93 read-only (auto-allowed), 69 gated mutations, 42 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tsf"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Environments (dev/test/prod) are isolated — confirm which environment every deploy or config change targets.
Deployments are async with revisions — after release, poll the deployment/revision status until stable and keep the previous revision for rollback.
Service discovery and config centers decouple code from endpoints — update config entries explicitly; code deploys alone don't move traffic.
Microservice gateways need route publication after changes — unpublished edits serve stale behavior.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tsf/v20180326 — action signatures in `tsf_client.ts`, full request/response shapes in `tsf_models.ts`.

## Read actions (auto-allowed, 93)

| Action | What it does |
|---|---|
| `DescribePodInstances` | Describe pod instances<br>Required: `GroupId` |
| `DescribePublicConfigSummary` | Describe public config summary |
| `DescribeContainerGroups` | Describe container groups<br>Required: `ApplicationId` |
| `DescribeGroupAttribute` | Describe group attribute<br>Required: `GroupId` |
| `DescribeMsApiList` | Describe ms api list<br>Required: `MicroserviceId` |
| `DescribeConfig` | Describe config<br>Required: `ConfigId` |
| `DescribeOverviewInvocation` | Describe overview invocation |
| `DescribeContainerGroupDetail` | Describe container group detail<br>Required: `GroupId` |
| `DescribeImageTags` | Describe image tags |
| `DescribeFileConfigs` | Describe file configs |
| `DescribeSimpleClusters` | Describe simple clusters |
| `DescribeApiDetail` | Describe api detail<br>Required: `MicroserviceId`, `Path`, `Method`, `PkgVersion`, `ApplicationId` |
| `DescribeDeliveryConfig` | Describe delivery config<br>Required: `ConfigId` |
| `DescribeGroupsWithPlugin` | Describe groups with plugin<br>Required: `PluginId`, `Offset`, `Limit` |
| `DescribeDownloadInfo` | Describe download info<br>Required: `ApplicationId`, `PkgId` |
| `DescribeApplications` | Describe applications |
| `DescribeContainerGroupDeployInfo` | Describe container group deploy info<br>Required: `GroupId` |
| `DescribeUnitApiUseDetail` | Describe unit api use detail<br>Required: `GatewayDeployGroupId`, `ApiId`, `StartTime` (format `yyyy-MM-dd…`), `EndTime` (format `yyyy-MM-dd…`), `GatewayInstanceId`, `GroupId`, `Offset`, `Limit` |
| `DescribeGroupBindedGateways` | Describe group binded gateways<br>Required: `GroupId`, `Offset`, `Limit` |
| `DescribeApplication` | Describe application<br>Required: `ApplicationId` |
| `DescribeUsableUnitNamespaces` | Describe usable unit namespaces |
| `DescribeGroupUseDetail` | Describe group use detail<br>Required: `GatewayDeployGroupId`, `GroupId`, `StartTime` (format `yyyy-MM-dd…`), `EndTime` (format `yyyy-MM-dd…`) |
| `DescribeImageRepository` | Describe image repository |
| `DescribeSimpleNamespaces` | Describe simple namespaces |
| `DescribeGroupBusinessLogConfigs` | Describe group business log configs<br>Required: `GroupId` |
| `DescribeGroupRelease` | Describe group release<br>Required: `GroupId` |
| `DescribeCreateGatewayApiStatus` | Describe create gateway api status |
| `DescribeInvocationMetricDataPoint` | Describe invocation metric data point<br>Required: `StartTime`, `EndTime`, `MetricDimensionValues`, `Metrics` |
| `DescribePluginInstances` | Describe plugin instances<br>Required: `ScopeValue`, `Offset`, `Limit` |
| `DescribeGroupInstances` | Describe group instances<br>Required: `GroupId` |
| `DescribeApiGroups` | Describe api groups |
| `DescribeClusters` | Describe clusters |
| `DescribeBusinessLogConfigs` | Describe business log configs |
| `DescribeUnitRulesV2` | Describe unit rules v2<br>Required: `GatewayInstanceId` |
| `DescribeLicenses` | Describe licenses |
| `DescribeGroups` | Describe groups |
| `DescribeFileConfigReleases` | Describe file config releases |
| `DescribeRepositories` | Describe repositories |
| `DescribeClusterInstances` | Describe cluster instances<br>Required: `ClusterId` |
| `DescribeDeliveryConfigByGroupId` | Describe delivery config by group id<br>Required: `GroupId` |
| `DescribeSimpleGroups` | Describe simple groups |
| `DescribeConfigs` | Describe configs |
| `DescribeStatistics` | Describe statistics<br>Required: `Type`, `TimeStep`, `Offset` (default 0), `Limit` (default 10) |
| `DescribeGroupGateways` | Describe group gateways<br>Required: `GatewayDeployGroupId`, `Offset`, `Limit` |
| `DescribeUnitNamespaces` | Describe unit namespaces<br>Required: `GatewayInstanceId` |
| `DescribeConfigSummary` | Describe config summary |
| `DescribeInvocationMetricScatterPlot` | Describe invocation metric scatter plot |
| `DescribeContainerGroupAttribute` | Describe container group attribute<br>Required: `GroupId` |
| `DescribePkgs` | Describe pkgs<br>Required: `ApplicationId` |
| `DescribePrograms` | Describe programs |
| `DescribePublicConfig` | Describe public config<br>Required: `ConfigId` |
| `DescribeApiGroup` | Describe api group<br>Required: `GroupId` |
| `DescribeBusinessLogConfig` | Describe business log config<br>Required: `ConfigId` |
| `DescribeGatewayAllGroupApis` | Describe gateway all group apis<br>Required: `GatewayDeployGroupId` |
| `DescribePublicConfigs` | Describe public configs |
| `DescribeConfigTemplate` | Describe config template<br>Required: `ConfigTemplateId` |
| `DescribeInvocationMetricDataCurve` | Describe invocation metric data curve |
| `DescribePathRewrites` | Describe path rewrites<br>Required: `GatewayGroupId` |
| `DescribeConfigReleases` | Describe config releases |
| `DescribeContainerEvents` | Describe container events<br>Required: `ResourceType`, `ResourceId` |
| `DescribeGatewayMonitorOverview` | Describe gateway monitor overview<br>Required: `GatewayDeployGroupId` |
| `DescribeDeliveryConfigs` | Describe delivery configs |
| `DescribeMicroservicesByGroupIds` | Describe microservices by group ids<br>Required: `GroupIds` |
| `DescribeUnitRule` | Describe unit rule<br>Required: `Id` |
| `DescribePublicConfigReleaseLogs` | Describe public config release logs |
| `DescribeConfigReleaseLogs` | Describe config release logs |
| `DescribeSimpleApplications` | Describe simple applications |
| `DescribePathRewrite` | Describe path rewrite<br>Required: `PathRewriteId` |
| `DescribeMicroservice` | Describe microservice<br>Required: `MicroserviceId` |
| `DescribeJvmMonitor` | Describe jvm monitor<br>Required: `InstanceId`, `ApplicationId`, `TimeGranularity`, `From`, `To`, `RequiredPictures` |
| `SearchBusinessLog` | Search business log<br>Required: `ConfigId` |
| `SearchStdoutLog` | Search stdout log |
| `DescribeGroup` | Describe group<br>Required: `GroupId` |
| `DescribeApiRateLimitRules` | Describe api rate limit rules<br>Required: `ApiId` |
| `DescribeBasicResourceUsage` | Describe basic resource usage |
| `DescribeLogCapacity` | Describe log capacity |
| `DescribeInstances` | Describe instances |
| `DescribeGatewayApis` | Describe gateway apis<br>Required: `GroupId`, `Offset`, `Limit` |
| `DescribeMicroservices` | Describe microservices<br>Required: `NamespaceId` |
| `DescribeApiVersions` | Describe api versions<br>Required: `MicroserviceId` |
| `DescribeEnabledUnitRule` | Describe enabled unit rule<br>Required: `GatewayInstanceId` |
| `DescribeRepository` | Describe repository<br>Required: `RepositoryId` |
| `DescribeInvocationMetricDataDimension` | Describe invocation metric data dimension<br>Required: `StartTime`, `EndTime`, `Offset` (default 0), `Limit` (default 10), `DimensionName` |
| `DescribeApplicationAttribute` | Describe application attribute<br>Required: `ApplicationId` |
| `DescribeLaneRules` | Describe lane rules |
| `DescribeReleasedConfig` | Describe released config<br>Required: `GroupId` |
| `DescribePublicConfigReleases` | Describe public config releases |
| `DescribeLanes` | Describe lanes |
| `DescribeApiUseDetail` | Describe api use detail<br>Required: `GatewayDeployGroupId`, `ApiId`, `StartTime` (format `yyyy-MM-dd…`), `EndTime` (format `yyyy-MM-dd…`) |
| `DescribeUploadInfo` | Describe upload info<br>Required: `ApplicationId`, `PkgName`, `PkgVersion`, `PkgType` |
| `DescribeResourceTaskStatus` | Describe resource task status<br>Required: `TaskId` |
| `DescribeUnitRules` | Describe unit rules<br>Required: `GatewayInstanceId` |
| `DescribeResourceConfig` | Describe resource config |
## Mutations (gated — need allowlist, 69)

| Action | What it does |
|---|---|
| `CreateCluster` | Create cluster<br>Required: `ClusterName`, `ClusterType`, `VpcId` |
| `ShrinkInstances` | Run shrink instances<br>Required: `GroupId`, `InstanceIdList` |
| `DisableUnitRule` | Disable unit rule<br>Required: `Id` |
| `CreateConfigWithDetailResp` | Create config with detail resp<br>Required: `ConfigName`, `ConfigVersion`, `ConfigValue`, `ApplicationId` |
| `CreateNamespace` | Create namespace<br>Required: `NamespaceName` |
| `AddClusterInstances` | Add cluster instances<br>Required: `ClusterId`, `InstanceIdList` |
| `CreateFileConfigWithDetailResp` | Create file config with detail resp<br>Required: `ConfigName`, `ConfigVersion`, `ConfigFileName`, `ConfigFileValue`, `ApplicationId`, `ConfigFilePath` |
| `CreateConfigTemplate` | Create config template<br>Required: `ConfigTemplateName`, `ConfigTemplateType`, `ConfigTemplateValue` |
| `RevocationPublicConfig` | Run revocation public config<br>Required: `ConfigReleaseId` |
| `DisassociateKafkaConfig` | Run disassociate kafka config<br>Required: `ConfigId` |
| `EnableUnitRule` | Enable unit rule<br>Required: `Id` |
| `RollbackConfig` | Roll back config<br>Required: `ConfigReleaseLogId` |
| `CreateConfigTemplateWithDetailResp` | Create config template with detail resp<br>Required: `ConfigTemplateName`, `ConfigTemplateType`, `ConfigTemplateValue` |
| `RevokeFileConfig` | Revoke file config<br>Required: `ConfigReleaseId` |
| `EnableLaneRule` | Enable lane rule<br>Required: `RuleId` |
| `DisableUnitRoute` | Disable unit route<br>Required: `Id` |
| `DisassociateBusinessLogConfig` | Run disassociate business log config<br>Required: `ConfigIdList`, `GroupId` |
| `CreateConfig` | Create config<br>Required: `ConfigName`, `ConfigVersion`, `ConfigValue`, `ApplicationId` |
| `CreateMicroservice` | Create microservice<br>Required: `NamespaceId`, `MicroserviceName` |
| `CreatePathRewritesWithDetailResp` | Create path rewrites with detail resp<br>Required: `PathRewrites` |
| `BindPlugin` | Bind plugin<br>Required: `PluginInstanceList` |
| `UpdateUnitRule` | Update unit rule<br>Required: `Id`, `Name` |
| `CreateUnitRule` | Create unit rule<br>Required: `GatewayInstanceId`, `Name` |
| `UpdateRepository` | Update repository<br>Required: `RepositoryId` |
| `ReassociateBusinessLogConfig` | Run reassociate business log config<br>Required: `ConfigId`, `NewConfigId`, `ApplicationId`, `GroupId` |
| `UpdateApiTimeouts` | Update api timeouts<br>Required: `ApiIds`, `UsableStatus` |
| `CreateUnitNamespaces` | Create unit namespaces<br>Required: `GatewayInstanceId` |
| `UpdateHealthCheckSettings` | Update health check settings<br>Required: `GroupId` |
| `CreateGatewayApi` | Create gateway api<br>Required: `GroupId`, `ApiList` |
| `CreateApiRateLimitRule` | Create api rate limit rule<br>Required: `ApiId`, `MaxQps` |
| `UpdateApiRateLimitRule` | Update api rate limit rule<br>Required: `RuleId`, `UsableStatus` |
| `UnbindApiGroup` | Unbind api group<br>Required: `GroupGatewayList` |
| `CreateLaneRule` | Create lane rule<br>Required: `RuleName`, `Remark`, `RuleTagList`, `RuleTagRelationship`, `LaneId` |
| `CreatePublicConfigWithDetailResp` | Create public config with detail resp<br>Required: `ConfigName`, `ConfigVersion`, `ConfigValue` |
| `CreateUnitRuleWithDetailResp` | Create unit rule with detail resp<br>Required: `GatewayInstanceId`, `Name` |
| `UpdateApiRateLimitRules` | Update api rate limit rules<br>Required: `ApiIds`, `UsableStatus` |
| `CreateAllGatewayApiAsync` | Create all gateway api async<br>Required: `GroupId`, `MicroserviceId` |
| `CreateRepository` | Create repository<br>Required: `RepositoryName`, `RepositoryType` (default default), `BucketName`, `BucketRegion` |
| `CreatePublicConfig` | Create public config<br>Required: `ConfigName`, `ConfigVersion`, `ConfigValue` |
| `BindApiGroup` | Bind api group<br>Required: `GroupGatewayList` |
| `AddInstances` | Add instances<br>Required: `ClusterId`, `InstanceIdList` |
| `CreateFileConfig` | Create file config<br>Required: `ConfigName`, `ConfigVersion`, `ConfigFileName`, `ConfigFileValue`, `ApplicationId`, `ConfigFilePath` |
| `DeployContainerApplication` | Deploy container application<br>Required: `ApplicationId` |
| `CreateApiGroup` | Create api group<br>Required: `GroupName`, `GroupContext` |
| `CreateGroup` | Create group<br>Required: `ApplicationId`, `NamespaceId`, `GroupName`, `ClusterId` |
| `OperateApplicationTcrBinding` | Run operate application tcr binding |
| `ExpandGroup` | Run expand group<br>Required: `GroupId`, `InstanceIdList` |
| `UpdateConfigTemplate` | Update config template<br>Required: `ConfigTemplateId`, `ConfigTemplateName`, `ConfigTemplateType`, `ConfigTemplateValue` |
| `CreateLane` | Create lane<br>Required: `LaneName`, `Remark`, `LaneGroupList` |
| `DeployGroup` | Deploy group<br>Required: `GroupId`, `PkgId` |
| `UpdateApiGroup` | Update api group<br>Required: `GroupId` |
| `CreateMicroserviceWithDetailResp` | Create microservice with detail resp<br>Required: `NamespaceId`, `MicroserviceName` |
| `CreatePathRewrites` | Create path rewrites<br>Required: `PathRewrites` |
| `CreateApplication` | Create application<br>Required: `ApplicationName`, `ApplicationType`, `MicroserviceType` |
| `AssociateBusinessLogConfig` | Associate business log config<br>Required: `GroupId` |
| `StartContainerGroup` | Start container group<br>Required: `GroupId` |
| `DeployContainerGroup` | Deploy container group<br>Required: `GroupId`, `TagName`, `InstanceNum` |
| `DraftApiGroup` | Run draft api group<br>Required: `GroupId` |
| `DisableLaneRule` | Disable lane rule<br>Required: `RuleId` |
| `ChangeApiUsableStatus` | Run change api usable status<br>Required: `ApiId`, `UsableStatus` |
| `CreateContainGroup` | Create contain group<br>Required: `ApplicationId`, `NamespaceId`, `GroupName`, `InstanceNum`, `AccessType`, `ProtocolPorts`, `ClusterId` |
| `CreateProgram` | Create program<br>Required: `ProgramName` |
| `RevocationConfig` | Run revocation config<br>Required: `ConfigReleaseId` |
| `AssociateConfigWithGroup` | Associate config with group<br>Required: `ConfigId` |
| `EnableUnitRoute` | Enable unit route<br>Required: `Id` |
| `UpdateGatewayApi` | Update gateway api<br>Required: `ApiId` |
| `CreateApiRateLimitRuleWithDetailResp` | Create api rate limit rule with detail resp<br>Required: `ApiId`, `MaxQps` |
| `ShrinkGroup` | Run shrink group<br>Required: `GroupId` |
| `StartGroup` | Start group<br>Required: `GroupId` |

## Blocked destructive actions (42)

`DeletePublicConfig`, `ModifyContainerReplicas`, `DeleteLaneRule`, `DeleteCluster`, `ModifyCluster`, `DeleteImageTags`, `DeleteUnitRule`, `ModifyGroupLane`, `DeleteMicroservice`, `DeleteFileConfig`, `StopContainerGroup`, `DeleteContainerGroup`, `ReleaseConfig`, `DeleteConfigTemplate`, `ReleaseFileConfig`, `DeleteApiRateLimitRule`, `ModifyUploadInfo`, `ModifyNamespace`, `ModifyApplication`, `DeletePathRewrites`, `DeletePkgs`, `DeleteGroup`, `RemoveInstances`, `DeleteLane`, `StopGroup`, `ModifyLane`, `ModifyMicroservice`, `DeleteApiGroup`, `ModifyPathRewrite`, `ReleaseApiGroup`, `ReleaseConfigWithDetailResp`, `DeleteRepository`, `ModifyProgram`, `DeleteGatewayApi`, `DeleteApplication`, `DeleteNamespace`, `DeleteConfig`, `ReleasePublicConfig`, `DeleteUnitNamespaces`, `ModifyGroup`, `ModifyLaneRule`, `ModifyContainerGroup` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tsf`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180326` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tsf"`) for the allow/block decision and reason.

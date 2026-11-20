---
name: tencent-teo
description: Tencent Cloud TEO via the Tencent MCP server — 231 actions in API version v20220901 (87 read-only auto-allowed). Use for security, proxy, multi, path, function, gateway. Triggers on mentions of teo, security, proxy, multi, path, function, gateway, origin, zone. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud TEO

Networking & traffic: 231 actions in API version `v20220901` — 87 read-only (auto-allowed), 61 gated mutations, 83 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "teo"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/teo/v20220901 — action signatures in `teo_client.ts`, full request/response shapes in `teo_models.ts`.

## Read actions (auto-allowed, 87)

| Action | What it does |
|---|---|
| `ExportZoneConfig` | Export zone config<br>Required: `ZoneId` |
| `DescribeContentIdentifiers` | Describe content identifiers |
| `DescribeDDoSProtection` | Describe ddo sprotection<br>Required: `ZoneId` |
| `DescribeMultiPathGatewayRegions` | Describe multi path gateway regions<br>Required: `ZoneId` |
| `DownloadL4Logs` | Download l4 logs<br>Required: `StartTime`, `EndTime` |
| `DescribeContentQuota` | Describe content quota<br>Required: `ZoneId` |
| `DescribeRealtimeLogDeliveryTasks` | Describe realtime log delivery tasks<br>Required: `ZoneId` |
| `DescribeWebSecurityTemplate` | Describe web security template<br>Required: `ZoneId`, `TemplateId` |
| `DescribeInferenceServiceDeploymentRecords` | Describe inference service deployment records<br>Required: `ZoneId`, `ServiceId` |
| `DescribeDefaultCertificates` | Describe default certificates |
| `DescribeLogAnalysisDownloadTasks` | Describe log analysis download tasks<br>Required: `ZoneId`, `Area` |
| `DescribeAccelerationDomains` | Describe acceleration domains<br>Required: `ZoneId` |
| `DescribeFunctionRuntimeEnvironment` | Describe function runtime environment<br>Required: `ZoneId`, `FunctionId` |
| `DescribeSecurityClientAttester` | Describe security client attester<br>Required: `ZoneId` |
| `DownloadL7Logs` | Download l7 logs<br>Required: `StartTime`, `EndTime` |
| `DescribeOriginACL` | Describe origin acl<br>Required: `ZoneId` |
| `CheckCnameStatus` | Check cname status<br>Required: `ZoneId`, `RecordNames` |
| `DescribeLogAnalysisDetail` | Describe log analysis detail<br>Required: `ZoneId`, `Area`, `StartTime`, `EndTime` |
| `DescribeIPGroupReferences` | Describe ipgroup references<br>Required: `ZoneId`, `GroupId` |
| `DescribeOverviewL7Data` | Describe overview l7 data<br>Required: `StartTime`, `EndTime`, `MetricNames` |
| `DescribeZones` | Describe zones |
| `DescribeConfigGroupVersionDetail` | Describe config group version detail<br>Required: `ZoneId`, `VersionId` |
| `DescribeL7AccRules` | Describe l7 acc rules<br>Required: `ZoneId` |
| `DescribePrefetchTasks` | Describe prefetch tasks |
| `DescribeLoadBalancerList` | Describe load balancer list<br>Required: `ZoneId` |
| `DescribeIPRegion` | Describe ipregion<br>Required: `IPs` |
| `CheckFreeCertificateVerification` | Check free certificate verification<br>Required: `ZoneId`, `Domain` |
| `DescribeIdentifications` | Describe identifications<br>Required: `Filters` |
| `DescribeTimingL7CacheData` | Describe timing l7 cache data<br>Required: `StartTime`, `EndTime`, `MetricNames` |
| `DescribeConfigGroupVersions` | Describe config group versions<br>Required: `ZoneId`, `GroupId` |
| `DescribeSecurityIPGroupContent` | Describe security ipgroup content<br>Required: `ZoneId`, `GroupId` |
| `DescribeSecurityIPGroup` | Describe security ipgroup<br>Required: `ZoneId` |
| `DescribeTimingL4Data` | Describe timing l4 data<br>Required: `StartTime`, `EndTime`, `MetricNames` (unit: Byte), `ZoneIds` |
| `DescribeTopL7CacheData` | Describe top l7 cache data<br>Required: `StartTime`, `EndTime`, `MetricName`, `ZoneIds` |
| `DescribeMultiPathGateways` | Describe multi path gateways<br>Required: `ZoneId` |
| `DescribeTopL7AnalysisData` | Describe top l7 analysis data<br>Required: `StartTime`, `EndTime`, `MetricName`, `ZoneIds` |
| `DescribeSecurityAPIService` | Describe security apiservice<br>Required: `ZoneId` |
| `DescribeCustomErrorPages` | Describe custom error pages<br>Required: `ZoneId` |
| `DescribeMultiPathGatewayLine` | Describe multi path gateway line<br>Required: `ZoneId`, `GatewayId`, `LineId` |
| `DescribeDDoSAttackEvent` | Describe ddo sattack event<br>Required: `StartTime`, `EndTime` |
| `DescribeTimingL7AnalysisData` | Describe timing l7 analysis data<br>Required: `StartTime`, `EndTime`, `MetricNames` (unit: Byte) |
| `DescribeApplicationProxies` | Describe application proxies |
| `DescribePrefetchOriginLimit` | Describe prefetch origin limit<br>Required: `ZoneId` |
| `DescribeSecurityJSInjectionRule` | Describe security jsinjection rule<br>Required: `ZoneId` |
| `DescribeWebSecurityTemplates` | Describe web security templates<br>Required: `ZoneIds` |
| `DescribeRulesSetting` | Describe rules setting |
| `DescribeAvailablePlans` | Describe available plans |
| `DescribePlans` | Describe plans |
| `DescribeFunctionReplicas` | Describe function replicas<br>Required: `ZoneId`, `FunctionId` |
| `DescribeInferenceHardwareSpecifications` | Describe inference hardware specifications<br>Required: `ZoneId` |
| `DescribeFunctionRules` | Describe function rules<br>Required: `ZoneId` |
| `DescribePurgeTasks` | Describe purge tasks |
| `DescribeMultiPathGateway` | Describe multi path gateway<br>Required: `ZoneId`, `GatewayId` |
| `DescribeSecurityPolicy` | Describe security policy<br>Required: `ZoneId` |
| `DescribeEdgeKVNamespaces` | Describe edge kvnamespaces<br>Required: `ZoneId` |
| `DescribeRules` | Describe rules<br>Required: `ZoneId` |
| `DescribeDeployHistory` | Describe deploy history<br>Required: `ZoneId`, `EnvId` |
| `DescribeOriginGroup` | Describe origin group |
| `DescribeDDoSAttackTopData` | Describe ddo sattack top data<br>Required: `StartTime`, `EndTime`, `MetricName` |
| `DescribeMultiPathGatewayOriginACL` | Describe multi path gateway origin acl<br>Required: `ZoneId`, `GatewayId` |
| `DescribeJustInTimeTranscodeTemplates` | Describe just in time transcode templates<br>Required: `ZoneId` |
| `DescribeAvailableCustomActionsForRuleEngine` | Describe available custom actions for rule engine<br>Required: `ZoneId` |
| `DescribeL7AccSetting` | Describe l7 acc setting<br>Required: `ZoneId` |
| `DescribeInferenceAPITokens` | Describe inference apitokens<br>Required: `ZoneId` |
| `DescribeSharedCNAME` | Describe shared cname<br>Required: `ZoneId` |
| `DescribeHostsSetting` | Describe hosts setting<br>Required: `ZoneId` |
| `DescribeSecurityTemplateBindings` | Describe security template bindings<br>Required: `ZoneId`, `TemplateId` |
| `DescribeInferenceServiceMonitorData` | Describe inference service monitor data<br>Required: `ZoneId`, `ServiceIds`, `MetricNames` (unit: %), `StartTime`, `EndTime` |
| `DescribeOriginProtection` | Describe origin protection |
| `DescribeZoneSetting` | Describe zone setting<br>Required: `ZoneId` |
| `DescribeSecurityAPIResource` | Describe security apiresource<br>Required: `ZoneId` |
| `DescribeZoneConfigImportResult` | Describe zone config import result<br>Required: `ZoneId`, `TaskId` |
| `DescribeInferenceServices` | Describe inference services<br>Required: `ZoneId` |
| `DescribeMultiPathGatewaySecretKey` | Describe multi path gateway secret key<br>Required: `ZoneId` |
| `DescribeFunctions` | Describe functions<br>Required: `ZoneId` |
| `DescribeTimingL7OriginPullData` | Describe timing l7 origin pull data<br>Required: `ZoneIds`, `MetricNames` (unit: Byte), `StartTime`, `EndTime` |
| `DescribeEnvironments` | Describe environments<br>Required: `ZoneId` |
| `DescribeSecurityIPGroupInfo` | Describe security ipgroup info<br>Required: `ZoneId` |
| `DescribeDnsRecords` | Describe dns records<br>Required: `ZoneId` |
| `DescribeL4ProxyRules` | Describe l4 proxy rules<br>Required: `ZoneId`, `ProxyId`, `Offset` (default 0), `Limit` (default 20) |
| `DescribeDDoSAttackData` | Describe ddo sattack data<br>Required: `StartTime`, `EndTime`, `MetricNames`, `ZoneIds` |
| `DescribeAliasDomains` | Describe alias domains<br>Required: `ZoneId` |
| `DescribeFunctionComponentBindings` | Describe function component bindings<br>Required: `ZoneId`, `FunctionId` |
| `DescribeL4Proxy` | Describe l4 proxy<br>Required: `ZoneId` |
| `DescribeBillingData` | Describe billing data<br>Required: `StartTime`, `EndTime`, `ZoneIds`, `MetricName`, `Interval` |
| `DescribeInferenceServiceDeploymentLogs` | Describe inference service deployment logs<br>Required: `ZoneId`, `ServiceId`, `RecordId` |
| `DescribeOriginGroupHealthStatus` | Describe origin group health status<br>Required: `ZoneId`, `LBInstanceId` |
## Mutations (gated — need allowlist, 61)

| Action | What it does |
|---|---|
| `CreateDnsRecord` | Create dns record<br>Required: `ZoneId`, `Name`, `Type`, `Content` |
| `CreatePurgeTask` | Create purge task<br>Required: `ZoneId`, `Type` |
| `CreatePlanForZone` | Create plan for zone<br>Required: `ZoneId`, `PlanType` |
| `CreateWebSecurityTemplate` | Create web security template<br>Required: `ZoneId`, `TemplateName` |
| `CreateFunctionRule` | Create function rule<br>Required: `ZoneId`, `FunctionRuleConditions` |
| `IdentifyZone` | Run identify zone<br>Required: `ZoneName` |
| `CreateSecurityAPIResource` | Create security apiresource<br>Required: `ZoneId` |
| `CreateContentIdentifier` | Create content identifier<br>Required: `Description`, `PlanId` |
| `CreateMultiPathGateway` | Create multi path gateway<br>Required: `ZoneId`, `GatewayType`, `GatewayName`, `GatewayPort` (range 1～65535) |
| `CreatePrefetchTask` | Create prefetch task<br>Required: `ZoneId` |
| `CreateAccelerationDomain` | Create acceleration domain<br>Required: `ZoneId`, `DomainName`, `OriginInfo` |
| `CreateMultiPathGatewayLine` | Create multi path gateway line<br>Required: `ZoneId`, `GatewayId`, `LineType`, `LineAddress` (format `ip…`) |
| `EdgeKVDelete` | Run edge kvdelete<br>Required: `ZoneId`, `Namespace`, `Keys` |
| `CreateEdgeKVNamespace` | Create edge kvnamespace<br>Required: `ZoneId`, `Namespace` |
| `BindSecurityTemplateToEntity` | Bind security template to entity<br>Required: `ZoneId`, `Entities`, `Operate`, `TemplateId` |
| `CreateSecurityIPGroup` | Create security ipgroup<br>Required: `ZoneId`, `IPGroup` |
| `UpgradePlan` | Upgrade plan<br>Required: `PlanId`, `PlanType` |
| `RefreshMultiPathGatewaySecretKey` | Refresh multi path gateway secret key<br>Required: `ZoneId` |
| `CreateRealtimeLogDeliveryTask` | Create realtime log delivery task<br>Required: `ZoneId`, `Area`, `LogType`, `TaskName`, `TaskType`, `EntityList`, `Fields` |
| `OperateInferenceService` | Run operate inference service<br>Required: `ZoneId`, `ServiceId`, `Operation` |
| `EdgeKVList` | Run edge kvlist<br>Required: `ZoneId`, `Namespace` |
| `VerifyOwnership` | Verify ownership<br>Required: `Domain` |
| `CreateFunctionReplica` | Create function replica<br>Required: `ZoneId`, `FunctionId`, `ReplicaName`, `Content` |
| `EdgeKVGet` | Run edge kvget<br>Required: `ZoneId`, `Namespace`, `Keys` |
| `CreateInferenceAPIToken` | Create inference apitoken<br>Required: `ZoneId`, `Name` |
| `CreateAliasDomain` | Create alias domain<br>Required: `ZoneId`, `AliasName`, `TargetName` |
| `CreateL4ProxyRules` | Create l4 proxy rules<br>Required: `ZoneId`, `ProxyId`, `L4ProxyRules` |
| `BindZoneToPlan` | Bind zone to plan<br>Required: `ZoneId`, `PlanId` |
| `CreateCustomizeErrorPage` | Create customize error page<br>Required: `ZoneId`, `Name`, `ContentType` |
| `CreateL4Proxy` | Create l4 proxy<br>Required: `ZoneId`, `ProxyName`, `Area` |
| `IncreasePlanQuota` | Run increase plan quota<br>Required: `PlanId`, `QuotaType`, `QuotaNumber` |
| `CreateFunction` | Create function<br>Required: `ZoneId`, `Name`, `Content` |
| `CreateSharedCNAME` | Create shared cname<br>Required: `ZoneId`, `SharedCNAMEPrefix` |
| `ConfirmMultiPathGatewayOriginACL` | Confirm multi path gateway origin acl<br>Required: `ZoneId`, `GatewayId`, `OriginACLVersion` |
| `CreateRule` | Create rule<br>Required: `ZoneId`, `RuleName`, `Status`, `Rules` |
| `CreateConfigGroupVersion` | Create config group version<br>Required: `ZoneId`, `GroupId`, `Content` |
| `CreateZone` | Create zone |
| `CreateInferenceService` | Create inference service<br>Required: `ZoneId`, `Name`, `ListenPort`, `Containers`, `ResourceConfig` |
| `CreateSecurityClientAttester` | Create security client attester<br>Required: `ZoneId` |
| `DisableOriginACL` | Disable origin acl<br>Required: `ZoneId` |
| `CreateSecurityJSInjectionRule` | Create security jsinjection rule<br>Required: `ZoneId` |
| `CreateL7AccRules` | Create l7 acc rules<br>Required: `ZoneId`, `Rules` |
| `HandleFunctionRuntimeEnvironment` | Run handle function runtime environment<br>Required: `ZoneId`, `FunctionId`, `Operation` |
| `CreateCLSIndex` | Create clsindex<br>Required: `ZoneId`, `TaskId` |
| `CreateApplicationProxy` | Create application proxy<br>Required: `ZoneId`, `ProxyName`, `PlatType`, `SecurityType`, `AccelerateType` |
| `EnableOriginACL` | Enable origin acl<br>Required: `ZoneId` |
| `CreateLoadBalancer` | Create load balancer<br>Required: `ZoneId`, `Name`, `Type`, `OriginGroups` |
| `CreateOriginGroup` | Create origin group<br>Required: `ZoneId`, `Records` |
| `CreateJustInTimeTranscodeTemplate` | Create just in time transcode template<br>Required: `ZoneId`, `TemplateName` |
| `ConfirmOriginACLUpdate` | Confirm origin aclupdate<br>Required: `ZoneId` |
| `DeployConfigGroupVersion` | Deploy config group version<br>Required: `ZoneId`, `EnvId`, `ConfigGroupVersionInfos`, `Description` |
| `BindSharedCNAME` | Bind shared cname<br>Required: `ZoneId`, `BindType`, `BindSharedCNAMEMaps` |
| `CreateSecurityAPIService` | Create security apiservice<br>Required: `ZoneId` |
| `CreateApplicationProxyRule` | Create application proxy rule<br>Required: `ZoneId`, `ProxyId`, `Proto`, `Port` (format `80…`), `OriginType`, `OriginValue` |
| `ApplyFreeCertificate` | Run apply free certificate<br>Required: `ZoneId`, `Domain`, `VerificationMethod` |
| `CreatePlan` | Create plan<br>Required: `PlanType` |
| `CreateLogAnalysisDownloadTask` | Create log analysis download task<br>Required: `ZoneId`, `Area`, `StartTime`, `EndTime` |
| `ImportZoneConfig` | Import zone config<br>Required: `ZoneId`, `Content` |
| `CreateMultiPathGatewaySecretKey` | Create multi path gateway secret key<br>Required: `ZoneId` |
| `EdgeKVPut` | Run edge kvput<br>Required: `ZoneId`, `Namespace`, `Key`, `Value` |
| `DummyParseZoneFullConfig` | Run dummy parse zone full config |

## Blocked destructive actions (83)

`DestroyPlan`, `DeleteFunction`, `ModifyZone`, `DeleteFunctionRules`, `ModifyMultiPathGatewayStatus`, `ModifyL7AccRule`, `ModifyOriginGroup`, `DeleteSecurityAPIResource`, `DeleteApplicationProxy`, `ModifyL7AccSetting`, `ModifyMultiPathGatewayLine`, `ModifyL4ProxyStatus`, `DeleteApplicationProxyRule`, `ModifyZoneSetting`, `DeleteAliasDomain`, `ModifySharedCNAME`, `ModifyAliasDomain`, `ModifyOriginACL`, `ModifyApplicationProxyRuleStatus`, `DeleteOriginGroup`, `ModifyLoadBalancer`, `DeleteAccelerationDomains`, `DeleteSecurityJSInjectionRule`, `ModifyL4Proxy`, `ModifyL4ProxyRules`, `ModifyL7AccRulePriority`, `ModifyDnsRecords`, `ModifyWebSecurityTemplate`, `ModifyFunctionRule`, `ModifyFunctionReplica`, `ModifyPrefetchOriginLimit`, `ModifyAliasDomainStatus`, `ModifyRule`, `DeleteDnsRecords`, `ModifySecurityPolicy`, `DeleteL7AccRules`, `DeleteL4ProxyRules`, `ModifyAccelerationDomain`, `ModifySecurityAPIResource`, `ModifyApplicationProxyStatus`, `DeleteLoadBalancer`, `ModifyMultiPathGateway`, `ModifyEdgeKVNamespace`, `ModifyDnsRecordsStatus`, `ModifyFunction`, `ModifyApplicationProxy`, `ModifyPlan`, `DeleteContentIdentifier`, `ModifyAccelerationDomainStatuses`, `DeleteRealtimeLogDeliveryTask`, `ModifyZoneStatus`, `ModifyInferenceService`, `DeleteRules`, `DeleteSecurityAPIService`, `DeleteMultiPathGateway`, `DeleteCustomErrorPage`, `ModifySecurityAPIService`, `ModifyContentIdentifier`, `DeleteWebSecurityTemplate`, `ModifySecurityClientAttester`, `DeleteSecurityClientAttester`, `ModifyHostsCertificate`, `ModifyFunctionRulePriority`, `DeleteEdgeKVNamespace`, `ModifyMultiPathGatewaySecretKey`, `ModifyApplicationProxyRule`, `DeleteL4Proxy`, `ModifyZoneWorkMode`, `ModifyRealtimeLogDeliveryTask`, `ModifyL4ProxyRulesStatus`, `RenewPlan`, `DeleteSecurityIPGroup`, `ModifySecurityJSInjectionRule`, `ModifySecurityIPGroup`, `DeleteZone`, `ModifyDDoSProtection`, `ModifyCustomErrorPage`, `DeleteSharedCNAME`, `ModifyFunctionComponentBindings`, `DeleteInferenceAPIToken`, `DeleteFunctionReplica`, `DeleteMultiPathGatewayLine`, `DeleteJustInTimeTranscodeTemplates` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `teo`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220901` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="teo"`) for the allow/block decision and reason.

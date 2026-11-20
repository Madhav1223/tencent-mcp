---
name: tencent-dayu
description: Tencent Cloud DAYU via the Tencent MCP server — 112 actions in API version v20180709 (51 read-only auto-allowed). Use for spolicy, health, threshold, ccfrequency, snet, allow. Triggers on mentions of dayu, spolicy, health, threshold, ccfrequency, snet, allow, case, ccself. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud DAYU

Networking & traffic: 112 actions in API version `v20180709` — 51 read-only (auto-allowed), 23 gated mutations, 38 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dayu"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dayu/v20180709 — action signatures in `dayu_client.ts`, full request/response shapes in `dayu_models.ts`.

## Read actions (auto-allowed, 51)

| Action | What it does |
|---|---|
| `DescribeDDoSCount` | Describe ddo scount<br>Required: `Business`, `Id`, `Ip`, `StartTime`, `EndTime`, `MetricName` |
| `DescribeRuleSets` | Describe rule sets<br>Required: `Business`, `IdList` |
| `DescribeNewL7RulesErrHealth` | Describe new l7 rules err health<br>Required: `Business` |
| `DescribeDDoSNetTrend` | Describe ddo snet trend<br>Required: `Business`, `Id`, `MetricName`, `Period`, `StartTime`, `EndTime` |
| `DescribeDDoSUsedStatis` | Describe ddo sused statis<br>Required: `Business` |
| `DescribeDDoSDefendStatus` | Describe ddo sdefend status<br>Required: `Business` |
| `DescribeCCAlarmThreshold` | Describe ccalarm threshold<br>Required: `Business`, `RsId` |
| `DescribePcap` | Describe pcap<br>Required: `Business`, `Id`, `StartTime`, `EndTime` |
| `DescribeNewL4Rules` | Describe new l4 rules<br>Required: `Business` |
| `DescribeDDoSNetIpLog` | Describe ddo snet ip log<br>Required: `Business`, `Id`, `StartTime`, `EndTime` |
| `DescribeDDoSEvList` | Describe ddo sev list<br>Required: `Business`, `StartTime`, `EndTime` |
| `DescribeIpBlockList` | Describe ip block list |
| `DescribeL4HealthConfig` | Describe l4 health config<br>Required: `Business`, `Id` |
| `DescribeSecIndex` | Describe sec index |
| `DescribeSchedulingDomainList` | Describe scheduling domain list<br>Required: `Limit`, `Offset` |
| `DescribeCCFrequencyRules` | Describe ccfrequency rules<br>Required: `Business`, `Id`, `RuleId` |
| `DescribeBaradData` | Describe barad data<br>Required: `Business`, `Id`, `MetricName`, `Period`, `StartTime`, `EndTime`, `Statistics` |
| `DescribeNewL4RulesErrHealth` | Describe new l4 rules err health<br>Required: `Business` |
| `DescribeSourceIpSegment` | Describe source ip segment<br>Required: `Business`, `Id` |
| `DescribeBasicDeviceThreshold` | Describe basic device threshold<br>Required: `BasicIp`, `BasicRegion`, `BasicBizType`, `BasicDeviceType`, `BasicCheckFlag` |
| `DescribeResourceList` | Describe resource list<br>Required: `Business` |
| `DescribeBizHttpStatus` | Describe biz http status<br>Required: `Business`, `Id`, `Period`, `StartTime`, `EndTime`, `Statistics` |
| `DescribePolicyCase` | Describe policy case<br>Required: `Business` |
| `DescribeActionLog` | Describe action log<br>Required: `StartTime`, `EndTime` |
| `DescribeDDoSIpLog` | Describe ddo sip log<br>Required: `Business`, `Id`, `Ip`, `StartTime`, `EndTime` |
| `DescribeDDoSAlarmThreshold` | Describe ddo salarm threshold<br>Required: `Business`, `RsId` |
| `DescribePackIndex` | Describe pack index<br>Required: `Business` |
| `DescribeCCIpAllowDeny` | Describe ccip allow deny<br>Required: `Business`, `Id`, `Type` |
| `DescribeDDoSNetCount` | Describe ddo snet count<br>Required: `Business`, `Id`, `StartTime`, `EndTime`, `MetricName` |
| `DescribeDDoSNetEvInfo` | Describe ddo snet ev info<br>Required: `Business`, `Id`, `StartTime`, `EndTime` |
| `DescribeL4RulesErrHealth` | Describe l4 rules err health<br>Required: `Business`, `Id` |
| `DescribeDDoSPolicy` | Describe ddo spolicy<br>Required: `Business` |
| `DescribeTransmitStatis` | Describe transmit statis<br>Required: `Business`, `Id`, `MetricName`, `Period`, `StartTime`, `EndTime` |
| `DescribeUnBlockStatis` | Describe un block statis |
| `DescribeDDoSTrend` | Describe ddo strend<br>Required: `Business`, `Ip`, `MetricName`, `Period`, `StartTime`, `EndTime` |
| `DescribeDDoSAttackSource` | Describe ddo sattack source<br>Required: `Business`, `Id`, `StartTime`, `EndTime`, `Limit`, `Offset` |
| `DescribeCCEvList` | Describe ccev list<br>Required: `Business`, `StartTime`, `EndTime` |
| `DescribeInsurePacks` | Describe insure packs |
| `DescribeDDoSNetEvList` | Describe ddo snet ev list<br>Required: `Business`, `Id`, `StartTime`, `EndTime` |
| `DescribeBizTrend` | Describe biz trend<br>Required: `Business`, `Id`, `Period`, `StartTime`, `EndTime`, `Statistics`, `MetricName` |
| `DescribeIpUnBlockList` | Describe ip un block list<br>Required: `BeginTime`, `EndTime` |
| `DescribeIPProductInfo` | Describe ipproduct info<br>Required: `Business`, `IpList` |
| `DescribeCCSelfDefinePolicy` | Describe ccself define policy<br>Required: `Business`, `Id` |
| `DescribeCCUrlAllow` | Describe ccurl allow<br>Required: `Business`, `Id`, `Type` |
| `DescribeL7HealthConfig` | Describe l7 health config<br>Required: `Business`, `Id` |
| `DescribeCCTrend` | Describe cctrend<br>Required: `Business`, `Ip`, `MetricName`, `Period`, `StartTime`, `EndTime` |
| `DescribeBasicCCThreshold` | Describe basic ccthreshold<br>Required: `BasicIp`, `BasicRegion`, `BasicBizType`, `BasicDeviceType` |
| `DescribeResIpList` | Describe res ip list<br>Required: `Business` |
| `DescribeBGPIPL7RuleMaxCnt` | Describe bgpipl7 rule max cnt<br>Required: `Business`, `Id` |
| `DescribeDDoSEvInfo` | Describe ddo sev info<br>Required: `Business`, `Id`, `Ip`, `StartTime`, `EndTime` |
| `DescribeDDoSAttackIPRegionMap` | Describe ddo sattack ipregion map<br>Required: `Business`, `Id`, `StartTime`, `EndTime` |
## Mutations (gated — need allowlist, 23)

| Action | What it does |
|---|---|
| `CreateNewL7RulesUpload` | Create new l7 rules upload<br>Required: `Business`, `IdList`, `VipList`, `Rules` |
| `CreateL7CCRule` | Create l7 ccrule<br>Required: `Business`, `Id`, `Method`, `RuleId` |
| `CreateCCSelfDefinePolicy` | Create ccself define policy<br>Required: `Business`, `Id`, `Policy` |
| `CreateNewL7Rules` | Create new l7 rules<br>Required: `Business`, `IdList`, `VipList`, `Rules` |
| `CreateDDoSPolicyCase` | Create ddo spolicy case<br>Required: `Business`, `CaseName` |
| `CreateNewL4Rules` | Create new l4 rules<br>Required: `Business`, `IdList`, `VipList`, `Rules` |
| `CreateL4Rules` | Create l4 rules<br>Required: `Business`, `Id`, `Rules` |
| `DescribleL7Rules` | Run describle l7 rules<br>Required: `Business`, `Id` |
| `CreateDDoSPolicy` | Create ddo spolicy<br>Required: `Business`, `DropOptions` |
| `CreateUnblockIp` | Create unblock ip<br>Required: `Ip`, `ActionType` |
| `DescribleNewL7Rules` | Run describle new l7 rules<br>Required: `Business` |
| `CreateBasicDDoSAlarmThreshold` | Create basic ddo salarm threshold<br>Required: `Business`, `Method` |
| `CreateL7RuleCert` | Create l7 rule cert<br>Required: `Business`, `Id`, `RuleId`, `CertType` |
| `CreateL4HealthConfig` | Create l4 health config<br>Required: `Business`, `Id`, `HealthConfig` |
| `CreateBoundIP` | Create bound ip<br>Required: `Business`, `Id` |
| `CreateL7RulesUpload` | Create l7 rules upload<br>Required: `Business`, `Id`, `Rules` |
| `CreateNetReturn` | Create net return<br>Required: `Business`, `Id` |
| `DescribleRegionCount` | Run describle region count<br>Required: `Business` |
| `CreateL7Rules` | Create l7 rules<br>Required: `Business`, `Id`, `Rules` |
| `DescribleL4Rules` | Run describle l4 rules<br>Required: `Business`, `Id` |
| `CreateCCFrequencyRules` | Create ccfrequency rules<br>Required: `Business`, `Id`, `RuleId`, `Mode`, `Period`, `ReqNumber`, `Act`, `ExeDuration` |
| `CreateL7HealthConfig` | Create l7 health config<br>Required: `Business`, `Id`, `HealthConfig` |
| `CreateInstanceName` | Create instance name<br>Required: `Business`, `Id`, `Name` |

## Blocked destructive actions (38)

`ModifyCCIpAllowDeny`, `DeleteNewL4Rules`, `ModifyCCPolicySwitch`, `ModifyDDoSPolicyName`, `ModifyL4Health`, `ModifyElasticLimit`, `ModifyCCAlarmThreshold`, `DeleteDDoSPolicyCase`, `DeleteL7Rules`, `ModifyCCFrequencyRules`, `ModifyResBindDDoSPolicy`, `ModifyNetReturnSwitch`, `ModifyCCUrlAllow`, `DeleteDDoSPolicy`, `ModifyNewL4Rule`, `DeleteCCSelfDefinePolicy`, `ModifyL4Rules`, `ModifyDDoSThreshold`, `ModifyDDoSAIStatus`, `ModifyDDoSPolicy`, `ModifyDDoSPolicyCase`, `ModifyDDoSAlarmThreshold`, `DeleteCCFrequencyRules`, `ModifyL4KeepTime`, `ModifyCCLevel`, `ModifyDDoSDefendStatus`, `ModifyDDoSSwitch`, `ModifyDDoSLevel`, `DeleteNewL7Rules`, `ModifyDDoSWaterKey`, `DeleteL4Rules`, `ModifyCCHostProtection`, `ModifyCCFrequencyRulesStatus`, `ModifyCCThreshold`, `ModifyNewDomainRules`, `ModifyL7Rules`, `ModifyResourceRenewFlag`, `ModifyCCSelfDefinePolicy` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dayu`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180709` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dayu"`) for the allow/block decision and reason.

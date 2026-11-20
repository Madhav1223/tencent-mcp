---
name: tencent-cfw
description: Tencent Cloud CFW via the Tencent MCP server — 164 actions in API version v20190904 (78 read-only auto-allowed). Use for switch, security, block, cluster, ignore, enterprise. Triggers on mentions of cfw, switch, security, block, cluster, ignore, enterprise, remove, asset. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud CFW

Networking & traffic: 164 actions in API version `v20190904` — 78 read-only (auto-allowed), 28 gated mutations, 58 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cfw"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cfw/v20190904 — action signatures in `cfw_client.ts`, full request/response shapes in `cfw_models.ts`.

## Read actions (auto-allowed, 78)

| Action | What it does |
|---|---|
| `DescribeClusterVpcFwSwitchs` | Describe cluster vpc fw switchs |
| `DescribeVpcFwGroupSwitch` | Describe vpc fw group switch<br>Required: `Limit`, `Offset` |
| `DescribeResourceGroupNew` | Describe resource group new<br>Required: `QueryType` |
| `DescribeTableStatus` | Describe table status |
| `DescribeSourceAsset` | Describe source asset |
| `DescribeNDRAssetIdentificationList` | Describe ndrasset identification list<br>Required: `Limit`, `Offset` |
| `DescribeNDRAssetIdentificationCursorList` | Describe ndrasset identification cursor list<br>Required: `Limit` |
| `DescribeUnHandleEventTabList` | Describe un handle event tab list<br>Required: `StartTime`, `EndTime` |
| `DescribeCfwLogs` | Describe cfw logs |
| `CheckClusterNatFwPreAccess` | Check cluster nat fw pre access<br>Required: `NatCcnSwitch`, `CheckMode` |
| `DescribeCfwRules` | Describe cfw rules<br>Required: `RuleType` |
| `DescribeCfwAlerts` | Describe cfw alerts |
| `DescribeCfwSwitches` | Describe cfw switches |
| `DescribeBlockByIpTimesList` | Describe block by ip times list<br>Required: `EndTime`, `Ip`, `StartTime` |
| `DescribeNatFwDnatRule` | Describe nat fw dnat rule |
| `DescribeBlockList` | Describe block list<br>Required: `Offset`, `Limit`, `StatTimeSpan`, `StartTime`, `EndTime` |
| `DescribeNatFwInfoCount` | Describe nat fw info count |
| `DescribeNatFwVpcDnsLst` | Describe nat fw vpc dns lst<br>Required: `NatFwInsId` |
| `DescribeAclRule` | Describe acl rule<br>Required: `Limit`, `Offset` |
| `DescribeSecurityGroupList` | Describe security group list<br>Required: `Direction`, `Area` |
| `DescribeAssetSync` | Describe asset sync |
| `DescribeFwGroupIdNames` | Describe fw group id names |
| `DescribeDefenseSwitch` | Describe defense switch |
| `DescribeFwGroupInstanceInfo` | Describe fw group instance info<br>Required: `Limit`, `Offset` |
| `DescribeCcnAssociatedInstances` | Describe ccn associated instances<br>Required: `CcnId` |
| `DescribeNatFwInstanceWithRegion` | Describe nat fw instance with region |
| `DescribeNatFwSwitch` | Describe nat fw switch<br>Required: `Offset`, `Limit` |
| `DescribeVpcAcRule` | Describe vpc ac rule<br>Required: `Limit`, `Offset` |
| `DescribeCcnVpcFwPolicyLimit` | Describe ccn vpc fw policy limit |
| `DescribeNatCcnFwSwitch` | Describe nat ccn fw switch<br>Required: `NatInsId`, `CcnId` |
| `DescribeEnterpriseSGRuleProgress` | Describe enterprise sgrule progress |
| `DescribeSwitchLists` | Describe switch lists |
| `DescribeCcnVpcFwSwitch` | Describe ccn vpc fw switch<br>Required: `CcnId` |
| `DescribeVpcAclEdgeRange` | Describe vpc acl edge range<br>Required: `FromList` |
| `DescribeVpcFwCcnPolicyWhiteList` | Describe vpc fw ccn policy white list |
| `DescribeRuleOverview` | Describe rule overview |
| `DescribeIPStatusList` | Describe ipstatus list<br>Required: `IPList` |
| `DescribeSecurityGroupRegionList` | Describe security group region list |
| `DescribeCfwAssets` | Describe cfw assets |
| `DescribeCfwInsStatus` | Describe cfw ins status |
| `DescribeEnterpriseSecurityGroupRule` | Describe enterprise security group rule<br>Required: `PageNo` (default 1), `PageSize` |
| `DescribeSerialRegion` | Describe serial region |
| `DescribeLogs` | Describe logs<br>Required: `Index`, `Limit`, `Offset`, `StartTime`, `EndTime` |
| `DescribeCfwStatusMonitor` | Describe cfw status monitor<br>Required: `Op`, `FirewallType` |
| `DescribeClusterNatCcnFwSwitchList` | Describe cluster nat ccn fw switch list |
| `DescribeIpsRuleListNew` | Describe ips rule list new<br>Required: `Limit`, `Offset` |
| `DescribeNatFwClusterRegionStatus` | Describe nat fw cluster region status<br>Required: `NatClusterRegionStatusQueryList` |
| `DescribeEnterpriseSecurityGroupRuleList` | Describe enterprise security group rule list<br>Required: `Limit`, `Offset` |
| `DescribeCfwEips` | Describe cfw eips<br>Required: `Mode`, `NatGatewayId` |
| `DescribeBlockIgnoreList` | Describe block ignore list<br>Required: `Limit`, `Offset`, `Direction`, `Order`, `By`, `ShowType` |
| `DescribeLogStorageStatistic` | Describe log storage statistic |
| `DescribeOfflineExportTask` | Describe offline export task<br>Required: `Limit`, `Offset` |
| `DescribeEdgeIpSimple` | Describe edge ip simple |
| `ExportLogsOffline` | Export logs offline<br>Required: `Index`, `StartTime`, `EndTime`, `TaskName`, `DataFormat`, `CompressionFormat`, `Order`, `Length` |
| `DescribeAssociatedInstanceList` | Describe associated instance list<br>Required: `Offset`, `Limit`, `Area` |
| `DescribeNatAcRule` | Describe nat ac rule<br>Required: `Limit`, `Offset` |
| `DescribeFwSyncStatus` | Describe fw sync status |
| `DescribeNatFwInstance` | Describe nat fw instance |
| `DescribeCfwRiskOverview` | Describe cfw risk overview |
| `DescribeCfwRuleOptimization` | Describe cfw rule optimization<br>Required: `RuleType` |
| `DescribeSwitchError` | Describe switch error |
| `DescribeTLogInfo` | Describe tlog info<br>Required: `EndTime`, `QueryType`, `StartTime` |
| `DescribeNatRuleScopes` | Describe nat rule scopes |
| `DescribeIpsModeSwitch` | Describe ips mode switch |
| `DescribeAddressTemplateList` | Describe address template list |
| `DescribeGuideScanInfo` | Describe guide scan info |
| `DescribeAclRegInfo` | Describe acl reg info |
| `CheckClusterVpcFwPreAccess` | Check cluster vpc fw pre access<br>Required: `CcnSwitch`, `CheckMode` |
| `DescribeCfwAnalysisData` | Describe cfw analysis data<br>Required: `Scenario` |
| `DescribeNatFwInstancesInfo` | Describe nat fw instances info |
| `SearchLog` | Search log<br>Required: `From`, `To`, `Query` |
| `DescribeResourceGroup` | Describe resource group<br>Required: `QueryType` |
| `DescribeTLogIpList` | Describe tlog ip list<br>Required: `EndTime`, `QueryType`, `StartTime`, `Top` |
| `DescribeCcnInstanceRegionStatus` | Describe ccn instance region status<br>Required: `CcnId` |
| `DescribeOfflineExportTemporaryCredentials` | Describe offline export temporary credentials<br>Required: `TaskId` |
| `DescribeBlockStaticList` | Describe block static list<br>Required: `EndTime`, `QueryType`, `StartTime`, `Top` |
| `DescribeFwEdgeIps` | Describe fw edge ips |
| `DescribeAcLists` | Describe ac lists |
## Mutations (gated — need allowlist, 28)

| Action | What it does |
|---|---|
| `AddVpcAcRule` | Add vpc ac rule<br>Required: `Rules` |
| `AddEnterpriseSecurityGroupRules` | Add enterprise security group rules<br>Required: `Data` |
| `CreateWhiteRule` | Create white rule<br>Required: `RuleType`, `Rules` |
| `CreateNatFwInstance` | Create nat fw instance<br>Required: `Name`, `Width`, `Mode` |
| `UpdateCheckCcnNonDirectFlag` | Update check ccn non direct flag<br>Required: `CcnId` |
| `CreateBlockIgnoreRuleList` | Create block ignore rule list<br>Required: `Rules`, `RuleType` |
| `UpdateClusterVpcFw` | Update cluster vpc fw<br>Required: `CcnSwitch` |
| `CreateSecurityGroupRules` | Create security group rules<br>Required: `Data`, `Direction` (default 1) |
| `CreateAlertCenterRuleAsync` | Create alert center rule async<br>Required: `AlertDirection`, `HandleDirection`, `HandleTime`, `HandleType` |
| `CreateNatFwDnatRule` | Create nat fw dnat rule<br>Required: `Mode` |
| `CreateBlockIgnoreRuleNew` | Create block ignore rule new<br>Required: `RuleType`, `Rules` |
| `CloseClusterNatFwSwitch` | Close cluster nat fw switch<br>Required: `NatInsId`, `CcnId` |
| `CreateAlertCenterOmit` | Create alert center omit<br>Required: `HandleIdList`, `TableType` |
| `AddAclRule` | Add acl rule<br>Required: `Rules` |
| `CreateAlertCenterIsolate` | Create alert center isolate<br>Required: `HandleAssetList`, `HandleTime`, `AlertDirection`, `IsolateType` |
| `CreateChooseVpcs` | Create choose vpcs<br>Required: `VpcList`, `AllZoneList` |
| `SetNatFwDnatRule` | Set nat fw dnat rule<br>Required: `Mode`, `OperationType` (add | del | modify) |
| `CreateAlertCenterRule` | Create alert center rule<br>Required: `HandleTime`, `HandleType`, `AlertDirection`, `HandleDirection` |
| `ExpandCfwVertical` | Run expand cfw vertical<br>Required: `FwType`, `Width` |
| `CreateVpcFwGroup` | Create vpc fw group<br>Required: `Name`, `Mode`, `VpcFwInstances`, `SwitchMode`, `FwVpcCidr` |
| `OpenClusterNatFwSwitch` | Open cluster nat fw switch<br>Required: `NatCcnSwitch` |
| `CreateDatabaseWhiteListRules` | Create database white list rules<br>Required: `DatabaseWhiteListRuleData` |
| `CreateNatFwInstanceWithDomain` | Create nat fw instance with domain<br>Required: `Name`, `Width`, `Mode` |
| `CreateAcRules` | Create ac rules<br>Required: `Data` |
| `SetNatFwEip` | Set nat fw eip<br>Required: `OperationType`, `CfwInstance` |
| `SyncFwOperate` | Sync fw operate<br>Required: `SyncType` |
| `CreateAddressTemplate` | Create address template<br>Required: `Name`, `Detail`, `IpString`, `Type` |
| `AddNatAcRule` | Add nat ac rule<br>Required: `Rules` |

## Blocked destructive actions (58)

`RemoveVpcAcRule`, `DeleteBlockIgnoreRuleNew`, `ModifyEWRuleStatus`, `StopSecurityGroupRuleDispatch`, `ModifyResourceGroup`, `ModifyBlockTop`, `ModifyVpcFwGroup`, `ModifyAssetSync`, `DeleteVpcFwGroup`, `ModifySecurityGroupSequenceRules`, `RemoveEnterpriseSecurityGroupRule`, `ModifyClusterVpcFwSwitch`, `ModifyIpsModeSwitch`, `DeleteRemoteAccessDomain`, `DeleteNatFwDnatRule`, `ModifyBlockIgnoreRuleNew`, `ModifyEdgeIpSwitch`, `ModifyBlockIgnoreRule`, `ModifySecurityGroupRule`, `ModifyVpcAcRule`, `ModifyNatFwVpcDnsSwitch`, `ModifySecurityGroupItemRuleStatus`, `DeleteResourceGroup`, `RemoveOfflineExportTask`, `DeleteWhiteRule`, `ModifyVpcFwSequenceRules`, `RemoveAcRule`, `ModifyEnterpriseSecurityGroupRule`, `ModifyNatAcRule`, `DeleteSecurityGroupRule`, `ModifyAddressTemplate`, `ModifyClusterNatFwSwitch`, `ModifyTableStatus`, `ModifyBlockIgnoreList`, `ModifyAssetScan`, `DeleteAddressTemplate`, `ModifySequenceRules`, `RemoveAclRule`, `ModifyClusterFwBypass`, `ModifySequenceAclRules`, `ModifyFwGroupSwitch`, `ModifyNatSequenceRules`, `ModifyAllRuleStatus`, `DeleteBlockIgnoreRuleList`, `ModifyAclRule`, `RemoveNatAcRule`, `DeleteNatFwInstance`, `ModifyWhiteRule`, `ModifyIsolateTable`, `ModifyAllPublicIPSwitchStatus`, `ModifyNatInstance`, `DeleteAcRule`, `ModifyEnterpriseSecurityDispatchStatus`, `ModifyRunSyncAsset`, `ModifyNatFwReSelect`, `ModifyStorageSetting`, `ModifyAcRule`, `ModifyNatFwSwitch` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cfw`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190904` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cfw"`) for the allow/block decision and reason.

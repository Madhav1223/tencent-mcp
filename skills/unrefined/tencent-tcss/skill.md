---
name: tencent-tcss
description: Tencent Cloud TCSS via the Tencent MCP server — 357 actions in API version v20201101 (223 read-only auto-allowed). Use for image, asset, export, scan, virus, registry. Triggers on mentions of tcss, image, asset, export, scan, virus, registry, firewall, network. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Containers & registries
metadata:
  version: "4"
---

# Tencent Cloud TCSS

Containers & registries: 357 actions in API version `v20201101` — 223 read-only (auto-allowed), 76 gated mutations, 58 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tcss"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Registries are region-scoped: image URLs embed the region, and pulling across regions fails without replication rules — create replication before deploying multi-region.
Namespaces/repositories need explicit access policy (private by default); image pull secrets on the workload side must match.
Deployments are async — after pushing or updating, poll the workload/task status actions until the new revision is stable before declaring success.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tcss/v20201101 — action signatures in `tcss_client.ts`, full request/response shapes in `tcss_models.ts`.

## Read actions (auto-allowed, 223)

| Action | What it does |
|---|---|
| `DescribePublicKey` | Describe public key |
| `DescribeAssetAppServiceList` | Describe asset app service list |
| `DescribeExportJobResult` | Describe export job result<br>Required: `JobId` |
| `DescribeAccessControlEvents` | Describe access control events |
| `DescribeEscapeEventInfo` | Describe escape event info |
| `DescribeAssetImageRegistryAssetStatus` | Describe asset image registry asset status |
| `DescribeAssetImageRegistryRegistryList` | Describe asset image registry registry list |
| `DescribeAbnormalProcessLevelSummary` | Describe abnormal process level summary |
| `DescribeRiskSyscallWhiteListDetail` | Describe risk syscall white list detail<br>Required: `WhiteListId` |
| `DescribeAssetImageRegistryRegistryDetail` | Describe asset image registry registry detail<br>Required: `RegistryId` |
| `DescribeK8sApiAbnormalRuleScopeList` | Describe k8s api abnormal rule scope list<br>Required: `RuleID` |
| `DescribeReverseShellDetail` | Describe reverse shell detail<br>Required: `EventId` |
| `DescribeAssetImageBindRuleInfo` | Describe asset image bind rule info |
| `DescribeVulScanInfo` | Describe vul scan info |
| `DescribeAssetImageRegistryListExport` | Describe asset image registry list export |
| `DescribeCheckItemList` | Describe check item list |
| `DescribeNetworkFirewallPolicyList` | Describe network firewall policy list<br>Required: `ClusterId` |
| `DescribeAssetClusterList` | Describe asset cluster list |
| `DescribeAssetImageRegistryVulListExport` | Describe asset image registry vul list export |
| `DescribeVulSummary` | Describe vul summary |
| `DescribeComplianceAssetDetailInfo` | Describe compliance asset detail info<br>Required: `CustomerAssetId` |
| `DescribeVulDefenceEventDetail` | Describe vul defence event detail<br>Required: `EventID` |
| `DescribeSearchTemplates` | Describe search templates |
| `DescribeSearchLogs` | Describe search logs |
| `DescribeImageRiskSummary` | Describe image risk summary |
| `DescribeEscapeEventTendency` | Describe escape event tendency<br>Required: `EndTime`, `StartTime` |
| `DescribeVulTopRanking` | Describe vul top ranking<br>Required: `CategoryType` |
| `DescribeNetworkFirewallAuditRecord` | Describe network firewall audit record |
| `DescribeImageAutoAuthorizedTaskList` | Describe image auto authorized task list<br>Required: `StartTime`, `EndTime` |
| `DescribeImageDenyRuleSummary` | Describe image deny rule summary |
| `DescribeProVersionInfo` | Describe pro version info |
| `DescribeNetworkFirewallNamespaceList` | Describe network firewall namespace list<br>Required: `ClusterId` |
| `DescribeClusterNodes` | Describe cluster nodes |
| `DescribeK8sApiAbnormalRuleInfo` | Describe k8s api abnormal rule info<br>Required: `RuleID` |
| `DescribeRaspRuleVuls` | Describe rasp rule vuls |
| `DescribeComplianceAssetList` | Describe compliance asset list |
| `DescribeLogStorageStatistic` | Describe log storage statistic |
| `DescribeVirusScanConfig` | Describe virus scan config |
| `DescribeAssetImageRiskListExport` | Describe asset image risk list export<br>Required: `ExportField`, `ImageID` |
| `DescribeSecLogJoinTypeList` | Describe sec log join type list |
| `DescribeVulDefenceSetting` | Describe vul defence setting |
| `DescribeVulRegistryImageList` | Describe vul registry image list<br>Required: `PocID` |
| `DescribeAutoAuthorizedRuleHost` | Describe auto authorized rule host<br>Required: `RuleId` |
| `DescribeEventEscapeImageList` | Describe event escape image list |
| `DescribeUserCluster` | Describe user cluster |
| `DescribeAbnormalProcessRules` | Describe abnormal process rules |
| `DescribeAssetImageVirusList` | Describe asset image virus list<br>Required: `ImageID` |
| `DescribeAssetWebServiceList` | Describe asset web service list |
| `DescribeK8sApiAbnormalEventInfo` | Describe k8s api abnormal event info<br>Required: `ID` |
| `DescribeAssetHostDetail` | Describe asset host detail<br>Required: `HostId` |
| `DescribeEscapeEventTypeSummary` | Describe escape event type summary |
| `DescribeMaliciousConnectionWhiteList` | Describe malicious connection white list |
| `DescribeVirusScanTaskStatus` | Describe virus scan task status |
| `DescribeAssetImageDetail` | Describe asset image detail<br>Required: `ImageID` |
| `DescribeImageDenyEventTendency` | Describe image deny event tendency<br>Required: `StartTime`, `EndTime` |
| `DescribeAssetHostList` | Describe asset host list |
| `DescribeIndexList` | Describe index list |
| `DescribeNetworkFirewallPolicyStatus` | Describe network firewall policy status<br>Required: `TaskId` |
| `DescribeAffectedWorkloadList` | Describe affected workload list<br>Required: `CheckItemId` |
| `DescribeScanIgnoreVulList` | Describe scan ignore vul list |
| `DescribeAssetImageScanStatus` | Describe asset image scan status |
| `DescribeSecLogDeliveryKafkaOptions` | Describe sec log delivery kafka options |
| `DescribeAssetImageRegistryVirusListExport` | Describe asset image registry virus list export |
| `DescribeAffectedClusterCount` | Describe affected cluster count |
| `CheckNetworkFirewallPolicyYaml` | Check network firewall policy yaml<br>Required: `ClusterId`, `PolicyName` |
| `DescribeCompliancePeriodTaskList` | Describe compliance period task list |
| `DescribeAssetImageRegistryDetail` | Describe asset image registry detail |
| `DescribeVirusAutoIsolateSampleDetail` | Describe virus auto isolate sample detail<br>Required: `MD5` |
| `DescribeVirusDetail` | Describe virus detail<br>Required: `Id` |
| `DescribeVulDetail` | Describe vul detail<br>Required: `PocID` |
| `DescribeEmergencyVulList` | Describe emergency vul list |
| `DescribeNetworkFirewallPolicyDiscover` | Describe network firewall policy discover<br>Required: `TaskId` |
| `DescribeAssetContainerDetail` | Describe asset container detail<br>Required: `ContainerId` |
| `DescribeAssetImageRegistryRiskInfoList` | Describe asset image registry risk info list |
| `DescribeCompliancePolicyItemAffectedSummary` | Describe compliance policy item affected summary<br>Required: `CustomerPolicyItemId` |
| `DescribeAssetSuperNodeList` | Describe asset super node list |
| `DescribeReverseShellRegexpWhiteList` | Describe reverse shell regexp white list |
| `DescribeVulImageList` | Describe vul image list<br>Required: `PocID` |
| `DescribeAgentInstallCommand` | Describe agent install command<br>Required: `IsCloud`, `NetType` |
| `DescribeAssetImageScanTask` | Describe asset image scan task |
| `DescribeVulDefencePlugin` | Describe vul defence plugin |
| `DescribeAccessControlRules` | Describe access control rules |
| `DescribeAssetImageVulListExport` | Describe asset image vul list export<br>Required: `ExportField`, `ImageID` |
| `DescribeSuperNodePodList` | Describe super node pod list |
| `DescribeComplianceWhitelistItemList` | Describe compliance whitelist item list |
| `DescribeMaliciousConnectionBlackList` | Describe malicious connection black list |
| `DescribeAssetPortList` | Describe asset port list |
| `DescribeVirusMonitorConfig` | Describe virus monitor config |
| `DescribeEscapeEventDetail` | Describe escape event detail<br>Required: `EventId` |
| `DescribeImageSimpleList` | Describe image simple list |
| `DescribeEscapeSafeState` | Describe escape safe state |
| `DescribeVirusTaskList` | Describe virus task list<br>Required: `TaskId` |
| `DescribeVirusList` | Describe virus list |
| `DescribeNetworkFirewallClusterRefreshStatus` | Describe network firewall cluster refresh status<br>Required: `TaskId` |
| `DescribeVirusAutoIsolateSetting` | Describe virus auto isolate setting |
| `DescribeRaspRules` | Describe rasp rules |
| `DescribeContainerSecEventSummary` | Describe container sec event summary |
| `DescribeReverseShellEvents` | Describe reverse shell events |
| `DescribeAssetImageRegistryScanStatusOneKey` | Describe asset image registry scan status one key |
| `DescribeImageDenyRuleDetail` | Describe image deny rule detail<br>Required: `RuleID` |
| `DescribeK8sApiAbnormalTendency` | Describe k8s api abnormal tendency<br>Required: `TendencyPeriod` (default 7) |
| `DescribeComplianceAssetPolicyItemList` | Describe compliance asset policy item list<br>Required: `CustomerAssetId` |
| `DescribeRiskDnsEventDetail` | Describe risk dns event detail<br>Required: `EventID` |
| `DescribeVirusScanSetting` | Describe virus scan setting |
| `DescribePromotionActivity` | Describe promotion activity<br>Required: `ActiveID` |
| `DescribeAccessControlRuleDetail` | Describe access control rule detail |
| `DescribeAccessControlEventsExport` | Describe access control events export |
| `DescribeImageAutoAuthorizedLogList` | Describe image auto authorized log list<br>Required: `TaskId` |
| `DescribeInspectionReport` | Describe inspection report |
| `DescribeAssetImageVulList` | Describe asset image vul list<br>Required: `ImageID` |
| `DescribeVulScanAuthorizedImageSummary` | Describe vul scan authorized image summary |
| `DescribeRiskSyscallNames` | Describe risk syscall names |
| `DescribeAssetDBServiceList` | Describe asset dbservice list |
| `DescribeVulDefenceEvent` | Describe vul defence event |
| `DescribeImageDenyEventList` | Describe image deny event list |
| `DescribeImageComponentList` | Describe image component list<br>Required: `ImageID` |
| `DescribeAbnormalProcessEventTendency` | Describe abnormal process event tendency<br>Required: `StartTime`, `EndTime` |
| `DescribeSecLogVasInfo` | Describe sec log vas info |
| `DescribeAssetImageRegistryVulList` | Describe asset image registry vul list |
| `DescribeVirusScanTimeoutSetting` | Describe virus scan timeout setting<br>Required: `ScanType` |
| `DescribeVirusSummary` | Describe virus summary |
| `DescribeSearchExportList` | Describe search export list<br>Required: `Query` |
| `DescribeRiskSyscallEventsExport` | Describe risk syscall events export |
| `DescribeAssetContainerList` | Describe asset container list |
| `DescribeVirusAutoIsolateSampleDownloadURL` | Describe virus auto isolate sample download url<br>Required: `MD5` |
| `DescribeAssetComponentList` | Describe asset component list<br>Required: `ContainerID` |
| `DescribeClusterDetail` | Describe cluster detail<br>Required: `ClusterId` |
| `DescribeAssetImageScanSetting` | Describe asset image scan setting |
| `DescribeRefreshTask` | Describe refresh task<br>Required: `TaskId` |
| `DescribeVirusManualScanEstimateTimeout` | Describe virus manual scan estimate timeout<br>Required: `ScanRangeType`, `ScanRangeAll` |
| `DescribeImageAutoAuthorizedRule` | Describe image auto authorized rule |
| `DescribeAbnormalProcessRuleDetail` | Describe abnormal process rule detail |
| `DescribeESAggregations` | Describe esaggregations<br>Required: `Query` |
| `DescribeTaskResultSummary` | Describe task result summary |
| `DescribeEscapeWhiteList` | Describe escape white list |
| `DescribeContainerAssetSummary` | Describe container asset summary |
| `DescribeReverseShellEventsExport` | Describe reverse shell events export |
| `DescribeVulImageSummary` | Describe vul image summary |
| `DescribeImageRiskTendency` | Describe image risk tendency<br>Required: `StartTime`, `EndTime` |
| `DescribeAgentDaemonSetCmd` | Describe agent daemon set cmd<br>Required: `IsCloud`, `NetType` |
| `DescribeComplianceTaskAssetSummary` | Describe compliance task asset summary<br>Required: `AssetTypeSet` |
| `DescribePostPayDetail` | Describe post pay detail |
| `DescribeComplianceScanFailedAssetList` | Describe compliance scan failed asset list |
| `DescribeSupportDefenceVul` | Describe support defence vul |
| `DescribeAssetImageSimpleList` | Describe asset image simple list |
| `DescribeAssetImageRiskList` | Describe asset image risk list<br>Required: `ImageID` |
| `DescribeSecLogCleanSettingInfo` | Describe sec log clean setting info |
| `DescribeSystemVulList` | Describe system vul list |
| `DescribeVulScanLocalImageList` | Describe vul scan local image list<br>Required: `TaskID` |
| `DescribeComplianceTaskPolicyItemSummaryList` | Describe compliance task policy item summary list |
| `DescribeRiskSyscallWhiteLists` | Describe risk syscall white lists |
| `DescribeSecLogAlertMsg` | Describe sec log alert msg |
| `DescribeUnfinishRefreshTask` | Describe unfinish refresh task |
| `DescribeAccessControlDetail` | Describe access control detail<br>Required: `EventId` |
| `DescribeAssetProcessList` | Describe asset process list |
| `DescribeNetworkFirewallPodLabelsList` | Describe network firewall pod labels list<br>Required: `ClusterId` |
| `DescribeESHits` | Describe eshits<br>Required: `Query` |
| `DescribeWarningRules` | Describe warning rules |
| `DescribeAffectedNodeList` | Describe affected node list<br>Required: `CheckItemId` |
| `DescribeAssetImageHostList` | Describe asset image host list |
| `DescribeABTestConfig` | Describe abtest config |
| `DescribeVulLevelImageSummary` | Describe vul level image summary |
| `DescribeExportJobDownloadURL` | Describe export job download url<br>Required: `JobID` |
| `DescribeRiskList` | Describe risk list |
| `DescribeUnauthorizedCoresTendency` | Describe unauthorized cores tendency |
| `DescribeAssetImageRegistrySummary` | Describe asset image registry summary |
| `DescribeReverseShellWhiteListDetail` | Describe reverse shell white list detail<br>Required: `WhiteListId` |
| `DescribeSecLogDeliveryKafkaSetting` | Describe sec log delivery kafka setting |
| `DescribeVulContainerList` | Describe vul container list<br>Required: `PocID` |
| `DescribeWebVulList` | Describe web vul list |
| `DescribeVirusAutoIsolateSampleList` | Describe virus auto isolate sample list |
| `DescribeK8sApiAbnormalRuleList` | Describe k8s api abnormal rule list |
| `DescribeImageRegistryTimingScanTask` | Describe image registry timing scan task |
| `DescribeImageDenyEventDetail` | Describe image deny event detail<br>Required: `EventID` |
| `DescribeExportJobManageList` | Describe export job manage list |
| `DescribeReverseShellWhiteLists` | Describe reverse shell white lists |
| `DescribeVirusMonitorSetting` | Describe virus monitor setting |
| `DescribeAssetImageRegistryVirusList` | Describe asset image registry virus list |
| `DescribeNetworkFirewallPolicyYamlDetail` | Describe network firewall policy yaml detail<br>Required: `Id` |
| `DescribeVirusWhiteListRules` | Describe virus white list rules |
| `DescribePurchaseStateInfo` | Describe purchase state info |
| `DescribeValueAddedSrvInfo` | Describe value added srv info |
| `DescribeVulDefenceHost` | Describe vul defence host |
| `DescribeSecLogDeliveryClsOptions` | Describe sec log delivery cls options |
| `DescribeImageDenyRuleList` | Describe image deny rule list |
| `DescribeVulIgnoreRegistryImageList` | Describe vul ignore registry image list<br>Required: `PocID` |
| `DescribeImageRegistryNamespaceList` | Describe image registry namespace list |
| `DescribeK8sApiAbnormalEventList` | Describe k8s api abnormal event list |
| `DescribeAssetImageVirusListExport` | Describe asset image virus list export<br>Required: `ExportField`, `ImageID` |
| `DescribeAssetSummary` | Describe asset summary |
| `DescribeVulIgnoreLocalImageList` | Describe vul ignore local image list<br>Required: `PocID` |
| `DescribeNetworkFirewallClusterList` | Describe network firewall cluster list |
| `DescribeAssetImageRegistryRiskListExport` | Describe asset image registry risk list export |
| `DescribeK8sApiAbnormalSummary` | Describe k8s api abnormal summary |
| `DescribeEscapeRuleInfo` | Describe escape rule info |
| `DescribeClusterSummary` | Describe cluster summary |
| `DescribeNewestVul` | Describe newest vul |
| `DescribeRiskSyscallDetail` | Describe risk syscall detail<br>Required: `EventId` |
| `DescribeVulLevelSummary` | Describe vul level summary<br>Required: `CategoryType` |
| `DescribeNetworkFirewallNamespaceLabelList` | Describe network firewall namespace label list<br>Required: `ClusterId` |
| `DescribeTcssSummary` | Describe tcss summary |
| `DescribeVirusSampleDownloadUrl` | Describe virus sample download url<br>Required: `ID` |
| `DescribeAssetImageList` | Describe asset image list |
| `DescribeReverseShellRegexpWhiteListInfo` | Describe reverse shell regexp white list info<br>Required: `RuleID` |
| `ExportVirusList` | Export virus list |
| `DescribeNetworkFirewallPolicyDetail` | Describe network firewall policy detail<br>Required: `Id` |
| `DescribeSecLogJoinObjectList` | Describe sec log join object list<br>Required: `LogType` |
| `DescribeAbnormalProcessEvents` | Describe abnormal process events |
| `DescribeAssetSyncLastTime` | Describe asset sync last time |
| `DescribeCompliancePolicyItemAffectedAssetList` | Describe compliance policy item affected asset list<br>Required: `CustomerPolicyItemId` |
| `DescribeAbnormalProcessDetail` | Describe abnormal process detail<br>Required: `EventId` |
| `DescribeVulDefenceEventTendency` | Describe vul defence event tendency<br>Required: `StartTime`, `EndTime` |
| `DescribeRiskDnsList` | Describe risk dns list |
| `DescribeVirusEventTendency` | Describe virus event tendency<br>Required: `TendencyPeriod` (default 7) |
| `DescribeAssetImageRegistryList` | Describe asset image registry list |
| `DescribeSecLogKafkaUIN` | Describe sec log kafka uin |
| `DescribeSecLogDeliveryClsSetting` | Describe sec log delivery cls setting |
| `DescribeImageAuthorizedInfo` | Describe image authorized info |
| `DescribeRiskSyscallEvents` | Describe risk syscall events |
| `DescribeVulTendency` | Describe vul tendency<br>Required: `StartTime`, `EndTime`, `SphereOfInfluence` |
| `CheckRepeatAssetImageRegistry` | Check repeat asset image registry<br>Required: `Name` |
| `DescribeUserPodList` | Describe user pod list |
| `DescribeSecEventsTendency` | Describe sec events tendency<br>Required: `StartTime`, `EndTime` |
## Mutations (gated — need allowlist, 76)

| Action | What it does |
|---|---|
| `CreateAbnormalProcessRulesExportJob` | Create abnormal process rules export job |
| `AddAndPublishNetworkFirewallPolicyDetail` | Add and publish network firewall policy detail<br>Required: `ClusterId`, `PolicyName`, `FromPolicyRule`, `ToPolicyRule`, `PodSelector` |
| `CreateComponentExportJob` | Create component export job<br>Required: `ImageID` |
| `CreateK8sApiAbnormalRuleExportJob` | Create k8s api abnormal rule export job |
| `CreateDefenceVulExportJob` | Create defence vul export job |
| `AddOrModifyMaliciousConnectionWhiteList` | Add or modify malicious connection white list<br>Required: `RequestType` |
| `CreateAssetImageVirusExportJob` | Create asset image virus export job<br>Required: `ExportField`, `ImageID` |
| `UpdateAndPublishNetworkFirewallPolicyDetail` | Update and publish network firewall policy detail<br>Required: `ClusterId`, `Id`, `FromPolicyRule`, `ToPolicyRule`, `PodSelector` |
| `AddComplianceAssetPolicySetToWhitelist` | Add compliance asset policy set to whitelist<br>Required: `AssetPolicySetList` |
| `CreateWebVulExportJob` | Create web vul export job |
| `CreateSearchTemplate` | Create search template<br>Required: `SearchTemplate` |
| `ScanComplianceAssets` | Scan compliance assets<br>Required: `CustomerAssetIdSet` |
| `AddIgnoreVul` | Add ignore vul<br>Required: `List` |
| `CreateVulScanTask` | Create vul scan task |
| `UninstallClusterContainerSecurity` | Uninstall cluster container security<br>Required: `ClusterIDs` |
| `CreateEscapeWhiteListExportJob` | Create escape white list export job |
| `AddEditImageAutoAuthorizedRule` | Add edit image auto authorized rule<br>Required: `RangeType`, `MaxDailyCount`, `IsEnabled` |
| `AddEditWarningRules` | Add edit warning rules<br>Required: `WarningRules` |
| `CreateVulContainerExportJob` | Create vul container export job<br>Required: `PocID` |
| `AddAndPublishNetworkFirewallPolicyYamlDetail` | Add and publish network firewall policy yaml detail<br>Required: `ClusterId`, `PolicyName` |
| `CreateEscapeEventsExportJob` | Create escape events export job |
| `InitializeUserComplianceEnvironment` | Initialize user compliance environment |
| `AddEditAccessControlRule` | Add edit access control rule<br>Required: `RuleInfo` |
| `CreateK8sApiAbnormalRuleInfo` | Create k8s api abnormal rule info<br>Required: `RuleInfo` |
| `AddEditAbnormalProcessRule` | Add edit abnormal process rule<br>Required: `RuleInfo` |
| `CreateK8sApiAbnormalEventExportJob` | Create k8s api abnormal event export job |
| `UpdateAndPublishNetworkFirewallPolicyYamlDetail` | Update and publish network firewall policy yaml detail<br>Required: `ClusterId`, `Id` |
| `CreateVulImageExportJob` | Create vul image export job<br>Required: `PocID` |
| `CreateNetworkFirewallPolicyDiscover` | Create network firewall policy discover<br>Required: `ClusterId` |
| `CreateAssetImageRegistryScanTaskOneKey` | Create asset image registry scan task one key |
| `UpdateNetworkFirewallPolicyDetail` | Update network firewall policy detail<br>Required: `ClusterId`, `Id`, `FromPolicyRule`, `ToPolicyRule`, `PodSelector` |
| `AddEditReverseShellWhiteList` | Add edit reverse shell white list<br>Required: `WhiteListInfo` |
| `AddOrModifyVirusWhiteListRule` | Add or modify virus white list rule<br>Required: `Md5List`, `Scope` |
| `AddEscapeWhiteList` | Add escape white list<br>Required: `EventType`, `ImageIDs` |
| `CreateSystemVulExportJob` | Create system vul export job |
| `ScanCompliancePolicyItems` | Scan compliance policy items<br>Required: `CustomerPolicyItemIdSet` |
| `CreateComplianceTask` | Create compliance task |
| `AddNetworkFirewallPolicyDetail` | Add network firewall policy detail<br>Required: `ClusterId`, `PolicyName`, `FromPolicyRule`, `ToPolicyRule`, `PodSelector` |
| `CreateAssetImageRegistryScanTask` | Create asset image registry scan task |
| `SetCheckMode` | Set check mode<br>Required: `ClusterIds` |
| `ScanComplianceAssetsByPolicyItem` | Scan compliance assets by policy item<br>Required: `CustomerPolicyItemId`, `CustomerAssetIdSet` |
| `CreateAccessControlsRuleExportJob` | Create access controls rule export job |
| `UpdateNetworkFirewallPolicyYamlDetail` | Update network firewall policy yaml detail<br>Required: `ClusterId`, `Id` |
| `CreateVulDefenceEventExportJob` | Create vul defence event export job |
| `CreateAssetImageScanTask` | Create asset image scan task |
| `SwitchImageAutoAuthorizedRule` | Switch image auto authorized rule<br>Required: `IsEnabled`, `RuleId` |
| `UpdateImageRegistryTimingScanTask` | Update image registry timing scan task<br>Required: `ScanPeriod`, `Enable`, `ScanTime` |
| `CreateEmergencyVulExportJob` | Create emergency vul export job |
| `CreateClusterAccess` | Create cluster access<br>Required: `ClusterIDs` |
| `CreateImageExportJob` | Create image export job |
| `CreateVulExportJob` | Create vul export job<br>Required: `ImageID`, `ExportField` |
| `AddCompliancePolicyAssetSetToWhitelist` | Add compliance policy asset set to whitelist<br>Required: `CustomerPolicyItemId` |
| `CreateProcessEventsExportJob` | Create process events export job |
| `ScanComplianceScanFailedAssets` | Scan compliance scan failed assets<br>Required: `CustomerAssetIdSet` |
| `ConfirmNetworkFirewallPolicy` | Confirm network firewall policy<br>Required: `ClusterId`, `Id` |
| `OpenTcssTrial` | Open tcss trial |
| `CreateNetworkFirewallPublish` | Create network firewall publish<br>Required: `ClusterId`, `Id` |
| `CreateNetworkFirewallUndoPublish` | Create network firewall undo publish<br>Required: `ClusterId`, `Id` |
| `CreateAssetImageScanSetting` | Create asset image scan setting<br>Required: `Enable`, `ScanTime`, `ScanPeriod`, `ScanVirus`, `ScanRisk`, `ScanVul` |
| `CreateVirusScanTask` | Create virus scan task<br>Required: `ScanPathAll`, `ScanRangeType`, `ScanRangeAll`, `Timeout` |
| `CreateRefreshTask` | Create refresh task |
| `CreateClusterCheckTask` | Create cluster check task<br>Required: `ClusterCheckTaskList` |
| `CreateCheckComponent` | Create check component<br>Required: `ClusterInfoList` |
| `CreateVulDefenceHostExportJob` | Create vul defence host export job |
| `CreateNetworkFirewallClusterRefresh` | Create network firewall cluster refresh |
| `AddNetworkFirewallPolicyYamlDetail` | Add network firewall policy yaml detail<br>Required: `ClusterId`, `PolicyName` |
| `CreateVirusScanAgain` | Create virus scan again<br>Required: `TaskId` |
| `SyncAssetImageRegistryAsset` | Sync asset image registry asset |
| `CreateRiskDnsEventExportJob` | Create risk dns event export job |
| `CreateExportComplianceStatusListJob` | Create export compliance status list job<br>Required: `AssetType`, `ExportByAsset`, `ExportAll` |
| `AddAssetImageRegistryRegistryDetail` | Add asset image registry registry detail<br>Required: `Name`, `Username`, `Password`, `Url`, `RegistryType`, `NetType` |
| `UpdateAssetImageRegistryRegistryDetail` | Update asset image registry registry detail<br>Required: `Name`, `Username`, `Password`, `Url`, `RegistryType`, `NetType` |
| `CreateOrModifyPostPayCores` | Create or modify post pay cores<br>Required: `CoresCnt` |
| `AddCompliancePolicyItemToWhitelist` | Add compliance policy item to whitelist<br>Required: `CustomerPolicyItemIdSet` |
| `CreateHostExportJob` | Create host export job |
| `AddEditRiskSyscallWhiteList` | Add edit risk syscall white list |

## Blocked destructive actions (58)

`DeleteSearchTemplate`, `StopVulScanTask`, `DeleteAccessControlRules`, `ModifySecLogDeliveryClsSetting`, `DeleteIgnoreVul`, `ModifyVirusMonitorSetting`, `ModifyAbnormalProcessStatus`, `ModifySecLogDeliveryKafkaSetting`, `ModifySecLogKafkaUIN`, `ModifySecLogJoinState`, `ModifyVirusAutoIsolateSetting`, `DeleteMachine`, `DeleteRiskSyscallWhiteLists`, `ModifyK8sApiAbnormalEventStatus`, `DeleteCompliancePolicyAssetSetFromWhitelist`, `RemoveAssetImageRegistryRegistryDetail`, `ModifyVirusFileStatus`, `ModifyAssetImageRegistryScanStop`, `DeleteReverseShellEvents`, `DeleteAbnormalProcessRules`, `ModifyAsset`, `ModifySecLogCleanSettingInfo`, `RenewImageAuthorizeState`, `ModifyVirusScanTimeoutSetting`, `DeleteComplianceAssetPolicySetFromWhitelist`, `ModifyEscapeWhiteList`, `ModifyEscapeEventStatus`, `ModifySecLogJoinObjects`, `StopVirusScanTask`, `ModifyRiskSyscallStatus`, `ModifyVirusAutoIsolateExampleSwitch`, `DeleteK8sApiAbnormalRule`, `ModifyRaspRules`, `DeleteCompliancePolicyItemFromWhitelist`, `ModifyReverseShellStatus`, `DeleteNetworkFirewallPolicyDetail`, `ModifyVulDefenceEventStatus`, `ModifyAccessControlRuleStatus`, `ModifyVulDefenceSetting`, `ModifyVirusScanSetting`, `ModifyAssetImageRegistryScanStopOneKey`, `ModifyRiskDnsEventStatus`, `DeleteReverseShellWhiteLists`, `ModifyAssetImageScanStop`, `ModifyK8sApiAbnormalRuleInfo`, `ModifyEscapeRule`, `ResetSecLogTopicConfig`, `DeleteEscapeWhiteList`, `ModifyContainerNetStatus`, `DeleteRaspRules`, `DeleteRiskSyscallEvents`, `ModifyImageAuthorized`, `ModifyAccessControlStatus`, `ModifyDefendStatus`, `DeleteVirusWhiteListRule`, `ModifyCompliancePeriodTask`, `ModifyAbnormalProcessRuleStatus`, `ModifyK8sApiAbnormalRuleStatus` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tcss`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201101` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tcss"`) for the allow/block decision and reason.

---
name: tencent-csip
description: Tencent Cloud CSIP via the Tencent MCP server — 752 actions in API version v20221121 (432 read-only auto-allowed). Use for dspm, asset, risk, image, scan, export. Triggers on mentions of csip, dspm, asset, risk, image, scan, export, identify, baseline. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud CSIP

Security & identity: 752 actions in API version `v20221121` — 432 read-only (auto-allowed), 140 gated mutations, 180 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "csip"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/csip/v20221121 — action signatures in `csip_client.ts`, full request/response shapes in `csip_models.ts`.

## Read actions (auto-allowed, 432)

| Action | What it does |
|---|---|
| `DescribeDspmAssetSecurityAnalyseStatus` | Describe dspm asset security analyse status |
| `DescribeCosSourceIp` | Describe cos source ip |
| `DescribeDbAssetInfo` | Describe db asset info<br>Required: `AssetId` |
| `DescribeDspmIdentifyDistributionStatistics` | Describe dspm identify distribution statistics<br>Required: `StatType` |
| `DescribeComplianceStandardTermTree` | Describe compliance standard term tree<br>Required: `StandardID` |
| `DescribeBanMode` | Describe ban mode |
| `DescribeAccessKeyUserList` | Describe access key user list |
| `DescribeImageSensitiveInfoList` | Describe image sensitive info list |
| `DescribeHostVulOverview` | Describe host vul overview |
| `DescribeDspmApproveHistory` | Describe dspm approve history |
| `DescribeImageRegistryNamespaceList` | Describe image registry namespace list |
| `DescribeVULRiskDetail` | Describe vulrisk detail |
| `DescribeMultiCloudAssetCount` | Describe multi cloud asset count |
| `DescribeRiskItemList` | Describe risk item list |
| `DescribeNotifyAgentOfflineDuration` | Describe notify agent offline duration |
| `DescribeEdrAlertInfo` | Describe edr alert info<br>Required: `Target` |
| `DescribeBruteAttackRules` | Describe brute attack rules |
| `DescribeSecurityScoreOverview` | Describe security score overview |
| `DescribeScanTaskList` | Describe scan task list |
| `DescribeDspmRiskStrategyGroup` | Describe dspm risk strategy group |
| `DescribeDspmUserCkafkaInstanceList` | Describe dspm user ckafka instance list |
| `DescribeDspmAssetFieldSamples` | Describe dspm asset field samples<br>Required: `AssetId`, `DbName`, `TableName`, `FieldName` |
| `DescribeDspmExportTask` | Describe dspm export task |
| `DescribeAssetLastSyncTime` | Describe asset last sync time |
| `DescribeRegistryOverview` | Describe registry overview |
| `DescribeCspmShardConfig` | Describe cspm shard config |
| `DescribeDspmAssetDatabaseList` | Describe dspm asset database list<br>Required: `AssetId` |
| `DescribeSCFNamespaceList` | Describe scfnamespace list<br>Required: `SCFRegion`, `Limit` (default 20) |
| `DescribeDspmRiskTendency` | Describe dspm risk tendency |
| `DescribeCWPScanIpInfo` | Describe cwpscan ip info<br>Required: `IP` |
| `DescribeAgentRunPolicy` | Describe agent run policy |
| `DescribeExposureTrend` | Describe exposure trend |
| `DescribeVulFixedHostDetail` | Describe vul fixed host detail<br>Required: `VulId`, `InstanceId` |
| `DescribeDspmAssetDatabases` | Describe dspm asset databases<br>Required: `AssetId` |
| `DescribeAIAgentCredentialList` | Describe aiagent credential list |
| `DescribeVulFixTaskList` | Describe vul fix task list |
| `DescribeUserAKInfoList` | Describe user akinfo list |
| `DescribeVoucherEligibility` | Describe voucher eligibility<br>Required: `ActivityID`, `ActID` |
| `DescribeNFSScanConf` | Describe nfsscan conf |
| `DescribeCustomRiskRuleDetail` | Describe custom risk rule detail |
| `DescribePublicCloudAssets` | Describe public cloud assets |
| `DescribeDspmAssetLoginCredential` | Describe dspm asset login credential<br>Required: `AssetId` |
| `DescribeAIScheduleList` | Describe aischedule list |
| `DescribeCosAccessPermission` | Describe cos access permission<br>Required: `RelAppId`, `BucketName`, `RelUin` |
| `DescribeRiskCenterAssetViewPortRiskList` | Describe risk center asset view port risk list |
| `DescribeCLSLogListV3` | Describe clslog list v3<br>Required: `From`, `To`, `Query`, `SyntaxRule` |
| `DescribeExposures` | Describe exposures |
| `DescribeImageRegistryTimedScanTaskConfig` | Describe image registry timed scan task config |
| `DescribeEdrAlertSummary` | Describe edr alert summary |
| `DescribeBaselineSubTaskList` | Describe baseline sub task list<br>Required: `TaskID` |
| `DescribeDspmResource` | Describe dspm resource |
| `DescribeDspmPersonApplyHistory` | Describe dspm person apply history |
| `DescribeDspmWhitelistStrategy` | Describe dspm whitelist strategy |
| `DescribeExposeRules` | Describe expose rules |
| `DescribeCustomAssetTagCount` | Describe custom asset tag count |
| `DescribeSourceIPDetail` | Describe source ipdetail<br>Required: `ID` |
| `DescribePortScanTaskCount` | Describe port scan task count |
| `DescribeDspmIdentifyLevelGroupList` | Describe dspm identify level group list |
| `DescribeRiskDetailList` | Describe risk detail list<br>Required: `RiskRuleId` |
| `DescribeClusterContainerList` | Describe cluster container list |
| `DescribeAIAgentSkillList` | Describe aiagent skill list |
| `DescribeCloudAssets` | Describe cloud assets |
| `DescribeBaselineOverview` | Describe baseline overview |
| `DescribeDspmAccessTopologyAssets` | Describe dspm access topology assets |
| `DescribeVulScanTaskDetail` | Describe vul scan task detail<br>Required: `Id` |
| `DescribeBaselinePolicyNameExistAppidList` | Describe baseline policy name exist appid list<br>Required: `PolicyName` |
| `DescribeDspmPayInfo` | Describe dspm pay info |
| `DescribeTCRInstanceList` | Describe tcrinstance list |
| `DescribeClusterAssets` | Describe cluster assets |
| `DescribeImageRegistryList` | Describe image registry list |
| `DescribeSecurityGroupPolicy` | Describe security group policy<br>Required: `Provider`, `AssetID`, `AssetType` |
| `DescribeCosBucketRisk` | Describe cos bucket risk |
| `DescribeDspmAssetAccountPresetPrivileges` | Describe dspm asset account preset privileges |
| `DescribeEDRRuleList` | Describe edrrule list |
| `DescribeClusterSuperNodeInfo` | Describe cluster super node info<br>Required: `NodeUniqueID` |
| `DescribeClusterContainerAppList` | Describe cluster container app list<br>Required: `ContainerId` |
| `DescribeVULList` | Describe vullist |
| `DescribeClbListenerList` | Describe clb listener list<br>Required: `AssetID` |
| `DescribeCFGRiskReportStatistics` | Describe cfgrisk report statistics |
| `DescribeDynamicAssets` | Describe dynamic assets<br>Required: `Provider`, `AssetType` |
| `DescribeVulScanPeriodic` | Describe vul scan periodic |
| `DescribeIpInvokeRecordDetail` | Describe ip invoke record detail |
| `DescribeAssetRiskList` | Describe asset risk list |
| `DescribeCosRiskEvidence` | Describe cos risk evidence<br>Required: `RelAppId`, `PolicyId`, `BucketName` |
| `DescribePolicyHitData` | Describe policy hit data<br>Required: `IndexTimestamp` |
| `DescribePortDetectList` | Describe port detect list<br>Required: `ExposureID` |
| `DescribeImageVirusWhitelistDetail` | Describe image virus whitelist detail |
| `DescribeSubUserInfo` | Describe sub user info |
| `DescribeRiskCenterAssetViewVULRiskList` | Describe risk center asset view vulrisk list |
| `DescribeImageLayerList` | Describe image layer list<br>Required: `Id` |
| `DescribeBaselineMainTaskItemList` | Describe baseline main task item list<br>Required: `MainTaskID` |
| `DescribeSandboxLLMAuditAlertList` | Describe sandbox llmaudit alert list |
| `DescribeRiskCenterPortViewPortRiskList` | Describe risk center port view port risk list |
| `DescribeCSPMPayInfo` | Describe cspmpay info |
| `DescribeDspmAccessTopologyAccounts` | Describe dspm access topology accounts |
| `DescribeClusterContainerWebServiceList` | Describe cluster container web service list<br>Required: `ContainerId` |
| `DescribeCWPMachines` | Describe cwpmachines |
| `DescribeSecurityScoreRule` | Describe security score rule |
| `DescribeRiskRuleDetail` | Describe risk rule detail<br>Required: `RiskRuleId` |
| `DescribeCosObjectScanTask` | Describe cos object scan task<br>Required: `TaskType` |
| `DescribeNICAssets` | Describe nicassets |
| `DescribeDomainAssets` | Describe domain assets |
| `DescribeLighthouseFirewallRules` | Describe lighthouse firewall rules<br>Required: `AssetID` |
| `DescribeDspmBackupSetting` | Describe dspm backup setting |
| `DescribeAssetViewVulRiskList` | Describe asset view vul risk list |
| `DescribeCWPExposePath` | Describe cwpexpose path<br>Required: `AssetID`, `AssetAppID` |
| `DescribeClusterAssetSyncTaskStatus` | Describe cluster asset sync task status<br>Required: `TaskId` |
| `DescribeCosIdentifyFileList` | Describe cos identify file list<br>Required: `BucketName` |
| `DescribeAssetFilterViews` | Describe asset filter views |
| `DescribeCosRoleAccessPermission` | Describe cos role access permission<br>Required: `RelAppId`, `RelRoleId`, `BucketName` |
| `CheckRisk` | Check risk<br>Required: `RiskDetailId` |
| `DescribeAgentConfigSetting` | Describe agent config setting |
| `DescribeNotifyAssetConfig` | Describe notify asset config |
| `DescribeDspmCkafkaTopicList` | Describe dspm ckafka topic list<br>Required: `VipType`, `RegionId`, `InstanceId`, `InstanceName` |
| `DescribeBaselinePolicyItemList` | Describe baseline policy item list<br>Required: `PolicyID` |
| `DescribeImageRegistryTimedScanTaskPreview` | Describe image registry timed scan task preview |
| `DescribeSearchBugInfo` | Describe search bug info<br>Required: `Id` |
| `DescribeClusterNodeList` | Describe cluster node list |
| `DescribeClusterInstallCommand` | Describe cluster install command<br>Required: `IsCloud` |
| `DescribeOrganizationUserInfo` | Describe organization user info |
| `DescribeSubnetAssets` | Describe subnet assets |
| `DescribeDspmIdentifyComplianceGroupList` | Describe dspm identify compliance group list |
| `DescribeAccessKeyAsset` | Describe access key asset |
| `DescribeCosAccessPermissions` | Describe cos access permissions<br>Required: `RelAppId`, `BucketName` |
| `DescribeDspmAssetIdentifyInfoList` | Describe dspm asset identify info list |
| `DescribePodContainerList` | Describe pod container list |
| `DescribeEdrAlertList` | Describe edr alert list |
| `DescribeEdrAlertMultiAttackStages` | Describe edr alert multi attack stages<br>Required: `Targets` |
| `DescribeWebhookReceiverList` | Describe webhook receiver list |
| `DescribeEdrExportJobDownloadURL` | Describe edr export job download url |
| `DescribeCSCPayInfo` | Describe cscpay info |
| `DescribeDspmLogDeliveryType` | Describe dspm log delivery type |
| `DescribeCheckConnectivityHostList` | Describe check connectivity host list |
| `DescribeCosRoleAccessPermissions` | Describe cos role access permissions<br>Required: `RelAppId`, `BucketName` |
| `DescribeNotifySettingAlert` | Describe notify setting alert |
| `DescribeVulLabelList` | Describe vul label list |
| `DescribeProcessDaemonGlobalConf` | Describe process daemon global conf |
| `DescribeMachineClearHistory` | Describe machine clear history |
| `DescribeImageExportJobList` | Describe image export job list |
| `DescribeAIAnalysisRobotInfo` | Describe aianalysis robot info |
| `DescribeAssetTagTree` | Describe asset tag tree |
| `DescribeClusterContainerProcessList` | Describe cluster container process list<br>Required: `ContainerId` |
| `DescribeEdrAlertThreatTags` | Describe edr alert threat tags<br>Required: `Targets` |
| `DescribeAssetRiskDetail` | Describe asset risk detail<br>Required: `AssetRIDs` |
| `DescribeClusterPodList` | Describe cluster pod list |
| `DescribeClusterServiceList` | Describe cluster service list |
| `DescribeImageVulList` | Describe image vul list |
| `DescribeDspmAssetAccountIdentify` | Describe dspm asset account identify |
| `DescribeCosAuditPayInfo` | Describe cos audit pay info |
| `DescribeRiskCenterCFGViewCFGRiskList` | Describe risk center cfgview cfgrisk list |
| `DescribeCosAsset` | Describe cos asset<br>Required: `Filter` |
| `DescribeRiskCenterRiskTrendAnalysis` | Describe risk center risk trend analysis |
| `DescribeCosAssetSyncTask` | Describe cos asset sync task |
| `DescribeBaselineFixRecordList` | Describe baseline fix record list |
| `DescribeDspmIdentifyCategoryList` | Describe dspm identify category list |
| `DescribeVulRiskList` | Describe vul risk list |
| `DescribeImageRegistryScanSubTaskList` | Describe image registry scan sub task list |
| `DescribeVulRiskRelateComponent` | Describe vul risk relate component<br>Required: `VulID` |
| `DescribeClusterPodAssets` | Describe cluster pod assets |
| `DescribeEdrExportJobList` | Describe edr export job list |
| `DescribeAssetDetail` | Describe asset detail<br>Required: `AssetID` |
| `DescribeEdrAlertCountForAsset` | Describe edr alert count for asset |
| `DescribeVulRiskRelateHost` | Describe vul risk relate host<br>Required: `KBID`, `VulID` |
| `DescribeBaselineAggregatedPolicyList` | Describe baseline aggregated policy list |
| `DescribeExposureAutoTagAttribute` | Describe exposure auto tag attribute |
| `DescribeCSIPLicenseBindSchedule` | Describe csiplicense bind schedule<br>Required: `TaskId` |
| `DescribeLoginWhiteCombinedList` | Describe login white combined list |
| `DescribeAIAnalysisFileDownloadURL` | Describe aianalysis file download url |
| `DescribeHostKBRiskList` | Describe host kbrisk list |
| `DescribeDspmAssetTableList` | Describe dspm asset table list<br>Required: `AssetId`, `DbName` |
| `DescribeMalwareTimingScanSetting` | Describe malware timing scan setting |
| `CheckIsUltimateVersion` | Check is ultimate version |
| `DescribeDspmAssetAccounts` | Describe dspm asset accounts |
| `DescribeCLSLogIndexV3` | Describe clslog index v3<br>Required: `Filters` |
| `DescribeNotifySetting` | Describe notify setting |
| `DescribeIaCFileReport` | Describe ia cfile report<br>Required: `AssetId` |
| `DescribeUserCSPMInfoList` | Describe user cspminfo list |
| `DescribeEdrExcludeNetworkSegments` | Describe edr exclude network segments |
| `DescribeRaspLicenseList` | Describe rasp license list |
| `DescribeSecurityRiskTrend` | Describe security risk trend |
| `DescribeKeySandboxCredential` | Describe key sandbox credential<br>Required: `CredentialId` |
| `DescribeImageVirusWhitelist` | Describe image virus whitelist |
| `DescribeCosAkAsset` | Describe cos ak asset |
| `DescribeAccessKeyUserDetail` | Describe access key user detail<br>Required: `SubUin` |
| `DescribeEdrAlertCountForContainer` | Describe edr alert count for container |
| `DescribeRiskCenterAssetViewWeakPasswordRiskList` | Describe risk center asset view weak password risk list |
| `DescribeImageRegistryAssetOverview` | Describe image registry asset overview |
| `DescribeProcessDaemonHost` | Describe process daemon host |
| `DescribeBaselineAggregatedItemList` | Describe baseline aggregated item list<br>Required: `PolicyID`, `ParentCategoryID` |
| `DescribeSandboxLLMAuditRuleList` | Describe sandbox llmaudit rule list |
| `DescribeCheckViewRisks` | Describe check view risks |
| `DescribeAIAnalysisRecommendQuestions` | Describe aianalysis recommend questions<br>Required: `SessionID` |
| `DescribeClusterContainerComponentList` | Describe cluster container component list<br>Required: `ContainerId` |
| `DescribeRiskCenterWebsiteRiskList` | Describe risk center website risk list |
| `DescribeVulHostRelateComponent` | Describe vul host relate component<br>Required: `VulID`, `InstanceID` |
| `DescribeCosAlarmTrendData` | Describe cos alarm trend data |
| `DescribeDbAssets` | Describe db assets |
| `DescribeImageRegistryConnectivityTaskResult` | Describe image registry connectivity task result |
| `DescribeVulViewVulRiskList` | Describe vul view vul risk list |
| `DescribeImageLayerVulList` | Describe image layer vul list |
| `DescribeImageVulWhitelist` | Describe image vul whitelist |
| `DescribeImageComponentList` | Describe image component list<br>Required: `Id` |
| `DescribeHighBaseLineRiskList` | Describe high base line risk list |
| `DescribeKeySandboxCredentialList` | Describe key sandbox credential list |
| `DescribeDspmAssets` | Describe dspm assets |
| `DescribeIaCFileOverview` | Describe ia cfile overview |
| `DescribeClusterContainerDetail` | Describe cluster container detail<br>Required: `ContainerId` |
| `DescribeCosRiskActionList` | Describe cos risk action list<br>Required: `RelAppId`, `PolicyId`, `BucketName` |
| `DescribeAccessKeyRiskDetail` | Describe access key risk detail<br>Required: `ID` |
| `DescribeVulItemList` | Describe vul item list |
| `DescribeClusterPodDetail` | Describe cluster pod detail<br>Required: `UniqueID` |
| `DescribeSkillScanAlertDetail` | Describe skill scan alert detail<br>Required: `ID` |
| `DescribeLoginTypeHost` | Describe login type host |
| `DescribeAssetTags` | Describe asset tags |
| `DescribeAIAgentAssetList` | Describe aiagent asset list |
| `DescribeCSIPMalwareScanTaskDetail` | Describe csipmalware scan task detail<br>Required: `TaskId` |
| `DescribeExposureAutoTagRules` | Describe exposure auto tag rules |
| `DescribeDspmIdentifyRuleList` | Describe dspm identify rule list |
| `DescribeConfigCheckRules` | Describe config check rules |
| `DescribeLoginWhiteHostList` | Describe login white host list<br>Required: `Id`, `Limit`, `Offset` (default 0) |
| `DescribeVpcAssets` | Describe vpc assets |
| `DescribeImageAssociatedContainerList` | Describe image associated container list |
| `DescribeEDRScanTaskDetail` | Describe edrscan task detail<br>Required: `TaskId` |
| `DescribeCosInvokeUa` | Describe cos invoke ua<br>Required: `RelAppId` |
| `DescribeAssetComponentList` | Describe asset component list |
| `DescribeDspmRiskStrategy` | Describe dspm risk strategy |
| `DescribeReverseShellSystemPolicyConfig` | Describe reverse shell system policy config |
| `DescribeRiskTrendData` | Describe risk trend data |
| `DescribeRiskRules` | Describe risk rules |
| `DescribeAssetSyncTaskStatus` | Describe asset sync task status<br>Required: `TaskIDs` |
| `DescribeCosRiskScanTask` | Describe cos risk scan task |
| `DescribeClusterDetail` | Describe cluster detail |
| `ExportTasks` | Export tasks<br>Required: `TaskId` |
| `DescribeExposeRiskStatistics` | Describe expose risk statistics |
| `DescribeImageAssociatedHostList` | Describe image associated host list |
| `DescribeCosAlarmList` | Describe cos alarm list |
| `DescribeDspmSupportedAssetType` | Describe dspm supported asset type |
| `DescribeUserDspmInfoList` | Describe user dspm info list |
| `DescribeAIScheduleStats` | Describe aischedule stats |
| `DescribeDspmApplyHistory` | Describe dspm apply history |
| `DescribeAILinkSetting` | Describe ailink setting |
| `ExportClientSettingHostList` | Export client setting host list<br>Required: `BusiType` |
| `DescribeDefaultSecurityScoreRule` | Describe default security score rule |
| `DescribeNetAttackSetting` | Describe net attack setting |
| `DescribeAIAnalysisHistory` | Describe aianalysis history |
| `DescribeBaselineItemRiskList` | Describe baseline item risk list<br>Required: `PolicyID`, `ParentCategoryID`, `ItemID` |
| `DescribeDspmSyncAssetsStatus` | Describe dspm sync assets status |
| `DescribeAbTestUser` | Describe ab test user<br>Required: `ProjectName`, `UserAppIds` |
| `DescribeUserCallRecord` | Describe user call record<br>Required: `SubUin` |
| `DescribeBaselinePolicyCategoryList` | Describe baseline policy category list<br>Required: `PolicyID` |
| `DescribeCWPExposures` | Describe cwpexposures<br>Required: `AssetID`, `AssetAppID` |
| `DescribeSandboxDLPAlertList` | Describe sandbox dlpalert list |
| `DescribeAlertList` | Describe alert list<br>Required: `Filter` |
| `DescribeCWPLicenseBindSchedule` | Describe cwplicense bind schedule<br>Required: `TaskId` |
| `DescribeClbListenerRules` | Describe clb listener rules<br>Required: `AssetID` |
| `DescribeEdrLogCollectPaths` | Describe edr log collect paths |
| `DescribeAIAnalysisSMTP` | Describe aianalysis smtp |
| `DescribeDspmAccessTopologyIps` | Describe dspm access topology ips |
| `DescribeAgentRunMode` | Describe agent run mode |
| `DescribeVulComponentRelateHost` | Describe vul component relate host<br>Required: `VulID`, `Name` |
| `DescribeSkillScanAlertList` | Describe skill scan alert list |
| `DescribeSandboxACLRuleList` | Describe sandbox aclrule list |
| `DescribeAccessKeyRisk` | Describe access key risk |
| `DescribeRepositoryImageAssets` | Describe repository image assets |
| `DescribeCSIPMalwareScanTaskProgress` | Describe csipmalware scan task progress |
| `DescribeCVMAssetInfo` | Describe cvmasset info<br>Required: `AssetId` |
| `DescribeImageAssetList` | Describe image asset list |
| `DescribeCFGRiskStatistics` | Describe cfgrisk statistics |
| `DescribeEDRScanRecordList` | Describe edrscan record list |
| `DescribeOtherCloudAssets` | Describe other cloud assets |
| `DescribeListenerList` | Describe listener list |
| `DescribeLoginTypeGlobalConf` | Describe login type global conf |
| `DescribeAccessKeyWhiteList` | Describe access key white list |
| `DescribeCWPMachineDetail` | Describe cwpmachine detail |
| `DescribeDspmAssetFieldList` | Describe dspm asset field list<br>Required: `AssetId`, `DbName`, `TableName` |
| `DescribeRiskCenterServerRiskList` | Describe risk center server risk list |
| `DescribeVdbAndPocInfo` | Describe vdb and poc info |
| `DescribeCallRecord` | Describe call record |
| `DescribeAssetOverview` | Describe asset overview |
| `DescribeDspmIdentifyComplianceGroupDetail` | Describe dspm identify compliance group detail |
| `DescribeExposePath` | Describe expose path |
| `DescribeGatewayAssets` | Describe gateway assets |
| `DescribeExposeRisks` | Describe expose risks |
| `DescribeAccessKeyAlarm` | Describe access key alarm |
| `DescribeComplianceRiskList` | Describe compliance risk list<br>Required: `StandardID` |
| `DescribeSkillScanResult` | Describe skill scan result<br>Required: `ContentHash` (format `sha256…`), `EngineVersion` |
| `DescribeClusterListV2` | Describe cluster list v2 |
| `DescribeImageAssetDetail` | Describe image asset detail |
| `DescribeUserInfo` | Describe user info |
| `DescribeImageAssociatedAssetCount` | Describe image associated asset count |
| `DescribePublicIpAssets` | Describe public ip assets |
| `CheckCWPExposePathPermission` | Check cwpexpose path permission |
| `DescribeAssetProcessList` | Describe asset process list |
| `DescribeAIScheduleTaskList` | Describe aischedule task list |
| `DescribeTopAttackInfo` | Describe top attack info<br>Required: `StartTime`, `EndTime`, `QueryType` |
| `DescribeClusterContainerPortList` | Describe cluster container port list<br>Required: `ContainerId` |
| `DescribeModifyMachinesLoginTypeTasks` | Describe modify machines login type tasks |
| `DescribeRegistryRegionList` | Describe registry region list |
| `DescribeUebaRule` | Describe ueba rule |
| `DescribeNatRules` | Describe nat rules<br>Required: `AssetID` |
| `DownloadDspmExportLog` | Download dspm export log |
| `DescribeSandboxDLPRuleList` | Describe sandbox dlprule list |
| `DescribeScanStatistic` | Describe scan statistic |
| `DescribeWebhookPolicyList` | Describe webhook policy list |
| `DescribeDspmStatistics` | Describe dspm statistics |
| `DescribeExportJobDownloadURL` | Describe export job download url<br>Required: `JobID` |
| `DescribeAKAnalysisDetail` | Describe akanalysis detail<br>Required: `ID` |
| `DescribeCosIpInvokeLog` | Describe cos ip invoke log<br>Required: `RelAppId` |
| `DescribeDspmBackupLogList` | Describe dspm backup log list<br>Required: `Limit`, `Offset` |
| `DescribeKBUpdatableMachineList` | Describe kbupdatable machine list<br>Required: `KBIds` |
| `DescribeImageSensitiveWhitelist` | Describe image sensitive whitelist |
| `DescribeIaCFileList` | Describe ia cfile list |
| `DescribeCosActionList` | Describe cos action list |
| `DescribeBaselineUserOtherConf` | Describe baseline user other conf |
| `DescribeClusterAssetList` | Describe cluster asset list |
| `DescribeVulFixableMachineList` | Describe vul fixable machine list<br>Required: `VulIds` |
| `DescribeTaskLogList` | Describe task log list |
| `DescribeImageRegistryScanTaskList` | Describe image registry scan task list |
| `DescribeDspmAuditFilterStrategy` | Describe dspm audit filter strategy |
| `DescribeDspmIdentifyRuleTestResult` | Describe dspm identify rule test result<br>Required: `RuleType` |
| `DescribeComplianceStatistics` | Describe compliance statistics |
| `DescribeAssetTree` | Describe asset tree |
| `DescribeSourceIPAsset` | Describe source ipasset |
| `DescribeSandboxFileRuleList` | Describe sandbox file rule list |
| `DescribeHostVulRiskList` | Describe host vul risk list |
| `DescribePreventUninstallGlobalConf` | Describe prevent uninstall global conf |
| `DescribeSandboxACLAlertList` | Describe sandbox aclalert list |
| `DescribeCosBucketBillingInfo` | Describe cos bucket billing info |
| `DescribeTaskLogURL` | Describe task log url<br>Required: `Type` |
| `DescribeCWPTaskDuration` | Describe cwptask duration<br>Required: `UuidCnt` |
| `DescribeClbTargets` | Describe clb targets<br>Required: `AssetID`, `TargetType` |
| `DescribeDspmIdentifyInfoList` | Describe dspm identify info list |
| `ExportCSIPMalwareScanTaskDetail` | Export csipmalware scan task detail<br>Required: `TaskId` |
| `DescribeDspmLogTypeConfigList` | Describe dspm log type config list |
| `DescribeDspmAssetIds` | Describe dspm asset ids |
| `DescribeExportJobManageList` | Describe export job manage list |
| `DescribeCosAuditDictionaryList` | Describe cos audit dictionary list<br>Required: `DictType` |
| `DescribeRiskBucketList` | Describe risk bucket list<br>Required: `RelAppId`, `PolicyId` |
| `DescribeDspmRiskDetail` | Describe dspm risk detail |
| `DescribeDspmSessionList` | Describe dspm session list |
| `DescribeSCFFunctionVersionList` | Describe scffunction version list<br>Required: `SCFRegion`, `Namespace`, `FunctionName`, `Limit` (default 20) |
| `DescribeRiskCallRecord` | Describe risk call record<br>Required: `RiskID` |
| `DescribeClusterNamespaceList` | Describe cluster namespace list |
| `DescribeBaselinePolicyList` | Describe baseline policy list<br>Required: `PolicyType` |
| `DescribeCustomRiskRules` | Describe custom risk rules |
| `DescribeScanReportList` | Describe scan report list |
| `DescribeDspmIdentifyRuleDetail` | Describe dspm identify rule detail<br>Required: `Id` |
| `DescribeDspmApplyOrderList` | Describe dspm apply order list |
| `DescribeDspmIdentifyComplianceCategoryRuleList` | Describe dspm identify compliance category rule list<br>Required: `ComplianceId`, `CategoryId` |
| `DescribeScanTaskRecordList` | Describe scan task record list |
| `DescribeScfCustomDomainEndpoints` | Describe scf custom domain endpoints<br>Required: `AssetID` |
| `DescribeCosOverview` | Describe cos overview |
| `DescribeAccessKeyAlarmDetail` | Describe access key alarm detail<br>Required: `ID` |
| `DescribeSkillScanPayInfo` | Describe skill scan pay info |
| `DescribeAbnormalCallRecord` | Describe abnormal call record<br>Required: `AlarmRuleID` |
| `DescribeCosAkInvokeIpList` | Describe cos ak invoke ip list<br>Required: `RelAppId`, `Ak` |
| `DescribeBackendScanEngineRegionList` | Describe backend scan engine region list |
| `DescribeDspmLogList` | Describe dspm log list |
| `DescribeImageVirusList` | Describe image virus list |
| `DescribeDspmDictionaryList` | Describe dspm dictionary list<br>Required: `DictType` |
| `DescribeCVMAssets` | Describe cvmassets |
| `DescribeMachineLoginType` | Describe machine login type |
| `DescribeCosIpInvokeRecordFile` | Describe cos ip invoke record file<br>Required: `RelAppId` |
| `DescribeBucketInvokeIpList` | Describe bucket invoke ip list<br>Required: `RelAppId`, `BucketName` |
| `DescribeDspmIdentifyIdList` | Describe dspm identify id list |
| `DescribeBaselineUserWeakPasswordConf` | Describe baseline user weak password conf |
| `DescribeComplianceOverview` | Describe compliance overview |
| `DescribeMachineGeneral` | Describe machine general |
| `DescribeUebaBehaviorSummary` | Describe ueba behavior summary |
| `DescribeNFSScanHost` | Describe nfsscan host |
| `DescribeDspmCkafkaRouteList` | Describe dspm ckafka route list<br>Required: `VipType`, `RegionId`, `InstanceId` |
| `DescribeVulIgnoreRuleList` | Describe vul ignore rule list |
| `DescribeUebaUserSummary` | Describe ueba user summary |
| `DescribeLastScanTaskInfo` | Describe last scan task info |
| `DescribeCosAuditAppIdList` | Describe cos audit app id list |
| `DescribeBaselineCalculatingStatisticsPolicyIDList` | Describe baseline calculating statistics policy idlist |
| `DescribeBaselineMainTaskList` | Describe baseline main task list |
| `DescribeNotifySettingAk` | Describe notify setting ak |
| `DescribeTaskPredictCostQuota` | Describe task predict cost quota |
| `DescribeRiskScanCronConfig` | Describe risk scan cron config |
| `DescribeLicenseStatus` | Describe license status |
| `DescribeAssetComponentRelatedImageList` | Describe asset component related image list |
| `DescribeVulFixedList` | Describe vul fixed list |
| `DescribeAssetTagAttributes` | Describe asset tag attributes |
| `DescribeCosPolicy` | Describe cos policy |
| `DescribeBaselineSyncConf` | Describe baseline sync conf |
| `DescribeOrganizationInfo` | Describe organization info |
| `DescribeClusterSummary` | Describe cluster summary |
| `DescribeDspmRisk` | Describe dspm risk |
| `DescribeCFWAssetStatistics` | Describe cfwasset statistics |
| `DescribeBanStatus` | Describe ban status |
| `DescribeRiskCenterVULViewVULRiskList` | Describe risk center vulview vulrisk list |
| `DescribeCWPOrderList` | Describe cwporder list |
| `DescribeTagRuleAssets` | Describe tag rule assets |
| `DescribeExposeAssetCategory` | Describe expose asset category |
| `DescribeIaCTokenList` | Describe ia ctoken list |
| `DescribeVULRiskAdvanceCFGList` | Describe vulrisk advance cfglist |
| `DescribeAISchedulePlanList` | Describe aischedule plan list |
| `DescribeAssumeRole` | Describe assume role |
| `DescribeCosBucketList` | Describe cos bucket list |
| `DescribeCWPMachineOsList` | Describe cwpmachine os list |
| `DescribeKBDetail` | Describe kbdetail<br>Required: `KBID` |
| `DescribeBaselineSystemCategoryList` | Describe baseline system category list |
| `DescribePreventUninstallHost` | Describe prevent uninstall host |
| `DescribeDspmAccessRecord` | Describe dspm access record |
| `DescribeSandboxACLSystemRuleList` | Describe sandbox aclsystem rule list |
| `DescribeVulScanTaskList` | Describe vul scan task list |
| `ExportEDRRules` | Export edrrules |
| `DescribeSandboxLLMAuditSystemRuleList` | Describe sandbox llmaudit system rule list |
| `DescribeDspmSyncUsersStatus` | Describe dspm sync users status |
| `DescribeDspmIdentifyInfo` | Describe dspm identify info |
| `CheckImageRegistryInstanceNameDuplicate` | Check image registry instance name duplicate |
| `DescribeSCFAliasList` | Describe scfalias list<br>Required: `SCFRegion`, `Namespace`, `FunctionName`, `Limit` (default 20) |
| `DescribeDspmAssetSupportedPrivileges` | Describe dspm asset supported privileges<br>Required: `AssetId` |
| `DescribeDspmApproveOrderList` | Describe dspm approve order list |
| `DescribeSandboxDLPSystemRuleList` | Describe sandbox dlpsystem rule list |
| `DescribeRiskCenterAssetViewCFGRiskList` | Describe risk center asset view cfgrisk list |
| `DescribeIpInvokeRecord` | Describe ip invoke record |
| `DescribeCloudFunctionList` | Describe cloud function list |
| `DescribeHostVulItemVPRInfo` | Describe host vul item vprinfo |
| `DescribeBaselineCategoryItemList` | Describe baseline category item list |
| `DescribeSCFFunctionList` | Describe scffunction list<br>Required: `SCFRegion`, `Namespace`, `Limit` (default 20) |
| `DescribeAssetInfo` | Describe asset info<br>Required: `AssetID` |
| `DescribeImageVulSummaryList` | Describe image vul summary list |
| `DescribeDspmPersonalIdentifyList` | Describe dspm personal identify list |
| `DescribeAIAgentCredentialLocationList` | Describe aiagent credential location list<br>Required: `ID` |
| `DescribeAIScheduleTaskDetail` | Describe aischedule task detail |
| `DescribeDspmAssetAccountRecycledPrivileges` | Describe dspm asset account recycled privileges |
| `DescribeCSIPRiskStatistics` | Describe csiprisk statistics |
| `DescribeMandatoryVulSet` | Describe mandatory vul set |
| `DescribeDspmAssetAccessTopology` | Describe dspm asset access topology |
| `DescribeVulFixTaskDetail` | Describe vul fix task detail<br>Required: `TaskId` |
## Mutations (gated — need allowlist, 140)

| Action | What it does |
|---|---|
| `CreateEdrAlertExportJob` | Create edr alert export job |
| `CreateCosRiskScanTask` | Create cos risk scan task |
| `BatchModifyImageVirusWhitelist` | Run batch modify image virus whitelist<br>Required: `RuleId` |
| `CreateCosObjectScanTask` | Create cos object scan task<br>Required: `TaskType` |
| `CreateCloudFunctionExportJob` | Create cloud function export job |
| `CreateClusterNodeListExportJob` | Create cluster node list export job<br>Required: `ClusterCaMD5` |
| `CreateVulRisksExportJob` | Create vul risks export job<br>Required: `CloudAccountID` |
| `StartOrModifyPreventUninstall` | Start or modify prevent uninstall<br>Required: `From`, `Scope` |
| `CreateDspmIdentifyComplianceGroup` | Create dspm identify compliance group<br>Required: `Name` |
| `CreateCosPolicy` | Create cos policy<br>Required: `CosPolicyInfo` |
| `CreateClusterContainerListExportJob` | Create cluster container list export job |
| `CreateVulFixedExportJob` | Create vul fixed export job |
| `SyncImageRegistry` | Sync image registry |
| `SyncDspmAssets` | Sync dspm assets |
| `BatchModifyImageSensitiveWhitelist` | Run batch modify image sensitive whitelist<br>Required: `RuleId` |
| `CreateDspmAccessExportJob` | Create dspm access export job |
| `UpdateAccessKeyRemark` | Update access key remark<br>Required: `Remark` |
| `CreateExposuresExportJob` | Create exposures export job |
| `BatchModifyImageVulWhitelist` | Run batch modify image vul whitelist<br>Required: `RuleId` |
| `AddDspmAssetManager` | Add dspm asset manager<br>Required: `IdentifyIds`, `AssetId` |
| `CreateScanStatisticExportJob` | Create scan statistic export job |
| `AddImageRegistry` | Add image registry<br>Required: `Name` |
| `CreateSandboxFileRule` | Create sandbox file rule |
| `UpdateAccessKeyAlarmStatus` | Update access key alarm status<br>Required: `Status` |
| `EnableAISchedule` | Enable aischedule |
| `UninstallKeySandboxSkill` | Uninstall key sandbox skill<br>Required: `InstanceIdList` |
| `CreateClusterNamespaceListExportJob` | Create cluster namespace list export job<br>Required: `ClusterCaMD5` |
| `CreateSandboxACLRule` | Create sandbox aclrule<br>Required: `RuleName`, `Level`, `BelongAssetType`, `EffectScope`, `Status`, `RuleAction` |
| `CreateDspmWhitelistStrategy` | Create dspm whitelist strategy |
| `CreateRiskDetailExportJob` | Create risk detail export job<br>Required: `RiskRuleId` |
| `AccessAIAnalysisSMTP` | Run access aianalysis smtp |
| `CreateDspmPersonalIdentify` | Create dspm personal identify<br>Required: `Phone`, `Name` |
| `CreateAssetSyncTask` | Create asset sync task |
| `CreateImageAssetListExportJob` | Create image asset list export job |
| `CreateAssetProcessExportJob` | Create asset process export job |
| `AddVulWhitelist` | Add vul whitelist |
| `CreateClusterAssetSyncTask` | Create cluster asset sync task |
| `BindClusterOwner` | Bind cluster owner<br>Required: `ClusterAssetIds` |
| `CreateDspmResource` | Create dspm resource |
| `CreateAssetComponentRelatedImageListExportJob` | Create asset component related image list export job |
| `CreateDspmIdentifyLevelGroup` | Create dspm identify level group<br>Required: `Name` |
| `CreateEDRManualScan` | Create edrmanual scan<br>Required: `AssetSelectionType`, `ScanType` |
| `CreateAccessKeyCheckTask` | Create access key check task |
| `CreateImageVulListExportJob` | Create image vul list export job |
| `CreateBaselineAggregatedItemExportJob` | Create baseline aggregated item export job<br>Required: `PolicyID`, `ParentCategoryID` |
| `CreateDspmAssetsExportJob` | Create dspm assets export job |
| `CreateDspmIdentifyComplianceGroupCopy` | Create dspm identify compliance group copy<br>Required: `FromId` |
| `CreateImageRegistryListExportJob` | Create image registry list export job |
| `AddNewBindRoleUser` | Add new bind role user |
| `CreatePodServiceListExportJob` | Create pod service list export job |
| `CreateExposureAutoTagRule` | Create exposure auto tag rule |
| `RetryDspmExportLog` | Retry dspm export log |
| `CreateSkillScan` | Create skill scan<br>Required: `FileBase64` |
| `CreateDspmIdentifyInfoListExportJob` | Create dspm identify info list export job |
| `CreateCSIPManualMalwareScan` | Create csipmanual malware scan<br>Required: `ScanPattern`, `Scope` (default 0) |
| `InstallSandboxPlugin` | Install sandbox plugin<br>Required: `BelongAssetType`, `EffectScope` |
| `CreateAssetTag` | Create asset tag<br>Required: `Key`, `Value` |
| `CreateHostVulExportJob` | Create host vul export job<br>Required: `BusinessAction` |
| `InstallClusterAgent` | Install cluster agent<br>Required: `ClusterCaMD5List` |
| `CreateHostImageListExportJob` | Create host image list export job<br>Required: `ClusterCaMD5` |
| `CreateEdrLessAlertExportJob` | Create edr less alert export job |
| `CreatePodContainerListExportJob` | Create pod container list export job |
| `StartOrModifyProcessDaemon` | Start or modify process daemon<br>Required: `From`, `Scope` |
| `CreateDspmIdentifyComplianceRuleRelation` | Create dspm identify compliance rule relation<br>Required: `ComplianceId`, `CategoryId`, `Rules` |
| `InstallKeySandboxSkill` | Install key sandbox skill<br>Required: `InstanceIdList` |
| `CreateAssetViewRisksExportJob` | Create asset view risks export job |
| `CreateDspmIdentifyRule` | Create dspm identify rule<br>Required: `Name` |
| `ScanCSIPTaskAgain` | Scan csiptask again<br>Required: `TaskId` |
| `CreateClusterListExportJob` | Create cluster list export job |
| `CreateImageLayerVulListExportJob` | Create image layer vul list export job |
| `CreateDomainAndIp` | Create domain and ip<br>Required: `Content` |
| `UpdateAlertStatusList` | Update alert status list<br>Required: `ID`, `OperateType` |
| `CreateIaCAccessToken` | Create ia caccess token<br>Required: `Name`, `Period` |
| `OperateRiskRulePolicy` | Run operate risk rule policy<br>Required: `OperateType` |
| `CreateVulFixTask` | Create vul fix task<br>Required: `FixItems` |
| `AddLoginWhiteLists` | Add login white lists<br>Required: `HostLoginWhiteObj` |
| `CreateSandboxLLMAuditRule` | Create sandbox llmaudit rule<br>Required: `RuleName`, `Level`, `BelongAssetType`, `SystemRuleIDList`, `EffectScope`, `Status`, `RuleAction` |
| `CreateDspmRiskStrategy` | Create dspm risk strategy<br>Required: `Name`, `Rule` |
| `OperateRisk` | Run operate risk<br>Required: `RiskRuleId`, `RiskIdList`, `OperationType` |
| `CreateBaselineMainTaskExportJob` | Create baseline main task export job |
| `ScanEDRTaskAgain` | Scan edrtask again<br>Required: `TaskId` |
| `CopyBaselinePolicy` | Copy baseline policy<br>Required: `PolicyID`, `TargetAppIDList` |
| `ScanBaselineRiskList` | Scan baseline risk list<br>Required: `PolicyType`, `PolicyID`, `ParentCategoryID`, `RiskIDList`, `ItemID` |
| `CreateCheckViewRisksExportJob` | Create check view risks export job |
| `CreateImageAssociatedHostListExportJob` | Create image associated host list export job |
| `CreateSandboxDLPRule` | Create sandbox dlprule<br>Required: `RuleName`, `Level`, `RuleAction`, `BelongAssetType`, `EffectScope`, `Status` |
| `CreateVulReScan` | Create vul re scan |
| `CreateCFGRiskPDFReportExportJob` | Create cfgrisk pdfreport export job<br>Required: `StandardID` |
| `CreateScanTask` | Create scan task |
| `TestWebhookReceiver` | Test webhook receiver<br>Required: `ID` |
| `CreateImageVirusListExportJob` | Create image virus list export job |
| `SendDspmAssetLoginSmsCode` | Send dspm asset login sms code<br>Required: `PersonId`, `AssetId` |
| `CreatePublicAssetsExportJob` | Create public assets export job |
| `UpdateClusterOwner` | Update cluster owner<br>Required: `ClusterCaMD5List` |
| `CreateImageAssociatedContainerListExportJob` | Create image associated container list export job |
| `CreateDspmExportTask` | Create dspm export task |
| `DisableAISchedule` | Disable aischedule |
| `CreateRiskCenterScanTask` | Create risk center scan task<br>Required: `TaskName`, `ScanAssetType`, `ScanItem`, `ScanPlanType` |
| `CreateBaselineFixRecordExportJob` | Create baseline fix record export job |
| `CreateCFGRisksExportJob` | Create cfgrisks export job |
| `CreateImageRegistryTimedScanTaskConfig` | Create image registry timed scan task config |
| `CreateImageComponentListExportJob` | Create image component list export job<br>Required: `Id` |
| `CreateImageVulWhitelist` | Create image vul whitelist |
| `CreateAllAssetsExportJob` | Create all assets export job |
| `SendDspmCkafkaTest` | Send dspm ckafka test<br>Required: `VipType`, `InstanceId` |
| `CreateDspmAssetAccessTopologyExportJob` | Create dspm asset access topology export job |
| `CreateAssetFilterView` | Create asset filter view<br>Required: `ViewName` |
| `CreateHighBaseLineRisksExportJob` | Create high base line risks export job<br>Required: `CloudAccountID` |
| `CreateVulScanManual` | Create vul scan manual<br>Required: `Timeout`, `AssetRange` |
| `CreateIaCFileExportJob` | Create ia cfile export job |
| `CreateDspmAssetIdentifyInfoExportJob` | Create dspm asset identify info export job<br>Required: `AssetId` |
| `ScanBaselinePolicyList` | Scan baseline policy list<br>Required: `PolicyType`, `PolicyIDList` |
| `CreateCosAssetSyncTask` | Create cos asset sync task |
| `CreateImageSensitiveInfoListExportJob` | Create image sensitive info list export job |
| `CreateAccessKeySyncTask` | Create access key sync task |
| `CreateImageVirusWhitelist` | Create image virus whitelist |
| `CreateIaCFileReScanTask` | Create ia cfile re scan task<br>Required: `Id` |
| `CreateImageRegistryConnectivityTask` | Create image registry connectivity task |
| `CreateAssetComponentListExportJob` | Create asset component list export job |
| `CreateAISchedule` | Create aischedule |
| `CreateDspmIdentifyComplianceCategoryRelation` | Create dspm identify compliance category relation<br>Required: `ComplianceId`, `CategoryId`, `ParentCategoryId` |
| `SyncDspmUsers` | Sync dspm users |
| `CreateImageRegistryScanTask` | Create image registry scan task |
| `CreateDspmApplyOrder` | Create dspm apply order<br>Required: `AssetId`, `ApplyType` |
| `UninstallClusterAgent` | Uninstall cluster agent<br>Required: `ClusterCaMD5List` |
| `CreateDspmApproveHistoryExportJob` | Create dspm approve history export job |
| `CreateDspmIdentifyCategory` | Create dspm identify category<br>Required: `Name` |
| `CreateImageSensitiveWhitelist` | Create image sensitive whitelist |
| `CreateVulFixRetryTask` | Create vul fix retry task<br>Required: `TaskId` |
| `ScanBaselineAssetItemList` | Scan baseline asset item list<br>Required: `PolicyType`, `PolicyID`, `ParentCategoryID`, `ItemIDList`, `AssetID` |
| `CreateComplianceRiskExportJob` | Create compliance risk export job<br>Required: `StandardID` |
| `CreateDspmRiskExportJob` | Create dspm risk export job |
| `RevertDspmAssetAccount` | Run revert dspm asset account<br>Required: `AssetId`, `Account` |
| `CreateDynamicAssetsExportJob` | Create dynamic assets export job<br>Required: `Provider`, `AssetType` |
| `CreateImageVulSummaryListExportJob` | Create image vul summary list export job |
| `ScanBaselineItemList` | Scan baseline item list<br>Required: `PolicyType`, `PolicyID`, `ParentCategoryID`, `ItemIDList` |
| `VerifyDspmAssetLoginCode` | Verify dspm asset login code<br>Required: `PersonId`, `AssetId`, `Code` |
| `BatchModifyBaselinePolicy` | Run batch modify baseline policy<br>Required: `PolicyIDList`, `CycleScanConf` |
| `CreateDspmAuditFilterStrategy` | Create dspm audit filter strategy<br>Required: `Name`, `Rule` (format `json…`), `IsEnabled` |
| `BatchModifyImageRegistryTimedScanTaskConfig` | Run batch modify image registry timed scan task config |

## Blocked destructive actions (180)

`ModifyShareUserCSPM`, `ModifySandboxLLMAuditRule`, `ModifyNFSScanHost`, `ModifyCSIPLicenseUnBinds`, `StopVulScanTask`, `DeleteEdrLogCollectPaths`, `DeleteWebhookPolicies`, `ModifyDspmIdentifyRule`, `ModifyMachinesLoginType`, `ModifyDspmAssetAccountPrivileges`, `ModifyWebhookPolicyStatus`, `ModifySecurityScoreRule`, `ModifyEdrExcludeNetworkSegments`, `DeleteImageVirusWhitelist`, `ModifyAlarmRiskStatus`, `ModifyWebhookPolicy`, `ModifyLoginWhiteRecord`, `DeleteDspmIdentifyRule`, `ModifyReverseShellSystemPolicyConfig`, `ModifyNotifySettingAk`, `ModifyImageVirusWhitelist`, `DeleteLoginWhiteList`, `ModifyEDRRuleStatus`, `ModifyBaselineSyncConf`, `ModifySandboxAlertStatus`, `ModifyDspmAssetDataScanTaskStatus`, `DeleteImageVulWhitelist`, `ModifyAssetCoreAttribute`, `ModifyProtectionSetting`, `StopImageRegistryScanTask`, `ModifySkillScanAlertStatus`, `ModifyCosMarkInfo`, `ModifyAssetFilterView`, `ModifyDspmWhitelistStrategy`, `ModifyDspmIdentifyLevelGroup`, `ModifyRiskCenterRiskStatus`, `ModifyNetAttackSetting`, `ModifyDspmAssetLogDeliverySwitch`, `ModifyDspmIdentifyLevelItem`, `DeleteImageRegistryTimedScanTaskConfig`, `ModifyNotifySetting`, `ModifyDspmCkafkaSave`, `ModifyCspmShardConfig`, `ModifyRiskScanCronConfig`, `DeleteDspmAuditFilterStrategy`, `ModifyAISchedule`, `DeleteDomainAndIp`, `ModifyNotifyAssetConfig`, `DeleteAISchedule`, `StopProcessDaemon`, `DeleteDspmIdentifyComplianceGroup`, `ModifyEdrAlertStatus`, `ModifyAgentRunMode`, `ModifyNFSScanConf`, `ModifyBaselinePolicyEnable`, `ModifyNotifySettingAlert`, `DeleteImageSensitiveWhitelist`, `ModifyDspmAssetSecurityAnalysisSwitch`, `ModifyClusterDefendStatus`, `ModifyVulWhitelistSwitch`, `ModifyDspmRiskInfo`, `ModifyDspmIdentifyComplianceGroup`, `ModifyVulWhitelistConfig`, `CancelEdrAlertIgnore`, `DeleteCosAkAsset`, `DeleteMachineClearHistory`, `StopBaselineScanTask`, `ModifyBaselinePolicy`, `ModifyDspmRiskStrategy`, `DeleteDspmIdentifyComplianceRuleRelation`, `DeleteDspmWhitelistStrategy`, `DeleteDspmExportTask`, `ModifyEDRRulesAction`, `ModifyImageRegistryTimedScanTaskConfig`, `DeleteWebhookReceivers`, `DeleteDspmIdentifyCategory`, `ModifyPolicyStatus`, `DeleteDspmPersonalIdentify`, `ModifyImageVulWhitelist`, `ModifyOrganizationAccountStatus`, `ModifyDspmLogDeliveryType`, `DeleteDspmShareUserData`, `ModifyDspmAssetDataScanTask`, `ModifyDspmIdentifyCategory`, `ModifyMachineAutoClearConfig`, `DeleteSandboxDLPRule`, `ModifyEDRRule`, `DeleteVulWhitelist`, `ModifyImageSensitiveWhitelist`, `ModifyAssetTag`, `ModifyAILinkSetting`, `DeleteDspmApplyOrder`, `DeleteDspmAssetAccount`, `DeleteDspmIdentifyLevelGroup`, `ModifyBaselineUserWeakPasswordConf`, `ModifyAgentConfigSetting`, `ModifyEdrAlertIsolation`, `ModifyDspmCkafkaStop`, `ModifyEdrLogCollectPath`, `ModifyExposureAutoTagRule`, `ModifyCSIPRaspLicenseUnBinds`, `DeleteSandboxACLRule`, `ModifyImageRegistry`, `ModifyDspmAssetAccount`, `ModifyShareUserAK`, `ModifyCosAuditObjectSampleRate`, `ModifyDspmIdentifyComplianceRuleLevelInfo`, `ModifyBanMode`, `ModifyDspmIdentifyRuleStatus`, `DeleteDspmBackupLogList`, `ModifySandboxACLRuleStatus`, `DeleteAssetFilterView`, `DeleteDspmIdentifyComplianceCategoryRelation`, `DeleteEDRScanTask`, `ModifySandboxDLPRuleStatus`, `ModifyCosAuditObjectIdentifyStatus`, `ModifyAssetTags`, `ModifyCosAuditMonitorAccount`, `ModifyDspmPersonalIdentify`, `ModifyPayConfig`, `ModifyMachineRemark`, `ModifyShareUserDspm`, `DeleteRiskScanTask`, `ModifyRiskCenterScanTask`, `ModifyNotifyAgentOfflineDuration`, `DeleteExposureAutoTagRule`, `ModifyBaselineUserOtherConf`, `ModifyDspmAuditFilterStrategy`, `ModifyMalwareTimingScanSettings`, `ModifyDspmRestoreLogTask`, `DeleteIaCFile`, `ModifyDspmAccessRecord`, `ModifyExposureTag`, `DeleteCSIPMalwareScanTask`, `ModifySandboxLLMAuditRuleStatus`, `ModifyWebhookReceiver`, `DeleteCluster`, `StopRiskCenterTask`, `ModifyExposureAutoTagRuleStatus`, `ModifyDspmApplyingIdentifyComplianceGroup`, `StopCSIPManualMalwareScan`, `StopEDRScanTask`, `ModifyNotifyMember`, `ModifyUebaRuleSwitch`, `DeleteImageRegistry`, `ModifyDspmIdentifyComplianceGroupStatus`, `DeleteSandboxFileRule`, `ModifyRaspLicenseBinds`, `StopPreventUninstall`, `DeleteAIAnalysisSMTPAccess`, `ModifySandboxFileRule`, `ModifyCSIPRaspLicenseBinds`, `ModifyDspmBackupSetting`, `DeleteBaselineSelfDefinedPolicyList`, `ModifySandboxACLRule`, `DeleteCosPolicy`, `ModifyCSIPLicenseBinds`, `ModifyDspmCkafkaStart`, `ModifyBruteAttackBanStatus`, `DeleteIaCAccessToken`, `ModifySandboxFileRuleStatus`, `DeleteEDRRules`, `DeleteDspmRestoreLogList`, `ModifyVulScanPeriodic`, `ModifyDspmIpInfo`, `DeleteDspmCkafkaConfig`, `DeleteSandboxLLMAuditRule`, `DeleteAssetTag`, `DeleteDspmRiskStrategy`, `ModifyBruteAttackRules`, `ResetDspmAssetAccountPassword`, `DeleteImageRegistryScanTask`, `ModifyAssetTagsByAssetInfo`, `ModifySandboxDLPRule`, `ModifyDspmApproveStatus`, `ModifyIaCTokenPeriod`, `ModifyDspmIdentifyInfo`, `ModifyCosAuditBucketMonitorStatus`, `ModifyAgentRunPolicy`, `ModifyEdrAlertPermanentIgnore` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `csip`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20221121` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="csip"`) for the allow/block decision and reason.

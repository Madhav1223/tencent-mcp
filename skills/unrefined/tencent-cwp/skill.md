---
name: tencent-cwp
description: Tencent Cloud CWP via the Tencent MCP server — 533 actions in API version v20180228 (378 read-only auto-allowed). Use for asset, baseline, machine, events, white, event. Triggers on mentions of cwp, asset, baseline, machine, events, white, event, host, scan. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud CWP

Security & identity: 533 actions in API version `v20180228` — 378 read-only (auto-allowed), 52 gated mutations, 103 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cwp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cwp/v20180228 — action signatures in `cwp_client.ts`, full request/response shapes in `cwp_models.ts`.

## Read actions (auto-allowed, 378)

| Action | What it does |
|---|---|
| `DescribeAttackType` | Describe attack type<br>Required: `Filters` |
| `DescribeAssetPortInfoList` | Describe asset port info list |
| `DescribeAESKey` | Describe aeskey |
| `DescribeRansomDefenseStrategyList` | Describe ransom defense strategy list<br>Required: `Limit`, `Offset` |
| `ExportAssetJarList` | Export asset jar list |
| `DescribeBanMode` | Describe ban mode |
| `ExportJavaMemShellPlugins` | Export java mem shell plugins |
| `CheckBashRuleParams` | Check bash rule params<br>Required: `CheckField` |
| `DescribeScanTaskDetails` | Describe scan task details<br>Required: `ModuleType`, `TaskId` |
| `DescribeServerRelatedDirInfo` | Describe server related dir info<br>Required: `Id` |
| `ExportVulDefenceList` | Export vul defence list |
| `DescribeScanSchedule` | Describe scan schedule<br>Required: `TaskId` |
| `DescribeHostInfo` | Describe host info |
| `DescribeImportMachineInfo` | Describe import machine info<br>Required: `MachineList` (default ID), `ImportType` |
| `DescribeBaselineRuleList` | Describe baseline rule list |
| `DescribeScreenRiskAssetsTop` | Describe screen risk assets top<br>Required: `BusinessType` |
| `DescribeAssetAppCount` | Describe asset app count |
| `DescribeBaselineHostTop` | Describe baseline host top<br>Required: `Top`, `StrategyId` |
| `DescribeJavaMemShellList` | Describe java mem shell list |
| `DescribeBaselineDetectList` | Describe baseline detect list |
| `DescribeScreenAttackHotspot` | Describe screen attack hotspot |
| `DescribeReverseShellRules` | Describe reverse shell rules |
| `DescribeVulDefenceOverview` | Describe vul defence overview |
| `DescribeAssetUserCount` | Describe asset user count |
| `ExportAssetMachineDetail` | Export asset machine detail<br>Required: `Quuid`, `Uuid` |
| `DescribeAssetWebLocationCount` | Describe asset web location count |
| `DescribeAssetWebLocationPathList` | Describe asset web location path list<br>Required: `Quuid`, `Uuid`, `Id`, `Limit` (default 10), `Offset` (default 0) |
| `DescribeScreenHostInvasion` | Describe screen host invasion<br>Required: `Quuid` |
| `DescribeFileTamperEventRuleInfo` | Describe file tamper event rule info<br>Required: `Id` |
| `DescribeLogIndex` | Describe log index |
| `DescribeMemShellRules` | Describe mem shell rules |
| `DescribeScreenGeneralStat` | Describe screen general stat |
| `DescribeBashEventsInfoNew` | Describe bash events info new<br>Required: `Id` |
| `DescribeAssetWebServiceProcessList` | Describe asset web service process list<br>Required: `Quuid`, `Uuid`, `Id` |
| `ExportMaliciousRequests` | Export malicious requests |
| `DescribeAssetLoadInfo` | Describe asset load info |
| `DescribeBaselineRuleDetectList` | Describe baseline rule detect list |
| `DescribeOverviewStatistics` | Describe overview statistics |
| `ExportBaselineItemDetectList` | Export baseline item detect list |
| `DescribeSkillInfo` | Describe skill info<br>Required: `Ids` |
| `DescribeBaselineScanSchedule` | Describe baseline scan schedule<br>Required: `TaskId` |
| `DescribeNetAttackSetting` | Describe net attack setting |
| `ExportAssetWebFrameList` | Export asset web frame list |
| `CheckFileTamperRule` | Check file tamper rule |
| `DescribeNetAttackWhiteList` | Describe net attack white list |
| `DescribePatchEffectHostList` | Describe patch effect host list<br>Required: `KbId`, `Limit`, `Offset` |
| `DescribeExportMachines` | Describe export machines<br>Required: `MachineType`, `MachineRegion` |
| `DescribeAssetWebFrameCount` | Describe asset web frame count |
| `DescribeLicense` | Describe license |
| `ExportBashPolicies` | Export bash policies |
| `DescribeMachineLicenseDetail` | Describe machine license detail<br>Required: `Quuids` |
| `DescribeWindowsPatchList` | Describe windows patch list |
| `DescribeAssetUserList` | Describe asset user list |
| `DescribeAssetWebLocationInfo` | Describe asset web location info<br>Required: `Quuid`, `Uuid`, `Id` |
| `DescribeJavaMemShellPluginInfo` | Describe java mem shell plugin info<br>Required: `Quuid` |
| `DescribeBruteAttackList` | Describe brute attack list |
| `DescribeAssetDatabaseList` | Describe asset database list |
| `DescribeVulEffectHostList` | Describe vul effect host list<br>Required: `Limit`, `Offset`, `VulId` |
| `CheckFirstScanBaseline` | Check first scan baseline |
| `DescribeSearchTemplates` | Describe search templates |
| `ExportAssetWebServiceInfoList` | Export asset web service info list |
| `DescribeLogExports` | Describe log exports<br>Required: `Offset` (default 0) |
| `DescribeScreenMachines` | Describe screen machines |
| `DescribeScreenProtectionStat` | Describe screen protection stat |
| `DescribeBashEventsNew` | Describe bash events new |
| `DescribeAssetMachineList` | Describe asset machine list |
| `DescribeAssetHostTotalCount` | Describe asset host total count<br>Required: `Uuid`, `Quuid` |
| `DescribeSecurityEventStat` | Describe security event stat |
| `DescribeRiskDnsEventInfo` | Describe risk dns event info<br>Required: `Id` |
| `ExportBashEventsNew` | Export bash events new |
| `DescribeRiskBatchStatus` | Describe risk batch status<br>Required: `RiskType` |
| `DescribeAssetProcessInfoList` | Describe asset process info list |
| `DescribeWebHookReceiver` | Describe web hook receiver |
| `DescribeCanFixVulMachine` | Describe can fix vul machine<br>Required: `VulIds` |
| `DescribeFileTamperRules` | Describe file tamper rules |
| `DescribeMachineDefenseCnt` | Describe machine defense cnt |
| `DescribeProVersionInfo` | Describe pro version info |
| `DescribeWebPageGeneralize` | Describe web page generalize |
| `DescribePrivilegeEvents` | Describe privilege events |
| `DescribeMachineInfo` | Describe machine info |
| `DescribeAssetTypeTop` | Describe asset type top |
| `DescribeRaspRuleVuls` | Describe rasp rule vuls<br>Required: `Filters` |
| `ExportRansomDefenseStrategyMachines` | Export ransom defense strategy machines |
| `DescribeLogStorageStatistic` | Describe log storage statistic |
| `DescribeIgnoreHostAndItemConfig` | Describe ignore host and item config |
| `DescribeIgnoreBaselineRule` | Describe ignore baseline rule<br>Required: `Limit`, `Offset` |
| `DescribeLogDeliveryKafkaOptions` | Describe log delivery kafka options |
| `DescribeMachineRiskCnt` | Describe machine risk cnt |
| `DescribeScreenBroadcasts` | Describe screen broadcasts |
| `DescribeVersionCompareChart` | Describe version compare chart |
| `DescribeRaspEventDetailTCSS` | Describe rasp event detail tcss |
| `DescribeRansomDefenseTrend` | Describe ransom defense trend |
| `ExportAssetWebAppList` | Export asset web app list |
| `DescribeLicenseBindList` | Describe license bind list<br>Required: `LicenseId`, `LicenseType`, `ResourceId` |
| `DescribeAssetCoreModuleInfo` | Describe asset core module info<br>Required: `Quuid`, `Uuid`, `Id` |
| `DescribeGeneralStat` | Describe general stat |
| `DescribeAssetDatabaseInfo` | Describe asset database info<br>Required: `Quuid`, `Uuid`, `Id` |
| `DescribeMalwareWhiteList` | Describe malware white list |
| `DescribeScanVulSetting` | Describe scan vul setting |
| `DescribeSecurityBroadcastInfo` | Describe security broadcast info<br>Required: `Id` |
| `DescribeVulOverview` | Describe vul overview |
| `DescribeAssetWebLocationList` | Describe asset web location list |
| `DescribeLogType` | Describe log type |
| `DescribeAttackEventInfo` | Describe attack event info<br>Required: `Id` |
| `ExportBaselineFixList` | Export baseline fix list |
| `DescribeProVersionStatus` | Describe pro version status<br>Required: `Uuid` |
| `DescribeMachines` | Describe machines<br>Required: `MachineType`, `MachineRegion` |
| `DescribeBaselineHostDetectList` | Describe baseline host detect list |
| `DescribeAssetWebServiceInfoList` | Describe asset web service info list |
| `DescribeAssetProcessCount` | Describe asset process count |
| `DescribeVulTrend` | Describe vul trend |
| `DescribeVertexDetail` | Describe vertex detail<br>Required: `VertexIds`, `IncidentId`, `TableName` |
| `ExportBaselineItemList` | Export baseline item list |
| `DescribeBaselineItemRiskTop` | Describe baseline item risk top |
| `ExportAssetAppList` | Export asset app list |
| `DescribeRaspEventTCSS` | Describe rasp event tcss |
| `ExportBaselineWeakPasswordList` | Export baseline weak password list |
| `DescribeBaselineStrategyList` | Describe baseline strategy list<br>Required: `Limit`, `Offset`, `Enabled` |
| `ExportAssetPortInfoList` | Export asset port info list |
| `ExportAssetMachineList` | Export asset machine list |
| `DescribeLogStorageRecord` | Describe log storage record |
| `CheckBashPolicyParams` | Check bash policy params<br>Required: `CheckField` |
| `DescribeVulDefenceSettingList` | Describe vul defence setting list |
| `DescribeBaselineEffectHostList` | Describe baseline effect host list<br>Required: `Limit`, `Offset`, `BaselineId` |
| `DescribeVersionStatistics` | Describe version statistics |
| `DescribeAssetWebAppList` | Describe asset web app list |
| `DescribeProtectDirRelatedServer` | Describe protect dir related server<br>Required: `Id`, `Limit`, `Offset` |
| `ExportBaselineHostDetectList` | Export baseline host detect list |
| `ExportBashEvents` | Export bash events |
| `DescribeMachineGeneral` | Describe machine general |
| `DescribeRiskDnsPolicyList` | Describe risk dns policy list |
| `DescribeEmergencyVulList` | Describe emergency vul list |
| `DescribeJavaMemShellInfo` | Describe java mem shell info<br>Required: `Id` |
| `DescribeBaselineDownloadList` | Describe baseline download list |
| `DescribePrivilegeRules` | Describe privilege rules |
| `DescribeAssetJarList` | Describe asset jar list |
| `DescribeDefenceEventDetail` | Describe defence event detail<br>Required: `Id` |
| `DescribeMalwareRiskOverview` | Describe malware risk overview |
| `DescribeMachineClearHistory` | Describe machine clear history |
| `DescribeAgentInstallCommand` | Describe agent install command<br>Required: `IsCloud`, `NetType` |
| `DescribeRaspEventDetailCWP` | Describe rasp event detail cwp |
| `ExportScanTaskDetails` | Export scan task details<br>Required: `TaskId`, `ModuleType` |
| `DescribeMachineRegionList` | Describe machine region list |
| `ExportAssetInitServiceList` | Export asset init service list |
| `ExportAssetCoreModuleList` | Export asset core module list |
| `DescribeWarningList` | Describe warning list |
| `DescribeBaselineRuleIgnoreList` | Describe baseline rule ignore list |
| `DescribeBaselineBasicInfo` | Describe baseline basic info |
| `DescribeMachineRegions` | Describe machine regions |
| `DescribeVulDefenceSetting` | Describe vul defence setting |
| `DescribeVulHostCountScanTime` | Describe vul host count scan time |
| `ExportBaselineRuleDetectList` | Export baseline rule detect list |
| `DescribeLogStorageConfig` | Describe log storage config |
| `DescribeMachineSnapshot` | Describe machine snapshot<br>Required: `Quuids`, `Type`, `Limit`, `Offset` |
| `DescribeLicenseWhiteConfig` | Describe license white config<br>Required: `RuleName` |
| `DescribeMaliciousRequestWhiteList` | Describe malicious request white list<br>Required: `Limit` (default 10), `Offset` (default 0) |
| `DescribeAttackTop` | Describe attack top |
| `DescribeBaselineStrategyDetail` | Describe baseline strategy detail<br>Required: `StrategyId` |
| `DescribeAssetJarInfo` | Describe asset jar info<br>Required: `Quuid`, `Uuid`, `Id` |
| `DescribeScanTaskStatus` | Describe scan task status<br>Required: `ModuleType` |
| `DescribeScreenMachineRegions` | Describe screen machine regions |
| `DescribeYDRaspBlackWhite` | Describe ydrasp black white |
| `DescribeBaselineHostIgnoreList` | Describe baseline host ignore list<br>Required: `RuleID` |
| `DescribeRaspRules` | Describe rasp rules |
| `DescribeLoginWhiteCombinedList` | Describe login white combined list |
| `ExportNonlocalLoginPlaces` | Export nonlocal login places |
| `DescribeServersAndRiskAndFirstInfo` | Describe servers and risk and first info |
| `DescribeAssetAppProcessList` | Describe asset app process list<br>Required: `Quuid`, `Uuid`, `Name` |
| `DescribeReverseShellEvents` | Describe reverse shell events |
| `DescribeMalwareTimingScanSetting` | Describe malware timing scan setting |
| `ExportVulInfo` | Export vul info<br>Required: `VulId` |
| `ExportAssetDatabaseList` | Export asset database list |
| `ExportFileTamperRules` | Export file tamper rules |
| `DescribeReverseShellSystemPolicyConfig` | Describe reverse shell system policy config |
| `DescribeScreenProtectionCnt` | Describe screen protection cnt |
| `DescribeSafeInfo` | Describe safe info |
| `ExportAssetWebLocationList` | Export asset web location list |
| `DescribeRansomDefenseBackupList` | Describe ransom defense backup list<br>Required: `Limit`, `Offset`, `Quuid` |
| `DescribeRaspMemShellListTCSS` | Describe rasp mem shell list tcss |
| `DescribeBaselineDetectOverview` | Describe baseline detect overview |
| `DescribeBaselineItemDetectList` | Describe baseline item detect list |
| `DescribeRaspLicenseList` | Describe rasp license list |
| `DescribeInjectRiskyServiceSwitch` | Describe inject risky service switch |
| `DescribeMachinesSimple` | Describe machines simple<br>Required: `MachineType`, `MachineRegion` |
| `DescribeRansomDefenseStrategyDetail` | Describe ransom defense strategy detail<br>Required: `Id` |
| `ExportVulDetectionExcel` | Export vul detection excel<br>Required: `TaskId` |
| `DescribeBanRegions` | Describe ban regions<br>Required: `Mode` |
| `DescribeVulInfoCvss` | Describe vul info cvss<br>Required: `VulId` |
| `DescribeUsersConfig` | Describe users config<br>Required: `ConfigName` |
| `ExportJavaMemShells` | Export java mem shells |
| `DescribeBaselineWeakPasswordList` | Describe baseline weak password list |
| `DescribeRecommendedProtectCpu` | Describe recommended protect cpu |
| `DescribeBaselineItemInfo` | Describe baseline item info |
| `DescribeAssetInitServiceList` | Describe asset init service list |
| `DescribeRaspEventCWP` | Describe rasp event cwp |
| `DescribeBaselineFixList` | Describe baseline fix list |
| `DescribeWarningHostConfig` | Describe warning host config<br>Required: `Type` |
| `DescribeWebPageServiceInfo` | Describe web page service info |
| `DescribeVulDefenceEvent` | Describe vul defence event |
| `DescribeVulList` | Describe vul list |
| `ExportBaselineList` | Export baseline list |
| `DescribeFileTamperRuleInfo` | Describe file tamper rule info<br>Required: `Id` |
| `DescribeMalwareFile` | Describe malware file<br>Required: `Id` |
| `DescribeRiskDnsEventList` | Describe risk dns event list |
| `DescribeWebHookPolicy` | Describe web hook policy |
| `DescribeLoginTypeHost` | Describe login type host |
| `DescribeAssetPlanTaskList` | Describe asset plan task list |
| `DescribeAttackEvents` | Describe attack events |
| `DescribeAssetWebAppPluginList` | Describe asset web app plugin list<br>Required: `Quuid`, `Uuid`, `Id` |
| `DescribeLoginWhiteHostList` | Describe login white host list<br>Required: `Id`, `Limit`, `Offset` (default 0) |
| `DescribeSearchLogs` | Describe search logs |
| `DescribeBaselineTop` | Describe baseline top<br>Required: `Top`, `StrategyId` |
| `DescribeFastAnalysis` | Describe fast analysis<br>Required: `From`, `To`, `Query`, `FieldName` |
| `DescribeTrialReport` | Describe trial report |
| `DescribeVulDefenceOverviewCount` | Describe vul defence overview count |
| `DescribeUsualLoginPlaces` | Describe usual login places<br>Required: `Uuid` |
| `ExportFileTamperEvents` | Export file tamper events |
| `DescribeRaspMemShellDetailTCSS` | Describe rasp mem shell detail tcss |
| `ExportProtectDirList` | Export protect dir list |
| `ExportTasks` | Export tasks<br>Required: `TaskId` |
| `ExportIgnoreRuleEffectHostList` | Export ignore rule effect host list<br>Required: `RuleId` |
| `DescribeRiskDnsInfo` | Describe risk dns info<br>Required: `Id` |
| `ExportRansomDefenseEventsList` | Export ransom defense events list |
| `DescribeVulDefencePluginExceptionCount` | Describe vul defence plugin exception count |
| `DescribeIgnoreRuleEffectHostList` | Describe ignore rule effect host list<br>Required: `Limit`, `Offset`, `RuleId` |
| `DescribeAssetAppList` | Describe asset app list |
| `DescribeLogKafkaDeliverInfo` | Describe log kafka deliver info |
| `DescribeESAggregations` | Describe esaggregations<br>Required: `Query` |
| `ExportIgnoreBaselineRule` | Export ignore baseline rule |
| `DescribePrivilegeEventInfo` | Describe privilege event info<br>Required: `Id` |
| `DescribeMalwareRiskWarning` | Describe malware risk warning |
| `DescribeBaselineDefaultStrategyList` | Describe baseline default strategy list |
| `DescribeTagMachines` | Describe tag machines<br>Required: `Id` |
| `DescribeRiskProcessEvents` | Describe risk process events |
| `DescribeEventByTable` | Describe event by table<br>Required: `TableName`, `Ids` |
| `DescribeSecurityDynamics` | Describe security dynamics |
| `DescribeAssetDatabaseCount` | Describe asset database count |
| `DescribeLoginWhiteList` | Describe login white list |
| `DescribeRaspPluginList` | Describe rasp plugin list |
| `DescribeLogHistogram` | Describe log histogram<br>Required: `StartTime`, `EndTime`, `QueryString`, `Interval` |
| `DescribeMachineFileTamperRules` | Describe machine file tamper rules<br>Required: `Uuid` |
| `DescribePublicProxyInstallCommand` | Describe public proxy install command |
| `DescribeVulLevelCount` | Describe vul level count |
| `ExportAssetUserList` | Export asset user list |
| `DescribeMachineList` | Describe machine list<br>Required: `MachineType`, `MachineRegion` |
| `DescribeHostLoginList` | Describe host login list |
| `DescribeMalWareList` | Describe mal ware list |
| `DescribeOpenPortStatistics` | Describe open port statistics |
| `DescribeShellPolicyList` | Describe shell policy list |
| `DescribeDirectConnectInstallCommand` | Describe direct connect install command<br>Required: `RegionCode`, `VpcId`, `ExpireDate` |
| `DescribeWebHookRules` | Describe web hook rules |
| `DescribeBaselinePolicyList` | Describe baseline policy list |
| `DescribeAssetWebAppCount` | Describe asset web app count |
| `DescribeBashEventsInfo` | Describe bash events info<br>Required: `Id` |
| `DescribeAlarmVertexId` | Describe alarm vertex id<br>Required: `Uuid`, `StartTime`, `EndTime` |
| `DescribeVulCveIdInfo` | Describe vul cve id info<br>Required: `CveIds` |
| `DescribeLoginTypeGlobalConf` | Describe login type global conf |
| `ExportRansomDefenseBackupList` | Export ransom defense backup list<br>Required: `Quuid` |
| `DescribeAttackStatistics` | Describe attack statistics |
| `DescribeAssetUserKeyList` | Describe asset user key list<br>Required: `Quuid`, `Uuid`, `Name` |
| `DescribeScanMalwareSchedule` | Describe scan malware schedule |
| `DescribeWebHookRule` | Describe web hook rule |
| `DescribeAssetRecentMachineInfo` | Describe asset recent machine info<br>Required: `BeginDate`, `EndDate` |
| `DescribeVulEffectModules` | Describe vul effect modules<br>Required: `Limit`, `Offset`, `VulId` |
| `DescribeVulTop` | Describe vul top<br>Required: `Top` |
| `DescribeBruteAttackRules` | Describe brute attack rules |
| `DescribeAssetEnvList` | Describe asset env list |
| `DescribeSecurityEventsCnt` | Describe security events cnt |
| `DescribePatchInfo` | Describe patch info<br>Required: `KbId` |
| `DescribeLicenseBindSchedule` | Describe license bind schedule<br>Required: `TaskId` |
| `DescribeWebPageProtectStat` | Describe web page protect stat |
| `DescribeHistoryAccounts` | Describe history accounts<br>Required: `Uuid` |
| `DescribeBaselineList` | Describe baseline list<br>Required: `Limit`, `Offset` |
| `DescribeAssetMachineDetail` | Describe asset machine detail<br>Required: `Quuid`, `Uuid` |
| `DescribeABTestConfig` | Describe abtest config |
| `DescribeAssetWebFrameList` | Describe asset web frame list |
| `DescribeAssetCoreModuleList` | Describe asset core module list |
| `DescribeAssetWebServiceCount` | Describe asset web service count |
| `DescribeScreenDefenseTrends` | Describe screen defense trends |
| `DescribeProtectDirList` | Describe protect dir list<br>Required: `Limit`, `Offset` |
| `CheckLogKafkaConnectionState` | Check log kafka connection state<br>Required: `AccessType`, `AccessAddr`, `Username`, `HasPwd`, `Pwd`, `KafkaId`, `InsVersion` |
| `DescribeVulDefencePluginStatus` | Describe vul defence plugin status |
| `DescribeTags` | Describe tags |
| `DescribeVulDefencePluginDetail` | Describe vul defence plugin detail<br>Required: `Quuid` |
| `GetLocalStorageItem` | Get local storage item<br>Required: `Key` |
| `ExportRansomDefenseMachineList` | Export ransom defense machine list |
| `DescribeRansomDefenseEventsList` | Describe ransom defense events list<br>Required: `Limit`, `Offset` |
| `ExportAssetProcessInfoList` | Export asset process info list |
| `DescribeRansomDefenseMachineStrategyInfo` | Describe ransom defense machine strategy info<br>Required: `Quuids` |
| `DescribeBashEvents` | Describe bash events |
| `ExportVulDetectionReport` | Export vul detection report<br>Required: `TaskId` |
| `DescribeLicenseList` | Describe license list |
| `DescribeWebHookReceiverUsage` | Describe web hook receiver usage |
| `DescribeAssetSystemPackageList` | Describe asset system package list |
| `DescribeSecurityBroadcasts` | Describe security broadcasts |
| `DescribeAssetTypes` | Describe asset types |
| `DescribeVulLabels` | Describe vul labels |
| `DescribeBashRules` | Describe bash rules<br>Required: `Type` |
| `DescribeAssetDiskList` | Describe asset disk list<br>Required: `Quuid`, `Uuid` |
| `ExportVulDefenceEvent` | Export vul defence event |
| `DescribeScanState` | Describe scan state<br>Required: `ModuleType` |
| `DescribeBaselineItemList` | Describe baseline item list |
| `DescribeBashPolicies` | Describe bash policies |
| `DescribeVulHostTop` | Describe vul host top<br>Required: `Top` |
| `DescribeRansomDefenseStrategyMachines` | Describe ransom defense strategy machines<br>Required: `Limit`, `Offset` |
| `DescribeHistoryService` | Describe history service |
| `DescribeVulCountByDates` | Describe vul count by dates |
| `ExportVulEffectHostList` | Export vul effect host list<br>Required: `VulId` |
| `DescribeVulStoreList` | Describe vul store list |
| `ExportAttackEvents` | Export attack events |
| `DescribeAlarmIncidentNodes` | Describe alarm incident nodes<br>Required: `Uuid`, `AlarmVid`, `AlarmTime` |
| `DescribeScreenEventsCnt` | Describe screen events cnt |
| `DescribeAssetTotalCount` | Describe asset total count |
| `DescribeHotVulTop` | Describe hot vul top |
| `ExportWindowsPatchList` | Export windows patch list |
| `ExportAssetSystemPackageList` | Export asset system package list |
| `ExportPrivilegeEvents` | Export privilege events |
| `DescribeAssetUserInfo` | Describe asset user info<br>Required: `Quuid`, `Uuid`, `Name` |
| `ExportVulDefencePluginEvent` | Export vul defence plugin event |
| `DescribeAccountStatistics` | Describe account statistics |
| `ExportRiskProcessEvents` | Export risk process events |
| `DescribeUndoVulCounts` | Describe undo vul counts |
| `DescribeCanNotSeparateMachine` | Describe can not separate machine |
| `ExportBruteAttacks` | Export brute attacks |
| `ExportAssetEnvList` | Export asset env list |
| `ExportSecurityTrends` | Export security trends<br>Required: `BeginDate`, `EndDate` |
| `ExportMalwares` | Export malwares |
| `ExportWebPageEventList` | Export web page event list |
| `DescribeBaselineHostRiskTop` | Describe baseline host risk top |
| `ExportRiskDnsEventList` | Export risk dns event list |
| `ExportLicenseDetail` | Export license detail |
| `DescribeAttackTrends` | Describe attack trends |
| `DescribeScreenEmergentMsg` | Describe screen emergent msg |
| `DescribeBaselineRule` | Describe baseline rule<br>Required: `BaselineId`, `Limit`, `Offset` |
| `DescribeFileTamperEvents` | Describe file tamper events |
| `DescribeBanStatus` | Describe ban status |
| `DescribeVulDefenceList` | Describe vul defence list |
| `DescribeProcessStatistics` | Describe process statistics |
| `DescribeMalwareInfo` | Describe malware info<br>Required: `Id` |
| `DescribeRansomDefenseState` | Describe ransom defense state |
| `ExportRiskDnsPolicyList` | Export risk dns policy list |
| `DescribeStrategyExist` | Describe strategy exist<br>Required: `StrategyName` |
| `SearchLog` | Search log<br>Required: `StartTime`, `EndTime`, `QueryString` |
| `DescribeFileTamperRuleCount` | Describe file tamper rule count<br>Required: `Uuids` |
| `DescribeJavaMemShellPluginList` | Describe java mem shell plugin list |
| `DescribeProductStatus` | Describe product status |
| `DescribeReverseShellEventInfo` | Describe reverse shell event info<br>Required: `Id` |
| `DescribeBanWhiteList` | Describe ban white list |
| `DescribeAttackVulTypeList` | Describe attack vul type list |
| `DescribeRaspMaxCpu` | Describe rasp max cpu |
| `DescribeBaselineDetail` | Describe baseline detail<br>Required: `BaselineId` |
| `DescribeAssetPortCount` | Describe asset port count |
| `DescribeRiskDnsList` | Describe risk dns list |
| `DescribeVdbAndPocInfo` | Describe vdb and poc info |
| `DescribeMachineOsList` | Describe machine os list |
| `DescribeVulEmergentMsg` | Describe vul emergent msg |
| `DescribeLicenseGeneral` | Describe license general |
| `DescribeRansomDefenseRollBackTaskList` | Describe ransom defense roll back task list<br>Required: `Limit`, `Offset` |
| `ExportAssetRecentMachineInfo` | Export asset recent machine info<br>Required: `BeginDate`, `EndDate` |
| `ExportPatchEffectHostList` | Export patch effect host list<br>Required: `KbId` |
| `ExportReverseShellEvents` | Export reverse shell events |
| `DescribeBaselineItemIgnoreList` | Describe baseline item ignore list<br>Required: `RuleID` |
| `ExportRansomDefenseStrategyList` | Export ransom defense strategy list |
| `DescribeVulFixStatus` | Describe vul fix status |
| `DescribeReverseShellRulesAggregation` | Describe reverse shell rules aggregation |
| `DescribeClientException` | Describe client exception<br>Required: `ExceptionType`, `Offset`, `Limit` |
| `DescribeBaselineRuleCategoryList` | Describe baseline rule category list |
| `DescribeSecurityTrends` | Describe security trends<br>Required: `BeginDate`, `EndDate` |
| `DescribeBaselineAnalysisData` | Describe baseline analysis data<br>Required: `StrategyId` |
| `DescribeRansomDefenseMachineList` | Describe ransom defense machine list<br>Required: `Limit`, `Offset` |
| `ExportBaselineEffectHostList` | Export baseline effect host list<br>Required: `BaselineId` |
| `DescribeAssetInfo` | Describe asset info |
| `DescribeMalwareWhiteListAffectList` | Describe malware white list affect list<br>Required: `WhiteListId` |
| `ExportVulList` | Export vul list |
| `ExportAssetPlanTaskList` | Export asset plan task list |
| `DescribeWebPageEventList` | Describe web page event list |
| `DescribeAgentInstallationToken` | Describe agent installation token<br>Required: `ExpireDate` |
| `DescribeAssetMachineTagTop` | Describe asset machine tag top |
## Mutations (gated — need allowlist, 52)

| Action | What it does |
|---|---|
| `KeysLocalStorage` | Run keys local storage |
| `CreateBaselineStrategy` | Create baseline strategy<br>Required: `StrategyName`, `ScanCycle`, `ScanAt`, `CategoryIds`, `IsGlobal`, `MachineType`, `RegionCode` |
| `FixBaselineDetect` | Run fix baseline detect<br>Required: `HostId`, `ItemId` |
| `SetLocalStorageItem` | Set local storage item<br>Required: `Key`, `Value` |
| `ClearLocalStorage` | Run clear local storage |
| `SwitchBashRules` | Switch bash rules<br>Required: `Id`, `Disabled` |
| `SeparateMalwares` | Run separate malwares<br>Required: `Ids` |
| `SetLocalStorageExpire` | Set local storage expire<br>Required: `Key`, `Expire` |
| `TestWebHookRule` | Test web hook rule<br>Required: `Id`, `Data` |
| `CreateWhiteListOrder` | Create white list order<br>Required: `LicenseType`, `LicenseNum`, `Deadline`, `RuleName`, `SourceType` |
| `CreateScanMalwareSetting` | Create scan malware setting<br>Required: `ScanPattern`, `HostType` |
| `RaspEventOverview` | Run rasp event overview |
| `CreateMalwareWhiteList` | Create malware white list<br>Required: `Mode` |
| `ScanTaskAgain` | Scan task again<br>Required: `ModuleType`, `TaskId` |
| `CreateIncidentBacktracking` | Create incident backtracking<br>Required: `Quuid` |
| `UntrustMalwares` | Run untrust malwares<br>Required: `Ids` |
| `UpdateMachineTags` | Update machine tags<br>Required: `Quuid` |
| `ScanAsset` | Scan asset |
| `CreateLicenseOrder` | Create license order |
| `EditTags` | Run edit tags<br>Required: `Name` |
| `CreateLogExport` | Create log export<br>Required: `Count`, `StartTime`, `EndTime` |
| `SyncMachines` | Sync machines |
| `CreateBanWhiteList` | Create ban white list<br>Required: `Rules` |
| `ScanVulAgain` | Scan vul again<br>Required: `EventIds` |
| `AddVulIgnoreRule` | Add vul ignore rule |
| `ScanBaseline` | Scan baseline |
| `AddLoginWhiteLists` | Add login white lists<br>Required: `HostLoginWhiteObj` |
| `CreateSearchLog` | Create search log<br>Required: `SearchContent` |
| `CreateSearchTemplate` | Create search template<br>Required: `SearchTemplate` |
| `CreateVulFix` | Create vul fix<br>Required: `CreateVulFixTaskQuuids`, `SaveDays` |
| `EditPrivilegeRules` | Run edit privilege rules |
| `UpdateBaselineStrategy` | Update baseline strategy<br>Required: `StrategyId`, `StrategyName`, `ScanCycle`, `ScanAt`, `CategoryIds`, `IsGlobal`, `MachineType`, `RegionCode`, `Quuids` |
| `RetryVulFix` | Retry vul fix<br>Required: `FixId`, `Quuid` |
| `RetryCreateSnapshot` | Retry create snapshot<br>Required: `FixId`, `Quuid`, `Id` |
| `SyncBaselineDetectSummary` | Sync baseline detect summary |
| `CreateProtectServer` | Create protect server<br>Required: `ProtectDir`, `ProtectHostConfig` |
| `CreateMaliciousRequestWhiteList` | Create malicious request white list<br>Required: `Domain` |
| `SetBashEventsStatus` | Set bash events status<br>Required: `Ids`, `Status` |
| `ChangeStrategyEnableStatus` | Run change strategy enable status<br>Required: `StrategyId`, `Status` |
| `StartBaselineDetect` | Start baseline detect<br>Required: `Param` |
| `TrustMalwares` | Run trust malwares<br>Required: `Ids` |
| `ChangeRuleEventsIgnoreStatus` | Run change rule events ignore status<br>Required: `IgnoreStatus` |
| `RansomDefenseRollback` | Run ransom defense rollback<br>Required: `BackupTime` |
| `SyncAssetScan` | Sync asset scan<br>Required: `Sync` (default false) |
| `EditReverseShellRules` | Run edit reverse shell rules |
| `ScanVulSetting` | Scan vul setting<br>Required: `TimerInterval` |
| `CreateRansomDefenseStrategy` | Create ransom defense strategy<br>Required: `Name`, `Hour` |
| `CreateBuyBindTask` | Create buy bind task<br>Required: `DealName`, `LicenseType` |
| `CreateEmergencyVulScan` | Create emergency vul scan<br>Required: `VulId` |
| `ScanVul` | Scan vul<br>Required: `VulLevels`, `HostType` |
| `CreateNetAttackWhiteList` | Create net attack white list<br>Required: `Scope`, `SrcIp` |
| `EditBashRules` | Run edit bash rules |

## Blocked destructive actions (103)

`ModifyRansomDefenseStrategyStatus`, `StopAssetScan`, `DeleteSearchTemplate`, `DeleteBashPolicies`, `DestroyOrder`, `ModifyWebHookReceiver`, `ModifyBaselineRuleIgnore`, `ModifyRaspMaxCpu`, `DeleteLicenseRecordAll`, `ModifyLoginWhiteRecord`, `DeletePrivilegeRules`, `ModifyBashPolicyStatus`, `DeleteRiskDnsEvent`, `DeleteLoginWhiteList`, `DeleteLogExport`, `DeleteBaselineStrategy`, `ModifyReverseShellRulesAggregation`, `DeleteNetAttackWhiteList`, `RemoveMachine`, `ModifyAutoOpenProVersionConfig`, `ModifyBaselinePolicyState`, `DeleteMalwareScanTask`, `ModifyNetAttackSetting`, `DeleteWebHookPolicy`, `ModifyLicenseUnBinds`, `ModifyJavaMemShellPluginSwitch`, `DeleteMachine`, `ModifyFileTamperEvents`, `DeleteWebPageEventLog`, `DeleteMachineTag`, `ModifyWebHookPolicyStatus`, `RemoveLocalStorageItem`, `ModifyEventAttackStatus`, `DeleteBashEvents`, `DeleteMaliciousRequests`, `RecoverMalwares`, `DeleteReverseShellRules`, `DeleteProtectDir`, `DeleteBruteAttacks`, `DeleteWebHookReceiver`, `ModifyLogKafkaAccess`, `ModifyBanStatus`, `DeleteReverseShellEvents`, `ModifyWebPageProtectSetting`, `ModifyLoginWhiteInfo`, `ModifyMachineRemark`, `DeleteMachineClearHistory`, `ModifyBaselinePolicy`, `DeleteBaselinePolicy`, `DeleteRiskDnsPolicy`, `ModifyBashPolicy`, `DeleteMaliciousRequestWhiteList`, `ModifyLogKafkaState`, `ModifyMachineAutoClearConfig`, `ModifyRiskDnsPolicyStatus`, `ModifyWebHookRuleStatus`, `ModifyLogStorageConfig`, `ModifyFileTamperRule`, `DeletePrivilegeEvents`, `ModifyRansomDefenseEventsStatus`, `ModifyWarningSetting`, `ModifyWebHookRule`, `DeleteWebHookRule`, `DeleteLicenseRecord`, `ModifyLicenseOrder`, `ModifyBanMode`, `ModifyLogKafkaDeliverType`, `ModifyMalwareWhiteList`, `DeleteBashRules`, `ModifyRaspRules`, `DeleteMalwareWhiteList`, `ModifyNetAttackWhiteList`, `DeleteBanWhiteList`, `ModifyOrderAttribute`, `ModifyMalwareTimingScanSettings`, `ModifyBaselineWeakPassword`, `ModifyBaselineRule`, `ModifyWebPageProtectSwitch`, `ModifyVulDefenceEventStatus`, `ModifyWarningHostConfig`, `DeleteTags`, `DeleteBaselineRule`, `ModifyMaliciousRequestWhiteList`, `DeleteBaselineRuleIgnore`, `StopBaselineDetect`, `ModifyVulDefenceSetting`, `DeleteScanTask`, `ModifyUsersConfig`, `ModifyWebHookPolicy`, `DeleteAllJavaMemShells`, `DeleteBaselineWeakPassword`, `DeleteNonlocalLoginPlaces`, `ModifyRiskEventsStatus`, `DeleteRaspRules`, `DeleteMalwares`, `ModifyWebPageProtectDir`, `ModifyFileTamperRuleStatus`, `ModifyBanWhiteList`, `StopNoticeBanTips`, `ModifyLicenseBinds`, `ModifyBruteAttackRules`, `ModifyRiskDnsPolicy`, `ModifyJavaMemShellsStatus` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cwp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180228` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cwp"`) for the allow/block decision and reason.

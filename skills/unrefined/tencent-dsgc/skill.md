---
name: tencent-dsgc
description: Tencent Cloud DSGC via the Tencent MCP server — 133 actions in API version v20190723 (80 read-only auto-allowed). Use for dspaassessment, risk, dspadiscovery, asset, result, overview. Triggers on mentions of dsgc, dspaassessment, risk, dspadiscovery, asset, result, overview, dspacategory, dspacosdiscovery. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud DSGC

Security & identity: 133 actions in API version `v20190723` — 80 read-only (auto-allowed), 30 gated mutations, 23 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dsgc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dsgc/v20190723 — action signatures in `dsgc_client.ts`, full request/response shapes in `dsgc_models.ts`.

## Read actions (auto-allowed, 80)

| Action | What it does |
|---|---|
| `DescribeDSPAAssessmentRiskDealedOverview` | Describe dspaassessment risk dealed overview<br>Required: `DspaId` |
| `DescribeDSPAAssessmentRiskLevelDetail` | Describe dspaassessment risk level detail<br>Required: `DspaId`, `RiskLevelId` |
| `DescribeDSPAAssessmentRiskTemplateDetail` | Describe dspaassessment risk template detail<br>Required: `DspaId`, `TemplateId`, `Limit`, `Offset` |
| `DescribeDSPAAssessmentLatestRiskList` | Describe dspaassessment latest risk list<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPADiscoveryRules` | Describe dspadiscovery rules<br>Required: `DspaId` |
| `DescribeDSPACOSDataAssetByComplianceId` | Describe dspacosdata asset by compliance id<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPAAssessmentRiskLevelList` | Describe dspaassessment risk level list<br>Required: `DspaId`, `Limit`, `Offset` |
| `DescribeDSPACategoryRuleStatistic` | Describe dspacategory rule statistic<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPADiscoveryTasks` | Describe dspadiscovery tasks<br>Required: `DspaId`, `DataSourceType` |
| `DescribeRDBAssetSensitiveDistribution` | Describe rdbasset sensitive distribution<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeReportTaskDownloadUrl` | Describe report task download url<br>Required: `ReportTaskId`, `DspaId` |
| `DescribeDSPACOSDiscoveryTaskResult` | Describe dspacosdiscovery task result<br>Required: `DspaId` |
| `DescribeAssetDetailDataExportResult` | Describe asset detail data export result<br>Required: `ExportTaskId`, `DspaId` |
| `DescribeDSPAAssessmentRiskSideDistributed` | Describe dspaassessment risk side distributed<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPADiscoveryTaskResultDetail` | Describe dspadiscovery task result detail<br>Required: `DspaId`, `TaskId`, `DbResultId`, `ComplianceId`, `DbName` |
| `DescribeDSPAAssessmentRiskLevelTrend` | Describe dspaassessment risk level trend<br>Required: `DspaId`, `StartTime`, `EndTime` |
| `DescribeDSPAAssessmentRisks` | Describe dspaassessment risks<br>Required: `DspaId`, `TaskId` |
| `DescribeDSPAComplianceGroupDetail` | Describe dspacompliance group detail<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPACOSTaskResultDetail` | Describe dspacostask result detail<br>Required: `DspaId`, `TaskId`, `ComplianceId` |
| `DescribeDSPARDBDataAssetByComplianceId` | Describe dspardbdata asset by compliance id<br>Required: `DspaId`, `ComplianceId` |
| `DescribeBindDBList` | Describe bind dblist<br>Required: `DspaId` |
| `DescribeExportTaskResult` | Describe export task result<br>Required: `DspaId`, `ExportTaskId` |
| `ListDSPACosMetaResources` | List dspacos meta resources<br>Required: `DspaId` |
| `ListDSPAMetaResources` | List dspameta resources<br>Required: `DspaId` |
| `DescribeDSPACategories` | Describe dspacategories<br>Required: `DspaId` |
| `DescribeDSPADiscoveryTaskDetail` | Describe dspadiscovery task detail<br>Required: `DspaId`, `TaskId` |
| `DescribeDSPAAssessmentRiskAmountOverview` | Describe dspaassessment risk amount overview<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPAESDataAssetByComplianceId` | Describe dspaesdata asset by compliance id<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPAComplianceGroups` | Describe dspacompliance groups<br>Required: `DspaId` |
| `DescribeDSPACOSDiscoveryTaskDetail` | Describe dspacosdiscovery task detail<br>Required: `DspaId`, `TaskId` |
| `DescribeDSPATaskResultDataSample` | Describe dspatask result data sample<br>Required: `DspaId`, `FieldResultId` |
| `DescribeMongoAssetSensitiveDistribution` | Describe mongo asset sensitive distribution<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeSensitiveCOSDataDistribution` | Describe sensitive cosdata distribution<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeDSPAAssessmentRiskDatasourceTop5` | Describe dspaassessment risk datasource top5<br>Required: `DspaId` |
| `DescribeReportTasks` | Describe report tasks<br>Required: `DspaId`, `Limit`, `Offset` |
| `DescribeDSPACOSDiscoveryTaskFiles` | Describe dspacosdiscovery task files<br>Required: `DspaId`, `TaskId` |
| `DescribeDSPAAssessmentTemplates` | Describe dspaassessment templates<br>Required: `DspaId` |
| `DescribeDSPAAssessmentPendingRiskOverview` | Describe dspaassessment pending risk overview<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPARDBDataAssetDetail` | Describe dspardbdata asset detail<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPAAssessmentRiskItemTop5` | Describe dspaassessment risk item top5<br>Required: `DspaId` |
| `QueryResourceDbBindStatus` | Query resource db bind status<br>Required: `DspaId`, `ResourceId`, `ResourceRegion`, `MetaType` |
| `DescribeDSPADiscoveryServiceStatus` | Describe dspadiscovery service status<br>Required: `DspaId` |
| `DescribeDSPACategoryRules` | Describe dspacategory rules<br>Required: `DspaId`, `CategoryId`, `ComplianceId` |
| `DescribeDSPAAssessmentRiskTemplateVulnerableList` | Describe dspaassessment risk template vulnerable list<br>Required: `DspaId`, `Limit`, `Offset` |
| `DescribeDSPACOSDataAssetDetail` | Describe dspacosdata asset detail<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPACOSDiscoveryTasks` | Describe dspacosdiscovery tasks<br>Required: `DspaId` |
| `DescribeDSPALevelDetail` | Describe dspalevel detail<br>Required: `DspaId` |
| `DescribeAssetOverview` | Describe asset overview<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeDSPAAssessmentRiskOverview` | Describe dspaassessment risk overview<br>Required: `DspaId` |
| `DescribeDSPAESDataAssetDetail` | Describe dspaesdata asset detail<br>Required: `DspaId`, `ComplianceId`, `Offset`, `Limit` |
| `DescribeDSPADataSourceDbInfo` | Describe dspadata source db info<br>Required: `DspaId`, `DataSourceId` |
| `DescribeDSPAAssessmentHighRiskTop10Overview` | Describe dspaassessment high risk top10 overview<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPAAssessmentLatestRiskDetailInfo` | Describe dspaassessment latest risk detail info<br>Required: `DspaId`, `TemplateId`, `RiskId` |
| `DescribeDSPAAssessmentTasks` | Describe dspaassessment tasks<br>Required: `DspaId` |
| `DescribeDSPADiscoveryTaskTables` | Describe dspadiscovery task tables<br>Required: `DspaId`, `TaskId` |
| `GetUserQuotaInfo` | Get user quota info<br>Required: `DspaId` |
| `DescribeDSPAComplianceUpdateNotification` | Describe dspacompliance update notification<br>Required: `DspaId`, `ComplianceId` |
| `DescribeESAssetSensitiveDistribution` | Describe esasset sensitive distribution<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeDSPASupportedMetas` | Describe dspasupported metas |
| `DescribeDSPAAssessmentRiskDealedTrend` | Describe dspaassessment risk dealed trend<br>Required: `DspaId`, `StartTime`, `EndTime` |
| `DescribeSensitiveRDBDataDistribution` | Describe sensitive rdbdata distribution<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeDSPAESDiscoveryTaskResultDetail` | Describe dspaesdiscovery task result detail<br>Required: `DspaId`, `TaskId`, `ComplianceId`, `Offset` (default 0), `Limit` (default 20) |
| `DescribeDSPADiscoveryTaskResult` | Describe dspadiscovery task result<br>Required: `DspaId`, `DataSourceType` |
| `DescribeCOSAssetSensitiveDistribution` | Describe cosasset sensitive distribution<br>Required: `DspaId`, `ComplianceId`, `AssetList` |
| `DescribeDSPAAssessmentNewDiscoveredRiskOverview` | Describe dspaassessment new discovered risk overview<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPAAssessmentRiskProcessHistory` | Describe dspaassessment risk process history<br>Required: `DspaId`, `RiskId` |
| `QueryDSPAMetaResourceDbList` | Query dspameta resource db list<br>Required: `DspaId`, `ResourceId`, `ResourceRegion`, `MetaType` |
| `GetTrialVersion` | Get trial version<br>Required: `DspaId` |
| `DescribeDSPAAssessmentRiskDistributionOverview` | Describe dspaassessment risk distribution overview<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPACategoryTreeWithRules` | Describe dspacategory tree with rules<br>Required: `DspaId`, `ComplianceId` |
| `GetResourceConnectionStatus` | Get resource connection status<br>Required: `DspaId`, `MetaType`, `ResourceRegion`, `ResourceId` |
| `DescribeDSPAESDataSample` | Describe dspaesdata sample<br>Required: `DspaId`, `FieldResultId` |
| `DescribeDSPAAssessmentTemplateControlItems` | Describe dspaassessment template control items<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPALevelGroups` | Describe dspalevel groups<br>Required: `DspaId` |
| `ListDSPAClusters` | List dspaclusters |
| `ExportAssetDetailData` | Export asset detail data<br>Required: `DspaId`, `ComplianceId`, `MetaDataType` |
| `DescribeDSPACategoryTree` | Describe dspacategory tree<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPAAssessmentRiskSideList` | Describe dspaassessment risk side list<br>Required: `DspaId`, `TemplateId` |
| `DescribeDSPACOSDataAssetBuckets` | Describe dspacosdata asset buckets<br>Required: `DspaId`, `ComplianceId` |
| `DescribeDSPAAssessmentProcessingRiskOverview` | Describe dspaassessment processing risk overview<br>Required: `DspaId`, `TemplateId` |
## Mutations (gated — need allowlist, 30)

| Action | What it does |
|---|---|
| `CreateDSPALevelGroup` | Create dspalevel group<br>Required: `DspaId`, `Name`, `ItemLevels` |
| `CopyDSPATemplate` | Copy dspatemplate<br>Required: `DspaId`, `TemplateId` |
| `DisableDSPAMetaResourceAuth` | Disable dspameta resource auth<br>Required: `DspaId`, `MetaType`, `ResourceRegion`, `ResourceIDs` |
| `StartDSPADiscoveryTask` | Start dspadiscovery task<br>Required: `DspaId`, `TaskId` |
| `CreateDSPAComplianceRules` | Create dspacompliance rules<br>Required: `DspaId`, `CategoryId`, `ComplianceId`, `Rules` |
| `CreateAssetSortingReportRetryTask` | Create asset sorting report retry task<br>Required: `ReportTaskId`, `DspaId` |
| `BindDSPAResourceCosBuckets` | Bind dsparesource cos buckets<br>Required: `DspaId` |
| `CreateDSPAAssessmentRiskLevel` | Create dspaassessment risk level<br>Required: `DspaId`, `RiskLevelName`, `IdentifyComplianceId`, `RiskLevelRule` |
| `CreateDSPACategoryRelation` | Create dspacategory relation<br>Required: `DspaId`, `CategoryId`, `ParentCategoryId`, `ComplianceId` |
| `EnableDSPADiscoveryRule` | Enable dspadiscovery rule<br>Required: `DspaId`, `RuleId`, `Enable` |
| `CreateIdentifyRuleAnotherName` | Create identify rule another name<br>Required: `DspaId`, `ComplianceId`, `CategoryId`, `RuleId`, `RuleName`, `AnotherName` |
| `DecribeSuggestRiskLevelMatrix` | Run decribe suggest risk level matrix<br>Required: `DspaId`, `SensitiveLevelList`, `VulnerabilityLevelList` |
| `EnableTrialVersion` | Enable trial version<br>Required: `DspaId`, `TrialVersion` |
| `CreateDSPACategory` | Create dspacategory<br>Required: `DspaId`, `Name` |
| `CreateDSPACOSDiscoveryTask` | Create dspacosdiscovery task<br>Required: `DspaId`, `Name`, `DataSourceId`, `Enable`, `Bucket`, `Plan`, `Period`, `FileTypes`, `FileSizeLimit`, `ResourceRegion` |
| `VerifyDSPADiscoveryRule` | Verify dspadiscovery rule<br>Required: `DspaId`, `MatchOperator` |
| `CreateDSPAAssessmentTask` | Create dspaassessment task<br>Required: `DspaId`, `Name`, `TemplateId` |
| `VerifyDSPACOSRule` | Verify dspacosrule<br>Required: `DspaId`, `COSRules`, `Data` |
| `CreateDSPAAssessmentRiskTemplate` | Create dspaassessment risk template<br>Required: `DspaId`, `TemplateName`, `RiskLevelId`, `RiskIdList` |
| `CreateDSPAComplianceGroup` | Create dspacompliance group<br>Required: `DspaId`, `Name` |
| `CreateDSPAMetaResources` | Create dspameta resources<br>Required: `MetaType` (cdb | dcdb | mariadb | postgres | cynosdbpg | cynosdbmysql), `ResourceRegion`, `DspaId`, `UpdateStatus` (continue | finished), `UpdateId`, `Items` |
| `CreateDSPADbMetaResources` | Create dspadb meta resources<br>Required: `DspaId`, `MetaType` (cdb | dcdb | mariadb | postgres | cynosdbpg | cynosdbmysql), `CloudResourceItems` |
| `BindDSPAResourceDatabases` | Bind dsparesource databases<br>Required: `DspaId`, `ResourceId`, `MetaType` |
| `AuthorizeDSPAMetaResources` | Authorize dspameta resources<br>Required: `DspaId`, `AuthType`, `MetaType`, `ResourceRegion`, `ResourcesAccount` |
| `UpdateDSPASelfBuildResource` | Update dspaself build resource<br>Required: `DspaId`, `ResourceId` |
| `CreateDSPADiscoveryRule` | Create dspadiscovery rule<br>Required: `DspaId`, `Name` |
| `CreateDSPADiscoveryTask` | Create dspadiscovery task<br>Required: `DspaId`, `Name`, `DataSourceId`, `Enable`, `Plan`, `Period`, `ResourceRegion`, `DataSourceType` |
| `CreateDSPASelfBuildMetaResource` | Create dspaself build meta resource<br>Required: `DspaId`, `MetaType`, `ResourceRegion`, `ResourceId`, `ResourceUniqueVpcId`, `ResourceUniqueSubnetId`, `ResourceAccessType`, `ResourceVip`, `ResourceVPort`, `UserName`, `Password` |
| `CreateDSPACosMetaResources` | Create dspacos meta resources<br>Required: `DspaId`, `CosBucketItems` |
| `CreateAssetSortingReportTask` | Create asset sorting report task<br>Required: `DspaId`, `ComplianceId`, `AssetList` |

## Blocked destructive actions (23)

`ModifyDSPAAssessmentRisk`, `ModifyDSPACategoryRelation`, `ModifyDSPAAssessmentRiskLatest`, `DeleteDSPACOSDiscoveryTaskResult`, `ModifyDSPACOSDiscoveryTask`, `DeleteDSPAMetaResource`, `DeleteCosMetaResource`, `ModifyDSPAComplianceGroup`, `ModifyDSPAAssessmentRiskTemplate`, `ModifyDSPADiscoveryTask`, `DeleteDSPACOSDiscoveryTask`, `ModifyDSPAESTaskResult`, `ModifyDSPATaskResult`, `DeleteDSPAAssessmentTask`, `ModifyDSPAClusterInfo`, `ModifyDSPACOSTaskResult`, `RestartDSPAAssessmentTask`, `DeleteDSPADiscoveryTask`, `ModifyDSPAAssessmentRiskLevel`, `StopDSPADiscoveryTask`, `ModifyDSPACategory`, `ModifyDSPADiscoveryRule`, `DeleteDSPADiscoveryTaskResult` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dsgc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190723` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dsgc"`) for the allow/block decision and reason.

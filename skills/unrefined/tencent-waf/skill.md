---
name: tencent-waf
description: Tencent Cloud WAF via the Tencent MCP server — 225 actions in API version v20180125 (97 read-only auto-allowed). Use for white, custom, access, domain, batch, attack. Triggers on mentions of waf, white, custom, access, domain, batch, attack, owasp, anti. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud WAF

Security & identity: 225 actions in API version `v20180125` — 97 read-only (auto-allowed), 41 gated mutations, 87 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "waf"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/waf/v20180125 — action signatures in `waf_client.ts`, full request/response shapes in `waf_models.ts`.

## Read actions (auto-allowed, 97)

| Action | What it does |
|---|---|
| `DescribeAttackType` | Describe attack type<br>Required: `FromTime`, `ToTime` |
| `DescribePeakPoints` | Describe peak points<br>Required: `FromTime`, `ToTime` |
| `DescribeDomainDetailsClb` | Describe domain details clb<br>Required: `Domain`, `DomainId`, `InstanceId` |
| `DescribeExports` | Describe exports<br>Required: `TopicId` |
| `DescribeAccessIndex` | Describe access index |
| `GetAttackTotalCount` | Get attack total count<br>Required: `StartTime`, `EndTime`, `Domain`, `QueryString` |
| `DescribeAreaBanAreas` | Describe area ban areas<br>Required: `Domain` |
| `QueryClientMsg` | Query client msg<br>Required: `Domain` |
| `DescribeApiListVersionTwo` | Describe api list version two<br>Required: `Domain`, `PageIndex`, `PageSize` |
| `DescribeSpartaProtectionInfo` | Describe sparta protection info<br>Required: `Domain` |
| `DescribeAutoDenyIP` | Describe auto deny ip<br>Required: `Domain` |
| `GetAttackDownloadRecords` | Get attack download records |
| `DescribeApiDetail` | Describe api detail<br>Required: `Domain`, `ApiName`, `Method` |
| `DescribeScanIp` | Describe scan ip<br>Required: `Ip` |
| `DescribeApiAggregateTopN` | Describe api aggregate top n<br>Required: `Domain`, `TopN` (default 5), `StartTs`, `EndTs`, `Dimension` |
| `DescribeTopics` | Describe topics |
| `DescribeUserDomainInfo` | Describe user domain info |
| `DescribeAntiInfoLeakageRules` | Describe anti info leakage rules<br>Required: `Domain` |
| `SearchAccessLog` | Search access log<br>Required: `TopicId`, `From`, `To`, `Query` |
| `DescribeWafThreatenIntelligence` | Describe waf threaten intelligence |
| `DescribeBotSceneUCBRule` | Describe bot scene ucbrule<br>Required: `Domain`, `Skip`, `Limit`, `Sort`, `SceneId` |
| `DescribeIpHitItems` | Describe ip hit items<br>Required: `Domain`, `Count`, `Category` |
| `DescribeHistogram` | Describe histogram<br>Required: `FromTime`, `ToTime`, `QueryField`, `Source` |
| `DescribeWebshellStatus` | Describe webshell status<br>Required: `Domain` |
| `DescribeAreaBanSupportAreas` | Describe area ban support areas |
| `DescribeRuleLimit` | Describe rule limit<br>Required: `Domain` |
| `DescribeApiSecEventDetail` | Describe api sec event detail |
| `DescribeDomains` | Describe domains<br>Required: `Offset`, `Limit` |
| `GetAttackHistogram` | Get attack histogram<br>Required: `Domain`, `StartTime`, `EndTime`, `QueryString` |
| `DescribeUserSignatureRuleV2` | Describe user signature rule v2<br>Required: `Domain`, `Offset`, `Limit` |
| `DescribePostCKafkaFlows` | Describe post ckafka flows |
| `DescribeVipInfo` | Describe vip info<br>Required: `InstanceIds` |
| `DescribeAccessFastAnalysis` | Describe access fast analysis<br>Required: `From`, `To`, `Query`, `FieldName` |
| `DescribeCertificateVerifyResult` | Describe certificate verify result<br>Required: `Domain` |
| `DescribeDomainDetailsSaas` | Describe domain details saas<br>Required: `Domain`, `DomainId`, `InstanceId` |
| `DescribeCCRule` | Describe ccrule<br>Required: `Domain`, `Offset`, `Limit` |
| `DescribeBatchCustomRuleList` | Describe batch custom rule list<br>Required: `Offset`, `Limit`, `By`, `Order`, `DataType`, `Filters` |
| `DescribePeakValue` | Describe peak value<br>Required: `FromTime`, `ToTime` |
| `DescribeApiSecSensitiveRuleList` | Describe api sec sensitive rule list<br>Required: `Domain` |
| `DescribeLogHistogram` | Describe log histogram<br>Required: `From`, `To`, `Query` |
| `DescribeOwaspRuleTypes` | Describe owasp rule types<br>Required: `Domain` |
| `DescribeCustomRuleList` | Describe custom rule list<br>Required: `Domain`, `Offset`, `Limit` |
| `DescribeAttackOverview` | Describe attack overview<br>Required: `FromTime`, `ToTime` |
| `GetOrganizationRole` | Get organization role |
| `DescribeApiSecEventList` | Describe api sec event list<br>Required: `Domain` |
| `DescribeHosts` | Describe hosts |
| `DescribePolicyStatus` | Describe policy status<br>Required: `Domain`, `Edition` |
| `DescribeBotSceneList` | Describe bot scene list<br>Required: `Domain`, `Limit`, `Offset` |
| `DescribeTopAttackDomain` | Describe top attack domain<br>Required: `FromTime`, `ToTime` |
| `DescribeUserSignatureClass` | Describe user signature class<br>Required: `Domain` |
| `DescribeProtectGroup` | Describe protect group |
| `DescribeCiphersDetail` | Describe ciphers detail |
| `DescribeOwaspWhiteRules` | Describe owasp white rules<br>Required: `Domain` |
| `DescribeAntiFakeRules` | Describe anti fake rules<br>Required: `Domain`, `Offset`, `Limit` |
| `DescribeFindDomainList` | Describe find domain list<br>Required: `Offset`, `Limit`, `Key`, `IsWafDomain` |
| `DescribePostCLSFlows` | Describe post clsflows |
| `DescribeAccessHistogram` | Describe access histogram<br>Required: `TopicId`, `From`, `To`, `Query` |
| `DescribeTlsVersion` | Describe tls version |
| `DescribeFlowTrend` | Describe flow trend<br>Required: `Domain`, `StartTs`, `EndTs` |
| `DescribeProtectionModes` | Describe protection modes<br>Required: `Edition`, `Domain` |
| `DescribeQClawContentSecCheck` | Describe qclaw content sec check<br>Required: `ServiceId` |
| `DescribeUserClbWafRegions` | Describe user clb waf regions |
| `DescribeObjects` | Describe objects |
| `DescribeIpAccessControl` | Describe ip access control<br>Required: `Domain`, `Count` |
| `DescribeBotSceneOverview` | Describe bot scene overview<br>Required: `Domain` |
| `DescribeDomainCountInfo` | Describe domain count info |
| `SearchLog` | Search log<br>Required: `From`, `To`, `Query` |
| `QueryBypassAllStatus` | Query bypass all status |
| `DescribeBatchIpAccessControl` | Describe batch ip access control<br>Required: `Filters` |
| `DescribeRateLimitsV2` | Describe rate limits v2<br>Required: `Domain` |
| `DescribeWafAutoDenyRules` | Describe waf auto deny rules<br>Required: `Domain` |
| `DescribeSkillSecScanResult` | Describe skill sec scan result<br>Required: `ServiceId`, `ContentHash` (format `sha256…`) |
| `DescribeOwaspRules` | Describe owasp rules<br>Required: `Domain` |
| `DescribeDomainWhiteRules` | Describe domain white rules<br>Required: `Domain` |
| `DescribeCustomWhiteRule` | Describe custom white rule<br>Required: `Domain`, `Offset`, `Limit` |
| `DescribeHost` | Describe host<br>Required: `Domain`, `DomainId` |
| `DescribeAccessExports` | Describe access exports<br>Required: `TopicId` |
| `DescribeHostLimit` | Describe host limit<br>Required: `Domain` |
| `GetInstanceQpsLimit` | Get instance qps limit<br>Required: `InstanceId` |
| `DescribeAreaBanRule` | Describe area ban rule<br>Required: `Domain` |
| `DescribeBatchCustomWhiteRules` | Describe batch custom white rules |
| `DescribeDomainVerifyResult` | Describe domain verify result<br>Required: `Domain`, `InstanceID` |
| `SearchAttackLog` | Search attack log<br>Required: `Domain`, `StartTime`, `EndTime`, `Context`, `QueryString` |
| `DescribeInstances` | Describe instances<br>Required: `Offset`, `Limit` |
| `DescribeUserLevel` | Describe user level<br>Required: `Domain` |
| `DescribeLLMContentSecCheck` | Describe llmcontent sec check<br>Required: `ServiceId`, `Type`, `InstanceId` |
| `DescribeUserCdcClbWafRegions` | Describe user cdc clb waf regions |
| `DescribeWafAutoDenyStatus` | Describe waf auto deny status |
| `DescribeSession` | Describe session<br>Required: `Domain` |
| `DescribeBotIdRule` | Describe bot id rule<br>Required: `Domain`, `SceneId` |
| `DescribePorts` | Describe ports |
| `DescribeModuleStatus` | Describe module status<br>Required: `Domain` |
| `DescribeCCRuleList` | Describe ccrule list<br>Required: `Domain`, `Offset`, `Limit`, `By` |
| `DescribeCCAutoStatus` | Describe ccauto status<br>Required: `Domain` |
| `DescribeUserSignatureRule` | Describe user signature rule<br>Required: `Domain`, `Offset`, `Limit` |
| `DescribeDomainRules` | Describe domain rules |
| `DescribeAttackWhiteRule` | Describe attack white rule<br>Required: `Domain`, `Offset`, `Limit` |
## Mutations (gated — need allowlist, 41)

| Action | What it does |
|---|---|
| `AddAntiInfoLeakRules` | Add anti info leak rules<br>Required: `Domain`, `Name`, `ActionType`, `Strategies` |
| `ImportIpAccessControl` | Import ip access control<br>Required: `Data`, `Domain`, `SourceType` |
| `AddCustomWhiteRule` | Add custom white rule<br>Required: `Name`, `SortId`, `Strategies`, `Domain`, `Bypass` |
| `UploadSkillSecScan` | Upload skill sec scan<br>Required: `ServiceId`, `FileData` |
| `CreatePostCKafkaFlow` | Create post ckafka flow<br>Required: `CKafkaRegion`, `CKafkaID`, `Brokers`, `Compression` (default none), `VipType`, `LogType`, `Topic`, `KafkaVersion` |
| `AddBypassAllRule` | Add bypass all rule |
| `CreateExport` | Create export<br>Required: `TopicId`, `Count`, `Query`, `From`, `To` |
| `GenerateDealsAndPayNew` | Generate deals and pay new<br>Required: `Goods` |
| `CreateOwaspWhiteRule` | Create owasp white rule<br>Required: `Name`, `Domain`, `Strategies`, `Ids`, `Type`, `JobType`, `JobDateTime`, `ExpireTime` |
| `CreateDeals` | Create deals<br>Required: `Goods` |
| `AddBatchCustomWhiteRule` | Add batch custom white rule<br>Required: `Name`, `SortId`, `Strategies`, `Bypass`, `JobType`, `JobDateTime` |
| `UpsertIpAccessControl` | Run upsert ip access control<br>Required: `Domain`, `Items` |
| `CreatePostCLSFlow` | Create post clsflow |
| `EnableRateLimitsV2` | Enable rate limits v2<br>Required: `Domain`, `EnableItems` |
| `CreateAreaBanRule` | Create area ban rule<br>Required: `Domain`, `Areas`, `JobType`, `JobDateTime`, `Lang` (default cn) |
| `EnableClientMsg` | Enable client msg<br>Required: `Status`, `Domain` |
| `SwitchElasticMode` | Switch elastic mode<br>Required: `Edition`, `Mode` |
| `AddSpartaProtection` | Add sparta protection<br>Required: `Domain`, `CertType`, `IsCdn`, `UpstreamType`, `IsWebsocket`, `LoadBalance`, `Ports`, `IsKeepAlive`, `InstanceID` |
| `AddBatchCustomRule` | Add batch custom rule<br>Required: `Name`, `ExpireTime`, `SortId`, `ActionType`, `Redirect`, `Bypass`, `Remark`, `EventId`, `Domains`, `Strategies` |
| `CreateBatchIpAccessControl` | Create batch ip access control<br>Required: `IpList`, `JobType`, `JobDateTime`, `ActionType` |
| `CreateIpAccessControl` | Create ip access control<br>Required: `Domain`, `IpList`, `ActionType` |
| `AddAntiFakeUrl` | Add anti fake url<br>Required: `Domain`, `Name`, `Uri` |
| `CreateRateLimitV2` | Create rate limit v2<br>Required: `Domain`, `Name`, `Priority`, `Status`, `LimitWindow`, `LimitObject`, `LimitStrategy` |
| `CreateProtectGroup` | Create protect group<br>Required: `Name`, `Domains` |
| `AddAttackWhiteRule` | Add attack white rule<br>Required: `Domain`, `Status`, `Rules` |
| `AddAreaBanAreas` | Add area ban areas<br>Required: `Domain`, `Areas` |
| `UpdateProtectionModes` | Update protection modes<br>Required: `Domain`, `Edition`, `TypeIDs`, `Mode` |
| `SwitchDomainRules` | Switch domain rules |
| `UpsertCCAutoStatus` | Run upsert ccauto status<br>Required: `Domain`, `Value` |
| `GenerateLLMSecAnswer` | Generate llmsec answer<br>Required: `Message`, `MsgID` |
| `CreateAccessExport` | Create access export<br>Required: `TopicId`, `From`, `To`, `Query`, `Count` |
| `AddCustomRule` | Add custom rule<br>Required: `Name`, `SortId` (default 0), `Strategies`, `Domain`, `ActionType` |
| `UpdateRateLimitV2` | Update rate limit v2<br>Required: `Domain`, `LimitRuleId`, `Name`, `Priority`, `Status`, `LimitObject`, `LimitStrategy` |
| `PostAttackDownloadTask` | Run post attack download task<br>Required: `Domain`, `StartTime`, `EndTime`, `QueryString`, `TaskName` |
| `UpsertCCRule` | Run upsert ccrule<br>Required: `Domain`, `Name`, `Status`, `Advance`, `Limit`, `Interval`, `ActionType`, `Priority`, `ValidTime` |
| `CreateHost` | Create host<br>Required: `Host` |
| `UpsertSession` | Run upsert session<br>Required: `Domain`, `Source`, `Category`, `KeyOrStartMat`, `EndMat`, `StartOffset`, `EndOffset` |
| `BatchOperateUserSignatureRules` | Run batch operate user signature rules<br>Required: `Domain`, `Status` |
| `FreshAntiFakeUrl` | Run fresh anti fake url<br>Required: `Domain`, `Id` |
| `RefreshAccessCheckResult` | Refresh access check result<br>Required: `Domain` |
| `AddDomainWhiteRule` | Add domain white rule |

## Blocked destructive actions (87)

`DeleteBatchCustomRule`, `ModifyBatchCustomRule`, `DeleteIpAccessControl`, `DeleteOwaspWhiteRule`, `ModifyUserSignatureRule`, `ModifyOwaspRuleTypeLevel`, `ModifyCustomRule`, `ModifyHostFlowMode`, `ModifyInstanceQpsLimit`, `DeleteCustomWhiteRule`, `DeleteOwaspRuleStatus`, `DeleteCustomRule`, `ModifyAntiFakeUrl`, `ModifySpartaProtection`, `ModifyInstanceElasticMode`, `ModifyWafAutoDenyRules`, `ModifyObjects`, `DeleteCCRule`, `DeleteProtectGroupDomain`, `ModifyBatchCustomWhiteRule`, `RemoveBypassAllRule`, `ModifyApiAnalyzeStatus`, `DeleteAntiInfoLeakRule`, `ModifyAreaBanAreas`, `ModifyOwaspRuleStatus`, `ModifyInstanceAttackLogPost`, `ModifyBotIdRule`, `ModifyHostStatus`, `ModifyBotSceneUCBRule`, `DeleteBatchCustomWhiteRule`, `ModifyDomainsCLSStatus`, `DeleteBatchIpAccessControl`, `DeleteHost`, `ModifyCustomWhiteRule`, `DeleteIpAccessControlV2`, `ModifyInstanceRenewFlag`, `ModifyOwaspDomainUpdateStatus`, `DeleteAttackDownloadRecord`, `ModifyOwaspRuleTypeAction`, `ModifyOwaspWhiteRule`, `ModifyBatchCustomRuleStatus`, `ModifyBotSceneStatus`, `ModifyWafThreatenIntelligence`, `ModifyHost`, `ModifyBatchIpAccessControl`, `ModifyBotStatus`, `ModifyProtectionStatus`, `ModifyAreaBanStatus`, `ModifyIpAccessControl`, `ModifyAntiFakeUrlStatus`, `ModifyAntiInfoLeakRules`, `ModifyDomainWhiteRule`, `ModifyCustomRuleStatus`, `DeleteAttackWhiteRule`, `ModifyProtectionLevel`, `DeleteSpartaProtection`, `ModifyOwaspRuleTypeStatus`, `DestroyPostCLSFlow`, `ModifySpartaProtectionMode`, `DeleteSession`, `ModifyWebshellStatus`, `ModifyAntiInfoLeakRuleStatus`, `DestroyPostCKafkaFlow`, `DeleteExport`, `ModifyUserSignatureRuleV2`, `DeleteAccessExport`, `DeleteDomainWhiteRules`, `ModifyAttackWhiteRule`, `DeleteProtectGroup`, `ModifyGenerateDeals`, `ModifyInstanceName`, `ModifyModuleStatus`, `ModifyAreaBanRule`, `DeleteRateLimitsV2`, `ModifyCustomWhiteRuleStatus`, `ModifyProtectGroup`, `ModifyHostMode`, `ModifyDomainPostAction`, `ModifyObject`, `DeleteAntiFakeUrl`, `DeleteBotSceneUCBRule`, `ModifyApiSecSensitiveRule`, `ModifyApiSecEventChange`, `ModifyUserSignatureClass`, `ModifyDomainIpv6Status`, `ModifyBatchCustomWhiteRuleStatus`, `ModifyUserLevel` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `waf`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180125` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="waf"`) for the allow/block decision and reason.

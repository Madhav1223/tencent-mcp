---
name: tencent-ccc
description: Tencent Cloud CCC via the Tencent MCP server — 84 actions in API version v20200210 (35 read-only auto-allowed). Use for dialing, campaign, staff, call, number, predictive. Triggers on mentions of ccc, dialing, campaign, staff, call, number, predictive, auto, callout. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CCC

General service: 84 actions in API version `v20200210` — 35 read-only (auto-allowed), 38 gated mutations, 11 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ccc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ccc/v20200210 — action signatures in `ccc_client.ts`, full request/response shapes in `ccc_models.ts`.

## Read actions (auto-allowed, 35)

| Action | What it does |
|---|---|
| `DescribeAIAnalysisResult` | Describe aianalysis result<br>Required: `SdkAppId`, `SessionId`, `StartTime`, `EndTime` |
| `DescribeExtensions` | Describe extensions<br>Required: `SdkAppId`, `PageNumber` |
| `DescribeAILatency` | Describe ailatency<br>Required: `SdkAppId`, `SessionId`, `StartTime`, `EndTime` |
| `DescribeAutoCalloutTasks` | Describe auto callout tasks<br>Required: `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeAgentCruiseDialingCampaign` | Describe agent cruise dialing campaign<br>Required: `SdkAppId`, `CampaignId` |
| `DescribePredictiveDialingCampaign` | Describe predictive dialing campaign<br>Required: `SdkAppId`, `CampaignId` |
| `DescribePSTNActiveSessionList` | Describe pstnactive session list<br>Required: `SdkAppId`, `Offset`, `Limit` |
| `DescribeChatMessages` | Describe chat messages<br>Required: `SdkAppId` |
| `DescribeStaffStatusHistory` | Describe staff status history<br>Required: `SdkAppId`, `StaffUserId`, `StartTimestamp`, `EndTimestamp` |
| `DescribeIMCdrs` | Describe imcdrs<br>Required: `StartTimestamp`, `EndTimestamp` |
| `DescribeIvrAudioList` | Describe ivr audio list<br>Required: `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeTelCallInfo` | Describe tel call info<br>Required: `StartTimeStamp`, `EndTimeStamp`, `SdkAppIdList` |
| `DescribeExtension` | Describe extension<br>Required: `SdkAppId`, `ExtensionId` |
| `DescribeCarrierPrivilegeNumberApplicants` | Describe carrier privilege number applicants<br>Required: `SdkAppId` |
| `DescribeFlashSMSList` | Describe flash smslist<br>Required: `SdkAppId`, `StartTimestamp`, `EndTimestamp` |
| `DescribeTelSession` | Describe tel session<br>Required: `SdkAppId`, `SessionId` |
| `DescribePredictiveDialingCampaigns` | Describe predictive dialing campaigns<br>Required: `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeAutoCalloutTask` | Describe auto callout task<br>Required: `SdkAppId`, `TaskId` |
| `DescribePredictiveDialingSessions` | Describe predictive dialing sessions<br>Required: `SdkAppId`, `CampaignId`, `PageSize`, `PageNumber` |
| `DescribeTelCdr` | Describe tel cdr<br>Required: `StartTimeStamp`, `EndTimeStamp`, `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeSkillGroupInfoList` | Describe skill group info list<br>Required: `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeSessionDetail` | Describe session detail<br>Required: `SdkAppId`, `SessionId`, `StartTimestamp`, `EndTimestamp` |
| `DescribeAICallExtractResult` | Describe aicall extract result<br>Required: `SdkAppId`, `SessionId`, `StartTime`, `EndTime` |
| `DescribeAIAgentInfoList` | Describe aiagent info list<br>Required: `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeCCCBuyInfoList` | Describe cccbuy info list |
| `DescribeStaffInfoList` | Describe staff info list<br>Required: `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeStaffStatusMetrics` | Describe staff status metrics<br>Required: `SdkAppId` |
| `DescribeTelRecordAsr` | Describe tel record asr<br>Required: `SdkAppId`, `SessionId` |
| `DescribeAICallInteractionRecords` | Describe aicall interaction records<br>Required: `SdkAppId`, `SessionId` |
| `DescribeProtectedTelCdr` | Describe protected tel cdr<br>Required: `StartTimeStamp`, `EndTimeStamp`, `SdkAppId`, `PageSize`, `PageNumber` |
| `DescribeIMCdrList` | Describe imcdr list<br>Required: `SdkAppId`, `StartTimestamp`, `EndTimestamp` |
| `DescribeCallInMetrics` | Describe call in metrics<br>Required: `SdkAppId` |
| `DescribeActiveCarrierPrivilegeNumber` | Describe active carrier privilege number<br>Required: `SdkAppId` |
| `DescribeNumbers` | Describe numbers<br>Required: `SdkAppId` |
| `DescribeCompanyList` | Describe company list<br>Required: `PageSize`, `PageNumber` |
## Mutations (gated — need allowlist, 38)

| Action | What it does |
|---|---|
| `TransferToManual` | Transfer to manual<br>Required: `SdkAppId`, `SessionId`, `SkillGroupId` |
| `PlaySoundCall` | Play sound call<br>Required: `SdkAppId`, `SessionId` |
| `PauseAutoCalloutTask` | Pause auto callout task<br>Required: `TaskId`, `SdkAppId` |
| `AbortAgentCruiseDialingCampaign` | Abort agent cruise dialing campaign<br>Required: `SdkAppId`, `CampaignId` |
| `CreateAICall` | Create aicall<br>Required: `SdkAppId`, `Callee`, `LLMType`, `APIKey`, `APIUrl` |
| `BindStaffSkillGroupList` | Bind staff skill group list<br>Required: `SdkAppId`, `StaffEmail`, `StaffSkillGroupList` |
| `BindNumberCallOutSkillGroup` | Bind number call out skill group<br>Required: `SdkAppId`, `Number`, `SkillGroupIds` |
| `DisableCCCPhoneNumber` | Disable cccphone number<br>Required: `PhoneNumbers`, `Disabled` |
| `CreateExtension` | Create extension<br>Required: `SdkAppId`, `ExtensionId`, `ExtensionName` |
| `SetStaffStatus` | Set staff status<br>Required: `SdkAppId`, `StaffStatusList` |
| `UploadIvrAudio` | Upload ivr audio<br>Required: `SdkAppId`, `AudioList` |
| `CreateCallOutSession` | Create call out session<br>Required: `SdkAppId`, `UserId`, `Callee` |
| `CreateCompanyApply` | Create company apply<br>Required: `CompanyInfo` |
| `ControlAIConversation` | Run control aiconversation<br>Required: `SessionId`, `SdkAppId` |
| `UnbindNumberCallOutSkillGroup` | Unbind number call out skill group<br>Required: `SdkAppId`, `Number`, `SkillGroupIds` |
| `CreatePredictiveDialingCampaign` | Create predictive dialing campaign<br>Required: `SdkAppId`, `Name`, `Callees`, `Callers`, `CallOrder`, `SkillGroupId`, `Priority`, `ExpectedAbandonRate`, `RetryInterval`, `StartTime`, `EndTime` |
| `CreateCarrierPrivilegeNumberApplicant` | Create carrier privilege number applicant<br>Required: `SdkAppId`, `Callers` (format `0086xxxx…`), `Callees` (format `0086xxxx…`) |
| `CreateAgentCruiseDialingCampaign` | Create agent cruise dialing campaign<br>Required: `SdkAppId`, `Name`, `Agent`, `ConcurrencyNumber`, `StartTime`, `EndTime` |
| `CreateOwnNumberApply` | Create own number apply<br>Required: `SdkAppId`, `SipTrunkId`, `DetailList` |
| `ResumePredictiveDialingCampaign` | Resume predictive dialing campaign<br>Required: `SdkAppId`, `CampaignId` |
| `CreateCCCSkillGroup` | Create cccskill group<br>Required: `SdkAppId`, `SkillGroupName`, `SkillGroupType` |
| `UnbindStaffSkillGroupList` | Unbind staff skill group list<br>Required: `SdkAppId`, `StaffEmail`, `SkillGroupList` |
| `BindNumberCallInInterface` | Bind number call in interface<br>Required: `SdkAppId`, `Number` |
| `CreateStaff` | Create staff<br>Required: `SdkAppId`, `Staffs` |
| `CreateIVRSession` | Create ivrsession<br>Required: `SdkAppId`, `Callee`, `IVRId` |
| `CreateAutoCalloutTask` | Create auto callout task<br>Required: `SdkAppId`, `NotBefore`, `Callees`, `Callers` |
| `UpdateCCCSkillGroup` | Update cccskill group<br>Required: `SdkAppId`, `SkillGroupID` |
| `CreateUserSig` | Create user sig<br>Required: `SdkAppId`, `Uid`, `ClientData`, `ExpiredTime` |
| `HangUpCall` | Run hang up call<br>Required: `SdkAppId`, `SessionId` |
| `PausePredictiveDialingCampaign` | Pause predictive dialing campaign<br>Required: `SdkAppId`, `CampaignId` |
| `CreateAdminURL` | Create admin url<br>Required: `SdkAppId`, `SeatUserId` |
| `ForceMemberOffline` | Run force member offline<br>Required: `SdkAppId`, `UserId` |
| `CreateSDKLoginToken` | Create sdklogin token<br>Required: `SdkAppId`, `SeatUserId` |
| `ResumeAutoCalloutTask` | Resume auto callout task<br>Required: `TaskId`, `SdkAppId` |
| `AbortPredictiveDialingCampaign` | Abort predictive dialing campaign<br>Required: `SdkAppId`, `CampaignId` |
| `CreateAIAgentCall` | Create aiagent call<br>Required: `SdkAppId`, `AIAgentId`, `Callee` |
| `RestoreMemberOnline` | Restore member online<br>Required: `SdkAppId`, `UserId` |
| `UpdatePredictiveDialingCampaign` | Update predictive dialing campaign<br>Required: `SdkAppId`, `CampaignId`, `Name`, `Callees`, `Callers`, `CallOrder`, `SkillGroupId`, `Priority`, `ExpectedAbandonRate`, `RetryInterval`, `StartTime`, `EndTime` |

## Blocked destructive actions (11)

`ModifyCompanyApply`, `DeleteCCCSkillGroup`, `ModifyOwnNumberApply`, `StopAutoCalloutTask`, `DeleteExtension`, `DeleteStaff`, `ResetExtensionPassword`, `ModifyStaff`, `ModifyStaffPassword`, `ModifyExtension`, `DeletePredictiveDialingCampaign` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ccc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200210` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ccc"`) for the allow/block decision and reason.

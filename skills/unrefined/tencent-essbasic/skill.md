---
name: tencent-essbasic
description: Tencent Cloud ESSBASIC via the Tencent MCP server — 101 actions in API version v20210526 (15 read-only auto-allowed). Use for channel, create, sign, organization, batch, auto. Triggers on mentions of essbasic, channel, create, sign, organization, batch, auto, describe, seal. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud ESSBASIC

Security & identity: 101 actions in API version `v20210526` — 15 read-only (auto-allowed), 80 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "essbasic"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/essbasic/v20210526 — action signatures in `essbasic_client.ts`, full request/response shapes in `essbasic_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeExtendedServiceAuthInfo` | Describe extended service auth info<br>Required: `Agent` |
| `DescribeBatchOrganizationRegistrationUrls` | Describe batch organization registration urls<br>Required: `Agent`, `TaskId` |
| `DescribeBatchOrganizationRegistrationTasks` | Describe batch organization registration tasks<br>Required: `Agent` |
| `DescribeFileConvertTask` | Describe file convert task<br>Required: `TaskId`, `Agent` |
| `DescribeUsage` | Describe usage<br>Required: `Agent`, `StartDate` (format `yyyy-mm-dd…`), `EndDate` (format `yyyy-mm-dd…`) |
| `DescribeChannelSealPolicyWorkflowUrl` | Describe channel seal policy workflow url<br>Required: `Agent`, `WorkflowInstanceId` |
| `GetDownloadFlowUrl` | Get download flow url<br>Required: `Agent` |
| `DescribeExtendedServiceAuthDetail` | Describe extended service auth detail<br>Required: `Agent`, `ExtendServiceType` |
| `DescribeResourceUrlsByFlows` | Describe resource urls by flows<br>Required: `Agent` |
| `DescribeChannelOrganizations` | Describe channel organizations<br>Required: `Agent`, `Limit` |
| `DescribeTemplates` | Describe templates<br>Required: `Agent` |
| `DescribeUserFlowType` | Describe user flow type<br>Required: `Agent` |
| `DescribeFlowDetailInfo` | Describe flow detail info<br>Required: `Agent` |
| `DescribeCancelFlowsTask` | Describe cancel flows task<br>Required: `Agent`, `TaskId` |
| `DescribeChannelFlowEvidenceReport` | Describe channel flow evidence report<br>Required: `Agent`, `ReportId` |
## Mutations (gated — need allowlist, 80)

| Action | What it does |
|---|---|
| `ChannelCreateFlowSignReview` | Run channel create flow sign review<br>Required: `Agent`, `FlowId`, `ReviewType` |
| `ChannelModifyRole` | Run channel modify role<br>Required: `Agent`, `Name`, `RoleId` |
| `CreateFlowGroupSignReview` | Create flow group sign review<br>Required: `Agent`, `FlowGroupId`, `ReviewType`, `ApproverInfo` |
| `ChannelCancelMultiFlowSignQRCode` | Run channel cancel multi flow sign qrcode<br>Required: `Agent`, `QrCodeId` |
| `CreateFileConvertTask` | Create file convert task<br>Required: `Agent`, `ResourceType`, `ResourceName`, `ResourceId` |
| `ChannelDescribeSignFaceVideo` | Run channel describe sign face video<br>Required: `FlowId`, `SignId`, `Agent` |
| `ChannelDeleteRoleUsers` | Run channel delete role users<br>Required: `Agent`, `RoleId` |
| `CreateSignUrls` | Create sign urls<br>Required: `Agent` |
| `ChannelCreateBoundFlows` | Run channel create bound flows<br>Required: `Agent` |
| `CreatePartnerAutoSignAuthUrl` | Create partner auto sign auth url<br>Required: `Agent` |
| `ChannelCreateWebThemeConfig` | Run channel create web theme config<br>Required: `Agent`, `ThemeType`, `WebThemeConfig` |
| `ChannelCreateFlowReminds` | Run channel create flow reminds<br>Required: `Agent`, `FlowIds` |
| `ChannelBatchCancelFlows` | Run channel batch cancel flows<br>Required: `Agent`, `FlowIds` |
| `ChannelCreateFlowApprovers` | Run channel create flow approvers<br>Required: `Agent`, `Approvers` |
| `CreatePersonAuthCertificateImage` | Create person auth certificate image<br>Required: `Agent`, `UserName`, `IdCardType` (default HONGKONG_AND_MACAO), `IdCardNumber` |
| `CreateChannelFlowEvidenceReport` | Create channel flow evidence report<br>Required: `Agent`, `FlowId` |
| `ChannelCreatePreparedPersonalEsign` | Run channel create prepared personal esign<br>Required: `Agent`, `UserName`, `IdCardNumber`, `SealName` |
| `ChannelCreateFlowByFiles` | Run channel create flow by files |
| `CreateSealByImage` | Create seal by image<br>Required: `Agent`, `SealName` |
| `ChannelCreateConvertTaskApi` | Run channel create convert task api<br>Required: `Agent`, `ResourceType`, `ResourceName`, `ResourceId` |
| `ChannelCancelFlow` | Run channel cancel flow<br>Required: `FlowId` |
| `CreateFlowsByTemplates` | Create flows by templates<br>Required: `Agent`, `FlowInfos` |
| `ChannelCreateRole` | Run channel create role<br>Required: `Name`, `Agent` |
| `ChannelCreateOrganizationModifyQrCode` | Run channel create organization modify qr code<br>Required: `Agent` |
| `ChannelCreateDynamicFlowApprover` | Run channel create dynamic flow approver<br>Required: `FillDynamicFlowList` |
| `CreateLegalSealQrCode` | Create legal seal qr code |
| `ChannelVerifyPdf` | Run channel verify pdf<br>Required: `FlowId` |
| `ChannelDescribeOrganizationSeals` | Run channel describe organization seals<br>Required: `Agent` |
| `CreateCloseOrganizationUrl` | Create close organization url<br>Required: `Agent` |
| `PrepareFlows` | Run prepare flows<br>Required: `Agent`, `FlowInfos`, `JumpUrl` |
| `ChannelDescribeRoles` | Run channel describe roles<br>Required: `Agent`, `Limit` |
| `CreateBatchAdminChangeInvitationsUrl` | Create batch admin change invitations url<br>Required: `Agent` |
| `CreateBatchInitOrganizationUrl` | Create batch init organization url<br>Required: `Agent`, `OperateTypes`, `ProxyOrganizationOpenIds` |
| `CreateRequestWithEncryption` | Create request with encryption<br>Required: `RequestAction`, `ApplicationId`, `IV`, `EncryptedData` |
| `ChannelDescribeFlowComponents` | Run channel describe flow components<br>Required: `Agent`, `FlowId` |
| `ChannelDeleteSealPolicies` | Run channel delete seal policies<br>Required: `Agent`, `SealId`, `UserIds` |
| `ChannelCreateMultiFlowSignQRCode` | Run channel create multi flow sign qrcode<br>Required: `Agent`, `TemplateId`, `FlowName` |
| `OperateTemplate` | Run operate template<br>Required: `Agent`, `TemplateId`, `OperateType` |
| `CreateEmployeeChangeUrl` | Create employee change url<br>Required: `Agent` |
| `CreateFlowBlockchainEvidenceUrl` | Create flow blockchain evidence url<br>Required: `Agent`, `FlowId` |
| `CreateBatchOrganizationAuthorizationUrl` | Create batch organization authorization url<br>Required: `Agent` |
| `ChannelCreatePrepareFlowGroup` | Run channel create prepare flow group<br>Required: `BaseFlowInfos`, `FlowGroupName`, `ResourceType` |
| `ChannelCreateBatchQuickSignUrl` | Run channel create batch quick sign url<br>Required: `FlowApproverInfo` |
| `ChannelDisableUserAutoSign` | Run channel disable user auto sign<br>Required: `Agent`, `SceneKey`, `UserInfo` |
| `CreateBatchOrganizationRegistrationTasks` | Create batch organization registration tasks<br>Required: `Agent`, `RegistrationOrganizations` |
| `CreateEmployeeQualificationSealQrCode` | Create employee qualification seal qr code<br>Required: `Agent` |
| `ChannelGetTaskResultApi` | Run channel get task result api<br>Required: `Agent`, `TaskId` |
| `ChannelCreateUserAutoSignSealUrl` | Run channel create user auto sign seal url<br>Required: `Agent`, `SceneKey`, `UserInfo` |
| `CreateChannelSubOrganizationActive` | Create channel sub organization active<br>Required: `Agent` |
| `ChannelCancelUserAutoSignEnableUrl` | Run channel cancel user auto sign enable url<br>Required: `Agent`, `Operator`, `SceneKey`, `UserInfo` |
| `UploadFiles` | Upload files<br>Required: `Agent`, `BusinessType` |
| `CreateFlowForwards` | Create flow forwards<br>Required: `TargetOpenId`, `FlowForwardInfos`, `Agent` |
| `ChannelCreateFlowSignUrl` | Run channel create flow sign url<br>Required: `Agent`, `FlowId` |
| `CreateChannelOrganizationInfoChangeUrl` | Create channel organization info change url<br>Required: `Agent`, `ChangeType` |
| `ChannelCreateFlowGroupByFiles` | Run channel create flow group by files<br>Required: `FlowFileInfos`, `FlowGroupName` |
| `CreateModifyAdminAuthorizationUrl` | Create modify admin authorization url<br>Required: `Agent` |
| `ChannelDescribeBillUsageDetail` | Run channel describe bill usage detail<br>Required: `Agent`, `StartTime` (format `yyyymmdd…`), `EndTime` (format `yyyymmdd…`) |
| `ChannelDescribeAccountBillDetail` | Run channel describe account bill detail<br>Required: `Agent` |
| `ChannelCreateOrganizationBatchSignUrl` | Run channel create organization batch sign url<br>Required: `Agent` |
| `ChannelCreateSealPolicy` | Run channel create seal policy<br>Required: `Agent`, `SealId`, `UserIds` |
| `CreateConsoleLoginUrl` | Create console login url<br>Required: `Agent`, `ProxyOrganizationName` |
| `ChannelCreatePrepareFlow` | Run channel create prepare flow<br>Required: `ResourceType` (default 3), `FlowInfo` |
| `ChannelCreateBatchCancelFlowUrl` | Run channel create batch cancel flow url<br>Required: `Agent`, `FlowIds` |
| `ChannelDeleteRole` | Run channel delete role<br>Required: `Agent`, `RoleIds` |
| `SyncProxyOrganization` | Sync proxy organization<br>Required: `Agent`, `ProxyOrganizationName` |
| `ChannelUpdateSealStatus` | Run channel update seal status<br>Required: `Agent`, `Status`, `SealId` |
| `ChannelCreateBatchSignUrl` | Run channel create batch sign url<br>Required: `Agent` |
| `ChannelRenewAutoSignLicense` | Run channel renew auto sign license<br>Required: `Agent`, `SceneKey`, `UserInfo` |
| `ChannelDescribeUserAutoSignStatus` | Run channel describe user auto sign status<br>Required: `Agent`, `SceneKey`, `UserInfo` |
| `ChannelCreateReleaseFlow` | Run channel create release flow<br>Required: `Agent`, `NeedRelievedFlowId`, `ReliveInfo` |
| `ChannelDescribeEmployees` | Run channel describe employees<br>Required: `Agent`, `Limit` |
| `CreateBatchAdminChangeInvitations` | Create batch admin change invitations<br>Required: `Agent`, `AdminChangeInvitationInfos` |
| `ArchiveDynamicFlow` | Archive dynamic flow<br>Required: `Agent`, `FlowId` |
| `CreateOrganizationAuthFile` | Create organization auth file<br>Required: `Agent` |
| `ChannelCreateUserRoles` | Run channel create user roles<br>Required: `Agent`, `RoleIds` |
| `ChannelCreateFlowGroupByTemplates` | Run channel create flow group by templates<br>Required: `Agent`, `FlowInfos`, `FlowGroupName` |
| `OperateChannelTemplate` | Run operate channel template<br>Required: `Agent`, `OperateType`, `TemplateId` |
| `SyncProxyOrganizationOperators` | Sync proxy organization operators<br>Required: `Agent`, `OperatorType`, `ProxyOrganizationOperators` |
| `ChannelCreateEmbedWebUrl` | Run channel create embed web url<br>Required: `Agent`, `EmbedType` |
| `ChannelCreateUserAutoSignEnableUrl` | Run channel create user auto sign enable url<br>Required: `Agent`, `SceneKey` |

## Blocked destructive actions (6)

`ModifyOrganizationBusinessInfo`, `ModifyExtendedService`, `ModifyPartnerAutoSignAuthUrl`, `DeleteOrganizationAuthorizations`, `ModifyFlowDeadline`, `CancelOrganizationFlows` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `essbasic`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210526` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="essbasic"`) for the allow/block decision and reason.

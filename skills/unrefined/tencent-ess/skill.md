---
name: tencent-ess
description: Tencent Cloud ESS via the Tencent MCP server — 157 actions in API version v20201111 (49 read-only auto-allowed). Use for sign, contract, organization, review, integration, batch. Triggers on mentions of ess, sign, contract, organization, review, integration, batch, auth, auto. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud ESS

Security & identity: 157 actions in API version `v20201111` — 49 read-only (auto-allowed), 88 gated mutations, 20 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ess"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ess/v20201111 — action signatures in `ess_client.ts`, full request/response shapes in `ess_models.ts`.

## Read actions (auto-allowed, 49)

| Action | What it does |
|---|---|
| `DescribeEnterpriseContractReviewChecklists` | Describe enterprise contract review checklists<br>Required: `Operator` |
| `DescribeContractReviewTaskListWebUrl` | Describe contract review task list web url<br>Required: `Operator` |
| `DescribeContractReviewChecklist` | Describe contract review checklist<br>Required: `Operator`, `ChecklistId` |
| `DescribeBatchOrganizationRegistrationUrls` | Describe batch organization registration urls<br>Required: `Operator`, `TaskId` |
| `DescribeBatchOrganizationRegistrationTasks` | Describe batch organization registration tasks<br>Required: `Operator` |
| `DescribeExtendedServiceAuthInfos` | Describe extended service auth infos<br>Required: `Operator` |
| `DescribeRiskIdentificationTaskFeedback` | Describe risk identification task feedback<br>Required: `Operator` |
| `DescribeUserAutoSignStatus` | Describe user auto sign status<br>Required: `Operator`, `SceneKey`, `UserInfo` |
| `DescribeFlowTemplates` | Describe flow templates<br>Required: `Operator` |
| `DescribeIntegrationRoles` | Describe integration roles<br>Required: `Operator`, `Limit` |
| `DescribeFileConvertTask` | Describe file convert task<br>Required: `TaskId`, `Operator` |
| `DescribeContractReviewChecklistsWebUrl` | Describe contract review checklists web url<br>Required: `Operator` |
| `DescribeIntegrationEmployees` | Describe integration employees<br>Required: `Operator` |
| `ExportContractReviewMarkedRisk` | Export contract review marked risk<br>Required: `Operator`, `FromDate`, `ToDate` |
| `DescribeInformationExtractionTask` | Describe information extraction task<br>Required: `Operator` |
| `DescribeContractReviewWebUrl` | Describe contract review web url<br>Required: `Operator`, `TaskId` |
| `DescribeContractDiffTaskWebUrl` | Describe contract diff task web url<br>Required: `Operator`, `TaskId` |
| `DescribePersonCertificate` | Describe person certificate<br>Required: `Operator`, `UserInfo` |
| `DescribeOrganizationAuthStatus` | Describe organization auth status<br>Required: `Operator` |
| `DescribeContractReviewTask` | Describe contract review task<br>Required: `Operator`, `TaskId` |
| `ExportContractReviewResult` | Export contract review result<br>Required: `Operator`, `TaskId`, `FileType` |
| `DescribeSingleSignOnEmployees` | Describe single sign on employees<br>Required: `Operator`, `SsoApplicationId` |
| `DescribeExtendedServiceAuthDetail` | Describe extended service auth detail<br>Required: `Operator` |
| `DescribeFlowBriefs` | Describe flow briefs<br>Required: `Operator`, `FlowIds` |
| `DescribeSignFaceVideo` | Describe sign face video<br>Required: `Operator`, `FlowId`, `SignId` |
| `DescribeBillUsageDetail` | Describe bill usage detail<br>Required: `StartTime` (format `yyyymmdd…`), `EndTime` (format `yyyymmdd…`) |
| `DescribeIntegrationDepartments` | Describe integration departments<br>Required: `Operator`, `QueryType` |
| `DescribeContractReviewMarkedRiskExportTask` | Describe contract review marked risk export task<br>Required: `Operator`, `TaskId` |
| `DescribeOrganizationGroupOrganizations` | Describe organization group organizations<br>Required: `Operator`, `Limit`, `Offset` (default 0) |
| `ExportContractComparisonTask` | Export contract comparison task<br>Required: `Operator`, `TaskId` |
| `DescribeLMInformationExtractionTaskFieldFeedback` | Describe lminformation extraction task field feedback<br>Required: `Operator` |
| `DescribeFileUrls` | Describe file urls<br>Required: `Operator`, `BusinessType`, `BusinessIds` |
| `DescribeContractComparisonTask` | Describe contract comparison task<br>Required: `Operator`, `TaskId` |
| `DescribeInformationExtractionWebUrl` | Describe information extraction web url<br>Required: `Operator` |
| `DescribeUserVerifyStatus` | Describe user verify status<br>Required: `Operator`, `Name`, `IdCardNumber`, `IdCardType` (default HONGKONG_AND_MACAO) |
| `DescribeFlowComponents` | Describe flow components<br>Required: `Operator`, `FlowId` |
| `DescribeUserFlowType` | Describe user flow type<br>Required: `Operator` |
| `DescribeDraftContractByPromptsTask` | Describe draft contract by prompts task<br>Required: `Operator`, `TaskId` |
| `DescribeThirdPartyAuthCode` | Describe third party auth code<br>Required: `AuthCode` |
| `DescribeArchiveFlowTask` | Describe archive flow task<br>Required: `Operator`, `TaskId` |
| `DescribeBillUsage` | Describe bill usage<br>Required: `StartTime` (format `yyyymmdd…`), `EndTime` (format `yyyymmdd…`) |
| `DescribeFlowInfo` | Describe flow info |
| `DescribeCancelFlowsTask` | Describe cancel flows task<br>Required: `Operator`, `TaskId` |
| `DescribeOrganizationVerifyStatus` | Describe organization verify status |
| `DescribeFlowEvidenceReport` | Describe flow evidence report<br>Required: `Operator`, `ReportId` |
| `DescribeFileCounterSignResult` | Describe file counter sign result |
| `GetTaskResultApi` | Get task result api<br>Required: `TaskId` |
| `DescribeContractReviewChecklistWebUrl` | Describe contract review checklist web url<br>Required: `Operator`, `Id` |
| `DescribeOrganizationSeals` | Describe organization seals<br>Required: `Operator` |
## Mutations (gated — need allowlist, 88)

| Action | What it does |
|---|---|
| `StartFlow` | Start flow<br>Required: `Operator`, `FlowId` |
| `CreateContractComparisonTask` | Create contract comparison task<br>Required: `Operator`, `OriginFileResourceId`, `DiffFileResourceId` |
| `CreateUserAutoSignEnableUrl` | Create user auto sign enable url<br>Required: `Operator`, `SceneKey`, `AutoSignConfig` |
| `CreateContractDiffTaskWebUrl` | Create contract diff task web url<br>Required: `Operator`, `SkipFileUpload` |
| `CreateUserVerifyUrl` | Create user verify url<br>Required: `Operator` |
| `CreateEmbedWebUrl` | Create embed web url<br>Required: `Operator`, `EmbedType` |
| `CreatePreparedPersonalEsign` | Create prepared personal esign<br>Required: `UserName`, `IdCardNumber`, `SealName` |
| `CreateFileConvertTask` | Create file convert task<br>Required: `ResourceType`, `ResourceName`, `ResourceId`, `Operator` |
| `CreateFlowSignReview` | Create flow sign review<br>Required: `Operator`, `FlowId`, `ReviewType` |
| `CreateDocument` | Create document<br>Required: `Operator`, `TemplateId` |
| `CreateDraftContractByPromptsTask` | Create draft contract by prompts task<br>Required: `Operator`, `Requirement` |
| `CreateFlowGroupByTemplates` | Create flow group by templates<br>Required: `Operator`, `FlowGroupName`, `FlowGroupInfos` |
| `ImportContractReviewChecklist` | Import contract review checklist<br>Required: `Operator`, `Name`, `Categories` |
| `CreatePartnerAutoSignAuthUrl` | Create partner auto sign auth url |
| `CreateFlowForwards` | Create flow forwards<br>Required: `Operator`, `TargetUserId`, `FlowForwardInfos` |
| `CreatePersonAuthCertificateImage` | Create person auth certificate image<br>Required: `Operator`, `UserName`, `IdCardType` (default HONGKONG_AND_MACAO), `IdCardNumber` |
| `CreateFlowGroupSignReview` | Create flow group sign review<br>Required: `Operator`, `FlowGroupId`, `ReviewType`, `ApproverInfo` |
| `CreateIntegrationUserRoles` | Create integration user roles<br>Required: `Operator`, `UserIds`, `RoleIds` |
| `CreateBatchSignUrl` | Create batch sign url<br>Required: `Operator` |
| `CreateFlowReminds` | Create flow reminds<br>Required: `Operator`, `FlowIds` |
| `CreateUserNameChangeUrl` | Create user name change url<br>Required: `Operator` |
| `DisableUserAutoSign` | Disable user auto sign<br>Required: `Operator`, `SceneKey`, `UserInfo` |
| `CreateBatchContractReviewTask` | Create batch contract review task<br>Required: `Operator`, `ResourceIds` |
| `VerifyDigitalDataSign` | Verify digital data sign |
| `CreateUserAutoSignSealUrl` | Create user auto sign seal url<br>Required: `Operator`, `SceneKey`, `UserInfo` |
| `OperateFlowRemarks` | Run operate flow remarks<br>Required: `Operator`, `OperateType` |
| `VerifyPdf` | Verify pdf<br>Required: `FlowId` |
| `BindEmployeeUserIdWithClientOpenId` | Bind employee user id with client open id<br>Required: `Operator`, `UserId`, `OpenId` |
| `CreateOrganizationAuthFile` | Create organization auth file<br>Required: `OrganizationCommonInfo` |
| `CreateFlowGroupByFiles` | Create flow group by files<br>Required: `Operator`, `FlowGroupName`, `FlowGroupInfos` |
| `CreateIntegrationDepartment` | Create integration department<br>Required: `Operator`, `DeptName` |
| `CreateFlowEvidenceReport` | Create flow evidence report<br>Required: `Operator`, `FlowId` |
| `CreateFlow` | Create flow<br>Required: `Operator`, `FlowName`, `Approvers` |
| `CreateReleaseFlow` | Create release flow<br>Required: `Operator`, `NeedRelievedFlowId`, `ReliveInfo` |
| `CreateSingleSignOnEmployees` | Create single sign on employees<br>Required: `Operator`, `Employees`, `SsoApplicationId` |
| `CreateLegalSealQrCode` | Create legal seal qr code |
| `CreateSeal` | Create seal<br>Required: `Operator`, `SealName` |
| `CreateMultiFlowSignQRCode` | Create multi flow sign qrcode<br>Required: `Operator`, `TemplateId`, `FlowName` |
| `CreateOrganizationInfoChangeUrl` | Create organization info change url<br>Required: `Operator`, `ChangeType` |
| `ArchiveDynamicFlow` | Archive dynamic flow<br>Required: `Operator`, `FlowId` |
| `CreateFlowByFiles` | Create flow by files<br>Required: `Operator`, `FlowName`, `FileIds` |
| `CreateBatchAdminChangeInvitationsUrl` | Create batch admin change invitations url<br>Required: `Operator`, `NewAdminName` |
| `CreateFlowSignUrl` | Create flow sign url<br>Required: `FlowId` |
| `CreateBatchInitOrganizationUrl` | Create batch init organization url<br>Required: `Operator`, `OperateTypes`, `OrganizationIds` |
| `CreateRequestWithEncryption` | Create request with encryption<br>Required: `RequestAction`, `IV`, `EncryptedData` |
| `CreateUserMobileChangeUrl` | Create user mobile change url<br>Required: `Operator` |
| `CreateBatchInformationExtractionTask` | Create batch information extraction task<br>Required: `Operator`, `ResourceIds` |
| `OperateSeals` | Run operate seals |
| `CreateIntegrationRole` | Create integration role<br>Required: `Name`, `Operator` |
| `OperateTemplate` | Run operate template<br>Required: `Operator`, `TemplateId`, `OperateType` |
| `CreateEmployeeChangeUrl` | Create employee change url |
| `CreateFlowBlockchainEvidenceUrl` | Create flow blockchain evidence url<br>Required: `Operator`, `FlowId` |
| `CreateBatchOrganizationRegistrationTasks` | Create batch organization registration tasks<br>Required: `Operator`, `RegistrationOrganizations` |
| `CreateBatchOrganizationAuthorizationUrl` | Create batch organization authorization url<br>Required: `Operator`, `AdminName`, `AdminMobile` |
| `CreateEmployeeQualificationSealQrCode` | Create employee qualification seal qr code<br>Required: `Operator` |
| `CreateInformationExtractionWebUrl` | Create information extraction web url<br>Required: `Operator` |
| `CreateArchiveFlowTask` | Create archive flow task<br>Required: `Operator`, `ArchiveFlows` |
| `VerifyDigitFile` | Verify digit file |
| `CreateExtendedServiceAuthInfos` | Create extended service auth infos<br>Required: `Operator`, `UserIds` |
| `CreateMiniAppPrepareFlow` | Create mini app prepare flow<br>Required: `Operator`, `ResourceType`, `ResourceId`, `FlowName` |
| `CreateConvertTaskApi` | Create convert task api<br>Required: `ResourceType`, `ResourceName`, `ResourceId` |
| `CreateFlowGroupReminds` | Create flow group reminds<br>Required: `Operator`, `FlowGroupId` |
| `CreateLMInformationExtractionTaskFieldFeedback` | Create lminformation extraction task field feedback<br>Required: `Operator` |
| `CreateOrganizationAuthUrl` | Create organization auth url<br>Required: `Operator` |
| `UploadFiles` | Upload files<br>Required: `BusinessType` |
| `CreateIntegrationSubOrganizationActiveRecord` | Create integration sub organization active record<br>Required: `Operator`, `SubOrganizationIds` |
| `CreateWebThemeConfig` | Create web theme config<br>Required: `Operator`, `ThemeType`, `WebThemeConfig` |
| `CreateDynamicFlowApprover` | Create dynamic flow approver<br>Required: `Operator`, `FlowId`, `Approvers` |
| `CreateContractReviewChecklistWebUrl` | Create contract review checklist web url<br>Required: `Operator` |
| `CreateModifyAdminAuthorizationUrl` | Create modify admin authorization url<br>Required: `Operator` |
| `CreateIntegrationEmployees` | Create integration employees<br>Required: `Operator`, `Employees` |
| `CreateRiskIdentificationTaskFeedback` | Create risk identification task feedback<br>Required: `Operator` |
| `CreateBatchQuickSignUrl` | Create batch quick sign url<br>Required: `FlowApproverInfo` |
| `UnbindEmployeeUserIdWithClientOpenId` | Unbind employee user id with client open id<br>Required: `Operator`, `UserId`, `OpenId` |
| `CreateBatchCancelFlowUrl` | Create batch cancel flow url<br>Required: `Operator`, `FlowIds` |
| `CreateFlowApprovers` | Create flow approvers<br>Required: `Operator`, `Approvers` |
| `CreatePrepareFlow` | Create prepare flow<br>Required: `Operator`, `ResourceId`, `FlowName` |
| `CreateSealPolicy` | Create seal policy<br>Required: `Operator`, `Users`, `SealId`, `Expired` |
| `CreateOrganizationGroupInvitationLink` | Create organization group invitation link<br>Required: `Operator`, `ExpireTime` |
| `CreateBatchAdminChangeInvitations` | Create batch admin change invitations<br>Required: `Operator`, `AdminChangeInvitationInfos` |
| `CreatePartnerAuthorizationLink` | Create partner authorization link<br>Required: `Operator`, `BusinessId`, `PartnerOrganizationId`, `ApplicationInfo`, `ProxyOrganizationInfo` |
| `CreatePrepareFlowGroup` | Create prepare flow group<br>Required: `Operator`, `FlowGroupName`, `FlowGroupInfos`, `ResourceType` |
| `UpdateIntegrationEmployees` | Update integration employees<br>Required: `Operator`, `Employees` |
| `CreateOrganizationBatchSignUrl` | Create organization batch sign url<br>Required: `Operator` |
| `CreateContractReviewWebUrl` | Create contract review web url<br>Required: `Operator` |
| `CreateFileCounterSign` | Create file counter sign<br>Required: `FileId` |
| `CreateDigitalDataSign` | Create digital data sign<br>Required: `Operator` |
| `CreateSchemeUrl` | Create scheme url<br>Required: `Operator` |

## Blocked destructive actions (20)

`ModifyPartnerAutoSignAuthUrl`, `DeleteSealPolicies`, `DeleteIntegrationEmployees`, `ModifyExtendedService`, `RenewAutoSignLicense`, `DeleteIntegrationRoleUsers`, `CancelMultiFlowSignQRCode`, `CancelUserAutoSignEnableUrl`, `ModifyFlowDeadline`, `ModifyIntegrationRole`, `DeleteOrganizationAuthorizations`, `ModifyApplicationCallbackInfo`, `ModifyPartnerAuthorization`, `CancelFlow`, `DeleteIntegrationDepartment`, `DeleteSingleSignOnEmployees`, `ModifyIntegrationDepartment`, `CancelOrganizationFlows`, `ModifySingleSignOnEmployees`, `DeleteExtendedServiceAuthInfos` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ess`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201111` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ess"`) for the allow/block decision and reason.

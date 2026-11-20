---
name: tencent-adp
description: Tencent Cloud ADP via the Tencent MCP server — 81 actions in API version v20260520 (36 read-only auto-allowed). Use for skill, trigger, release, agent, conversation, plugin. Triggers on mentions of adp, skill, trigger, release, agent, conversation, plugin, summary, variable. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud ADP

General service: 81 actions in API version `v20260520` — 36 read-only (auto-allowed), 24 gated mutations, 21 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "adp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/adp/v20260520 — action signatures in `adp_client.ts`, full request/response shapes in `adp_models.ts`.

## Read actions (auto-allowed, 36)

| Action | What it does |
|---|---|
| `DescribeMsgRecordCategoryList` | Describe msg record category list<br>Required: `AppId` |
| `DescribeSpaceList` | Describe space list |
| `DescribeSystemVariableList` | Describe system variable list<br>Required: `AppId` |
| `DescribeVariableList` | Describe variable list<br>Required: `AppId` |
| `DescribeSkillDetail` | Describe skill detail<br>Required: `SkillId`, `SpaceId` |
| `DescribeAppSummaryList` | Describe app summary list<br>Required: `SpaceId` |
| `DescribeAppTriggerInstance` | Describe app trigger instance |
| `DescribeConversation` | Describe conversation<br>Required: `ConversationId`, `Type` |
| `DescribeSkillReferenceList` | Describe skill reference list<br>Required: `SkillId`, `SpaceId` |
| `DescribeAuditLogList` | Describe audit log list |
| `DescribeModelList` | Describe model list<br>Required: `ModelScene` |
| `DescribeAppTriggerSummaryList` | Describe app trigger summary list |
| `DescribeMsgRecordList` | Describe msg record list<br>Required: `AppId` |
| `DescribeAgentSummaryList` | Describe agent summary list |
| `DescribeAppTriggerRunLogList` | Describe app trigger run log list |
| `DescribeApp` | Describe app<br>Required: `AppId` |
| `DescribeReleaseList` | Describe release list<br>Required: `AppId` |
| `DescribeAgentDetail` | Describe agent detail |
| `DescribeReleaseSummary` | Describe release summary<br>Required: `AppId`, `ReleaseId` |
| `DescribeAgentReleasePreviewList` | Describe agent release preview list<br>Required: `AppId`, `PageNumber`, `PageSize` |
| `DescribePluginSummaryList` | Describe plugin summary list<br>Required: `SpaceId` |
| `DescribeAppTrigger` | Describe app trigger |
| `DescribeMetricOverviewList` | Describe metric overview list<br>Required: `ResourceType`, `TimeRange`, `ViewScope` |
| `DescribeConversationList` | Describe conversation list<br>Required: `Type` |
| `DescribeAccountList` | Describe account list |
| `DescribeSkillSummaryList` | Describe skill summary list<br>Required: `SpaceId` |
| `DescribeUsageDetailList` | Describe usage detail list<br>Required: `ResourceType`, `TimeRange`, `ViewScope` |
| `DescribeConcurrencyLimitDetailList` | Describe concurrency limit detail list<br>Required: `TimeRange`, `ViewScope` |
| `DescribeAuditLogMeta` | Describe audit log meta |
| `DescribeUsageSummaryList` | Describe usage summary list<br>Required: `ResourceType`, `TimeRange`, `ViewScope` |
| `DescribeVariable` | Describe variable<br>Required: `AppId`, `VariableId` |
| `DescribeConversationMessageList` | Describe conversation message list<br>Required: `ConversationId`, `Type` |
| `DescribePlugin` | Describe plugin<br>Required: `PluginId`, `SpaceId` |
| `DescribeSkillCategoryList` | Describe skill category list |
| `DescribeLatestRelease` | Describe latest release<br>Required: `AppId` |
| `DescribeConsumptionDetailList` | Describe consumption detail list<br>Required: `TimeRange`, `ViewScope` |
## Mutations (gated — need allowlist, 24)

| Action | What it does |
|---|---|
| `CreateMsgRecordCategory` | Create msg record category<br>Required: `Name`, `AppId` |
| `UnfavoriteSkill` | Run unfavorite skill<br>Required: `SkillId`, `SpaceId` |
| `CreateRelease` | Create release<br>Required: `AppId` |
| `CreateWorkspaceCredential` | Create workspace credential<br>Required: `Type`, `WorkspaceId` |
| `CreateAppTrigger` | Create app trigger |
| `RunAppTriggerNow` | Run app trigger now |
| `FavoritePlugin` | Run favorite plugin<br>Required: `PluginId`, `SpaceId` |
| `CreateAgent` | Create agent<br>Required: `AppId` |
| `ResumeAppTrigger` | Resume app trigger |
| `CopyApp` | Copy app<br>Required: `AppId` |
| `CopyAgentFromApp` | Copy agent from app<br>Required: `AppId` |
| `CreateSpace` | Create space |
| `CreateSkill` | Create skill<br>Required: `CreateType`, `FileUrl`, `SpaceId` |
| `CreateVariable` | Create variable<br>Required: `AppId` |
| `CreateWebSocketToken` | Create web socket token<br>Required: `Type` |
| `CreateConversation` | Create conversation<br>Required: `Type` |
| `CreateSkillShare` | Create skill share<br>Required: `ApplyRemark`, `SkillId`, `SpaceId`, `VersionId` |
| `UnfavoritePlugin` | Run unfavorite plugin<br>Required: `PluginId`, `SpaceId` |
| `FavoriteSkill` | Run favorite skill<br>Required: `SkillId`, `SpaceId` |
| `CreateApp` | Create app<br>Required: `SpaceId` |
| `RollbackRelease` | Roll back release<br>Required: `AppId`, `ReleaseId` |
| `PauseAppTrigger` | Pause app trigger |
| `RetryRelease` | Retry release<br>Required: `AppId`, `ReleaseId` |
| `CreatePlugin` | Create plugin<br>Required: `Profile`, `Config`, `SpaceId` |

## Blocked destructive actions (21)

`ModifyAgent`, `DeleteAppTrigger`, `DeleteSpace`, `ModifyAppTrigger`, `ModifyConversation`, `ReleaseSkill`, `ModifyPlugin`, `DeleteVariable`, `ModifySpace`, `DeleteApp`, `ModifyApp`, `DeletePlugin`, `DeleteMsgRecordCategory`, `DeleteSkillShare`, `ResetConversation`, `ModifyMsgRecordCategory`, `ModifyVariable`, `DeleteSkill`, `ModifySkill`, `DeleteAgent`, `DeleteConversation` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `adp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20260520` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="adp"`) for the allow/block decision and reason.

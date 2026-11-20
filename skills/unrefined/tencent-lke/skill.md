---
name: tencent-lke
description: Tencent Cloud LKE via the Tencent MCP server — 106 actions in API version v20231130 (58 read-only auto-allowed). Use for knowledge, attribute, label, release, usage, graph. Triggers on mentions of lke, knowledge, attribute, label, release, usage, graph, question, rejected. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud LKE

AI services: 106 actions in API version `v20231130` — 58 read-only (auto-allowed), 27 gated mutations, 21 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "lke"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/lke/v20231130 — action signatures in `lke_client.ts`, full request/response shapes in `lke_models.ts`.

## Read actions (auto-allowed, 58)

| Action | What it does |
|---|---|
| `ListUnsatisfiedReply` | List unsatisfied reply<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `GetVarList` | Get var list<br>Required: `AppBizId` |
| `DescribeKnowledgeUsagePieGraph` | Describe knowledge usage pie graph |
| `ListSelectDoc` | List select doc<br>Required: `BotBizId` |
| `ListDocCate` | List doc cate<br>Required: `BotBizId` |
| `ListSharedKnowledge` | List shared knowledge<br>Required: `PageNumber`, `PageSize` |
| `DescribeAttributeLabel` | Describe attribute label<br>Required: `BotBizId`, `AttributeBizId`, `Limit` |
| `ListRejectedQuestionPreview` | List rejected question preview<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `DescribeSharedKnowledge` | Describe shared knowledge<br>Required: `KnowledgeBizId` |
| `DescribeTokenUsageGraph` | Describe token usage graph |
| `DescribeApp` | Describe app<br>Required: `AppBizId` |
| `GetWsToken` | Get ws token<br>Required: `Type` |
| `ListAttributeLabel` | List attribute label<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `ListReleaseConfigPreview` | List release config preview<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `ListReferShareKnowledge` | List refer share knowledge<br>Required: `AppBizId` |
| `DescribeSearchStatsGraph` | Describe search stats graph |
| `ListWorkflowRuns` | List workflow runs<br>Required: `AppBizId`, `PageSize` (range 1-200) |
| `CheckAttributeLabelExist` | Check attribute label exist<br>Required: `BotBizId`, `LabelName`, `AttributeBizId` |
| `DescribeDoc` | Describe doc<br>Required: `BotBizId`, `DocBizId` |
| `ListUsageCallDetail` | List usage call detail<br>Required: `ModelName`, `PageNumber`, `PageSize` |
| `DescribeStorageCredential` | Describe storage credential |
| `ListReleaseQAPreview` | List release qapreview<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `CheckAttributeLabelRefer` | Check attribute label refer<br>Required: `BotBizId` |
| `DescribeUnsatisfiedReplyContext` | Describe unsatisfied reply context<br>Required: `BotBizId`, `ReplyBizId` |
| `ListApp` | List app |
| `DescribeTokenUsage` | Describe token usage |
| `DescribeNodeRun` | Describe node run<br>Required: `AppBizId`, `NodeRunId` |
| `ListQACate` | List qacate<br>Required: `BotBizId` |
| `DescribeQA` | Describe qa<br>Required: `QaBizId`, `BotBizId` |
| `ListChannel` | List channel<br>Required: `AppBizId` |
| `ExportAttributeLabel` | Export attribute label<br>Required: `BotBizId` |
| `DescribeRefer` | Describe refer<br>Required: `BotBizId`, `ReferBizIds` |
| `DescribeKnowledgeUsage` | Describe knowledge usage |
| `ListDoc` | List doc<br>Required: `BotBizId`, `PageNumber`, `PageSize` (range 1-200) |
| `ListQA` | List qa<br>Required: `BotBizId`, `PageNumber`, `PageSize` (range 1-200) |
| `GetLikeDataCount` | Get like data count<br>Required: `StartTime`, `EndTime` |
| `DescribeRobotBizIDByAppKey` | Describe robot biz idby app key<br>Required: `AppKey` |
| `ExportQAList` | Export qalist<br>Required: `BotBizId`, `QaBizIds` |
| `GetDocPreview` | Get doc preview<br>Required: `DocBizId`, `BotBizId` |
| `DescribeConcurrencyUsage` | Describe concurrency usage<br>Required: `ModelName` |
| `ListRelease` | List release<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `ListModel` | List model<br>Required: `AppType` |
| `ListRejectedQuestion` | List rejected question<br>Required: `BotBizId`, `PageNumber` (default 1), `PageSize` (range 1-200; default 15) |
| `ExportUnsatisfiedReply` | Export unsatisfied reply<br>Required: `BotBizId`, `ReplyBizIds` |
| `GetAppSecret` | Get app secret<br>Required: `AppBizId` |
| `GetAnswerTypeDataCount` | Get answer type data count<br>Required: `StartTime`, `EndTime` |
| `DescribeWorkflowRun` | Describe workflow run<br>Required: `AppBizId`, `WorkflowRunId` |
| `DescribeAppAgentList` | Describe app agent list |
| `ListReleaseDocPreview` | List release doc preview<br>Required: `BotBizId`, `PageNumber`, `PageSize` |
| `DescribeRelease` | Describe release<br>Required: `BotBizId` |
| `GetAppKnowledgeCount` | Get app knowledge count<br>Required: `Type`, `AppBizId` |
| `DescribeConcurrencyUsageGraph` | Describe concurrency usage graph<br>Required: `ModelName` |
| `GetMsgRecord` | Get msg record<br>Required: `Type`, `Count`, `SessionId` |
| `DescribeCallStatsGraph` | Describe call stats graph |
| `DescribeSegments` | Describe segments<br>Required: `BotBizId` |
| `GetTaskStatus` | Get task status<br>Required: `TaskId`, `TaskType`, `BotBizId` |
| `ListAppKnowledgeDetail` | List app knowledge detail<br>Required: `PageNumber`, `PageSize` |
| `DescribeReleaseInfo` | Describe release info<br>Required: `BotBizId` |
## Mutations (gated — need allowlist, 27)

| Action | What it does |
|---|---|
| `CreateRelease` | Create release<br>Required: `BotBizId` |
| `CallbackWorkflowToolNode` | Run callback workflow tool node<br>Required: `CallbackToken`, `Result` |
| `CreateAttributeLabel` | Create attribute label<br>Required: `BotBizId`, `AttrName`, `Labels` |
| `RetryDocParse` | Retry doc parse<br>Required: `BotBizId` |
| `CreateQA` | Create qa<br>Required: `BotBizId`, `Question`, `Answer`, `AttrRange` |
| `GenerateQA` | Generate qa<br>Required: `BotBizId`, `DocBizIds` |
| `VerifyQA` | Verify qa<br>Required: `List`, `BotBizId` |
| `CreateDocCate` | Create doc cate<br>Required: `BotBizId`, `ParentBizId`, `Name` |
| `RenameDoc` | Run rename doc |
| `RateMsgRecord` | Run rate msg record<br>Required: `BotAppKey`, `RecordId`, `Score` |
| `CreateSharedKnowledge` | Create shared knowledge<br>Required: `KnowledgeName` |
| `GroupDoc` | Group doc<br>Required: `BotBizId`, `BizIds`, `CateBizId` |
| `CreateApp` | Create app<br>Required: `AppType`, `BaseConfig` |
| `CreateQACate` | Create qacate<br>Required: `BotBizId`, `ParentBizId`, `Name` |
| `UpdateSharedKnowledge` | Update shared knowledge<br>Required: `KnowledgeBizId` |
| `CreateWorkflowRun` | Create workflow run<br>Required: `AppBizId` |
| `CreateVar` | Create var<br>Required: `AppBizId`, `VarName` |
| `UploadAttributeLabel` | Upload attribute label<br>Required: `BotBizId`, `FileName`, `CosUrl`, `CosHash`, `Size` |
| `IsTransferIntent` | Run is transfer intent<br>Required: `Content`, `BotAppKey` |
| `IgnoreUnsatisfiedReply` | Run ignore unsatisfied reply<br>Required: `BotBizId`, `ReplyBizIds` |
| `UpdateVar` | Update var<br>Required: `AppBizId`, `VarId`, `VarName` |
| `ReferShareKnowledge` | Run refer share knowledge<br>Required: `AppBizId`, `KnowledgeBizId` |
| `RetryRelease` | Retry release<br>Required: `BotBizId`, `ReleaseBizId` |
| `SaveDoc` | Run save doc<br>Required: `BotBizId`, `FileName`, `FileType`, `CosUrl`, `ETag`, `CosHash`, `Size` |
| `RetryDocAudit` | Retry doc audit<br>Required: `BotBizId`, `DocBizId` |
| `CreateRejectedQuestion` | Create rejected question<br>Required: `BotBizId`, `Question`, `BusinessSource` |
| `GroupQA` | Group qa<br>Required: `BotBizId`, `QaBizIds`, `CateBizId` |

## Blocked destructive actions (21)

`DeleteAttributeLabel`, `ModifyQAAttrRange`, `ModifyDocAttrRange`, `DeleteQA`, `StopWorkflowRun`, `ModifyQACate`, `DeleteApp`, `DeleteDocCate`, `ModifyDoc`, `DeleteAgent`, `DeleteSharedKnowledge`, `ModifyDocCate`, `ModifyRejectedQuestion`, `DeleteQACate`, `ModifyQA`, `DeleteDoc`, `DeleteRejectedQuestion`, `DeleteVar`, `ModifyApp`, `ModifyAttributeLabel`, `StopDocParse` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `lke`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20231130` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="lke"`) for the allow/block decision and reason.

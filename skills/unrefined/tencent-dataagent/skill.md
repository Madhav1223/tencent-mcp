---
name: tencent-dataagent
description: Tencent Cloud DATAAGENT via the Tencent MCP server — 23 actions in API version v20250513 (10 read-only auto-allowed). Use for knowledge, agent, base, chunk, session, authority. Triggers on mentions of dataagent, knowledge, agent, base, chunk, session, authority, chat, execute. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud DATAAGENT

General service: 23 actions in API version `v20250513` — 10 read-only (auto-allowed), 7 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dataagent"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dataagent/v20250513 — action signatures in `dataagent_client.ts`, full request/response shapes in `dataagent_models.ts`.

## Read actions (auto-allowed, 10)

| Action | What it does |
|---|---|
| `GetKnowledgeBaseList` | Get knowledge base list<br>Required: `InstanceId` |
| `QueryModels` | Query models |
| `GetKnowledgeBaseFileList` | Get knowledge base file list<br>Required: `InstanceId` |
| `GetSessionDetails` | Get session details |
| `GetUserInstanceList` | Get user instance list |
| `GetUploadJobDetails` | Get upload job details |
| `QueryUserAuthority` | Query user authority<br>Required: `InstanceId`, `Module`, `ObjectId` |
| `QueryChunkList` | Query chunk list |
| `QueryKnowledgeTask` | Query knowledge task |
| `GetJobsByKnowledgeBaseId` | Get jobs by knowledge base id |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `UploadAndCommitFile` | Upload and commit file |
| `ExecuteAgentApi` | Execute agent api |
| `AddChunk` | Add chunk<br>Required: `InstanceId`, `FileId` |
| `ChatAI` | Run chat ai |
| `CreateDataAgentSession` | Create data agent session |
| `AppendKnowledgeTask` | Run append knowledge task |
| `ExecuteAgentApiV1` | Execute agent api v1 |

## Blocked destructive actions (6)

`ModifyKnowledgeBase`, `DeleteDataAgentSession`, `ModifyUserAuthority`, `StopChatAI`, `ModifyChunk`, `DeleteChunk` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dataagent`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250513` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dataagent"`) for the allow/block decision and reason.

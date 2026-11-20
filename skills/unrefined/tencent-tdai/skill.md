---
name: tencent-tdai
description: Tencent Cloud TDAI via the Tencent MCP server — 28 actions in API version v20250717 (12 read-only auto-allowed). Use for agent, memory, plus, space, chat, duty. Triggers on mentions of tdai, agent, memory, plus, space, chat, duty, isolate, recover. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud TDAI

Databases: 28 actions in API version `v20250717` — 12 read-only (auto-allowed), 8 gated mutations, 8 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tdai"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tdai/v20250717 — action signatures in `tdai_client.ts`, full request/response shapes in `tdai_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `DescribeChatDetail` | Describe chat detail<br>Required: `InstanceId` |
| `DescribeAgentDutyTasks` | Describe agent duty tasks<br>Required: `InstanceId` |
| `DescribeMemoryPlusSpaces` | Describe memory plus spaces |
| `DescribeChats` | Describe chats<br>Required: `InstanceId` |
| `DescribeMemoryPlusRecord` | Describe memory plus record<br>Required: `SpaceId` |
| `DescribeMemoryPlusSpace` | Describe memory plus space<br>Required: `SpaceId` |
| `DescribeAgentDutyTaskDetail` | Describe agent duty task detail |
| `DescribeAgents` | Describe agents |
| `DescribeReportUrl` | Describe report url |
| `DescribeServiceAccessKey` | Describe service access key<br>Required: `ServiceId` |
| `DescribeAgentInstances` | Describe agent instances |
| `DescribeAgentInstance` | Describe agent instance |
## Mutations (gated — need allowlist, 8)

| Action | What it does |
|---|---|
| `ContinueAgentWork` | Run continue agent work<br>Required: `InstanceId` |
| `PauseAgentWork` | Pause agent work<br>Required: `InstanceId` |
| `StartAgentTask` | Start agent task<br>Required: `InstanceId` |
| `IsolateAgentInstance` | Run isolate agent instance<br>Required: `InstanceId` |
| `CreateMemoryPlusSpace` | Create memory plus space |
| `CreateChatCompletion` | Create chat completion<br>Required: `InputContent`, `InstanceId` |
| `CreateAgentInstance` | Create agent instance |
| `IsolateMemoryPlusSpace` | Run isolate memory plus space<br>Required: `SpaceIds` |

## Blocked destructive actions (8)

`ModifyAgentInstanceParameters`, `ModifyChatTitle`, `RecoverMemoryPlusSpace`, `RemoveChat`, `DestroyMemoryPlusSpace`, `TerminateAgentInstance`, `RecoverAgentInstance`, `ModifyMemoryPlusSpace` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tdai`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250717` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tdai"`) for the allow/block decision and reason.

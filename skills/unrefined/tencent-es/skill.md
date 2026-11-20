---
name: tencent-es
description: Tencent Cloud ES via the Tencent MCP server — 10 actions in API version v20250101 (4 read-only auto-allowed). Use for document, chunk, parse, async, embedding, result. Triggers on mentions of es, document, chunk, parse, async, embedding, result, chat, completions. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud ES

Databases: 10 actions in API version `v20250101` — 4 read-only (auto-allowed), 6 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "es"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/es/v20250101 — action signatures in `es_client.ts`, full request/response shapes in `es_models.ts`.

## Read actions (auto-allowed, 4)

| Action | What it does |
|---|---|
| `GetDocumentChunkResult` | Get document chunk result<br>Required: `TaskId` |
| `GetDocumentParseResult` | Get document parse result<br>Required: `TaskId` |
| `GetTextEmbedding` | Get text embedding<br>Required: `ModelName`, `Texts` |
| `GetMultiModalEmbedding` | Get multi modal embedding |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `ChunkDocumentAsync` | Run chunk document async<br>Required: `Document`, `ModelName` |
| `ParseDocumentAsync` | Run parse document async<br>Required: `Document`, `ModelName` |
| `ParseDocument` | Run parse document<br>Required: `Document`, `ModelName` |
| `ChatCompletions` | Run chat completions<br>Required: `Messages`, `ModelName` |
| `ChunkDocument` | Run chunk document<br>Required: `Document`, `ModelName` |
| `RunRerank` | Run rerank<br>Required: `ModelName`, `Query`, `Documents` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `es`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250101` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="es"`) for the allow/block decision and reason.

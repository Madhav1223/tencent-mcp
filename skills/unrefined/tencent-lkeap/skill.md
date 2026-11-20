---
name: tencent-lkeap
description: Tencent Cloud LKEAP via the Tencent MCP server — 11 actions in API version v20240522 (5 read-only auto-allowed). Use for document, reconstruct, result, split, cancel, character. Triggers on mentions of lkeap, document, reconstruct, result, split, cancel, character, chat, completions. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud LKEAP

AI services: 11 actions in API version `v20240522` — 5 read-only (auto-allowed), 5 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "lkeap"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/lkeap/v20240522 — action signatures in `lkeap_client.ts`, full request/response shapes in `lkeap_models.ts`.

## Read actions (auto-allowed, 5)

| Action | What it does |
|---|---|
| `QueryRewrite` | Query rewrite<br>Required: `Messages` |
| `GetCharacterUsage` | Get character usage |
| `GetSplitDocumentResult` | Get split document result<br>Required: `TaskId` |
| `GetReconstructDocumentResult` | Get reconstruct document result<br>Required: `TaskId` |
| `GetEmbedding` | Get embedding<br>Required: `Model`, `Inputs` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `CreateReconstructDocumentFlow` | Create reconstruct document flow<br>Required: `FileType` |
| `CreateSplitDocumentFlow` | Create split document flow<br>Required: `FileType`, `FileUrl` |
| `ReconstructDocumentSSE` | Run reconstruct document sse<br>Required: `FileType` |
| `RunRerank` | Run rerank<br>Required: `Query`, `Docs` |
| `ChatCompletions` | Run chat completions<br>Required: `Model`, `Messages` (system | user | assistant) |

## Blocked destructive actions (1)

`CancelTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `lkeap`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240522` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="lkeap"`) for the allow/block decision and reason.

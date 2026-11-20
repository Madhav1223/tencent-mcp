---
name: tencent-hunyuan
description: Tencent Cloud HUNYUAN via the Tencent MCP server — 28 actions in API version v20230901 (9 read-only auto-allowed). Use for glossary, image, chat, thread, entry, hunyuan. Triggers on mentions of hunyuan, glossary, image, chat, thread, entry, hunyuan, completions, message. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud HUNYUAN

AI services: 28 actions in API version `v20230901` — 9 read-only (auto-allowed), 17 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "hunyuan"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/hunyuan/v20230901 — action signatures in `hunyuan_client.ts`, full request/response shapes in `hunyuan_models.ts`.

## Read actions (auto-allowed, 9)

| Action | What it does |
|---|---|
| `GetThread` | Get thread<br>Required: `ThreadID` |
| `QueryHunyuanImageJob` | Query hunyuan image job<br>Required: `JobId` |
| `ListGlossary` | List glossary |
| `ListGlossaryEntry` | List glossary entry<br>Required: `GlossaryId` |
| `GetThreadMessageList` | Get thread message list<br>Required: `ThreadID` |
| `GetEmbedding` | Get embedding |
| `QueryHunyuanImageChatJob` | Query hunyuan image chat job |
| `GetThreadMessage` | Get thread message<br>Required: `ThreadID`, `MessageID` |
| `GetTokenCount` | Get token count<br>Required: `Prompt` |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `SubmitHunyuanImageJob` | Submit hunyuan image job<br>Required: `Prompt` |
| `ChatTranslations` | Run chat translations<br>Required: `Model` |
| `ImageQuestion` | Image question<br>Required: `Model`, `Messages` (system | user | assistant) |
| `CreateGlossaryEntry` | Create glossary entry<br>Required: `GlossaryId`, `Entries` |
| `UpdateGlossaryEntry` | Update glossary entry<br>Required: `GlossaryId`, `Entries` |
| `GroupChatCompletions` | Group chat completions<br>Required: `Model`, `Messages` |
| `RunThread` | Run thread<br>Required: `ThreadID` |
| `SetPayMode` | Set pay mode<br>Required: `PayMode` |
| `CreateThread` | Create thread |
| `FilesDeletions` | Run files deletions<br>Required: `ID` |
| `CreateGlossary` | Create glossary<br>Required: `Name`, `Source` (zh | en | fr | pt | es | ja | tr | ru), `Target` (zh | en | fr | pt | es | ja | tr | ru) |
| `FilesUploads` | Run files uploads<br>Required: `Name`, `URL` |
| `ActivateService` | Activate service |
| `FilesList` | Run files list |
| `SubmitHunyuanImageChatJob` | Submit hunyuan image chat job<br>Required: `Prompt` |
| `ChatCompletions` | Run chat completions<br>Required: `Model`, `Messages` (system | user | assistant | tool) |
| `TextToImageLite` | Run text to image lite<br>Required: `Prompt` |

## Blocked destructive actions (2)

`DeleteGlossary`, `DeleteGlossaryEntry` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `hunyuan`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230901` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="hunyuan"`) for the allow/block decision and reason.

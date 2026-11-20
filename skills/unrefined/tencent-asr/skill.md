---
name: tencent-asr
description: Tencent Cloud ASR via the Tencent MCP server — 33 actions in API version v20190614 (10 read-only auto-allowed). Use for print, voice, vocab, customization, recognition, word. Triggers on mentions of asr, print, voice, vocab, customization, recognition, word, async, download. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud ASR

AI services: 33 actions in API version `v20190614` — 10 read-only (auto-allowed), 18 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "asr"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/asr/v20190614 — action signatures in `asr_client.ts`, full request/response shapes in `asr_models.ts`.

## Read actions (auto-allowed, 10)

| Action | What it does |
|---|---|
| `GetUsageByDate` | Get usage by date<br>Required: `BizNameList`, `StartDate`, `EndDate` |
| `GetCustomizationList` | Get customization list |
| `GetAsrVocabList` | Get asr vocab list |
| `GetAsrVocab` | Get asr vocab<br>Required: `VocabId` |
| `DownloadAsrVocab` | Download asr vocab<br>Required: `VocabId` |
| `GetAsrKeyWordLibList` | Get asr key word lib list |
| `DescribeTaskStatus` | Describe task status<br>Required: `TaskId` |
| `DescribeAsyncRecognitionTasks` | Describe async recognition tasks |
| `GetModelInfo` | Get model info<br>Required: `ModelId` |
| `DownloadCustomization` | Download customization<br>Required: `ModelId` |
## Mutations (gated — need allowlist, 18)

| Action | What it does |
|---|---|
| `VoicePrintCompare` | Run voice print compare<br>Required: `VoiceFormat`, `SampleRate`, `SrcAudioData`, `DestAudioData` |
| `UpdateAsrVocab` | Update asr vocab<br>Required: `VocabId` |
| `CreateAsyncRecognitionTask` | Create async recognition task<br>Required: `EngineType`, `Url`, `CallbackUrl` |
| `VoicePrintCount` | Run voice print count |
| `VoicePrintGroupList` | Run voice print group list |
| `SetVocabState` | Set vocab state<br>Required: `VocabId`, `State` |
| `CreateCustomization` | Create customization<br>Required: `ModelName`, `TextUrl`, `ModelType` |
| `VoicePrintGroupVerify` | Run voice print group verify<br>Required: `VoiceFormat`, `SampleRate` (unit: Hz), `Data`, `GroupId`, `TopN` |
| `SentenceRecognition` | Run sentence recognition<br>Required: `EngSerViceType`, `SourceType`, `VoiceFormat` |
| `UpdateAsrKeyWordLib` | Update asr key word lib<br>Required: `KeyWordLibId`, `Name`, `KeyWordFile` |
| `VoicePrintUpdate` | Run voice print update<br>Required: `VoiceFormat`, `SampleRate`, `VoicePrintId` |
| `CreateRecTask` | Create rec task<br>Required: `EngineModelType`, `ChannelNum`, `ResTextFormat`, `SourceType` |
| `VoicePrintEnroll` | Run voice print enroll<br>Required: `VoiceFormat`, `SampleRate` (unit: Hz) |
| `VoicePrintVerify` | Run voice print verify<br>Required: `VoiceFormat`, `SampleRate` (unit: Hz), `VoicePrintId` |
| `VoicePrintDelete` | Run voice print delete |
| `CreateAsrKeyWordLib` | Create asr key word lib<br>Required: `Name`, `KeyWordFile` |
| `CloseAsyncRecognitionTask` | Close async recognition task<br>Required: `TaskId` |
| `CreateAsrVocab` | Create asr vocab<br>Required: `Name` |

## Blocked destructive actions (5)

`DeleteAsrVocab`, `ModifyCustomization`, `DeleteAsrKeyWordLib`, `ModifyCustomizationState`, `DeleteCustomization` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `asr`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190614` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="asr"`) for the allow/block decision and reason.

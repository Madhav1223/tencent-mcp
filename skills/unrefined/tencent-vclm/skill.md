---
name: tencent-vclm
description: Tencent Cloud VCLM via the Tencent MCP server — 31 actions in API version v20240523 (15 read-only auto-allowed). Use for video, submit, image, kling, vidu, text. Triggers on mentions of vclm, video, submit, image, kling, vidu, text, aigc, element. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: 3D / generative media
metadata:
  version: "4"
---

# Tencent Cloud VCLM

3D / generative media: 31 actions in API version `v20240523` — 15 read-only (auto-allowed), 15 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vclm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Generation jobs are async and billed per run — poll result actions until terminal state; preview at low fidelity before expensive renders.
Input assets (images, models, audio) have format/size constraints — validate against the model docs before submitting.
Style and template IDs pin output behavior — set them explicitly rather than relying on defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vclm/v20240523 — action signatures in `vclm_client.ts`, full request/response shapes in `vclm_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeTextToVideoJob` | Describe text to video job |
| `DescribeVideoEditKlingJob` | Describe video edit kling job |
| `DescribeReferenceToVideoViduJob` | Describe reference to video vidu job<br>Required: `JobId` |
| `DescribeImageToVideoGeneralJob` | Describe image to video general job<br>Required: `JobId` |
| `DescribeTemplateToVideoJob` | Describe template to video job<br>Required: `JobId` |
| `DescribePortraitSingJob` | Describe portrait sing job<br>Required: `JobId` |
| `DescribeMotionControlKlingJob` | Describe motion control kling job |
| `DescribeVideoExtendKlingJob` | Describe video extend kling job |
| `DescribeHumanActorJob` | Describe human actor job<br>Required: `JobId` |
| `DescribeAigcElement` | Describe aigc element |
| `DescribeImageToVideoViduJob` | Describe image to video vidu job<br>Required: `JobId` |
| `DescribeTextToVideoViduJob` | Describe text to video vidu job<br>Required: `JobId` |
| `DescribeImageToVideoJob` | Describe image to video job |
| `DescribeVideoFaceFusionJob` | Describe video face fusion job |
| `DescribeHunyuanToVideoJob` | Describe hunyuan to video job<br>Required: `JobId` |
## Mutations (gated — need allowlist, 15)

| Action | What it does |
|---|---|
| `SubmitHunyuanToVideoJob` | Submit hunyuan to video job<br>Required: `Prompt` |
| `SubmitPortraitSingJob` | Submit portrait sing job<br>Required: `AudioUrl` (format `mp3…`) |
| `SubmitTextToVideoViduJob` | Submit text to video vidu job<br>Required: `Prompt` |
| `SubmitMotionControlKlingJob` | Submit motion control kling job |
| `SubmitVideoFaceFusionJob` | Submit video face fusion job |
| `SubmitImageToVideoViduJob` | Submit image to video vidu job<br>Required: `Images` |
| `SubmitVideoExtendKlingJob` | Submit video extend kling job<br>Required: `VideoId` |
| `SubmitImageToVideoJob` | Submit image to video job |
| `SubmitTextToVideoJob` | Submit text to video job |
| `SubmitHumanActorJob` | Submit human actor job<br>Required: `Prompt`, `AudioUrl` (format `mp3…`) |
| `SubmitTemplateToVideoJob` | Submit template to video job<br>Required: `Template`, `Images` |
| `SubmitVideoEditKlingJob` | Submit video edit kling job |
| `SubmitReferenceToVideoViduJob` | Submit reference to video vidu job<br>Required: `Prompt` |
| `CreateAigcElement` | Create aigc element<br>Required: `Name`, `Description` |
| `SubmitImageToVideoGeneralJob` | Submit image to video general job<br>Required: `Image` |

## Blocked destructive actions (1)

`DeleteAigcElement` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vclm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240523` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vclm"`) for the allow/block decision and reason.

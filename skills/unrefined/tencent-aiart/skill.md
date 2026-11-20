---
name: tencent-aiart
description: Tencent Cloud AIART via the Tencent MCP server — 23 actions in API version v20221229 (6 read-only auto-allowed). Use for image, submit, text, portrait, train, draw. Triggers on mentions of aiart, image, submit, text, portrait, train, draw, glam, meme. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: 3D / generative media
metadata:
  version: "4"
---

# Tencent Cloud AIART

3D / generative media: 23 actions in API version `v20221229` — 6 read-only (auto-allowed), 17 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "aiart"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Generation jobs are async and billed per run — poll result actions until terminal state; preview at low fidelity before expensive renders.
Input assets (images, models, audio) have format/size constraints — validate against the model docs before submitting.
Style and template IDs pin output behavior — set them explicitly rather than relying on defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/aiart/v20221229 — action signatures in `aiart_client.ts`, full request/response shapes in `aiart_models.ts`.

## Read actions (auto-allowed, 6)

| Action | What it does |
|---|---|
| `QueryTextToImageJob` | Query text to image job<br>Required: `JobId` |
| `QueryTextToImageProJob` | Query text to image pro job<br>Required: `JobId` |
| `QueryMemeJob` | Query meme job<br>Required: `JobId` |
| `QueryTrainPortraitModelJob` | Query train portrait model job<br>Required: `ModelId` |
| `QueryGlamPicJob` | Query glam pic job<br>Required: `JobId` |
| `QueryDrawPortraitJob` | Query draw portrait job<br>Required: `JobId` |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `ReplaceBackground` | Replace background<br>Required: `ProductUrl`, `Prompt` |
| `SubmitTrainPortraitModelJob` | Submit train portrait model job<br>Required: `ModelId` |
| `SubmitDrawPortraitJob` | Submit draw portrait job<br>Required: `ModelId`, `StyleId`, `ImageNum` |
| `ImageToImage` | Image to image |
| `RefineImage` | Run refine image |
| `ImageOutpainting` | Image outpainting<br>Required: `Ratio` |
| `GenerateAvatar` | Generate avatar |
| `SubmitMemeJob` | Submit meme job<br>Required: `Pose` |
| `SketchToImage` | Run sketch to image<br>Required: `Prompt` |
| `ImageInpaintingRemoval` | Image inpainting removal |
| `TextToImageRapid` | Run text to image rapid<br>Required: `Prompt` |
| `SubmitTextToImageProJob` | Submit text to image pro job<br>Required: `Prompt` |
| `SubmitTextToImageJob` | Submit text to image job<br>Required: `Prompt` |
| `UploadTrainPortraitImages` | Upload train portrait images<br>Required: `ModelId` |
| `SubmitGlamPicJob` | Submit glam pic job<br>Required: `TemplateUrl` |
| `ChangeClothes` | Run change clothes<br>Required: `ModelUrl`, `ClothesUrl`, `ClothesType` |
| `TextToImageLite` | Run text to image lite<br>Required: `Prompt` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `aiart`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20221229` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="aiart"`) for the allow/block decision and reason.

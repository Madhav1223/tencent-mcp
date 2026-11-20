---
name: tencent-ai3d
description: Tencent Cloud AI3D via the Tencent MCP server — 19 actions in API version v20250513 (9 read-only auto-allowed). Use for hunyuan, submit, djob, auto, dmotion, dpart. Triggers on mentions of ai3d, hunyuan, submit, djob, auto, dmotion, dpart, dpro, drapid. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: 3D / generative media
metadata:
  version: "4"
---

# Tencent Cloud AI3D

3D / generative media: 19 actions in API version `v20250513` — 9 read-only (auto-allowed), 10 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ai3d"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Generation jobs are async and billed per run — poll result actions until terminal state; preview at low fidelity before expensive renders.
Input assets (images, models, audio) have format/size constraints — validate against the model docs before submitting.
Style and template IDs pin output behavior — set them explicitly rather than relying on defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ai3d/v20250513 — action signatures in `ai3d_client.ts`, full request/response shapes in `ai3d_models.ts`.

## Read actions (auto-allowed, 9)

| Action | What it does |
|---|---|
| `DescribeAutoRiggingJob` | Describe auto rigging job<br>Required: `JobId` |
| `DescribeHunyuanTo3DMotionJob` | Describe hunyuan to3 dmotion job<br>Required: `JobId` |
| `DescribeReduceFaceJob` | Describe reduce face job |
| `QueryHunyuanTo3DRapidJob` | Query hunyuan to3 drapid job |
| `QueryHunyuan3DPartJob` | Query hunyuan3 dpart job<br>Required: `JobId` |
| `DescribeTextureTo3DJob` | Describe texture to3 djob |
| `DescribeProfileTo3DJob` | Describe profile to3 djob |
| `DescribeHunyuanTo3DUVJob` | Describe hunyuan to3 duvjob<br>Required: `JobId` |
| `QueryHunyuanTo3DProJob` | Query hunyuan to3 dpro job<br>Required: `JobId` |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `SubmitTextureTo3DJob` | Submit texture to3 djob<br>Required: `File3D` (OBJ | GLB) |
| `SubmitHunyuanTo3DUVJob` | Submit hunyuan to3 duvjob |
| `SubmitProfileTo3DJob` | Submit profile to3 djob |
| `SubmitHunyuanTo3DProJob` | Submit hunyuan to3 dpro job |
| `SubmitHunyuanTo3DRapidJob` | Submit hunyuan to3 drapid job |
| `SubmitHunyuanTo3DMotionJob` | Submit hunyuan to3 dmotion job<br>Required: `Prompt` |
| `SubmitHunyuan3DPartJob` | Submit hunyuan3 dpart job |
| `SubmitReduceFaceJob` | Submit reduce face job<br>Required: `File3D` (OBJ | GLB) |
| `SubmitAutoRiggingJob` | Submit auto rigging job<br>Required: `File3D` |
| `Convert3DFormat` | Convert 3 dformat<br>Required: `File3D`, `Format` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ai3d`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250513` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ai3d"`) for the allow/block decision and reason.

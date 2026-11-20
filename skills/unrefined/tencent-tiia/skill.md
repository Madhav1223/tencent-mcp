---
name: tencent-tiia
description: Tencent Cloud TIIA via the Tencent MCP server — 21 actions in API version v20190529 (3 read-only auto-allowed). Use for detect, image, images, label, recognize, assess. Triggers on mentions of tiia, detect, image, images, label, recognize, assess, chef, crop. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud TIIA

AI services: 21 actions in API version `v20190529` — 3 read-only (auto-allowed), 17 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tiia"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tiia/v20190529 — action signatures in `tiia_client.ts`, full request/response shapes in `tiia_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `DescribeGroups` | Describe groups |
| `SearchImage` | Search image<br>Required: `GroupId` |
| `DescribeImages` | Describe images<br>Required: `GroupId`, `EntityId` |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `CreateImage` | Create image<br>Required: `GroupId`, `EntityId`, `PicName` |
| `UpdateImage` | Update image<br>Required: `GroupId`, `EntityId` |
| `DetectLabelPro` | Detect label pro |
| `RecognizeCar` | Recognize car |
| `DetectLabel` | Detect label |
| `AssessQuality` | Run assess quality |
| `DetectChefDress` | Detect chef dress |
| `DetectDisgust` | Detect disgust |
| `CropImage` | Run crop image<br>Required: `Width`, `Height` |
| `DetectMisbehavior` | Detect misbehavior |
| `CreateGroup` | Create group<br>Required: `GroupId`, `GroupName`, `MaxCapacity` |
| `DetectProduct` | Detect product |
| `RecognizeCarPro` | Recognize car pro |
| `EnhanceImage` | Run enhance image |
| `DetectEnvelope` | Detect envelope |
| `DetectSecurity` | Detect security |
| `DetectPet` | Detect pet |

## Blocked destructive actions (1)

`DeleteImages` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tiia`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190529` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tiia"`) for the allow/block decision and reason.

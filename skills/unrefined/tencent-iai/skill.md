---
name: tencent-iai
description: Tencent Cloud IAI via the Tencent MCP server — 35 actions in API version v20200303 (12 read-only auto-allowed). Use for face, person, detect, model, version, upgrade. Triggers on mentions of iai, face, person, detect, model, version, upgrade, analyze, base. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud IAI

AI services: 35 actions in API version `v20200303` — 12 read-only (auto-allowed), 16 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iai"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iai/v20200303 — action signatures in `iai_client.ts`, full request/response shapes in `iai_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `SearchFacesReturnsByGroup` | Search faces returns by group<br>Required: `GroupIds` |
| `GetPersonBaseInfo` | Get person base info<br>Required: `PersonId` |
| `GetPersonListNum` | Get person list num<br>Required: `GroupId` |
| `GetPersonGroupInfo` | Get person group info<br>Required: `PersonId` |
| `SearchFaces` | Search faces<br>Required: `GroupIds` |
| `GetUpgradeGroupFaceModelVersionJobList` | Get upgrade group face model version job list |
| `GetGroupInfo` | Get group info<br>Required: `GroupId` |
| `GetPersonList` | Get person list<br>Required: `GroupId` |
| `GetUpgradeGroupFaceModelVersionResult` | Get upgrade group face model version result<br>Required: `JobId` |
| `SearchPersons` | Search persons<br>Required: `GroupIds` |
| `SearchPersonsReturnsByGroup` | Search persons returns by group<br>Required: `GroupIds` |
| `GetGroupList` | Get group list |
## Mutations (gated — need allowlist, 16)

| Action | What it does |
|---|---|
| `CreateGroup` | Create group<br>Required: `GroupName`, `GroupId` |
| `CreateFace` | Create face<br>Required: `PersonId` |
| `AnalyzeFace` | Analyze face |
| `CopyPerson` | Copy person<br>Required: `PersonId`, `GroupIds` |
| `VerifyFace` | Verify face<br>Required: `PersonId` |
| `AnalyzeDenseLandmarks` | Analyze dense landmarks |
| `UpgradeGroupFaceModelVersion` | Upgrade group face model version<br>Required: `GroupId`, `FaceModelVersion` |
| `RevertGroupFaceModelVersion` | Run revert group face model version<br>Required: `JobId` |
| `CreatePerson` | Create person<br>Required: `GroupId`, `PersonName`, `PersonId` |
| `CompareMaskFace` | Compare mask face |
| `DetectFaceSimilarity` | Detect face similarity |
| `DetectFace` | Detect face |
| `VerifyPerson` | Verify person<br>Required: `PersonId` |
| `DetectFaceAttributes` | Detect face attributes |
| `DetectLiveFaceAccurate` | Detect live face accurate |
| `CompareFace` | Compare face |

## Blocked destructive actions (7)

`DeletePersonFromGroup`, `DeleteGroup`, `ModifyPersonBaseInfo`, `DeletePerson`, `ModifyGroup`, `ModifyPersonGroupInfo`, `DeleteFace` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iai`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200303` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iai"`) for the allow/block decision and reason.

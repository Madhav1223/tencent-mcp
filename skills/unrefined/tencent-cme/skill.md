---
name: tencent-cme
description: Tencent Cloud CME via the Tencent MCP server — 52 actions in API version v20191029 (20 read-only auto-allowed). Use for video, team, class, encoding, material, media. Triggers on mentions of cme, video, team, class, encoding, material, media, authorization, preset. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Media & real-time communication
metadata:
  version: "4"
---

# Tencent Cloud CME

Media & real-time communication: 52 actions in API version `v20191029` — 20 read-only (auto-allowed), 19 gated mutations, 13 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cme"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Media workflows are multi-step (upload → process → publish/playback) — confirm each stage's output exists before starting the next.
Transcode and processing templates are separate resources: reference them by ID, and preview on a short sample before batch runs.
Live push/playback domains need ICP-style filing and CNAME wiring in some regions — verify domain status before going live.
Recordings and screenshots land in object storage — confirm the storage binding and retention before events you must keep.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cme/v20191029 — action signatures in `cme_client.ts`, full request/response shapes in `cme_models.ts`.

## Read actions (auto-allowed, 20)

| Action | What it does |
|---|---|
| `DescribeTasks` | Describe tasks<br>Required: `Platform` |
| `DescribeTeams` | Describe teams<br>Required: `Platform` |
| `DescribeVideoEncodingPresets` | Describe video encoding presets<br>Required: `Platform` |
| `ExportVideoEditProject` | Export video edit project<br>Required: `Platform`, `ProjectId`, `Definition` (format `MP4…`), `ExportDestination` |
| `DescribeSharedSpace` | Describe shared space<br>Required: `Platform`, `Authorizee` |
| `ExportVideoByVideoSegmentationData` | Export video by video segmentation data<br>Required: `Platform`, `ProjectId`, `SegmentGroupId`, `SegmentIds`, `Definition` (format `MP4…`), `ExportDestination` |
| `SearchMaterial` | Search material<br>Required: `Platform`, `SearchScopes` |
| `DescribeJoinTeams` | Describe join teams<br>Required: `Platform`, `MemberId` |
| `DescribeResourceAuthorization` | Describe resource authorization<br>Required: `Platform` |
| `ExportVideoByEditorTrackData` | Export video by editor track data<br>Required: `Platform`, `Definition` (format `MP4…`; default Id), `ExportDestination`, `TrackData` |
| `DescribeClass` | Describe class<br>Required: `Platform`, `Owner` |
| `DescribeTaskDetail` | Describe task detail<br>Required: `Platform`, `TaskId` |
| `DescribeProjects` | Describe projects<br>Required: `Platform` |
| `DescribeLoginStatus` | Describe login status<br>Required: `Platform`, `UserIds` |
| `DescribeMaterials` | Describe materials<br>Required: `Platform`, `MaterialIds` |
| `DescribeAccounts` | Describe accounts<br>Required: `Platform` |
| `DescribePlatforms` | Describe platforms |
| `ListMedia` | List media<br>Required: `Platform`, `ClassPath`, `Owner` |
| `ExportVideoByTemplate` | Export video by template<br>Required: `Platform`, `TemplateId`, `Definition` (format `MP4…`; default Id), `ExportDestination` |
| `DescribeTeamMembers` | Describe team members<br>Required: `Platform`, `TeamId` |
## Mutations (gated — need allowlist, 19)

| Action | What it does |
|---|---|
| `GenerateVideoSegmentationSchemeByAi` | Generate video segmentation scheme by ai<br>Required: `Platform`, `ProjectId` |
| `GrantResourceAuthorization` | Grant resource authorization<br>Required: `Platform`, `Owner`, `Resources`, `Authorizees`, `Permissions` |
| `ParseEvent` | Run parse event<br>Required: `Platform`, `EventContent` |
| `ImportMaterial` | Import material<br>Required: `Platform`, `Owner`, `Name` |
| `CreateVideoEncodingPreset` | Create video encoding preset<br>Required: `Platform`, `Name` |
| `AddTeamMember` | Add team member<br>Required: `Platform`, `TeamId`, `TeamMembers` |
| `MoveClass` | Move class<br>Required: `Platform`, `Owner`, `SourceClassPath`, `DestinationClassPath` |
| `CreateLink` | Create link<br>Required: `Platform`, `Type`, `Name`, `Owner`, `DestinationId`, `DestinationOwner` |
| `HandleMediaCastProject` | Run handle media cast project<br>Required: `Platform`, `ProjectId`, `Operation` |
| `HandleStreamConnectProject` | Run handle stream connect project<br>Required: `Platform`, `ProjectId`, `Operation` |
| `CreateTeam` | Create team<br>Required: `Platform`, `Name`, `OwnerId` |
| `CreateClass` | Create class<br>Required: `Platform`, `Owner`, `ClassPath` |
| `RevokeResourceAuthorization` | Revoke resource authorization<br>Required: `Platform`, `Owner`, `Resources`, `Authorizees`, `Permissions` |
| `ImportMediaToProject` | Import media to project<br>Required: `Platform`, `ProjectId` |
| `ForbidAccount` | Forbid account<br>Required: `Platform`, `UserId` |
| `CreateProject` | Create project<br>Required: `Platform`, `Name`, `Owner`, `Category` |
| `MoveResource` | Move resource<br>Required: `Platform`, `SourceResource`, `DestinationResource` |
| `FlattenListMedia` | Run flatten list media<br>Required: `Platform`, `ClassPath`, `Owner` |
| `CopyProject` | Copy project<br>Required: `Platform`, `ProjectId` |

## Blocked destructive actions (13)

`DeleteAccount`, `ModifyTeam`, `DeleteMaterial`, `ModifyMaterial`, `DeleteTeam`, `ModifyTeamMember`, `ModifyVideoEncodingPreset`, `DeleteVideoEncodingPreset`, `DeleteTeamMembers`, `DeleteLoginStatus`, `ModifyProject`, `DeleteClass`, `DeleteProject` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cme`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20191029` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cme"`) for the allow/block decision and reason.

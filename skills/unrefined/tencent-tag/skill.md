---
name: tencent-tag
description: Tencent Cloud TAG via the Tencent MCP server — 31 actions in API version v20180813 (16 read-only auto-allowed). Use for tags, keys, values, value, projects, union. Triggers on mentions of tag, tags, keys, values, value, projects, union. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Meta services (tags, regions, quotas)
metadata:
  version: "4"
---

# Tencent Cloud TAG

Meta services (tags, regions, quotas): 31 actions in API version `v20180813` — 16 read-only (auto-allowed), 10 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tag"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Tag, region, and quota services describe the account itself — use them to ground every other task (valid regions, limits, tag coverage).
Quota increases are requests, not instant grants — submit early and track status.
Tagging is eventually consistent in cost views — allow lag before reconciling spend by tag.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tag/v20180813 — action signatures in `tag_client.ts`, full request/response shapes in `tag_models.ts`.

## Read actions (auto-allowed, 16)

| Action | What it does |
|---|---|
| `DescribeResourceTagsByTagKeys` | Describe resource tags by tag keys<br>Required: `ServiceType`, `ResourcePrefix`, `ResourceRegion`, `ResourceIds`, `TagKeys` |
| `GetTagValues` | Get tag values<br>Required: `TagKeys` |
| `DescribeResourceTagsByResourceIds` | Describe resource tags by resource ids<br>Required: `ServiceType`, `ResourcePrefix`, `ResourceIds`, `ResourceRegion` |
| `DescribeResourceTagsByResourceIdsSeq` | Describe resource tags by resource ids seq<br>Required: `ServiceType`, `ResourcePrefix`, `ResourceIds`, `ResourceRegion` |
| `GetTags` | Get tags |
| `DescribeResourcesByTags` | Describe resources by tags<br>Required: `TagFilters` |
| `GetResources` | Get resources |
| `DescribeResourceTags` | Describe resource tags |
| `DescribeTagsSeq` | Describe tags seq |
| `DescribeTagValues` | Describe tag values<br>Required: `TagKeys` |
| `DescribeTags` | Describe tags |
| `DescribeProjects` | Describe projects<br>Required: `AllList`, `Limit`, `Offset` |
| `DescribeTagKeys` | Describe tag keys |
| `DescribeTagValuesSeq` | Describe tag values seq<br>Required: `TagKeys` |
| `DescribeResourcesByTagsUnion` | Describe resources by tags union<br>Required: `TagFilters` |
| `GetTagKeys` | Get tag keys |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `UpdateResourceTagValue` | Update resource tag value<br>Required: `TagKey`, `TagValue`, `Resource` |
| `AddProject` | Add project<br>Required: `ProjectName` |
| `AddResourceTag` | Add resource tag<br>Required: `TagKey`, `TagValue`, `Resource` |
| `AttachResourcesTag` | Attach resources tag<br>Required: `ServiceType`, `ResourceIds`, `TagKey`, `TagValue` |
| `CreateTag` | Create tag<br>Required: `TagKey`, `TagValue` |
| `DetachResourcesTag` | Detach resources tag<br>Required: `ServiceType`, `ResourceIds`, `TagKey` |
| `TagResources` | Tag resources<br>Required: `ResourceList`, `Tags` |
| `UnTagResources` | Run un tag resources<br>Required: `ResourceList`, `TagKeys` |
| `CreateTags` | Create tags |
| `UpdateProject` | Update project<br>Required: `ProjectId` |

## Blocked destructive actions (5)

`DeleteTags`, `ModifyResourcesTagValue`, `DeleteTag`, `DeleteResourceTag`, `ModifyResourceTags` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tag`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180813` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tag"`) for the allow/block decision and reason.

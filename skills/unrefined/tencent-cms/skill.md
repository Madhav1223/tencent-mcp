---
name: tencent-cms
description: Tencent Cloud CMS via the Tencent MCP server — 6 actions in API version v20190321 (2 read-only auto-allowed). Use for samples, keywords, moderation, image, libs, text. Triggers on mentions of cms, samples, keywords, moderation, image, libs, text. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CMS

General service: 6 actions in API version `v20190321` — 2 read-only (auto-allowed), 3 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cms"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cms/v20190321 — action signatures in `cms_client.ts`, full request/response shapes in `cms_models.ts`.

## Read actions (auto-allowed, 2)

| Action | What it does |
|---|---|
| `DescribeLibSamples` | Describe lib samples<br>Required: `Limit`, `Offset` |
| `DescribeKeywordsLibs` | Describe keywords libs<br>Required: `Limit`, `Offset` |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `TextModeration` | Run text moderation<br>Required: `Content` |
| `ImageModeration` | Image moderation |
| `CreateKeywordsSamples` | Create keywords samples<br>Required: `UserKeywords` |

## Blocked destructive actions (1)

`DeleteLibSamples` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cms`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190321` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cms"`) for the allow/block decision and reason.

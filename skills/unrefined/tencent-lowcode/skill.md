---
name: tencent-lowcode
description: Tencent Cloud LOWCODE via the Tencent MCP server — 17 actions in API version v20210108 (9 read-only auto-allowed). Use for knowledge, document, deploy, apps, bind, related. Triggers on mentions of lowcode, knowledge, document, deploy, apps, bind, related, role, source. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: DevOps & app platforms
metadata:
  version: "4"
---

# Tencent Cloud LOWCODE

DevOps & app platforms: 17 actions in API version `v20210108` — 9 read-only (auto-allowed), 5 gated mutations, 3 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "lowcode"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Environments (dev/test/prod) are isolated — confirm which environment every deploy or config change targets.
Deployments are async with revisions — after release, poll the deployment/revision status until stable and keep the previous revision for rollback.
Service discovery and config centers decouple code from endpoints — update config entries explicitly; code deploys alone don't move traffic.
Microservice gateways need route publication after changes — unpublished edits serve stale behavior.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/lowcode/v20210108 — action signatures in `lowcode_client.ts`, full request/response shapes in `lowcode_models.ts`.

## Read actions (auto-allowed, 9)

| Action | What it does |
|---|---|
| `CheckDeployApp` | Check deploy app<br>Required: `EnvId`, `Id`, `BuildId` |
| `DescribeApps` | Describe apps<br>Required: `Limit`, `Offset` |
| `DescribeRelatedUsers` | Describe related users<br>Required: `RoleId`, `EnvId`, `PageNo`, `PageSize` |
| `DescribeKnowledgeSetList` | Describe knowledge set list<br>Required: `EnvId` |
| `SearchDocList` | Search doc list<br>Required: `EnvId` |
| `DescribeDataSourceList` | Describe data source list<br>Required: `PageSize`, `PageIndex`, `EnvId` |
| `DescribeKnowledgeDocumentSetDetail` | Describe knowledge document set detail<br>Required: `EnvId`, `CollectionView` |
| `DescribeKnowledgeDocumentSetList` | Describe knowledge document set list<br>Required: `EnvId`, `CollectionView` |
| `DescribeResourceRoleList` | Describe resource role list<br>Required: `ResourceId`, `ResourceType`, `EnvType`, `EnvId` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `CreateKnowledgeSet` | Create knowledge set<br>Required: `EnvId`, `Name`, `Title` |
| `UpdateKnowledgeSet` | Update knowledge set<br>Required: `EnvId`, `Name` |
| `PutWxAppIdToWeApp` | Put wx app id to we app<br>Required: `WeAppId`, `WxAppId` |
| `UploadKnowledgeDocumentSet` | Upload knowledge document set<br>Required: `EnvId`, `CollectionView`, `FileName`, `CosUrl` |
| `DeployApp` | Deploy app<br>Required: `EnvId`, `Id` |

## Blocked destructive actions (3)

`DeleteKnowledgeDocumentSet`, `DeleteAppBindWxApp`, `DeleteKnowledgeSet` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `lowcode`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210108` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="lowcode"`) for the allow/block decision and reason.

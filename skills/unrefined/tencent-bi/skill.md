---
name: tencent-bi
description: Tencent Cloud BI via the Tencent MCP server — 55 actions in API version v20220105 (19 read-only auto-allowed). Use for role, datasource, auth, member, permission, embed. Triggers on mentions of bi, role, datasource, auth, member, permission, embed, page, table. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Analytics & streaming jobs
metadata:
  version: "4"
---

# Tencent Cloud BI

Analytics & streaming jobs: 55 actions in API version `v20220105` — 19 read-only (auto-allowed), 16 gated mutations, 20 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bi"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Streaming jobs are long-running and billed while active — stop or suspend idle jobs; confirm job state after every start/stop call.
Job SQL/configuration is versioned separately from the running job — updating code requires an explicit restart/redeploy to take effect.
Checkpoints/savepoints guard exactly-once semantics: trigger one before any stop or upgrade, and resume from it on restart.
Scale parallelism from observed backpressure, not guesses — read the job metrics first.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bi/v20220105 — action signatures in `bi_client.ts`, full request/response shapes in `bi_models.ts`.

## Read actions (auto-allowed, 19)

| Action | What it does |
|---|---|
| `DescribePermissionRanksInfo` | Describe permission ranks info |
| `DescribeDatasourceList` | Describe datasource list<br>Required: `ProjectId` |
| `DescribeAuthApiKeyList` | Describe auth api key list |
| `DescribeUserGroupTreeList` | Describe user group tree list |
| `DescribeProjectInfo` | Describe project info<br>Required: `Id` |
| `DescribePermissionStatusInfo` | Describe permission status info |
| `DescribeResourceUserGroupPageList` | Describe resource user group page list |
| `DescribeUserGroupInfo` | Describe user group info |
| `DescribeAuthApiKeyInfo` | Describe auth api key info<br>Required: `ApiKey` |
| `DescribePageWidgetList` | Describe page widget list<br>Required: `ProjectId`, `PageId` |
| `DescribeUserRoleProjectList` | Describe user role project list<br>Required: `PageNo`, `PageSize`, `ProjectId` |
| `QueryUserGroupMember` | Query user group member |
| `DescribeUserRoleList` | Describe user role list<br>Required: `PageNo`, `PageSize` |
| `DescribeUserGroupMemberList` | Describe user group member list |
| `DescribeSourceFieldList` | Describe source field list |
| `DescribePermissionRoleInfo` | Describe permission role info<br>Required: `ProjectId` |
| `DescribeUserProjectList` | Describe user project list |
| `ExportScreenPage` | Export screen page<br>Required: `ProjectId`, `PageId` |
| `DescribeProjectList` | Describe project list |
## Mutations (gated — need allowlist, 16)

| Action | What it does |
|---|---|
| `CreateDatasource` | Create datasource<br>Required: `DbHost`, `DbPort`, `ServiceType`, `DbType`, `Charset`, `DbUser`, `DbPwd`, `DbName`, `SourceName`, `ProjectId` |
| `CreatePermissionRanks` | Create permission ranks |
| `CreateTagTable` | Create tag table |
| `CreateProject` | Create project<br>Required: `Name`, `ColorCode` |
| `EditCorpTag` | Run edit corp tag |
| `CreateDatasourceCloud` | Create datasource cloud<br>Required: `ServiceType`, `DbType`, `Charset`, `DbUser`, `DbPwd`, `DbName`, `SourceName`, `ProjectId` |
| `CreateEmbedToken` | Create embed token |
| `CreateUserRole` | Create user role |
| `CreateUserGroupMember` | Create user group member |
| `CreateCorpTag` | Create corp tag |
| `ClearEmbedToken` | Run clear embed token<br>Required: `ProjectId`, `UserCorpId`, `Scope` |
| `CreateDataTable` | Create data table<br>Required: `Type`, `Name`, `ProjectId` |
| `CreateUserRoleProject` | Create user role project |
| `ApplyEmbedInterval` | Run apply embed interval |
| `CreateUserGroup` | Create user group |
| `CreateAuthApiKey` | Create auth api key |

## Blocked destructive actions (20)

`ModifyDatasource`, `DeleteUserGroupMember`, `DeleteAuthApiKey`, `ModifyUserRole`, `DeleteUserGroup`, `ModifyUserTag`, `DeleteDatasource`, `DeleteUserRole`, `ModifyUserGroup`, `ModifyProject`, `DeleteProject`, `ModifyDatasourceCloud`, `ModifyUserRoleProject`, `ModifyUserDetailInfo`, `ModifyResourceUser`, `ModifyTagTable`, `ModifyAuthApiKey`, `DeleteUserRoleProject`, `ModifyResourceUserGroupResource`, `ModifyResourceUserGroup` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bi`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220105` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bi"`) for the allow/block decision and reason.

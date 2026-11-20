---
name: tencent-ciam
description: Tencent Cloud CIAM via the Tencent MCP server — 23 actions in API version v20220331 (8 read-only auto-allowed). Use for store, password, condition, export, import, jobs. Triggers on mentions of ciam, store, password, condition, export, import, jobs, link, message. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud CIAM

Security & identity: 23 actions in API version `v20220331` — 8 read-only (auto-allowed), 11 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ciam"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ciam/v20220331 — action signatures in `ciam_client.ts`, full request/response shapes in `ciam_models.ts`.

## Read actions (auto-allowed, 8)

| Action | What it does |
|---|---|
| `ListJobs` | List jobs<br>Required: `UserStoreId` |
| `DescribeUser` | Describe user<br>Required: `UserStoreId`, `Pageable` |
| `ListUserGroups` | List user groups<br>Required: `UserStoreId`, `Pageable` |
| `ListUser` | List user<br>Required: `UserStoreId`, `Pageable` |
| `ListUserByProperty` | List user by property<br>Required: `UserStoreId`, `PropertyCode`, `PropertyValue` |
| `DescribeUserById` | Describe user by id<br>Required: `UserStoreId`, `UserId` |
| `ListUserStore` | List user store |
| `ListLogMessageByCondition` | List log message by condition<br>Required: `UserStoreId`, `Pageable`, `StartTime` |
## Mutations (gated — need allowlist, 11)

| Action | What it does |
|---|---|
| `UpdateUserStatus` | Update user status<br>Required: `UserStoreId`, `UserId`, `Status` |
| `UpdateUserStore` | Update user store<br>Required: `UserPoolId` |
| `CreateApiImportUserJob` | Create api import user job<br>Required: `UserStoreId`, `DataFlowUserCreateList` |
| `LinkAccount` | Run link account<br>Required: `UserStoreId`, `PrimaryUserId`, `SecondaryUserId`, `UserLinkedOnAttribute` |
| `UpdateUser` | Update user<br>Required: `UserId`, `UserStoreId` |
| `UpdateUserGroup` | Update user group<br>Required: `UserGroupId`, `DisplayName`, `UserStoreId` |
| `CreateUserStore` | Create user store<br>Required: `UserPoolName` |
| `SetPassword` | Set password<br>Required: `UserStoreId`, `UserId`, `Password` |
| `CreateFileExportUserJob` | Create file export user job<br>Required: `UserStoreId` |
| `CreateUserGroup` | Create user group<br>Required: `DisplayName`, `UserStoreId` |
| `CreateUser` | Create user<br>Required: `UserStoreId`, `PhoneNumber`, `Email`, `Password`, `UserName` |

## Blocked destructive actions (4)

`DeleteUserStore`, `DeleteUserGroups`, `ResetPassword`, `DeleteUsers` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ciam`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220331` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ciam"`) for the allow/block decision and reason.

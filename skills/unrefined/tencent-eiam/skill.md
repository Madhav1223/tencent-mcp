---
name: tencent-eiam
description: Tencent Cloud EIAM via the Tencent MCP server — 42 actions in API version v20210420 (22 read-only auto-allowed). Use for node, applications, application, authorization, authorized, from. Triggers on mentions of eiam, node, applications, application, authorization, authorized, from, remove, authorizations. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud EIAM

Security & identity: 42 actions in API version `v20210420` — 22 read-only (auto-allowed), 8 gated mutations, 12 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "eiam"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/eiam/v20210420 — action signatures in `eiam_client.ts`, full request/response shapes in `eiam_models.ts`.

## Read actions (auto-allowed, 22)

| Action | What it does |
|---|---|
| `DescribeUserGroup` | Describe user group<br>Required: `UserGroupId` |
| `DescribeOrgResourcesAuthorization` | Describe org resources authorization<br>Required: `ApplicationId`, `OrgNodeId` |
| `DescribePublicKey` | Describe public key<br>Required: `ApplicationId` |
| `ListUsers` | List users |
| `ListAccountInAccountGroup` | List account in account group<br>Required: `AccountGroupId` |
| `ListAuthorizedApplicationsToUserGroup` | List authorized applications to user group<br>Required: `UserGroupId` |
| `ListApplicationAuthorizations` | List application authorizations<br>Required: `EntityType` |
| `DescribeUserResourcesAuthorization` | Describe user resources authorization<br>Required: `ApplicationId` |
| `DescribeUserThirdPartyAccountInfo` | Describe user third party account info |
| `ListUserGroups` | List user groups |
| `DescribeAccountGroup` | Describe account group<br>Required: `ApplicationId` |
| `DescribeUserGroupResourcesAuthorization` | Describe user group resources authorization<br>Required: `ApplicationId`, `UserGroupId` |
| `ListUsersInUserGroup` | List users in user group<br>Required: `UserGroupId` |
| `ListUserGroupsOfUser` | List user groups of user<br>Required: `UserId` |
| `ListAuthorizedApplicationsToUser` | List authorized applications to user<br>Required: `UserId` |
| `DescribeAppAccount` | Describe app account<br>Required: `ApplicationId` |
| `DescribeOrgNode` | Describe org node |
| `DescribeUserInfo` | Describe user info |
| `ListApplications` | List applications |
| `ListAuthorizedApplicationsToOrgNode` | List authorized applications to org node<br>Required: `OrgNodeId` |
| `DescribeApplication` | Describe application |
| `ListUsersInOrgNode` | List users in org node |
## Mutations (gated — need allowlist, 8)

| Action | What it does |
|---|---|
| `CreateAccountGroup` | Create account group<br>Required: `ApplicationId`, `GroupName` |
| `AddUserToUserGroup` | Add user to user group<br>Required: `UserIds`, `UserGroupId` |
| `CreateAppAccount` | Create app account<br>Required: `ApplicationId`, `AccountName` |
| `CreateOrgNode` | Create org node<br>Required: `DisplayName` |
| `AddAccountToAccountGroup` | Add account to account group<br>Required: `AccountGroupId` |
| `CreateUserGroup` | Create user group<br>Required: `DisplayName` |
| `CreateUser` | Create user<br>Required: `UserName`, `Password` |
| `UpdateOrgNode` | Update org node<br>Required: `OrgNodeId`, `DisplayName` |

## Blocked destructive actions (12)

`ModifyUserInfo`, `RemoveAccountFromAccountGroup`, `ModifyAccountGroup`, `ModifyAppAccount`, `DeleteUserGroup`, `DeleteAccountGroup`, `ModifyApplication`, `DeleteAppAccount`, `DeleteUsers`, `RemoveUserFromUserGroup`, `DeleteUser`, `DeleteOrgNode` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `eiam`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210420` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="eiam"`) for the allow/block decision and reason.

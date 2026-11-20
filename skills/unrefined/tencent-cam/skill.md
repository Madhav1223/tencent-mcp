---
name: tencent-cam
description: Manages Tencent Cloud access control (CAM) — users, groups, roles, policies, SAML/OIDC providers, MFA, and access keys. Use when granting permissions, auditing who can do what, creating sub-accounts, or debugging UnauthorizedOperation errors. Triggers on mentions of CAM, IAM, user, group, role, policy, MFA, access key, SAML, OIDC, permissions, or unauthorized operation. Read actions (Get/List/Describe) pass automatically; all Create/Delete/Attach/Detach/Update mutations are gated.
metadata:
  version: "1"
---

# Tencent Cloud CAM

Access control for Tencent Cloud: users, groups, roles, policies, identity federation, MFA, and keys. API version `v20190116`.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cam"`, plus `get_audit_policy` to confirm what is allowed before attempting a mutation.

## Procedures

| User need | Do this |
|---|---|
| Audit what an identity can do | `GetUser` + `ListAttachedUserPolicies` + `ListGroupsForUser`, then `GetPolicy` per policy |
| List all users / groups / roles | `ListUsers` / `ListGroups` / `DescribeRoleList` (paginated — pass `Page`/`Rp`) |
| Check which policies grant access to a service | `ListPoliciesGrantingServiceAccess` with `{"ServiceType": "<svc>"}` |
| Trace where a policy is attached | `ListEntitiesForPolicy` with `{"PolicyId": <id>}` |
| Create a sub-account + key | `AddUser` (or `CreateUser`), then `CreateAccessKey` with `{"TargetUin": <uin>}` (omit for the current user) |
| Grant a permission | `AttachUserPolicy` / `AttachGroupPolicy` / `AttachRolePolicy` with `PolicyId` — **gated, see Safety** |
| Federate an IdP | `CreateSAMLProvider` / `CreateOIDCConfig`, then `CreateRole` with the trust policy |
| Rotate a compromised key | `DeleteAccessKey` + `CreateAccessKey` — **gated** |
| Permission boundaries | `GetUserPermissionBoundary`, `PutUserPermissionsBoundary` — **gated** |

## Safety

- **Auto-allowed:** `Get*`, `List*`, `Describe*` (inventory, audits, reads).
- **Gated (deny-by-default):** every `Create*`, `Delete*`, `Attach*`, `Detach*`, `Update*`, `Add*`, `Remove*`. These need an explicit `TENCENT_MCP_ALLOW_MUTATIONS` entry such as `cam:AttachUserPolicy`, otherwise the call is blocked before reaching Tencent Cloud.
- **Extra caution:** `CreatePolicyVersion` / `SetDefaultPolicyVersion` change effective permissions account-wide. State the exact policy document and get human confirmation first.

## Mistakes to avoid

- **Uin vs AppId:** most CAM actions take the numeric `Uin` of the sub-account, not the root AppId. Get it from `GetUser` or `ListUsers` first.
- `UnauthorizedOperation` on another service usually means a CAM problem — audit with `ListPoliciesGrantingServiceAccess` before changing anything.
- Policy documents are JSON strings, not objects — pass `PolicyDocument` as a stringified JSON policy.
- `DeleteUser` fails while keys or group memberships exist — remove those first (`DeleteAccessKey`, `RemoveUserFromGroup`).

## Verify

- After any grant, re-run `ListAttachedUserPolicies` (or the group/role equivalent) and confirm the policy appears.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cam"`) for the allow/block decision and reason.

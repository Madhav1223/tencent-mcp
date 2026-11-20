---
name: tencent-organization
description: Tencent Cloud ORGANIZATION via the Tencent MCP server — 134 actions in API version v20210331 (53 read-only auto-allowed). Use for organization, member, share, role, unit, configuration. Triggers on mentions of organization, organization, member, share, role, unit, configuration, members, auth. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud ORGANIZATION

Security & identity: 134 actions in API version `v20210331` — 53 read-only (auto-allowed), 57 gated mutations, 24 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "organization"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/organization/v20210331 — action signatures in `organization_client.ts`, full request/response shapes in `organization_models.ts`.

## Read actions (auto-allowed, 53)

| Action | What it does |
|---|---|
| `ListGroupMembers` | List group members<br>Required: `ZoneId`, `GroupId` |
| `ListOrganizationIdentity` | List organization identity<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `DescribeEffectivePolicy` | Describe effective policy<br>Required: `TargetId` |
| `GetUser` | Get user<br>Required: `UserId`, `ZoneId` |
| `ListGroups` | List groups<br>Required: `ZoneId` |
| `GetRoleConfiguration` | Get role configuration<br>Required: `ZoneId`, `RoleConfigurationId` |
| `DescribeOrganizationMemberEmailBind` | Describe organization member email bind<br>Required: `MemberUin` |
| `ListTasks` | List tasks<br>Required: `ZoneId` |
| `DescribeOrganizationFinancialByProduct` | Describe organization financial by product<br>Required: `Month` (format `yyyy-mm…`) |
| `DescribeOrganizationNodes` | Describe organization nodes<br>Required: `Limit`, `Offset` (default 0) |
| `ListExternalSAMLIdPCertificates` | List external samlid pcertificates<br>Required: `ZoneId` |
| `CheckAccountDelete` | Check account delete<br>Required: `MemberUin` |
| `DescribeOrganizationMembers` | Describe organization members<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `ListUsers` | List users<br>Required: `ZoneId` |
| `DescribePolicy` | Describe policy<br>Required: `PolicyId` |
| `GetExternalSAMLIdentityProvider` | Get external samlidentity provider<br>Required: `ZoneId` |
| `DescribeShareUnitNodes` | Describe share unit nodes<br>Required: `UnitId`, `Offset` (default 0), `Limit` |
| `DescribeOrganizationFinancialByMember` | Describe organization financial by member<br>Required: `Month` (format `yyyy-mm…`) |
| `GetGroup` | Get group<br>Required: `ZoneId`, `GroupId` |
| `ListJoinedGroupsForUser` | List joined groups for user<br>Required: `ZoneId`, `UserId` |
| `ListPermissionPoliciesInRoleConfiguration` | List permission policies in role configuration<br>Required: `ZoneId`, `RoleConfigurationId` |
| `DescribeOrganizationMemberAuthAccounts` | Describe organization member auth accounts<br>Required: `Offset` (default 0), `Limit` (default 10), `MemberUin`, `PolicyId` |
| `ListRoleConfigurationProvisionings` | List role configuration provisionings<br>Required: `ZoneId` |
| `DescribePolicyConfig` | Describe policy config<br>Required: `OrganizationId` |
| `DescribeShareUnits` | Describe share units<br>Required: `Area`, `Offset` (default 0), `Limit` |
| `ListUserSyncProvisionings` | List user sync provisionings<br>Required: `ZoneId` |
| `DescribeShareUnitMembers` | Describe share unit members<br>Required: `UnitId`, `Area`, `Offset` (default 0), `Limit` |
| `DescribeResourceToShareMember` | Describe resource to share member<br>Required: `Area`, `Offset` (default 0), `Limit` |
| `ListOrgServiceAssignMember` | List org service assign member<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `ListNonCompliantResource` | List non compliant resource<br>Required: `MaxResults`, `MemberUin` |
| `GetSCIMSynchronizationStatus` | Get scimsynchronization status<br>Required: `ZoneId` |
| `ListPoliciesForTarget` | List policies for target<br>Required: `TargetId` |
| `GetUserSyncProvisioning` | Get user sync provisioning<br>Required: `ZoneId`, `UserProvisioningId` |
| `DescribeOrganization` | Describe organization |
| `DescribeShareUnitResources` | Describe share unit resources<br>Required: `UnitId`, `Area`, `Offset` (default 0), `Limit` |
| `DescribeOrganizationMembersAuthPolicy` | Describe organization members auth policy<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `GetProvisioningTaskStatus` | Get provisioning task status<br>Required: `ZoneId`, `TaskId` |
| `GetIPWhitelist` | Get ipwhitelist |
| `DescribeOrganizationAuthNode` | Describe organization auth node<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `DescribeIdentityCenter` | Describe identity center |
| `DescribeOrganizationMemberAuthIdentities` | Describe organization member auth identities<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `GetZoneStatistics` | Get zone statistics<br>Required: `ZoneId` |
| `ListSCIMCredentials` | List scimcredentials<br>Required: `ZoneId` |
| `DescribeOrganizationFinancialByMonth` | Describe organization financial by month |
| `ListRoleAssignments` | List role assignments<br>Required: `ZoneId` |
| `DescribeOrganizationMemberPolicies` | Describe organization member policies<br>Required: `Offset` (default 0), `Limit` (default 10), `MemberUin` |
| `ListRoleConfigurations` | List role configurations<br>Required: `ZoneId` |
| `DescribeShareAreas` | Describe share areas |
| `GetZoneSAMLServiceProviderInfo` | Get zone samlservice provider info<br>Required: `ZoneId` |
| `ListTargetsForPolicy` | List targets for policy<br>Required: `PolicyId` |
| `ListPolicies` | List policies |
| `GetTaskStatus` | Get task status<br>Required: `ZoneId`, `TaskId` |
| `ListOrganizationService` | List organization service<br>Required: `Offset` (default 0), `Limit` (default 10) |
## Mutations (gated — need allowlist, 57)

| Action | What it does |
|---|---|
| `QuitOrganization` | Run quit organization<br>Required: `OrgId` |
| `BindOrganizationPolicySubAccount` | Bind organization policy sub account<br>Required: `PolicyId`, `OrgSubAccountUins` |
| `AddOrganizationNode` | Add organization node<br>Required: `ParentNodeId`, `Name` |
| `UpdateOrganizationMemberEmailBind` | Update organization member email bind<br>Required: `MemberUin`, `BindId`, `Email`, `CountryCode`, `Phone` |
| `UpdateSCIMCredentialStatus` | Update scimcredential status<br>Required: `ZoneId`, `CredentialId`, `NewStatus` |
| `UpdateUser` | Update user<br>Required: `ZoneId`, `UserId` |
| `CreateOrgServiceAssign` | Create org service assign<br>Required: `MemberUins` |
| `AddShareUnitNode` | Add share unit node<br>Required: `UnitId`, `NodeId` |
| `OpenIdentityCenter` | Open identity center<br>Required: `ZoneName` |
| `CreateOrganizationMember` | Create organization member<br>Required: `Name`, `PolicyType` (Financial), `PermissionIds`, `NodeId`, `AccountName` |
| `CreateUser` | Create user<br>Required: `ZoneId`, `UserName` |
| `CreateRoleAssignment` | Create role assignment<br>Required: `ZoneId` |
| `CreateRoleConfiguration` | Create role configuration<br>Required: `ZoneId`, `RoleConfigurationName` |
| `AcceptJoinShareUnitInvitation` | Run accept join share unit invitation<br>Required: `UnitId` |
| `ClearExternalSAMLIdentityProvider` | Run clear external samlidentity provider<br>Required: `ZoneId` |
| `UpdateOrganizationIdentity` | Update organization identity<br>Required: `IdentityId`, `Description`, `IdentityPolicy` |
| `ProvisionRoleConfiguration` | Run provision role configuration<br>Required: `ZoneId`, `RoleConfigurationId`, `TargetType`, `TargetUin` |
| `CreateOrganizationMembersPolicy` | Create organization members policy<br>Required: `MemberUins`, `PolicyName`, `IdentityId` |
| `MoveOrganizationNodeMembers` | Move organization node members<br>Required: `NodeId`, `MemberUin` |
| `UpdateZone` | Update zone<br>Required: `ZoneId`, `NewZoneName` |
| `CreateOrganizationIdentity` | Create organization identity<br>Required: `IdentityAliasName`, `IdentityPolicy` |
| `AddOrganizationMemberEmail` | Add organization member email<br>Required: `MemberUin`, `Email`, `CountryCode`, `Phone` |
| `AddShareUnit` | Add share unit<br>Required: `Name`, `Area` |
| `AddShareUnitMembers` | Add share unit members<br>Required: `UnitId`, `Area`, `Members` |
| `UpdatePolicy` | Update policy<br>Required: `PolicyId` |
| `UpdateOrganizationNode` | Update organization node<br>Required: `NodeId` |
| `DisablePolicyType` | Disable policy type<br>Required: `OrganizationId`, `PolicyType` (default SERVICE_CONTROL_POLICY) |
| `CreateUserSyncProvisioning` | Create user sync provisioning<br>Required: `ZoneId`, `UserSyncProvisionings` |
| `AddPermissionPolicyToRoleConfiguration` | Add permission policy to role configuration<br>Required: `ZoneId`, `RoleConfigurationId`, `RolePolicyType` |
| `UpdateUserStatus` | Update user status<br>Required: `ZoneId`, `UserId`, `NewUserStatus` |
| `UpdateOrganizationMembersPolicy` | Update organization members policy<br>Required: `MemberUins`, `PolicyId`, `IdentityId` |
| `CreateGroup` | Create group<br>Required: `ZoneId`, `GroupName` |
| `DismantleRoleConfiguration` | Run dismantle role configuration<br>Required: `ZoneId`, `RoleConfigurationId`, `TargetType`, `TargetUin` |
| `RejectJoinShareUnitInvitation` | Reject join share unit invitation<br>Required: `UnitId` |
| `SetExternalSAMLIdentityProvider` | Set external samlidentity provider<br>Required: `ZoneId` |
| `UpdateIPWhitelist` | Update ipwhitelist |
| `UpdateSCIMSynchronizationStatus` | Update scimsynchronization status<br>Required: `ZoneId`, `SCIMSynchronizationStatus` |
| `BindOrganizationMemberAuthAccount` | Bind organization member auth account<br>Required: `MemberUin`, `PolicyId`, `OrgSubAccountUins` |
| `UpdateGroup` | Update group<br>Required: `ZoneId`, `GroupId` |
| `CreatePolicy` | Create policy<br>Required: `Name`, `Content`, `Type` (default SERVICE_CONTROL_POLICY) |
| `UpdateShareUnit` | Update share unit<br>Required: `UnitId` |
| `UpdateOrganizationMember` | Update organization member<br>Required: `MemberUin` |
| `CreateSCIMCredential` | Create scimcredential<br>Required: `ZoneId` |
| `SendOrgMemberAccountBindEmail` | Send org member account bind email<br>Required: `MemberUin`, `BindId` |
| `DetachPolicy` | Detach policy<br>Required: `TargetId`, `TargetType`, `PolicyId` |
| `CreateOrganizationMemberAuthIdentity` | Create organization member auth identity<br>Required: `MemberUins`, `IdentityIds` |
| `UpdateRoleConfiguration` | Update role configuration<br>Required: `ZoneId`, `RoleConfigurationId` |
| `UpdateUserSyncProvisioning` | Update user sync provisioning<br>Required: `ZoneId`, `UserProvisioningId` |
| `InviteOrganizationMember` | Run invite organization member<br>Required: `MemberUin`, `Name`, `PolicyType` (Financial), `PermissionIds`, `NodeId` |
| `AddShareUnitResources` | Add share unit resources<br>Required: `UnitId`, `Area`, `Type`, `Resources` |
| `AttachPolicy` | Attach policy<br>Required: `TargetId`, `TargetType`, `PolicyId` |
| `AddUserToGroup` | Add user to group<br>Required: `ZoneId`, `GroupId`, `UserId` |
| `CreateOrganization` | Create organization |
| `AddExternalSAMLIdPCertificate` | Add external samlid pcertificate<br>Required: `ZoneId`, `X509Certificate` |
| `EnablePolicyType` | Enable policy type<br>Required: `OrganizationId`, `PolicyType` (default SERVICE_CONTROL_POLICY) |
| `CreateOrganizationMemberPolicy` | Create organization member policy<br>Required: `MemberUin`, `PolicyName`, `IdentityId` |
| `UpdateCustomPolicyForRoleConfiguration` | Update custom policy for role configuration<br>Required: `ZoneId`, `RoleConfigurationId`, `CustomPolicyName` |

## Blocked destructive actions (24)

`RemovePermissionPolicyFromRoleConfiguration`, `DeleteShareUnitResources`, `RemoveUserFromGroup`, `DeleteShareUnitNode`, `RemoveExternalSAMLIdPCertificate`, `CancelOrganizationPolicySubAccount`, `CancelOrganizationMemberAuthAccount`, `DeleteRoleAssignment`, `DeleteShareUnitMembers`, `DeleteOrganizationMembersPolicy`, `DeletePolicy`, `DeleteShareUnit`, `DeleteOrganizationMembers`, `DeleteGroup`, `DeleteOrganization`, `DeleteSCIMCredential`, `DeleteUser`, `DeleteAccount`, `DeleteOrganizationNodes`, `DeleteUserSyncProvisioning`, `DeleteRoleConfiguration`, `DeleteOrgServiceAssign`, `DeleteOrganizationIdentity`, `DeleteOrganizationMemberAuthIdentity` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `organization`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210331` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="organization"`) for the allow/block decision and reason.

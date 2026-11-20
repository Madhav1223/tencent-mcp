---
name: tencent-bh
description: Tencent Cloud BH via the Tencent MCP server — 109 actions in API version v20230418 (38 read-only auto-allowed). Use for device, access, sync, change, members, operation. Triggers on mentions of bh, device, access, sync, change, members, operation, white, asset. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud BH

Security & identity: 109 actions in API version `v20230418` — 38 read-only (auto-allowed), 37 gated mutations, 34 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bh"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bh/v20230418 — action signatures in `bh_client.ts`, full request/response shapes in `bh_models.ts`.

## Read actions (auto-allowed, 38)

| Action | What it does |
|---|---|
| `DescribeOperationTask` | Describe operation task |
| `DescribeDomains` | Describe domains |
| `DescribeUserDirectory` | Describe user directory |
| `SearchSubtaskResultById` | Search subtask result by id |
| `DescribeAssetSyncFlag` | Describe asset sync flag |
| `DescribeAccessWhiteListRules` | Describe access white list rules |
| `DescribeAssetSyncStatus` | Describe asset sync status<br>Required: `Category` |
| `DescribeOperationEvent` | Describe operation event |
| `DescribeAccountGroups` | Describe account groups |
| `DescribeLoginEvent` | Describe login event |
| `DescribeChangePwdTask` | Describe change pwd task |
| `SearchFile` | Search file<br>Required: `StartTime` |
| `SearchTaskResult` | Search task result |
| `SearchCommand` | Search command<br>Required: `StartTime` |
| `CheckLDAPConnection` | Check ldapconnection<br>Required: `Enable`, `Ip`, `Port`, `EnableSSL`, `BaseDN`, `AdminAccount`, `AdminPassword` |
| `DescribeUserGroups` | Describe user groups |
| `SearchSession` | Search session |
| `DescribeSecuritySetting` | Describe security setting |
| `DescribeResources` | Describe resources |
| `DescribeDeviceCount` | Describe device count |
| `SearchCommandBySid` | Search command by sid<br>Required: `Sid` |
| `SearchAuditLog` | Search audit log<br>Required: `StartTime` |
| `SearchSessionCommand` | Search session command<br>Required: `Cmd`, `StartTime` |
| `DescribeDepartments` | Describe departments |
| `DescribeLDAPUnitSet` | Describe ldapunit set<br>Required: `Enable`, `Ip`, `Port`, `EnableSSL`, `BaseDN`, `AdminAccount`, `AdminPassword`, `AttributeUserName`, `AttributeUnit` |
| `DescribeSourceTypes` | Describe source types |
| `DescribeDeviceAccounts` | Describe device accounts |
| `DescribeUsers` | Describe users |
| `DescribeUserGroupMembers` | Describe user group members<br>Required: `Id`, `Bound` |
| `SearchFileBySid` | Search file by sid<br>Required: `Sid`, `AuditLog` |
| `DescribeChangePwdTaskDetail` | Describe change pwd task detail<br>Required: `OperationId` |
| `DescribeDeviceGroupMembers` | Describe device group members<br>Required: `Bound` |
| `DescribeUserSyncStatus` | Describe user sync status<br>Required: `UserKind` |
| `DescribeAcls` | Describe acls |
| `DescribeCmdTemplates` | Describe cmd templates |
| `DescribeDeviceCountSummary` | Describe device count summary |
| `DescribeDeviceGroups` | Describe device groups |
| `DescribeDevices` | Describe devices |
## Mutations (gated — need allowlist, 37)

| Action | What it does |
|---|---|
| `ImportExternalDevice` | Import external device<br>Required: `DeviceSet` |
| `CreateAssetSyncJob` | Create asset sync job<br>Required: `Category` |
| `CreateSyncUserTask` | Create sync user task<br>Required: `UserKind` |
| `DisableClientTcpAccess` | Disable client tcp access<br>Required: `ResourceId` |
| `CreateUserGroup` | Create user group<br>Required: `Name` |
| `CreateUser` | Create user<br>Required: `UserName`, `RealName` |
| `SyncUserToIOA` | Sync user to ioa<br>Required: `UserIdSet` |
| `CreateAcl` | Create acl<br>Required: `Name`, `AllowDiskRedirect`, `AllowAnyAccount` |
| `CreateDeviceGroup` | Create device group<br>Required: `Name` |
| `DeployResource` | Deploy resource<br>Required: `ResourceId`, `ApCode`, `Zone`, `VpcId`, `SubnetId`, `CidrBlock` |
| `BindDeviceResource` | Bind device resource<br>Required: `DeviceIdSet` |
| `DisableWebAccess` | Disable web access<br>Required: `ResourceId` |
| `AccessDevices` | Run access devices<br>Required: `Account` |
| `EnableExternalAccess` | Enable external access<br>Required: `ResourceId` |
| `DisableExternalAccess` | Disable external access<br>Required: `ResourceId` |
| `EnableClientTcpAccess` | Enable client tcp access<br>Required: `ResourceId` |
| `CreateCmdTemplate` | Create cmd template<br>Required: `Name`, `CmdList` |
| `ReplaySession` | Run replay session<br>Required: `Sid` |
| `CreateResource` | Create resource<br>Required: `DeployRegion`, `VpcId`, `SubnetId`, `ResourceEdition`, `ResourceNode`, `TimeUnit`, `TimeSpan`, `PayMode`, `AutoRenewFlag` |
| `CreateUserDirectory` | Create user directory<br>Required: `DirId`, `DirName`, `UserOrgSet`, `Source`, `SourceName` |
| `CreateOperationTask` | Create operation task<br>Required: `Name`, `Type`, `Account`, `Timeout`, `Script`, `DeviceIdSet` |
| `AddUserGroupMembers` | Add user group members<br>Required: `Id`, `MemberIdSet` |
| `SetLDAPSyncFlag` | Set ldapsync flag |
| `BindDeviceAccountPassword` | Bind device account password<br>Required: `Id`, `Password` |
| `CreateDeviceAccount` | Create device account<br>Required: `DeviceId`, `Account` |
| `RunOperationTask` | Run operation task<br>Required: `Id` |
| `EnableIntranetAccess` | Enable intranet access |
| `UnlockUser` | Unlock user<br>Required: `IdSet` |
| `DisableIntranetAccess` | Disable intranet access |
| `CreateChangePwdTask` | Create change pwd task<br>Required: `TaskName`, `DeviceIdSet`, `AccountSet`, `ChangeMethod`, `AuthGenerationStrategy` |
| `SyncDevicesToIOA` | Sync devices to ioa<br>Required: `DeviceIdSet` |
| `BindDeviceAccountKubeconfig` | Bind device account kubeconfig<br>Required: `Id`, `Kubeconfig` |
| `RunChangePwdTask` | Run change pwd task<br>Required: `OperationId` |
| `EnableWebAccess` | Enable web access<br>Required: `ResourceId` |
| `CreateAccessWhiteListRule` | Create access white list rule<br>Required: `Source` |
| `AddDeviceGroupMembers` | Add device group members<br>Required: `Id`, `MemberIdSet` |
| `BindDeviceAccountPrivateKey` | Bind device account private key<br>Required: `Id`, `PrivateKey` |

## Blocked destructive actions (34)

`DeleteDeviceAccounts`, `ResetUser`, `ModifyOAuthSetting`, `ModifyUserDirectory`, `DeleteUserGroupMembers`, `ModifyAcl`, `DeleteUsers`, `DeleteCmdTemplates`, `ModifyAccessWhiteListStatus`, `ModifyDevice`, `ModifyCmdTemplate`, `ModifyAssetSyncFlag`, `ModifyDeviceGroup`, `DeleteAcls`, `DeleteUserDirectory`, `ModifyUserGroup`, `DeleteChangePwdTask`, `ModifyOperationTask`, `DeleteUserGroups`, `ModifyAccessWhiteListAutoStatus`, `ModifyReconnectionSetting`, `ModifyAccessWhiteListRule`, `DeleteOperationTasks`, `DeleteDevices`, `ModifyChangePwdTask`, `ResetDeviceAccountPassword`, `DeleteDeviceGroups`, `DeleteAccessWhiteListRules`, `ResetDeviceAccountPrivateKey`, `ModifyLDAPSetting`, `ModifyResource`, `ModifyAuthModeSetting`, `ModifyUser`, `DeleteDeviceGroupMembers` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bh`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230418` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bh"`) for the allow/block decision and reason.

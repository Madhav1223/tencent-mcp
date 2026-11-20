---
name: tencent-dasb
description: Tencent Cloud DASB via the Tencent MCP server — 63 actions in API version v20191018 (24 read-only auto-allowed). Use for device, change, members, bind, command, reset. Triggers on mentions of dasb, device, change, members, bind, command, reset, accounts, acls. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud DASB

Security & identity: 63 actions in API version `v20191018` — 24 read-only (auto-allowed), 17 gated mutations, 22 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dasb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dasb/v20191018 — action signatures in `dasb_client.ts`, full request/response shapes in `dasb_models.ts`.

## Read actions (auto-allowed, 24)

| Action | What it does |
|---|---|
| `DescribeDeviceGroupMembers` | Describe device group members<br>Required: `Bound` |
| `DescribeLoginEvent` | Describe login event |
| `DescribeDeviceAccounts` | Describe device accounts |
| `DescribeUserGroups` | Describe user groups |
| `DescribeDomains` | Describe domains |
| `SearchFile` | Search file<br>Required: `StartTime` |
| `SearchSession` | Search session |
| `DescribeResources` | Describe resources |
| `DescribeAcls` | Describe acls |
| `SearchCommandBySid` | Search command by sid<br>Required: `Sid` |
| `DescribeDasbImageIds` | Describe dasb image ids |
| `DescribeAssetSyncStatus` | Describe asset sync status<br>Required: `Category` |
| `DescribeChangePwdTaskDetail` | Describe change pwd task detail<br>Required: `OperationId` |
| `DescribeOperationEvent` | Describe operation event |
| `SearchAuditLog` | Search audit log<br>Required: `StartTime` |
| `DescribeCmdTemplates` | Describe cmd templates |
| `DescribeDeviceGroups` | Describe device groups |
| `DescribeUsers` | Describe users |
| `DescribeDevices` | Describe devices |
| `DescribeUserGroupMembers` | Describe user group members<br>Required: `Id`, `Bound` |
| `SearchFileBySid` | Search file by sid<br>Required: `Sid`, `AuditLog` |
| `DescribeChangePwdTask` | Describe change pwd task |
| `SearchCommand` | Search command<br>Required: `StartTime` |
| `SearchSessionCommand` | Search session command<br>Required: `Cmd`, `StartTime` |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `CreateDeviceGroup` | Create device group<br>Required: `Name` |
| `CreateChangePwdTask` | Create change pwd task<br>Required: `TaskName`, `DeviceIdSet`, `AccountSet`, `ChangeMethod`, `AuthGenerationStrategy` |
| `DeployResource` | Deploy resource<br>Required: `ResourceId`, `ApCode`, `Zone`, `VpcId`, `SubnetId`, `CidrBlock` |
| `BindDeviceResource` | Bind device resource<br>Required: `DeviceIdSet` |
| `BindDeviceAccountPassword` | Bind device account password<br>Required: `Id`, `Password` |
| `CreateAssetSyncJob` | Create asset sync job<br>Required: `Category` |
| `RunChangePwdTask` | Run change pwd task<br>Required: `OperationId` |
| `CreateAcl` | Create acl<br>Required: `Name`, `AllowDiskRedirect`, `AllowAnyAccount` |
| `CreateDeviceAccount` | Create device account<br>Required: `DeviceId`, `Account` |
| `CreateCmdTemplate` | Create cmd template<br>Required: `Name`, `CmdList` |
| `AddUserGroupMembers` | Add user group members<br>Required: `Id`, `MemberIdSet` |
| `ImportExternalDevice` | Import external device<br>Required: `DeviceSet` |
| `AddDeviceGroupMembers` | Add device group members<br>Required: `Id`, `MemberIdSet` |
| `CreateUserGroup` | Create user group<br>Required: `Name` |
| `CreateResource` | Create resource<br>Required: `DeployRegion`, `VpcId`, `SubnetId`, `ResourceEdition`, `ResourceNode`, `TimeUnit`, `TimeSpan`, `PayMode`, `AutoRenewFlag` |
| `CreateUser` | Create user<br>Required: `UserName`, `RealName` |
| `BindDeviceAccountPrivateKey` | Bind device account private key<br>Required: `Id`, `PrivateKey` |

## Blocked destructive actions (22)

`ModifyDeviceGroup`, `ModifyOAuthSetting`, `ModifyCmdTemplate`, `ResetUser`, `DeleteDevices`, `ModifyDevice`, `DeleteAcls`, `DeleteUserGroupMembers`, `ModifyChangePwdTask`, `ResetDeviceAccountPassword`, `ModifyUserGroup`, `DeleteDeviceGroups`, `ModifyAcl`, `DeleteUsers`, `ResetDeviceAccountPrivateKey`, `DeleteDeviceGroupMembers`, `DeleteChangePwdTask`, `DeleteDeviceAccounts`, `DeleteUserGroups`, `ModifyResource`, `ModifyUser`, `DeleteCmdTemplates` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dasb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20191018` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dasb"`) for the allow/block decision and reason.

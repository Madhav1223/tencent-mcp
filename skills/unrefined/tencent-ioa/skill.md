---
name: tencent-ioa
description: Tencent Cloud IOA via the Tencent MCP server — 44 actions in API version v20220601 (27 read-only auto-allowed). Use for device, virtual, soft, business, dlpfile, accounts. Triggers on mentions of ioa, device, virtual, soft, business, dlpfile, accounts, aggr, company. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud IOA

Security & identity: 44 actions in API version `v20220601` — 27 read-only (auto-allowed), 11 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ioa"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ioa/v20220601 — action signatures in `ioa_client.ts`, full request/response shapes in `ioa_models.ts`.

## Read actions (auto-allowed, 27)

| Action | What it does |
|---|---|
| `DescribeAggrSoftDeviceList` | Describe aggr soft device list |
| `DescribeCompanyDirectoryConfig` | Describe company directory config |
| `ExportDeviceDownloadTask` | Export device download task |
| `DescribeSoftwareInformation` | Describe software information |
| `DescribeResourceGrantedAccountGroups` | Describe resource granted account groups<br>Required: `ResourceId` |
| `DescribeDLPFileDetectTaskResult` | Describe dlpfile detect task result |
| `DescribeVirtualDevices` | Describe virtual devices |
| `ExportSoftwareInformationList` | Export software information list |
| `DescribeRootAccountGroup` | Describe root account group |
| `DescribeDLPFileDetectResult` | Describe dlpfile detect result |
| `DescribeResourceGrantedAccounts` | Describe resource granted accounts |
| `DescribeAggrSoftCategorySoftList` | Describe aggr soft category soft list |
| `DescribeDLPEdgeNodes` | Describe dlpedge nodes |
| `DescribeDirectAccountGroupResources` | Describe direct account group resources<br>Required: `AccountGroupId` |
| `DescribeAggrSoftDetail` | Describe aggr soft detail |
| `DescribeDeviceInfo` | Describe device info |
| `DescribeDeviceHardwareInfoList` | Describe device hardware info list<br>Required: `GroupId` (default id), `OsType` |
| `DescribeDeviceChildGroups` | Describe device child groups |
| `DescribeAccountGroups` | Describe account groups |
| `DescribeDeviceDetailList` | Describe device detail list |
| `DescribeLocalAccounts` | Describe local accounts |
| `DescribeDLPEdgeNodeGroups` | Describe dlpedge node groups |
| `DescribeDevices` | Describe devices |
| `DescribeDeviceVirtualGroups` | Describe device virtual groups |
| `DescribeSoftCensusListByDevice` | Describe soft census list by device<br>Required: `GroupId` |
| `DescribeBusinessResources` | Describe business resources |
| `DescribeResourceGrantedVirtualGroups` | Describe resource granted virtual groups |
## Mutations (gated — need allowlist, 11)

| Action | What it does |
|---|---|
| `GrantResourcesByAccounts` | Grant resources by accounts<br>Required: `Operations` |
| `CreateDeviceTask` | Create device task |
| `CreateDLPFileDetectTask` | Create dlpfile detect task<br>Required: `DownloadUrl`, `FileName`, `FileMd5`, `BalanceType` |
| `CreateCompanyDirectoryConfig` | Create company directory config<br>Required: `Type`, `Name`, `Config`, `SyncEnable`, `SyncPolicy`, `SyncPolicyParams`, `CreateAuthConfig`, `DisplayOnLoginPage` |
| `CreateDeviceVirtualGroup` | Create device virtual group<br>Required: `DeviceVirtualGroupName` |
| `CreateDLPFileDetectionTask` | Create dlpfile detection task<br>Required: `Url`, `FileName`, `FileMd5` |
| `CreatePrivilegeCode` | Create privilege code<br>Required: `Mid` |
| `BindBusinessResourceConnectorGroup` | Bind business resource connector group<br>Required: `ServiceId`, `ConnectorGroupId` |
| `GrantResourcesByAccountGroups` | Grant resources by account groups<br>Required: `Operations` |
| `CreateBusinessResource` | Create business resource<br>Required: `AreaId`, `Protocol`, `ServiceName`, `ServiceType`, `ServicePort`, `Levels`, `ServiceAddress` |
| `GrantResourcesByVirtualGroups` | Grant resources by virtual groups<br>Required: `Operations` |

## Blocked destructive actions (6)

`DeleteDeviceVirtualGroup`, `ModifyCompanyDirectoryConfig`, `ModifyDeviceTrustStatus`, `ModifyBusinessResource`, `DeleteAccountGroupResources`, `ModifyVirtualDeviceGroups` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ioa`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220601` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ioa"`) for the allow/block decision and reason.

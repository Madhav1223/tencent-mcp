---
name: tencent-omics
description: Tencent Cloud OMICS via the Tencent MCP server — 32 actions in API version v20221128 (18 read-only auto-allowed). Use for volume, application, environment, applications, hpcnodes, input. Triggers on mentions of omics, volume, application, environment, applications, hpcnodes, input, runs, tables. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud OMICS

General service: 32 actions in API version `v20221128` — 18 read-only (auto-allowed), 8 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "omics"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/omics/v20221128 — action signatures in `omics_client.ts`, full request/response shapes in `omics_models.ts`.

## Read actions (auto-allowed, 18)

| Action | What it does |
|---|---|
| `DescribeApplicationVersions` | Describe application versions<br>Required: `ProjectId`, `ApplicationId` |
| `GetRunStatus` | Get run status<br>Required: `RunUuid` |
| `GetInputTemplateFile` | Get input template file<br>Required: `InputTemplateId` |
| `GetRunJobLog` | Get run job log<br>Required: `RunUuid`, `JobId`, `LogType` |
| `DescribePublicApplications` | Describe public applications |
| `DescribeTablesRows` | Describe tables rows<br>Required: `ProjectId`, `TableId` |
| `DescribeHPCClusters` | Describe hpcclusters |
| `DescribeEnvironments` | Describe environments |
| `GetRunMetadataFile` | Get run metadata file<br>Required: `RunUuid` |
| `DescribeProjects` | Describe projects |
| `DescribeRuns` | Describe runs |
| `DescribeRunGroups` | Describe run groups |
| `GetRunCalls` | Get run calls<br>Required: `RunUuid`, `Path` |
| `DescribeApplications` | Describe applications<br>Required: `ProjectId` |
| `DescribeVolumes` | Describe volumes<br>Required: `EnvironmentId` |
| `DescribeInputTemplates` | Describe input templates |
| `DescribeHPCNodes` | Describe hpcnodes |
| `DescribeTables` | Describe tables<br>Required: `ProjectId` |
## Mutations (gated — need allowlist, 8)

| Action | What it does |
|---|---|
| `ImportCommonApplication` | Import common application<br>Required: `CommonAppUuid`, `CommonAppNewName`, `ProjectId`, `Type`, `NextflowVersion` |
| `CreateVolume` | Create volume<br>Required: `EnvironmentId`, `Name`, `Type`, `Spec` |
| `RetryRuns` | Retry runs |
| `ImportTableFile` | Import table file<br>Required: `ProjectId`, `Name`, `CosUri`, `DataType` |
| `RunApplication` | Run application<br>Required: `ApplicationId`, `Name`, `EnvironmentId` |
| `RebootHPCNodes` | Reboot hpcnodes<br>Required: `ClusterId`, `NodeIds` |
| `RunWorkflow` | Run workflow<br>Required: `Name`, `EnvironmentId`, `GitSource`, `Type`, `NFOption` |
| `CreateEnvironment` | Create environment<br>Required: `Name`, `Config` |

## Blocked destructive actions (6)

`TerminateRunGroup`, `DeleteVolume`, `DeleteEnvironment`, `DeleteVolumeData`, `DeleteEnvironmentCache`, `ModifyVolume` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `omics`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20221128` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="omics"`) for the allow/block decision and reason.

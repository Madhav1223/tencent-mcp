---
name: tencent-tcbr
description: Tencent Cloud TCBR via the Tencent MCP server — 22 actions in API version v20220217 (11 read-only auto-allowed). Use for cloud, server, version, manage, release, submit. Triggers on mentions of tcbr, cloud, server, version, manage, release, submit, base, change. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Containers & registries
metadata:
  version: "4"
---

# Tencent Cloud TCBR

Containers & registries: 22 actions in API version `v20220217` — 11 read-only (auto-allowed), 7 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tcbr"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Registries are region-scoped: image URLs embed the region, and pulling across regions fails without replication rules — create replication before deploying multi-region.
Namespaces/repositories need explicit access policy (private by default); image pull secrets on the workload side must match.
Deployments are async — after pushing or updating, poll the workload/task status actions until the new revision is stable before declaring success.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tcbr/v20220217 — action signatures in `tcbr_client.ts`, full request/response shapes in `tcbr_models.ts`.

## Read actions (auto-allowed, 11)

| Action | What it does |
|---|---|
| `DescribeCloudRunServers` | Describe cloud run servers<br>Required: `EnvId` |
| `DescribeReleaseOrder` | Describe release order<br>Required: `EnvId`, `ServerName` |
| `DescribeServerManageTask` | Describe server manage task<br>Required: `EnvId`, `ServerName`, `TaskId` |
| `DescribeCloudRunEnvs` | Describe cloud run envs |
| `DescribeEnvBaseInfo` | Describe env base info<br>Required: `EnvId` |
| `DescribeCloudRunProcessLog` | Describe cloud run process log<br>Required: `EnvId`, `RunId` |
| `DescribeVersionDetail` | Describe version detail<br>Required: `EnvId`, `ServerName`, `VersionName` |
| `SearchClsLog` | Search cls log<br>Required: `EnvId`, `StartTime`, `EndTime`, `QueryString`, `Limit` |
| `DescribeCloudRunPodList` | Describe cloud run pod list<br>Required: `EnvId`, `ServerName` |
| `DescribeCloudRunDeployRecord` | Describe cloud run deploy record<br>Required: `EnvId`, `ServerName` |
| `DescribeCloudRunServerDetail` | Describe cloud run server detail<br>Required: `EnvId`, `ServerName` |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `SubmitServerConfigChangeDiff` | Submit server config change diff<br>Required: `EnvId`, `ServerName` |
| `SubmitServerRollback` | Submit server rollback<br>Required: `EnvId`, `ServerName`, `CurrentVersionName`, `RollbackVersionName` |
| `CreateCloudRunEnv` | Create cloud run env<br>Required: `PackageType` |
| `UpdateCloudRunServer` | Update cloud run server<br>Required: `EnvId`, `ServerName`, `DeployInfo` |
| `OperateServerManage` | Run operate server manage<br>Required: `EnvId`, `ServerName`, `TaskId`, `OperateType` |
| `CreateCloudRunServer` | Create cloud run server<br>Required: `EnvId`, `ServerName`, `DeployInfo` |
| `StartVersionInstance` | Start version instance<br>Required: `EnvId`, `ServerName`, `VersionName` |

## Blocked destructive actions (4)

`DeleteCloudRunVersions`, `DeleteCloudRunServer`, `StopVersionInstance`, `ReleaseGray` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tcbr`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220217` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tcbr"`) for the allow/block decision and reason.

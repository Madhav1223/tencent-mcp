---
name: tencent-dbdc
description: Tencent Cloud DBDC via the Tencent MCP server — 35 actions in API version v20201029 (20 read-only auto-allowed). Use for dbcustom, cluster, node, nodes, attributes, destroy. Triggers on mentions of dbdc, dbcustom, cluster, node, nodes, attributes, destroy, security, tags. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud DBDC

Databases: 35 actions in API version `v20201029` — 20 read-only (auto-allowed), 4 gated mutations, 11 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dbdc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dbdc/v20201029 — action signatures in `dbdc_client.ts`, full request/response shapes in `dbdc_models.ts`.

## Read actions (auto-allowed, 20)

| Action | What it does |
|---|---|
| `DescribeDBCustomClusterResources` | Describe dbcustom cluster resources<br>Required: `ClusterId` |
| `DescribeDBCustomNodeSecurityGroups` | Describe dbcustom node security groups<br>Required: `NodeId` |
| `DescribeInstanceDetail` | Describe instance detail<br>Required: `InstanceId` |
| `DescribeDBCustomNodes` | Describe dbcustom nodes |
| `DescribeInstances` | Describe instances |
| `DescribeDBCustomImages` | Describe dbcustom images |
| `DescribeDBCustomClusterNodes` | Describe dbcustom cluster nodes<br>Required: `ClusterId` |
| `DescribeDBCustomRegions` | Describe dbcustom regions |
| `DescribeDBCustomNodeTypes` | Describe dbcustom node types |
| `DescribeDBInstances` | Describe db instances<br>Required: `InstanceId` |
| `DescribeDBCustomClusterDetail` | Describe dbcustom cluster detail<br>Required: `ClusterId` |
| `DescribeInstanceList` | Describe instance list |
| `DescribeDBCustomClusterNodeConfig` | Describe dbcustom cluster node config<br>Required: `ClusterId`, `NodeIds` |
| `DescribeDBCustomClusterKubeconfig` | Describe dbcustom cluster kubeconfig<br>Required: `ClusterId` |
| `DescribeHostList` | Describe host list<br>Required: `InstanceId` |
| `DescribeDBCustomZones` | Describe dbcustom zones |
| `DescribeDBCustomClusterNodeResources` | Describe dbcustom cluster node resources<br>Required: `ClusterId`, `NodeIds` |
| `DescribeDBCustomTaskStatus` | Describe dbcustom task status<br>Required: `TaskId` |
| `CheckRoleAuthorized` | Check role authorized<br>Required: `RoleName` |
| `DescribeDBCustomClusters` | Describe dbcustom clusters |
## Mutations (gated — need allowlist, 4)

| Action | What it does |
|---|---|
| `AddNodesToDBCustomCluster` | Add nodes to dbcustom cluster<br>Required: `ClusterId`, `NodeIds`, `ImageId`, `LoginSettings` |
| `CreateDBCustomNodes` | Create dbcustom nodes<br>Required: `Zone`, `ImageId` (format `img-xxxxxxx…`), `VpcId` (format `vpc-b4zgtest…`), `SubnetId` (format `subnet-t13dtest…`), `NodeType`, `NodeCount`, `LoginSettings` |
| `IsolateDBCustomNode` | Run isolate dbcustom node<br>Required: `NodeId` |
| `CreateDBCustomCluster` | Create dbcustom cluster<br>Required: `ContainerNetwork` |

## Blocked destructive actions (11)

`DestroyDBCustomNode`, `ModifyDBCustomNodeAttributes`, `ModifyDBCustomNodeSecurityGroups`, `DestroyDBCustomCluster`, `ModifyInstanceName`, `ModifyDBCustomClusterTags`, `RenewDBCustomNode`, `ModifyDBCustomClusterAttributes`, `RemoveNodesFromDBCustomCluster`, `ModifyDBCustomNodeTags`, `ModifyDBCustomClusterNodeConfig` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dbdc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201029` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dbdc"`) for the allow/block decision and reason.

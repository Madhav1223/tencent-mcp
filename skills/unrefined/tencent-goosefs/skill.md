---
name: tencent-goosefs
description: Tencent Cloud GOOSEFS via the Tencent MCP server — 37 actions in API version v20220519 (14 read-only auto-allowed). Use for client, system, cluster, fileset, load, node. Triggers on mentions of goosefs, client, system, cluster, fileset, load, node, repository, cross. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Block / file storage
metadata:
  version: "4"
---

# Tencent Cloud GOOSEFS

Block / file storage: 37 actions in API version `v20220519` — 14 read-only (auto-allowed), 16 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "goosefs"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Storage is zone-scoped and usually must attach in the same zone as the compute using it — verify zone alignment before creating disks or file systems.
Snapshots/back up block storage: snapshot before any resize, type change, or risky attach/detach. Expanding disks is one-way on most engines — confirm size with the user first.
Throughput and protocol (NFS/CIFS/HDFS) are set at creation and often immutable; pick them from the workload, not defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/goosefs/v20220519 — action signatures in `goosefs_client.ts`, full request/response shapes in `goosefs_models.ts`.

## Read actions (auto-allowed, 14)

| Action | What it does |
|---|---|
| `QueryCrossVpcSubnetSupportForClientNode` | Query cross vpc subnet support for client node<br>Required: `FileSystemId` |
| `DescribeClusterClientToken` | Describe cluster client token<br>Required: `ClusterId` |
| `DescribeCustomerCluster` | Describe customer cluster |
| `DescribeLoadTask` | Describe load task<br>Required: `ClusterId`, `TaskId` |
| `DescribeFilesetGeneralConfig` | Describe fileset general config<br>Required: `FileSystemId` |
| `ListLoadTasks` | List load tasks<br>Required: `ClusterId`, `Offset`, `Limit` |
| `QueryClientNodeMountCommand` | Query client node mount command |
| `DescribeClientNodes` | Describe client nodes<br>Required: `FileSystemId` |
| `DescribeFileSystemBuckets` | Describe file system buckets<br>Required: `FileSystemId` |
| `DescribeFilesets` | Describe filesets<br>Required: `FileSystemId` |
| `DescribeClusterRoleToken` | Describe cluster role token<br>Required: `ClusterId`, `RoleName` |
| `DescribeFileSystems` | Describe file systems<br>Required: `Offset`, `Limit` |
| `QueryDataRepositoryBandwidth` | Query data repository bandwidth<br>Required: `FileSystemId` |
| `DescribeDataRepositoryTaskStatus` | Describe data repository task status<br>Required: `TaskId`, `FileSystemId` |
## Mutations (gated — need allowlist, 16)

| Action | What it does |
|---|---|
| `MountMultipleStorageFileSystem` | Mount multiple storage file system |
| `ExpandCapacity` | Run expand capacity<br>Required: `FileSystemId`, `ExpandedCapacity` |
| `UpdateFileset` | Update fileset<br>Required: `FileSystemId`, `FsetId` |
| `BatchDeleteClientNodes` | Run batch delete client nodes<br>Required: `FileSystemId`, `ClientNodes` |
| `BuildClientNodeMountCommand` | Run build client node mount command<br>Required: `FileSystemId` |
| `UpdateLoadTaskPriority` | Update load task priority<br>Required: `ClusterId`, `TaskId`, `Priority` (default 1) |
| `CreateFileset` | Create fileset<br>Required: `FileSystemId`, `FsetName`, `FsetDir` |
| `CreateLoadTask` | Create load task<br>Required: `ClusterId`, `LoadTaskCreationAttrs` |
| `BuildCustomerCluster` | Run build customer cluster |
| `CreateDataRepositoryTask` | Create data repository task<br>Required: `TaskType`, `Bucket`, `FileSystemId`, `TaskPath`, `TaskName` |
| `UpdateFilesetGeneralConfig` | Update fileset general config<br>Required: `FileSystemId` |
| `DetachFileSystemBucket` | Detach file system bucket<br>Required: `FileSystemId`, `BucketName` |
| `AddCrossVpcSubnetSupportForClientNode` | Add cross vpc subnet support for client node<br>Required: `FileSystemId`, `SubnetInfo` |
| `BatchAddClientNodes` | Run batch add client nodes<br>Required: `FileSystemId`, `ClientNodes` |
| `AttachFileSystemBucket` | Attach file system bucket<br>Required: `FileSystemId`, `Bucket` |
| `CreateFileSystem` | Create file system<br>Required: `Name`, `Description`, `VpcId`, `SubnetId`, `Zone` |

## Blocked destructive actions (7)

`DeleteCustomerCluster`, `ModifyDataRepositoryBandwidth`, `ModifyDataRepositoryTaskStatus`, `CancelLoadTask`, `DeleteFileSystem`, `DeleteFileset`, `DeleteCrossVpcSubnetSupportForClientNode` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `goosefs`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220519` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="goosefs"`) for the allow/block decision and reason.

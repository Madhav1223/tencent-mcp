---
name: tencent-cfs
description: Tencent Cloud CFS via the Tencent MCP server — 64 actions in API version v20190719 (19 read-only auto-allowed). Use for snapshot, lifecycle, system, auto, retrieval, migration. Triggers on mentions of cfs, snapshot, lifecycle, system, auto, retrieval, migration, pgroup, quota. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Block / file storage
metadata:
  version: "4"
---

# Tencent Cloud CFS

Block / file storage: 64 actions in API version `v20190719` — 19 read-only (auto-allowed), 29 gated mutations, 16 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cfs"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Storage is zone-scoped and usually must attach in the same zone as the compute using it — verify zone alignment before creating disks or file systems.
Snapshots/back up block storage: snapshot before any resize, type change, or risky attach/detach. Expanding disks is one-way on most engines — confirm size with the user first.
Throughput and protocol (NFS/CIFS/HDFS) are set at creation and often immutable; pick them from the workload, not defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cfs/v20190719 — action signatures in `cfs_client.ts`, full request/response shapes in `cfs_models.ts`.

## Read actions (auto-allowed, 19)

| Action | What it does |
|---|---|
| `DescribeCfsRules` | Describe cfs rules<br>Required: `PGroupId` |
| `DescribeLifecycleDataTask` | Describe lifecycle data task<br>Required: `StartTime`, `EndTime` |
| `DescribeMigrationTasks` | Describe migration tasks |
| `DescribeMountTargets` | Describe mount targets<br>Required: `FileSystemId` |
| `DescribeAutoSnapshotPolicies` | Describe auto snapshot policies |
| `DescribeCfsFileSystemClients` | Describe cfs file system clients<br>Required: `FileSystemId` |
| `DescribeCfsServiceStatus` | Describe cfs service status |
| `DescribeDataRetrieval` | Describe data retrieval |
| `DescribeAvailableZoneInfo` | Describe available zone info |
| `DescribeBucketList` | Describe bucket list<br>Required: `SrcService`, `SrcSecretId`, `SrcSecretKey` |
| `DescribeCfsPGroups` | Describe cfs pgroups |
| `DescribeCfsSnapshotOverview` | Describe cfs snapshot overview |
| `DescribeLifecyclePolicies` | Describe lifecycle policies |
| `DescribeUserQuota` | Describe user quota<br>Required: `FileSystemId` |
| `DescribeCfsFileSystems` | Describe cfs file systems |
| `DescribeCfsSnapshots` | Describe cfs snapshots |
| `DescribeDataRetrievalTask` | Describe data retrieval task<br>Required: `StartTime` (format `2024-11-19…`), `EndTime` (format `2024-10-…`), `DataRetrievalId` |
| `DescribeSnapshotOperationLogs` | Describe snapshot operation logs<br>Required: `SnapshotId`, `StartTime`, `EndTime` |
| `DescribeDataFlow` | Describe data flow |
## Mutations (gated — need allowlist, 29)

| Action | What it does |
|---|---|
| `DoDirectoryOperation` | Run do directory operation<br>Required: `FileSystemId`, `OpetationType`, `DirectoryPath` |
| `UpdateCfsFileSystemPGroup` | Update cfs file system pgroup<br>Required: `PGroupId`, `FileSystemId` |
| `UpdateCfsSnapshotAttribute` | Update cfs snapshot attribute<br>Required: `SnapshotId` |
| `UpdateFileSystemBandwidthLimit` | Update file system bandwidth limit<br>Required: `FileSystemId`, `BandwidthLimit` |
| `SetUserQuota` | Set user quota<br>Required: `FileSystemId`, `UserType` |
| `CreateDataFlow` | Create data flow<br>Required: `FileSystemId`, `SourceStorageType`, `SourceStorageAddress`, `SourcePath`, `TargetPath`, `SecretId`, `SecretKey` |
| `UnbindAutoSnapshotPolicy` | Unbind auto snapshot policy<br>Required: `FileSystemIds`, `AutoSnapshotPolicyId` |
| `CreateLifecyclePolicyDownloadTask` | Create lifecycle policy download task |
| `CreateDataRetrieval` | Create data retrieval<br>Required: `FileSystemId`, `DataRetrievalName` |
| `CreateLifecycleDataTask` | Create lifecycle data task<br>Required: `FileSystemId`, `Type`, `TaskName` |
| `OverrideCfsRules` | Run override cfs rules<br>Required: `PermissionGroupId`, `RuleList` |
| `SignUpCfsService` | Sign up cfs service |
| `ScaleUpFileSystem` | Scale up file system<br>Required: `FileSystemId`, `TargetCapacity` |
| `UpdateCfsFileSystemSizeLimit` | Update cfs file system size limit<br>Required: `FsLimit` (range 0-1073741824), `FileSystemId` |
| `CreateLifecyclePolicy` | Create lifecycle policy<br>Required: `LifecyclePolicyName`, `LifecycleRules` |
| `CreateCfsFileSystem` | Create cfs file system<br>Required: `Zone`, `NetInterface`, `PGroupId` |
| `ApplyPathLifecyclePolicy` | Run apply path lifecycle policy<br>Required: `LifecyclePolicyID` |
| `UpdateCfsRule` | Update cfs rule<br>Required: `PGroupId`, `RuleId` |
| `BindAutoSnapshotPolicy` | Bind auto snapshot policy<br>Required: `AutoSnapshotPolicyId`, `FileSystemIds` |
| `CreateMigrationTask` | Create migration task<br>Required: `TaskName`, `MigrationType` (default 0), `MigrationMode` (default 0), `SrcSecretId`, `SrcSecretKey`, `FileSystemId`, `FsPath`, `CoverType` (default 0), `SrcService` |
| `CreateAutoSnapshotPolicy` | Create auto snapshot policy<br>Required: `Hour` |
| `CreateCfsPGroup` | Create cfs pgroup<br>Required: `Name` |
| `CreateCfsSnapshot` | Create cfs snapshot<br>Required: `FileSystemId` |
| `UpdateAutoSnapshotPolicy` | Update auto snapshot policy<br>Required: `AutoSnapshotPolicyId` |
| `RunDataRetrievalTask` | Run data retrieval task<br>Required: `DataRetrievalId` |
| `UpdateCfsFileSystemName` | Update cfs file system name<br>Required: `FileSystemId` |
| `CreateCfsRule` | Create cfs rule<br>Required: `PGroupId`, `AuthClientIp`, `Priority` (range 1-100) |
| `CreateAccessCert` | Create access cert<br>Required: `CertDesc` |
| `UpdateCfsPGroup` | Update cfs pgroup<br>Required: `PGroupId` |

## Blocked destructive actions (16)

`DeleteCfsSnapshot`, `DeleteCfsFileSystem`, `DeleteDataRetrieval`, `DeleteCfsPGroup`, `DeleteLifecyclePolicy`, `StopMigrationTask`, `DeleteMigrationTask`, `ModifyDataRetrieval`, `DeleteUserQuota`, `ModifyDataFlow`, `ModifyFileSystemAutoScaleUpRule`, `ModifyLifecyclePolicy`, `DeleteCfsRule`, `DeleteDataFlow`, `DeleteAutoSnapshotPolicy`, `StopLifecycleDataTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cfs`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190719` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cfs"`) for the allow/block decision and reason.

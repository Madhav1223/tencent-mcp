---
name: tencent-chdfs
description: Tencent Cloud CHDFS via the Tencent MCP server — 37 actions in API version v20201112 (12 read-only auto-allowed). Use for access, mount, cycle, life, path, point. Triggers on mentions of chdfs, access, mount, cycle, life, path, point, protection, system. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Block / file storage
metadata:
  version: "4"
---

# Tencent Cloud CHDFS

Block / file storage: 37 actions in API version `v20201112` — 12 read-only (auto-allowed), 10 gated mutations, 15 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "chdfs"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Storage is zone-scoped and usually must attach in the same zone as the compute using it — verify zone alignment before creating disks or file systems.
Snapshots/back up block storage: snapshot before any resize, type change, or risky attach/detach. Expanding disks is one-way on most engines — confirm size with the user first.
Throughput and protocol (NFS/CIFS/HDFS) are set at creation and often immutable; pick them from the workload, not defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/chdfs/v20201112 — action signatures in `chdfs_client.ts`, full request/response shapes in `chdfs_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `DescribeAccessRules` | Describe access rules<br>Required: `AccessGroupId` |
| `DescribeMountPoint` | Describe mount point<br>Required: `MountPointId` |
| `DescribeResourceTags` | Describe resource tags<br>Required: `FileSystemId` |
| `DescribeAccessGroups` | Describe access groups |
| `DescribeTrashConfig` | Describe trash config<br>Required: `FileSystemId` |
| `DescribeFileSystem` | Describe file system<br>Required: `FileSystemId` |
| `DescribeAccessGroup` | Describe access group<br>Required: `AccessGroupId` |
| `DescribePathProtectionRules` | Describe path protection rules<br>Required: `FileSystemId` |
| `DescribeFileSystems` | Describe file systems |
| `DescribeMountPoints` | Describe mount points |
| `DescribeRestoreTasks` | Describe restore tasks<br>Required: `FileSystemId` |
| `DescribeLifeCycleRules` | Describe life cycle rules<br>Required: `FileSystemId` |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `CreateRestoreTasks` | Create restore tasks<br>Required: `FileSystemId`, `RestoreTasks` |
| `CreateLifeCycleRules` | Create life cycle rules<br>Required: `FileSystemId`, `LifeCycleRules` |
| `CreateTrashConfig` | Create trash config<br>Required: `FileSystemId`, `ReservedDays`, `Status` |
| `CreateMountPoint` | Create mount point<br>Required: `MountPointName`, `FileSystemId`, `MountPointStatus` |
| `DisassociateAccessGroups` | Run disassociate access groups<br>Required: `MountPointId`, `AccessGroupIds` |
| `CreateFileSystem` | Create file system<br>Required: `FileSystemName`, `PosixAcl` |
| `CreateAccessRules` | Create access rules<br>Required: `AccessRules`, `AccessGroupId` |
| `AssociateAccessGroups` | Associate access groups<br>Required: `MountPointId`, `AccessGroupIds` |
| `CreatePathProtectionRule` | Create path protection rule<br>Required: `FileSystemId`, `Name`, `Path`, `Status` |
| `CreateAccessGroup` | Create access group<br>Required: `AccessGroupName`, `VpcType`, `VpcId` |

## Blocked destructive actions (15)

`DeleteTrashConfig`, `ModifyMountPoint`, `ModifyAccessRules`, `DeleteMountPoint`, `DeleteAccessRules`, `ModifyLifeCycleRules`, `ModifyTrashConfig`, `DeleteFileSystem`, `DeletePathProtectionRule`, `DeleteLifeCycleRules`, `ModifyFileSystem`, `ModifyAccessGroup`, `ModifyResourceTags`, `DeleteAccessGroup`, `ModifyPathProtectionRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `chdfs`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201112` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="chdfs"`) for the allow/block decision and reason.

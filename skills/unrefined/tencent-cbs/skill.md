---
name: tencent-cbs
description: Tencent Cloud CBS via the Tencent MCP server — 61 actions in API version v20170312 (19 read-only auto-allowed). Use for disk, disks, snapshot, remote, auto, price. Triggers on mentions of cbs, disk, disks, snapshot, remote, auto, price, renew, backup. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Block / file storage
metadata:
  version: "4"
---

# Tencent Cloud CBS

Block / file storage: 61 actions in API version `v20170312` — 19 read-only (auto-allowed), 25 gated mutations, 17 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cbs"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Storage is zone-scoped and usually must attach in the same zone as the compute using it — verify zone alignment before creating disks or file systems.
Snapshots/back up block storage: snapshot before any resize, type change, or risky attach/detach. Expanding disks is one-way on most engines — confirm size with the user first.
Throughput and protocol (NFS/CIFS/HDFS) are set at creation and often immutable; pick them from the workload, not defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cbs/v20170312 — action signatures in `cbs_client.ts`, full request/response shapes in `cbs_models.ts`.

## Read actions (auto-allowed, 19)

| Action | What it does |
|---|---|
| `DescribeInstancesDiskNum` | Describe instances disk num<br>Required: `InstanceIds` |
| `InquiryPriceResizeDisk` | Inquire the price of: resize disk<br>Required: `DiskSize` |
| `DescribeAutoSnapshotPolicies` | Describe auto snapshot policies |
| `DescribeRemoteDisks` | Describe remote disks |
| `DescribeDedicatedClusterDiskStatistics` | Describe dedicated cluster disk statistics<br>Required: `DedicatedClusterId` |
| `InquiryPriceCreateDisks` | Inquire the price of: create disks<br>Required: `DiskChargeType`, `DiskType`, `DiskSize` |
| `DescribeDiskBackups` | Describe disk backups |
| `DescribeDisks` | Describe disks |
| `DescribeSnapshotGroups` | Describe snapshot groups |
| `DescribeRemoteDisksDeniedActions` | Describe remote disks denied actions<br>Required: `RemoteDiskIds` |
| `DescribeDiskAssociatedAutoSnapshotPolicy` | Describe disk associated auto snapshot policy<br>Required: `DiskId` |
| `DescribeSnapshots` | Describe snapshots |
| `DescribeRemoteDiskConfigQuota` | Describe remote disk config quota |
| `DescribeSnapshotSharePermission` | Describe snapshot share permission<br>Required: `SnapshotId` |
| `DescribeDiskConfigQuota` | Describe disk config quota<br>Required: `InquiryType` |
| `DescribeDiskStoragePool` | Describe disk storage pool |
| `DescribeSnapshotOverview` | Describe snapshot overview |
| `GetSnapOverview` | Get snap overview |
| `InquiryPriceRenewDisks` | Inquire the price of: renew disks<br>Required: `DiskIds` |
## Mutations (gated — need allowlist, 25)

| Action | What it does |
|---|---|
| `ApplyDiskBackup` | Run apply disk backup<br>Required: `DiskBackupId`, `DiskId` |
| `CopySnapshotCrossRegions` | Copy snapshot cross regions<br>Required: `DestinationRegions` |
| `InquirePriceModifyDiskExtraPerformance` | Inquire the price of: modify disk extra performance<br>Required: `ThroughputPerformance`, `DiskId` |
| `SwitchParameterRenewRemoteDisks` | Switch parameter renew remote disks |
| `CreateRemoteDisks` | Create remote disks<br>Required: `DiskChargeType`, `DiskSize`, `InstanceId`, `Placement` |
| `AttachDisks` | Attach disks<br>Required: `InstanceId`, `DiskIds` |
| `CreateSnapshotGroup` | Create snapshot group<br>Required: `DiskIds` |
| `SwitchParameterCreateRemoteDisks` | Switch parameter create remote disks<br>Required: `Placement` |
| `InquirePriceCreateRemoteDisks` | Inquire the price of: create remote disks<br>Required: `DiskChargeType`, `DiskSize` |
| `ApplySnapshotGroup` | Run apply snapshot group<br>Required: `SnapshotGroupId`, `ApplyDisks` |
| `InitializeDisks` | Initialize disks<br>Required: `DiskIds` |
| `CreateDisks` | Create disks<br>Required: `Placement`, `DiskChargeType`, `DiskType` |
| `CopyAutoSnapshotPolicyCrossAccount` | Copy auto snapshot policy cross account<br>Required: `AutoSnapshotPolicyIds`, `TargetAccountUin` |
| `InquirePriceRenewRemoteDisks` | Inquire the price of: renew remote disks<br>Required: `DiskChargePrepaidSet`, `RemoteDiskIds` |
| `DetachRemoteDisks` | Detach remote disks<br>Required: `InstanceId`, `RemoteDiskIds` |
| `BindAutoSnapshotPolicy` | Bind auto snapshot policy<br>Required: `AutoSnapshotPolicyId` |
| `CreateAutoSnapshotPolicy` | Create auto snapshot policy<br>Required: `Policy` |
| `UnbindAutoSnapshotPolicy` | Unbind auto snapshot policy<br>Required: `AutoSnapshotPolicyId` |
| `CreateDiskBackup` | Create disk backup<br>Required: `DiskId` |
| `ApplySnapshot` | Run apply snapshot<br>Required: `SnapshotId`, `DiskId` |
| `InquirePriceModifyDiskBackupQuota` | Inquire the price of: modify disk backup quota<br>Required: `DiskId`, `DiskBackupQuota` |
| `DetachDisks` | Detach disks<br>Required: `DiskIds` |
| `AttachRemoteDisks` | Attach remote disks<br>Required: `InstanceId`, `RemoteDiskIds` |
| `ResizeDisk` | Resize disk<br>Required: `DiskSize` |
| `CreateSnapshot` | Create snapshot |

## Blocked destructive actions (17)

`ModifyDiskExtraPerformance`, `RenewDisk`, `RenewRemoteDisk`, `TerminateRemoteDisks`, `ModifyDisksRenewFlag`, `DeleteSnapshotGroup`, `DeleteDiskBackups`, `ModifyAutoSnapshotPolicyAttribute`, `DeleteAutoSnapshotPolicies`, `ModifyDiskBackupQuota`, `ModifyDiskAttributes`, `DeleteSnapshots`, `ModifySnapshotAttribute`, `ModifyRemoteDiskAttributes`, `ModifyDisksChargeType`, `TerminateDisks`, `ModifySnapshotsSharePermission` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cbs`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20170312` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cbs"`) for the allow/block decision and reason.

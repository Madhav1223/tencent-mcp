---
name: tencent-bdrc
description: Tencent Cloud BDRC via the Tencent MCP server — 76 actions in API version v20260330 (32 read-only auto-allowed). Use for backup, pairs, disaster, recovery, copy, attribute. Triggers on mentions of bdrc, backup, pairs, disaster, recovery, copy, attribute, actions, denied. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud BDRC

General service: 76 actions in API version `v20260330` — 32 read-only (auto-allowed), 22 gated mutations, 22 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bdrc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bdrc/v20260330 — action signatures in `bdrc_client.ts`, full request/response shapes in `bdrc_models.ts`.

## Read actions (auto-allowed, 32)

| Action | What it does |
|---|---|
| `DescribeBackupInstances` | Describe backup instances |
| `DescribeDrillPairsDeniedActions` | Describe drill pairs denied actions<br>Required: `DrillPairType`, `DrillPairIds` |
| `DescribeDisasterRecoveryProtectGroups` | Describe disaster recovery protect groups<br>Required: `ProtectGroupType` |
| `DescribeBackupVaultsDeniedActions` | Describe backup vaults denied actions<br>Required: `VaultIds` |
| `DescribeCommonBackupPoints` | Describe common backup points<br>Required: `InstanceIds` |
| `DescribeDisasterRecoverySitePairsDeniedActions` | Describe disaster recovery site pairs denied actions<br>Required: `SitePairIds` (format `sitepair-xxxxxxxx…`) |
| `DescribeFileBackupObjects` | Describe file backup objects |
| `DescribeFileBackupsDeniedActions` | Describe file backups denied actions<br>Required: `BackupIds` |
| `DescribeBackupGroupRollbackTasks` | Describe backup group rollback tasks |
| `DescribeDisasterRecoveryOverview` | Describe disaster recovery overview |
| `DescribeBackupOverviewGeneral` | Describe backup overview general |
| `DescribeAutoBackupPolicies` | Describe auto backup policies |
| `DescribeDisasterRecoverySitePairs` | Describe disaster recovery site pairs<br>Required: `SitePairType` |
| `DescribeProtectedInstances` | Describe protected instances |
| `DescribeCopyPairsDeniedActions` | Describe copy pairs denied actions<br>Required: `CopyPairIds`, `CopyPairType` |
| `DescribeProtectGroupsDeniedActions` | Describe protect groups denied actions<br>Required: `ProtectGroupIds` |
| `DescribeFileBackups` | Describe file backups |
| `DescribeDisasterRecoveryDrillGroups` | Describe disaster recovery drill groups<br>Required: `DrillGroupType` |
| `DescribeFileBackupPlans` | Describe file backup plans |
| `DescribeDrillPairs` | Describe drill pairs<br>Required: `DrillPairType` |
| `DescribeFileRestoreTasks` | Describe file restore tasks |
| `DescribeBackupVaults` | Describe backup vaults |
| `DescribePriceCreateCopyPairs` | Describe price create copy pairs<br>Required: `DataCapacities` |
| `DescribeVpcMappings` | Describe vpc mappings<br>Required: `SitePairId` |
| `DescribeBackupGroups` | Describe backup groups |
| `DescribeCopyPairs` | Describe copy pairs<br>Required: `CopyPairType` (DISK | INSTANCE | CFS) |
| `DescribeBackupGroupsDeniedActions` | Describe backup groups denied actions<br>Required: `BackupGroupIds` |
| `DescribeJobs` | Describe jobs |
| `DescribeDisks` | Describe disks<br>Required: `DiskIds`, `DiskRegion` |
| `DescribeDisasterRecoverySupportRegion` | Describe disaster recovery support region |
| `DescribeBackupPlans` | Describe backup plans |
| `DescribeSecurityGroupMappings` | Describe security group mappings<br>Required: `SitePairId` |
## Mutations (gated — need allowlist, 22)

| Action | What it does |
|---|---|
| `RunFailoverCopyPairs` | Run failover copy pairs<br>Required: `CopyPairIds`, `CopyPairType`, `FailoverType` |
| `ReportAgentMetrics` | Report agent metrics |
| `UnbindAutoBackupPolicy` | Unbind auto backup policy |
| `CreateSecurityGroupMapping` | Create security group mapping<br>Required: `SrcSecurityGroupId`, `TargetSecurityGroupId`, `SitePairId` |
| `ReportGatewayHeartbeat` | Report gateway heartbeat |
| `RunInstancesWithBackupGroup` | Run instances with backup group<br>Required: `BackupGroupId` |
| `CreateDisasterRecoveryVpcMapping` | Create disaster recovery vpc mapping<br>Required: `SourceVpcId`, `SourceSubnetId`, `TargetVpcId`, `TargetSubnetId`, `SitePairId` |
| `CreateFileBackup` | Create file backup<br>Required: `ResourceId` |
| `RunCopyPairTasks` | Run copy pair tasks<br>Required: `CopyPairIds`, `CopyPairType` |
| `ApplyBackupGroup` | Run apply backup group<br>Required: `BackupGroupId`, `ApplyDisks` |
| `CreateFileRestoreTask` | Create file restore task |
| `ReportJobProgress` | Report job progress |
| `CreateAutoBackupPolicy` | Create auto backup policy<br>Required: `Policy` |
| `CreateBackupVault` | Create backup vault |
| `CreateInstanceDrillPairs` | Create instance drill pairs<br>Required: `ProtectGroupId`, `DrillPairGroupVpc` |
| `BindAutoBackupPolicy` | Bind auto backup policy |
| `CreateDisasterRecoveryProtectGroup` | Create disaster recovery protect group<br>Required: `SitePairId`, `ProtectGroupType`, `RecoveryPointObjective` |
| `CreateFileBackupPlan` | Create file backup plan<br>Required: `PolicyId` |
| `CreateBackupGroup` | Create backup group<br>Required: `DiskIds` |
| `FinishFailoverCopyPairs` | Finish failover copy pairs<br>Required: `CopyPairIds`, `CopyPairType` |
| `CreateInstanceCopyPair` | Create instance copy pair<br>Required: `ProtectGroupId`, `CreateTargetInstanceParameters` |
| `CreateDisasterRecoverySitePair` | Create disaster recovery site pair<br>Required: `DisasterRecoveryType`, `SourceRegion`, `SourceZone`, `TargetRegion`, `TargetZone`, `SourceVpc`, `TargetVpc`, `SitePairProductType` |

## Blocked destructive actions (22)

`ModifySitePairAttribute`, `DeleteBackupVaults`, `ModifyBackupAttribute`, `DeleteSecurityGroupMapping`, `DeleteCopyPairs`, `ModifyProtectGroupAttribute`, `DeleteDisasterRecoveryVpcMapping`, `ModifyBackupVaultAttribute`, `ModifyAutoBackupPolicyAttribute`, `ModifyDrillGroupAttribute`, `DeleteBackupGroups`, `ModifyFileBackupAttribute`, `DeleteFileBackupPlans`, `DeleteAutoBackupPolicies`, `DeleteDisasterRecoveryProtectGroups`, `ModifyFileBackupPlan`, `StopCopyPairTasks`, `ModifyCopyPairAttribute`, `DeleteDrillPairs`, `ModifyDrillPairAttribute`, `DeleteDisasterRecoverySitePairs`, `DeleteFileBackups` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bdrc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20260330` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bdrc"`) for the allow/block decision and reason.

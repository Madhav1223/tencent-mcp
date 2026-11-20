---
name: tencent-cdwdoris
description: Tencent Cloud CDWDORIS via the Tencent MCP server — 60 actions in API version v20211228 (31 read-only auto-allowed). Use for cool, down, back, workload, cluster, nodes. Triggers on mentions of cdwdoris, cool, down, back, workload, cluster, nodes, audit, bind. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud CDWDORIS

Databases: 60 actions in API version `v20211228` — 31 read-only (auto-allowed), 12 gated mutations, 17 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdwdoris"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdwdoris/v20211228 — action signatures in `cdwdoris_client.ts`, full request/response shapes in `cdwdoris_models.ts`.

## Read actions (auto-allowed, 31)

| Action | What it does |
|---|---|
| `DescribeBackUpSchedules` | Describe back up schedules |
| `DescribeBackUpJob` | Describe back up job<br>Required: `InstanceId` |
| `DescribeCoolDownTableData` | Describe cool down table data |
| `DescribeDatabaseAuditRecords` | Describe database audit records<br>Required: `InstanceId`, `StartTime`, `EndTime`, `PageSize`, `PageNum` |
| `DescribeRestoreTaskDetail` | Describe restore task detail<br>Required: `InstanceId`, `BackUpJobId` |
| `DescribeDatabaseAuditDownload` | Describe database audit download<br>Required: `InstanceId`, `StartTime`, `EndTime`, `PageSize`, `PageNum` |
| `DescribeUserBindWorkloadGroup` | Describe user bind workload group |
| `DescribeInstanceNodesInfo` | Describe instance nodes info<br>Required: `InstanceID` |
| `DescribeInstanceUsedSubnets` | Describe instance used subnets<br>Required: `InstanceId` |
| `DescribeTableList` | Describe table list<br>Required: `InstanceId`, `DbName` |
| `DescribeBackUpTables` | Describe back up tables<br>Required: `InstanceId` |
| `DescribeClusterConfigsHistory` | Describe cluster configs history<br>Required: `InstanceId`, `Offset`, `Limit` (default 10), `StartTime`, `EndTime` |
| `DescribeSlowQueryRecords` | Describe slow query records<br>Required: `InstanceId`, `QueryDurationMs`, `StartTime`, `EndTime`, `PageSize`, `PageNum` |
| `DescribeInstances` | Describe instances |
| `DescribeInstanceState` | Describe instance state<br>Required: `InstanceId` |
| `DescribeClusterConfigs` | Describe cluster configs<br>Required: `InstanceId` |
| `DescribeCoolDownBackends` | Describe cool down backends |
| `DescribeInstanceOperations` | Describe instance operations<br>Required: `InstanceId` |
| `DescribeSqlApis` | Describe sql apis<br>Required: `InstanceId`, `ApiType` |
| `DescribeBackUpTaskDetail` | Describe back up task detail<br>Required: `InstanceId`, `BackUpJobId` |
| `DescribeInstance` | Describe instance<br>Required: `InstanceId` |
| `DescribeBackUpJobDetail` | Describe back up job detail<br>Required: `InstanceId`, `BackUpJobId` |
| `CheckCoolDownWorkingVariableConfigCorrect` | Check cool down working variable config correct |
| `DescribeInstanceNodesRole` | Describe instance nodes role<br>Required: `InstanceId` |
| `DescribeSpec` | Describe spec<br>Required: `Zone` |
| `DescribeAreaRegion` | Describe area region |
| `DescribeInstancesHealthState` | Describe instances health state |
| `DescribeSlowQueryRecordsDownload` | Describe slow query records download<br>Required: `InstanceId`, `QueryDurationMs`, `StartTime`, `EndTime` |
| `DescribeInstanceNodes` | Describe instance nodes<br>Required: `InstanceId` |
| `DescribeCoolDownPolicies` | Describe cool down policies |
| `DescribeWorkloadGroup` | Describe workload group<br>Required: `InstanceId` |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `CreateBackUpSchedule` | Create back up schedule<br>Required: `InstanceId`, `OperationType` |
| `OpenCoolDownPolicy` | Open cool down policy |
| `CreateWorkloadGroup` | Create workload group<br>Required: `InstanceId` |
| `ScaleOutInstance` | Scale out instance<br>Required: `InstanceId`, `Type`, `NodeCount` |
| `ResizeDisk` | Resize disk<br>Required: `InstanceId`, `Type`, `DiskSize` |
| `CreateCoolDownPolicy` | Create cool down policy |
| `UpdateCoolDown` | Update cool down |
| `ScaleUpInstance` | Scale up instance<br>Required: `InstanceId`, `SpecName`, `Type` |
| `ReduceInstance` | Run reduce instance<br>Required: `InstanceId`, `DelHosts`, `Type`, `HaType` |
| `ActionAlterUser` | Run action alter user<br>Required: `UserInfo`, `ApiType` |
| `CreateInstanceNew` | Create instance new<br>Required: `Zone`, `FeSpec`, `BeSpec`, `HaFlag`, `UserVPCId`, `UserSubnetId`, `ProductVersion`, `ChargeProperties`, `InstanceName`, `DorisUserPwd` |
| `OpenCoolDown` | Open cool down |

## Blocked destructive actions (17)

`DestroyInstance`, `ModifyNodeStatus`, `RecoverBackUpJob`, `ModifyUserBindWorkloadGroup`, `DeleteBackUpData`, `DeleteWorkloadGroup`, `ModifyClusterConfigs`, `ModifySecurityGroups`, `ModifyUserPrivilegesV3`, `ModifyWorkloadGroupStatus`, `ModifyCoolDownPolicy`, `ModifyWorkloadGroup`, `CancelBackupJob`, `RestartClusterForConfigs`, `RestartClusterForNode`, `ModifyInstance`, `ModifyInstanceKeyValConfigs` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdwdoris`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20211228` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdwdoris"`) for the allow/block decision and reason.

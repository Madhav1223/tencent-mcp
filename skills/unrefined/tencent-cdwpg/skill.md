---
name: tencent-cdwpg
description: Tencent Cloud CDWPG via the Tencent MCP server — 24 actions in API version v20201230 (14 read-only auto-allowed). Use for instances, scale, upgrade, accounts, dbconfig, dbparameters. Triggers on mentions of cdwpg, instances, scale, upgrade, accounts, dbconfig, dbparameters, dbparams, destroy. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud CDWPG

Databases: 24 actions in API version `v20201230` — 14 read-only (auto-allowed), 4 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdwpg"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdwpg/v20201230 — action signatures in `cdwpg_client.ts`, full request/response shapes in `cdwpg_models.ts`.

## Read actions (auto-allowed, 14)

| Action | What it does |
|---|---|
| `DescribeUserHbaConfig` | Describe user hba config<br>Required: `InstanceId` |
| `DescribeInstances` | Describe instances |
| `DescribeInstanceState` | Describe instance state<br>Required: `InstanceId` |
| `DescribeInstanceInfo` | Describe instance info<br>Required: `InstanceId` |
| `DescribeDBConfigHistory` | Describe dbconfig history<br>Required: `InstanceId` |
| `DescribeDBParams` | Describe dbparams |
| `DescribeInstanceOperations` | Describe instance operations<br>Required: `InstanceId` |
| `DescribeInstance` | Describe instance<br>Required: `InstanceId` |
| `DescribeInstanceNodes` | Describe instance nodes<br>Required: `InstanceId` |
| `DescribeUpgradeList` | Describe upgrade list<br>Required: `InstanceId` |
| `DescribeAccounts` | Describe accounts<br>Required: `InstanceId` |
| `DescribeSlowLog` | Describe slow log<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeErrorLog` | Describe error log<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeSimpleInstances` | Describe simple instances |
## Mutations (gated — need allowlist, 4)

| Action | What it does |
|---|---|
| `ScaleOutInstance` | Scale out instance<br>Required: `InstanceId`, `NodeType`, `ScaleOutCount` |
| `ScaleUpInstance` | Scale up instance<br>Required: `InstanceId`, `Case`, `ModifySpec` |
| `CreateInstanceByApi` | Create instance by api<br>Required: `InstanceName`, `Zone`, `UserVPCId`, `UserSubnetId`, `ChargeProperties`, `AdminPassword`, `Resources` |
| `UpgradeInstance` | Upgrade instance<br>Required: `InstanceId`, `PackageVersion` |

## Blocked destructive actions (6)

`ResetAccountPassword`, `ModifyDBParameters`, `DestroyInstanceByApi`, `RestartInstance`, `ModifyUserHba`, `ModifyInstance` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdwpg`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201230` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdwpg"`) for the allow/block decision and reason.

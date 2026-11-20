---
name: tencent-vdb
description: Tencent Cloud VDB via the Tencent MCP server — 17 actions in API version v20230616 (7 read-only auto-allowed). Use for price, security, instances, maintenance, scale, window. Triggers on mentions of vdb, price, security, instances, maintenance, scale, window, create, dbinstance. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Databases
metadata:
  version: "4"
---

# Tencent Cloud VDB

Databases: 17 actions in API version `v20230616` — 7 read-only (auto-allowed), 6 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vdb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Database instances are region- and zone-scoped with an isolated network (VPC/subnet) — new instances are unreachable until network and account grants are configured.
Price with `InquiryPrice*` before creating; spec changes (CPU/memory/disk) on paid instances are gated and often require a maintenance window.
Backups before schema or parameter changes: confirm the latest backup time via the backup actions. Read-only and read-write accounts are separate — create accounts with least privilege and rotate credentials with the dedicated password/key actions, never by sharing root.
Cross-region sync and migration run through dedicated sync actions — check task status actions until terminal state; full syncs on large instances take hours.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vdb/v20230616 — action signatures in `vdb_client.ts`, full request/response shapes in `vdb_models.ts`.

## Read actions (auto-allowed, 7)

| Action | What it does |
|---|---|
| `DescribeInstanceMaintenanceWindow` | Describe instance maintenance window<br>Required: `InstanceId` |
| `DescribeInstances` | Describe instances |
| `DescribeDBSecurityGroups` | Describe dbsecurity groups<br>Required: `InstanceId` |
| `DescribeInstanceNodes` | Describe instance nodes<br>Required: `InstanceId` |
| `DescribePriceResizeInstance` | Describe price resize instance<br>Required: `InstanceId` |
| `DescribePriceRenewInstance` | Describe price renew instance<br>Required: `InstanceId`, `PayPeriod` |
| `DescribePriceCreateInstance` | Describe price create instance<br>Required: `InstanceType`, `Cpu`, `Memory` (unit: GB), `DiskSize` (unit: GB), `WorkerNodeNum`, `PayMode`, `GoodsNum` |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `AssociateSecurityGroups` | Associate security groups<br>Required: `SecurityGroupIds`, `InstanceIds` |
| `CreateInstance` | Create instance<br>Required: `VpcId`, `SubnetId`, `PayMode` |
| `IsolateInstance` | Run isolate instance<br>Required: `InstanceId` |
| `ScaleUpInstance` | Scale up instance<br>Required: `InstanceId` |
| `ScaleOutInstance` | Scale out instance<br>Required: `InstanceId`, `ReplicaNum` |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `SecurityGroupIds`, `InstanceIds` |

## Blocked destructive actions (4)

`ModifyInstanceMaintenanceWindow`, `ModifyDBInstanceSecurityGroups`, `RecoverInstance`, `DestroyInstances` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vdb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230616` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vdb"`) for the allow/block decision and reason.

---
name: tencent-tdcpg
description: Tencent Cloud TDCPG via the Tencent MCP server — 25 actions in API version v20211118 (7 read-only auto-allowed). Use for cluster, instances, clusters, isolate, name, recover. Triggers on mentions of tdcpg, cluster, instances, clusters, isolate, name, recover, renew, time. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud TDCPG

General service: 25 actions in API version `v20211118` — 7 read-only (auto-allowed), 6 gated mutations, 12 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tdcpg"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tdcpg/v20211118 — action signatures in `tdcpg_client.ts`, full request/response shapes in `tdcpg_models.ts`.

## Read actions (auto-allowed, 7)

| Action | What it does |
|---|---|
| `DescribeClusterInstances` | Describe cluster instances<br>Required: `ClusterId` |
| `DescribeClusterRecoveryTimeRange` | Describe cluster recovery time range<br>Required: `ClusterId`, `DataPoint` |
| `DescribeClusters` | Describe clusters |
| `DescribeAccounts` | Describe accounts<br>Required: `ClusterId` |
| `DescribeResourcesByDealName` | Describe resources by deal name<br>Required: `DealName` |
| `DescribeClusterEndpoints` | Describe cluster endpoints<br>Required: `ClusterId` |
| `DescribeClusterBackups` | Describe cluster backups<br>Required: `ClusterId` |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `CreateCluster` | Create cluster<br>Required: `Zone`, `MasterUserPassword`, `CPU`, `Memory`, `VpcId`, `SubnetId`, `PayMode` |
| `TransformClusterPayMode` | Run transform cluster pay mode<br>Required: `ClusterId`, `CurrentPayMode` (POSTPAID_BY_HOUR), `TargetPayMode` (PREPAID) |
| `CreateClusterInstances` | Create cluster instances<br>Required: `ClusterId`, `CPU`, `Memory` |
| `IsolateCluster` | Run isolate cluster<br>Required: `ClusterId` |
| `CloneClusterToPointInTime` | Clone cluster to point in time<br>Required: `Zone`, `DBVersion`, `CPU`, `Memory`, `VpcId`, `SubnetId`, `PayMode`, `SourceClusterId`, `SourceDataPoint` |
| `IsolateClusterInstances` | Run isolate cluster instances<br>Required: `ClusterId`, `InstanceIdSet` |

## Blocked destructive actions (12)

`ModifyClusterInstancesSpec`, `ModifyAccountDescription`, `ModifyClusterName`, `ModifyClustersAutoRenewFlag`, `ResetAccountPassword`, `DeleteCluster`, `RestartClusterInstances`, `RecoverClusterInstances`, `ModifyClusterEndpointWanStatus`, `RecoverCluster`, `DeleteClusterInstances`, `RenewCluster` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tdcpg`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20211118` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tdcpg"`) for the allow/block decision and reason.

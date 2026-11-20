---
name: tencent-cetcd
description: Tencent Cloud CETCD via the Tencent MCP server — 20 actions in API version v20220325 (10 read-only auto-allowed). Use for etcd, snapshot, deletion, protection, attribute, available. Triggers on mentions of cetcd, etcd, snapshot, deletion, protection, attribute, available, configuration, creating. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CETCD

General service: 20 actions in API version `v20220325` — 10 read-only (auto-allowed), 7 gated mutations, 3 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cetcd"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cetcd/v20220325 — action signatures in `cetcd_client.ts`, full request/response shapes in `cetcd_models.ts`.

## Read actions (auto-allowed, 10)

| Action | What it does |
|---|---|
| `DescribeEtcdSnapshotPolicies` | Describe etcd snapshot policies<br>Required: `InstanceId` |
| `DescribeEtcdSnapshots` | Describe etcd snapshots<br>Required: `InstanceId` |
| `DescribeEtcdCredentials` | Describe etcd credentials<br>Required: `InstanceId` |
| `DescribeEtcdInstances` | Describe etcd instances |
| `DescribeEtcdAvailableVersions` | Describe etcd available versions |
| `DescribeEtcdCreatingProgress` | Describe etcd creating progress<br>Required: `InstanceId` |
| `DescribeRPCMethodList` | Describe rpcmethod list<br>Required: `InstanceId`, `PodName` |
| `DescribeEtcdTasks` | Describe etcd tasks |
| `DescribeEtcdQuota` | Describe etcd quota |
| `DescribeEtcdRegions` | Describe etcd regions |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `UpgradeEtcdInstance` | Upgrade etcd instance<br>Required: `InstanceId`, `EtcdVersion` |
| `ResizeEtcdInstance` | Resize etcd instance<br>Required: `InstanceId`, `Size` |
| `CreateEtcdSnapshot` | Create etcd snapshot<br>Required: `InstanceId`, `SnapshotName` |
| `EnableEtcdInstanceDeletionProtection` | Enable etcd instance deletion protection<br>Required: `InstanceId` |
| `CreateEtcdSnapshotPolicy` | Create etcd snapshot policy<br>Required: `InstanceId`, `SnapshotPolicyName` |
| `DisableEtcdInstanceDeletionProtection` | Disable etcd instance deletion protection<br>Required: `InstanceId` |
| `CreateEtcdInstance` | Create etcd instance<br>Required: `Name`, `VpcId`, `ServiceSubnetId`, `SubnetIds`, `EtcdVersion`, `Size` |

## Blocked destructive actions (3)

`ModifyEtcdConfiguration`, `ModifyEtcdSnapshotPolicy`, `ModifyEtcdAttribute` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cetcd`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220325` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cetcd"`) for the allow/block decision and reason.

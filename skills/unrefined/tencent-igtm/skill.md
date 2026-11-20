---
name: tencent-igtm
description: Tencent Cloud IGTM via the Tencent MCP server — 28 actions in API version v20231024 (15 read-only auto-allowed). Use for address, package, pool, strategy, monitor, detect. Triggers on mentions of igtm, address, package, pool, strategy, monitor, detect, auto, detectors. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud IGTM

General service: 28 actions in API version `v20231024` — 15 read-only (auto-allowed), 5 gated mutations, 8 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "igtm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/igtm/v20231024 — action signatures in `igtm_client.ts`, full request/response shapes in `igtm_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeAddressPoolList` | Describe address pool list |
| `DescribeDetectPackageDetail` | Describe detect package detail<br>Required: `ResourceId` |
| `DescribeInstanceDetail` | Describe instance detail<br>Required: `InstanceId` |
| `DescribeAddressLocation` | Describe address location<br>Required: `Address` |
| `DescribeDetectors` | Describe detectors |
| `DescribeMonitors` | Describe monitors |
| `DescribeDnsLineList` | Describe dns line list<br>Required: `InstanceId` |
| `DescribeInstanceList` | Describe instance list |
| `DescribeMonitorDetail` | Describe monitor detail<br>Required: `MonitorId` |
| `DescribeDetectTaskPackageList` | Describe detect task package list |
| `DescribeStrategyList` | Describe strategy list<br>Required: `InstanceId` |
| `DescribeQuotas` | Describe quotas |
| `DescribeAddressPoolDetail` | Describe address pool detail<br>Required: `PoolId` |
| `DescribeStrategyDetail` | Describe strategy detail<br>Required: `InstanceId`, `StrategyId` |
| `DescribeInstancePackageList` | Describe instance package list |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `CreateAddressPool` | Create address pool<br>Required: `PoolName`, `TrafficStrategy`, `AddressSet` |
| `CreateStrategy` | Create strategy<br>Required: `InstanceId`, `StrategyName`, `Source`, `MainAddressPoolSet`, `FallbackAddressPoolSet` |
| `CreateMonitor` | Create monitor<br>Required: `MonitorName`, `CheckProtocol`, `CheckInterval`, `Timeout`, `FailTimes`, `FailRate` (default 50), `DetectorStyle`, `DetectorGroupIds` |
| `CreateInstance` | Create instance<br>Required: `Domain`, `AccessType`, `GlobalTtl`, `PackageType` |
| `CreatePackageAndPay` | Create package and pay<br>Required: `DealType`, `GoodsType`, `GoodsNum`, `AutoRenew` |

## Blocked destructive actions (8)

`ModifyAddressPool`, `ModifyInstanceConfig`, `DeleteStrategy`, `DeleteMonitor`, `ModifyMonitor`, `ModifyPackageAutoRenew`, `ModifyStrategy`, `DeleteAddressPool` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `igtm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20231024` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="igtm"`) for the allow/block decision and reason.

---
name: tencent-cdc
description: Tencent Cloud CDC via the Tencent MCP server — 23 actions in API version v20201214 (12 read-only auto-allowed). Use for dedicated, cluster, site, sites, cache, clusters. Triggers on mentions of cdc, dedicated, cluster, site, sites, cache, clusters, image, order. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud CDC

Compute instances & pools: 23 actions in API version `v20201214` — 12 read-only (auto-allowed), 4 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdc/v20201214 — action signatures in `cdc_client.ts`, full request/response shapes in `cdc_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `DescribeDedicatedClusterHosts` | Describe dedicated cluster hosts<br>Required: `DedicatedClusterId` |
| `DescribeDedicatedClusterTypes` | Describe dedicated cluster types |
| `DescribeDedicatedClusterHostStatistics` | Describe dedicated cluster host statistics<br>Required: `DedicatedClusterId` |
| `DescribeDedicatedClusterOrders` | Describe dedicated cluster orders |
| `DescribeDedicatedClusters` | Describe dedicated clusters |
| `DescribeSitesDetail` | Describe sites detail |
| `DescribeDedicatedClusterCbsStatistics` | Describe dedicated cluster cbs statistics<br>Required: `DedicatedClusterId` |
| `DescribeDedicatedClusterInstanceTypes` | Describe dedicated cluster instance types<br>Required: `DedicatedClusterId` |
| `DescribeDedicatedClusterCosCapacity` | Describe dedicated cluster cos capacity<br>Required: `DedicatedClusterId` |
| `DescribeDedicatedSupportedZones` | Describe dedicated supported zones |
| `DescribeDedicatedClusterOverview` | Describe dedicated cluster overview<br>Required: `DedicatedClusterId` |
| `DescribeSites` | Describe sites |
## Mutations (gated — need allowlist, 4)

| Action | What it does |
|---|---|
| `CreateDedicatedClusterOrder` | Create dedicated cluster order<br>Required: `DedicatedClusterId` |
| `CreateSite` | Create site<br>Required: `Name`, `Country`, `Province`, `City`, `AddressLine` |
| `CreateDedicatedClusterImageCache` | Create dedicated cluster image cache<br>Required: `DedicatedClusterId`, `ImageId` |
| `CreateDedicatedCluster` | Create dedicated cluster<br>Required: `SiteId`, `Name`, `Zone` |

## Blocked destructive actions (7)

`ModifySiteDeviceInfo`, `ModifySiteInfo`, `DeleteSites`, `DeleteDedicatedClusterImageCache`, `DeleteDedicatedClusters`, `ModifyDedicatedClusterInfo`, `ModifyOrderStatus` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201214` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdc"`) for the allow/block decision and reason.

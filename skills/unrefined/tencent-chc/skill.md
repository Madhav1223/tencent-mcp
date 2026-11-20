---
name: tencent-chc
description: Tencent Cloud CHC via the Tencent MCP server — 41 actions in API version v20230418 (26 read-only auto-allowed). Use for order, work, model, collect, common, device. Triggers on mentions of chc, order, work, model, collect, common, device, personnel, customer. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud CHC

Compute instances & pools: 41 actions in API version `v20230418` — 26 read-only (auto-allowed), 14 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "chc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/chc/v20230418 — action signatures in `chc_client.ts`, full request/response shapes in `chc_models.ts`.

## Read actions (auto-allowed, 26)

| Action | What it does |
|---|---|
| `DescribeWorkOrderTypes` | Describe work order types |
| `DescribeModel` | Describe model<br>Required: `DevModel`, `CampusId`, `DeviceType` |
| `DescribeRacks` | Describe racks |
| `DescribeModelVersionList` | Describe model version list<br>Required: `DeviceType` |
| `DescribeCommonServiceWorkOrderDetail` | Describe common service work order detail<br>Required: `OrderId` |
| `DescribeModelEvaluationWorkOrderDetail` | Describe model evaluation work order detail<br>Required: `OrderId` |
| `DescribeCustomerInfo` | Describe customer info |
| `DescribeCampusList` | Describe campus list |
| `DescribeRacksDistribution` | Describe racks distribution<br>Required: `IdcUnitId` |
| `DescribeWorkOrderCarCollectList` | Describe work order car collect list |
| `DescribePositions` | Describe positions |
| `DescribeWorkOrderPersonnelCollectList` | Describe work order personnel collect list |
| `DescribeDeviceWorkOrderDetail` | Describe device work order detail<br>Required: `OrderId` |
| `DescribeAvailableModelList` | Describe available model list<br>Required: `IdcId`, `DeviceType` |
| `DescribeDeviceList` | Describe device list<br>Required: `DeviceType` |
| `DescribePositionStatusSummary` | Describe position status summary |
| `ExportCustomerWorkOrderDetail` | Export customer work order detail<br>Required: `BeginDateTime`, `EndDateTime` |
| `DescribePersonnelVisitWorkOrderDetail` | Describe personnel visit work order detail<br>Required: `OrderId` |
| `DescribeIdcUnitDetail` | Describe idc unit detail |
| `DescribeWorkOrderStatistics` | Describe work order statistics |
| `DescribeResourceUsage` | Describe resource usage |
| `DescribeIdcUnitAssetDetail` | Describe idc unit asset detail |
| `DescribeWorkOrderContactCollectList` | Describe work order contact collect list |
| `DescribeIdcs` | Describe idcs |
| `DescribeModelTemplate` | Describe model template<br>Required: `DeviceType` |
| `DescribeWorkOrderList` | Describe work order list |
## Mutations (gated — need allowlist, 14)

| Action | What it does |
|---|---|
| `CreateQuitWorkOrder` | Create quit work order<br>Required: `IdcId`, `DeviceType`, `StuffOption`, `IsPowerOffConfirm`, `DeviceSnList`, `HandoverMethod` |
| `CreateModelEvaluationWorkOrder` | Create model evaluation work order<br>Required: `ModelSet`, `CampusId`, `DeviceType` |
| `CreateServerModel` | Create server model<br>Required: `ModelDetail` |
| `CreateRackOffWorkOrder` | Create rack off work order<br>Required: `IdcId`, `DeviceType`, `StuffOption`, `IsPowerOffConfirm`, `DeviceSnList` |
| `CreateCommonServiceWorkOrder` | Create common service work order<br>Required: `DevicePositionSet`, `ServiceLevel`, `PreAuthorization`, `ContactName`, `ContactPhone`, `DeviceType`, `Instructions` |
| `CreatePowerOnWorkOrder` | Create power on work order<br>Required: `IdcId`, `DeviceType`, `DeviceSnList` |
| `CreateSpeciallyQuitWorkOrder` | Create specially quit work order<br>Required: `IdcId`, `DeviceType`, `HandoverMethod` |
| `CreatePowerOffWorkOrder` | Create power off work order<br>Required: `IdcId`, `DeviceType`, `IsPowerOffConfirm`, `DeviceSnList` |
| `CreatePersonnelVisitWorkOrder` | Create personnel visit work order<br>Required: `PersonnelSet`, `IdcId`, `IdcUnitIdSet`, `EnterStartTime`, `EnterEndTime`, `VisitReason`, `VisitRemark` |
| `ConfirmCommonServiceWorkOrder` | Confirm common service work order<br>Required: `OrderId` |
| `CreateMovingWorkOrder` | Create moving work order<br>Required: `IdcId`, `DeviceType`, `WithPowerOn`, `DeviceMovingList` |
| `CreateNetDeviceModel` | Create net device model<br>Required: `ModelDetail` |
| `CreateRackOnWorkOrder` | Create rack on work order<br>Required: `IdcId`, `DeviceType`, `StuffOption`, `WithPowerOn`, `DeviceRackOnList` |
| `CreateReceivingWorkOrder` | Create receiving work order<br>Required: `IdcId`, `DeviceType`, `EntryTime`, `ReceivingOperation` |

## Blocked destructive actions (1)

`ModifyWorkOrderTypeCollectFlag` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `chc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230418` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="chc"`) for the allow/block decision and reason.

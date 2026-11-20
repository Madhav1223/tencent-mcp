---
name: tencent-bm
description: Tencent Cloud BM via the Tencent MCP server — 53 actions in API version v20180423 (23 read-only auto-allowed). Use for device, devices, custom, image, operation, regulation. Triggers on mentions of bm, device, devices, custom, image, operation, regulation, band, class. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud BM

Compute instances & pools: 53 actions in API version `v20180423` — 23 read-only (auto-allowed), 18 gated mutations, 12 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bm/v20180423 — action signatures in `bm_client.ts`, full request/response shapes in `bm_models.ts`.

## Read actions (auto-allowed, 23)

| Action | What it does |
|---|---|
| `DescribeUserCmds` | Describe user cmds<br>Required: `Offset`, `Limit` |
| `DescribePsaRegulations` | Describe psa regulations<br>Required: `Limit`, `Offset` |
| `DescribeCustomImageProcess` | Describe custom image process<br>Required: `ImageId` |
| `DescribeDeviceHardwareInfo` | Describe device hardware info<br>Required: `InstanceIds` |
| `DescribeUserCmdTasks` | Describe user cmd tasks<br>Required: `Offset`, `Limit` |
| `DescribeDeviceClass` | Describe device class |
| `DescribeHostedDeviceOutBandInfo` | Describe hosted device out band info<br>Required: `InstanceIds`, `Zone` |
| `DescribeHardwareSpecification` | Describe hardware specification |
| `DescribeOsInfo` | Describe os info |
| `DescribeOperationResult` | Describe operation result<br>Required: `TaskId` |
| `DescribeDevicePosition` | Describe device position |
| `DescribeRegions` | Describe regions |
| `DescribeUserCmdTaskInfo` | Describe user cmd task info<br>Required: `TaskId` |
| `DescribeDevicePriceInfo` | Describe device price info<br>Required: `InstanceIds` |
| `DescribeTaskOperationLog` | Describe task operation log<br>Required: `TaskId` |
| `DescribeDeviceInventory` | Describe device inventory<br>Required: `Zone` |
| `DescribeDeviceOperationLog` | Describe device operation log<br>Required: `InstanceId` |
| `DescribeTaskInfo` | Describe task info<br>Required: `Offset`, `Limit` |
| `DescribeDevices` | Describe devices<br>Required: `Offset`, `Limit` (default 20) |
| `DescribeRepairTaskConstant` | Describe repair task constant |
| `DescribeCustomImages` | Describe custom images<br>Required: `Offset`, `Limit` |
| `DescribeDevicePartition` | Describe device partition<br>Required: `InstanceId` |
| `DescribeDeviceClassPartition` | Describe device class partition |
## Mutations (gated — need allowlist, 18)

| Action | What it does |
|---|---|
| `RebootDevices` | Reboot devices<br>Required: `InstanceIds` |
| `OfflineDevices` | Run offline devices<br>Required: `InstanceIds` |
| `RunUserCmd` | Run user cmd<br>Required: `CmdId`, `UserName`, `Password`, `InstanceIds` |
| `StartDevices` | Start devices<br>Required: `InstanceIds` |
| `ReloadDeviceOs` | Run reload device os<br>Required: `InstanceId`, `Password` |
| `CreatePsaRegulation` | Create psa regulation<br>Required: `PsaName`, `TaskTypeIds` |
| `BuyDevices` | Buy devices<br>Required: `Zone`, `OsTypeId`, `RaidId`, `GoodsCount`, `VpcId`, `SubnetId`, `DeviceClassCode`, `TimeUnit` (M | D), `TimeSpan` |
| `BindPsaTag` | Bind psa tag<br>Required: `PsaId`, `TagKey`, `TagValue` |
| `CreateUserCmd` | Create user cmd<br>Required: `Alias`, `OsType`, `Content` |
| `DetachCamRole` | Detach cam role<br>Required: `InstanceId` |
| `AttachCamRole` | Attach cam role<br>Required: `InstanceId`, `RoleName` |
| `ReturnDevices` | Run return devices<br>Required: `InstanceIds` |
| `UnbindPsaTag` | Unbind psa tag<br>Required: `PsaId`, `TagKey`, `TagValue` |
| `CreateSpotDevice` | Create spot device<br>Required: `Zone`, `ComputeType`, `OsTypeId`, `VpcId`, `SubnetId`, `GoodsNum`, `SpotStrategy` |
| `RepairTaskControl` | Repair task control<br>Required: `TaskId`, `Operate` |
| `SetOutBandVpnAuthPassword` | Set out band vpn auth password<br>Required: `Password`, `Operate` |
| `ShutdownDevices` | Run shutdown devices<br>Required: `InstanceIds` |
| `CreateCustomImage` | Create custom image<br>Required: `InstanceId`, `ImageName` |

## Blocked destructive actions (12)

`ModifyPsaRegulation`, `ModifyDeviceAutoRenewFlag`, `ModifyLanIp`, `ModifyUserCmd`, `DeleteUserCmds`, `DeleteCustomImages`, `DeletePsaRegulation`, `ModifyCustomImageAttribute`, `ModifyPayModePre2Post`, `ModifyDeviceAliases`, `RecoverDevices`, `ResetDevicePassword` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180423` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bm"`) for the allow/block decision and reason.

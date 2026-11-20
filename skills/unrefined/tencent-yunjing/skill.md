---
name: tencent-yunjing
description: Tencent Cloud YUNJING via the Tencent MCP server — 100 actions in API version v20180228 (55 read-only auto-allowed). Use for login, events, bash, malwares, open, places. Triggers on mentions of yunjing, login, events, bash, malwares, open, places, version, privilege. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud YUNJING

Security & identity: 100 actions in API version `v20180228` — 55 read-only (auto-allowed), 23 gated mutations, 22 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "yunjing"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/yunjing/v20180228 — action signatures in `yunjing_client.ts`, full request/response shapes in `yunjing_models.ts`.

## Read actions (auto-allowed, 55)

| Action | What it does |
|---|---|
| `DescribeComponentStatistics` | Describe component statistics |
| `DescribeAttackLogs` | Describe attack logs |
| `DescribeWeeklyReportMalwares` | Describe weekly report malwares<br>Required: `BeginDate` |
| `DescribeVulInfo` | Describe vul info<br>Required: `VulId` |
| `DescribeVuls` | Describe vuls<br>Required: `VulType` |
| `DescribeBashRules` | Describe bash rules<br>Required: `Type` |
| `ExportAttackLogs` | Export attack logs |
| `DescribeUsualLoginPlaces` | Describe usual login places<br>Required: `Uuid` |
| `DescribeReverseShellRules` | Describe reverse shell rules |
| `ExportBashEvents` | Export bash events |
| `DescribeProcesses` | Describe processes |
| `DescribeMalwares` | Describe malwares |
| `DescribePrivilegeRules` | Describe privilege rules |
| `DescribeImpactedHosts` | Describe impacted hosts<br>Required: `VulId` |
| `DescribeOpenPorts` | Describe open ports |
| `ExportMaliciousRequests` | Export malicious requests |
| `DescribeTagMachines` | Describe tag machines<br>Required: `Id` |
| `DescribeNonlocalLoginPlaces` | Describe nonlocal login places |
| `ExportPrivilegeEvents` | Export privilege events |
| `DescribeOverviewStatistics` | Describe overview statistics |
| `DescribeOpenPortTaskStatus` | Describe open port task status<br>Required: `Uuid` |
| `DescribeSecurityDynamics` | Describe security dynamics |
| `DescribeWeeklyReportNonlocalLoginPlaces` | Describe weekly report nonlocal login places<br>Required: `BeginDate` |
| `DescribeAccountStatistics` | Describe account statistics |
| `DescribeOpenPortStatistics` | Describe open port statistics |
| `ExportBruteAttacks` | Export brute attacks |
| `ExportMalwares` | Export malwares |
| `DescribeBruteAttacks` | Describe brute attacks |
| `ExportNonlocalLoginPlaces` | Export nonlocal login places |
| `DescribeMaliciousRequests` | Describe malicious requests |
| `DescribeReverseShellEvents` | Describe reverse shell events |
| `DescribeAgentVuls` | Describe agent vuls<br>Required: `VulType`, `Uuid` |
| `DescribeAccounts` | Describe accounts |
| `DescribeWeeklyReports` | Describe weekly reports |
| `DescribeProVersionInfo` | Describe pro version info |
| `DescribePrivilegeEvents` | Describe privilege events |
| `DescribeMachineInfo` | Describe machine info |
| `DescribeAlarmAttribute` | Describe alarm attribute |
| `DescribeComponents` | Describe components |
| `DescribeLoginWhiteList` | Describe login white list |
| `DescribeVulScanResult` | Describe vul scan result |
| `DescribeHistoryAccounts` | Describe history accounts<br>Required: `Uuid` |
| `DescribeProcessStatistics` | Describe process statistics |
| `DescribeWeeklyReportBruteAttacks` | Describe weekly report brute attacks<br>Required: `BeginDate` |
| `DescribeWeeklyReportVuls` | Describe weekly report vuls<br>Required: `BeginDate` |
| `DescribeWeeklyReportInfo` | Describe weekly report info<br>Required: `BeginDate` |
| `DescribeComponentInfo` | Describe component info<br>Required: `ComponentId` |
| `ExportReverseShellEvents` | Export reverse shell events |
| `DescribeProcessTaskStatus` | Describe process task status<br>Required: `Uuid` |
| `DescribeTags` | Describe tags |
| `DescribeSecurityTrends` | Describe security trends<br>Required: `BeginDate`, `EndDate` |
| `DescribeAttackLogInfo` | Describe attack log info<br>Required: `Id` |
| `DescribeBashEvents` | Describe bash events |
| `DescribeMachines` | Describe machines<br>Required: `MachineType`, `MachineRegion` |
| `InquiryPriceOpenProVersionPrepaid` | Inquire the price of: open pro version prepaid<br>Required: `ChargePrepaid`, `Machines` |
## Mutations (gated — need allowlist, 23)

| Action | What it does |
|---|---|
| `TrustMalwares` | Run trust malwares<br>Required: `Ids` |
| `OpenProVersion` | Open pro version<br>Required: `MachineType`, `MachineRegion`, `Quuids` |
| `EditBashRule` | Run edit bash rule<br>Required: `Name`, `Level`, `Rule` |
| `MisAlarmNonlocalLoginPlaces` | Run mis alarm nonlocal login places<br>Required: `Ids` |
| `CreateBaselineStrategy` | Create baseline strategy<br>Required: `StrategyName`, `ScanCycle`, `ScanAt`, `CategoryIds`, `IsGlobal`, `MachineType`, `RegionCode` |
| `CreateProcessTask` | Create process task<br>Required: `Uuid` |
| `EditReverseShellRule` | Run edit reverse shell rule |
| `UntrustMaliciousRequest` | Run untrust malicious request<br>Required: `Id` |
| `CreateOpenPortTask` | Create open port task<br>Required: `Uuid` |
| `CloseProVersion` | Close pro version |
| `TrustMaliciousRequest` | Run trust malicious request<br>Required: `Id` |
| `SwitchBashRules` | Switch bash rules<br>Required: `Id`, `Disabled` |
| `EditPrivilegeRule` | Run edit privilege rule |
| `OpenProVersionPrepaid` | Open pro version prepaid<br>Required: `ChargePrepaid`, `Machines` |
| `AddMachineTag` | Add machine tag<br>Required: `Quuid`, `TagId`, `MRegion`, `MArea` |
| `EditTags` | Run edit tags<br>Required: `Name` |
| `SeparateMalwares` | Run separate malwares<br>Required: `Ids` |
| `AddLoginWhiteList` | Add login white list<br>Required: `Rules` |
| `UntrustMalwares` | Run untrust malwares<br>Required: `Ids` |
| `SetBashEventsStatus` | Set bash events status<br>Required: `Ids`, `Status` |
| `RescanImpactedHost` | Run rescan impacted host<br>Required: `Id` |
| `IgnoreImpactedHosts` | Run ignore impacted hosts<br>Required: `Ids` |
| `CreateUsualLoginPlaces` | Create usual login places<br>Required: `Uuids`, `Places` |

## Blocked destructive actions (22)

`DeleteTags`, `DeleteMachineTag`, `DeleteUsualLoginPlaces`, `DeletePrivilegeEvents`, `RenewProVersion`, `DeleteBashEvents`, `DeleteMaliciousRequests`, `RecoverMalwares`, `DeleteReverseShellRules`, `DeleteBruteAttacks`, `ModifyLoginWhiteList`, `DeleteNonlocalLoginPlaces`, `DeleteReverseShellEvents`, `DeletePrivilegeRules`, `DeleteMalwares`, `DeleteLoginWhiteList`, `ModifyAlarmAttribute`, `DeleteBashRules`, `ModifyAutoOpenProVersionConfig`, `ModifyProVersionRenewFlag`, `DeleteAttackLogs`, `DeleteMachine` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `yunjing`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180228` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="yunjing"`) for the allow/block decision and reason.

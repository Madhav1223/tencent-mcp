---
name: tencent-ssa
description: Tencent Cloud SSA via the Tencent MCP server — 23 actions in API version v20180608 (21 read-only auto-allowed). Use for asset, check, compliance, alert, event, cspm. Triggers on mentions of ssa, asset, check, compliance, alert, event, cspm, detection, divulge. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud SSA

Security & identity: 23 actions in API version `v20180608` — 21 read-only (auto-allowed), 2 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ssa"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ssa/v20180608 — action signatures in `ssa_client.ts`, full request/response shapes in `ssa_models.ts`.

## Read actions (auto-allowed, 21)

| Action | What it does |
|---|---|
| `DescribeAssetDetailList` | Describe asset detail list |
| `DescribeConfigList` | Describe config list |
| `DescribeLeakDetectionList` | Describe leak detection list<br>Required: `Filters`, `Limit`, `Page`, `StartTime`, `EndTime` |
| `DescribeMappingResults` | Describe mapping results |
| `DescribeEventDetail` | Describe event detail |
| `DescribeComplianceAssetList` | Describe compliance asset list<br>Required: `Offset`, `Limit`, `Id` |
| `DescribeDomainList` | Describe domain list |
| `DescribeSocCheckItemList` | Describe soc check item list |
| `DescribeAssetDetail` | Describe asset detail<br>Required: `Params` |
| `DescribeComplianceList` | Describe compliance list |
| `DescribeAssetList` | Describe asset list<br>Required: `Params` |
| `DescribeCheckConfigAssetList` | Describe check config asset list<br>Required: `Id`, `Offset`, `Limit` |
| `DescribeVulList` | Describe vul list<br>Required: `Params` |
| `DescribeSocCheckResultList` | Describe soc check result list |
| `DescribeSocAlertDetails` | Describe soc alert details<br>Required: `AlertId` |
| `DescribeAlarmStat` | Describe alarm stat |
| `DescribeSocCspmCompliance` | Describe soc cspm compliance |
| `DescribeSocAlertList` | Describe soc alert list<br>Required: `PageSize`, `PageIndex`, `Scenes` |
| `DescribeCheckConfigDetail` | Describe check config detail<br>Required: `Id` |
| `DescribeComplianceDetail` | Describe compliance detail<br>Required: `Id` |
| `DescribeVulDetail` | Describe vul detail<br>Required: `UniqId` |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `SaEventPub` | Run sa event pub<br>Required: `Asset`, `EventName`, `EventType1`, `EventType2`, `Level`, `Status`, `StartTime`, `Offset`, `Limit`, `EndTime`, `OldIdMd5` |
| `SaDivulgeScanRuleMutate` | Run sa divulge scan rule mutate<br>Required: `Id`, `DivulgeSoure`, `DivulgeSoureUrl`, `RuleName`, `RuleWord`, `ScanStatus` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ssa`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180608` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ssa"`) for the allow/block decision and reason.

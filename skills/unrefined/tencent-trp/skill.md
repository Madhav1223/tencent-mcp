---
name: tencent-trp
description: Tencent Cloud TRP via the Tencent MCP server — 63 actions in API version v20210515 (34 read-only auto-allowed). Use for code, trace, scan, brand, cycle, flavor. Triggers on mentions of trp, code, trace, scan, brand, cycle, flavor, king, analysis. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Blockchain & trust
metadata:
  version: "4"
---

# Tencent Cloud TRP

Blockchain & trust: 63 actions in API version `v20210515` — 34 read-only (auto-allowed), 16 gated mutations, 13 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "trp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Networks and channels must exist before contracts or identities — create bottom-up and verify each layer.
Private keys and DIDs are user-held: the platform never recovers them — back up at creation.
Chaincode/contract invocation is async with block confirmation — poll transaction status until committed, not just submitted.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/trp/v20210515 — action signatures in `trp_client.ts`, full request/response shapes in `trp_models.ts`.

## Read actions (auto-allowed, 34)

| Action | What it does |
|---|---|
| `DescribeTraceCodeById` | Describe trace code by id |
| `DescribeProducts` | Describe products |
| `DescribeCustomRules` | Describe custom rules |
| `DescribeCustomRuleById` | Describe custom rule by id<br>Required: `CustomId` |
| `DescribeRawScanLogs` | Describe raw scan logs |
| `DescribeFlavorKingCycleBrandScanAnalysis` | Describe flavor king cycle brand scan analysis<br>Required: `CorpId`, `TypeDate`, `QueryDate` |
| `DescribeCodeBatchById` | Describe code batch by id |
| `DescribeTraceCodes` | Describe trace codes |
| `DescribePlanQRCodes` | Describe plan qrcodes<br>Required: `PlanId`, `StartTime`, `EndTime`, `PageNo`, `PageSize` |
| `DescribeFlavorKingCycleBrandImportantCityScanAnalysis` | Describe flavor king cycle brand important city scan analysis<br>Required: `CorpId`, `TypeDate`, `QueryDate` |
| `DescribeCodesByPack` | Describe codes by pack<br>Required: `PackId` |
| `DescribeMerchantById` | Describe merchant by id<br>Required: `MerchantId` |
| `DescribeAgentCorps` | Describe agent corps |
| `DescribeCorpQuotas` | Describe corp quotas |
| `DescribePlanQRCodeScanRecords` | Describe plan qrcode scan records<br>Required: `StartTime`, `EndTime`, `PageNo`, `PageSize` |
| `DownloadGEO` | Download geo |
| `DescribeCodeBatches` | Describe code batches |
| `DescribeFlavorKingCycleBrandImportantProvinceScanAnalysis` | Describe flavor king cycle brand important province scan analysis<br>Required: `CorpId`, `TypeDate`, `QueryDate` |
| `DescribeProductById` | Describe product by id<br>Required: `ProductId` |
| `DescribeTmpToken` | Describe tmp token |
| `DescribeTraceDataById` | Describe trace data by id<br>Required: `Id` |
| `DescribeFlavorKingCycleBrandImportantProvinceUserAnalysis` | Describe flavor king cycle brand important province user analysis<br>Required: `CorpId`, `TypeDate`, `QueryDate` |
| `DescribeScanStats` | Describe scan stats |
| `DescribeCodePackStatus` | Describe code pack status<br>Required: `PackId` |
| `DescribeCodeBatchs` | Describe code batchs |
| `DescribeCodePackUrl` | Describe code pack url<br>Required: `PackId` |
| `DescribeFlavorKingCycleBrandScanMetrics` | Describe flavor king cycle brand scan metrics<br>Required: `CorpId`, `QueryDate` |
| `DescribeMerchants` | Describe merchants |
| `DescribeTraceDataList` | Describe trace data list |
| `DescribeCodePacks` | Describe code packs |
| `DescribeScanLogs` | Describe scan logs |
| `DescribeFlavorKingCycleBrandProvinceScanAnalysis` | Describe flavor king cycle brand province scan analysis<br>Required: `CorpId`, `TypeDate`, `QueryDate` |
| `DescribeJobFileUrl` | Describe job file url<br>Required: `JobId` |
| `DescribeFlavorKingCycleBrandProvinceCityScanAnalysis` | Describe flavor king cycle brand province city scan analysis<br>Required: `CorpId`, `QueryDate` |
## Mutations (gated — need allowlist, 16)

| Action | What it does |
|---|---|
| `AuthorizedTransfer` | Authorize d transfer<br>Required: `BusinessSecurityData` |
| `CreateTraceCodesAsync` | Create trace codes async |
| `CreateChainBatch` | Create chain batch<br>Required: `CorpId`, `ChainList` |
| `CreateProduct` | Create product<br>Required: `Name`, `MerchantId` |
| `ReportBatchCallbackStatus` | Report batch callback status<br>Required: `BusinessSecurityData` |
| `ReportScanDetail` | Report scan detail<br>Required: `ScanDetails` |
| `CreateTraceCodes` | Create trace codes<br>Required: `BatchId` |
| `CreateTraceChain` | Create trace chain |
| `CreateCustomPack` | Create custom pack<br>Required: `MerchantId` |
| `CreateCorporationOrder` | Create corporation order<br>Required: `CorpName`, `Owner`, `CodeQuota`, `ExpireTime`, `Amount` |
| `CreateCustomRule` | Create custom rule<br>Required: `Name`, `MerchantId`, `CodeLength`, `CodeParts` |
| `CreateCodeBatch` | Create code batch |
| `EffectFeedback` | Run effect feedback<br>Required: `BusinessSecurityData` |
| `CreateTraceData` | Create trace data |
| `CreateCodePack` | Create code pack<br>Required: `MerchantId`, `CodeLength`, `CodeType` |
| `CreateMerchant` | Create merchant<br>Required: `Name` |

## Blocked destructive actions (13)

`ModifyTraceCodeUnlink`, `ModifyTraceData`, `ModifyTraceDataRanks`, `ModifyCustomRule`, `ModifyProduct`, `ModifyCustomRuleStatus`, `DeleteProduct`, `DeleteMerchant`, `ModifyMerchant`, `DeleteCodeBatch`, `DeleteTraceData`, `ModifyTraceCode`, `ModifyCodeBatch` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `trp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210515` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="trp"`) for the allow/block decision and reason.

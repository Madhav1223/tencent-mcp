---
name: tencent-billing
description: Tencent Cloud BILLING via the Tencent MCP server — 69 actions in API version v20180709 (50 read-only auto-allowed). Use for allocation, summary, bill, cost, budget, gather. Triggers on mentions of billing, allocation, summary, bill, cost, budget, gather, unit, dosage. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Billing & cost
metadata:
  version: "4"
---

# Tencent Cloud BILLING

Billing & cost: 69 actions in API version `v20180709` — 50 read-only (auto-allowed), 9 gated mutations, 10 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "billing"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Billing data lags real usage by hours — reconcile against live resource inventory, not just the bill.
Group costs by tag/project/uin before optimizing; untagged spend is unactionable — fix tagging first.
Invoices and vouchers have eligibility windows and thresholds — check them before promising reimbursement or deductions.
Budget alerts notify; they don't enforce — pair every budget with an owner and a runbook, not just an email.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/billing/v20180709 — action signatures in `billing_client.ts`, full request/response shapes in `billing_models.ts`.

## Read actions (auto-allowed, 50)

| Action | What it does |
|---|---|
| `DescribeRenewInstances` | Describe renew instances<br>Required: `MaxResults` |
| `DescribeBillDetailForOrganization` | Describe bill detail for organization<br>Required: `Offset`, `Limit` |
| `DescribeCostSummaryByResource` | Describe cost summary by resource<br>Required: `BeginTime`, `EndTime`, `Limit`, `Offset` (default 0) |
| `DescribeBillList` | Describe bill list<br>Required: `StartTime`, `EndTime`, `Offset`, `Limit` |
| `DescribeAllocationSummaryByResource` | Describe allocation summary by resource<br>Required: `Limit`, `Offset` |
| `DescribeAllocationRuleSummary` | Describe allocation rule summary<br>Required: `Limit`, `Offset` |
| `DescribeBillResourceSummary` | Describe bill resource summary<br>Required: `Offset`, `Limit`, `Month` (format `yyyy-mm…`) |
| `DescribeAllocateConditions` | Describe allocate conditions |
| `DescribeBudgetRemindRecordList` | Describe budget remind record list<br>Required: `PageNo`, `PageSize`, `BudgetId` |
| `DescribeAllocationOverview` | Describe allocation overview<br>Required: `Limit`, `Offset` |
| `DescribeDosageDetailList` | Describe dosage detail list<br>Required: `StartTime`, `EndTime`, `ProductCode`, `Offset`, `Limit` |
| `DescribeVoucherInfo` | Describe voucher info<br>Required: `Limit` (default 20), `Offset` (default 1) |
| `DescribeCostSummaryByProject` | Describe cost summary by project<br>Required: `BeginTime`, `EndTime`, `Limit`, `Offset` (default 0) |
| `DescribeCostExplorerSummary` | Describe cost explorer summary<br>Required: `BeginTime` (format `yyyy-mm-dd…`), `EndTime` (format `yyyy-mm-dd…`), `BillType`, `PeriodType`, `Dimensions`, `FeeType`, `PageSize`, `PageNo` |
| `DescribeBillResourceSummaryForOrganization` | Describe bill resource summary for organization<br>Required: `Offset`, `Limit`, `Month` (format `yyyy-mm…`) |
| `DescribeBillDetail` | Describe bill detail<br>Required: `Offset`, `Limit` |
| `DescribeBillSummary` | Describe bill summary<br>Required: `Month` (format `2023-04…`), `GroupType` |
| `DescribeBillSummaryByPayMode` | Describe bill summary by pay mode<br>Required: `BeginTime`, `EndTime` |
| `DescribeAllocationRuleDetail` | Describe allocation rule detail<br>Required: `RuleId` |
| `DescribeCostSummaryByRegion` | Describe cost summary by region<br>Required: `BeginTime`, `EndTime`, `Limit`, `Offset` (default 0) |
| `DescribeVoucherUsageDetails` | Describe voucher usage details<br>Required: `Limit` (default 20), `Offset` (default 1), `VoucherId` |
| `DescribeAllocationTrendByMonth` | Describe allocation trend by month<br>Required: `Month` (format `2024-02…`), `TreeNodeUniqKey` |
| `DescribeBillDownloadUrl` | Describe bill download url<br>Required: `FileType`, `Month` |
| `DescribeDosageCosDetailByDate` | Describe dosage cos detail by date<br>Required: `StartDate` (format `yyyy-mm-dd…`), `EndDate` (format `yyyy-mm-dd…`), `BucketName` |
| `DescribeAllocationBillConditions` | Describe allocation bill conditions |
| `DescribeAccountBalance` | Describe account balance |
| `DescribeAllocationTree` | Describe allocation tree |
| `DescribeDosageDetailByDate` | Describe dosage detail by date<br>Required: `StartDate`, `EndDate`, `ProductCode`, `Domain` |
| `DescribeAllocationUnitDetail` | Describe allocation unit detail<br>Required: `Id` |
| `DescribeTagList` | Describe tag list<br>Required: `Limit`, `Offset` |
| `DescribeBillAdjustInfo` | Describe bill adjust info |
| `DescribeAllocationBillDetail` | Describe allocation bill detail<br>Required: `Limit`, `Offset` |
| `DescribeBillSummaryByRegion` | Describe bill summary by region<br>Required: `BeginTime`, `EndTime` |
| `DescribeBillSummaryByProject` | Describe bill summary by project<br>Required: `BeginTime`, `EndTime` |
| `DescribeAllocationMonthOverview` | Describe allocation month overview |
| `DescribeBillSummaryByTag` | Describe bill summary by tag<br>Required: `BeginTime`, `EndTime`, `TagKey` |
| `DescribeBillSummaryForOrganization` | Describe bill summary for organization<br>Required: `Month` (format `2023-04…`), `GroupType` |
| `DescribeGatherResource` | Describe gather resource<br>Required: `Limit`, `Offset` |
| `DescribeSavingPlanResourceInfo` | Describe saving plan resource info<br>Required: `Limit`, `Offset` |
| `DescribeOrgMemberAccountBalance` | Describe org member account balance |
| `DescribeBudget` | Describe budget<br>Required: `PageNo`, `PageSize` |
| `DescribeCostSummaryByTag` | Describe cost summary by tag<br>Required: `BeginTime`, `EndTime`, `TagKey` |
| `DescribeAllocationSummaryByBusiness` | Describe allocation summary by business<br>Required: `Limit`, `Offset` |
| `DescribeBudgetOperationLog` | Describe budget operation log<br>Required: `PageNo`, `PageSize`, `BudgetId` |
| `DescribeDealsByCond` | Describe deals by cond<br>Required: `StartTime`, `EndTime`, `Limit` (default 20) |
| `DescribeGatherRuleDetail` | Describe gather rule detail<br>Required: `Id` |
| `DescribeCostSummaryByProduct` | Describe cost summary by product<br>Required: `BeginTime`, `EndTime`, `Limit`, `Offset` (default 0) |
| `DescribeAllocationSummaryByItem` | Describe allocation summary by item<br>Required: `Limit`, `Offset` |
| `DescribeBillSummaryByProduct` | Describe bill summary by product<br>Required: `BeginTime`, `EndTime` |
| `DescribeCostDetail` | Describe cost detail<br>Required: `Limit`, `Offset` |
## Mutations (gated — need allowlist, 9)

| Action | What it does |
|---|---|
| `CreateBudget` | Create budget<br>Required: `BudgetName`, `CycleType`, `PeriodBegin`, `PeriodEnd`, `PlanType`, `BudgetQuota`, `BillType`, `FeeType`, `WarnJson` |
| `CreateAllocationUnit` | Create allocation unit<br>Required: `ParentId` |
| `CreateAllocationTag` | Create allocation tag<br>Required: `TagKey` |
| `SetRenewal` | Set renewal<br>Required: `ProductCode`, `RegionCode`, `InstanceId`, `RenewFlag` |
| `CreateGatherRule` | Create gather rule<br>Required: `Id`, `RuleList` |
| `CreateInstance` | Create instance<br>Required: `ClientToken`, `ProductCode`, `SubProductCode`, `RegionCode`, `ZoneCode`, `PayMode`, `Parameter` |
| `CreateAllocationRule` | Create allocation rule<br>Required: `RuleList` |
| `PayDeals` | Run pay deals |
| `RefundInstance` | Refund instance<br>Required: `ClientToken`, `ProductCode`, `SubProductCode`, `InstanceId`, `RegionCode` |

## Blocked destructive actions (10)

`DeleteGatherRule`, `DeleteAllocationUnit`, `DeleteBudget`, `DeleteAllocationRule`, `ModifyGatherRule`, `ModifyAllocationUnit`, `ModifyBudget`, `RenewInstance`, `DeleteAllocationTag`, `ModifyAllocationRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `billing`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180709` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="billing"`) for the allow/block decision and reason.

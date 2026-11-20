---
name: tencent-partners
description: Tencent Cloud PARTNERS via the Tencent MCP server — 23 actions in API version v20180321 (16 read-only auto-allowed). Use for agent, client, deals, clients, deal, infos. Triggers on mentions of partners, agent, client, deals, clients, deal, infos, rebate, relation. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Billing & cost
metadata:
  version: "4"
---

# Tencent Cloud PARTNERS

Billing & cost: 23 actions in API version `v20180321` — 16 read-only (auto-allowed), 5 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "partners"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Billing data lags real usage by hours — reconcile against live resource inventory, not just the bill.
Group costs by tag/project/uin before optimizing; untagged spend is unactionable — fix tagging first.
Invoices and vouchers have eligibility windows and thresholds — check them before promising reimbursement or deductions.
Budget alerts notify; they don't enforce — pair every budget with an owner and a runbook, not just an email.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/partners/v20180321 — action signatures in `partners_client.ts`, full request/response shapes in `partners_models.ts`.

## Read actions (auto-allowed, 16)

| Action | What it does |
|---|---|
| `DescribeAgentBills` | Describe agent bills<br>Required: `SettleMonth` |
| `DescribeRebateInfos` | Describe rebate infos |
| `DescribeClientBalanceNew` | Describe client balance new<br>Required: `ClientUin` |
| `DescribeUnbindClientList` | Describe unbind client list<br>Required: `Status`, `Offset`, `Limit` |
| `DescribeSalesmans` | Describe salesmans<br>Required: `Offset`, `Limit` |
| `DescribeClientSwitchTraTaskInfo` | Describe client switch tra task info<br>Required: `ClientUin`, `SwitchType` |
| `DescribeAgentPayDealsV2` | Describe agent pay deals v2<br>Required: `Offset`, `Limit` |
| `DescribeAgentAuditedClients` | Describe agent audited clients |
| `DescribeAgentDealsPriceDetailByDealName` | Describe agent deals price detail by deal name<br>Required: `DealCreatYear`, `DealNames` |
| `DescribeClientJoinIncreaseList` | Describe client join increase list<br>Required: `ClientUins` |
| `DescribeAgentSelfPayDealsV2` | Describe agent self pay deals v2<br>Required: `OwnerUin`, `Offset`, `Limit` |
| `DescribeAgentRelateBigDealIds` | Describe agent relate big deal ids<br>Required: `BigDealId` |
| `DescribeAgentDealsByCache` | Describe agent deals by cache<br>Required: `Offset`, `Limit` |
| `DescribeAgentClientGrade` | Describe agent client grade<br>Required: `ClientUin` |
| `DescribeRebateInfosNew` | Describe rebate infos new |
| `DescribeAgentClients` | Describe agent clients |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `AssignClientsToSales` | Run assign clients to sales<br>Required: `ClientUins`, `SalesUin`, `AssignClientStatus`, `AssignActionType` |
| `AgentTransferMoney` | Run agent transfer money<br>Required: `ClientUin`, `Amount` |
| `AgentPayDeals` | Run agent pay deals<br>Required: `OwnerUin`, `AgentPay`, `DealNames` |
| `AuditApplyClient` | Audit apply client<br>Required: `ClientUin`, `AuditResult`, `Note` |
| `CreatePayRelationForClient` | Create pay relation for client<br>Required: `ClientUin` |

## Blocked destructive actions (2)

`RemovePayRelationForClient`, `ModifyClientRemark` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `partners`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180321` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="partners"`) for the allow/block decision and reason.

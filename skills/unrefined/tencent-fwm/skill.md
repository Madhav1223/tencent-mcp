---
name: tencent-fwm
description: Tencent Cloud FWM via the Tencent MCP server — 44 actions in API version v20250611 (15 read-only auto-allowed). Use for strategy, edge, risk, security, sequence, dispatch. Triggers on mentions of fwm, strategy, edge, risk, security, sequence, dispatch, ignore, organ. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud FWM

General service: 44 actions in API version `v20250611` — 15 read-only (auto-allowed), 12 gated mutations, 17 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "fwm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/fwm/v20250611 — action signatures in `fwm_client.ts`, full request/response shapes in `fwm_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeStrategyAccounts` | Describe strategy accounts<br>Required: `Product` |
| `DescribePolicyRiskAccountProductStats` | Describe policy risk account product stats |
| `DescribeStrategyDispatchStatus` | Describe strategy dispatch status |
| `DescribeRiskAnalysisDetails` | Describe risk analysis details |
| `DescribeRiskList` | Describe risk list<br>Required: `Limit`, `Offset` |
| `DescribeSecurityGroupRules` | Describe security group rules |
| `DescribeVpcAclRules` | Describe vpc acl rules<br>Required: `GroupId` |
| `DescribeRiskCategoryStats` | Describe risk category stats |
| `DescribeOrganMembers` | Describe organ members |
| `DescribeSecurityGroupRule` | Describe security group rule |
| `DescribeStrategies` | Describe strategies |
| `DescribeNatAclRules` | Describe nat acl rules<br>Required: `GroupId` |
| `DescribeStrategy` | Describe strategy |
| `DescribeEdgeAclRules` | Describe edge acl rules<br>Required: `GroupId` |
| `DescribeOrganSummary` | Describe organ summary |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `CreateNatAclRuleGroup` | Create nat acl rule group<br>Required: `GroupName`, `Product`, `Rules` |
| `CreateSecurityGroupRule` | Create security group rule |
| `CreateVpcAclRule` | Create vpc acl rule<br>Required: `GroupId`, `Rules` |
| `CreateAnalyzePolicyTask` | Create analyze policy task<br>Required: `Products` |
| `CreateStrategy` | Create strategy<br>Required: `Product` |
| `DispatchStrategy` | Dispatch strategy |
| `CreateSecurityGroupRuleGroup` | Create security group rule group |
| `IgnorePolicyRisk` | Run ignore policy risk<br>Required: `RiskId` |
| `CreateNatAclRule` | Create nat acl rule<br>Required: `GroupId`, `Rules` |
| `CreateEdgeAclRule` | Create edge acl rule |
| `CreateVpcAclRuleGroup` | Create vpc acl rule group<br>Required: `GroupName`, `Product`, `Rules` |
| `CreateEdgeAclRuleGroup` | Create edge acl rule group |

## Blocked destructive actions (17)

`ModifyRuleGroup`, `ModifyNatAclRuleSequence`, `ModifySecurityGroupRule`, `DeleteNatAclRule`, `ModifyEdgeAclRuleSequence`, `DeleteStrategy`, `ModifyStrategySequence`, `DeleteVpcAclRule`, `DeleteEdgeAclRule`, `ModifyVpcAclRuleSequence`, `DeleteRuleGroup`, `CancelIgnorePolicyRisk`, `ModifyStrategy`, `DeleteSecurityGroupRule`, `ModifyEdgeAclRule`, `ModifyVpcAclRule`, `ModifyNatAclRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `fwm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250611` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="fwm"`) for the allow/block decision and reason.

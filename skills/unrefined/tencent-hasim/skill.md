---
name: tencent-hasim
description: Tencent Cloud HASIM via the Tencent MCP server — 22 actions in API version v20210716 (8 read-only auto-allowed). Use for link, tactic, advanced, links, orders, renew. Triggers on mentions of hasim, link, tactic, advanced, links, orders, renew, tactics, tags. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud HASIM

General service: 22 actions in API version `v20210716` — 8 read-only (auto-allowed), 3 gated mutations, 11 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "hasim"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/hasim/v20210716 — action signatures in `hasim_client.ts`, full request/response shapes in `hasim_models.ts`.

## Read actions (auto-allowed, 8)

| Action | What it does |
|---|---|
| `DescribeOrders` | Describe orders |
| `DescribeTactics` | Describe tactics |
| `DescribeLinks` | Describe links |
| `DescribeRule` | Describe rule<br>Required: `RuleID` |
| `DescribeTags` | Describe tags |
| `DescribeLink` | Describe link<br>Required: `LinkID` |
| `DescribeTactic` | Describe tactic<br>Required: `TacticID` |
| `DescribeRules` | Describe rules |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `CreateRule` | Create rule<br>Required: `Name`, `Type`, `IsActive`, `Notice` |
| `CreateTag` | Create tag<br>Required: `Name` |
| `CreateTactic` | Create tactic<br>Required: `Name`, `IsAuto`, `PingInterval`, `IsWeak`, `WeakThreshold`, `IsDelay`, `DelayThreshold`, `IsFake`, `FakeIP`, `FakeInterval`, `IsNet`, `Network`, `IsMove`, `IsPriorityTele`, `PriorityTele`, `IsBottomTele`, `BottomTele`, `IsBestSignal` |

## Blocked destructive actions (11)

`DeleteTactic`, `DeleteTag`, `DeleteRule`, `ModifyRuleStatus`, `ModifyLinkAdvancedLog`, `ModifyLinkTele`, `ModifyRule`, `RenewLinkInfo`, `ModifyTactic`, `ModifyLinkTactic`, `ModifyTag` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `hasim`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210716` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="hasim"`) for the allow/block decision and reason.

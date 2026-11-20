---
name: tencent-bma
description: Tencent Cloud BMA via the Tencent MCP server — 11 actions in API version v20221115 (4 read-only auto-allowed). Use for bpfake, bpwhite, applist, urls, bpbrand, bpbrands. Triggers on mentions of bma, bpfake, bpwhite, applist, urls, bpbrand, bpbrands, lists. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud BMA

General service: 11 actions in API version `v20221115` — 4 read-only (auto-allowed), 6 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bma"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bma/v20221115 — action signatures in `bma_client.ts`, full request/response shapes in `bma_models.ts`.

## Read actions (auto-allowed, 4)

| Action | What it does |
|---|---|
| `DescribeBPWhiteLists` | Describe bpwhite lists |
| `DescribeBPBrands` | Describe bpbrands |
| `DescribeBPFakeAPPList` | Describe bpfake applist |
| `DescribeBPFakeURLs` | Describe bpfake urls |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `CreateBPWhiteList` | Create bpwhite list<br>Required: `CompanyId`, `WhiteListType`, `WhiteLists` |
| `CreateBPFakeAPP` | Create bpfake app<br>Required: `CompanyId`, `FakeAPPName` |
| `CreateBPFakeURLs` | Create bpfake urls<br>Required: `FakeURLs` |
| `CreateBPBrand` | Create bpbrand<br>Required: `BrandName` |
| `CreateBPFakeAPPList` | Create bpfake applist<br>Required: `FakeAPPs` |
| `CreateBPFakeURL` | Create bpfake url<br>Required: `CompanyId`, `FakeURL` |

## Blocked destructive actions (1)

`DeleteBPWhiteList` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bma`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20221115` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bma"`) for the allow/block decision and reason.

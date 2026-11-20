---
name: tencent-ds
description: Tencent Cloud DS via the Tencent MCP server — 12 actions in API version v20180523 (3 read-only auto-allowed). Use for contract, seal, sign, vcode, coordinate, download. Triggers on mentions of ds, contract, seal, sign, vcode, coordinate, download, enterprise, keyword. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud DS

General service: 12 actions in API version `v20180523` — 3 read-only (auto-allowed), 7 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ds"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ds/v20180523 — action signatures in `ds_client.ts`, full request/response shapes in `ds_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `DownloadContract` | Download contract<br>Required: `Module`, `Operation`, `ContractResId` |
| `DescribeTaskStatus` | Describe task status<br>Required: `Module`, `Operation`, `TaskId` |
| `CheckVcode` | Check vcode<br>Required: `Module`, `Operation`, `AccountResId`, `ContractResId`, `VerifyCode` |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `CreateContractByUpload` | Create contract by upload<br>Required: `Module`, `Operation`, `SignInfos`, `ContractFile`, `ContractName` |
| `CreateSeal` | Create seal<br>Required: `Module`, `Operation`, `AccountResId`, `ImgUrl` |
| `CreatePersonalAccount` | Create personal account<br>Required: `Module`, `Operation`, `Name`, `IdentType`, `IdentNo`, `MobilePhone` |
| `SignContractByKeyword` | Sign contract by keyword<br>Required: `Module`, `Operation`, `ContractResId`, `AccountResId`, `SignKeyword` |
| `CreateEnterpriseAccount` | Create enterprise account<br>Required: `Module`, `Operation`, `Name`, `IdentType`, `IdentNo`, `MobilePhone`, `TransactorName`, `TransactorIdentType`, `TransactorIdentNo`, `TransactorPhone` |
| `SendVcode` | Send vcode<br>Required: `Module`, `Operation`, `ContractResId`, `AccountResId` |
| `SignContractByCoordinate` | Sign contract by coordinate<br>Required: `Module`, `Operation`, `ContractResId`, `AccountResId`, `SignLocations` |

## Blocked destructive actions (2)

`DeleteAccount`, `DeleteSeal` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ds`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180523` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ds"`) for the allow/block decision and reason.

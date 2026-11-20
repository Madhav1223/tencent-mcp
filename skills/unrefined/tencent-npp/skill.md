---
name: tencent-npp
description: Tencent Cloud NPP via the Tencent MCP server — 8 actions in API version v20190823 (5 read-only auto-allowed). Use for back, call, virtual, caller, display. Triggers on mentions of npp, back, call, virtual, caller, display. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud NPP

Networking & traffic: 8 actions in API version `v20190823` — 5 read-only (auto-allowed), 2 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "npp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/npp/v20190823 — action signatures in `npp_client.ts`, full request/response shapes in `npp_models.ts`.

## Read actions (auto-allowed, 5)

| Action | What it does |
|---|---|
| `DescribeCallerDisplayList` | Describe caller display list<br>Required: `BizAppId` |
| `GetVirtualNum` | Get virtual num<br>Required: `BizAppId`, `Dst` |
| `Get400Cdr` | Get 400 cdr<br>Required: `BizAppId` |
| `DescribeCallBackStatus` | Describe call back status<br>Required: `BizAppId`, `CallId` |
| `DescribeCallBackCdr` | Describe call back cdr<br>Required: `BizAppId` |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `DelVirtualNum` | Run del virtual num<br>Required: `BizAppId`, `BindId` |
| `CreateCallBack` | Create call back<br>Required: `BizAppId`, `Src`, `Dst` |

## Blocked destructive actions (1)

`DeleteCallBack` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `npp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190823` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="npp"`) for the allow/block decision and reason.

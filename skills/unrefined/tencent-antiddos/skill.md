---
name: tencent-antiddos
description: Tencent Cloud ANTIDDOS via the Tencent MCP server — 2 actions in API version v20250903 (1 read-only auto-allowed). Use for sblock, unblock. Triggers on mentions of antiddos, sblock, unblock. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud ANTIDDOS

Networking & traffic: 2 actions in API version `v20250903` — 1 read-only (auto-allowed), 1 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "antiddos"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/antiddos/v20250903 — action signatures in `antiddos_client.ts`, full request/response shapes in `antiddos_models.ts`.

## Read actions (auto-allowed, 1)

| Action | What it does |
|---|---|
| `DescribeDDoSBlockRecords` | Describe ddo sblock records<br>Required: `StartTime` (format `2026-02-04T11…`), `EndTime` (format `2026-03-04T11…`) |
## Mutations (gated — need allowlist, 1)

| Action | What it does |
|---|---|
| `UnblockResources` | Run unblock resources<br>Required: `Resources` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `antiddos`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250903` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="antiddos"`) for the allow/block decision and reason.

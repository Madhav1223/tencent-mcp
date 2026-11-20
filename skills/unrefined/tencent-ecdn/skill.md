---
name: tencent-ecdn
description: Tencent Cloud ECDN via the Tencent MCP server — 6 actions in API version v20191012 (6 read-only auto-allowed). Use for ecdn, domain, domains, statistics. Triggers on mentions of ecdn, ecdn, domain, domains, statistics. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud ECDN

Networking & traffic: 6 actions in API version `v20191012` — 6 read-only (auto-allowed), 0 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ecdn"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ecdn/v20191012 — action signatures in `ecdn_client.ts`, full request/response shapes in `ecdn_models.ts`.

## Read actions (auto-allowed, 6)

| Action | What it does |
|---|---|
| `DescribeIpStatus` | Describe ip status<br>Required: `Domain` |
| `DescribeEcdnDomainLogs` | Describe ecdn domain logs<br>Required: `Domain`, `StartTime`, `EndTime` |
| `DescribeDomainsConfig` | Describe domains config |
| `DescribeDomains` | Describe domains |
| `DescribeEcdnStatistics` | Describe ecdn statistics<br>Required: `StartTime`, `EndTime`, `Metrics`, `Interval` |
| `DescribeEcdnDomainStatistics` | Describe ecdn domain statistics<br>Required: `StartTime`, `EndTime`, `Metrics` |
## Mutations (gated — need allowlist, 0)

| Action | What it does |
|---|---|
| — |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ecdn`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20191012` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ecdn"`) for the allow/block decision and reason.

---
name: tencent-privatedns
description: Tencent Cloud PRIVATEDNS via the Tencent MCP server — 40 actions in API version v20201028 (17 read-only auto-allowed). Use for private, zone, endpoint, forward, inbound, dnsaccount. Triggers on mentions of privatedns, private, zone, endpoint, forward, inbound, dnsaccount, create, extend. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud PRIVATEDNS

Networking & traffic: 40 actions in API version `v20201028` — 17 read-only (auto-allowed), 10 gated mutations, 13 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "privatedns"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/privatedns/v20201028 — action signatures in `privatedns_client.ts`, full request/response shapes in `privatedns_models.ts`.

## Read actions (auto-allowed, 17)

| Action | What it does |
|---|---|
| `DescribePrivateZone` | Describe private zone<br>Required: `ZoneId` |
| `DescribeQuotaUsage` | Describe quota usage |
| `DescribeCreateZoneListResult` | Describe create zone list result<br>Required: `Domains` |
| `DescribePrivateZoneList` | Describe private zone list |
| `DescribePrivateZoneRecordList` | Describe private zone record list<br>Required: `ZoneId` |
| `DescribeDashboard` | Describe dashboard |
| `QueryAsyncBindVpcStatus` | Query async bind vpc status<br>Required: `UniqId` |
| `DescribeAuditLog` | Describe audit log<br>Required: `TimeRangeBegin` |
| `DescribeAccountVpcList` | Describe account vpc list<br>Required: `AccountUin` |
| `DescribeRecord` | Describe record<br>Required: `ZoneId`, `RecordId` |
| `DescribePrivateZoneService` | Describe private zone service |
| `DescribeExtendEndpointList` | Describe extend endpoint list |
| `DescribeCreateRecordListResult` | Describe create record list result<br>Required: `ZoneIds`, `RecordsInfo` |
| `DescribeForwardRuleList` | Describe forward rule list |
| `DescribeInboundEndpointList` | Describe inbound endpoint list |
| `DescribeRequestData` | Describe request data<br>Required: `TimeRangeBegin` (format `2020-11-22…`) |
| `DescribePrivateDNSAccountList` | Describe private dnsaccount list |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `CreatePrivateDNSAccount` | Create private dnsaccount<br>Required: `Account` |
| `CreatePrivateZoneRecord` | Create private zone record<br>Required: `ZoneId`, `RecordType`, `SubDomain`, `RecordValue` |
| `CreatePrivateZone` | Create private zone<br>Required: `Domain` |
| `AddSpecifyPrivateZoneVpc` | Add specify private zone vpc<br>Required: `ZoneId` |
| `CreatePrivateZoneRecordList` | Create private zone record list<br>Required: `ZoneIds`, `RecordsInfo` |
| `CreateExtendEndpoint` | Create extend endpoint |
| `SubscribePrivateZoneService` | Subscribe private zone service |
| `CreateInboundEndpoint` | Create inbound endpoint<br>Required: `EndpointName`, `EndpointRegion`, `EndpointVpc`, `SubnetIp` |
| `CreatePrivateZoneList` | Create private zone list<br>Required: `Domains` |
| `CreateForwardRule` | Create forward rule<br>Required: `RuleName`, `RuleType`, `ZoneId`, `EndPointId` |

## Blocked destructive actions (13)

`DeleteForwardRule`, `DeleteEndPoint`, `ModifyInboundEndpoint`, `ModifyForwardRule`, `ModifyPrivateZone`, `ModifyPrivateZoneRecord`, `DeletePrivateDNSAccount`, `ModifyPrivateZoneVpc`, `DeletePrivateZone`, `ModifyRecordsStatus`, `DeleteSpecifyPrivateZoneVpc`, `DeletePrivateZoneRecord`, `DeleteInboundEndpoint` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `privatedns`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201028` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="privatedns"`) for the allow/block decision and reason.

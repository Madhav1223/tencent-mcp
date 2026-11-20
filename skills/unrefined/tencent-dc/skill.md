---
name: tencent-dc
description: Tencent Cloud DC via the Tencent MCP server — 22 actions in API version v20180410 (8 read-only auto-allowed). Use for direct, connect, tunnel, address, internet, attribute. Triggers on mentions of dc, direct, connect, tunnel, address, internet, attribute, extra, accept. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud DC

Networking & traffic: 22 actions in API version `v20180410` — 8 read-only (auto-allowed), 8 gated mutations, 6 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dc/v20180410 — action signatures in `dc_client.ts`, full request/response shapes in `dc_models.ts`.

## Read actions (auto-allowed, 8)

| Action | What it does |
|---|---|
| `DescribeInternetAddressStatistics` | Describe internet address statistics |
| `DescribeDirectConnects` | Describe direct connects |
| `DescribeDirectConnectTunnelExtra` | Describe direct connect tunnel extra<br>Required: `DirectConnectTunnelId` |
| `DescribePublicDirectConnectTunnelRoutes` | Describe public direct connect tunnel routes<br>Required: `DirectConnectTunnelId` |
| `DescribeInternetAddressQuota` | Describe internet address quota |
| `DescribeDirectConnectTunnels` | Describe direct connect tunnels |
| `DescribeAccessPoints` | Describe access points |
| `DescribeInternetAddress` | Describe internet address |
## Mutations (gated — need allowlist, 8)

| Action | What it does |
|---|---|
| `CreateDirectConnect` | Create direct connect<br>Required: `DirectConnectName`, `AccessPointId`, `LineOperator`, `PortType` |
| `EnableInternetAddress` | Enable internet address<br>Required: `InstanceId` |
| `DisableInternetAddress` | Disable internet address<br>Required: `InstanceId` |
| `CreateDirectConnectTunnel` | Create direct connect tunnel<br>Required: `DirectConnectId`, `DirectConnectTunnelName` |
| `RejectDirectConnectTunnel` | Reject direct connect tunnel<br>Required: `DirectConnectTunnelId` |
| `ApplyInternetAddress` | Run apply internet address<br>Required: `MaskLen`, `AddrType`, `AddrProto` |
| `CreateCloudAttachService` | Create cloud attach service<br>Required: `Data` |
| `AcceptDirectConnectTunnel` | Run accept direct connect tunnel<br>Required: `DirectConnectTunnelId` |

## Blocked destructive actions (6)

`ModifyDirectConnectTunnelExtra`, `DeleteDirectConnect`, `DeleteDirectConnectTunnel`, `ModifyDirectConnectAttribute`, `ModifyDirectConnectTunnelAttribute`, `ReleaseInternetAddress` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180410` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dc"`) for the allow/block decision and reason.

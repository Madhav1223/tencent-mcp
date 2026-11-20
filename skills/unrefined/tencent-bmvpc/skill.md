---
name: tencent-bmvpc
description: Tencent Cloud BMVPC via the Tencent MCP server — 61 actions in API version v20180625 (18 read-only auto-allowed). Use for gateway, subnet, connection, peer, route, attribute. Triggers on mentions of bmvpc, gateway, subnet, connection, peer, route, attribute, customer, hosted. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud BMVPC

General service: 61 actions in API version `v20180625` — 18 read-only (auto-allowed), 21 gated mutations, 22 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bmvpc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bmvpc/v20180625 — action signatures in `bmvpc_client.ts`, full request/response shapes in `bmvpc_models.ts`.

## Read actions (auto-allowed, 18)

| Action | What it does |
|---|---|
| `DownloadCustomerGatewayConfiguration` | Download customer gateway configuration<br>Required: `VpnConnectionId`, `VendorName` |
| `DescribeCustomerGateways` | Describe customer gateways |
| `DescribeRouteTables` | Describe route tables |
| `DescribeSubnetAvailableIps` | Describe subnet available ips<br>Required: `SubnetId` |
| `DescribeRoutePolicies` | Describe route policies<br>Required: `RouteTableId` |
| `DescribeNatSubnets` | Describe nat subnets<br>Required: `NatId`, `VpcId` |
| `DescribeSubnets` | Describe subnets |
| `DescribeSubnetByDevice` | Describe subnet by device<br>Required: `InstanceId` |
| `DescribeVpcView` | Describe vpc view<br>Required: `VpcId` |
| `DescribeTaskStatus` | Describe task status<br>Required: `TaskId` |
| `DescribeVpcResource` | Describe vpc resource |
| `DescribeVpnGateways` | Describe vpn gateways |
| `DescribeVpcQuota` | Describe vpc quota<br>Required: `TypeIds` |
| `DescribeNatGateways` | Describe nat gateways |
| `DescribeVpnConnections` | Describe vpn connections |
| `DescribeSubnetByHostedDevice` | Describe subnet by hosted device<br>Required: `InstanceId` |
| `DescribeVpcPeerConnections` | Describe vpc peer connections |
| `DescribeVpcs` | Describe vpcs |
## Mutations (gated — need allowlist, 21)

| Action | What it does |
|---|---|
| `CreateVpcPeerConnection` | Create vpc peer connection<br>Required: `VpcId`, `PeerVpcId`, `PeerRegion`, `VpcPeerConnectionName` |
| `AsyncRegisterIps` | Run async register ips<br>Required: `VpcId`, `SubnetId`, `Ips` |
| `UnbindEipsFromNatGateway` | Unbind eips from nat gateway<br>Required: `NatId`, `VpcId`, `AssignedEips` |
| `BindEipsToNatGateway` | Bind eips to nat gateway<br>Required: `NatId`, `VpcId` |
| `CreateVpc` | Create vpc<br>Required: `VpcName`, `CidrBlock`, `Zone` |
| `CreateNatGateway` | Create nat gateway<br>Required: `ForwardMode`, `VpcId`, `NatName`, `MaxConcurrent` |
| `DeregisterIps` | Run deregister ips<br>Required: `VpcId`, `IpSet` |
| `CreateInterfaces` | Create interfaces<br>Required: `InstanceIds`, `VpcId`, `SubnetId` |
| `BindIpsToNatGateway` | Bind ips to nat gateway<br>Required: `NatId`, `VpcId`, `IpInfoSet` |
| `UnbindIpsFromNatGateway` | Unbind ips from nat gateway<br>Required: `NatId`, `VpcId`, `IpInfoSet` |
| `RejectVpcPeerConnection` | Reject vpc peer connection<br>Required: `VpcPeerConnectionId` |
| `CreateCustomerGateway` | Create customer gateway<br>Required: `CustomerGatewayName`, `IpAddress`, `Zone` |
| `CreateDockerSubnetWithVlan` | Create docker subnet with vlan<br>Required: `VpcId`, `SubnetSet` |
| `UpgradeNatGateway` | Upgrade nat gateway<br>Required: `NatId`, `VpcId`, `MaxConcurrent` |
| `CreateRoutePolicies` | Create route policies<br>Required: `RouteTableId`, `RoutePolicySet` |
| `UnbindSubnetsFromNatGateway` | Unbind subnets from nat gateway<br>Required: `NatId`, `VpcId`, `SubnetIds` |
| `AcceptVpcPeerConnection` | Run accept vpc peer connection<br>Required: `VpcPeerConnectionId` |
| `BindSubnetsToNatGateway` | Bind subnets to nat gateway<br>Required: `NatId`, `VpcId`, `SubnetIds` |
| `CreateHostedInterface` | Create hosted interface<br>Required: `InstanceIds`, `VpcId`, `SubnetId` |
| `CreateVirtualSubnetWithVlan` | Create virtual subnet with vlan<br>Required: `VpcId`, `SubnetSet` |
| `CreateSubnet` | Create subnet<br>Required: `VpcId`, `SubnetSet` |

## Blocked destructive actions (22)

`ModifyVpcPeerConnection`, `DeleteVpc`, `DeleteHostedInterface`, `ModifyRoutePolicy`, `ModifyCustomerGatewayAttribute`, `DeleteRoutePolicy`, `ModifyVpnConnectionAttribute`, `DeleteVpnConnection`, `DeleteVpnGateway`, `ModifyVpnGatewayAttribute`, `DeleteCustomerGateway`, `DeleteSubnet`, `ModifySubnetAttribute`, `ModifyRouteTable`, `ModifySubnetDHCPRelay`, `DeleteVirtualIp`, `ResetVpnConnection`, `DeleteHostedInterfaces`, `DeleteInterfaces`, `DeleteVpcPeerConnection`, `ModifyVpcAttribute`, `DeleteNatGateway` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bmvpc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180625` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bmvpc"`) for the allow/block decision and reason.

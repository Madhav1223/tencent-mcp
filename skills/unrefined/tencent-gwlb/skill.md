---
name: tencent-gwlb
description: Tencent Cloud GWLB via the Tencent MCP server — 19 actions in API version v20240906 (7 read-only auto-allowed). Use for target, gateway, load, balancer, instances, attribute. Triggers on mentions of gwlb, target, gateway, load, balancer, instances, attribute, balancers, create. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud GWLB

Networking & traffic: 19 actions in API version `v20240906` — 7 read-only (auto-allowed), 7 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "gwlb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/gwlb/v20240906 — action signatures in `gwlb_client.ts`, full request/response shapes in `gwlb_models.ts`.

## Read actions (auto-allowed, 7)

| Action | What it does |
|---|---|
| `DescribeTargetGroups` | Describe target groups |
| `DescribeTaskStatus` | Describe task status |
| `DescribeTargetGroupInstanceStatus` | Describe target group instance status<br>Required: `TargetGroupId` |
| `DescribeGatewayLoadBalancersResources` | Describe gateway load balancers resources |
| `DescribeGatewayLoadBalancers` | Describe gateway load balancers |
| `DescribeTargetGroupList` | Describe target group list |
| `DescribeTargetGroupInstances` | Describe target group instances<br>Required: `Filters` |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `RegisterTargetGroupInstances` | Register target group instances<br>Required: `TargetGroupId`, `TargetGroupInstances` |
| `CreateGatewayLoadBalancer` | Create gateway load balancer<br>Required: `VpcId`, `SubnetId` |
| `DisassociateTargetGroups` | Run disassociate target groups<br>Required: `Associations` |
| `AssociateTargetGroups` | Associate target groups<br>Required: `Associations` |
| `InquirePriceCreateGatewayLoadBalancer` | Inquire the price of: create gateway load balancer |
| `DeregisterTargetGroupInstances` | Run deregister target group instances<br>Required: `TargetGroupId`, `TargetGroupInstances` |
| `CreateTargetGroup` | Create target group |

## Blocked destructive actions (5)

`DeleteTargetGroups`, `DeleteGatewayLoadBalancer`, `ModifyTargetGroupAttribute`, `ModifyTargetGroupInstancesWeight`, `ModifyGatewayLoadBalancerAttribute` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `gwlb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240906` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="gwlb"`) for the allow/block decision and reason.

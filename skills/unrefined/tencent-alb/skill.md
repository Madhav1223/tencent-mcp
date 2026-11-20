---
name: tencent-alb
description: Tencent Cloud ALB via the Tencent MCP server — 48 actions in API version v20251030 (18 read-only auto-allowed). Use for load, target, balancer, listener, security, attributes. Triggers on mentions of alb, load, target, balancer, listener, security, attributes, health, check. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud ALB

Networking & traffic: 48 actions in API version `v20251030` — 18 read-only (auto-allowed), 14 gated mutations, 16 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "alb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/alb/v20251030 — action signatures in `alb_client.ts`, full request/response shapes in `alb_models.ts`.

## Read actions (auto-allowed, 18)

| Action | What it does |
|---|---|
| `DescribeSystemSecurityPolicies` | Describe system security policies |
| `DescribeAsyncJobs` | Describe async jobs |
| `DescribeHealthCheckTemplates` | Describe health check templates |
| `DescribeTargetGroupTargets` | Describe target group targets<br>Required: `TargetGroupId` (format `lbtg-…`) |
| `DescribeLoadBalancers` | Describe load balancers |
| `DescribeListeners` | Describe listeners<br>Required: `LoadBalancerId` (format `alb-…`) |
| `DescribeSecurityPolicyRelations` | Describe security policy relations<br>Required: `SecurityPolicyIds` (format `tls-…`) |
| `DescribeSecurityPolicies` | Describe security policies |
| `DescribeListenerDetail` | Describe listener detail<br>Required: `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`) |
| `DescribeLoadBalancerDetail` | Describe load balancer detail<br>Required: `LoadBalancerId` (format `alb-…`) |
| `DescribeListenerHealthStatus` | Describe listener health status<br>Required: `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`) |
| `DescribeSecurityPolicyCapabilities` | Describe security policy capabilities |
| `DescribeTargetGroups` | Describe target groups |
| `DescribeZones` | Describe zones |
| `DescribeTargetGroupsByTarget` | Describe target groups by target |
| `DescribeRules` | Describe rules<br>Required: `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`) |
| `DescribeListenerCertificates` | Describe listener certificates<br>Required: `CertificateType`, `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`) |
| `DescribeQuota` | Describe quota<br>Required: `QuotaTypes` |
## Mutations (gated — need allowlist, 14)

| Action | What it does |
|---|---|
| `AddTargetsToTargetGroup` | Add targets to target group<br>Required: `TargetGroupId` (format `lbtg-…`), `Targets` |
| `SetLoadBalancerSecurityGroups` | Set load balancer security groups<br>Required: `LoadBalancerId` (format `alb-…`), `SecurityGroups` |
| `CreateSecurityPolicy` | Create security policy<br>Required: `Ciphers`, `TLSVersions` |
| `NotifyUnbindTarget` | Notify unbind target<br>Required: `Ips`, `NumericVpcId` |
| `CreateRules` | Create rules<br>Required: `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`), `Rules` |
| `DisassociateBandwidthPackageFromLoadBalancer` | Run disassociate bandwidth package from load balancer<br>Required: `BandwidthPackageId`, `LoadBalancerId` (format `alb-…`) |
| `CreateListener` | Create listener<br>Required: `DefaultActions`, `ListenerPort`, `ListenerProtocol` (HTTP | HTTPS | QUIC), `LoadBalancerId` (format `alb-…`) |
| `InquirePriceCreateLoadBalancer` | Inquire the price of: create load balancer |
| `CreateTargetGroup` | Create target group<br>Required: `TargetType` (Instance; default Cvm), `VpcId` |
| `AssociateBandwidthPackageWithLoadBalancer` | Associate bandwidth package with load balancer<br>Required: `BandwidthPackageId`, `LoadBalancerId` (format `alb-…`) |
| `CreateHealthCheckTemplate` | Create health check template |
| `DisassociateListenerAdditionalCertificates` | Run disassociate listener additional certificates<br>Required: `CertificateIds`, `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`) |
| `CreateLoadBalancer` | Create load balancer<br>Required: `AddressType`, `LoadBalancerBillingConfig`, `VpcId`, `ZoneMappings` |
| `AssociateListenerAdditionalCertificates` | Associate listener additional certificates<br>Required: `CertificateIds`, `ListenerId` (format `lst-…`), `LoadBalancerId` (format `alb-…`) |

## Blocked destructive actions (16)

`DeleteSecurityPolicy`, `DeleteListener`, `DeleteLoadBalancers`, `ModifyListenerAttributes`, `ModifyTargetGroupAttributes`, `ModifyLoadBalancerAttributes`, `ModifyRulesAttributes`, `DeleteTargetGroups`, `RemoveTargetsFromTargetGroup`, `ModifyLoadBalancerModificationProtection`, `DeleteRules`, `ModifyHealthCheckTemplate`, `ModifyTargetsInTargetGroup`, `ModifySecurityPolicyAttributes`, `DeleteHealthCheckTemplates`, `ModifyLoadBalancerAddressType` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `alb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20251030` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="alb"`) for the allow/block decision and reason.

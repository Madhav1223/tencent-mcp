---
name: tencent-ga2
description: Tencent Cloud GA2 via the Tencent MCP server — 44 actions in API version v20250115 (13 read-only auto-allowed). Use for global, accelerator, forwarding, access, listener, accelerate. Triggers on mentions of ga2, global, accelerator, forwarding, access, listener, accelerate, areas, endpoint. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud GA2

Networking & traffic: 44 actions in API version `v20250115` — 13 read-only (auto-allowed), 11 gated mutations, 20 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ga2"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ga2/v20250115 — action signatures in `ga2_client.ts`, full request/response shapes in `ga2_models.ts`.

## Read actions (auto-allowed, 13)

| Action | What it does |
|---|---|
| `DescribeAccelerateAreas` | Describe accelerate areas<br>Required: `GlobalAcceleratorId` |
| `DescribeCrossBorderSettlement` | Describe cross border settlement<br>Required: `GlobalAcceleratorId`, `AccelerateRegion`, `EndpointGroupRegion`, `SettlementMonth` |
| `DescribeGlobalAcceleratorAclRules` | Describe global accelerator acl rules<br>Required: `GlobalAcceleratorAclPolicyId` |
| `DescribeAccelerateRegions` | Describe accelerate regions |
| `DescribeEndpointGroups` | Describe endpoint groups<br>Required: `GlobalAcceleratorId` |
| `DescribeTaskResult` | Describe task result<br>Required: `TaskId` |
| `DescribeAccessLogParam` | Describe access log param |
| `DescribeListeners` | Describe listeners<br>Required: `GlobalAcceleratorId` |
| `DescribeGlobalAccelerators` | Describe global accelerators |
| `DescribeGlobalAcceleratorAclPolicies` | Describe global accelerator acl policies<br>Required: `GlobalAcceleratorId` |
| `DescribeGlobalAcceleratorAccessLog` | Describe global accelerator access log<br>Required: `GlobalAcceleratorId` |
| `DescribeForwardingRule` | Describe forwarding rule<br>Required: `GlobalAcceleratorId`, `ListenerId`, `ForwardingPolicyId` |
| `DescribeForwardingPolicy` | Describe forwarding policy<br>Required: `GlobalAcceleratorId`, `ListenerId` |
## Mutations (gated — need allowlist, 11)

| Action | What it does |
|---|---|
| `CreateForwardingPolicy` | Create forwarding policy<br>Required: `GlobalAcceleratorId`, `ListenerId`, `Host` |
| `CreateEndpointGroup` | Create endpoint group<br>Required: `GlobalAcceleratorId`, `ListenerId`, `EndpointGroupType`, `EndpointGroupConfiguration` |
| `CreateGlobalAcceleratorAclRule` | Create global accelerator acl rule<br>Required: `GlobalAcceleratorId`, `GlobalAcceleratorAclPolicyId`, `AclEntries` |
| `CreateGlobalAcceleratorAclPolicy` | Create global accelerator acl policy<br>Required: `GlobalAcceleratorId`, `DefaultAction` |
| `CreateListener` | Create listener<br>Required: `GlobalAcceleratorId`, `Name`, `PortRanges` |
| `CreateAccelerateAreas` | Create accelerate areas<br>Required: `GlobalAcceleratorId`, `AcceleratorAreas` |
| `CreateListenerAdditionalCert` | Create listener additional cert<br>Required: `GlobalAcceleratorId`, `ListenerId`, `AdditionalCertificates` |
| `CreateGlobalAcceleratorAccessLog` | Create global accelerator access log<br>Required: `GlobalAcceleratorId`, `ListenerId`, `EndpointGroupId`, `CloudRegion`, `CloudLogId`, `CloudLogSetId` |
| `CreateForwardingRule` | Create forwarding rule<br>Required: `GlobalAcceleratorId`, `ListenerId`, `ForwardingPolicyId`, `RuleConditions`, `RuleActions` |
| `CreateGlobalAccelerator` | Create global accelerator<br>Required: `Name` |
| `ReplaceListenerAdditionalCert` | Replace listener additional cert<br>Required: `GlobalAcceleratorId`, `ListenerId`, `AdditionalCertificate`, `OldCertificate` |

## Blocked destructive actions (20)

`ModifyForwardingPolicy`, `DeleteGlobalAccelerator`, `DeleteGlobalAcceleratorAccessLog`, `DeleteListener`, `DeleteForwardingPolicy`, `DeleteGlobalAcceleratorAclRule`, `ModifyListener`, `ModifyGlobalAcceleratorAclPolicy`, `ModifyGlobalAcceleratorAccessLog`, `ModifyForwardingRule`, `DeleteAccelerateAreas`, `DeleteListenerAdditionalCert`, `ModifyEndpointGroup`, `ModifyGlobalAcceleratorAclRule`, `DeleteForwardingRule`, `ModifyAccessLogStatus`, `DeleteGlobalAcceleratorAclPolicy`, `ModifyAccelerateAreas`, `ModifyGlobalAccelerator`, `DeleteEndpointGroups` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ga2`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250115` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ga2"`) for the allow/block decision and reason.

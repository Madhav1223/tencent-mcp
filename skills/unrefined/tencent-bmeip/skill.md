---
name: tencent-bmeip
description: Tencent Cloud BMEIP via the Tencent MCP server — 20 actions in API version v20180625 (4 read-only auto-allowed). Use for unbind, bind, acls, hosted, charge, eips. Triggers on mentions of bmeip, unbind, bind, acls, hosted, charge, eips, name, quota. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud BMEIP

Networking & traffic: 20 actions in API version `v20180625` — 4 read-only (auto-allowed), 11 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bmeip"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bmeip/v20180625 — action signatures in `bmeip_client.ts`, full request/response shapes in `bmeip_models.ts`.

## Read actions (auto-allowed, 4)

| Action | What it does |
|---|---|
| `DescribeEipQuota` | Describe eip quota |
| `DescribeEipTask` | Describe eip task<br>Required: `TaskId` |
| `DescribeEips` | Describe eips |
| `DescribeEipAcls` | Describe eip acls |
## Mutations (gated — need allowlist, 11)

| Action | What it does |
|---|---|
| `UnbindRs` | Unbind rs<br>Required: `EipId`, `InstanceId` |
| `BindHosted` | Bind hosted<br>Required: `EipId`, `InstanceId` |
| `CreateEipAcl` | Create eip acl<br>Required: `AclName`, `Status` |
| `CreateEip` | Create eip |
| `BindRs` | Bind rs<br>Required: `EipId`, `InstanceId` |
| `UnbindHosted` | Unbind hosted<br>Required: `InstanceId` |
| `UnbindVpcIp` | Unbind vpc ip<br>Required: `EipId`, `VpcId`, `VpcIp` |
| `BindEipAcls` | Bind eip acls<br>Required: `EipIdAclIdList` |
| `UnbindEipAcls` | Unbind eip acls<br>Required: `EipIdAclIdList` |
| `BindVpcIp` | Bind vpc ip<br>Required: `EipId`, `VpcId`, `VpcIp` |
| `UnbindRsList` | Unbind rs list<br>Required: `EipRsList` |

## Blocked destructive actions (5)

`ModifyEipAcl`, `DeleteEip`, `ModifyEipCharge`, `ModifyEipName`, `DeleteEipAcl` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bmeip`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180625` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bmeip"`) for the allow/block decision and reason.

---
name: tencent-bmlb
description: Tencent Cloud BMLB via the Tencent MCP server — 49 actions in API version v20180625 (17 read-only auto-allowed). Use for traffic, mirror, listeners, load, backends, backend. Triggers on mentions of bmlb, traffic, mirror, listeners, load, backends, backend, balancer, bind. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud BMLB

General service: 49 actions in API version `v20180625` — 17 read-only (auto-allowed), 17 gated mutations, 15 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bmlb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bmlb/v20180625 — action signatures in `bmlb_client.ts`, full request/response shapes in `bmlb_models.ts`.

## Read actions (auto-allowed, 17)

| Action | What it does |
|---|---|
| `DescribeL7Listeners` | Describe l7 listeners<br>Required: `LoadBalancerId` |
| `DescribeTrafficMirrorReceiverHealthStatus` | Describe traffic mirror receiver health status<br>Required: `TrafficMirrorId`, `ReceiverSet` |
| `DescribeL4ListenerInfo` | Describe l4 listener info<br>Required: `LoadBalancerId` |
| `DescribeTrafficMirrorListeners` | Describe traffic mirror listeners<br>Required: `TrafficMirrorId` |
| `DescribeL7Rules` | Describe l7 rules<br>Required: `LoadBalancerId`, `ListenerId` |
| `DescribeLoadBalancerTaskResult` | Describe load balancer task result<br>Required: `TaskId` |
| `DescribeL7ListenerInfo` | Describe l7 listener info<br>Required: `LoadBalancerId` |
| `DescribeL4Listeners` | Describe l4 listeners<br>Required: `LoadBalancerId` |
| `DescribeLoadBalancers` | Describe load balancers |
| `DescribeCertDetail` | Describe cert detail<br>Required: `CertId` |
| `DescribeL7Backends` | Describe l7 backends<br>Required: `LoadBalancerId`, `ListenerId` |
| `DescribeTrafficMirrors` | Describe traffic mirrors |
| `DescribeL7ListenersEx` | Describe l7 listeners ex<br>Required: `TrafficMirrorId`, `VpcId` |
| `DescribeL4Backends` | Describe l4 backends<br>Required: `LoadBalancerId`, `ListenerId` |
| `DescribeLoadBalancerPortInfo` | Describe load balancer port info<br>Required: `LoadBalancerId` |
| `DescribeDevicesBindInfo` | Describe devices bind info<br>Required: `VpcId`, `InstanceIds` |
| `DescribeTrafficMirrorReceivers` | Describe traffic mirror receivers<br>Required: `TrafficMirrorId` |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `UnbindTrafficMirrorReceivers` | Unbind traffic mirror receivers<br>Required: `TrafficMirrorId`, `ReceiverSet` |
| `CreateL4Listeners` | Create l4 listeners<br>Required: `LoadBalancerId`, `ListenerSet` |
| `UnbindL4Backends` | Unbind l4 backends<br>Required: `LoadBalancerId`, `ListenerId`, `BackendSet`, `BindType` |
| `CreateL7Rules` | Create l7 rules<br>Required: `LoadBalancerId`, `ListenerId`, `RuleSet` |
| `UnbindL7Backends` | Unbind l7 backends<br>Required: `LoadBalancerId`, `ListenerId`, `DomainId`, `LocationId`, `BackendSet`, `BindType` |
| `CreateLoadBalancers` | Create load balancers<br>Required: `VpcId`, `LoadBalancerType` |
| `SetTrafficMirrorHealthSwitch` | Set traffic mirror health switch<br>Required: `TrafficMirrorId`, `HealthSwitch` |
| `UnbindTrafficMirrorListeners` | Unbind traffic mirror listeners<br>Required: `TrafficMirrorId`, `ListenerIds` |
| `CreateTrafficMirror` | Create traffic mirror<br>Required: `Alias`, `VpcId` |
| `BindL4Backends` | Bind l4 backends<br>Required: `LoadBalancerId`, `ListenerId`, `BackendSet`, `BindType` |
| `BindTrafficMirrorReceivers` | Bind traffic mirror receivers<br>Required: `TrafficMirrorId`, `ReceiverSet` |
| `ReplaceCert` | Replace cert<br>Required: `OldCertId`, `NewCert` |
| `UploadCert` | Upload cert<br>Required: `CertType` (CA | SVR), `Cert` |
| `BindL7Backends` | Bind l7 backends<br>Required: `LoadBalancerId`, `ListenerId`, `DomainId`, `LocationId`, `BackendSet`, `BindType` |
| `BindTrafficMirrorListeners` | Bind traffic mirror listeners<br>Required: `TrafficMirrorId`, `ListenerIds` |
| `SetTrafficMirrorAlias` | Set traffic mirror alias<br>Required: `TrafficMirrorId`, `Alias` |
| `CreateL7Listeners` | Create l7 listeners<br>Required: `LoadBalancerId`, `ListenerSet` |

## Blocked destructive actions (15)

`ModifyL7BackendWeight`, `ModifyL4BackendWeight`, `ModifyL7Listener`, `DeleteTrafficMirror`, `DeleteL7Rules`, `ModifyL7Locations`, `ModifyL4BackendPort`, `DeleteLoadBalancer`, `DeleteListeners`, `ModifyL7BackendPort`, `ModifyL4BackendProbePort`, `DeleteL7Domains`, `ModifyLoadBalancer`, `ModifyLoadBalancerChargeMode`, `ModifyL4Listener` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bmlb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180625` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bmlb"`) for the allow/block decision and reason.

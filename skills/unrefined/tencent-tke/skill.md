---
name: tencent-tke
description: Manages Tencent Kubernetes Engine (TKE) native node pools, cluster machines, health-check policies, and scaling. Use for Kubernetes node lifecycle, autoscaling, and machine maintenance. Triggers on mentions of TKE, Kubernetes, K8s, node pool, cluster machines, autoscaling, ScaleNodePool, or kubelet health checks. Note this is the 2022 native-node API (clusters themselves live under the tke 2018 API/cls service); Describe actions pass automatically, all mutations are gated.
metadata:
  version: "1"
---

# Tencent Cloud TKE

Kubernetes node management on the native-node API (`v20220501`): node pools, cluster machines, health checks, and scaling.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tke"`. Scope every call with `ClusterId`.

## Procedures

| User need | Do this |
|---|---|
| Inventory node pools / machines | `DescribeNodePools` / `DescribeClusterMachines` with `{"ClusterId": "...", "Limit": 20}` |
| Check pool elasticity before scaling | `DescribeNodePoolsElasticityStrength` — confirms min/max and whether scale-out is currently permitted |
| Scale a pool | `ScaleNodePool` with `{"ClusterId", "NodePoolId", "Replicas"}` (desired node count — the single knob) — **gated**. Check `DescribeNodePoolsElasticityStrength` first for whether scale-out is currently permitted |
| Add a pool | `CreateNodePool` with machine settings + labels/taints — **gated** |
| Machine maintenance (start/stop/reboot) | `StartMachines` / `StopMachines` / `RebootMachines` with `{"ClusterId", "MachineNames": [...]}` — **gated** (`Stop*` prefix actions are denied outright; prefer cordon/drain flows) |
| Node health monitoring | `DescribeHealthCheckPolicies` + `DescribeHealthCheckPolicyBindings`, create with `CreateHealthCheckPolicy` — **gated** |
| GPU capacity planning | `DescribeGPUInfo` to see available GPU models per zone |
| Zone/instance options for new nodes | `DescribeZoneInstanceConfigInfos` |

## Safety

- **Auto-allowed:** `Describe*`.
- **Denied outright:** `DeleteNodePool`, `DeleteClusterMachines`, `DeleteHealthCheckPolicy`, `StopMachines` (`Delete*`/`Stop*` prefixes). Decommissioning nodes must go through the console or an explicit allowlist change.
- **Gated:** `CreateNodePool`, `ScaleNodePool`, `ModifyNodePool`, `StartMachines`, `RebootMachines`, health-check policy writes, `tke:StartService` (pre-allowlisted in defaults).
- Scaling changes real capacity and cost — confirm desired/min/max with the user before `ScaleNodePool`.

## Mistakes to avoid

- **Two TKE APIs exist.** This `tke` service (`v20220501`) covers native nodes and machines. Classic cluster CRUD (`DescribeClusters` for managed clusters) lives in the older API surface — if a cluster ID is not found here, say so instead of guessing params.
- `MachineNames` are provider IDs, not Kubernetes node names — list them via `DescribeClusterMachines` first.
- `ScaleNodePool` takes a single `Replicas` desired count — there are no Min/Max/Desired fields on this action; clamping follows the pool's configured bounds.

## Verify

- After scaling, poll `DescribeClusterMachines` until new machines report `Ready`; after pool edits, re-run `DescribeNodePools` and diff the replica count.

---
name: tencent-tcm
description: Tencent Cloud TCM via the Tencent MCP server — 12 actions in API version v20210413 (3 read-only auto-allowed). Use for mesh, access, cluster, link, prometheus, unlink. Triggers on mentions of tcm, mesh, access, cluster, link, prometheus, unlink, tracing. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud TCM

General service: 12 actions in API version `v20210413` — 3 read-only (auto-allowed), 5 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tcm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tcm/v20210413 — action signatures in `tcm_client.ts`, full request/response shapes in `tcm_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `DescribeAccessLogConfig` | Describe access log config<br>Required: `MeshId` |
| `DescribeMeshList` | Describe mesh list |
| `DescribeMesh` | Describe mesh<br>Required: `MeshId` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `LinkClusterList` | Run link cluster list<br>Required: `MeshId`, `ClusterList` |
| `LinkPrometheus` | Run link prometheus<br>Required: `MeshID`, `Prometheus` |
| `UnlinkCluster` | Run unlink cluster<br>Required: `MeshId` |
| `CreateMesh` | Create mesh<br>Required: `DisplayName`, `MeshVersion`, `Type`, `Config` |
| `UnlinkPrometheus` | Run unlink prometheus<br>Required: `MeshID` |

## Blocked destructive actions (4)

`DeleteMesh`, `ModifyMesh`, `ModifyTracingConfig`, `ModifyAccessLogConfig` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tcm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210413` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tcm"`) for the allow/block decision and reason.

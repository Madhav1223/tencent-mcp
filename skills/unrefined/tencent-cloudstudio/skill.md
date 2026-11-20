---
name: tencent-cloudstudio
description: Tencent Cloud CLOUDSTUDIO via the Tencent MCP server — 9 actions in API version v20230508 (3 read-only auto-allowed). Use for workspace, images, remove, stop, token, workspaces. Triggers on mentions of cloudstudio, workspace, images, remove, stop, token, workspaces. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: DevOps & app platforms
metadata:
  version: "4"
---

# Tencent Cloud CLOUDSTUDIO

DevOps & app platforms: 9 actions in API version `v20230508` — 3 read-only (auto-allowed), 3 gated mutations, 3 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cloudstudio"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Environments (dev/test/prod) are isolated — confirm which environment every deploy or config change targets.
Deployments are async with revisions — after release, poll the deployment/revision status until stable and keep the previous revision for rollback.
Service discovery and config centers decouple code from endpoints — update config entries explicitly; code deploys alone don't move traffic.
Microservice gateways need route publication after changes — unpublished edits serve stale behavior.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cloudstudio/v20230508 — action signatures in `cloudstudio_client.ts`, full request/response shapes in `cloudstudio_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `DescribeConfig` | Describe config<br>Required: `Name` |
| `DescribeWorkspaces` | Describe workspaces |
| `DescribeImages` | Describe images |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `CreateWorkspace` | Create workspace<br>Required: `Name` |
| `CreateWorkspaceToken` | Create workspace token<br>Required: `SpaceKey` |
| `RunWorkspace` | Run workspace<br>Required: `SpaceKey` |

## Blocked destructive actions (3)

`ModifyWorkspace`, `RemoveWorkspace`, `StopWorkspace` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cloudstudio`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230508` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cloudstudio"`) for the allow/block decision and reason.

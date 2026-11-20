---
name: tencent-ags
description: Tencent Cloud AGS via the Tencent MCP server — 22 actions in API version v20250920 (6 read-only auto-allowed). Use for sandbox, deployment, tool, apikey, acquire, cache. Triggers on mentions of ags, sandbox, deployment, tool, apikey, acquire, cache, image, token. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud AGS

General service: 22 actions in API version `v20250920` — 6 read-only (auto-allowed), 11 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ags"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ags/v20250920 — action signatures in `ags_client.ts`, full request/response shapes in `ags_models.ts`.

## Read actions (auto-allowed, 6)

| Action | What it does |
|---|---|
| `DescribeDeploymentList` | Describe deployment list |
| `DescribeDeployment` | Describe deployment<br>Required: `DeploymentId` |
| `DescribeSandboxInstanceList` | Describe sandbox instance list |
| `DescribeSandboxToolList` | Describe sandbox tool list |
| `DescribeAPIKeyList` | Describe apikey list |
| `DescribePreCacheImageTask` | Describe pre cache image task<br>Required: `Image`, `ImageDigest`, `ImageRegistryType` |
## Mutations (gated — need allowlist, 11)

| Action | What it does |
|---|---|
| `CreatePreCacheImageTask` | Create pre cache image task<br>Required: `Image`, `ImageRegistryType` |
| `AcquireSandboxInstanceToken` | Acquire sandbox instance token<br>Required: `InstanceId` |
| `CreateAPIKey` | Create apikey |
| `CreateDeployment` | Create deployment<br>Required: `DeploymentName` |
| `StartSandboxInstance` | Start sandbox instance |
| `UpdateSandboxTool` | Update sandbox tool<br>Required: `ToolId` |
| `ResumeSandboxInstance` | Resume sandbox instance<br>Required: `InstanceId` |
| `PauseSandboxInstance` | Pause sandbox instance<br>Required: `InstanceId` |
| `CreateSandboxTool` | Create sandbox tool<br>Required: `ToolName`, `ToolType` (browser | code-interpreter), `NetworkConfiguration` |
| `UpdateSandboxInstance` | Update sandbox instance<br>Required: `InstanceId` |
| `AcquireDeploymentToken` | Acquire deployment token<br>Required: `DeploymentId` |

## Blocked destructive actions (5)

`ModifyDeployment`, `DeleteDeployment`, `DeleteSandboxTool`, `StopSandboxInstance`, `DeleteAPIKey` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ags`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20250920` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ags"`) for the allow/block decision and reason.

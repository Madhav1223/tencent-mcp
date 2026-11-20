---
name: tencent-msp
description: Tencent Cloud MSP via the Tencent MCP server — 7 actions in API version v20180319 (3 read-only auto-allowed). Use for migration, belong, deregister, register. Triggers on mentions of msp, migration, belong, deregister, register. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Analytics & streaming jobs
metadata:
  version: "4"
---

# Tencent Cloud MSP

Analytics & streaming jobs: 7 actions in API version `v20180319` — 3 read-only (auto-allowed), 2 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "msp"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Streaming jobs are long-running and billed while active — stop or suspend idle jobs; confirm job state after every start/stop call.
Job SQL/configuration is versioned separately from the running job — updating code requires an explicit restart/redeploy to take effect.
Checkpoints/savepoints guard exactly-once semantics: trigger one before any stop or upgrade, and resume from it on restart.
Scale parallelism from observed backpressure, not guesses — read the job metrics first.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/msp/v20180319 — action signatures in `msp_client.ts`, full request/response shapes in `msp_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `ListMigrationTask` | List migration task |
| `DescribeMigrationTask` | Describe migration task<br>Required: `TaskId` |
| `ListMigrationProject` | List migration project |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `RegisterMigrationTask` | Register migration task<br>Required: `TaskType`, `TaskName`, `ServiceSupplier`, `CreateTime`, `UpdateTime`, `MigrateClass` |
| `DeregisterMigrationTask` | Run deregister migration task<br>Required: `TaskId` |

## Blocked destructive actions (2)

`ModifyMigrationTaskStatus`, `ModifyMigrationTaskBelongToProject` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `msp`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180319` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="msp"`) for the allow/block decision and reason.

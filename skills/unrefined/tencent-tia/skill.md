---
name: tencent-tia
description: Tencent Cloud TIA via the Tencent MCP server — 10 actions in API version v20180226 (5 read-only auto-allowed). Use for model, agent, install, jobs, models. Triggers on mentions of tia, model, agent, install, jobs, models. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud TIA

AI services: 10 actions in API version `v20180226` — 5 read-only (auto-allowed), 3 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tia"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tia/v20180226 — action signatures in `tia_client.ts`, full request/response shapes in `tia_models.ts`.

## Read actions (auto-allowed, 5)

| Action | What it does |
|---|---|
| `ListJobs` | List jobs<br>Required: `Cluster` |
| `DescribeModel` | Describe model<br>Required: `Name` |
| `QueryLogs` | Query logs<br>Required: `JobName`, `Cluster`, `StartTime` (format `2019-01-01…`), `EndTime` (format `2019-01-01…`), `Limit` |
| `ListModels` | List models |
| `DescribeJob` | Describe job<br>Required: `Name`, `Cluster` |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `CreateModel` | Create model<br>Required: `Name`, `Model` |
| `CreateJob` | Create job<br>Required: `Name`, `Cluster`, `RuntimeVersion` |
| `InstallAgent` | Install agent<br>Required: `Cluster` |

## Blocked destructive actions (2)

`DeleteJob`, `DeleteModel` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tia`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180226` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tia"`) for the allow/block decision and reason.

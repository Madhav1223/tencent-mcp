---
name: tencent-cat
description: Tencent Cloud CAT via the Tencent MCP server — 14 actions in API version v20180409 (8 read-only auto-allowed). Use for probe, nodes, attributes, configuration, detailed, instant. Triggers on mentions of cat, probe, nodes, attributes, configuration, detailed, instant, node, resume. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Observability & ops tooling
metadata:
  version: "4"
---

# Tencent Cloud CAT

Observability & ops tooling: 14 actions in API version `v20180409` — 8 read-only (auto-allowed), 5 gated mutations, 1 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cat"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Metric namespaces and instance IDs must match exactly — list the monitored objects first; a wrong ID yields empty data, not an error.
Alarm policies need both a trigger condition and a notification channel — a policy without receivers never pages anyone; verify both halves.
Retention on logs/metrics/traces is finite — export or ship anything needed for post-incident review before it ages out.
Load-test and chaos actions generate real traffic/faults — scope them to non-production or maintenance windows with explicit confirmation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cat/v20180409 — action signatures in `cat_client.ts`, full request/response shapes in `cat_models.ts`.

## Read actions (auto-allowed, 8)

| Action | What it does |
|---|---|
| `DescribeProbeMetricData` | Describe probe metric data |
| `DescribeProbeTasks` | Describe probe tasks |
| `DescribeProbeNodes` | Describe probe nodes |
| `DescribeProbeMetricTagValues` | Describe probe metric tag values |
| `DescribeNodes` | Describe nodes |
| `DescribeInstantTasks` | Describe instant tasks<br>Required: `Limit`, `Offset` |
| `DescribeNodeGroups` | Describe node groups |
| `DescribeDetailedSingleProbeData` | Describe detailed single probe data<br>Required: `BeginTime`, `EndTime`, `TaskType`, `SortField`, `Ascending`, `SelectedFields`, `Offset`, `Limit` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `SuspendProbeTask` | Suspend probe task<br>Required: `TaskIds` |
| `UpdateProbeTaskAttributes` | Update probe task attributes<br>Required: `TaskId` |
| `UpdateProbeTaskConfigurationList` | Update probe task configuration list<br>Required: `TaskIds`, `Nodes`, `Interval`, `Parameters` |
| `CreateProbeTasks` | Create probe tasks<br>Required: `BatchTasks`, `TaskType`, `Nodes`, `Interval`, `Parameters`, `TaskCategory` |
| `ResumeProbeTask` | Resume probe task<br>Required: `TaskIds` |

## Blocked destructive actions (1)

`DeleteProbeTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cat`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180409` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cat"`) for the allow/block decision and reason.

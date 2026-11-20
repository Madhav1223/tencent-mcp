---
name: tencent-tat
description: Tencent Cloud TAT via the Tencent MCP server — 29 actions in API version v20201028 (12 read-only auto-allowed). Use for register, command, invoker, codes, commands, invocation. Triggers on mentions of tat, register, command, invoker, codes, commands, invocation, agent, automation. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Observability & ops tooling
metadata:
  version: "4"
---

# Tencent Cloud TAT

Observability & ops tooling: 29 actions in API version `v20201028` — 12 read-only (auto-allowed), 8 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tat"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Metric namespaces and instance IDs must match exactly — list the monitored objects first; a wrong ID yields empty data, not an error.
Alarm policies need both a trigger condition and a notification channel — a policy without receivers never pages anyone; verify both halves.
Retention on logs/metrics/traces is finite — export or ship anything needed for post-incident review before it ages out.
Load-test and chaos actions generate real traffic/faults — scope them to non-production or maintenance windows with explicit confirmation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tat/v20201028 — action signatures in `tat_client.ts`, full request/response shapes in `tat_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `DescribeCommands` | Describe commands |
| `DescribeInvocations` | Describe invocations |
| `DescribeInvocationTasks` | Describe invocation tasks |
| `PreviewReplacedCommandContent` | Preview replaced command content |
| `DescribeRegisterInstances` | Describe register instances |
| `DescribeRegions` | Describe regions |
| `DescribeRegisterCodes` | Describe register codes |
| `DescribeAutomationAgentStatus` | Describe automation agent status |
| `DescribeQuotas` | Describe quotas<br>Required: `ResourceNames` |
| `DescribeScenes` | Describe scenes |
| `DescribeInvokerRecords` | Describe invoker records |
| `DescribeInvokers` | Describe invokers |
## Mutations (gated — need allowlist, 8)

| Action | What it does |
|---|---|
| `CreateInvoker` | Create invoker<br>Required: `Name`, `Type`, `CommandId`, `InstanceIds` |
| `CreateRegisterCode` | Create register code |
| `EnableInvoker` | Enable invoker<br>Required: `InvokerId` |
| `DisableInvoker` | Disable invoker<br>Required: `InvokerId` |
| `InvokeCommand` | Invoke command<br>Required: `CommandId`, `InstanceIds` |
| `CreateCommand` | Create command<br>Required: `CommandName`, `Content` |
| `DisableRegisterCodes` | Disable register codes<br>Required: `RegisterCodeIds` |
| `RunCommand` | Run command<br>Required: `Content`, `InstanceIds` |

## Blocked destructive actions (9)

`CancelInvocation`, `ModifyRegisterInstance`, `DeleteCommand`, `DeleteInvoker`, `DeleteRegisterInstance`, `ModifyCommand`, `DeleteCommands`, `DeleteRegisterCodes`, `ModifyInvoker` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tat`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201028` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tat"`) for the allow/block decision and reason.

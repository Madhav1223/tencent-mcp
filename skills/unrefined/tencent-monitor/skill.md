---
name: tencent-monitor
description: Tencent Cloud MONITOR via the Tencent MCP server — 42 actions in API version v20230616 (27 read-only auto-allowed). Use for aiworkbench, dispense, external, agent, content, notice. Triggers on mentions of monitor, aiworkbench, dispense, external, agent, content, notice, sredigital, twin. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Observability & ops tooling
metadata:
  version: "4"
---

# Tencent Cloud MONITOR

Observability & ops tooling: 42 actions in API version `v20230616` — 27 read-only (auto-allowed), 7 gated mutations, 8 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "monitor"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Metric namespaces and instance IDs must match exactly — list the monitored objects first; a wrong ID yields empty data, not an error.
Alarm policies need both a trigger condition and a notification channel — a policy without receivers never pages anyone; verify both halves.
Retention on logs/metrics/traces is finite — export or ship anything needed for post-incident review before it ages out.
Load-test and chaos actions generate real traffic/faults — scope them to non-production or maintenance windows with explicit confirmation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/monitor/v20230616 — action signatures in `monitor_client.ts`, full request/response shapes in `monitor_models.ts`.

## Read actions (auto-allowed, 27)

| Action | What it does |
|---|---|
| `DescribeAIWorkbenchExecution` | Describe aiworkbench execution |
| `ListAIWorkbenchMessages` | List aiworkbench messages |
| `DescribeNoticeContentTmpl` | Describe notice content tmpl<br>Required: `PageNumber`, `PageSize` |
| `ListAIWorkbenchSessions` | List aiworkbench sessions |
| `DescribeExtNamespace` | Describe ext namespace |
| `DescribeAIWorkbenchSkill` | Describe aiworkbench skill |
| `DescribeAIWorkbenchAgent` | Describe aiworkbench agent |
| `ListAIWorkbenchSkills` | List aiworkbench skills |
| `ListAIWorkbenchResourceInstances` | List aiworkbench resource instances |
| `ListAIWorkbenchMCPs` | List aiworkbench mcps |
| `DescribeAIWorkbenchSession` | Describe aiworkbench session |
| `DescribeAlarmNotifyHistories` | Describe alarm notify histories<br>Required: `MonitorType`, `QueryBaseTime`, `QueryBeforeSeconds`, `PageParams` |
| `DescribeAIWorkbenchArtifact` | Describe aiworkbench artifact<br>Required: `ArtifactId` |
| `ListAIWorkbenchArtifacts` | List aiworkbench artifacts |
| `ListAIWorkbenchExecutions` | List aiworkbench executions |
| `DescribeAIWorkbenchSREDigitalTwinWorkLogList` | Describe aiworkbench sredigital twin work log list<br>Required: `TwinID` |
| `DescribeDispenseExternalRule` | Describe dispense external rule<br>Required: `RuleId` |
| `DescribeDispenseRegion` | Describe dispense region |
| `DescribeAIWorkbenchSREDigitalTwinTaskList` | Describe aiworkbench sredigital twin task list<br>Required: `TwinID` |
| `DescribeAIWorkbenchSREDigitalTwinWorkLogDetail` | Describe aiworkbench sredigital twin work log detail<br>Required: `WorkLogID` |
| `ListAIWorkbenchTasks` | List aiworkbench tasks |
| `DescribeDispenseExternalRuleList` | Describe dispense external rule list<br>Required: `Page`, `PageSize` |
| `ListAIWorkbenchAgents` | List aiworkbench agents |
| `ListAIWorkbenchResourceMaps` | List aiworkbench resource maps |
| `DescribeKafka` | Describe kafka<br>Required: `Brokers` |
| `DescribeExtMetric` | Describe ext metric<br>Required: `ExtNamespace` |
| `GetAIWorkbenchArtifactDownloadURL` | Get aiworkbench artifact download url<br>Required: `SessionId` |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `CreateNoticeContentTmpl` | Create notice content tmpl<br>Required: `TmplName`, `MonitorType`, `TmplContents`, `TmplLanguage` |
| `TriggerAIWorkbenchSREDigitalTwinTask` | Trigger aiworkbench sredigital twin task<br>Required: `TaskID` |
| `CreateAIWorkbenchAgent` | Create aiworkbench agent |
| `CreateDispenseExternalRule` | Create dispense external rule<br>Required: `Name`, `ExtNamespace`, `Producer` |
| `TriggerAIWorkbenchTask` | Trigger aiworkbench task |
| `CreateAIWorkbenchTask` | Create aiworkbench task |
| `UpdateAIWorkbenchAgent` | Update aiworkbench agent |

## Blocked destructive actions (8)

`CancelAIWorkbenchChat`, `DeleteAIWorkbenchAgent`, `DeleteAIWorkbenchTask`, `ModifyDispenseExternalRule`, `DeleteNoticeContentTmpls`, `ModifyDispenseExternalRuleStatus`, `DeleteDispenseExternalRule`, `ModifyNoticeContentTmpl` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `monitor`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230616` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="monitor"`) for the allow/block decision and reason.

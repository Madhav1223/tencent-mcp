---
name: tencent-apm
description: Tencent Cloud APM via the Tencent MCP server — 34 actions in API version v20210622 (21 read-only auto-allowed). Use for general, application, sample, count, prometheus, association. Triggers on mentions of apm, general, application, sample, count, prometheus, association, vulnerability, agent. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Serverless functions & APIs
metadata:
  version: "4"
---

# Tencent Cloud APM

Serverless functions & APIs: 34 actions in API version `v20210622` — 21 read-only (auto-allowed), 4 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "apm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Functions deploy async — after create/update, poll the function status until active before invoking or binding triggers.
Triggers (API Gateway, timers, COS, timers) are separate resources: creating the function alone exposes nothing. Bind and test each trigger explicitly.
Environment variables and VPC config change at update time; cold starts follow VPC attachment and large packages — keep packages lean and reuse execution contexts.
API Gateway needs explicit release/deploy to a stage after any route change — edits without release serve stale config.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/apm/v20210622 — action signatures in `apm_client.ts`, full request/response shapes in `apm_models.ts`.

## Read actions (auto-allowed, 21)

| Action | What it does |
|---|---|
| `DescribeApmVulnerabilityDetail` | Describe apm vulnerability detail<br>Required: `StartTime`, `EndTime`, `InstanceId` |
| `DescribeGeneralSpanList` | Describe general span list<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeRelatedServicesOnTrace` | Describe related services on trace<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeGeneralOTSpanList` | Describe general otspan list<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeTopologyNew` | Describe topology new<br>Required: `InstanceId`, `StartTime`, `EndTime` |
| `DescribeGeneralApmApplicationConfig` | Describe general apm application config<br>Required: `ServiceName`, `InstanceId` |
| `DescribeApmAgent` | Describe apm agent<br>Required: `InstanceId` |
| `DescribeGeneralMetricData` | Describe general metric data<br>Required: `Metrics`, `InstanceId`, `ViewName`, `Filters` |
| `DescribeApmAssociation` | Describe apm association<br>Required: `ProductName`, `InstanceId` |
| `DescribeApmServiceMetric` | Describe apm service metric<br>Required: `InstanceId` |
| `DescribeApmSQLInjectionDetail` | Describe apm sqlinjection detail<br>Required: `InstanceId` |
| `DescribeApmSampleConfig` | Describe apm sample config<br>Required: `InstanceId` |
| `DescribeTagValues` | Describe tag values<br>Required: `InstanceId`, `TagKey`, `StartTime`, `EndTime` |
| `DescribeApmPrometheusRule` | Describe apm prometheus rule<br>Required: `InstanceId` |
| `DescribeApmInstances` | Describe apm instances |
| `DescribeApmAllVulCount` | Describe apm all vul count<br>Required: `StartTime`, `EndTime` |
| `DescribeApmApplicationConfig` | Describe apm application config<br>Required: `InstanceId`, `ServiceName` |
| `DescribeMetricRecords` | Describe metric records<br>Required: `InstanceId`, `Metrics`, `StartTime`, `EndTime`, `GroupBy` |
| `DescribeOPRAllVulCount` | Describe oprall vul count<br>Required: `StartTime`, `EndTime` |
| `DescribeServiceOverview` | Describe service overview<br>Required: `InstanceId`, `Metrics`, `StartTime`, `EndTime`, `GroupBy` |
| `DescribeApmVulnerabilityCount` | Describe apm vulnerability count<br>Required: `InstanceId`, `ServiceName`, `StartTime` |
## Mutations (gated — need allowlist, 4)

| Action | What it does |
|---|---|
| `CreateApmInstance` | Create apm instance<br>Required: `Name` |
| `CreateApmPrometheusRule` | Create apm prometheus rule<br>Required: `Name`, `ServiceName`, `MetricMatchType`, `MetricNameRule`, `InstanceId` |
| `CreateApmSampleConfig` | Create apm sample config<br>Required: `InstanceId`, `SampleRate`, `ServiceName`, `SampleName` |
| `CreateProfileTask` | Create profile task<br>Required: `ServiceName`, `InstanceId`, `ServiceInstance`, `Event`, `Duration`, `AllTimes` |

## Blocked destructive actions (9)

`ModifyApmInstance`, `ModifyApmService`, `ModifyApmAssociation`, `ModifyApmSampleConfig`, `TerminateApmInstance`, `ModifyApmPrometheusRule`, `DeleteApmSampleConfig`, `ModifyGeneralApmApplicationConfig`, `ModifyApmApplicationConfig` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `apm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210622` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="apm"`) for the allow/block decision and reason.

---
name: tencent-scf
description: Tencent Cloud SCF via the Tencent MCP server — 52 actions in API version v20180416 (21 read-only auto-allowed). Use for function, concurrency, version, custom, alias, domain. Triggers on mentions of scf, function, concurrency, version, custom, alias, domain, event, invoke. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Serverless functions & APIs
metadata:
  version: "4"
---

# Tencent Cloud SCF

Serverless functions & APIs: 52 actions in API version `v20180416` — 21 read-only (auto-allowed), 21 gated mutations, 10 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "scf"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Functions deploy async — after create/update, poll the function status until active before invoking or binding triggers.
Triggers (API Gateway, timers, COS, timers) are separate resources: creating the function alone exposes nothing. Bind and test each trigger explicitly.
Environment variables and VPC config change at update time; cold starts follow VPC attachment and large packages — keep packages lean and reuse execution contexts.
API Gateway needs explicit release/deploy to a stage after any route change — edits without release serve stale config.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/scf/v20180416 — action signatures in `scf_client.ts`, full request/response shapes in `scf_models.ts`.

## Read actions (auto-allowed, 21)

| Action | What it does |
|---|---|
| `ListTriggers` | List triggers<br>Required: `FunctionName` |
| `ListVersionByFunction` | List version by function<br>Required: `FunctionName` |
| `GetLayerVersion` | Get layer version<br>Required: `LayerName`, `LayerVersion` |
| `ListAliases` | List aliases<br>Required: `FunctionName` |
| `GetProvisionedConcurrencyConfig` | Get provisioned concurrency config<br>Required: `FunctionName` |
| `ListCustomDomains` | List custom domains |
| `GetFunction` | Get function |
| `GetAsyncEventStatus` | Get async event status<br>Required: `InvokeRequestId` |
| `GetFunctionLogs` | Get function logs |
| `GetFunctionEventInvokeConfig` | Get function event invoke config<br>Required: `FunctionName` |
| `ListLayers` | List layers |
| `ListAsyncEvents` | List async events<br>Required: `FunctionName` |
| `ListLayerVersions` | List layer versions<br>Required: `LayerName` |
| `ListFunctions` | List functions |
| `GetAccount` | Get account |
| `GetFunctionAddress` | Get function address<br>Required: `FunctionName` |
| `GetAlias` | Get alias<br>Required: `FunctionName`, `Name` |
| `GetReservedConcurrencyConfig` | Get reserved concurrency config<br>Required: `FunctionName` |
| `GetCustomDomain` | Get custom domain |
| `ListNamespaces` | List namespaces |
| `GetRequestStatus` | Get request status<br>Required: `FunctionName`, `FunctionRequestId` |
## Mutations (gated — need allowlist, 21)

| Action | What it does |
|---|---|
| `UpdateAlias` | Update alias<br>Required: `FunctionName`, `Name`, `FunctionVersion` |
| `UpdateNamespace` | Update namespace<br>Required: `Namespace`, `Description` |
| `InvokeFunction` | Invoke function<br>Required: `FunctionName` |
| `CreateTrigger` | Create trigger<br>Required: `FunctionName`, `TriggerName`, `Type` |
| `CreateNamespace` | Create namespace<br>Required: `Namespace` |
| `CopyFunction` | Copy function<br>Required: `FunctionName`, `NewFunctionName` |
| `PublishLayerVersion` | Publish layer version<br>Required: `LayerName`, `CompatibleRuntimes`, `Content` |
| `PublishVersion` | Publish version<br>Required: `FunctionName` |
| `PutTotalConcurrencyConfig` | Put total concurrency config<br>Required: `TotalConcurrencyMem` |
| `UpdateTriggerStatus` | Update trigger status<br>Required: `Enable`, `FunctionName`, `TriggerName`, `Type` |
| `CreateAlias` | Create alias<br>Required: `Name`, `FunctionName`, `FunctionVersion` |
| `PutProvisionedConcurrencyConfig` | Put provisioned concurrency config<br>Required: `FunctionName`, `Qualifier`, `VersionProvisionedConcurrencyNum` |
| `UpdateFunctionEventInvokeConfig` | Update function event invoke config<br>Required: `AsyncTriggerConfig`, `FunctionName` |
| `UpdateTrigger` | Update trigger<br>Required: `FunctionName`, `TriggerName`, `Type` |
| `CreateCustomDomain` | Create custom domain<br>Required: `Domain`, `Protocol` (HTTP | HTTPS), `EndpointsConfig` |
| `UpdateFunctionConfiguration` | Update function configuration<br>Required: `FunctionName` |
| `PutReservedConcurrencyConfig` | Put reserved concurrency config<br>Required: `FunctionName`, `ReservedConcurrencyMem` |
| `Invoke` | Run invoke<br>Required: `FunctionName` |
| `UpdateCustomDomain` | Update custom domain<br>Required: `Domain` |
| `CreateFunction` | Create function<br>Required: `FunctionName`, `Code` |
| `UpdateFunctionCode` | Update function code<br>Required: `FunctionName` |

## Blocked destructive actions (10)

`DeleteFunction`, `TerminateAsyncEvent`, `DeleteTrigger`, `DeleteNamespace`, `DeleteProvisionedConcurrencyConfig`, `DeleteLayerVersion`, `DeleteAlias`, `DeleteFunctionVersion`, `DeleteCustomDomain`, `DeleteReservedConcurrencyConfig` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `scf`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180416` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="scf"`) for the allow/block decision and reason.

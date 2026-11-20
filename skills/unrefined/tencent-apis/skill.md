---
name: tencent-apis
description: Tencent Cloud APIS via the Tencent MCP server — 40 actions in API version v20240801 (15 read-only auto-allowed). Use for agent, model, services, credential, server, servers. Triggers on mentions of apis, agent, model, services, credential, server, servers, apps, credentials. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud APIS

General service: 40 actions in API version `v20240801` — 15 read-only (auto-allowed), 9 gated mutations, 16 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "apis"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/apis/v20240801 — action signatures in `apis_client.ts`, full request/response shapes in `apis_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `DescribeAgentCredential` | Describe agent credential |
| `DescribeAgentApps` | Describe agent apps<br>Required: `Limit` |
| `DescribeModel` | Describe model<br>Required: `InstanceID`, `ID` |
| `DescribeModelService` | Describe model service<br>Required: `InstanceID`, `ID` |
| `DescribeAgentCredentials` | Describe agent credentials |
| `DescribeAgentApp` | Describe agent app<br>Required: `InstanceID`, `ID` |
| `DescribeAgentAppMcpServers` | Describe agent app mcp servers<br>Required: `Limit` |
| `DescribeMcpServer` | Describe mcp server<br>Required: `InstanceID`, `ID` |
| `DescribeServices` | Describe services |
| `DescribeService` | Describe service |
| `DescribeMcpServers` | Describe mcp servers<br>Required: `Limit` |
| `DescribeAgentAppModelServices` | Describe agent app model services |
| `DescribeModels` | Describe models<br>Required: `InstanceID` |
| `DescribeModelServices` | Describe model services<br>Required: `InstanceID` |
| `DescribeAgentAppServices` | Describe agent app services<br>Required: `InstanceID`, `Limit` |
## Mutations (gated — need allowlist, 9)

| Action | What it does |
|---|---|
| `CreateService` | Create service |
| `CreateAgentAppServices` | Create agent app services<br>Required: `InstanceID`, `ID`, `Services` |
| `CreateAgentAppMcpServers` | Create agent app mcp servers<br>Required: `InstanceID`, `ID`, `McpServers` |
| `CreateAgentApp` | Create agent app<br>Required: `InstanceID`, `Name`, `AuthType` |
| `CreateModelService` | Create model service<br>Required: `InstanceID`, `Name`, `Description`, `PubPath`, `TargetModels` |
| `CreateAgentCredential` | Create agent credential |
| `CreateAgentAppModelServices` | Create agent app model services<br>Required: `InstanceID`, `ID`, `ModelServices` |
| `CreateModel` | Create model<br>Required: `InstanceID`, `Name`, `HttpProtocolType`, `TargetPath`, `TargetHosts` |
| `CreateMcpServer` | Create mcp server<br>Required: `Mode`, `McpVersion`, `InstanceID`, `Name`, `Description` |

## Blocked destructive actions (16)

`DeleteModel`, `DeleteAgentAppMcpServers`, `DeleteService`, `ModifyModel`, `DeleteMcpServer`, `ModifyMcpServer`, `DeleteAgentAppModelServices`, `DeleteAgentCredential`, `DeleteModelService`, `ModifyAgentApp`, `ModifyModelService`, `DeleteAgentApp`, `ModifyAgentAppModelServices`, `ModifyAgentCredential`, `DeleteAgentAppServices`, `ModifyService` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `apis`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240801` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="apis"`) for the allow/block decision and reason.

---
name: tencent-cloudaudit
description: Tencent Cloud CLOUDAUDIT via the Tencent MCP server — 19 actions in API version v20190319 (9 read-only auto-allowed). Use for audit, track, events, region, enable, logging. Triggers on mentions of cloudaudit, audit, track, events, region, enable, logging, alias, attribute. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Observability & ops tooling
metadata:
  version: "4"
---

# Tencent Cloud CLOUDAUDIT

Observability & ops tooling: 19 actions in API version `v20190319` — 9 read-only (auto-allowed), 6 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cloudaudit"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Metric namespaces and instance IDs must match exactly — list the monitored objects first; a wrong ID yields empty data, not an error.
Alarm policies need both a trigger condition and a notification channel — a policy without receivers never pages anyone; verify both halves.
Retention on logs/metrics/traces is finite — export or ship anything needed for post-incident review before it ages out.
Load-test and chaos actions generate real traffic/faults — scope them to non-production or maintenance windows with explicit confirmation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cloudaudit/v20190319 — action signatures in `cloudaudit_client.ts`, full request/response shapes in `cloudaudit_models.ts`.

## Read actions (auto-allowed, 9)

| Action | What it does |
|---|---|
| `DescribeAuditTrack` | Describe audit track<br>Required: `TrackId` |
| `GetAttributeKey` | Get attribute key |
| `ListCmqEnableRegion` | List cmq enable region |
| `DescribeEvents` | Describe events<br>Required: `StartTime`, `EndTime` |
| `ListCosEnableRegion` | List cos enable region |
| `DescribeAuditTracks` | Describe audit tracks<br>Required: `PageNumber`, `PageSize` |
| `ListKeyAliasByRegion` | List key alias by region<br>Required: `KmsRegion` |
| `DescribeAudit` | Describe audit<br>Required: `AuditName` |
| `ListAudits` | List audits |
## Mutations (gated — need allowlist, 6)

| Action | What it does |
|---|---|
| `StartLogging` | Start logging<br>Required: `AuditName` |
| `CreateAuditTrack` | Create audit track<br>Required: `Name`, `Status`, `Storage`, `ActionType`, `ResourceType`, `EventNames` |
| `CreateEventsAuditTrack` | Create events audit track<br>Required: `Name`, `Status`, `Storage`, `Filters` |
| `InquireAuditCredit` | Run inquire audit credit |
| `UpdateAudit` | Update audit<br>Required: `AuditName` |
| `LookUpEvents` | Run look up events<br>Required: `StartTime`, `EndTime` |

## Blocked destructive actions (4)

`ModifyAuditTrack`, `ModifyEventsAuditTrack`, `StopLogging`, `DeleteAuditTrack` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cloudaudit`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190319` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cloudaudit"`) for the allow/block decision and reason.

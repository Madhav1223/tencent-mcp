---
name: tencent-rce
description: Tencent Cloud RCE via the Tencent MCP server — 5 actions in API version v20260130 (0 read-only auto-allowed). Use for assess, risk, device, environment, event, premium. Triggers on mentions of rce, assess, risk, device, environment, event, premium, report. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud RCE

Security & identity: 5 actions in API version `v20260130` — 0 read-only (auto-allowed), 5 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "rce"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/rce/v20260130 — action signatures in `rce_client.ts`, full request/response shapes in `rce_models.ts`.

## Read actions (auto-allowed, 0)

| Action | What it does |
|---|---|

## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `AssessDeviceRiskPro` | Run assess device risk pro<br>Required: `DeviceToken` |
| `AssessDeviceRiskPremiumPro` | Run assess device risk premium pro<br>Required: `DeviceToken` |
| `ReportEvent` | Report event<br>Required: `EventCode`, `EventTime`, `SessionId`, `DeviceToken`, `UserIp`, `EventDetail` |
| `AssessEnvironmentRisk` | Run assess environment risk<br>Required: `UserIp` |
| `AssessRisk` | Run assess risk<br>Required: `EventCode`, `EventTime`, `SessionId`, `DeviceToken`, `UserIp`, `EventDetail` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `rce`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20260130` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="rce"`) for the allow/block decision and reason.

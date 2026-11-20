---
name: tencent-bri
description: Tencent Cloud BRI via the Tencent MCP server — 1 actions in API version v20190328 (1 read-only auto-allowed). Use for core bri operations. Triggers on mentions of bri, . Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud BRI

Security & identity: 1 actions in API version `v20190328` — 1 read-only (auto-allowed), 0 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "bri"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/bri/v20190328 — action signatures in `bri_client.ts`, full request/response shapes in `bri_models.ts`.

## Read actions (auto-allowed, 1)

| Action | What it does |
|---|---|
| `DescribeBRI` | Describe bri<br>Required: `RequestData`, `ResourceId` |
## Mutations (gated — need allowlist, 0)

| Action | What it does |
|---|---|
| — |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `bri`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190328` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="bri"`) for the allow/block decision and reason.

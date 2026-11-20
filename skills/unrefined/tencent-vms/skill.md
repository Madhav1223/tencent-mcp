---
name: tencent-vms
description: Tencent Cloud VMS via the Tencent MCP server — 2 actions in API version v20200902 (0 read-only auto-allowed). Use for voice, code. Triggers on mentions of vms, voice, code. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging channels (SMS/voice/email)
metadata:
  version: "4"
---

# Tencent Cloud VMS

Messaging channels (SMS/voice/email): 2 actions in API version `v20200902` — 0 read-only (auto-allowed), 2 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vms"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Templates and signatures need approval before sending — create and wait for approved status; unapproved templates reject at send time.
Sender identities (signatures, sender addresses, voice numbers) are region/account-scoped — verify ownership first.
Delivery is async with per-message receipts — query receipt/status actions to confirm, and watch quota/rate limits on bursts.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vms/v20200902 — action signatures in `vms_client.ts`, full request/response shapes in `vms_models.ts`.

## Read actions (auto-allowed, 0)

| Action | What it does |
|---|---|

## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `SendCodeVoice` | Send code voice<br>Required: `CodeMessage`, `CalledNumber` (format `+…`), `VoiceSdkAppid` |
| `SendTtsVoice` | Send tts voice<br>Required: `TemplateId`, `CalledNumber` (format `+…`), `VoiceSdkAppid` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vms`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200902` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vms"`) for the allow/block decision and reason.

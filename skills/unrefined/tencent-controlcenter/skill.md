---
name: tencent-controlcenter
description: Tencent Cloud CONTROLCENTER via the Tencent MCP server — 5 actions in API version v20230110 (3 read-only auto-allowed). Use for baseline, factory, apply, baselines, batch, deploy. Triggers on mentions of controlcenter, baseline, factory, apply, baselines, batch, deploy, items, step. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud CONTROLCENTER

Security & identity: 5 actions in API version `v20230110` — 3 read-only (auto-allowed), 2 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "controlcenter"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/controlcenter/v20230110 — action signatures in `controlcenter_client.ts`, full request/response shapes in `controlcenter_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `ListDeployStepTasks` | List deploy step tasks<br>Required: `Identifier`, `Limit` (range 0~200), `Offset` |
| `GetAccountFactoryBaseline` | Get account factory baseline |
| `ListAccountFactoryBaselineItems` | List account factory baseline items<br>Required: `Limit` (range 0~200), `Offset` |
## Mutations (gated — need allowlist, 2)

| Action | What it does |
|---|---|
| `UpdateAccountFactoryBaseline` | Update account factory baseline<br>Required: `Name` |
| `BatchApplyAccountBaselines` | Run batch apply account baselines<br>Required: `MemberUinList`, `BaselineConfigItems` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `controlcenter`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230110` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="controlcenter"`) for the allow/block decision and reason.

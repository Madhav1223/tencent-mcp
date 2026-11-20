---
name: tencent-cmq
description: Tencent Cloud CMQ via the Tencent MCP server — 2 actions in API version v20190304 (2 read-only auto-allowed). Use for queue, topic. Triggers on mentions of cmq, queue, topic. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud CMQ

Messaging & eventing: 2 actions in API version `v20190304` — 2 read-only (auto-allowed), 0 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cmq"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cmq/v20190304 — action signatures in `cmq_client.ts`, full request/response shapes in `cmq_models.ts`.

## Read actions (auto-allowed, 2)

| Action | What it does |
|---|---|
| `DescribeTopicDetail` | Describe topic detail |
| `DescribeQueueDetail` | Describe queue detail |
## Mutations (gated — need allowlist, 0)

| Action | What it does |
|---|---|
| — |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cmq`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190304` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cmq"`) for the allow/block decision and reason.

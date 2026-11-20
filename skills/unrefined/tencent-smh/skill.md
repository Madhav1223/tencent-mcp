---
name: tencent-smh
description: Tencent Cloud SMH via the Tencent MCP server — 10 actions in API version v20210712 (5 read-only auto-allowed). Use for library, code, official, instances, libraries, overview. Triggers on mentions of smh, library, code, official, instances, libraries, overview, packages, secret. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Block / file storage
metadata:
  version: "4"
---

# Tencent Cloud SMH

Block / file storage: 10 actions in API version `v20210712` — 5 read-only (auto-allowed), 3 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "smh"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Storage is zone-scoped and usually must attach in the same zone as the compute using it — verify zone alignment before creating disks or file systems.
Snapshots/back up block storage: snapshot before any resize, type change, or risky attach/detach. Expanding disks is one-way on most engines — confirm size with the user first.
Throughput and protocol (NFS/CIFS/HDFS) are set at creation and often immutable; pick them from the workload, not defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/smh/v20210712 — action signatures in `smh_client.ts`, full request/response shapes in `smh_models.ts`.

## Read actions (auto-allowed, 5)

| Action | What it does |
|---|---|
| `DescribeOfficialInstances` | Describe official instances |
| `DescribeLibraries` | Describe libraries |
| `DescribeOfficialOverview` | Describe official overview |
| `DescribeTrafficPackages` | Describe traffic packages |
| `DescribeLibrarySecret` | Describe library secret<br>Required: `LibraryId` |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `CreateLibrary` | Create library<br>Required: `Name` |
| `SendSmsCode` | Send sms code<br>Required: `Purpose`, `PhoneNumber` |
| `VerifySmsCode` | Verify sms code<br>Required: `Purpose`, `PhoneNumber`, `Code` |

## Blocked destructive actions (2)

`ModifyLibrary`, `DeleteLibrary` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `smh`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210712` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="smh"`) for the allow/block decision and reason.

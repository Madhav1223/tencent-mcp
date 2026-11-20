---
name: tencent-tdid
description: Tencent Cloud TDID via the Tencent MCP server — 18 actions in API version v20210519 (8 read-only auto-allowed). Use for tdid, credential, presentation, state, summary, verify. Triggers on mentions of tdid, tdid, credential, presentation, state, summary, verify, attribute, authority. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Blockchain & trust
metadata:
  version: "4"
---

# Tencent Cloud TDID

Blockchain & trust: 18 actions in API version `v20210519` — 8 read-only (auto-allowed), 10 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tdid"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Networks and channels must exist before contracts or identities — create bottom-up and verify each layer.
Private keys and DIDs are user-held: the platform never recovers them — back up at creation.
Chaincode/contract invocation is async with block confirmation — poll transaction status until committed, not just submitted.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tdid/v20210519 — action signatures in `tdid_client.ts`, full request/response shapes in `tdid_models.ts`.

## Read actions (auto-allowed, 8)

| Action | What it does |
|---|---|
| `GetOverSummary` | Get over summary |
| `QueryAuthorityInfo` | Query authority info |
| `QueryCPT` | Query cpt |
| `GetTDidByObjectId` | Get tdid by object id |
| `GetAppSummary` | Get app summary |
| `GetTDidDocument` | Get tdid document |
| `GetTDidPubKey` | Get tdid pub key |
| `GetCredentialState` | Get credential state |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `VerifyCredentials` | Verify credentials |
| `CreatePresentation` | Create presentation |
| `CreateTDidByHost` | Create tdid by host |
| `CreateTDidByPubKey` | Create tdid by pub key |
| `VerifyPresentation` | Verify presentation |
| `CreateDisclosedCredential` | Create disclosed credential |
| `SetTDidAttribute` | Set tdid attribute |
| `UpdateCredentialState` | Update credential state |
| `DeactivateTDid` | Deactivate tdid |
| `IssueCredential` | Run issue credential |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tdid`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210519` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tdid"`) for the allow/block decision and reason.

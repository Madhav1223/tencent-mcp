---
name: tencent-btoe
description: Tencent Cloud BTOE via the Tencent MCP server — 13 actions in API version v20210514 (3 read-only auto-allowed). Use for deposit, hash, cert, evidence, verify, audio. Triggers on mentions of btoe, deposit, hash, cert, evidence, verify, audio, block, chain. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Blockchain & trust
metadata:
  version: "4"
---

# Tencent Cloud BTOE

Blockchain & trust: 13 actions in API version `v20210514` — 3 read-only (auto-allowed), 10 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "btoe"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Networks and channels must exist before contracts or identities — create bottom-up and verify each layer.
Private keys and DIDs are user-held: the platform never recovers them — back up at creation.
Chaincode/contract invocation is async with block confirmation — poll transaction status until committed, not just submitted.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/btoe/v20210514 — action signatures in `btoe_client.ts`, full request/response shapes in `btoe_models.ts`.

## Read actions (auto-allowed, 3)

| Action | What it does |
|---|---|
| `GetDepositCert` | Get deposit cert<br>Required: `EvidenceId` |
| `GetDepositFile` | Get deposit file<br>Required: `EvidenceId` |
| `GetDepositInfo` | Get deposit info<br>Required: `EvidenceId` |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `CreateHashDeposit` | Create hash deposit<br>Required: `EvidenceName`, `EvidenceHash` |
| `CreateVideoDeposit` | Create video deposit<br>Required: `EvidenceName`, `FileContent`, `FileName`, `EvidenceHash` |
| `CreateDocDeposit` | Create doc deposit<br>Required: `EvidenceName`, `FileContent`, `FileName`, `EvidenceHash` |
| `CreateHashDepositNoCert` | Create hash deposit no cert<br>Required: `EvidenceHash` |
| `CreateImageDeposit` | Create image deposit<br>Required: `EvidenceName`, `FileContent`, `FileName`, `EvidenceHash` |
| `CreateAudioDeposit` | Create audio deposit<br>Required: `EvidenceName`, `FileContent`, `FileName`, `EvidenceHash` |
| `CreateHashDepositNoSeal` | Create hash deposit no seal<br>Required: `EvidenceHash` |
| `VerifyEvidenceBlockChainTxHash` | Verify evidence block chain tx hash<br>Required: `EvidenceTxHash` |
| `VerifyEvidenceHash` | Verify evidence hash<br>Required: `EvidenceHash` |
| `CreateDataDeposit` | Create data deposit<br>Required: `EvidenceInfo`, `EvidenceName` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `btoe`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210514` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="btoe"`) for the allow/block decision and reason.

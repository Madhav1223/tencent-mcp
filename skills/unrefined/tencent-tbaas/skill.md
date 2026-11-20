---
name: tencent-tbaas
description: Tencent Cloud TBAAS via the Tencent MCP server — 24 actions in API version v20180416 (17 read-only auto-allowed). Use for chain, maker, transaction, invoke, block, contract. Triggers on mentions of tbaas, chain, maker, transaction, invoke, block, contract, demo, fabric. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Blockchain & trust
metadata:
  version: "4"
---

# Tencent Cloud TBAAS

Blockchain & trust: 24 actions in API version `v20180416` — 17 read-only (auto-allowed), 7 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tbaas"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Networks and channels must exist before contracts or identities — create bottom-up and verify each layer.
Private keys and DIDs are user-held: the platform never recovers them — back up at creation.
Chaincode/contract invocation is async with block confirmation — poll transaction status until committed, not just submitted.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tbaas/v20180416 — action signatures in `tbaas_client.ts`, full request/response shapes in `tbaas_models.ts`.

## Read actions (auto-allowed, 17)

| Action | What it does |
|---|---|
| `QueryChainMakerTransaction` | Query chain maker transaction<br>Required: `ClusterId`, `ChainId`, `TxID` |
| `QueryChainMakerDemoTransaction` | Query chain maker demo transaction<br>Required: `ClusterId`, `ChainId`, `TxID` |
| `QueryChainMakerContract` | Query chain maker contract<br>Required: `ClusterId`, `ChainId`, `ContractName`, `FuncName` |
| `QueryChainMakerDemoBlockTransaction` | Query chain maker demo block transaction<br>Required: `ClusterId`, `ChainId`, `BlockHeight` |
| `DescribeFabricBlock` | Describe fabric block<br>Required: `ClusterId`, `ChannelId`, `BlockHeight` |
| `GetClusterSummary` | Get cluster summary<br>Required: `Module`, `Operation`, `ClusterId`, `GroupId`, `GroupName` |
| `GetLatestTransactionList` | Get latest transaction list<br>Required: `Module`, `Operation`, `GroupId`, `ChannelId`, `LatestBlockNumber` (range 1~5), `GroupName`, `ChannelName`, `ClusterId` |
| `DownloadUserCert` | Download user cert<br>Required: `Module`, `Operation`, `CertId`, `CertDn`, `ClusterId`, `GroupName` |
| `GetInvokeTx` | Get invoke tx<br>Required: `Module`, `Operation`, `ClusterId`, `ChannelName`, `PeerName`, `PeerGroup`, `TxId`, `GroupName` |
| `QueryChainMakerBlockTransaction` | Query chain maker block transaction<br>Required: `ClusterId`, `ChainId`, `BlockHeight` |
| `QueryChainMakerDemoContract` | Query chain maker demo contract<br>Required: `ClusterId`, `ChainId`, `ContractName`, `FuncName` |
| `GetTransactionDetailForUser` | Get transaction detail for user<br>Required: `Module`, `Operation`, `ClusterId`, `GroupName`, `ChannelName`, `BlockId`, `TransactionId` |
| `QueryFabricChaincode` | Query fabric chaincode<br>Required: `ClusterId`, `ChannelId`, `ChaincodeName`, `FuncName` |
| `DescribeFabricTransaction` | Describe fabric transaction<br>Required: `ClusterId`, `ChannelId`, `TxId` |
| `GetBlockTransactionListForUser` | Get block transaction list for user<br>Required: `Module`, `Operation`, `ClusterId`, `GroupName`, `ChannelName`, `BlockId` |
| `GetBlockList` | Get block list<br>Required: `Module`, `Operation`, `ChannelId`, `GroupId`, `ChannelName`, `GroupName`, `ClusterId` |
| `Query` | Run query<br>Required: `Module`, `Operation`, `ClusterId`, `ChaincodeName`, `ChannelName`, `Peers`, `FuncName`, `GroupName` |
## Mutations (gated — need allowlist, 7)

| Action | What it does |
|---|---|
| `ApplyChainMakerBatchUserCert` | Run apply chain maker batch user cert<br>Required: `ClusterId`, `SignUserCsrList` |
| `Invoke` | Run invoke<br>Required: `Module`, `Operation`, `ClusterId`, `ChaincodeName`, `ChannelName`, `Peers`, `FuncName`, `GroupName` |
| `ApplyUserCert` | Run apply user cert<br>Required: `Module`, `Operation`, `ClusterId`, `GroupName`, `UserIdentity`, `Applicant`, `IdentityNum`, `CsrData` |
| `InvokeChainMakerContract` | Invoke chain maker contract<br>Required: `ClusterId`, `ChainId`, `ContractName`, `FuncName` |
| `SrvInvoke` | Run srv invoke<br>Required: `Service`, `Method`, `Param` |
| `InvokeChainMakerDemoContract` | Invoke chain maker demo contract<br>Required: `ClusterId`, `ChainId`, `ContractName`, `FuncName` |
| `InvokeFabricChaincode` | Invoke fabric chaincode<br>Required: `ClusterId`, `ChannelId`, `ChaincodeName`, `FuncName` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tbaas`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180416` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tbaas"`) for the allow/block decision and reason.

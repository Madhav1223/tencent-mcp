---
name: tencent-domain
description: Tencent Cloud DOMAIN via the Tencent MCP server — 56 actions in API version v20180808 (27 read-only auto-allowed). Use for domain, batch, bidding, custom, host, template. Triggers on mentions of domain, domain, batch, bidding, custom, host, template, email, phone. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Domains & DNS records
metadata:
  version: "4"
---

# Tencent Cloud DOMAIN

Domains & DNS records: 56 actions in API version `v20180808` — 27 read-only (auto-allowed), 17 gated mutations, 12 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "domain"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Domain operations split registry (purchase/renew/transfer) from resolution (records) — confirm which side the task needs.
DNS changes propagate with TTL delay — lower TTL before migrations, and verify with direct record queries, not cached resolvers.
Transfers and renewals have lock periods and redemption windows — check domain status codes before initiating.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/domain/v20180808 — action signatures in `domain_client.ts`, full request/response shapes in `domain_models.ts`.

## Read actions (auto-allowed, 27)

| Action | What it does |
|---|---|
| `DescribeBiddingAppointList` | Describe bidding appoint list<br>Required: `PageNumber` (default 1), `PageSize` (default 20) |
| `DescribeReservedBidInfo` | Describe reserved bid info<br>Required: `BusinessId` |
| `CheckBatchStatus` | Check batch status<br>Required: `LogIds` |
| `DescribePreDomainList` | Describe pre domain list |
| `DescribeCustomDnsHostSet` | Describe custom dns host set<br>Required: `DomainId`, `Limit` (default 20), `Offset` (default 0) |
| `DescribeDomainNameList` | Describe domain name list |
| `DescribeDomainSimpleInfo` | Describe domain simple info<br>Required: `DomainName` |
| `DescribeDomainBaseInfo` | Describe domain base info<br>Required: `Domain` |
| `DescribeBatchOperationLogDetails` | Describe batch operation log details<br>Required: `LogId` |
| `DescribeTldList` | Describe tld list |
| `DescribeBiddingSuccessfulList` | Describe bidding successful list<br>Required: `PageNumber` (default 1), `PageSize` (default 20) |
| `CheckDomain` | Check domain<br>Required: `DomainName` |
| `DescribePreAuctionList` | Describe pre auction list |
| `DescribeTemplate` | Describe template<br>Required: `TemplateId` |
| `DescribePreReleaseList` | Describe pre release list |
| `DescribeAuctionList` | Describe auction list<br>Required: `BusinessId` |
| `DescribeTemplateList` | Describe template list |
| `DescribeUnPreDomainDetail` | Describe un pre domain detail<br>Required: `Domain` |
| `DescribePayWaitDetail` | Describe pay wait detail<br>Required: `BusinessId` |
| `DescribeBiddingList` | Describe bidding list<br>Required: `PageNumber`, `PageSize` |
| `DescribeBiddingDetail` | Describe bidding detail |
| `DescribeReservedPreDomainInfo` | Describe reserved pre domain info |
| `DescribeBiddingAppointDetail` | Describe bidding appoint detail |
| `DescribePhoneEmailList` | Describe phone email list |
| `DescribeDomainPriceList` | Describe domain price list |
| `DescribeBatchOperationLogs` | Describe batch operation logs |
| `DescribeBiddingSuccessfulDetail` | Describe bidding successful detail |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `TransferProhibitionBatch` | Transfer prohibition batch<br>Required: `Domains`, `Status` |
| `BiddingPreRelease` | Run bidding pre release<br>Required: `BusinessId`, `Price` |
| `SetDomainAutoRenew` | Set domain auto renew<br>Required: `DomainId`, `AutoRenew` |
| `UploadImage` | Upload image<br>Required: `ImageFile` |
| `BidPreDomains` | Run bid pre domains |
| `CreateDomainBatch` | Create domain batch<br>Required: `TemplateId`, `Period`, `Domains`, `PayMode` |
| `ReservedPreDomains` | Reserve d pre domains<br>Required: `DomainList`, `TemplateId` |
| `SyncCustomDnsHost` | Sync custom dns host<br>Required: `DomainId` |
| `CreateCustomDnsHost` | Create custom dns host<br>Required: `DomainId`, `DnsName`, `IpSet` |
| `CreatePhoneEmail` | Create phone email<br>Required: `Code`, `Type`, `VerifyCode` |
| `CreateDomainRedemption` | Create domain redemption<br>Required: `DomainId` |
| `BidDetailPage` | Run bid detail page<br>Required: `BusinessId` |
| `TransferInDomainBatch` | Transfer in domain batch<br>Required: `Domains`, `PassWords`, `TemplateId`, `PayMode` |
| `UpdateProhibitionBatch` | Update prohibition batch<br>Required: `Domains`, `Status` |
| `CreateTemplate` | Create template<br>Required: `ContactInfo` |
| `SendPhoneEmailCode` | Send phone email code<br>Required: `Code`, `Type` |
| `BatchModifyDomainInfo` | Run batch modify domain info<br>Required: `Domains`, `TemplateId` |

## Blocked destructive actions (12)

`ModifyCustomDnsHost`, `DeletePhoneEmail`, `ModifyIntlCustomDnsHost`, `DeleteTemplate`, `ModifyDomainOwner`, `ModifyDomainDNSBatch`, `DeleteReservedPreDomainInfo`, `DeleteBidding`, `ModifyTemplate`, `ModifyDomainOwnerBatch`, `RenewDomainBatch`, `DeleteCustomDnsHost` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `domain`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180808` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="domain"`) for the allow/block decision and reason.

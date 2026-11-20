---
name: tencent-dnspod
description: Tencent Cloud DNSPOD via the Tencent MCP server — 97 actions in API version v20210323 (42 read-only auto-allowed). Use for domain, snapshot, line, batch, rollback, analytics. Triggers on mentions of dnspod, domain, snapshot, line, batch, rollback, analytics, custom, subdomain. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud DNSPOD

Networking & traffic: 97 actions in API version `v20210323` — 42 read-only (auto-allowed), 20 gated mutations, 35 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "dnspod"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/dnspod/v20210323 — action signatures in `dnspod_client.ts`, full request/response shapes in `dnspod_models.ts`.

## Read actions (auto-allowed, 42)

| Action | What it does |
|---|---|
| `DescribeDomainPurview` | Describe domain purview<br>Required: `Domain` |
| `DescribeSubdomainAnalytics` | Describe subdomain analytics<br>Required: `Domain`, `StartDate` (format `YYYY-MM-DD…`), `EndDate` (format `YYYY-MM-DD…`) |
| `CheckSnapshotRollback` | Check snapshot rollback<br>Required: `Domain`, `SnapshotId` |
| `DescribeDomainWhois` | Describe domain whois<br>Required: `Domain` |
| `DescribeDomainShareInfo` | Describe domain share info<br>Required: `Domain` |
| `DescribeDomainAndRecordList` | Describe domain and record list |
| `DescribeDomain` | Describe domain<br>Required: `Domain` |
| `DescribeRecordType` | Describe record type<br>Required: `DomainGrade` |
| `DescribeRecordExistExceptDefaultNS` | Describe record exist except default ns<br>Required: `Domain` |
| `DescribeSnapshotRollbackResult` | Describe snapshot rollback result<br>Required: `Domain`, `TaskId` |
| `DescribeDomainList` | Describe domain list |
| `DescribeSnapshotConfig` | Describe snapshot config<br>Required: `Domain` |
| `DescribeUserDetail` | Describe user detail |
| `DescribeDomainAnalytics` | Describe domain analytics<br>Required: `Domain`, `StartDate` (format `YYYY-MM-DD…`), `EndDate` (format `YYYY-MM-DD…`) |
| `DescribeRecordLineCategoryList` | Describe record line category list<br>Required: `Domain` |
| `DescribeDomainLogList` | Describe domain log list<br>Required: `Domain` |
| `DescribeDomainPreview` | Describe domain preview<br>Required: `Domain` |
| `DescribeDomainVipList` | Describe domain vip list<br>Required: `Offset` (default 0), `Limit` (default 20) |
| `DescribeDomainGroupList` | Describe domain group list |
| `DescribeDomainAliasList` | Describe domain alias list<br>Required: `Domain` |
| `DescribeSnapshotList` | Describe snapshot list<br>Required: `Domain` |
| `DescribeVasList` | Describe vas list |
| `DescribeRecordGroupList` | Describe record group list<br>Required: `Domain` |
| `DescribeRecordLineList` | Describe record line list<br>Required: `Domain`, `DomainGrade` |
| `DescribeLineGroupList` | Describe line group list<br>Required: `Domain` |
| `CheckRecordSnapshotRollback` | Check record snapshot rollback<br>Required: `Domain`, `SnapshotId`, `Record` |
| `DescribeFileInfoByJobId` | Describe file info by job id<br>Required: `JobId` |
| `DescribePackageDetail` | Describe package detail |
| `DescribeRecordFilterList` | Describe record filter list<br>Required: `Domain` |
| `DescribeRecordSnapshotRollbackResult` | Describe record snapshot rollback result<br>Required: `Domain`, `JobId` |
| `DescribeRecordList` | Describe record list<br>Required: `Domain` |
| `DescribeSnapshotRollbackTask` | Describe snapshot rollback task<br>Required: `Domain` |
| `DownloadSnapshot` | Download snapshot<br>Required: `Domain`, `SnapshotId` |
| `DescribeVASStatistic` | Describe vasstatistic<br>Required: `DomainId` |
| `DescribeRecord` | Describe record<br>Required: `Domain`, `RecordId` |
| `DescribeDomainShareUserList` | Describe domain share user list<br>Required: `Domain` |
| `DescribeResolveCount` | Describe resolve count<br>Required: `Domain`, `StartDate` (format `YYYY-MM-DD…`), `EndDate` (format `YYYY-MM-DD…`) |
| `DescribeSubdomainValidateStatus` | Describe subdomain validate status<br>Required: `DomainZone` |
| `DescribeBatchTask` | Describe batch task<br>Required: `JobId` |
| `DescribeDomainCustomLineList` | Describe domain custom line list<br>Required: `Domain` |
| `DescribeDomainFilterList` | Describe domain filter list<br>Required: `Type` |
| `DescribeDomainLogFilterFile` | Describe domain log filter file<br>Required: `Domain` |
## Mutations (gated — need allowlist, 20)

| Action | What it does |
|---|---|
| `CreateTXTRecord` | Create txtrecord<br>Required: `Domain`, `RecordLine`, `Value` |
| `CreateDomainBatch` | Create domain batch<br>Required: `DomainList` |
| `CreateLineGroup` | Create line group<br>Required: `Name`, `Lines`, `Domain` |
| `RollbackRecordSnapshot` | Roll back record snapshot<br>Required: `Domain`, `SnapshotId`, `RecordList`, `TaskId` |
| `CreateSnapshot` | Create snapshot<br>Required: `Domain` |
| `CreateRecord` | Create record<br>Required: `Domain`, `RecordType`, `RecordLine`, `Value` |
| `CreateDomainGroup` | Create domain group<br>Required: `GroupName` |
| `CreateSubDomainsAnalyticsFile` | Create sub domains analytics file<br>Required: `Domains`, `StartDate`, `SubDomainType` |
| `CreateDeal` | Create deal<br>Required: `DealType`, `GoodsType`, `GoodsChildType`, `GoodsNum`, `AutoRenew` (default 2) |
| `CreateDomain` | Create domain<br>Required: `Domain` |
| `RollbackSnapshot` | Roll back snapshot<br>Required: `Domain`, `SnapshotId` |
| `CreateLineGroupCopy` | Create line group copy<br>Required: `Domain`, `DomainIds` |
| `PayOrderWithBalance` | Run pay order with balance<br>Required: `BigDealIdList` |
| `CreateAndPayDeal` | Create and pay deal<br>Required: `DealType`, `GoodsType`, `GoodsChildType`, `GoodsNum`, `AutoRenew` (default 2) |
| `CreateSubdomainValidateTXTValue` | Create subdomain validate txtvalue<br>Required: `DomainZone` |
| `CreateRecordGroup` | Create record group<br>Required: `Domain`, `GroupName` |
| `CreateRecordBatch` | Create record batch<br>Required: `DomainIdList`, `RecordList` |
| `CreateDomainCustomLine` | Create domain custom line<br>Required: `Domain`, `Name`, `Area` |
| `CreateDomainsAnalyticsFile` | Create domains analytics file<br>Required: `Domains`, `StartDate` |
| `CreateDomainAlias` | Create domain alias<br>Required: `DomainAlias`, `Domain` |

## Blocked destructive actions (35)

`ModifySubdomainStatus`, `ModifyVasAutoRenewStatus`, `ModifyRecordGroup`, `ModifySnapshotConfig`, `ModifyRecord`, `ModifyDomainOwner`, `DeleteRecordBatch`, `ModifyRecordFields`, `DeleteDomainBatch`, `ModifyDomainUnlock`, `ModifyDomainStatus`, `ModifyPackageAutoRenew`, `ModifyRecordToGroup`, `ModifyTXTRecord`, `DeleteDomain`, `DeleteDomainCustomLine`, `ModifyDomainRecursiveStatusBatch`, `DeleteSnapshot`, `ModifyDomainToGroup`, `ModifyDomainLock`, `ModifyRecordRemark`, `ModifyLineGroup`, `ModifyRecordBatch`, `DeleteRecord`, `DeleteRecordGroup`, `ModifyRecordStatus`, `ModifyDomainCNAMESpeedupStatusBatch`, `ModifyDomainCustomLine`, `DeleteShareDomain`, `DeleteLineGroup`, `ModifyDynamicDNS`, `ModifyDomainRemark`, `DeleteDomainAlias`, `ModifyRecordBatchV3`, `ModifyPackageDomain` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `dnspod`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210323` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="dnspod"`) for the allow/block decision and reason.

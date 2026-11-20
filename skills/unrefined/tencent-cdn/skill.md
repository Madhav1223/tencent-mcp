---
name: tencent-cdn
description: Tencent Cloud CDN via the Tencent MCP server — 52 actions in API version v20180606 (30 read-only auto-allowed). Use for domain, domains, topic, purge, cache, push. Triggers on mentions of cdn, domain, domains, topic, purge, cache, push, edge, image. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud CDN

Networking & traffic: 52 actions in API version `v20180606` — 30 read-only (auto-allowed), 15 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cdn"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cdn/v20180606 — action signatures in `cdn_client.ts`, full request/response shapes in `cdn_models.ts`.

## Read actions (auto-allowed, 30)

| Action | What it does |
|---|---|
| `DescribeIpStatus` | Describe ip status<br>Required: `Domain` |
| `DescribeMapInfo` | Describe map info<br>Required: `Name` |
| `DescribeEdgePackTaskStatus` | Describe edge pack task status<br>Required: `StartTime`, `EndTime` |
| `DescribePayType` | Describe pay type |
| `DescribeDomainsConfig` | Describe domains config |
| `DescribeIpVisit` | Describe ip visit<br>Required: `StartTime`, `EndTime` |
| `DescribeCdnData` | Describe cdn data<br>Required: `StartTime`, `EndTime`, `Metric` |
| `DescribeHttpsPackages` | Describe https packages |
| `DescribeDomains` | Describe domains |
| `ListTopClsLogData` | List top cls log data<br>Required: `LogsetId`, `TopicIds`, `StartTime`, `EndTime`, `Domain`, `Url` |
| `DescribePurgeQuota` | Describe purge quota |
| `DescribeImageConfig` | Describe image config<br>Required: `Domain` |
| `DescribeTopData` | Describe top data<br>Required: `StartTime`, `EndTime`, `Metric`, `Filter` |
| `SearchClsLog` | Search cls log<br>Required: `LogsetId`, `TopicIds`, `StartTime`, `EndTime`, `Limit` |
| `ListTopData` | List top data<br>Required: `StartTime`, `EndTime`, `Metric`, `Filter` |
| `DescribeOriginData` | Describe origin data<br>Required: `StartTime`, `EndTime`, `Metric` |
| `DescribeCdnIp` | Describe cdn ip<br>Required: `Ips` |
| `DescribePurgeTasks` | Describe purge tasks |
| `DescribeUrlViolations` | Describe url violations |
| `DescribeTrafficPackages` | Describe traffic packages |
| `DescribeCdnDomainLogs` | Describe cdn domain logs<br>Required: `Domain`, `StartTime`, `EndTime` |
| `DescribePushTasks` | Describe push tasks |
| `DescribeCertDomains` | Describe cert domains |
| `ListClsTopicDomains` | List cls topic domains<br>Required: `LogsetId`, `TopicId` |
| `ListClsLogTopics` | List cls log topics |
| `DescribeCdnOriginIp` | Describe cdn origin ip |
| `DescribeBillingData` | Describe billing data<br>Required: `StartTime`, `EndTime` |
| `DescribePushQuota` | Describe push quota |
| `DescribeReportData` | Describe report data<br>Required: `StartTime`, `EndTime`, `ReportType`, `Area` |
| `DescribeDistrictIspData` | Describe district isp data<br>Required: `Domains`, `StartTime`, `EndTime`, `Metric` (2xx | 3xx | 4xx) |
## Mutations (gated — need allowlist, 15)

| Action | What it does |
|---|---|
| `AddCLSTopicDomains` | Add clstopic domains<br>Required: `LogsetId`, `TopicId`, `DomainAreaConfigs` |
| `CreateEdgePackTask` | Create edge pack task<br>Required: `CosBucket`, `CosUriFrom` |
| `VerifyDomainRecord` | Verify domain record<br>Required: `Domain` |
| `AddCdnDomain` | Add cdn domain<br>Required: `Domain`, `ServiceType`, `Origin` |
| `CreateVerifyRecord` | Create verify record<br>Required: `Domain` |
| `ManageClsTopicDomains` | Run manage cls topic domains<br>Required: `LogsetId`, `TopicId` |
| `StartCdnDomain` | Start cdn domain<br>Required: `Domain` |
| `DuplicateDomainConfig` | Duplicate domain config<br>Required: `Domain`, `ReferenceDomain` |
| `UpdateDomainConfig` | Update domain config<br>Required: `Domain` |
| `CreateClsLogTopic` | Create cls log topic<br>Required: `TopicName`, `LogsetId` |
| `PushUrlsCache` | Push urls cache<br>Required: `Urls` |
| `UpdateImageConfig` | Update image config<br>Required: `Domain` |
| `DisableClsLogTopic` | Disable cls log topic<br>Required: `LogsetId`, `TopicId` |
| `EnableClsLogTopic` | Enable cls log topic<br>Required: `LogsetId`, `TopicId` |
| `UpdatePayType` | Update pay type<br>Required: `Area`, `PayType` |

## Blocked destructive actions (7)

`ModifyDomainConfig`, `DeleteCdnDomain`, `StopCdnDomain`, `PurgePathCache`, `PurgeUrlsCache`, `ModifyPurgeFetchTaskStatus`, `DeleteClsLogTopic` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cdn`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180606` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cdn"`) for the allow/block decision and reason.

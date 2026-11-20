---
name: tencent-gaap
description: Tencent Cloud GAAP via the Tencent MCP server — 102 actions in API version v20180529 (43 read-only auto-allowed). Use for domain, proxy, global, real, security, attribute. Triggers on mentions of gaap, domain, proxy, global, real, security, attribute, proxies, servers. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud GAAP

Networking & traffic: 102 actions in API version `v20180529` — 43 read-only (auto-allowed), 30 gated mutations, 29 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "gaap"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/gaap/v20180529 — action signatures in `gaap_client.ts`, full request/response shapes in `gaap_models.ts`.

## Read actions (auto-allowed, 43)

| Action | What it does |
|---|---|
| `DescribeCertificates` | Describe certificates |
| `DescribeHTTPSListeners` | Describe httpslisteners |
| `DescribeBlackHeader` | Describe black header |
| `DescribeCountryAreaMapping` | Describe country area mapping |
| `DescribeGlobalDomainDns` | Describe global domain dns<br>Required: `DomainId` |
| `DescribeCrossBorderProxies` | Describe cross border proxies |
| `DescribeGroupAndStatisticsProxy` | Describe group and statistics proxy<br>Required: `ProjectId` |
| `DescribeProxyDetail` | Describe proxy detail<br>Required: `ProxyId` |
| `DescribeRuleRealServers` | Describe rule real servers<br>Required: `RuleId` |
| `DescribeDestRegions` | Describe dest regions |
| `DescribeRulesByRuleIds` | Describe rules by rule ids<br>Required: `RuleIds` |
| `DescribeProxyGroupList` | Describe proxy group list<br>Required: `Offset` (default 0), `Limit` (default 20), `ProjectId` (-1) |
| `DescribeProxyGroupStatistics` | Describe proxy group statistics<br>Required: `GroupId`, `StartTime`, `EndTime`, `MetricNames`, `Granularity` |
| `DescribeAccessRegionsByDestRegion` | Describe access regions by dest region<br>Required: `DestRegion` |
| `DescribeTCPListeners` | Describe tcplisteners |
| `DescribeRealServers` | Describe real servers<br>Required: `ProjectId` |
| `DescribeProxyAndStatisticsListeners` | Describe proxy and statistics listeners<br>Required: `ProjectId` |
| `DescribeUDPListeners` | Describe udplisteners |
| `DescribeRealServerStatistics` | Describe real server statistics<br>Required: `RealServerId` |
| `DescribeHTTPListeners` | Describe httplisteners |
| `DescribeCustomHeader` | Describe custom header<br>Required: `RuleId` |
| `DescribeSecurityPolicyDetail` | Describe security policy detail<br>Required: `PolicyId` |
| `DescribeSecurityRules` | Describe security rules<br>Required: `SecurityRuleIds` |
| `DescribeProxyGroupDetails` | Describe proxy group details<br>Required: `GroupId` |
| `DescribeProxies` | Describe proxies |
| `DescribeCertificateDetail` | Describe certificate detail<br>Required: `CertificateId` |
| `DescribeTaskStatus` | Describe task status |
| `DescribeRegionAndPrice` | Describe region and price |
| `DescribeGlobalDomains` | Describe global domains<br>Required: `ProjectId`, `Offset`, `Limit` |
| `DescribeRealServersStatus` | Describe real servers status<br>Required: `RealServerIds` |
| `DescribeRules` | Describe rules<br>Required: `ListenerId` |
| `DescribeListenerRealServers` | Describe listener real servers<br>Required: `ListenerId` |
| `CheckProxyCreate` | Check proxy create<br>Required: `AccessRegion`, `RealServerRegion`, `Bandwidth` (unit: Mbps), `Concurrent` |
| `DescribeAccessRegions` | Describe access regions |
| `DescribeGroupDomainConfig` | Describe group domain config<br>Required: `GroupId` |
| `DescribeListenerStatistics` | Describe listener statistics<br>Required: `ListenerId`, `StartTime`, `EndTime`, `MetricNames`, `Granularity` |
| `DescribeProxyStatistics` | Describe proxy statistics<br>Required: `ProxyId`, `StartTime`, `EndTime`, `MetricNames`, `Granularity` |
| `DescribeDomainErrorPageInfo` | Describe domain error page info<br>Required: `ListenerId`, `Domain` |
| `DescribeAuthSignature` | Describe auth signature |
| `InquiryPriceCreateProxy` | Inquire the price of: create proxy<br>Required: `AccessRegion`, `Bandwidth` (unit: Mbps) |
| `DescribeDomainErrorPageInfoByIds` | Describe domain error page info by ids<br>Required: `ErrorPageIds` |
| `DescribeProxiesStatus` | Describe proxies status |
| `DescribeResourcesByTag` | Describe resources by tag<br>Required: `TagKey`, `TagValue` |
## Mutations (gated — need allowlist, 30)

| Action | What it does |
|---|---|
| `CreateSecurityRules` | Create security rules<br>Required: `PolicyId`, `RuleList` |
| `CreateGlobalDomain` | Create global domain<br>Required: `ProjectId`, `DefaultValue` |
| `CreateCustomHeader` | Create custom header<br>Required: `RuleId` |
| `CloseSecurityPolicy` | Close security policy |
| `CreateProxyGroupDomain` | Create proxy group domain<br>Required: `GroupId` |
| `SetTlsVersion` | Set tls version<br>Required: `ListenerId`, `TLSSupportVersion`, `TLSCiphers` |
| `CreateUDPListeners` | Create udplisteners<br>Required: `ListenerName`, `Ports`, `Scheduler`, `RealServerType` |
| `OpenSecurityPolicy` | Open security policy |
| `CreateDomainErrorPageInfo` | Create domain error page info<br>Required: `ListenerId`, `Domain`, `ErrorNos`, `Body` |
| `BindListenerRealServers` | Bind listener real servers<br>Required: `ListenerId` |
| `CloseProxyGroup` | Close proxy group<br>Required: `GroupId` |
| `CreateHTTPListener` | Create httplistener<br>Required: `ListenerName`, `Port` |
| `CreateProxyGroup` | Create proxy group<br>Required: `ProjectId`, `GroupName`, `RealServerRegion` |
| `CreateCertificate` | Create certificate<br>Required: `CertificateType`, `CertificateContent` (format `pem…`) |
| `CreateProxy` | Create proxy<br>Required: `ProjectId`, `ProxyName`, `AccessRegion`, `Bandwidth` (unit: Mbps), `Concurrent` |
| `CreateSecurityPolicy` | Create security policy<br>Required: `DefaultAction` (default ACCEPT) |
| `CreateRule` | Create rule<br>Required: `ListenerId`, `Domain`, `Path`, `RealServerType`, `Scheduler`, `HealthCheck` |
| `OpenProxies` | Open proxies |
| `AddRealServers` | Add real servers<br>Required: `ProjectId`, `RealServerIP`, `RealServerName` |
| `CreateDomain` | Create domain<br>Required: `ListenerId`, `Domain` |
| `DisableGlobalDomain` | Disable global domain<br>Required: `DomainId` |
| `EnableGlobalDomain` | Enable global domain<br>Required: `DomainId` |
| `SetAuthentication` | Set authentication<br>Required: `ListenerId`, `Domain` |
| `CreateHTTPSListener` | Create httpslistener<br>Required: `ListenerName`, `Port`, `CertificateId`, `ForwardProtocol` |
| `OpenProxyGroup` | Open proxy group<br>Required: `GroupId` |
| `BanAndRecoverProxy` | Run ban and recover proxy |
| `CreateGlobalDomainDns` | Create global domain dns<br>Required: `DomainId`, `ProxyIdList`, `NationCountryInnerCodes` |
| `CloseProxies` | Close proxies |
| `CreateTCPListeners` | Create tcplisteners<br>Required: `ListenerName`, `Ports`, `Scheduler`, `HealthCheck`, `RealServerType` |
| `BindRuleRealServers` | Bind rule real servers<br>Required: `RuleId` |

## Blocked destructive actions (29)

`ModifyGlobalDomainDns`, `DeleteSecurityPolicy`, `ModifyHTTPListenerAttribute`, `ModifyCertificateAttributes`, `DeleteDomainErrorPageInfo`, `ModifyCertificate`, `ModifyRealServerName`, `DeleteSecurityRules`, `DeleteCertificate`, `ModifyGroupDomainConfig`, `ModifyGlobalDomainAttribute`, `ModifyProxyConfiguration`, `ModifyTCPListenerAttribute`, `DeleteGlobalDomainDns`, `DestroyProxies`, `DeleteDomain`, `RemoveRealServers`, `DeleteGlobalDomain`, `DeleteRule`, `ModifyDomain`, `ModifyUDPListenerAttribute`, `DeleteProxyGroup`, `ModifyProxiesProject`, `ModifyRuleAttribute`, `ModifyProxiesAttribute`, `ModifyHTTPSListenerAttribute`, `DeleteListeners`, `ModifyProxyGroupAttribute`, `ModifySecurityRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `gaap`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180529` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="gaap"`) for the allow/block decision and reason.

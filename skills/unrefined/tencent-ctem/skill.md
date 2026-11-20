---
name: tencent-ctem
description: Tencent Cloud CTEM via the Tencent MCP server — 61 actions in API version v20231128 (30 read-only auto-allowed). Use for wechat, assets, domains, fake, apps, leakage. Triggers on mentions of ctem, wechat, assets, domains, fake, apps, leakage, official, seeds. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CTEM

General service: 61 actions in API version `v20231128` — 30 read-only (auto-allowed), 15 gated mutations, 16 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ctem"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ctem/v20231128 — action signatures in `ctem_client.ts`, full request/response shapes in `ctem_models.ts`.

## Read actions (auto-allowed, 30)

| Action | What it does |
|---|---|
| `DescribeNetDisks` | Describe net disks |
| `DescribeManages` | Describe manages |
| `DescribeLeakageDatas` | Describe leakage datas |
| `DescribeHttps` | Describe https |
| `DescribeApiSecs` | Describe api secs |
| `DescribeDomains` | Describe domains |
| `DescribeAssets` | Describe assets |
| `DescribeVuls` | Describe vuls |
| `DescribeSeeds` | Describe seeds<br>Required: `CustomerId` |
| `DescribeConfigs` | Describe configs |
| `DescribeFakeWebsites` | Describe fake websites |
| `DescribeSensitiveInfos` | Describe sensitive infos |
| `DescribeFakeMiniPrograms` | Describe fake mini programs |
| `DescribeSubDomains` | Describe sub domains |
| `DescribeCustomers` | Describe customers |
| `DescribeLeakageEmails` | Describe leakage emails |
| `DescribeFakeApps` | Describe fake apps |
| `DescribeApps` | Describe apps |
| `DescribeFakeWechatOfficials` | Describe fake wechat officials |
| `DescribeJobRecordDetails` | Describe job record details<br>Required: `Module`, `Id` |
| `DescribeSuspiciousAssets` | Describe suspicious assets |
| `DescribeGithubs` | Describe githubs |
| `DescribePorts` | Describe ports |
| `DescribeDarkWebs` | Describe dark webs |
| `DescribeLeakageCodes` | Describe leakage codes |
| `DescribeWechatOfficialAccounts` | Describe wechat official accounts |
| `DescribeEnterprises` | Describe enterprises |
| `DescribeJobRecords` | Describe job records |
| `DescribeWeakPasswords` | Describe weak passwords |
| `DescribeWechatApplets` | Describe wechat applets |
## Mutations (gated — need allowlist, 15)

| Action | What it does |
|---|---|
| `CreateWechatApplet` | Create wechat applet<br>Required: `CustomerId` |
| `CreateManage` | Create manage<br>Required: `CustomerId`, `Url` |
| `CreateAsset` | Create asset<br>Required: `Ip`, `CustomerId` |
| `CreateSuspiciousAsset` | Create suspicious asset<br>Required: `CustomerId` |
| `IgnoreData` | Run ignore data<br>Required: `Ids`, `Module` |
| `CreateSubDomain` | Create sub domain<br>Required: `CustomerId`, `SubDomain` |
| `CreatePort` | Create port<br>Required: `CustomerId`, `Port`, `Asset`, `IsHighRisk` |
| `CreateWechatOfficialAccount` | Create wechat official account<br>Required: `CustomerId` |
| `CreateJobRecord` | Create job record<br>Required: `CustomerId`, `TaskType` |
| `CreateHttp` | Create http<br>Required: `CustomerId`, `Url` |
| `CreateSeeds` | Create seeds<br>Required: `CustomerId` |
| `CreateApp` | Create app<br>Required: `CustomerId` |
| `CreateDomain` | Create domain<br>Required: `CustomerId`, `Domain` |
| `CreateEnterprise` | Create enterprise<br>Required: `CustomerId`, `Name` |
| `CreateCustomer` | Create customer<br>Required: `Name`, `ScanType` |

## Blocked destructive actions (16)

`ModifyCustomer`, `DeleteManages`, `DeleteHttps`, `DeleteSuspiciousAssets`, `DeleteSubDomains`, `DeleteWechatOfficialAccounts`, `DeleteWechatApplets`, `DeletePorts`, `ModifyLabel`, `DeleteApps`, `DeleteEnterprises`, `ModifySeedStatus`, `DeleteDomains`, `DeleteAssets`, `StopJobRecord`, `DeleteSeeds` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ctem`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20231128` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ctem"`) for the allow/block decision and reason.

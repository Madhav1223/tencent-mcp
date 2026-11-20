---
name: tencent-wav
description: Tencent Cloud WAV via the Tencent MCP server — 26 actions in API version v20210129 (23 read-only auto-allowed). Use for external, code, activity, contact, event, statistics. Triggers on mentions of wav, external, code, activity, contact, event, statistics, channel, customer. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud WAV

General service: 26 actions in API version `v20210129` — 23 read-only (auto-allowed), 3 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "wav"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/wav/v20210129 — action signatures in `wav_client.ts`, full request/response shapes in `wav_models.ts`.

## Read actions (auto-allowed, 23)

| Action | What it does |
|---|---|
| `QueryActivityLiveCodeList` | Query activity live code list |
| `QueryActivityList` | Query activity list |
| `QueryCustomerEventDetailStatistics` | Query customer event detail statistics<br>Required: `BeginTime`, `EndTime` |
| `QueryActivityJoinList` | Query activity join list<br>Required: `ActivityId` |
| `QueryArrivalList` | Query arrival list<br>Required: `Limit` (range 1~1000), `BeginTime`, `EndTime` |
| `QueryChannelCodeList` | Query channel code list |
| `QueryExternalContactList` | Query external contact list |
| `QueryCustomerProfileList` | Query customer profile list<br>Required: `Limit` (range 1~1000), `BeginTime`, `EndTime` |
| `QueryUserInfoList` | Query user info list |
| `QueryExternalUserEventList` | Query external user event list<br>Required: `BeginTime`, `EndTime` |
| `QueryLicenseInfo` | Query license info<br>Required: `License` |
| `QueryFollowList` | Query follow list<br>Required: `Limit` (range 1~1000), `BeginTime`, `EndTime` |
| `QueryClueInfoList` | Query clue info list |
| `QueryExternalContactDetail` | Query external contact detail<br>Required: `ExternalUserId` |
| `QueryVehicleInfoList` | Query vehicle info list |
| `QueryStaffEventDetailStatistics` | Query staff event detail statistics<br>Required: `BeginTime`, `EndTime` |
| `QueryChatArchivingList` | Query chat archiving list |
| `QueryMaterialList` | Query material list<br>Required: `MaterialType` |
| `QueryCrmStatistics` | Query crm statistics<br>Required: `BeginTime`, `EndTime` |
| `QueryMiniAppCodeList` | Query mini app code list |
| `QueryDealerInfoList` | Query dealer info list |
| `QueryExternalContactDetailByDate` | Query external contact detail by date<br>Required: `BeginTime`, `EndTime` |
| `QueryExternalUserMappingInfo` | Query external user mapping info<br>Required: `CorpExternalUserIdList` |
## Mutations (gated — need allowlist, 3)

| Action | What it does |
|---|---|
| `CreateLead` | Create lead<br>Required: `ChannelId`, `ChannelName`, `CreateTime`, `SourceType`, `DealerId`, `BrandId`, `SeriesId`, `CustomerName`, `CustomerPhone` |
| `CreateCorpTag` | Create corp tag<br>Required: `GroupName`, `Tags` |
| `CreateChannelCode` | Create channel code<br>Required: `Type`, `UseUserId`, `UseUserOpenId`, `AppIds` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `wav`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210129` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="wav"`) for the allow/block decision and reason.

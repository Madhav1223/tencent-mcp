---
name: tencent-sms
description: Tencent Cloud SMS via the Tencent MCP server — 20 actions in API version v20210111 (4 read-only auto-allowed). Use for pull, sign, template, number, phone, send. Triggers on mentions of sms, pull, sign, template, number, phone, send, statistics, reply. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging channels (SMS/voice/email)
metadata:
  version: "4"
---

# Tencent Cloud SMS

Messaging channels (SMS/voice/email): 20 actions in API version `v20210111` — 4 read-only (auto-allowed), 12 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "sms"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Templates and signatures need approval before sending — create and wait for approved status; unapproved templates reject at send time.
Sender identities (signatures, sender addresses, voice numbers) are region/account-scoped — verify ownership first.
Delivery is async with per-message receipts — query receipt/status actions to confirm, and watch quota/rate limits on bursts.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/sms/v20210111 — action signatures in `sms_client.ts`, full request/response shapes in `sms_models.ts`.

## Read actions (auto-allowed, 4)

| Action | What it does |
|---|---|
| `DescribeSmsTemplateList` | Describe sms template list<br>Required: `International` |
| `DescribeSmsSignList` | Describe sms sign list<br>Required: `International` |
| `DescribeSendRecordList` | Describe send record list<br>Required: `PhoneNumber`, `SmsSdkAppId`, `BeginTime` |
| `DescribePhoneNumberInfo` | Describe phone number info<br>Required: `PhoneNumberSet` (format `+…`) |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `SendMultiGlobalSms` | Send multi global sms<br>Required: `SmsSdkAppId`, `MultiSmsInfoSet` |
| `AddSmsSign` | Add sms sign<br>Required: `SignName`, `SignType`, `DocumentType`, `International`, `SignPurpose`, `ProofImage` |
| `PullSmsSendStatus` | Pull sms send status<br>Required: `Limit`, `SmsSdkAppId` |
| `PullSmsSendStatusByPhoneNumber` | Pull sms send status by phone number<br>Required: `BeginTime`, `Offset`, `Limit`, `PhoneNumber`, `SmsSdkAppId` |
| `SmsPackagesStatistics` | Run sms packages statistics<br>Required: `SmsSdkAppId`, `Limit` (default 500), `Offset`, `BeginTime` (format `yyyymmddhh…`), `EndTime` (format `yyyymmddhh…`) |
| `SendStatusStatistics` | Send status statistics<br>Required: `BeginTime` (format `yyyymmddhh…`), `EndTime` (format `yyyymmddhh…`), `SmsSdkAppId`, `Limit`, `Offset` |
| `CallbackStatusStatistics` | Run callback status statistics<br>Required: `BeginTime` (format `yyyymmddhh…`), `EndTime` (format `yyyymmddhh…`), `SmsSdkAppId`, `Limit`, `Offset` |
| `PullSmsReplyStatus` | Pull sms reply status<br>Required: `Limit`, `SmsSdkAppId` |
| `ReportConversion` | Report conversion<br>Required: `SmsSdkAppId`, `SerialNo` |
| `PullSmsReplyStatusByPhoneNumber` | Pull sms reply status by phone number<br>Required: `BeginTime`, `Offset`, `Limit`, `PhoneNumber`, `SmsSdkAppId` |
| `AddSmsTemplate` | Add sms template<br>Required: `TemplateName`, `TemplateContent`, `SmsType`, `International`, `Remark` |
| `SendSms` | Send sms<br>Required: `PhoneNumberSet` (format `+…`), `SmsSdkAppId`, `TemplateId` |

## Blocked destructive actions (4)

`ModifySmsSign`, `DeleteSmsTemplate`, `ModifySmsTemplate`, `DeleteSmsSign` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `sms`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210111` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="sms"`) for the allow/block decision and reason.

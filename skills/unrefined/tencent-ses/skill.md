---
name: tencent-ses
description: Tencent Cloud SES via the Tencent MCP server — 36 actions in API version v20201002 (14 read-only auto-allowed). Use for email, address, receiver, black, custom, identity. Triggers on mentions of ses, email, address, receiver, black, custom, identity, template, unsubscribe. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging channels (SMS/voice/email)
metadata:
  version: "4"
---

# Tencent Cloud SES

Messaging channels (SMS/voice/email): 36 actions in API version `v20201002` — 14 read-only (auto-allowed), 15 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ses"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Templates and signatures need approval before sending — create and wait for approved status; unapproved templates reject at send time.
Sender identities (signatures, sender addresses, voice numbers) are region/account-scoped — verify ownership first.
Delivery is async with per-message receipts — query receipt/status actions to confirm, and watch quota/rate limits on bursts.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ses/v20201002 — action signatures in `ses_client.ts`, full request/response shapes in `ses_models.ts`.

## Read actions (auto-allowed, 14)

| Action | What it does |
|---|---|
| `ListEmailIdentities` | List email identities |
| `GetSendEmailStatus` | Get send email status<br>Required: `RequestDate`, `Offset` (default 0), `Limit` |
| `ListReceiverDetails` | List receiver details<br>Required: `ReceiverId`, `Offset`, `Limit` |
| `GetEmailTemplate` | Get email template<br>Required: `TemplateID` |
| `GetEmailIdentity` | Get email identity<br>Required: `EmailIdentity` |
| `GetStatisticsReport` | Get statistics report<br>Required: `StartDate`, `EndDate` |
| `ListAddressUnsubscribeConfig` | List address unsubscribe config |
| `ListEmailAddress` | List email address |
| `ListEmailTemplates` | List email templates<br>Required: `Limit`, `Offset` |
| `ListSendTasks` | List send tasks<br>Required: `Offset`, `Limit` |
| `GetAbuseReport` | Get abuse report<br>Required: `StartTime`, `EndTime` |
| `ListCustomBlacklist` | List custom blacklist<br>Required: `Offset`, `Limit`, `Status` |
| `ListBlackEmailAddress` | List black email address<br>Required: `StartDate` (format `YYYY-MM-DD…`), `EndDate` (format `YYYY-MM-DD…`), `Limit`, `Offset` |
| `ListReceivers` | List receivers<br>Required: `Offset`, `Limit` |
## Mutations (gated — need allowlist, 15)

| Action | What it does |
|---|---|
| `CreateEmailAddress` | Create email address<br>Required: `EmailAddress` |
| `CreateReceiverDetailWithData` | Create receiver detail with data<br>Required: `ReceiverId`, `Datas` |
| `CreateReceiver` | Create receiver<br>Required: `ReceiversName` |
| `UpdateCustomBlackList` | Update custom black list<br>Required: `Id`, `Email` |
| `CreateAddressUnsubscribeConfig` | Create address unsubscribe config<br>Required: `Address`, `UnsubscribeConfig`, `Status` |
| `UpdateEmailTemplate` | Update email template<br>Required: `TemplateContent`, `TemplateID`, `TemplateName` |
| `UpdateEmailIdentity` | Update email identity<br>Required: `EmailIdentity` |
| `CreateEmailTemplate` | Create email template<br>Required: `TemplateName`, `TemplateContent` |
| `BatchSendEmail` | Run batch send email<br>Required: `FromEmailAddress`, `ReceiverId`, `Subject`, `TaskType` |
| `UpdateEmailSmtpPassWord` | Update email smtp pass word<br>Required: `Password`, `EmailAddress` |
| `UpdateAddressUnsubscribeConfig` | Update address unsubscribe config<br>Required: `Address`, `UnsubscribeConfig`, `Status` |
| `CreateCustomBlacklist` | Create custom blacklist<br>Required: `Emails` |
| `CreateEmailIdentity` | Create email identity<br>Required: `EmailIdentity` |
| `SendEmail` | Send email<br>Required: `FromEmailAddress`, `Subject` |
| `CreateReceiverDetail` | Create receiver detail<br>Required: `ReceiverId`, `Emails` |

## Blocked destructive actions (7)

`DeleteEmailIdentity`, `DeleteReceiver`, `DeleteEmailTemplate`, `DeleteAddressUnsubscribeConfig`, `DeleteCustomBlackList`, `DeleteBlackList`, `DeleteEmailAddress` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ses`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20201002` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ses"`) for the allow/block decision and reason.

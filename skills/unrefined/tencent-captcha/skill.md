---
name: tencent-captcha
description: Tencent Cloud CAPTCHA via the Tencent MCP server — 18 actions in API version v20190722 (17 read-only auto-allowed). Use for captcha, mini, result, statistics, ticket, oper. Triggers on mentions of captcha, captcha, mini, result, statistics, ticket, oper, request, total. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud CAPTCHA

Security & identity: 18 actions in API version `v20190722` — 17 read-only (auto-allowed), 1 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "captcha"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/captcha/v20190722 — action signatures in `captcha_client.ts`, full request/response shapes in `captcha_models.ts`.

## Read actions (auto-allowed, 17)

| Action | What it does |
|---|---|
| `DescribeCaptchaRceResult` | Describe captcha rce result<br>Required: `CaptchaType`, `Ticket`, `UserIp`, `Randstr`, `CaptchaAppId`, `AppSecretKey` |
| `DescribeCaptchaMiniRiskResult` | Describe captcha mini risk result<br>Required: `CaptchaType`, `Ticket`, `UserIp`, `CaptchaAppId`, `AppSecretKey` |
| `DescribeCaptchaTicketData` | Describe captcha ticket data<br>Required: `CaptchaAppId`, `Start` |
| `GetTotalRequestStatistics` | Get total request statistics<br>Required: `StartTimeStr`, `EndTimeStr`, `Dimension` |
| `DescribeCaptchaDataSum` | Describe captcha data sum<br>Required: `CaptchaAppId`, `Start`, `End` |
| `DescribeCaptchaOperData` | Describe captcha oper data<br>Required: `CaptchaAppId`, `Start`, `Type` |
| `DescribeCaptchaMiniData` | Describe captcha mini data<br>Required: `CaptchaAppId`, `Start`, `End`, `Type` |
| `DescribeCaptchaMiniOperData` | Describe captcha mini oper data<br>Required: `CaptchaAppId`, `Start`, `Type` |
| `DescribeCaptchaData` | Describe captcha data<br>Required: `CaptchaAppId`, `Start`, `End`, `Type` |
| `DescribeCaptchaMiniDataSum` | Describe captcha mini data sum<br>Required: `CaptchaAppId`, `Start`, `End` |
| `GetTicketStatistics` | Get ticket statistics<br>Required: `CaptchaAppId`, `StartTimeStr`, `EndTimeStr`, `Dimension` |
| `DescribeCaptchaMiniResult` | Describe captcha mini result<br>Required: `CaptchaType`, `Ticket`, `UserIp`, `CaptchaAppId`, `AppSecretKey` |
| `GetTotalTicketStatistics` | Get total ticket statistics<br>Required: `StartTimeStr`, `EndTimeStr`, `Dimension` |
| `DescribeCaptchaUserAllAppId` | Describe captcha user all app id |
| `GetRequestStatistics` | Get request statistics<br>Required: `CaptchaAppId`, `StartTimeStr`, `EndTimeStr`, `Dimension` |
| `DescribeCaptchaAppIdInfo` | Describe captcha app id info<br>Required: `CaptchaAppId` |
| `DescribeCaptchaResult` | Describe captcha result<br>Required: `CaptchaType`, `Ticket`, `UserIp`, `Randstr`, `CaptchaAppId`, `AppSecretKey` |
## Mutations (gated — need allowlist, 1)

| Action | What it does |
|---|---|
| `UpdateCaptchaAppIdInfo` | Update captcha app id info<br>Required: `CaptchaAppId`, `AppName`, `DomainLimit`, `SceneType`, `CapType`, `EvilInterceptGrade`, `SmartVerify`, `SmartEngine`, `SchemeColor`, `CaptchaLanguage`, `MailAlarm`, `TopFullScreen`, `TrafficThreshold` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `captcha`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190722` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="captcha"`) for the allow/block decision and reason.

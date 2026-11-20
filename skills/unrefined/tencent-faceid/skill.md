---
name: tencent-faceid
description: Tencent Cloud FACEID via the Tencent MCP server — 38 actions in API version v20180301 (18 read-only auto-allowed). Use for verification, card, phone, bank, detect, token. Triggers on mentions of faceid, verification, card, phone, bank, detect, token, face, recognition. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud FACEID

Security & identity: 38 actions in API version `v20180301` — 18 read-only (auto-allowed), 20 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "faceid"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/faceid/v20180301 — action signatures in `faceid_client.ts`, full request/response shapes in `faceid_models.ts`.

## Read actions (auto-allowed, 18)

| Action | What it does |
|---|---|
| `GetLiveCode` | Get live code |
| `GetFaceIdRiskInfo` | Get face id risk info<br>Required: `FaceIdToken` |
| `GetWeChatBillDetails` | Get we chat bill details<br>Required: `Date`, `Cursor` |
| `CheckIdCardInformation` | Check id card information |
| `CheckEidTokenStatus` | Check eid token status<br>Required: `EidToken` |
| `GetActionSequence` | Get action sequence |
| `GetDetectInfoEnhanced` | Get detect info enhanced<br>Required: `BizToken`, `RuleId` |
| `GetWxNFCResult` | Get wx nfcresult<br>Required: `NFCToken` |
| `GetFaceIdToken` | Get face id token<br>Required: `CompareLib` |
| `CheckPhoneAndName` | Check phone and name<br>Required: `Mobile`, `Name` |
| `GetFaceIdResult` | Get face id result<br>Required: `FaceIdToken` |
| `GetEidToken` | Get eid token<br>Required: `MerchantId` |
| `GetNFCToken` | Get nfctoken |
| `CheckIdNameDate` | Check id name date<br>Required: `Name`, `IdCard`, `ValidityBegin` (format `YYYYMMDD…`), `ValidityEnd` (format `YYYYMMDD…`) |
| `GetFaceidRiskInfoToken` | Get faceid risk info token |
| `GetEidResult` | Get eid result<br>Required: `EidToken` |
| `CheckBankCardInformation` | Check bank card information<br>Required: `BankCard` |
| `GetDetectInfo` | Get detect info<br>Required: `BizToken`, `RuleId` |
## Mutations (gated — need allowlist, 20)

| Action | What it does |
|---|---|
| `BankCard4EVerification` | Run bank card4 everification<br>Required: `Name`, `BankCard`, `Phone`, `IdCard` |
| `EncryptedPhoneVerification` | Run encrypted phone verification<br>Required: `IdCard`, `Name`, `Phone`, `EncryptionMode` |
| `BankCardVerification` | Run bank card verification<br>Required: `IdCard`, `Name`, `BankCard` |
| `ImageRecognitionV2` | Image recognition v2<br>Required: `IdCard`, `Name`, `ImageBase64` |
| `LivenessCompare` | Run liveness compare<br>Required: `LivenessType` |
| `MobileStatus` | Run mobile status<br>Required: `Mobile` |
| `IdCardOCRVerification` | Run id card ocrverification |
| `ImageRecognition` | Image recognition<br>Required: `IdCard`, `Name`, `ImageBase64` |
| `DetectAIFakeFaces` | Detect aifake faces |
| `PhoneVerification` | Run phone verification<br>Required: `IdCard`, `Name`, `Phone` |
| `PhoneVerificationCMCC` | Run phone verification cmcc<br>Required: `IdCard`, `Name`, `Phone` |
| `MinorsVerification` | Run minors verification<br>Required: `Type` |
| `PhoneVerificationCUCC` | Run phone verification cucc<br>Required: `IdCard`, `Name`, `Phone` |
| `LivenessRecognition` | Run liveness recognition<br>Required: `IdCard`, `Name`, `LivenessType` |
| `ParseNfcData` | Run parse nfc data<br>Required: `ReqId` |
| `IdCardVerification` | Run id card verification<br>Required: `IdCard`, `Name` |
| `MobileNetworkTimeVerification` | Run mobile network time verification<br>Required: `Mobile` |
| `DetectAuth` | Detect auth<br>Required: `RuleId` |
| `BankCard2EVerification` | Run bank card2 everification<br>Required: `Name`, `BankCard` |
| `PhoneVerificationCTCC` | Run phone verification ctcc<br>Required: `IdCard`, `Name`, `Phone` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `faceid`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180301` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="faceid"`) for the allow/block decision and reason.

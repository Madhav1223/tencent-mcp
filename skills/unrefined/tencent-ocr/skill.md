---
name: tencent-ocr
description: Tencent Cloud OCR via the Tencent MCP server — 78 actions in API version v20181119 (5 read-only auto-allowed). Use for recognize, license, agent, general, invoice, verify. Triggers on mentions of ocr, recognize, license, agent, general, invoice, verify, extract, question. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud OCR

AI services: 78 actions in API version `v20181119` — 5 read-only (auto-allowed), 73 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ocr"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ocr/v20181119 — action signatures in `ocr_client.ts`, full request/response shapes in `ocr_models.ts`.

## Read actions (auto-allowed, 5)

| Action | What it does |
|---|---|
| `DescribeQuestionMarkAgentJob` | Describe question mark agent job |
| `GetOCRResult` | Get ocrresult<br>Required: `OCRToken` |
| `DescribeMarkEssayAgentJob` | Describe mark essay agent job |
| `DescribeExtractDocAgentJob` | Describe extract doc agent job |
| `GetOCRToken` | Get ocrtoken<br>Required: `Type` |
## Mutations (gated — need allowlist, 73)

| Action | What it does |
|---|---|
| `ImageEnhancement` | Image enhancement |
| `QuestionSplitOCR` | Run question split ocr |
| `RecognizeAgent` | Recognize agent |
| `EnterpriseLicenseOCR` | Enter prise license ocr |
| `BusinessCardOCR` | Run business card ocr |
| `IDCardOCR` | Run idcard ocr |
| `MLIDCardOCR` | Run mlidcard ocr |
| `VatInvoiceVerifyNew` | Run vat invoice verify new<br>Required: `InvoiceNo`, `InvoiceDate` |
| `QrcodeOCR` | Run qrcode ocr |
| `GeneralAccurateOCR` | Run general accurate ocr |
| `VerifyBizLicenseEnterprise4` | Verify biz license enterprise4<br>Required: `CreditCode`, `EntName`, `LrName`, `IdNum` |
| `RecognizeTableAccurateOCR` | Recognize table accurate ocr |
| `RecognizeEncryptedIDCardOCR` | Recognize encrypted idcard ocr<br>Required: `EncryptedBody`, `Encryption` |
| `MixedInvoiceDetect` | Run mixed invoice detect<br>Required: `ReturnImage` |
| `VinOCR` | Run vin ocr |
| `RecognizeStoreName` | Recognize store name |
| `MLIDPassportOCR` | Run mlidpassport ocr |
| `SubmitMarkEssayAgentJob` | Submit mark essay agent job |
| `GeneralFastOCR` | Run general fast ocr |
| `RecognizeValidIDCardOCR` | Recognize valid idcard ocr |
| `BizLicenseOCR` | Run biz license ocr |
| `GeneralHandwritingOCR` | Run general handwriting ocr |
| `QuestionOCR` | Run question ocr |
| `ExtractDocBasic` | Run extract doc basic |
| `SubmitExtractDocAgentJob` | Submit extract doc agent job |
| `TrainTicketOCR` | Run train ticket ocr |
| `HKIDCardOCR` | Run hkidcard ocr |
| `VerifyScenePhoto` | Verify scene photo<br>Required: `Scene` |
| `VatInvoiceOCR` | Run vat invoice ocr |
| `ExtractDocAgent` | Run extract doc agent |
| `RecognizeGeneralCardWarn` | Recognize general card warn |
| `VerifyOfdVatInvoiceOCR` | Verify ofd vat invoice ocr |
| `WaybillOCR` | Run waybill ocr |
| `GeneralBasicOCR` | Run general basic ocr |
| `PermitOCR` | Run permit ocr |
| `RecognizeTableOCR` | Recognize table ocr |
| `HandwritingEssayOCR` | Run handwriting essay ocr |
| `TextDetect` | Run text detect |
| `SmartStructuralOCR` | Run smart structural ocr |
| `SubmitQuestionMarkAgentJob` | Submit question mark agent job |
| `VehicleLicenseOCR` | Run vehicle license ocr |
| `TableOCR` | Run table ocr |
| `RideHailingDriverLicenseOCR` | Run ride hailing driver license ocr |
| `ArithmeticOCR` | Run arithmetic ocr |
| `LicensePlateOCR` | License plate ocr |
| `EstateCertOCR` | Run estate cert ocr |
| `ClassifyDetectOCR` | Classify detect ocr |
| `ExtractDocMulti` | Run extract doc multi |
| `SealOCR` | Run seal ocr |
| `MultimodalDocParse` | Run multimodal doc parse<br>Required: `FileUrl`, `FileType` |
| `ClassifyStoreName` | Classify store name |
| `BankSlipOCR` | Run bank slip ocr |
| `GeneralEfficientOCR` | Run general efficient ocr |
| `AdvertiseOCR` | Advertise ocr |
| `VehicleRegCertOCR` | Run vehicle reg cert ocr |
| `QuestionSplitLayoutOCR` | Run question split layout ocr |
| `RecognizeMedicalInvoiceOCR` | Recognize medical invoice ocr |
| `EnglishOCR` | Run english ocr |
| `ResidenceBookletOCR` | Run residence booklet ocr |
| `BankCardOCR` | Run bank card ocr |
| `CarInvoiceOCR` | Run car invoice ocr |
| `DriverLicenseOCR` | Run driver license ocr |
| `MainlandPermitOCR` | Run mainland permit ocr |
| `EraseHandwrittenImageOCR` | Run erase handwritten image ocr |
| `PassportOCR` | Run passport ocr |
| `VerifyGeneralCardWarn` | Verify general card warn<br>Required: `CardType` |
| `VerifyBizLicenseEnterprise3` | Verify biz license enterprise3<br>Required: `CreditCode`, `EntName` |
| `MixedInvoiceOCR` | Run mixed invoice ocr |
| `CropEnhanceImageOCR` | Run crop enhance image ocr |
| `RideHailingTransportLicenseOCR` | Run ride hailing transport license ocr |
| `RecognizeThaiIDCardOCR` | Recognize thai idcard ocr |
| `RecognizeGeneralInvoice` | Recognize general invoice |
| `RecognizeFormulaOCR` | Recognize formula ocr |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ocr`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20181119` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ocr"`) for the allow/block decision and reason.

---
name: tencent-kms
description: Tencent Cloud KMS via the Tencent MCP server — 69 actions in API version v20190118 (21 read-only auto-allowed). Use for white, keys, decrypt, asymmetric, crypto, deletion. Triggers on mentions of kms, white, keys, decrypt, asymmetric, crypto, deletion, encrypt, post. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud KMS

Security & identity: 69 actions in API version `v20190118` — 21 read-only (auto-allowed), 43 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "kms"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/kms/v20190118 — action signatures in `kms_client.ts`, full request/response shapes in `kms_models.ts`.

## Read actions (auto-allowed, 21)

| Action | What it does |
|---|---|
| `ListDataKeys` | List data keys |
| `DescribeDataKey` | Describe data key<br>Required: `DataKeyId` |
| `GetPublicKey` | Get public key<br>Required: `KeyId` |
| `GetServiceStatus` | Get service status |
| `GetDataKeyPlaintext` | Get data key plaintext<br>Required: `DataKeyId` |
| `GetKeyRotationStatus` | Get key rotation status<br>Required: `KeyId` |
| `DescribeWhiteBoxKeyDetails` | Describe white box key details |
| `ListAlgorithms` | List algorithms |
| `DescribeKey` | Describe key<br>Required: `KeyId` |
| `ListKeys` | List keys |
| `GetDataKeyCiphertextBlob` | Get data key ciphertext blob<br>Required: `DataKeyId` |
| `DescribeWhiteBoxKey` | Describe white box key<br>Required: `KeyId` |
| `GetParametersForImport` | Get parameters for import<br>Required: `KeyId`, `WrappingAlgorithm`, `WrappingKeySpec` |
| `DescribeDataKeys` | Describe data keys<br>Required: `DataKeyIds` |
| `ListKeyDetail` | List key detail |
| `DescribeWhiteBoxDeviceFingerprints` | Describe white box device fingerprints<br>Required: `KeyId` |
| `DescribeKeys` | Describe keys<br>Required: `KeyIds` |
| `DescribeWhiteBoxServiceStatus` | Describe white box service status |
| `DescribeWhiteBoxDecryptKey` | Describe white box decrypt key<br>Required: `KeyId` |
| `GetRegions` | Get regions |
| `ListDataKeyDetail` | List data key detail |
## Mutations (gated — need allowlist, 43)

| Action | What it does |
|---|---|
| `PostQuantumCryptoVerify` | Run post quantum crypto verify<br>Required: `KeyId`, `SignatureValue`, `Message` |
| `Encrypt` | Run encrypt<br>Required: `KeyId`, `Plaintext` |
| `Decrypt` | Run decrypt<br>Required: `CiphertextBlob` |
| `UpdateAlias` | Update alias<br>Required: `Alias`, `KeyId` |
| `ImportKeyMaterial` | Import key material<br>Required: `EncryptedKeyMaterial`, `ImportToken`, `KeyId` |
| `DisableKey` | Disable key<br>Required: `KeyId` |
| `GenerateDataKey` | Generate data key<br>Required: `KeyId` |
| `AsymmetricSm2Decrypt` | Run asymmetric sm2 decrypt<br>Required: `KeyId`, `Ciphertext` |
| `PostQuantumCryptoEncrypt` | Run post quantum crypto encrypt<br>Required: `KeyId`, `PlainText` |
| `ScheduleDataKeyDeletion` | Run schedule data key deletion<br>Required: `DataKeyId`, `PendingWindowInDays` |
| `BindCloudResource` | Bind cloud resource<br>Required: `KeyId`, `ProductId`, `ResourceId` |
| `OverwriteWhiteBoxDeviceFingerprints` | Run overwrite white box device fingerprints<br>Required: `KeyId` |
| `ArchiveKey` | Archive key<br>Required: `KeyId` |
| `UpdateDataKeyDescription` | Update data key description<br>Required: `DataKeyId`, `Description` |
| `UpdateDataKeyName` | Update data key name<br>Required: `DataKeyId`, `DataKeyName` |
| `SignByAsymmetricKey` | Sign by asymmetric key<br>Required: `Algorithm`, `Message`, `KeyId` |
| `DisableKeys` | Disable keys<br>Required: `KeyIds` |
| `ReEncrypt` | Run re encrypt<br>Required: `CiphertextBlob` |
| `EnableWhiteBoxKeys` | Enable white box keys<br>Required: `KeyIds` |
| `GenerateRandom` | Generate random<br>Required: `NumberOfBytes` |
| `PostQuantumCryptoDecrypt` | Run post quantum crypto decrypt<br>Required: `CiphertextBlob` |
| `VerifyByAsymmetricKey` | Verify by asymmetric key<br>Required: `KeyId`, `SignatureValue`, `Message`, `Algorithm` |
| `EnableDataKeys` | Enable data keys<br>Required: `DataKeyIds` |
| `ImportDataKey` | Import data key<br>Required: `DataKeyName`, `ImportKeyMaterial`, `ImportType` |
| `CreateKey` | Create key<br>Required: `Alias` |
| `EncryptByWhiteBox` | Run encrypt by white box<br>Required: `KeyId`, `PlainText` |
| `DisableWhiteBoxKeys` | Disable white box keys<br>Required: `KeyIds` |
| `DisableDataKey` | Disable data key<br>Required: `DataKeyId` |
| `DisableKeyRotation` | Disable key rotation<br>Required: `KeyId` |
| `RotateKey` | Run rotate key<br>Required: `KeyId` |
| `DisableWhiteBoxKey` | Disable white box key<br>Required: `KeyId` |
| `EnableKeys` | Enable keys<br>Required: `KeyIds` |
| `ScheduleKeyDeletion` | Run schedule key deletion<br>Required: `KeyId`, `PendingWindowInDays` |
| `AsymmetricRsaDecrypt` | Run asymmetric rsa decrypt<br>Required: `KeyId`, `Ciphertext`, `Algorithm` |
| `UnbindCloudResource` | Unbind cloud resource<br>Required: `KeyId`, `ProductId`, `ResourceId` |
| `EnableKeyRotation` | Enable key rotation<br>Required: `KeyId` |
| `CreateWhiteBoxKey` | Create white box key<br>Required: `Alias`, `Algorithm` (AES_256 | SM4) |
| `EnableDataKey` | Enable data key<br>Required: `DataKeyId` |
| `EnableWhiteBoxKey` | Enable white box key<br>Required: `KeyId` |
| `EnableKey` | Enable key<br>Required: `KeyId` |
| `UpdateKeyDescription` | Update key description<br>Required: `Description`, `KeyId` |
| `PostQuantumCryptoSign` | Run post quantum crypto sign<br>Required: `Message`, `KeyId` |
| `DisableDataKeys` | Disable data keys<br>Required: `DataKeyIds` |

## Blocked destructive actions (5)

`DeleteWhiteBoxKey`, `CancelKeyDeletion`, `CancelDataKeyDeletion`, `DeleteImportedKeyMaterial`, `CancelKeyArchive` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `kms`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190118` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="kms"`) for the allow/block decision and reason.

---
name: tencent-ssl
description: Tencent Cloud SSL via the Tencent MCP server — 68 actions in API version v20191205 (34 read-only auto-allowed). Use for certificate, host, upload, update, deploy, certificates. Triggers on mentions of ssl, certificate, host, upload, update, deploy, certificates, manager, submit. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud SSL

Security & identity: 68 actions in API version `v20191205` — 34 read-only (auto-allowed), 25 gated mutations, 9 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ssl"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ssl/v20191205 — action signatures in `ssl_client.ts`, full request/response shapes in `ssl_models.ts`.

## Read actions (auto-allowed, 34)

| Action | What it does |
|---|---|
| `DescribeHostCosInstanceList` | Describe host cos instance list |
| `DescribeCertificates` | Describe certificates |
| `DescribeHostCdnInstanceList` | Describe host cdn instance list |
| `DescribeHostTkeInstanceList` | Describe host tke instance list |
| `DescribeHostUpdateRecord` | Describe host update record |
| `DescribeHostDeployRecord` | Describe host deploy record<br>Required: `CertificateId` |
| `DescribeHostUploadUpdateRecord` | Describe host upload update record |
| `DescribeDownloadCertificateUrl` | Describe download certificate url<br>Required: `CertificateId` |
| `DescribePackages` | Describe packages |
| `DescribeHostDdosInstanceList` | Describe host ddos instance list |
| `DescribeHostClbInstanceList` | Describe host clb instance list |
| `DescribeHostTeoInstanceList` | Describe host teo instance list |
| `DownloadCertificate` | Download certificate<br>Required: `CertificateId` |
| `CheckCertificateChain` | Check certificate chain<br>Required: `CertificateChain` |
| `DescribeCompanies` | Describe companies |
| `DescribeCertificateDetail` | Describe certificate detail<br>Required: `CertificateId` |
| `DescribeHostVodInstanceList` | Describe host vod instance list |
| `DescribeHostLiveInstanceList` | Describe host live instance list |
| `DescribeHostWafInstanceList` | Describe host waf instance list |
| `DescribeManagerDetail` | Describe manager detail<br>Required: `ManagerId` |
| `DescribeHostDeployRecordDetail` | Describe host deploy record detail<br>Required: `DeployRecordId` |
| `DescribeCertificateBindResourceTaskResult` | Describe certificate bind resource task result<br>Required: `TaskIds` |
| `CheckCertificateDomainVerification` | Check certificate domain verification<br>Required: `CertificateId` |
| `CheckCertificateExist` | Check certificate exist<br>Required: `CertificatePublicKey` |
| `DescribeHostUploadUpdateRecordDetail` | Describe host upload update record detail<br>Required: `DeployRecordId` |
| `DescribeCertificate` | Describe certificate<br>Required: `CertificateId` |
| `DescribeDeployedResources` | Describe deployed resources<br>Required: `CertificateIds`, `ResourceType` |
| `DescribeHostLighthouseInstanceList` | Describe host lighthouse instance list |
| `DescribeHostUpdateRecordDetail` | Describe host update record detail<br>Required: `DeployRecordId` |
| `DescribeCertificateOperateLogs` | Describe certificate operate logs |
| `DescribeHostApiGatewayInstanceList` | Describe host api gateway instance list |
| `DescribeDeleteCertificatesTaskResult` | Describe delete certificates task result<br>Required: `TaskIds` |
| `DescribeManagers` | Describe managers<br>Required: `CompanyId` |
| `DescribeCertificateBindResourceTaskDetail` | Describe certificate bind resource task detail<br>Required: `TaskId` |
## Mutations (gated — need allowlist, 25)

| Action | What it does |
|---|---|
| `UploadUpdateCertificateRecordRetry` | Upload update certificate record retry |
| `UploadUpdateCertificateRecordRollback` | Upload update certificate record rollback<br>Required: `DeployRecordId` |
| `CertificateInfoSubmit` | Run certificate info submit<br>Required: `CertId`, `GenCsrType`, `CertCommonName`, `CompanyType` (1), `CompanyId` |
| `DeployCertificateInstance` | Deploy certificate instance<br>Required: `CertificateId`, `InstanceIdList` |
| `SubmitAuditManager` | Submit audit manager<br>Required: `ManagerId` |
| `SubmitCertificateInformation` | Submit certificate information<br>Required: `CertificateId` |
| `UpdateCertificateRecordRollback` | Update certificate record rollback |
| `UpdateCertificateRecordRetry` | Update certificate record retry |
| `VerifyManager` | Verify manager<br>Required: `ManagerId` |
| `CertificateOrderSubmit` | Run certificate order submit<br>Required: `CertId` |
| `CompleteCertificate` | Complete certificate<br>Required: `CertificateId` |
| `UploadUpdateCertificateInstance` | Upload update certificate instance<br>Required: `OldCertificateId`, `ResourceTypes`, `CertificatePublicKey`, `CertificatePrivateKey` |
| `UpdateCertificateInstance` | Update certificate instance<br>Required: `OldCertificateId`, `ResourceTypes` |
| `UploadCertificate` | Upload certificate<br>Required: `CertificatePublicKey` |
| `UploadRevokeLetter` | Upload revoke letter<br>Required: `CertificateId`, `RevokeLetter` |
| `DeployCertificateRecordRollback` | Deploy certificate record rollback |
| `DeployCertificateRecordRetry` | Deploy certificate record retry |
| `RevokeCertificate` | Revoke certificate<br>Required: `CertificateId` |
| `CreateCertificate` | Create certificate<br>Required: `ProductId`, `DomainNum`, `TimeSpan` |
| `UploadConfirmLetter` | Upload confirm letter<br>Required: `CertificateId`, `ConfirmLetter` |
| `CommitCertificateInformation` | Commit certificate information<br>Required: `CertificateId` |
| `CreateCertificateByPackage` | Create certificate by package<br>Required: `ProductPid`, `PackageIds`, `DomainCount`, `Period` |
| `CreateCertificateBindResourceSyncTask` | Create certificate bind resource sync task<br>Required: `CertificateIds`, `IsCache` (default 1) |
| `ReplaceCertificate` | Replace certificate<br>Required: `CertificateId`, `ValidType` |
| `ApplyCertificate` | Run apply certificate<br>Required: `DvAuthMethod`, `DomainName` |

## Blocked destructive actions (9)

`CancelAuditCertificate`, `DeleteManager`, `CancelCertificateOrder`, `DeleteCertificate`, `ModifyCertificateAlias`, `DeleteCertificates`, `ModifyCertificateProject`, `ModifyCertificatesExpiringNotificationSwitch`, `ModifyCertificateResubmit` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ssl`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20191205` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ssl"`) for the allow/block decision and reason.

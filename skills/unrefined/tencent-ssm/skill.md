---
name: tencent-ssm
description: Tencent Cloud SSM via the Tencent MCP server — 24 actions in API version v20190923 (11 read-only auto-allowed). Use for secret, rotation, value, pair, product, sshkey. Triggers on mentions of ssm, secret, rotation, value, pair, product, sshkey, version, async. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Security & identity
metadata:
  version: "4"
---

# Tencent Cloud SSM

Security & identity: 24 actions in API version `v20190923` — 11 read-only (auto-allowed), 11 gated mutations, 2 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ssm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Security changes have blast radius: key rotation, policy edits, and certificate replacement affect live traffic — stage changes and verify with read actions before and after.
Secrets and keys are write-once-visible: capture secret material at creation; afterwards only metadata is readable.
Policy documents are JSON strings, not objects — stringify before sending. Scope every grant to least privilege and re-audit with the matching list/describe actions after each mutation.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ssm/v20190923 — action signatures in `ssm_client.ts`, full request/response shapes in `ssm_models.ts`.

## Read actions (auto-allowed, 11)

| Action | What it does |
|---|---|
| `DescribeRotationHistory` | Describe rotation history<br>Required: `SecretName` |
| `ListSecrets` | List secrets |
| `DescribeSupportedProducts` | Describe supported products |
| `GetSecretValue` | Get secret value<br>Required: `SecretName`, `VersionId` |
| `DescribeAsyncRequestInfo` | Describe async request info<br>Required: `FlowID` |
| `DescribeSecret` | Describe secret<br>Required: `SecretName` |
| `DescribeRotationDetail` | Describe rotation detail<br>Required: `SecretName` |
| `GetSSHKeyPairValue` | Get sshkey pair value |
| `ListSecretVersionIds` | List secret version ids<br>Required: `SecretName` |
| `GetServiceStatus` | Get service status |
| `GetRegions` | Get regions |
## Mutations (gated — need allowlist, 11)

| Action | What it does |
|---|---|
| `RotateProductSecret` | Run rotate product secret<br>Required: `SecretName` |
| `UpdateSecret` | Update secret<br>Required: `SecretName`, `VersionId` |
| `CreateSSHKeyPairSecret` | Create sshkey pair secret<br>Required: `SecretName`, `ProjectId` |
| `UpdateRotationStatus` | Update rotation status<br>Required: `SecretName`, `EnableRotation` |
| `CreateProductSecret` | Create product secret<br>Required: `SecretName`, `UserNamePrefix`, `ProductName`, `InstanceID`, `Domains`, `PrivilegesList` |
| `UpdateDescription` | Update description<br>Required: `SecretName`, `Description` |
| `PutSecretValue` | Put secret value<br>Required: `SecretName`, `VersionId` |
| `CreateSecret` | Create secret<br>Required: `SecretName` |
| `EnableSecret` | Enable secret<br>Required: `SecretName` |
| `RestoreSecret` | Restore secret<br>Required: `SecretName` |
| `DisableSecret` | Disable secret<br>Required: `SecretName` |

## Blocked destructive actions (2)

`DeleteSecret`, `DeleteSecretVersion` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ssm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190923` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ssm"`) for the allow/block decision and reason.

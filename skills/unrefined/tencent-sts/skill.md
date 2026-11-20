---
name: tencent-sts
description: Verifies Tencent Cloud credentials and identity via STS (GetCallerIdentity, GetSessionToken, AssumeRole). Use before any other Tencent call to confirm which account/appId is active, or when debugging AuthFailure/credential errors. Triggers on mentions of STS, caller identity, SecretId, SessionToken, AssumeRole, auth failure, or "who am I". All STS actions are read-only and pass the safety policy automatically.
metadata:
  version: "1"
---

# Tencent Cloud STS

Identity verification for Tencent Cloud: confirm credentials, check which account is active, and mint temporary credentials. API version `v20180813`.

**Works best with** the Tencent MCP server — `get_caller_identity` for instant verification, `call_tencent_api` with `service: "sts"` for the rest. No CLI or console needed.

## Procedures

| User need | Do this |
|---|---|
| "Are my credentials working?" / "who am I?" | `get_caller_identity` — returns account/appId via `sts:GetCallerIdentity`. No params needed |
| Inspect raw STS response | `call_tencent_api` with `service: "sts"`, `action: "GetCallerIdentity"`, `params: {}` |
| Mint a temporary MFA-bound token | `call_tencent_api` with `action: "GetSessionToken"`, `params: {"SerialNumber": "qcs::cam::uin/<uin>::mfa/<type>", "TokenCode": "<6-digit>", "DurationSeconds": 7200}` — requires the user's MFA device; cannot mint without it |
| Cross-account / role assumption | `call_tencent_api` with `action: "AssumeRole"`, `params: {"RoleArn": "qcs::cam::uin/xxx:roleName/yyy", "RoleSessionName": "session-name"}` |
| Federated login (SAML / OIDC) | `AssumeRoleWithSAML` or `AssumeRoleWithWebIdentity` with provider ARN + assertion |
| Check an API key's status | `QueryApiKey` |

All 7 STS actions (`GetCallerIdentity`, `GetSessionToken`, `GetFederationToken`, `AssumeRole`, `AssumeRoleWithSAML`, `AssumeRoleWithWebIdentity`, `QueryApiKey`) start with allowlisted readonly prefixes — none require `TENCENT_MCP_ALLOW_MUTATIONS`.

## Mistakes to avoid

- **Do not invent credential values.** Credentials come only from `creds/credentials.json` (`TENCENT_MCP_CRED_FILE`), re-read by mtime. Env vars and `tccli` are disabled server-side.
- **`Token verification failed` means the SecretId/SecretKey (or STS token) is wrong or expired** — not a policy block. Fix the credentials file and re-run `get_caller_identity`; do not retry other services until this passes.
- `AssumeRole` needs the full role ARN format `qcs::cam::uin/<uin>:roleName/<name>` — a bare role name fails.
- STS is region-independent for identity, but always pass an explicit `region` (default `ap-singapore` from `get_metadata_context`) for consistency.

## Verify

- `get_caller_identity` returns an appId/uin — credentials are good for all other services.
- After `AssumeRole`/`GetSessionToken`, the response contains `Credentials` with `Token` — use all three fields together, never SecretId/SecretKey alone.

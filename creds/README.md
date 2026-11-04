# Credential file — ONLY supported auth method

This MCP server authenticates **only** via a mounted JSON file. Env vars (`TENCENTCLOUD_SECRET_ID/_KEY/_TOKEN`) and `~/.tccli` are **disabled**.

## Location

`TENCENT_MCP_CRED_FILE=/app/creds/credentials.json` (host: `creds/credentials.json`, mounted `ro`)

## Format

```json
{
  "secretId": "AKIDxxxx",
  "secretKey": "xxxxxxxx",
  "token": "short-lived STS token — optional, omit for long-lived keys"
}
```

Keys are case-insensitive: `secretId`/`SecretId`, `token`/`Token`/`SessionToken`/`securityToken` all work.

## Rotation (zero restart)

The file is re-read **every API call** (cached by `mtime`). Overwrite it atomically:

```bash
cat > creds/credentials.json <<'JSON'
{"secretId":"AKID...","secretKey":"...","token":"..."}
JSON
chmod 600 creds/credentials.json
```

Verify: `call get_caller_identity` via the MCP tool — new `SecretId` appears immediately. No `docker compose restart`.

## Errors

* `Missing credentials ... Reason: the credential file ... does not exist` → file was not visible to the server at the last read. Host file can also briefly disappear mid-edit (editors that save by atomic rename); retry once, and if it persists, restart the container — under Docker Desktop / WSL2 file-sharing, a restart re-syncs the bind mount.
* `Reason: ... exists but is not readable by the server process (EACCES)` → host file permission/ownership blocks the container user (`tencentmcp`, UID 1000). Make sure the host file is owned by the same UID you run the container with and set `chmod 600`.
* `Reason: ... is not valid JSON ... may be stale or truncated` → the container saw an incomplete write or a stale Docker-Desktop bind-mount snapshot. Rewrite the file (the `cat >` snippet above) and retry; restart if it persists.
* `Reason: ... lacks valid "secretId"` → JSON parses but is missing the `secretId`/`secretKey` keys (or the fallback key names).

Never commit `creds/credentials.json` — it is `.gitignored` / `.dockerignore`'d.

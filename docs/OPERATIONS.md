# Operations

## Health

The Compose health check verifies all three embedded services:

```bash
docker compose ps
curl -fsS http://127.0.0.1:8000/healthz
curl -fsS http://127.0.0.1:5000/api/health
```

Loki is internal to the container and is checked at
`http://127.0.0.1:3100/ready`.

## Logs and dashboards

Audit records are written to `/app/logs/audit.ndjson` with sensitive values
redacted. Application logs are written to `/app/logs/app.ndjson`. Both are
persisted by the `tencent_mcp_logs` volume and audit records are also shipped
to embedded Loki.

Grafana is available at `http://127.0.0.1:5000`. Change the default
administrator password before exposing it beyond localhost.

## Credential rotation

Replace `creds/credentials.json` atomically. The server rereads the credential
file by modification time, so short-lived credentials can be rotated without
restarting the container. Verify with the STS identity endpoint or
`get_caller_identity`.

## Approval operations

Mutating SQL returns an approval ID instead of executing. A human must inspect
the exact SQL and approve it through the authenticated approval endpoint.
Requests expire after five minutes and are single-use.

Keep the approval endpoint on a private network or behind a TLS reverse proxy.

## Configuration changes

Restart the container after changing environment variables or policy settings.

- **If you edited `.env` (e.g. `TENCENT_MCP_PROFILE`)**:
  ```bash
  docker compose up -d
  ```
  Docker Compose detects the environment variable change and recreates the container with the new configuration.

- **If you edited only a bind-mounted file (e.g. `config/mutation-profiles.json`)**:
  ```bash
  docker compose restart
  ```
  Since the container definition itself did not change, `restart` restarts the running process so it re-reads the configuration file on boot. (Alternatively, `docker compose up -d --force-recreate` recreates the container from scratch without rebuilding the image).

Metadata and skills are loaded dynamically. The MCP-managed knowledge volume
stores refined and unrefined notes separately.

## Troubleshooting

- If `/mcp/readme` cannot find its template, ensure `config/mcp-readme.md`
  exists or use the image fallback at `/app/config-baked/mcp-readme.md`.
- If Tencent calls fail with authorization errors, check CAM/IAM permissions
  after confirming the MCP policy allowed the action.
- If the container is unhealthy, inspect `docker compose logs tencent-mcp` and
  check MCP, Loki, and Grafana endpoints independently.

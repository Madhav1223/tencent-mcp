# Tencent MCP — Unified Tencent Cloud Gateway (Single Image)

**`mppnp/tencent-mcp:latest`** — one container, **260 Tencent Cloud services** (COS, CVM, TKE, CLS, CAM, STS, DLC, WeData, EMR, VPC, …) via `tencentcloud-sdk-nodejs` + `cos-nodejs-sdk-v5` as MCP tools. `linux/amd64` · `node:24-alpine` · `tencentmcp:1000` non-root · `MIT`.

> **Single-image:** `MCP :8000` + `Grafana :5000` + `Loki :3100` (internal, not host-exposed) with pre-provisioned dashboards — no separate `grafana/loki` compose needed.

---

## Pull & Run (30s)

````bash
docker pull mppnp/tencent-mcp:latest
mkdir tencent-mcp && cd tencent-mcp
# 1) create creds + config (file ONLY, env vars disabled)
mkdir -p creds config/skills
echo '{"secretId":"AKID...","secretKey":"...","token":"..."}' > creds/credentials.json && chmod 600 creds/credentials.json
cat > config/metadata.md <<'MD'
# Tencent MCP metadata
```json
{
  "defaults": {"region": "ap-singapore"},
  "wedata": {"project_id": "p-xxxx","workflow_id": "wf-xxxx","region": "ap-singapore"},
  "dlc": {"data_engine_name": "my-engine","database": "analytics","catalog": "DataLakeCatalog","region": "ap-singapore"}
}
````

MD

# 2) save compose.yml below as docker-compose.yml then:

docker compose up -d # healthz && loki/ready && grafana → healthy (~60s)
curl http://127.0.0.1:8000/ # endpoint index
curl http://127.0.0.1:8000/healthz # {"ok":true}
curl http://127.0.0.1:8000/sts # STS caller identity (also /health/sts, /healthz?sts=1)
curl http://127.0.0.1:8000/mcp/readme # agent cold-start briefing
open http://localhost:5000 # Grafana admin / change-me

````

**Without compose:**
```bash
docker run --rm -p 127.0.0.1:8000:8000 -p 127.0.0.1:5000:5000 \
  -v "$(pwd)/config:/app/config:ro" -v "$(pwd)/creds:/app/creds:ro" \
  -v tencent_mcp_logs:/app/logs -v tencent_mcp_skills:/app/skills \
  -e TENCENT_MCP_APPROVAL_USER=operator -e TENCENT_MCP_APPROVAL_PASSWORD=change-me \
  -e TENCENTCLOUD_REGION=ap-singapore --tmpfs /tmp:mode=1777,size=256m mppnp/tencent-mcp:latest
````

### `docker-compose.yml` (copy as is)

```yaml
name: tencent-mcp-single
services:
  tencent-mcp:
    image: mppnp/tencent-mcp:latest
    container_name: tencent-mcp
    restart: unless-stopped
    ports:
      - "127.0.0.1:8000:8000"
      - "127.0.0.1:5000:5000"
    environment:
      TENCENT_MCP_HTTP_PORT: "8000"
      TENCENT_MCP_HTTP_HOST: "0.0.0.0"
      TENCENT_MCP_HTTP_PATH: "/mcp"
      TENCENT_MCP_CRED_FILE: "/app/creds/credentials.json"
      TENCENT_MCP_METADATA_FILE: "/app/config/metadata.md"
      TENCENT_MCP_SKILLS_DIR: "/app/config/skills"
      TENCENT_MCP_KNOWLEDGE_DIR: "/app/skills"
      TENCENT_MCP_APPROVAL_USER: "operator"
      TENCENT_MCP_APPROVAL_PASSWORD: "change-me"
      TENCENTCLOUD_REGION: "ap-singapore"
      TENCENT_MCP_LOKI_ENDPOINT: "http://localhost:3100"
      TENCENT_MCP_AUDIT_FILE: "/app/logs/audit.ndjson"
      TENCENT_MCP_LOG_FILE: "/app/logs/app.ndjson"
      GF_SECURITY_ADMIN_USER: "admin"
      GF_SECURITY_ADMIN_PASSWORD: "change-me"
    volumes:
      - ./creds:/app/creds:ro
      - ./config:/app/config:ro
      - tencent_mcp_data:/var/lib/grafana
      - tencent_mcp_loki:/loki
      - tencent_mcp_logs:/app/logs
      - tencent_mcp_skills:/app/skills
    tmpfs:
      - /tmp:mode=1777,size=256m
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "wget -qO- http://127.0.0.1:8000/healthz | grep -q ok && wget -qO- http://127.0.0.1:3100/ready | grep -q ready && wget -qO- http://127.0.0.1:5000/api/health | grep -q ok || exit 1",
        ]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 60s
volumes:
  tencent_mcp_data:
  tencent_mcp_loki:
  tencent_mcp_logs:
  tencent_mcp_skills:
```

| Port   | Endpoint                                                | Purpose                                          |
| ------ | ------------------------------------------------------- | ------------------------------------------------ |
| `8000` | `http://localhost:8000/`                                | Index of all endpoints                           |
| `8000` | `http://localhost:8000/mcp`                             | MCP Streamable HTTP (`mcp-session-id`)           |
| `8000` | `http://localhost:8000/mcp/readme`                      | Agent readme (markdown/JSON)                     |
| `8000` | `http://localhost:8000/healthz`                         | Health (`ok, version, time`) + `?sts=1` adds STS |
| `8000` | `http://localhost:8000/sts`                             | STS `GetCallerIdentity` (also `/health/sts`)     |
| `8000` | `http://localhost:8000/approvals/:id`                   | Human approval for dangerous SQL (Basic auth)    |
| `5000` | `http://localhost:5000`                                 | Grafana (dashboards baked in)                    |
| `3100` | `http://localhost:3100` **internal** (`127.0.0.1 loki`) | Loki (not host-exposed)                          |

---

## MCP Clients

**OpenCode** (`opencode.json`): `{"mcp":{"tencent-mcp":{"type":"remote","url":"http://localhost:8000/mcp"}}}`
**Claude Code** (`~/.claude.json`): `{"mcpServers":{"tencent-mcp":{"type":"http","url":"http://localhost:8000/mcp"}}}`

Tools: `list_tencent_services`, `list_service_actions`, `call_tencent_api`, `get_caller_identity`, `get_audit_policy`, `get_metadata_context`, `run_dlc_sql`, `run_wedata_workflow`, `save_knowledge`, `list_knowledge`, `promote_knowledge`

Health: `GET /` → all endpoints brief (JSON or `text/html`), `GET /healthz`, `GET /sts` — all logged.

---

## Credentials — file ONLY (host-editable)

**Only `creds/credentials.json`** (`TENCENT_MCP_CRED_FILE=/app/creds/credentials.json`, `ro`, re-read by `mtime`, `chmod 600`, `.gitignored`). Env `TENCENTCLOUD_SECRET_ID` disabled.

```json
{ "secretId": "AKID...", "secretKey": "...", "token": "..." }
```

Rotate atomically — no restart, `get_caller_identity` reflects immediately. Container runs as `tencentmcp:1000` (matches host `1000`) + `chmod a+rw` loop so `vi` on host works even for files created via `save_knowledge`.

---

## Safety — deny-by-default, every request logged & policy-checked

Every call is checked against an active **mutation profile** before reaching Tencent Cloud. Profiles are defined in `config/mutation-profiles.json` (bind-mounted, user-editable). Two profiles are **baked into the image** and always available even without that file:

| Profile              | Mutations allowed                                                             |
| -------------------- | ----------------------------------------------------------------------------- |
| `default` _(active)_ | DLC SQL only — `dlc:CreateTask / CreateTaskSync / CreateSparkSessionBatchSQL` |
| `readonly`           | Zero mutations — read-only actions only                                       |

**Add your own profile** — no code change, no image rebuild:

```jsonc
// config/mutation-profiles.json
{
  "my-team": {
    "label": "My team — WeData authoring + COS writes",
    "allowedMutations": ["wedata:CreateWorkflow", "wedata:CreateTask", "cos:putObject"],
  },
}
```

Then set `TENCENT_MCP_PROFILE=my-team` and restart: `docker compose up -d --force-recreate`.

`Delete/Drop/Terminate/...` prefixes are always blocked unless explicitly allowlisted in the active profile.

Dangerous SQL (`INSERT/UPDATE/DELETE/DROP/ALTER/CREATE...`) is blocked — `SHOW CREATE TABLE` is **safe** (display-only). Requires `POST /approvals/:id {"approve":true}` with `TENCENT_MCP_APPROVAL_USER/PASSWORD`.

Every `MCP tool` + `HTTP` + `Tencent API` is `checkedCall` → `SafetyPolicy` → structured log → audit (`/app/logs/audit.ndjson` → Loki `job=tencent-mcp-audit`, secrets `[REDACTED]`).

---

## Knowledge Base — MCP manages itself

MCP persists lessons without host mount:

- `save_knowledge {title,content,status=refined|unrefined}` → `/app/skills/refined|unrefined/*.md` (`tencent_mcp_skills` volume, host-editable via `1000` + `664`)
- `list_knowledge`, `promote_knowledge` (unrefined → refined after validation)
- Auto-discovered in `GET /mcp/readme` alongside `config/skills/` (ro, single mount) + `skills/` (repo)

---

## Observability — Prebuilt Grafana

Every call → Loki `3100` internal (entrypoint waits for `ready`). Dashboards `Tencent MCP - Operations` (`tencent-mcp-audit`) + `Report` auto-provisioned (`http://loki:3100` via `127.0.0.1 loki`).

Explore: `{job="tencent-mcp-audit"}|json|service="wedata" outcome="error"` — volumes `/app/logs` fallback.

---

## Config

`config/metadata.md` — JSON-in-Markdown region/wedata/dlc defaults, hot-reloaded. `.env` for non-secret overrides, `TENCENT_MCP_KNOWLEDGE_DIR=/app/skills`.

Full env: `README.md` + `.env.example`. The readme template is generated
dynamically at `/mcp/readme`; it uses the mounted `/app/config/mcp-readme.md`
when present and falls back to the image copy at `/app/config-baked/mcp-readme.md`.
Image: `MIT`.

## Tags

- `latest` (current build from this repository)
- `0.2.0` (previous documented release)
- `0.1.1` (`c750a1dc`), `0.1.0` (`9615bea`)
- Pull: `docker pull mppnp/tencent-mcp:latest`

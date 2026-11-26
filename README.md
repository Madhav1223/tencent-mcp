# Tencent MCP Server

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
[![Security](SECURITY.md)](SECURITY.md)

Production-oriented Model Context Protocol (MCP) gateway for Tencent Cloud.
Tencent MCP exposes the installed Tencent Cloud SDK through one policy-checked,
audited MCP endpoint, with embedded Grafana and Loki observability.

## Architecture

```text
MCP client
    |
    | Streamable HTTP :8000/mcp
    v
Tencent MCP container
    |- MCP tools and Tencent SDK
    |- deny-by-default safety policy
    |- human approval API for mutating SQL
    |- audit JSONL + Loki :3100 (internal)
    `- Grafana :5000
    |
    v
Tencent Cloud APIs
```

The default deployment is a single Docker image:

- MCP endpoint: `http://127.0.0.1:8000/mcp`
- Health and administration endpoints: port `8000`
- Grafana dashboards: `http://127.0.0.1:5000`
- Loki: internal port `3100`, not host-published

See the [architecture and policy document](docs/CONFLUENCE_MCP_ARCHITECTURE.md)
for the component diagram, data flow, service/action rules, and approval
precedence.

## Capabilities

### Generic Tencent Cloud access

- `call_tencent_api` calls actions from the installed Tencent SDK.
- `list_tencent_services` discovers supported services.
- `list_service_actions` discovers versions and actions for a service.
- `get_caller_identity` validates the configured Tencent account through STS.

The current image exposes approximately 260 SDK service modules, including
COS, CVM, TKE, CLS, CAM, STS, DLC, WeData, EMR, VPC, and many others. The
runtime service list is authoritative because it follows the installed SDK.

### Platform workflows

- `run_dlc_sql` submits and monitors DLC SQL.
- `run_wedata_workflow` triggers and monitors WeData workflows and provides
  failure evidence and rule-based RCA.
- `get_metadata_context` exposes non-secret project defaults.

### Knowledge and governance

- `save_knowledge`, `list_knowledge`, and `promote_knowledge` manage refined
  and unrefined Markdown lessons in the MCP knowledge base.
- `get_audit_policy` shows active readonly prefixes, deny prefixes, and
  mutation allowlists.
- `GET /mcp/readme` returns a runtime-generated agent briefing containing
  current metadata and discovered skills.

## Security model

Every Tencent API call is evaluated before reaching the SDK:

1. Readonly action prefixes are allowed.
2. Dangerous deny prefixes are blocked.
3. Explicit `service:Action` or `service:*` mutation entries are allowed.
4. All other actions are blocked by default.

Deny prefixes override mutation allowlists. The only earlier rule is a
readonly-prefix match. Passing the MCP policy does not grant Tencent access;
the Tencent CAM/IAM policy must also authorize the action.

Mutating SQL is handled separately. It is held for authenticated human
approval using:

- `TENCENT_MCP_APPROVAL_USER`
- `TENCENT_MCP_APPROVAL_PASSWORD`

Approval requests expire after five minutes and can be consumed once.

Credentials are read only from the mounted
`creds/credentials.json` file. Do not put Tencent credentials in environment
variables, metadata, skills, images, or source control.

## Production deployment

### Prerequisites

- Docker Engine and Docker Compose
- Tencent Cloud credentials with the required CAM/IAM permissions
- A strong approval password for mutating SQL
- A strong Grafana administrator password

### Configure

```bash
git clone https://github.com/Madhav1223/tencent-mcp.git
cd tencent-mcp
cp .env.example .env
mkdir -p creds
chmod 700 creds
```

Create `creds/credentials.json` with the required Tencent credentials and
restrict it to the owner:

```json
{
  "secretId": "AKID...",
  "secretKey": "...",
  "token": "optional-short-lived-token"
}
```

```bash
chmod 600 creds/credentials.json
```

Set strong values in `.env` for approval and Grafana credentials. Configure
non-secret defaults in `config/metadata.md`. Never commit either credentials
or production passwords.

### Start

```bash
docker compose pull
docker compose up -d
docker compose ps
```

The container health check covers MCP, Loki, and Grafana. Verify the service:

```bash
curl -fsS http://127.0.0.1:8000/healthz
```

Connect an MCP client to:

```text
http://127.0.0.1:8000/mcp
```

The image is available from
[Docker Hub](https://hub.docker.com/r/mppnp/tencent-mcp) as
`mppnp/tencent-mcp:latest`. Use a versioned tag for controlled rollouts.

## Configuration surfaces

| Surface                  | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `creds/credentials.json` | Tencent SecretId, SecretKey, and optional STS token |
| `config/metadata.md`     | Non-secret region, WeData, and DLC defaults         |
| `config/skills/*.md`     | Operator-managed skills, mounted read-only          |
| `/app/skills` volume     | MCP-managed refined/unrefined knowledge             |
| `.env`                   | Runtime settings and policy overrides               |

Important policy variables:

```text
# Pick a profile (file-based or built-in; default = DLC SQL only)
TENCENT_MCP_PROFILE=default

# One-off override on top of the active profile (CSV)
TENCENT_MCP_ALLOW_MUTATIONS=service:Action,service:OtherAction
TENCENT_MCP_DENY_PREFIXES=Delete,Destroy,Terminate
TENCENT_MCP_APPROVAL_USER=operator
TENCENT_MCP_APPROVAL_PASSWORD=<strong-secret>
```

Profiles are defined in [`config/mutation-profiles.json`](config/mutation-profiles.json)
(bind-mounted, user-editable). Two profiles are always available without the file:
`default` (DLC SQL only) and `readonly` (zero mutations).
Add your own profile to the JSON, set `TENCENT_MCP_PROFILE=<name>`, and restart.

See [POLICY_AND_PERMISSIONS.md](docs/POLICY_AND_PERMISSIONS.md) for the full
policy reference and [`.env.example`](.env.example) for available settings.

## Operations and documentation

- [Operations guide](docs/OPERATIONS.md): health, logs, Grafana, credential
  rotation, approvals, and troubleshooting.
- [Development guide](docs/DEVELOPMENT.md): local setup, tests, linting, and
  image validation.
- [Release guide](docs/RELEASE.md): CI/CD, Docker Hub, GHCR, tags, and release
  verification.
- [Docker Hub overview](DOCKERHUB_OVERVIEW.md): copy-paste deployment reference.
- [Credentials guide](creds/README.md): credential-file requirements.
- [Security policy](SECURITY.md): vulnerability reporting.

## License

MIT

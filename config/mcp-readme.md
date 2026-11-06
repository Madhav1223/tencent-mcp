# Tencent MCP — Agent Readme

> **Endpoint** `{{BASE_PATH}}` on port `{{PORT}}` • **Grafana** on `:5000` (single image, two ports) • **Health** `/healthz`

## MCP initialization

This server uses Streamable HTTP and requires an initialization handshake before tool calls. If a request returns `Server not initialized`:

1. Send an `initialize` request first:

```bash
curl -i -X POST http://localhost:8000{{BASE_PATH}} \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05"},"id":1}'
```

2. Read the `mcp-session-id` response header.
3. Include that `mcp-session-id` header in all subsequent requests.
4. Call tools with a `tools/call` JSON-RPC request using that session header.

The MCP SDK transport manages the handshake for clients that support Streamable HTTP. The manual sequence above is useful for curl and troubleshooting.

## What is this MCP?

Unified Tencent Cloud MCP gateway — one server, 256 Tencent Cloud services via `tencentcloud-sdk-nodejs` + COS. Dense safety policy, audit, and DLC/WeData helpers.

## What can it do

| Tool                    | Purpose                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `list_tencent_services` | List 256 services (cos, cvm, tke, cls, cam, sts…)                           |
| `list_service_actions`  | Versions + actions for a service (optional `version` pin)                   |
| `get_caller_identity`   | STS GetCallerIdentity — verify creds                                        |
| `call_tencent_api`      | Call any Tencent API (deny-by-default policy; optional `version` pin)       |
| `run_dlc_sql`           | DLC Data Lake Compute SQL — SELECT/SHOW auto, mutating needs human approval |
| `run_wedata_workflow`   | Trigger/monitor WeData workflow + RCA on failure                            |
| `get_audit_policy`      | Show readonly/deny prefixes + allowlist                                     |
| `get_metadata_context`  | Show loaded `config/metadata.md` defaults                                   |
| `save_knowledge`        | Persist a lesson to `/app/skills/{refined,unrefined}/` (knowledge base)     |
| `list_knowledge`        | List refined/unrefined knowledge notes                                      |
| `promote_knowledge`     | Promote an unrefined note to refined                                        |

## What can be done — example flows

```json
{"tool":"list_tencent_services"}
{"tool":"call_tencent_api","service":"cvm","action":"DescribeInstances","params":{"Limit":10},"region":"ap-singapore"}
{"tool":"call_tencent_api","service":"wedata","action":"CreateTaskNew","version":"2021-08-20","params":{"ProjectId":"p-xxxx","WorkflowId":"wf-xxxx","TaskName":"my_task","TaskType":31,"Content":"<base64>"},"region":"ap-singapore"}
{"tool":"run_dlc_sql","sql":"SELECT * FROM analytics.sales LIMIT 20","database":"analytics"}
{"tool":"run_wedata_workflow","mode":"run","workflow_id":"wf-xxxx"}
```

By default every call targets the **newest installed SDK version** of the service. Pass `version` on `call_tencent_api`/`list_service_actions` to pin an older one (e.g. `2021-08-20` for wedata's legacy v2021 API, needed for project/workflow authoring in workflow-scheduling-mode projects). Versions are accepted with or without a leading `v` and validated against the SDK installed in the image.

## How to configure — cold start avoidance

**Cold start = agent asks for region/workflow/database on first call.** Avoid by pre-filling `config/metadata.md` and warming `GET /mcp/readme` at startup.

1. **Metadata (non-secret, reloaded on change):** `config/metadata.md`

```json
{
  "defaults": { "region": "ap-singapore" },
  "wedata": { "project_id": "p-xxxx", "workflow_id": "wf-xxxx", "region": "ap-singapore" },
  "dlc": {
    "data_engine_name": "my-engine",
    "database": "analytics",
    "catalog": "DataLakeCatalog",
    "region": "ap-singapore"
  }
}
```

Tool args override metadata. Verify via `get_metadata_context`.

2. **Credentials (file only, never env):** `creds/credentials.json` → `/app/creds/credentials.json` (ro, `chmod 600`)

```json
{ "secretId": "AKID...", "secretKey": "...", "token": "optional STS token" }
```

Rotate atomically — no restart. Verify via `get_caller_identity`. Env creds are DISABLED.

3. **Human approval for mutating SQL:** `.env` `TENCENT_MCP_APPROVAL_USER/PASSWORD` → `POST /approvals/:id` with Basic auth `{"approve":true}`.

4. **Skills — project knowledge for agents (MCP-managed):**
   Place `.md` files in `config/skills/` (same volume as `metadata.md`) **or** `skills/` (repo-tracked). **Or let the MCP manage it:** use `save_knowledge` (`refined` for validated hit-and-trial lessons, `unrefined` for raw notes) → files land in `/app/skills/refined|unrefined/` (writable named volume `tencent_mcp_skills`, survives restarts), `list_knowledge` to browse, `promote_knowledge` to validate. Auto-discovered here and via `list_knowledge`.
   Runtime merges `config/skills` + `skills/` + `/app/skills/{refined,unrefined}`, `config/skills` wins. Loaded without restart.

Current metadata:

```json
{{METADATA}}
```

Current skills ({{SKILLS_COUNT}}):
{{SKILLS_SECTION}}

## Skills — where to keep them?

- **`config/skills/` — RECOMMENDED for single-image users.** Same `/app/config` bind mount as `metadata.md`. No extra volume, survives `docker pull`, no compose juggling. Ideal for operator-private, env-specific playbooks (cost, runbooks, SOPs).
- **`skills/` in repo — good for shared, versioned skills.** Commit to git, shared across team, baked into image at build if you `COPY skills`. Needs either bake-in or extra mount.
- **Best practice:** Keep shared templates in repo `skills/`, env-specific overrides in `config/skills/`. Runtime merges, config wins.

## Cold start checklist (agent: do this first)

1. `GET {{BASE_PATH}}/readme` (this file) — know tools/policy.
2. `get_metadata_context` + `get_caller_identity` — confirm region/creds; if missing, prompt once with exact file paths.
3. `list_tencent_services` warmup — populate tool cache.
4. Then execute user intent — metadata fills missing region/workflow/database.

## Endpoints

- MCP: `POST {{BASE_PATH}}` (Streamable HTTP, `mcp-session-id`, SSE)
- Readme: `GET {{BASE_PATH}}/readme` / `GET /mcp/readme` (this doc, `text/markdown`)
- Health: `GET /healthz` (basic), `GET /healthz?sts=1` (health + STS identity), `GET /sts` / `GET /health/sts` (STS caller identity, policy-checked + audited)
- Approvals: `GET|POST /approvals/:id` (Basic auth)

## Safety

Deny-by-default — only `Describe/Get/List/Query/Check` prefixes + explicit allowlist (`TENCENT_MCP_ALLOW_MUTATIONS`) pass. Dangerous SQL blocked → approval. All calls audited (Loki + Grafana `:5000`).

## Ports (single image)

- `8000` — MCP (`{{BASE_PATH}}`)
- `5000` — Grafana (dashboards pre-provisioned, Loki `localhost:3100`)
- Loki `:3100` internal only

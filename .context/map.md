# Map

Where things live. Use this to find the right file fast.

## Source (`src/`)

| File           | Responsibility                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`     | Entry point. Builds the `Server`, registers all MCP tools, wires transports, runs the main loop.                                                      |
| `http.ts`      | Streamable HTTP transport on top of `@modelcontextprotocol/sdk`. Serves `/mcp`, `/mcp/readme`, `/healthz`, `/approvals/*`.                            |
| `sdk.ts`       | Adapter for `tencentcloud-sdk-nodejs` and `cos-nodejs-sdk-v5`. Resolves credentials from file, lists services, calls APIs.                            |
| `policy.ts`    | **Deny-by-default safety policy** (`SafetyPolicy.decide`). Three buckets: readonly prefixes, dangerous prefixes, explicit `service:Action` allowlist. |
| `guard.ts`     | Combines `policy` + `approval` + `audit`. The single gateway every API call passes through.                                                           |
| `approval.ts`  | Human approval flow for destructive SQL. Basic-auth gate with rotating nonce; credentials from env.                                                   |
| `sqlguard.ts`  | SQL classification (SELECT/SHOW/DESCRIBE/etc. vs. DDL/DML/DCL).                                                                                       |
| `audit.ts`     | JSON-line audit logger (file + Loki + optional ES). Every accepted call lands here.                                                                   |
| `log.ts`       | `LogShipper` — JSON-line application logger (file + Loki + optional Logstash TCP + console).                                                          |
| `wedata.ts`    | WeData (Wedata) workflow runner with rule-based Root Cause Analysis.                                                                                  |
| `knowledge.ts` | Refined/unrefined knowledge base (`save_knowledge`, `list_knowledge`, `promote_knowledge`).                                                           |
| `skills.ts`    | Skills discovery and merging (config/skills + skills/ + named volume).                                                                                |
| `metadata.ts`  | Loads `metadata.md` for stable project context.                                                                                                       |
| `http.ts`      | Streamable HTTP transport.                                                                                                                            |

## Tests (`test/`)

| File           | Notes                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `unit.ts`      | Pure unit tests. Real temp dirs + real loopback HTTP. No network, no credentials.                         |
| `core.test.ts` | Core behavior tests (tool registration, transport).                                                       |
| `smoke.ts`     | Optional integration test — needs real Tencent credentials. Run separately as `npm run test:integration`. |

## Config (`config/`)

| File            | Notes                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `metadata.md`   | Stable per-project context (region, project IDs, engine names). **No secrets.**                                |
| `mcp-readme.md` | Template for `GET /mcp/readme` — runtime replaces `{{BASE_PATH}}`, `{{PORT}}`, `{{METADATA}}`, `{{SKILLS_*}}`. |
| `skills/*.md`   | Repo-tracked skills, merged at runtime and injected into `/mcp/readme`.                                        |

## Docker (`docker/`)

| File                    | Notes                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `Dockerfile`            | Multi-stage build → runtime. Non-root `tencentmcp:1000`, `tini`, OCI labels, `HEALTHCHECK`. |
| `.dockerignore`         | Excludes node_modules, .git, .env, creds, dist, coverage, logs.                             |
| `entrypoint.sh`         | Seeds baked skills into the named volume, waits for Loki, starts Grafana + MCP.             |
| `grafana/provisioning/` | Pre-baked datasources + dashboards.                                                         |
| `loki/loki-config.yaml` | Embedded Loki config.                                                                       |
| `docker-compose.yml`    | Single-service stack: `mppnp/tencent-mcp:latest`, ports 8000 + 5000 bound to `127.0.0.1`.   |

## CI (`.github/`)

| File                       | Notes                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `workflows/ci.yml`         | Quality gate + gitleaks + Trivy on every push and PR.                                  |
| `workflows/release.yml`    | GHCR publish on tag push `v*.*.*`.                                                     |
| `dependabot.yml`           | Weekly npm updates, monthly GitHub Actions updates.                                    |
| `ISSUE_TEMPLATE/`          | Bug report, feature request, `blank_issues_enabled: false`.                            |
| `PULL_REQUEST_TEMPLATE.md` | Includes `npm run check` verification.                                                 |
| `CONTRIBUTING.md`          | `npm run check`, TDD, integration test, security.                                      |
| `CODEOWNERS` _(new)_       | Required review for `Dockerfile`, `docker/`, `release.yml`, and policy/guard/approval. |

## Top-level

| File                             | Notes                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `README.md`                      | User-facing quick start. **No `YOUR_ORG` placeholders anymore** — uses `mppnp/tencent-mcp`. |
| `DOCKERHUB_OVERVIEW.md`          | Long-form description for the Docker Hub page.                                              |
| `docs/POLICY_AND_PERMISSIONS.md` | Detailed policy explanation, decision order, override keys.                                 |
| `LICENSE`                        | MIT, 2026.                                                                                  |
| `CHANGELOG.md`                   | Keep-a-Changelog format.                                                                    |
| `.context/goal.md`               | What we're building.                                                                        |
| `.context/summary.md`            | Architecture one-pager.                                                                     |
| `.context/map.md`                | This file.                                                                                  |
| `.editorconfig`                  | 2-space, LF, final newline.                                                                 |
| `.nvmrc`                         | `24.21.0`.                                                                                  |
| `.env.example`                   | Env var template — no real secrets.                                                         |
| `creds/credentials.json`         | Real Tencent credentials. **Git-ignored, docker-ignored, mounted `ro` at runtime.**         |

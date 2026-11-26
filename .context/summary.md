# Summary

## What this is

A **Model Context Protocol (MCP) server** for **Tencent Cloud** that wraps the
official `tencentcloud-sdk-nodejs` and `cos-nodejs-sdk-v5` SDKs as MCP tools,
distributed as a single Docker image (`mppnp/tencent-mcp`).

## Tech stack

- **Runtime:** Node.js 24.x (Alpine).
- **Language:** TypeScript (`strict: true`, ESM, NodeNext).
- **SDKs:** `@modelcontextprotocol/sdk@^1.30.0`,
  `tencentcloud-sdk-nodejs@^4.1.297`, `cos-nodejs-sdk-v5@^3.0.0`.
- **Web framework:** Hono (HTTP transport).
- **Lint/format:** ESLint 9 + `typescript-eslint`, Prettier 3.
- **Tests:** Node's built-in `node:test` + `c8` for coverage (gates:
  30% lines / 55% functions / 60% branches).
- **Observability:** Custom `LogShipper` + `AuditLogger` writing JSON lines to
  file, Loki push, and Logstash TCP. Embedded Grafana + Loki in the same
  image.
- **Container:** Multi-stage Dockerfile (build → runtime), non-root
  `tencentmcp:1000`, `tini` init, OCI labels, `HEALTHCHECK`.
- **CI:** GitHub Actions — `ci.yml` (quality gate + gitleaks + Trivy),
  `release.yml` (GHCR publish on tag push), Dependabot weekly.

## Architecture (one-paragraph mental model)

The MCP server speaks both **stdio** (for `tencent-mcp` CLI clients) and
**Streamable HTTP** at `/mcp` (for HTTP clients) via the `@modelcontextprotocol/sdk`.
Every tool call passes through `src/policy.ts::SafetyPolicy.decide()`, which
implements **deny-by-default** with three buckets: readonly prefixes
(`Describe`/`Get`/`List`/...), dangerous prefixes (`Delete`/`Destroy`/...),
and an explicit `service:Action` allowlist. The same call is also classified
by `src/sqlguard.ts` when running DLC SQL — destructive statements require
authenticated human approval via `src/approval.ts`. Every accepted call is
recorded by `src/audit.ts` to file, Loki, and (optionally) Elasticsearch;
every log line is shipped by `src/log.ts::LogShipper`.

## Design patterns in use

- **Strategy** — `SafetyPolicy` loads profiles from **`config/mutation-profiles.json`** (user-editable JSON, bind-mounted ro). `TENCENT_MCP_PROFILE` selects the active profile by key name. Env-var overrides (`TENCENT_MCP_*_PREFIXES`, `TENCENT_MCP_ALLOW_MUTATIONS`) win on top of the profile for one-off fine-tuning.
- **Adapter** — `tencentcloud-sdk-nodejs` and `cos-nodejs-sdk-v5` are wrapped
  behind `src/sdk.ts`.
- **Composition root** — `src/index.ts` (entrypoint) wires the
  `Server` + transports + `LogShipper` + `AuditLogger` together.
- **TDD** — `test/unit.ts` and `test/core.test.ts` are deterministic, no
  network or credentials. `test/smoke.ts` is the optional integration test.

## Non-negotiables

- **Credentials are file-only.** `creds/credentials.json` is the only auth
  source. `TENCENTCLOUD_SECRET_ID/_KEY/_TOKEN` env vars and `~/.tccli` are
  disabled. The file is `.gitignore`d / `.dockerignore`d and mounted `ro`.
- **Deny-by-default policy.** Every call is classified before reaching
  Tencent. PRs that weaken approval, audit, or deny-by-default controls are
  rejected per `SECURITY.md`.
- **Single-image deployment.** No docker-compose juggling for the
  observability stack.

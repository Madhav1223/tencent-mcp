# Goal

## Overarching objective

Ship a single, opinionated, **MIT-licensed** open-source **Model Context Protocol
(MCP) server** for **Tencent Cloud** that exposes the entire Tencent Cloud SDK
as MCP tools behind a **deny-by-default safety policy**, packaged as a single
Docker image that runs anywhere.

## Current milestone (0.2.x → 0.3.0)

- **Harden for public release.** Remove placeholder URLs, add standard open-
  source scaffolding (`CHANGELOG`, `.editorconfig`, `.nvmrc`, `.context/`,
  `CODEOWNERS`), and document the governance model.
- **Maintain code quality.** The CI gate (`npm run check`) runs
  `format:check`, `lint`, `typecheck`, `test:coverage`, `audit:prod`,
  gitleaks, `docker build`, and Trivy on every push and PR.
- **Keep the threat model honest.** Default-deny policy, credential file
  isolation (env vars disabled), audit log, approval flow for destructive
  SQL, host-editable file ownership.
- **Stay single-image.** MCP `:8000` + Grafana `:5000` + Loki `:3100`
  internal, with pre-provisioned dashboards.

## Immediate scope (this session)

1. Apply audit findings: README placeholders, missing standard files, CODEOWNERS,
   SPDX headers, entrypoint password warning, registry documentation,
   policy-doc link, credentials hardening.
2. Spawn a **dedicated customer agent** that learns the MCP end-to-end
   (source, config, SDK, docs) and becomes the canonical reference for
   downstream consumers.

## Out of scope (for now)

- Replacing the SDK `any` casts in `src/wedata.ts` and `src/index.ts` — works
  today, refactor in a follow-up.
- Splitting the single image into separate Loki/Grafana images — explicit
  product decision.
- Multi-region / multi-account IAM support beyond STS tokens.

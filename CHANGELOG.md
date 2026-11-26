# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Replaced `YOUR_ORG/tencent-mcp` placeholders in `README.md` with the canonical
  `mppnp/tencent-mcp` path.
- Added SPDX `License-Identifier: MIT` headers across `src/` and `test/`.
- Added startup warning when the default approval password is in use.
- Linked `docs/POLICY_AND_PERMISSIONS.md` from `README.md`.

### Added

- `CHANGELOG.md`, `.editorconfig`, `.nvmrc`, `.context/{goal,summary,map}.md`.
- `.github/CODEOWNERS` for high-risk paths (release workflow, Dockerfile,
  `src/policy.ts`, `src/guard.ts`, `src/approval.ts`).

## [0.2.0] - 2026-10-04

### Added

- New Tencent Cloud skills: WSS, YINSUDA, YUNJING, YUNSOU, WeData CodeStudio
  fileops.
- Unit and core test suites.
- WeData workflow run + rule-based Root Cause Analysis.
- `cos:putObjectCopy` and `cos:deleteObject` added to the default mutation
  allowlist.

## [0.1.1] - 2026-10-02

### Added

- Single-image multi-stage build: MCP `:8000` + Grafana `:5000` + Loki
  internal `:3100` with pre-provisioned dashboards.
- PowerBI-style Next/Previous navigation in dashboards.
- `/mcp/readme` cold-start briefing.
- Host-editable file ownership (`1000:tencentmcp + a+rw`).
- STS credential path; safe `SHOW CREATE TABLE`; refined/unrefined knowledge
  base; explicit policy + logging for every request; health + STS endpoints.

## [0.1.0] - 2026-09

### Added

- Initial public release.
- 256 Tencent Cloud services exposed as MCP tools via
  `tencentcloud-sdk-nodejs` and `cos-nodejs-sdk-v5`.
- Deny-by-default safety policy with readonly-prefix and explicit
  `service:Action` allowlist.
- Streamable HTTP transport at `/mcp` plus approval flow for dangerous SQL.
- JSON-line audit log, optional Loki push, optional Logstash TCP, file sink.

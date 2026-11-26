# Contributing

## Development requirements

- Node.js `24.x`
- npm with the committed `package-lock.json`
- Docker for image and deployment changes
- Tencent credentials only for the optional integration test

Install dependencies with:

```bash
npm ci
```

## Required quality checks

Run the complete local gate before opening a pull request:

```bash
npm run check
```

This runs formatting, ESLint, TypeScript typechecking, coverage enforcement, deterministic tests, and the production dependency audit. The default test suite must not require cloud credentials or network access.

For changes that call Tencent APIs or affect the production image, also run:

```bash
npm run test:integration
docker build --pull --no-cache --tag tencent-mcp:local .
```

The integration test is intentionally separate because it requires valid Tencent credentials and can incur service-side delays or costs.

## TDD expectations

1. Add a failing deterministic test for new behavior or a regression.
2. Make the smallest implementation change that makes it pass.
3. Refactor only after the test passes.
4. Keep external APIs behind explicit integration tests; do not make unit tests depend on live cloud services.

## Pull requests

Pull requests should explain the problem, behavior change, test evidence, security impact, and rollback plan. Keep unrelated refactors separate. Reviewers may request changes when the quality gate fails, coverage is missing for a changed behavior, or the change introduces secrets or generated artifacts.

See [SECURITY.md](../SECURITY.md) for vulnerability reporting and [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) for community standards.

## Security

Never commit `creds/credentials.json`, `.env`, API keys, tokens, customer data, audit logs, or local Docker volumes. Report security vulnerabilities privately to the repository maintainers rather than opening a public issue.

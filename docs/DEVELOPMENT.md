# Development

## Requirements

- Node.js 24.x
- npm
- Docker for image validation

Install dependencies and run the quality checks:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run audit:prod
```

Build and run locally:

```bash
npm run build
TENCENT_MCP_HTTP_PORT=8000 node dist/index.js
```

The default local transport is stdio. Set `TENCENT_MCP_HTTP_PORT` to expose
the Streamable HTTP endpoint.

## Docker validation

```bash
docker build --pull --no-cache --tag tencent-mcp:local .
docker run --rm tencent-mcp:local
```

The CI workflow also runs secret scanning and Trivy vulnerability scanning.
Do not include credentials, private metadata, or production configuration in
the image build context.

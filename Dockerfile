# ---- build stage ------------------------------------------------------------
FROM node:24.21.0-alpine3.24 AS build
WORKDIR /app
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build \
 && npm prune --omit=dev

# ---- extract grafana+loki binaries (cached layers) --------------------------
FROM grafana/grafana:11.5.2 AS grafana
FROM grafana/loki:3.4.2 AS loki

# ---- runtime stage — single image, two ports --------------------------------
FROM node:24.21.0-alpine3.24
ENV NODE_ENV=production
LABEL org.opencontainers.image.title="Tencent MCP Server (single image)" \
  org.opencontainers.image.description="Tencent Cloud MCP (8000) + Grafana (5000) + Loki (3100 internal) — dashboards pre-provisioned, PowerBI-style navigation" \
  org.opencontainers.image.version="0.2.0" \
  org.opencontainers.image.licenses="MIT" \
  org.opencontainers.image.base.name="node:24.21.0-alpine3.24"

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/* \
 && apk add --no-cache bash ca-certificates wget tini shadow \
 && addgroup -S -g 1000 tencentmcp 2>/dev/null || addgroup -S tencentmcp \
 && adduser -S -u 1000 -G tencentmcp tencentmcp 2>/dev/null || adduser -S tencentmcp -G tencentmcp \
 && mkdir -p /app/logs /app/config/skills /app/skills/refined /app/skills/unrefined /app/creds /tmp /loki/chunks /loki/rules /loki/compactor /var/lib/grafana /var/log/grafana /var/log/loki /etc/loki \
 && chown -R tencentmcp:tencentmcp /app \
 && chmod 1777 /tmp

COPY --from=grafana /usr/share/grafana /usr/share/grafana
COPY --from=grafana /etc/grafana /etc/grafana
COPY --from=grafana /run.sh /run.sh
COPY --from=loki /usr/bin/loki /usr/bin/loki

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force \
 && chown -R tencentmcp:tencentmcp /app

COPY --from=build /app/dist ./dist
COPY config ./config
# Keep the built-in readme and profiles available when the operator bind-mounts an
# incomplete ./config directory over /app/config.
COPY config/mcp-readme.md ./config-baked/mcp-readme.md
COPY config/mutation-profiles.json ./config-baked/mutation-profiles.json
COPY skills ./skills
# Pristine copy of baked skills: /app/skills is a named volume at runtime and
# shadows the baked files, so the entrypoint seeds missing entries from here
# on every start (new image versions flow in, user edits are never overwritten).
COPY skills ./skills-baked
COPY docker/grafana/provisioning /etc/grafana/provisioning
COPY docker/loki/loki-config.yaml /etc/loki/loki-config.yaml
COPY docker/entrypoint.sh /entrypoint.sh

RUN chown -R tencentmcp:tencentmcp /app /etc/grafana/provisioning /etc/loki 2>/dev/null || true \
 && chmod +x /entrypoint.sh /run.sh \
 && mkdir -p /var/lib/grafana/plugins /app/skills/refined /app/skills/unrefined && chown -R tencentmcp:tencentmcp /var/lib/grafana /var/log/grafana /loki /app/skills 2>/dev/null || true \
 && chmod 775 /app/skills 2>/dev/null || true

ENV TMPDIR=/tmp \
    TENCENT_MCP_HTTP_PORT=8000 \
    TENCENT_MCP_HTTP_HOST=0.0.0.0 \
    TENCENT_MCP_HTTP_PATH=/mcp \
    TENCENT_MCP_AUDIT_FILE=/app/logs/audit.ndjson \
    TENCENT_MCP_LOG_FILE=/app/logs/app.ndjson \
    TENCENT_MCP_METADATA_FILE=/app/config/metadata.md \
    TENCENT_MCP_SKILLS_DIR=/app/config/skills \
    TENCENT_MCP_KNOWLEDGE_DIR=/app/skills \
    GF_SERVER_HTTP_PORT=5000 \
    GF_PATHS_DATA=/var/lib/grafana \
    GF_PATHS_LOGS=/var/log/grafana \
    GF_PATHS_PLUGINS=/var/lib/grafana/plugins \
    GF_PATHS_PROVISIONING=/etc/grafana/provisioning

EXPOSE 8000 5000
STOPSIGNAL SIGTERM
HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=5 \
  CMD sh -c 'wget -qO- http://127.0.0.1:${TENCENT_MCP_HTTP_PORT:-8000}/healthz | grep -q ok && wget -qO- http://127.0.0.1:3100/ready | grep -q ready && wget -qO- http://127.0.0.1:5000/api/health | grep -q ok || exit 1'

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/entrypoint.sh"]

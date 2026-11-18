#!/bin/sh
set -eu
mkdir -p /loki/chunks /loki/rules /loki/compactor /var/lib/grafana /var/lib/grafana/plugins /var/log/grafana /var/log/loki /app/logs /app/skills/refined /app/skills/unrefined /app/config/skills 2>/dev/null || true
# Ensure Grafana/Loki host resolves inside single image. /etc/hosts may be
# immutable on some runtimes — do not fail the container if this fails.
if ! grep -q "loki" /etc/hosts 2>/dev/null; then
  echo "127.0.0.1 loki" >> /etc/hosts 2>/dev/null || echo "[entrypoint] warning: cannot write /etc/hosts (loki alias not added)" >&2
fi
chown -R 472:472 /var/lib/grafana 2>/dev/null || true
chown -R 472:472 /var/log/grafana 2>/dev/null || true

# Loud startup warning when the bundled defaults are still in use. The defaults
# are safe only for local experimentation — anyone with the docker image can
# run them. This block never fails the container; it just surfaces the risk.
if [ "${TENCENT_MCP_APPROVAL_USER:-}" = "kali" ] || [ "${TENCENT_MCP_APPROVAL_PASSWORD:-}" = "kali" ]; then
  cat <<'WARN' >&2
[entrypoint] WARNING: TENCENT_MCP_APPROVAL_USER and/or TENCENT_MCP_APPROVAL_PASSWORD
              are still set to the bundled default "kali". Anyone reaching the
              container can approve destructive SQL. Override both in your
              .env file (or compose environment) before exposing the service.
WARN
fi
if [ "${GRAFANA_ADMIN_PASSWORD:-}" = "change-me" ] || [ "${GF_SECURITY_ADMIN_PASSWORD:-}" = "change-me" ]; then
  echo "[entrypoint] WARNING: Grafana admin password is the bundled default 'change-me' — override GRAFANA_ADMIN_PASSWORD in .env" >&2
fi
# Knowledge base must be writable by the MCP process (runs as root or tencentmcp).
# /app/skills is the writable named volume — ensure it survives even if
# ./skills was baked into image.
# Fix host-ownership: container runs as root (0) creates files as root:root 644,
# host user (1000) then cannot edit with vi. Make files host-writable.
HOST_UID=${PUID:-${HOST_UID:-1000}}
HOST_GID=${PGID:-${HOST_GID:-1000}}
mkdir -p /app/skills/refined /app/skills/unrefined 2>/dev/null || true
# Seed baked skills into the named volume (missing entries only, recursive): the
# volume shadows /app/skills baked into the image, so without this new image
# versions would never surface and fresh volumes would stay empty. Never
# overwrites — user edits and save_knowledge notes always win.
if [ -d /app/skills-baked ]; then
  ( cd /app/skills-baked && find . -mindepth 1 -print | while IFS= read -r f; do
    rel=${f#./}; src="/app/skills-baked/$rel"; dst="/app/skills/$rel"
    if [ -d "$src" ]; then mkdir -p "$dst" 2>/dev/null || true
    elif [ ! -e "$dst" ]; then cp "$src" "$dst" 2>/dev/null && echo "[entrypoint] seeded skill: $rel" >&2 || true
    fi
  done ) || true
fi
chown -R tencentmcp:tencentmcp /app/skills 2>/dev/null || true
chmod 775 /app/skills 2>/dev/null || true
# Also ensure host-mapped dirs (if bind-mounted) and named volume are writable by host UID
chown -R ${HOST_UID}:${HOST_GID} /app/skills /app/logs 2>/dev/null || chown -R tencentmcp:tencentmcp /app/skills /app/logs 2>/dev/null || true
chmod -R a+rw /app/skills /app/logs 2>/dev/null || true
find /app/skills /app/logs -type d -exec chmod 775 {} \; 2>/dev/null || true
find /app/skills /app/logs -type f -exec chmod 664 {} \; 2>/dev/null || true
chown -R tencentmcp:tencentmcp /app/logs 2>/dev/null || true
# Loki working dirs must be writable regardless of image user.
mkdir -p /loki/chunks /loki/rules /loki/compactor 2>/dev/null || true
chown -R tencentmcp:tencentmcp /loki /var/log/loki 2>/dev/null || true
chmod 755 /loki 2>/dev/null || true

/usr/bin/loki -config.file=/etc/loki/loki-config.yaml > /var/log/loki/loki.log 2>&1 &
LOKI_PID=$!

# Wait for Loki to be ready before starting dependents — avoids "loki not
# configured" / push failures on first use and prevents the container from
# becoming healthy before its observability stack is up.
echo "[entrypoint] waiting for Loki :3100 ..." >&2
for i in 1 2 3 4 5 6 7 8 9 10 15 20; do
  if wget -qO- http://127.0.0.1:3100/ready 2>/dev/null | grep -q ready; then
    echo "[entrypoint] Loki ready (after ${i} probes)" >&2
    break
  fi
  # fallback: loki may expose /loki/api/v1/labels or just TCP
  if wget -qO- http://127.0.0.1:3100/loki/api/v1/labels 2>/dev/null | grep -q labels; then
    echo "[entrypoint] Loki ready (labels probe ${i})" >&2
    break
  fi
  sleep 1
done
if ! wget -qO- http://127.0.0.1:3100/ready 2>/dev/null | grep -q ready; then
  echo "[entrypoint] warning: Loki not reporting ready after wait — continuing, check /var/log/loki/loki.log" >&2
  cat /var/log/loki/loki.log 2>/dev/null | tail -30 >&2 || true
fi

GF_SERVER_HTTP_PORT=${GF_SERVER_HTTP_PORT:-5000} \
GF_SERVER_DOMAIN=${GF_SERVER_DOMAIN:-localhost} \
GF_PATHS_DATA=/var/lib/grafana \
GF_PATHS_LOGS=/var/log/grafana \
GF_PATHS_PLUGINS=/var/lib/grafana/plugins \
GF_PATHS_PROVISIONING=/etc/grafana/provisioning \
GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER:-${GF_SECURITY_ADMIN_USER:-admin}} \
GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-${GF_SECURITY_ADMIN_PASSWORD:-change-me}} \
GF_USERS_ALLOW_SIGN_UP=false \
/usr/share/grafana/bin/grafana server \
  --homepath=/usr/share/grafana \
  --config=/etc/grafana/grafana.ini \
  --packaging=docker \
  cfg:default.paths.data=/var/lib/grafana \
  cfg:default.paths.logs=/var/log/grafana \
  cfg:default.paths.plugins=/var/lib/grafana/plugins \
  cfg:default.paths.provisioning=/etc/grafana/provisioning > /var/log/grafana/grafana.log 2>&1 &
GRAFANA_PID=$!

_term() {
  echo "[entrypoint] SIGTERM received, shutting down"
  kill -TERM "$LOKI_PID" "$GRAFANA_PID" 2>/dev/null || true
  wait "$LOKI_PID" 2>/dev/null || true
  wait "$GRAFANA_PID" 2>/dev/null || true
  if [ -n "${MCP_PID:-}" ]; then
    kill -TERM "$MCP_PID" 2>/dev/null || true
    wait "$MCP_PID" 2>/dev/null || true
  fi
  exit 0
}
trap _term TERM INT

sleep 2

# Run MCP as tencentmcp (1000) if possible so new files are owned 1000, else root with a+rw fallback above
if id tencentmcp >/dev/null 2>&1; then
  su tencentmcp -s /bin/sh -c "node dist/index.js" &
else
  node dist/index.js &
fi
MCP_PID=$!
# Background chmod loop so even files created at runtime stay host-writable (every 30s)
( while kill -0 $MCP_PID 2>/dev/null; do sleep 30; chmod -R a+rw /app/skills /app/logs 2>/dev/null || true; find /app/skills /app/logs -type f -exec chmod 664 {} \; 2>/dev/null || true; done ) &
wait "$MCP_PID"

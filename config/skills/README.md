# Skills — add `.md` files here

This folder is mounted **read-only** at `/app/config/skills` in the single-image container.
Any `.md` file you drop here is auto-discovered and injected into `GET /mcp/readme`
so agents get project knowledge without cold-start questions.

> **New:** The MCP now manages its own knowledge base too — see below.

## Why `config/skills/` (recommended for single-image users)?
- **Same volume as `config/metadata.md`** — one bind mount `./config:/app/config:ro`, no extra compose volumes.
- Survives `docker pull` + rebuilds — operator-private, env-specific playbooks stay on host.
- No git churn — ideal for cost runbooks, SOPs, incident notes.

## When to use `skills/` in repo root instead?
- Shared, versioned skills you want in git and baked into the image (`COPY skills` in Dockerfile).
- Team templates (e.g., `skills/cost-optimization.md`, `skills/wedata-runbook.md`).

**Best practice:** Shared templates in `skills/`, env overrides in `config/skills/`. Runtime merges both, `config/skills/` wins if names collide.

## Format
```markdown
# my-skill
Describe when to use this skill, steps, gotchas.
Add LogQL, safety policy notes, or region hints.
```

Listed at `GET /mcp/readme` under "Current skills" and available to agents on next request (no restart).

Example: copy `skills/example.md` → `config/skills/my-team.md` and curl `http://localhost:8000/mcp/readme` to verify.

## MCP-managed knowledge base (`/app/skills`)

The MCP can **manage its own knowledge** without a host mount, via three tools:

- `save_knowledge { title, content, status }` — `status: "unrefined"` for raw hit-and-trial notes, `"refined"` for validated lessons. Files land in `/app/skills/unrefined/*.md` or `/app/skills/refined/*.md`.
- `list_knowledge { status }` — browse `refined` / `unrefined` notes.
- `promote_knowledge { name }` — move `unrefined/<name>.md` → `refined/<name>.md` after validation.

These paths are a **writable named volume** (`tencent_mcp_skills:/app/skills`) — separate from the `ro` `config` mount, so writes never fail with `read-only filesystem` and survive `docker pull` / restarts. Local dev writes to `./skills/refined|unrefined`. All notes are recursively discovered and shown in `GET /mcp/readme` alongside `config/skills` and `skills/` templates (where `config/skills` wins on name collision).

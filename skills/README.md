# Repo-tracked skills

Put **shared, versioned** skills here (committed to git, optionally baked into image).
For operator-private / env-specific skills, prefer `config/skills/` (same volume as `metadata.md`, no extra mount).

Runtime merges `config/skills/` + `skills/`, `config/skills/` wins on name collision.
Discovered via `GET /mcp/readme` → "Current skills".

See `config/skills/README.md` for guidance.

# Security Policy

## Supported versions

Security fixes are applied to the latest version on the `main` branch and the latest published release. Older releases may not receive security updates.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting feature or contact the repository maintainers privately with:

- a clear description and impact;
- affected versions or commit;
- reproducible steps or a minimal proof of concept;
- any suggested mitigation.

Do not include real Tencent credentials, tokens, customer data, or production logs in a report. We will acknowledge reports as soon as practical, investigate the issue, and coordinate disclosure with the reporter.

## Security expectations

- Credentials belong only in `creds/credentials.json` and must never be committed.
- Pull requests must not weaken approval, audit, or deny-by-default controls.
- Dependency and container security checks must pass before merging.

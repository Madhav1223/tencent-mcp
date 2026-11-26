# Release and CI/CD

## Continuous integration

Pull requests and pushes to `main` run
[`ci.yml`](../.github/workflows/ci.yml), which checks formatting, linting,
types, tests, dependency vulnerabilities, secrets, and the Docker image.

## Container release

[`release.yml`](../.github/workflows/release.yml) runs when a semantic version
tag such as `v0.3.0` is pushed. It publishes versioned tags and `latest` to
GitHub Container Registry.

[`dockerhub-release.yml`](../.github/workflows/dockerhub-release.yml) runs on
the same tags and publishes the image to Docker Hub as
`mppnp/tencent-mcp:<version>` and `mppnp/tencent-mcp:latest`.

```bash
git tag v0.3.0
git push origin v0.3.0
```

## Docker Hub publishing

To publish to Docker Hub, configure these repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

The release workflow must log in to Docker Hub and include
`mppnp/tencent-mcp` as a build target. Docker Hub and GHCR should use the same
version and `latest` tags.

The Docker Hub workflow requires:

- `DOCKERHUB_USERNAME`: Docker Hub account username
- `DOCKERHUB_TOKEN`: Docker Hub access token, not the account password

Both workflows are triggered by the same release tag:

```bash
git tag v0.3.0
git push origin v0.3.0
```

Never publish an image containing credentials or private metadata. Use a
versioned tag for production rollouts and move to `latest` only after release
verification.

## Release checklist

1. Run the full CI checks locally.
2. Confirm the Dockerfile builds from a clean checkout.
3. Review security and policy changes.
4. Push the version tag.
5. Verify the image digest and registry tags.
6. Pull the published image in a clean deployment directory.
7. Verify `/healthz`, `/mcp/readme`, Grafana, and MCP initialization.
8. Update user-facing release notes and Docker Hub documentation.

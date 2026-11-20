---
name: tencent-vcube
description: Tencent Cloud VCUBE via the Tencent MCP server — 36 actions in API version v20220410 (13 read-only auto-allowed). Use for license, application, xmagic, trial, vcube, renew. Triggers on mentions of vcube, license, application, xmagic, trial, vcube, renew, test, video. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: 3D / generative media
metadata:
  version: "4"
---

# Tencent Cloud VCUBE

3D / generative media: 36 actions in API version `v20220410` — 13 read-only (auto-allowed), 12 gated mutations, 11 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vcube"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Generation jobs are async and billed per run — poll result actions until terminal state; preview at low fidelity before expensive renders.
Input assets (images, models, audio) have format/size constraints — validate against the model docs before submitting.
Style and template IDs pin output behavior — set them explicitly rather than relying on defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vcube/v20220410 — action signatures in `vcube_client.ts`, full request/response shapes in `vcube_models.ts`.

## Read actions (auto-allowed, 13)

| Action | What it does |
|---|---|
| `DescribeVcubeResources` | Describe vcube resources |
| `DescribeNews` | Describe news<br>Required: `PageNumber`, `PageSize` |
| `DescribeXMagicResource` | Describe xmagic resource<br>Required: `PageNumber`, `PageSize` |
| `DescribeUserConfig` | Describe user config |
| `DescribeSTS` | Describe sts |
| `DescribeVcubeResourcesList` | Describe vcube resources list<br>Required: `PageNumber`, `PageSize` |
| `DescribeVcubeApplicationAndLicense` | Describe vcube application and license |
| `DescribeVcubeApplicationAndXMagicList` | Describe vcube application and xmagic list |
| `DescribeVcubeApplicationAndPlayList` | Describe vcube application and play list |
| `DescribeLicenseList` | Describe license list<br>Required: `PageNumber`, `PageSize`, `Platform` |
| `DescribeXMagicResourceList` | Describe xmagic resource list<br>Required: `PageNumber`, `PageSize` |
| `DescribeTrialFeature` | Describe trial feature |
| `DescribeFeatureList` | Describe feature list |
## Mutations (gated — need allowlist, 12)

| Action | What it does |
|---|---|
| `CreateApplicationAndWebPlayerLicense` | Create application and web player license<br>Required: `AppName`, `DomainList` |
| `CreateTrialLicense` | Create trial license<br>Required: `ApplicationId`, `FeatureIds` |
| `UpdateTestXMagic` | Update test xmagic<br>Required: `XMagicId`, `ResourceId` |
| `UpdateXMagic` | Update xmagic<br>Required: `XMagicId` |
| `UpdateTrialLicense` | Update trial license<br>Required: `LicenseId`, `ResourceId` |
| `CreateActivityLicense` | Create activity license<br>Required: `Activity` |
| `CreateLicense` | Create license<br>Required: `ApplicationId`, `ResourceIds` |
| `CreateTestXMagic` | Create test xmagic<br>Required: `ApplicationId` |
| `CreateTrialApplicationAndLicense` | Create trial application and license<br>Required: `AppName` |
| `CreateXMagic` | Create xmagic<br>Required: `ApplicationId` |
| `CreateApplicationAndVideo` | Create application and video<br>Required: `AppName` |
| `CreateApplicationAndBindLicense` | Create application and bind license<br>Required: `AppName` |

## Blocked destructive actions (11)

`ModifyTrialLicense`, `DeleteApplicationAndWebPlayerLicense`, `RenewTestXMagic`, `ModifyApplication`, `ModifyFormalApplication`, `ModifyPresetApplication`, `ModifyLicense`, `DeleteApplicationAndVideoLicense`, `RenewVideo`, `RenewLicense`, `ModifyXMagic` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vcube`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220410` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vcube"`) for the allow/block decision and reason.

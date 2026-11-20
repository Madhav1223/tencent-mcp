---
name: tencent-ms
description: Tencent Cloud MS via the Tencent MCP server — 23 actions in API version v20180408 (10 read-only auto-allowed). Use for instances, shield, encrypt, result, plan, detection. Triggers on mentions of ms, instances, shield, encrypt, result, plan, detection, local, order. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud MS

General service: 23 actions in API version `v20180408` — 10 read-only (auto-allowed), 10 gated mutations, 3 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ms"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ms/v20180408 — action signatures in `ms_client.ts`, full request/response shapes in `ms_models.ts`.

## Read actions (auto-allowed, 10)

| Action | What it does |
|---|---|
| `DescribeResourceInstances` | Describe resource instances |
| `DescribeShieldPlanInstance` | Describe shield plan instance<br>Required: `ResourceId`, `Pid` |
| `DescribeShieldInstances` | Describe shield instances |
| `DescribeUrlDetectionResult` | Describe url detection result<br>Required: `Url` |
| `DescribeEncryptPlan` | Describe encrypt plan<br>Required: `PlatformType`, `OrderType`, `EncryptOpType`, `ResourceId` |
| `DescribeOrderInstances` | Describe order instances |
| `DescribeShieldResult` | Describe shield result<br>Required: `ItemId` |
| `DescribeUserBaseInfoInstance` | Describe user base info instance |
| `DescribeApkDetectionResult` | Describe apk detection result<br>Required: `ApkUrl`, `ApkMd5` |
| `DescribeEncryptInstances` | Describe encrypt instances |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `RequestLocalTask` | Run request local task<br>Required: `ClientId` |
| `CreateEncryptInstance` | Create encrypt instance<br>Required: `PlatformType`, `OrderType`, `EncryptOpType`, `ResourceId` |
| `UpdateLocalTaskResult` | Update local task result<br>Required: `Sid`, `ResultCode`, `SubCode`, `ErrMsg`, `Result` |
| `CreateShieldPlanInstance` | Create shield plan instance<br>Required: `ResourceId`, `PlanName`, `PlanInfo` |
| `CreateResourceInstances` | Create resource instances<br>Required: `Pid`, `TimeUnit`, `TimeSpan`, `ResourceNum` |
| `CreateBindInstance` | Create bind instance<br>Required: `ResourceId`, `AppIconUrl`, `AppName`, `AppPkgName` |
| `CreateShieldInstance` | Create shield instance<br>Required: `AppInfo`, `ServiceInfo` |
| `UpdateClientState` | Update client state<br>Required: `ClientId`, `Ip`, `Internal`, `ServerVersion`, `Hostname`, `Os` |
| `CreateCosSecKeyInstance` | Create cos sec key instance |
| `CreateOrderInstance` | Create order instance<br>Required: `PlatformType`, `OrderType` |

## Blocked destructive actions (3)

`DeleteShieldInstances`, `DestroyResourceInstances`, `CancelEncryptTask` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ms`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180408` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ms"`) for the allow/block decision and reason.

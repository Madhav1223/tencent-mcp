---
name: tencent-cii
description: Tencent Cloud CII via the Tencent MCP server — 13 actions in API version v20210408 (8 read-only auto-allowed). Use for structure, underwrite, classify, result, auto, compare. Triggers on mentions of cii, structure, underwrite, classify, result, auto, compare, difference, machine. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CII

General service: 13 actions in API version `v20210408` — 8 read-only (auto-allowed), 5 gated mutations, 0 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cii"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/cii/v20210408 — action signatures in `cii_client.ts`, full request/response shapes in `cii_models.ts`.

## Read actions (auto-allowed, 8)

| Action | What it does |
|---|---|
| `DescribeStructureDifference` | Describe structure difference |
| `DescribeStructureTaskResult` | Describe structure task result<br>Required: `MainTaskId` |
| `DescribeUnderwriteTask` | Describe underwrite task |
| `DescribeMachineUnderwrite` | Describe machine underwrite<br>Required: `UnderwriteTaskId` |
| `DescribeStructCompareData` | Describe struct compare data |
| `DescribeQualityScore` | Describe quality score<br>Required: `File` |
| `DescribeStructureResult` | Describe structure result<br>Required: `MainTaskId` |
| `DescribeReportClassify` | Describe report classify<br>Required: `ServiceType`, `FileList` |
## Mutations (gated — need allowlist, 5)

| Action | What it does |
|---|---|
| `UploadMedicalFile` | Upload medical file |
| `CreateUnderwriteTaskById` | Create underwrite task by id<br>Required: `MainTaskIds` |
| `CreateStructureTask` | Create structure task<br>Required: `ServiceType`, `TaskInfos` |
| `CreateAutoClassifyStructureTask` | Create auto classify structure task<br>Required: `ServiceType`, `TaskInfos` |
| `AddSubStructureTasks` | Add sub structure tasks<br>Required: `MainTaskId`, `TaskInfos` |
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `cii`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210408` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="cii"`) for the allow/block decision and reason.

---
name: tencent-hai
description: Tencent Cloud HAI via the Tencent MCP server — 25 actions in API version v20230812 (11 read-only auto-allowed). Use for instances, deploy, infer, inquire, musk, price. Triggers on mentions of hai, instances, deploy, infer, inquire, musk, price, services, application. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud HAI

Compute instances & pools: 25 actions in API version `v20230812` — 11 read-only (auto-allowed), 10 gated mutations, 4 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "hai"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/hai/v20230812 — action signatures in `hai_client.ts`, full request/response shapes in `hai_models.ts`.

## Read actions (auto-allowed, 11)

| Action | What it does |
|---|---|
| `DescribeServiceLoginSettings` | Describe service login settings<br>Required: `InstanceId` |
| `DescribeDeployTemplates` | Describe deploy templates<br>Required: `ModelId` |
| `DescribeInstances` | Describe instances |
| `DescribeServicesCallInfo` | Describe services call info |
| `DescribeMuskPrompts` | Describe musk prompts<br>Required: `WorkgroupId`, `WorkflowId`, `Offset`, `Limit` |
| `DescribeRegions` | Describe regions |
| `DescribeServices` | Describe services |
| `DescribeModels` | Describe models |
| `DescribeApplications` | Describe applications |
| `DescribeScenes` | Describe scenes |
| `DescribeInstanceNetworkStatus` | Describe instance network status<br>Required: `InstanceIds` |
## Mutations (gated — need allowlist, 10)

| Action | What it does |
|---|---|
| `ResizeInstanceDisk` | Resize instance disk<br>Required: `InstanceId`, `DiskSize` |
| `UpdateServiceConfigs` | Update service configs<br>Required: `ServiceId` |
| `InquirePriceRunInstances` | Inquire the price of: run instances<br>Required: `ApplicationId`, `BundleType` |
| `InquirePriceUpdateServiceConfigs` | Inquire the price of: update service configs |
| `RunInstances` | Run instances<br>Required: `ApplicationId`, `BundleType` |
| `DeployInferService` | Deploy infer service |
| `StartInstance` | Start instance<br>Required: `InstanceId` |
| `CreateMuskPrompt` | Create musk prompt<br>Required: `WorkgroupId`, `WorkflowId`, `PromptParams` |
| `CreateApplication` | Create application<br>Required: `InstanceId`, `ApplicationName` |
| `CreateInferServiceByTemplate` | Create infer service by template<br>Required: `TemplateId` |

## Blocked destructive actions (4)

`TerminateInstances`, `DeleteService`, `ResetInstancesPassword`, `StopInstance` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `hai`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20230812` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="hai"`) for the allow/block decision and reason.

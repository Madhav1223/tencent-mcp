---
name: tencent-tem
description: Tencent Cloud TEM via the Tencent MCP server — 51 actions in API version v20210701 (17 read-only auto-allowed). Use for application, autoscaler, environment, deploy, ingress, destroy. Triggers on mentions of tem, application, autoscaler, environment, deploy, ingress, destroy, applications, ingresses. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Containers & registries
metadata:
  version: "4"
---

# Tencent Cloud TEM

Containers & registries: 51 actions in API version `v20210701` — 17 read-only (auto-allowed), 15 gated mutations, 19 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tem"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Registries are region-scoped: image URLs embed the region, and pulling across regions fails without replication rules — create replication before deploying multi-region.
Namespaces/repositories need explicit access policy (private by default); image pull secrets on the workload side must match.
Deployments are async — after pushing or updating, poll the workload/task status actions until the new revision is stable before declaring success.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tem/v20210701 — action signatures in `tem_client.ts`, full request/response shapes in `tem_models.ts`.

## Read actions (auto-allowed, 17)

| Action | What it does |
|---|---|
| `DescribeApplicationsStatus` | Describe applications status<br>Required: `EnvironmentId` |
| `DescribeApplicationServiceList` | Describe application service list<br>Required: `EnvironmentId`, `ApplicationId` |
| `DescribePagedLogConfigList` | Describe paged log config list<br>Required: `EnvironmentId` |
| `DescribeEnvironmentStatus` | Describe environment status<br>Required: `EnvironmentIds` |
| `DescribeDeployApplicationDetail` | Describe deploy application detail<br>Required: `ApplicationId`, `EnvironmentId` |
| `DescribeEnvironment` | Describe environment<br>Required: `EnvironmentId` |
| `DescribeLogConfig` | Describe log config<br>Required: `EnvironmentId`, `Name`, `ApplicationId` |
| `DescribeApplicationInfo` | Describe application info<br>Required: `ApplicationId` |
| `DescribeApplicationPods` | Describe application pods<br>Required: `EnvironmentId`, `ApplicationId` |
| `DescribeEnvironments` | Describe environments |
| `DescribeIngress` | Describe ingress<br>Required: `EnvironmentId`, `ClusterNamespace`, `IngressName` |
| `DescribeIngresses` | Describe ingresses<br>Required: `EnvironmentId`, `ClusterNamespace` |
| `DescribeApplications` | Describe applications |
| `DescribeRelatedIngresses` | Describe related ingresses<br>Required: `EnvironmentId`, `ClusterNamespace`, `ApplicationId` |
| `DescribeConfigData` | Describe config data<br>Required: `EnvironmentId`, `Name` |
| `DescribeApplicationAutoscalerList` | Describe application autoscaler list<br>Required: `ApplicationId`, `EnvironmentId` |
| `DescribeConfigDataList` | Describe config data list<br>Required: `EnvironmentId` |
## Mutations (gated — need allowlist, 15)

| Action | What it does |
|---|---|
| `EnableApplicationAutoscaler` | Enable application autoscaler<br>Required: `ApplicationId`, `EnvironmentId`, `AutoscalerId` |
| `CreateApplicationAutoscaler` | Create application autoscaler<br>Required: `ApplicationId`, `EnvironmentId`, `Autoscaler` |
| `ResumeDeployApplication` | Resume deploy application<br>Required: `ApplicationId`, `EnvironmentId` |
| `DeployApplication` | Deploy application<br>Required: `ApplicationId`, `InitPodNum`, `CpuSpec`, `MemorySpec` (unit: G), `EnvironmentId`, `DeployVersion` |
| `CreateLogConfig` | Create log config<br>Required: `EnvironmentId`, `Name`, `InputType`, `ApplicationId` |
| `CreateApplicationService` | Create application service<br>Required: `ApplicationId`, `EnvironmentId`, `Service` |
| `CreateConfigData` | Create config data<br>Required: `EnvironmentId`, `Name`, `Data` |
| `CreateCosToken` | Create cos token<br>Required: `ApplicationId`, `PkgName`, `OptType` |
| `GenerateApplicationPackageDownloadUrl` | Generate application package download url<br>Required: `ApplicationId`, `PkgName`, `DeployVersion` |
| `CreateEnvironment` | Create environment<br>Required: `EnvironmentName` |
| `DisableApplicationAutoscaler` | Disable application autoscaler<br>Required: `ApplicationId`, `EnvironmentId`, `AutoscalerId` |
| `CreateApplication` | Create application<br>Required: `ApplicationName`, `Description` |
| `RollingUpdateApplicationByVersion` | Run rolling update application by version<br>Required: `ApplicationId`, `EnvironmentId`, `DeployVersion` |
| `RevertDeployApplication` | Run revert deploy application<br>Required: `ApplicationId`, `EnvironmentId` |
| `CreateResource` | Create resource<br>Required: `EnvironmentId`, `ResourceType` |

## Blocked destructive actions (19)

`ModifyConfigData`, `ModifyIngress`, `ModifyApplicationReplicas`, `RestartApplicationPod`, `ModifyLogConfig`, `DeleteApplication`, `DeleteIngress`, `ModifyApplicationAutoscaler`, `ModifyApplicationService`, `ModifyGatewayIngress`, `ModifyEnvironment`, `StopApplication`, `DeleteApplicationAutoscaler`, `ModifyApplicationInfo`, `DestroyConfigData`, `DeleteApplicationService`, `RestartApplication`, `DestroyLogConfig`, `DestroyEnvironment` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tem`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20210701` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tem"`) for the allow/block decision and reason.

---
name: tencent-tcr
description: Tencent Cloud TCR via the Tencent MCP server — 127 actions in API version v20190924 (52 read-only auto-allowed). Use for personal, image, repository, replication, trigger, namespace. Triggers on mentions of tcr, personal, image, repository, replication, trigger, namespace, retention, endpoint. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Containers & registries
metadata:
  version: "4"
---

# Tencent Cloud TCR

Containers & registries: 127 actions in API version `v20190924` — 52 read-only (auto-allowed), 32 gated mutations, 43 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tcr"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Registries are region-scoped: image URLs embed the region, and pulling across regions fails without replication rules — create replication before deploying multi-region.
Namespaces/repositories need explicit access policy (private by default); image pull secrets on the workload side must match.
Deployments are async — after pushing or updating, poll the workload/task status actions until the new revision is stable before declaring success.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tcr/v20190924 — action signatures in `tcr_client.ts`, full request/response shapes in `tcr_models.ts`.

## Read actions (auto-allowed, 52)

| Action | What it does |
|---|---|
| `DescribeSkillDetail` | Describe skill detail<br>Required: `RegistryId`, `SkillName`, `SkillVersion` |
| `DescribeImageLifecycleGlobalPersonal` | Describe image lifecycle global personal |
| `DescribeReplicationInstances` | Describe replication instances<br>Required: `RegistryId` |
| `DescribeImagePersonal` | Describe image personal<br>Required: `RepoName` |
| `DescribeTagRetentionExecutionTask` | Describe tag retention execution task<br>Required: `RegistryId`, `RetentionId`, `ExecutionId` |
| `DescribeRepositories` | Describe repositories<br>Required: `RegistryId` |
| `ListSkills` | List skills<br>Required: `RegistryId` |
| `DescribeWebhookTriggerLog` | Describe webhook trigger log<br>Required: `RegistryId`, `Namespace` |
| `DescribeImageManifests` | Describe image manifests<br>Required: `RegistryId`, `NamespaceName`, `RepositoryName`, `ImageVersion` |
| `ListAIModels` | List aimodels<br>Required: `RegistryId` |
| `ListSkillVersions` | List skill versions<br>Required: `RegistryId`, `SkillName` |
| `DescribeReplicationInstanceCreateTasks` | Describe replication instance create tasks<br>Required: `ReplicationRegistryId`, `ReplicationRegionId` |
| `DescribeFavorRepositoryPersonal` | Describe favor repository personal<br>Required: `RepoName`, `Limit`, `Offset` |
| `DescribeTagRetentionRules` | Describe tag retention rules<br>Required: `RegistryId` |
| `DescribeReplicationInstanceSyncStatus` | Describe replication instance sync status<br>Required: `RegistryId`, `ReplicationRegistryId` |
| `DescribeApplicationTriggerPersonal` | Describe application trigger personal |
| `DescribeTagRetentionExecution` | Describe tag retention execution<br>Required: `RegistryId`, `RetentionId` |
| `DescribeGCJobs` | Describe gcjobs<br>Required: `RegistryId` |
| `DescribeImageAccelerateService` | Describe image accelerate service<br>Required: `RegistryId` |
| `CheckInstanceName` | Check instance name<br>Required: `RegistryName` |
| `CheckInstance` | Check instance<br>Required: `RegistryId` |
| `DescribeNamespacePersonal` | Describe namespace personal<br>Required: `Namespace`, `Limit`, `Offset` |
| `DescribeInstanceAllNamespaces` | Describe instance all namespaces |
| `DescribeRepositoryPersonal` | Describe repository personal<br>Required: `RepoName` |
| `DescribeRegions` | Describe regions |
| `DescribeSecurityPolicies` | Describe security policies<br>Required: `RegistryId` |
| `DescribeImageLifecyclePersonal` | Describe image lifecycle personal<br>Required: `RepoName` |
| `DescribeRepositoryFilterPersonal` | Describe repository filter personal |
| `DescribeInstanceCustomizedDomain` | Describe instance customized domain<br>Required: `RegistryId` |
| `DescribeImmutableTagRules` | Describe immutable tag rules<br>Required: `RegistryId` |
| `DescribeSkillDownloadInfo` | Describe skill download info<br>Required: `RegistryId`, `SkillName`, `SkillVersion` |
| `DescribeChartDownloadInfo` | Describe chart download info<br>Required: `RegistryId`, `NamespaceName`, `ChartName`, `ChartVersion` |
| `DescribeUserQuotaPersonal` | Describe user quota personal |
| `DescribeInstanceToken` | Describe instance token<br>Required: `RegistryId` |
| `DownloadHelmChart` | Download helm chart<br>Required: `RegistryId`, `NamespaceName`, `ChartName`, `ChartVersion` |
| `DescribeReplicationExecutions` | Describe replication executions<br>Required: `RegistryId` |
| `DescribeNamespaces` | Describe namespaces<br>Required: `RegistryId` |
| `DescribeAIModelVersionDetail` | Describe aimodel version detail<br>Required: `RegistryId`, `NamespaceName`, `RepositoryName`, `Reference` |
| `DescribeServiceAccounts` | Describe service accounts<br>Required: `RegistryId` |
| `DescribeReplicationPolicies` | Describe replication policies<br>Required: `RegistryId` |
| `DescribeImageFilterPersonal` | Describe image filter personal<br>Required: `RepoName`, `Tag` |
| `DescribeRepositoryOwnerPersonal` | Describe repository owner personal |
| `DescribeImages` | Describe images<br>Required: `RegistryId`, `NamespaceName`, `RepositoryName` |
| `DescribeInstances` | Describe instances |
| `DescribeApplicationTriggerLogPersonal` | Describe application trigger log personal |
| `DescribeWebhookTrigger` | Describe webhook trigger<br>Required: `RegistryId` |
| `ListAIModelVersions` | List aimodel versions<br>Required: `RegistryId`, `NamespaceName`, `RepositoryName` |
| `DescribeInstanceStatus` | Describe instance status<br>Required: `RegistryIds` |
| `DescribeReplicationTasks` | Describe replication tasks<br>Required: `RegistryId`, `ExecutionId` |
| `DescribeExternalEndpointStatus` | Describe external endpoint status<br>Required: `RegistryId` |
| `DescribeInternalEndpoints` | Describe internal endpoints<br>Required: `RegistryId` |
| `DescribeInternalEndpointDnsStatus` | Describe internal endpoint dns status<br>Required: `VpcSet` |
## Mutations (gated — need allowlist, 32)

| Action | What it does |
|---|---|
| `CreateNamespace` | Create namespace<br>Required: `RegistryId`, `NamespaceName`, `IsPublic` |
| `ManageReplication` | Run manage replication<br>Required: `SourceRegistryId`, `DestinationRegistryId`, `Rule` |
| `ManageImageLifecycleGlobalPersonal` | Run manage image lifecycle global personal<br>Required: `Type`, `Val` |
| `CreateInstanceCustomizedDomain` | Create instance customized domain<br>Required: `RegistryId`, `DomainName`, `CertificateId` |
| `CreateImageAccelerationService` | Create image acceleration service<br>Required: `RegistryId`, `VpcId`, `SubnetId`, `StorageType`, `PGroupId`, `Zone` |
| `BatchDeleteRepositoryPersonal` | Run batch delete repository personal<br>Required: `RepoNames` |
| `CreateMultipleSecurityPolicy` | Create multiple security policy<br>Required: `RegistryId`, `SecurityGroupPolicySet` |
| `DuplicateImagePersonal` | Duplicate image personal<br>Required: `SrcImage`, `DestImage` |
| `CreateTagRetentionRule` | Create tag retention rule<br>Required: `RegistryId`, `NamespaceId`, `CronSetting` |
| `CreateGCJob` | Create gcjob<br>Required: `RegistryId` |
| `CreateTagRetentionExecution` | Create tag retention execution<br>Required: `RegistryId`, `RetentionId` |
| `CreateInstance` | Create instance<br>Required: `RegistryName`, `RegistryType` |
| `BatchDeleteImagePersonal` | Run batch delete image personal<br>Required: `RepoName`, `Tags` |
| `CreateReplicationInstance` | Create replication instance<br>Required: `RegistryId` |
| `CreateRepository` | Create repository<br>Required: `RegistryId`, `NamespaceName`, `RepositoryName` |
| `ManageExternalEndpoint` | Run manage external endpoint<br>Required: `RegistryId`, `Operation` |
| `CreateUserPersonal` | Create user personal<br>Required: `Password` |
| `CreateSecurityPolicy` | Create security policy<br>Required: `RegistryId`, `CidrBlock`, `Description` |
| `CreateSignaturePolicy` | Create signature policy<br>Required: `RegistryId`, `Name`, `NamespaceName`, `KmsId`, `KmsRegion` |
| `CreateImmutableTagRules` | Create immutable tag rules<br>Required: `RegistryId`, `NamespaceName`, `Rule` |
| `CreateInternalEndpointDns` | Create internal endpoint dns<br>Required: `InstanceId`, `VpcId`, `EniLBIp` |
| `CreateWebhookTrigger` | Create webhook trigger<br>Required: `RegistryId`, `Trigger`, `Namespace` |
| `CreateApplicationTriggerPersonal` | Create application trigger personal<br>Required: `RepoName`, `TriggerName`, `InvokeMethod`, `ClusterId`, `Namespace`, `WorkloadType`, `WorkloadName`, `ContainerName`, `ClusterRegion` |
| `ValidateRepositoryExistPersonal` | Validate repository exist personal<br>Required: `RepoName` |
| `CreateSignature` | Create signature<br>Required: `RegistryId`, `NamespaceName`, `RepositoryName`, `ImageVersion` |
| `CreateServiceAccount` | Create service account<br>Required: `RegistryId`, `Name`, `Permissions` |
| `ManageInternalEndpoint` | Run manage internal endpoint<br>Required: `RegistryId`, `Operation`, `VpcId`, `SubnetId` |
| `DuplicateImage` | Duplicate image<br>Required: `RegistryId`, `SourceNamespace`, `SourceRepo`, `SourceReference`, `DestinationTag` |
| `CreateRepositoryPersonal` | Create repository personal<br>Required: `RepoName` |
| `ValidateNamespaceExistPersonal` | Validate namespace exist personal<br>Required: `Namespace` |
| `CreateNamespacePersonal` | Create namespace personal<br>Required: `Namespace` |
| `CreateInstanceToken` | Create instance token<br>Required: `RegistryId` |

## Blocked destructive actions (43)

`DeleteSecurityPolicy`, `DeleteReplicationInstance`, `DeleteImmutableTagRules`, `DeleteReplicationRule`, `DeleteImagePersonal`, `ModifyWebhookTrigger`, `DeleteWebhookTrigger`, `DeleteImageAccelerateService`, `DeleteServiceAccount`, `DeleteImageLifecycleGlobalPersonal`, `DeleteNamespacePersonal`, `ModifyRepositoryAccessPersonal`, `ModifyInstance`, `ModifyServiceAccountPassword`, `DeleteInstanceCustomizedDomain`, `ModifyRepositoryInfoPersonal`, `RenewInstance`, `ModifySecurityPolicy`, `DeleteSkill`, `DeleteMultipleSecurityPolicy`, `ModifyNamespace`, `DeleteInstance`, `ModifyRepository`, `ModifyServiceAccount`, `DeleteRepositoryTags`, `ModifyInstanceStorage`, `TerminateGCJob`, `ModifyImmutableTagRules`, `DeleteApplicationTriggerPersonal`, `ModifyInstanceToken`, `DeleteAIModel`, `ModifyApplicationTriggerPersonal`, `DeleteInternalEndpointDns`, `ModifyTagRetentionRule`, `DeleteRepository`, `ModifyReplication`, `DeleteTagRetentionRule`, `DeleteNamespace`, `DeleteSignaturePolicy`, `DeleteRepositoryPersonal`, `DeleteInstanceToken`, `ModifyUserPasswordPersonal`, `DeleteImage` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tcr`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190924` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tcr"`) for the allow/block decision and reason.

---
name: tencent-tcb
description: Tencent Cloud TCB via the Tencent MCP server — 104 actions in API version v20180608 (46 read-only auto-allowed). Use for cloud, httpservice, pguser, route, aimodel, domain. Triggers on mentions of tcb, cloud, httpservice, pguser, route, aimodel, domain, table, version. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: DevOps & app platforms
metadata:
  version: "4"
---

# Tencent Cloud TCB

DevOps & app platforms: 104 actions in API version `v20180608` — 46 read-only (auto-allowed), 30 gated mutations, 28 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tcb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Environments (dev/test/prod) are isolated — confirm which environment every deploy or config change targets.
Deployments are async with revisions — after release, poll the deployment/revision status until stable and keep the previous revision for rollback.
Service discovery and config centers decouple code from endpoints — update config entries explicitly; code deploys alone don't move traffic.
Microservice gateways need route publication after changes — unpublished edits serve stale behavior.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tcb/v20180608 — action signatures in `tcb_client.ts`, full request/response shapes in `tcb_models.ts`.

## Read actions (auto-allowed, 46)

| Action | What it does |
|---|---|
| `DescribeApiKeyList` | Describe api key list<br>Required: `EnvId` |
| `DescribeAIModels` | Describe aimodels<br>Required: `EnvId` |
| `DescribeClient` | Describe client<br>Required: `EnvId`, `Id` |
| `DescribeBaasPackageList` | Describe baas package list |
| `ListPGUserMigrations` | List pguser migrations<br>Required: `EnvId` |
| `CheckTcbService` | Check tcb service |
| `DescribeCreditsUsageDetail` | Describe credits usage detail<br>Required: `Modules`, `StartDate`, `EndDate`, `NeedUsageDetails`, `EnvId` |
| `DescribeCloudBaseBuildService` | Describe cloud base build service<br>Required: `EnvId`, `ServiceName` |
| `DescribeCloudAppInfo` | Describe cloud app info |
| `DescribeCurveData` | Describe curve data<br>Required: `EnvId`, `MetricName`, `StartTime`, `EndTime` |
| `DescribeTables` | Describe tables<br>Required: `MgoLimit` |
| `DescribeUserList` | Describe user list<br>Required: `EnvId` |
| `DescribeHostingDomainTask` | Describe hosting domain task<br>Required: `EnvId` |
| `DescribeVmInstances` | Describe vm instances<br>Required: `EnvId`, `Type` |
| `DescribeEnvs` | Describe envs |
| `DescribeHTTPServiceRoute` | Describe httpservice route<br>Required: `EnvId` |
| `DescribeCreditsUsage` | Describe credits usage<br>Required: `StartDate`, `EndDate`, `EnvId` |
| `DescribeLoginConfig` | Describe login config<br>Required: `EnvId` |
| `DescribeSafeRule` | Describe safe rule<br>Required: `EnvId`, `CollectionName` |
| `DescribeMySQLTaskStatus` | Describe my sqltask status<br>Required: `EnvId` |
| `GetProviders` | Get providers<br>Required: `EnvId` |
| `DescribeEnvLimit` | Describe env limit |
| `ListTables` | List tables<br>Required: `MgoLimit` |
| `DescribePGUserMigration` | Describe pguser migration<br>Required: `EnvId`, `MigrationVersion` (format `14…`) |
| `DescribeManagedAIModelList` | Describe managed aimodel list<br>Required: `EnvId` |
| `DescribeCloudAppList` | Describe cloud app list<br>Required: `EnvId`, `DeployType` |
| `DescribeCloudBaseRunServerVersion` | Describe cloud base run server version<br>Required: `EnvId`, `ServerName`, `VersionName` |
| `DescribeTable` | Describe table<br>Required: `TableName` |
| `DescribeCloudAppVersionList` | Describe cloud app version list<br>Required: `EnvId`, `DeployType`, `ServiceName` |
| `DescribeResourcePermission` | Describe resource permission<br>Required: `EnvId`, `ResourceType` |
| `DescribeEnvAccountCircle` | Describe env account circle<br>Required: `EnvId` |
| `DescribeCreateMySQLResult` | Describe create my sqlresult<br>Required: `EnvId` |
| `DescribeGatewayVersions` | Describe gateway versions<br>Required: `EnvId`, `GatewayId` |
| `DescribeCloudBaseRunBuildLog` | Describe cloud base run build log |
| `DescribeCloudAppVersion` | Describe cloud app version<br>Required: `EnvId`, `ServiceName`, `DeployType` |
| `PreviewPGUserMigrations` | Preview pguser migrations<br>Required: `EnvId`, `Migrations` |
| `DescribeAuthDomains` | Describe auth domains<br>Required: `EnvId` |
| `DescribeMySQLClusterDetail` | Describe my sqlcluster detail<br>Required: `EnvId` |
| `DescribeBillingInfo` | Describe billing info |
| `DescribeDatabaseACL` | Describe database acl<br>Required: `EnvId`, `CollectionName` |
| `DescribeStaticStore` | Describe static store<br>Required: `EnvId` |
| `SearchClsLog` | Search cls log<br>Required: `EnvId`, `StartTime`, `EndTime`, `QueryString`, `Limit` |
| `DescribeQuotaData` | Describe quota data<br>Required: `EnvId`, `MetricName` |
| `DescribeCloudAppCosInfo` | Describe cloud app cos info<br>Required: `EnvId`, `ServiceName`, `DeployType` |
| `DescribeEnvPlans` | Describe env plans |
| `DescribeVmSpec` | Describe vm spec |
## Mutations (gated — need allowlist, 30)

| Action | What it does |
|---|---|
| `CreateEnvResource` | Create env resource<br>Required: `EnvId`, `Resources` |
| `CreateAIModel` | Create aimodel<br>Required: `EnvId`, `GroupName` |
| `VerifyHTTPServiceRoute` | Verify httpservice route<br>Required: `EnvId`, `Domain` |
| `UnbindStorageSource` | Unbind storage source<br>Required: `EnvId` |
| `AddProvider` | Add provider<br>Required: `EnvId`, `Name`, `ProviderType` |
| `CreateUser` | Create user<br>Required: `EnvId`, `Name` |
| `CreateStaticStore` | Create static store<br>Required: `EnvId` |
| `BindStorageSource` | Bind storage source<br>Required: `EnvId`, `StorageConfig` |
| `CreateMySQL` | Create my sql<br>Required: `EnvId`, `DbInstanceType` |
| `CreateEnv` | Create env<br>Required: `Alias`, `PackageId`, `Resources` |
| `RunCommands` | Run commands<br>Required: `MgoCommands` |
| `CreateAuthDomain` | Create auth domain<br>Required: `EnvId`, `Domains` |
| `CreateApiKey` | Create api key<br>Required: `EnvId`, `KeyType` (api_key | publish_key) |
| `RunSql` | Run sql<br>Required: `Sql`, `EnvId` |
| `CreateBillDeal` | Create bill deal<br>Required: `DealType`, `ProductType`, `PackageId` |
| `CreateCloudApp` | Create cloud app<br>Required: `EnvId`, `ServiceName`, `DeployType` |
| `CreateHostingDomain` | Create hosting domain<br>Required: `EnvId`, `Domain`, `CertId` |
| `CreateVmInstance` | Create vm instance<br>Required: `EnvId`, `Type` |
| `RepairPGUserMigrationHistory` | Repair pguser migration history<br>Required: `EnvId`, `MigrationVersion` (format `14…`), `Name`, `Status`, `Reason` |
| `CreateHTTPServiceRoute` | Create httpservice route<br>Required: `EnvId`, `Domain` |
| `CreateCustomLoginKey` | Create custom login key<br>Required: `EnvId` |
| `AssumeRoleForAllocatedEnv` | Run assume role for allocated env<br>Required: `EnvId` |
| `CreateTable` | Create table<br>Required: `TableName` |
| `InquireVmPrice` | Run inquire vm price<br>Required: `Type` |
| `BindCls` | Bind cls<br>Required: `EnvId`, `ClsRegion`, `ClsLogsetId`, `ClsTopicId` |
| `AllocateEnv` | Allocate env<br>Required: `AllocateId` |
| `UpdateAIModel` | Update aimodel<br>Required: `EnvId`, `GroupName` |
| `UpdateTable` | Update table<br>Required: `TableName` |
| `PushPGUserMigrations` | Push pguser migrations<br>Required: `EnvId`, `Migrations` |
| `ExecutePGSql` | Execute pgsql<br>Required: `EnvId`, `Sql` |

## Blocked destructive actions (28)

`ReleaseEnv`, `ModifyClient`, `ModifyResourcePermission`, `RenewEnv`, `DeleteUsers`, `DeleteVmInstance`, `ModifyClsTopic`, `DeleteAuthDomain`, `ModifyEnvExtra`, `ModifyHTTPServiceRoute`, `DeleteProvider`, `ModifyStorageSource`, `DestroyStaticStore`, `ModifyDatabaseACL`, `DeleteApiKey`, `DeleteHTTPServiceRoute`, `ModifySafeRule`, `DeleteAIModel`, `DeleteTable`, `DestroyEnv`, `DestroyMySQL`, `DeleteCloudApp`, `ModifyLoginConfig`, `DeleteCloudAppVersion`, `ModifyEnvPlan`, `ModifyProvider`, `ModifyUser`, `ModifyEnv` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tcb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180608` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tcb"`) for the allow/block decision and reason.

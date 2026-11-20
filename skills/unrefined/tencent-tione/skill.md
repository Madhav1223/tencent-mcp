---
name: tencent-tione
description: Tencent Cloud TIONE via the Tencent MCP server — 75 actions in API version v20211111 (38 read-only auto-allowed). Use for model, training, notebook, billing, mount, source. Triggers on mentions of tione, model, training, notebook, billing, mount, source, accelerate, auth. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: AI services
metadata:
  version: "4"
---

# Tencent Cloud TIONE

AI services: 75 actions in API version `v20211111` — 38 read-only (auto-allowed), 17 gated mutations, 20 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "tione"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

AI APIs are billed per call/token/image — batch and cache where possible; confirm pricing for high-volume use.
Inputs have strict format/size limits (image bytes, audio seconds, text length) — check the model doc constraints before sending; oversized inputs fail, they don't truncate.
Async jobs (batch inference, training) return job IDs — poll the result/query actions until terminal state instead of assuming completion.
Model versions change behavior — pin the version parameter explicitly rather than accepting defaults.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/tione/v20211111 — action signatures in `tione_client.ts`, full request/response shapes in `tione_models.ts`.

## Read actions (auto-allowed, 38)

| Action | What it does |
|---|---|
| `DescribeTrainingModelVersion` | Describe training model version<br>Required: `TrainingModelVersionId` |
| `DescribeModelService` | Describe model service<br>Required: `ServiceId` |
| `DescribeBillingSpecs` | Describe billing specs<br>Required: `ChargeType` |
| `DescribeBillingSpecsPrice` | Describe billing specs price<br>Required: `SpecsParam` |
| `DescribeModelServiceCallInfo` | Describe model service call info<br>Required: `ServiceGroupId` |
| `DescribeMountInstance` | Describe mount instance<br>Required: `Type` |
| `DescribeTrainingTask` | Describe training task<br>Required: `Id` |
| `DescribeMountLimits` | Describe mount limits |
| `DescribeEvents` | Describe events<br>Required: `Service` |
| `DescribeBuildInImages` | Describe build in images |
| `DescribeWorkspaces` | Describe workspaces |
| `DescribeDataSource` | Describe data source |
| `DescribeModelServiceHotUpdated` | Describe model service hot updated<br>Required: `ImageInfo` |
| `DescribeModelAccelerateTask` | Describe model accelerate task<br>Required: `ModelAccTaskId` |
| `DescribeAnnotatedTaskList` | Describe annotated task list<br>Required: `Offset` (default 0), `Limit` (default 10) |
| `DescribeMountInstances` | Describe mount instances<br>Required: `Type` |
| `DescribeBillingResourceGroupAttachedWorkspaces` | Describe billing resource group attached workspaces<br>Required: `ResourceGroupId` |
| `DescribePublicAlgoVersionList` | Describe public algo version list |
| `DescribeTrainingTaskPods` | Describe training task pods<br>Required: `Id` |
| `DescribeTrainingModelVersions` | Describe training model versions<br>Required: `TrainingModelId` |
| `DescribeSubAccountLinuxUserInfos` | Describe sub account linux user infos |
| `DescribeTrainingTaskPodUrl` | Describe training task pod url<br>Required: `PodName` |
| `DescribeDataSources` | Describe data sources |
| `DescribeLogs` | Describe logs<br>Required: `Service` |
| `DescribeDatasets` | Describe datasets |
| `DescribeTrainingTasks` | Describe training tasks |
| `DescribeNotebooks` | Describe notebooks |
| `DescribeModelAccelerateVersions` | Describe model accelerate versions |
| `DescribeBillingResourceInstanceRunningJobs` | Describe billing resource instance running jobs<br>Required: `ResourceGroupId`, `ResourceInstanceId` |
| `DescribeModelServiceGroup` | Describe model service group<br>Required: `ServiceGroupId` |
| `DescribePlatformImages` | Describe platform images |
| `DescribeBillingResourceGroup` | Describe billing resource group<br>Required: `ResourceGroupId` |
| `DescribePresetImageList` | Describe preset image list |
| `DescribeExport` | Describe export<br>Required: `ExportId` |
| `DescribeNotebook` | Describe notebook<br>Required: `Id` |
| `DescribeBillingResourceGroups` | Describe billing resource groups |
| `DescribeInferTemplates` | Describe infer templates |
| `DescribeModelServiceGroups` | Describe model service groups |
## Mutations (gated — need allowlist, 17)

| Action | What it does |
|---|---|
| `CreateTrainingModel` | Create training model<br>Required: `ImportMethod`, `ReasoningEnvironmentSource` |
| `StartTrainingTask` | Start training task<br>Required: `Id` |
| `StartNotebook` | Start notebook<br>Required: `Id` |
| `CreateTrainingTask` | Create training task<br>Required: `Name`, `ChargeType`, `ResourceConfigInfos` |
| `ChatCompletion` | Run chat completion<br>Required: `Model`, `Messages` |
| `CreateDataset` | Create dataset<br>Required: `DatasetName` |
| `CreateNotebook` | Create notebook<br>Required: `Name`, `ChargeType`, `ResourceConf`, `LogEnable`, `RootAccess`, `AutoStopping`, `DirectInternetAccess` |
| `UpdateMountLimit` | Update mount limit<br>Required: `Type`, `StorageId`, `LimitMount` |
| `UpdateDataSource` | Update data source |
| `PushTrainingMetrics` | Push training metrics |
| `CreateModelService` | Create model service |
| `UpdateSubAccountLinuxUserInfo` | Update sub account linux user info |
| `CreatePresignedNotebookUrl` | Create presigned notebook url<br>Required: `Id` |
| `CreateModelServiceAuthToken` | Create model service auth token<br>Required: `ServiceGroupId` |
| `CreateMountLimit` | Create mount limit<br>Required: `Type`, `StorageId` |
| `CreateDataSource` | Create data source |
| `CreateExport` | Create export<br>Required: `Service` |

## Blocked destructive actions (20)

`ModifyModelServiceAuthToken`, `DeleteDataset`, `ModifyModelServiceAuthorization`, `ModifyNotebook`, `DeleteNotebook`, `DeleteModelServiceAuthToken`, `ModifyNotebookTags`, `DeleteTrainingModel`, `ModifyServiceGroupWeights`, `DeleteModelServiceGroup`, `StopTrainingTask`, `DeleteModelService`, `DeleteDataSource`, `ModifyModelService`, `DeleteTrainingTask`, `StopModelAccelerateTask`, `DeleteTrainingModelVersion`, `DeleteExport`, `DeleteMountLimit`, `StopNotebook` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `tione`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20211111` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="tione"`) for the allow/block decision and reason.

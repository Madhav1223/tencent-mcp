---
name: tencent-gs
description: Tencent Cloud GS via the Tencent MCP server — 83 actions in API version v20191118 (10 read-only auto-allowed). Use for android, instances, image, stop, apps, distribute. Triggers on mentions of gs, android, instances, image, stop, apps, distribute, game, publish. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Game services
metadata:
  version: "4"
---

# Tencent Cloud GS

Game services: 83 actions in API version `v20191118` — 10 read-only (auto-allowed), 48 gated mutations, 25 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "gs"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Game backends are region-scoped with player-routing implications — confirm the serving region before fleet changes.
Matchmaking queues and fleet capacity interact — scale fleets before opening queues to production traffic.
Security (anti-cheat, anti-DDoS) policies apply per title/project — scope every change to the right project ID.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/gs/v20191118 — action signatures in `gs_client.ts`, full request/response shapes in `gs_models.ts`.

## Read actions (auto-allowed, 10)

| Action | What it does |
|---|---|
| `DescribeAndroidInstanceLabels` | Describe android instance labels |
| `DescribeAndroidInstanceImages` | Describe android instance images |
| `DescribeAndroidInstanceBackups` | Describe android instance backups |
| `DescribeAndroidInstances` | Describe android instances |
| `DescribeAndroidInstancesAppBlacklist` | Describe android instances app blacklist<br>Required: `AndroidInstanceIds` |
| `DescribeInstancesCount` | Describe instances count |
| `DescribeAndroidInstanceApps` | Describe android instance apps<br>Required: `AndroidInstanceId` |
| `DescribeAndroidApps` | Describe android apps |
| `DescribeAndroidInstancesByApps` | Describe android instances by apps<br>Required: `Offset` (default 0), `Limit` (default 20), `AndroidAppIds` |
| `DescribeAndroidInstanceTasksStatus` | Describe android instance tasks status |
## Mutations (gated — need allowlist, 48)

| Action | What it does |
|---|---|
| `BackUpAndroidInstanceToStorage` | Run back up android instance to storage<br>Required: `AndroidInstanceId`, `StorageType`, `ObjectKey` |
| `TrylockWorker` | Run trylock worker<br>Required: `UserId`, `GameId` |
| `SyncExecuteCommandOnAndroidInstances` | Sync execute command on android instances<br>Required: `AndroidInstanceIds`, `Command` |
| `DisableAndroidInstancesApp` | Disable android instances app<br>Required: `AndroidInstanceIds`, `PackageName` |
| `UploadFileToAndroidInstances` | Upload file to android instances<br>Required: `AndroidInstanceIds`, `FileURL` |
| `RestoreAndroidInstanceFromStorage` | Restore android instance from storage<br>Required: `AndroidInstanceId`, `ObjectKey`, `StorageType` |
| `CleanAndroidInstancesAppData` | Run clean android instances app data<br>Required: `AndroidInstanceIds`, `PackageName` |
| `CreateAndroidInstanceSSH` | Create android instance ssh<br>Required: `AndroidInstanceId`, `ExpiredTime` |
| `CreateAndroidInstancesScreenshot` | Create android instances screenshot<br>Required: `AndroidInstanceIds` |
| `UninstallAndroidInstancesApp` | Uninstall android instances app<br>Required: `AndroidInstanceIds` |
| `CreateAndroidInstanceImage` | Create android instance image<br>Required: `AndroidInstanceImageName`, `AndroidInstanceId` |
| `EnableAndroidInstancesApp` | Enable android instances app<br>Required: `AndroidInstanceIds`, `PackageName` |
| `StartPublishStreamToCSS` | Start publish stream to css<br>Required: `UserId` |
| `InstallAndroidInstancesAppWithURL` | Install android instances app with url<br>Required: `AndroidInstanceIds`, `AndroidAppURL` |
| `RestoreAndroidInstance` | Restore android instance<br>Required: `AndroidInstanceId`, `BackupId` |
| `StartAndroidInstancesApp` | Start android instances app<br>Required: `AndroidInstanceIds`, `PackageName` |
| `DistributeAndroidInstanceImageToHosts` | Distribute android instance image to hosts<br>Required: `HostSerialNumbers`, `ImageId` |
| `CreateAndroidInstanceLabel` | Create android instance label<br>Required: `Key` |
| `CreateAndroidInstanceAcceleratorToken` | Create android instance accelerator token<br>Required: `AndroidInstanceIds` |
| `CreateAndroidApp` | Create android app<br>Required: `Name` |
| `CreateAndroidInstanceWebShell` | Create android instance web shell<br>Required: `AndroidInstanceId` |
| `StartPublishStream` | Start publish stream<br>Required: `UserId`, `PublishUrl` |
| `UploadFilesToAndroidInstances` | Upload files to android instances |
| `SyncAndroidInstanceImage` | Sync android instance image<br>Required: `AndroidInstanceImageId`, `DestinationZones` |
| `DistributePhotoToAndroidInstances` | Distribute photo to android instances<br>Required: `AndroidInstanceIds`, `PhotoURL` |
| `DisconnectAndroidInstanceAccelerator` | Disconnect android instance accelerator<br>Required: `AndroidInstanceId` |
| `CreateAndroidInstances` | Create android instances<br>Required: `Zone`, `Type`, `Number` |
| `CreateCosCredential` | Create cos credential<br>Required: `CosType` |
| `BackUpAndroidInstance` | Run back up android instance<br>Required: `AndroidInstanceId` |
| `StartAndroidInstances` | Start android instances<br>Required: `AndroidInstanceIds` |
| `ConnectAndroidInstance` | Connect android instance<br>Required: `ClientSession`, `AndroidInstanceId`, `UserIp` |
| `DisconnectAndroidInstance` | Disconnect android instance<br>Required: `AndroidInstanceId` |
| `SwitchGameArchive` | Switch game archive<br>Required: `UserId`, `GameId` |
| `DistributeFileToAndroidInstances` | Distribute file to android instances<br>Required: `AndroidInstanceIds`, `FileURL`, `DestinationDirectory` |
| `RebootAndroidInstanceHosts` | Reboot android instance hosts<br>Required: `HostSerialNumbers` |
| `CreateSession` | Create session<br>Required: `UserId`, `GameId` |
| `InstallAndroidInstancesApp` | Install android instances app<br>Required: `AndroidInstanceIds`, `AndroidAppId` |
| `SetAndroidInstancesFGAppKeepAlive` | Set android instances fgapp keep alive<br>Required: `AndroidInstanceIds`, `Operation` |
| `CreateAndroidInstancesAccessToken` | Create android instances access token<br>Required: `AndroidInstanceIds` |
| `CopyAndroidInstance` | Copy android instance<br>Required: `SourceAndroidInstanceId`, `TargetAndroidInstanceId` |
| `CreateAndroidAppVersion` | Create android app version<br>Required: `AndroidAppId` |
| `CreateAndroidInstanceADB` | Create android instance adb<br>Required: `AndroidInstanceId` |
| `SetAndroidInstancesBGAppKeepAlive` | Set android instances bgapp keep alive<br>Required: `AndroidInstanceIds`, `Operation`, `PackageNames` |
| `FetchAndroidInstancesLogs` | Fetch android instances logs<br>Required: `AndroidInstanceIds`, `BucketName`, `BucketRegion` |
| `ExecuteCommandOnAndroidInstances` | Execute command on android instances<br>Required: `AndroidInstanceIds`, `Command` |
| `RebootAndroidInstances` | Reboot android instances<br>Required: `AndroidInstanceIds` |
| `ImportAndroidInstanceImage` | Import android instance image<br>Required: `Name`, `URL`, `MD5` |
| `SaveGameArchive` | Run save game archive<br>Required: `UserId`, `GameId` |

## Blocked destructive actions (25)

`ModifyAndroidInstancesUserId`, `ModifyAndroidInstancesProperties`, `StopAndroidInstances`, `DeleteAndroidInstanceBackups`, `ModifyAndroidInstanceInformation`, `DeleteAndroidInstanceImages`, `ModifyAndroidInstancesInformation`, `ModifyAndroidInstancesAppBlacklist`, `RenewAndroidInstancesAccessToken`, `RestartAndroidInstancesApp`, `ModifyAndroidInstancesResolution`, `DeleteAndroidInstanceLabel`, `ModifyAndroidInstancesResources`, `StopAndroidInstancesApp`, `ModifyAndroidApp`, `ModifyAndroidInstanceResolution`, `StopPublishStream`, `DeleteAndroidAppVersion`, `ResetAndroidInstances`, `DestroyAndroidInstances`, `DeleteAndroidApp`, `StopGame`, `DeleteAndroidInstanceBackupFiles`, `ModifyAndroidAppVersion`, `ModifyAndroidInstancesLabels` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `gs`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20191118` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="gs"`) for the allow/block decision and reason.

---
name: tencent-as
description: Tencent Cloud AS via the Tencent MCP server — 58 actions in API version v20180419 (12 read-only auto-allowed). Use for scaling, auto, instances, configuration, launch, lifecycle. Triggers on mentions of as, scaling, auto, instances, configuration, launch, lifecycle, refresh, action. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud AS

Compute instances & pools: 58 actions in API version `v20180419` — 12 read-only (auto-allowed), 27 gated mutations, 19 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "as"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/as/v20180419 — action signatures in `as_client.ts`, full request/response shapes in `as_models.ts`.

## Read actions (auto-allowed, 12)

| Action | What it does |
|---|---|
| `DescribeNotificationConfigurations` | Describe notification configurations |
| `DescribeRefreshActivities` | Describe refresh activities |
| `DescribeScalingPolicies` | Describe scaling policies |
| `DescribeAutoScalingAdvices` | Describe auto scaling advices<br>Required: `AutoScalingGroupIds` |
| `DescribeAutoScalingInstances` | Describe auto scaling instances |
| `DescribeLaunchConfigurations` | Describe launch configurations |
| `DescribeAutoScalingGroupLastActivities` | Describe auto scaling group last activities<br>Required: `AutoScalingGroupIds` |
| `DescribeLifecycleHooks` | Describe lifecycle hooks |
| `DescribeScheduledActions` | Describe scheduled actions |
| `DescribeAutoScalingGroups` | Describe auto scaling groups |
| `DescribeAutoScalingActivities` | Describe auto scaling activities |
| `DescribeAccountLimits` | Describe account limits |
## Mutations (gated — need allowlist, 27)

| Action | What it does |
|---|---|
| `ExecuteScalingPolicy` | Execute scaling policy<br>Required: `AutoScalingPolicyId` |
| `CreateAutoScalingGroup` | Create auto scaling group<br>Required: `AutoScalingGroupName`, `LaunchConfigurationId`, `MaxSize`, `MinSize`, `VpcId` |
| `ClearLaunchConfigurationAttributes` | Run clear launch configuration attributes<br>Required: `LaunchConfigurationId` |
| `StartInstanceRefresh` | Start instance refresh<br>Required: `AutoScalingGroupId`, `RefreshSettings` |
| `ScaleOutInstances` | Scale out instances<br>Required: `AutoScalingGroupId`, `ScaleOutNumber` |
| `ExitStandby` | Exit standby<br>Required: `AutoScalingGroupId`, `InstanceIds` |
| `StartAutoScalingInstances` | Start auto scaling instances<br>Required: `AutoScalingGroupId`, `InstanceIds` |
| `UpgradeLaunchConfiguration` | Upgrade launch configuration<br>Required: `LaunchConfigurationId`, `ImageId`, `InstanceTypes`, `LaunchConfigurationName` |
| `DetachLoadBalancers` | Detach load balancers<br>Required: `AutoScalingGroupId` |
| `AttachInstances` | Attach instances<br>Required: `AutoScalingGroupId`, `InstanceIds` |
| `AttachLoadBalancers` | Attach load balancers<br>Required: `AutoScalingGroupId` |
| `DetachInstances` | Detach instances<br>Required: `AutoScalingGroupId`, `InstanceIds` |
| `ScaleInInstances` | Scale in instances<br>Required: `AutoScalingGroupId`, `ScaleInNumber` |
| `CreateScheduledAction` | Create scheduled action<br>Required: `AutoScalingGroupId`, `ScheduledActionName`, `MinSize`, `StartTime` (format `YYYY-MM-DDThh…`), `DesiredCapacity`, `MaxSize` |
| `SetInstancesProtection` | Set instances protection<br>Required: `AutoScalingGroupId`, `InstanceIds`, `ProtectedFromScaleIn` |
| `CompleteLifecycleAction` | Complete lifecycle action<br>Required: `LifecycleHookId`, `LifecycleActionResult` |
| `RollbackInstanceRefresh` | Roll back instance refresh<br>Required: `AutoScalingGroupId`, `RefreshSettings`, `OriginRefreshActivityId` |
| `CreateLaunchConfiguration` | Create launch configuration<br>Required: `LaunchConfigurationName` |
| `CreateNotificationConfiguration` | Create notification configuration<br>Required: `AutoScalingGroupId`, `NotificationTypes` |
| `CreateAutoScalingGroupFromInstance` | Create auto scaling group from instance<br>Required: `AutoScalingGroupName`, `InstanceId`, `MinSize`, `MaxSize` |
| `CreateLifecycleHook` | Create lifecycle hook<br>Required: `AutoScalingGroupId`, `LifecycleHookName`, `LifecycleTransition` |
| `UpgradeLifecycleHook` | Upgrade lifecycle hook<br>Required: `LifecycleHookId`, `LifecycleHookName`, `LifecycleTransition` |
| `DisableAutoScalingGroup` | Disable auto scaling group<br>Required: `AutoScalingGroupId` |
| `EnterStandby` | Enter standby<br>Required: `AutoScalingGroupId`, `InstanceIds` |
| `CreateScalingPolicy` | Create scaling policy<br>Required: `AutoScalingGroupId`, `ScalingPolicyName` |
| `EnableAutoScalingGroup` | Enable auto scaling group<br>Required: `AutoScalingGroupId` |
| `ResumeInstanceRefresh` | Resume instance refresh<br>Required: `AutoScalingGroupId`, `RefreshActivityId` |

## Blocked destructive actions (19)

`StopInstanceRefresh`, `ModifyScalingPolicy`, `ModifyLoadBalancerTargetAttributes`, `DeleteAutoScalingGroup`, `ModifyLifecycleHook`, `DeleteScheduledAction`, `RemoveInstances`, `DeleteScalingPolicy`, `ModifyLoadBalancers`, `ModifyDesiredCapacity`, `ModifyNotificationConfiguration`, `StopAutoScalingInstances`, `ModifyAutoScalingGroup`, `DeleteLaunchConfiguration`, `DeleteLifecycleHook`, `ModifyScheduledAction`, `DeleteNotificationConfiguration`, `CancelInstanceRefresh`, `ModifyLaunchConfigurationAttributes` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `as`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180419` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="as"`) for the allow/block decision and reason.

---
name: tencent-clb
description: Tencent Cloud CLB via the Tencent MCP server — 160 actions in API version v20180317 (58 read-only auto-allowed). Use for model, load, router, balancer, target, targets. Triggers on mentions of clb, model, load, router, balancer, target, targets, attributes, balancers. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud CLB

Networking & traffic: 160 actions in API version `v20180317` — 58 read-only (auto-allowed), 59 gated mutations, 43 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "clb"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/clb/v20180317 — action signatures in `clb_client.ts`, full request/response shapes in `clb_models.ts`.

## Read actions (auto-allowed, 58)

| Action | What it does |
|---|---|
| `DescribeCustomizedConfigAssociateList` | Describe customized config associate list |
| `InquiryPriceModifyLoadBalancer` | Inquire the price of: modify load balancer<br>Required: `LoadBalancerId`, `InternetAccessible` |
| `DescribeExclusiveClusters` | Describe exclusive clusters |
| `DescribeModelRouterLogs` | Describe model router logs<br>Required: `ModelRouterId` |
| `DescribeModelNames` | Describe model names |
| `DescribeAsyncJobs` | Describe async jobs |
| `DescribeIntentRouters` | Describe intent routers<br>Required: `ModelRouterId` |
| `DescribeIntentRouterTiers` | Describe intent router tiers |
| `DescribeListeners` | Describe listeners<br>Required: `LoadBalancerId` |
| `DescribeUpperModels` | Describe upper models |
| `DescribeTargetGroupInstanceStatus` | Describe target group instance status<br>Required: `TargetGroupId` |
| `DescribeModelAliases` | Describe model aliases |
| `DescribeBlockIPTask` | Describe block iptask<br>Required: `TaskId` |
| `DescribeModelRouters` | Describe model routers |
| `DescribeSupportedProviders` | Describe supported providers |
| `InquiryPriceRefundLoadBalancer` | Inquire the price of: refund load balancer<br>Required: `LoadBalancerId` |
| `DescribeUserGroups` | Describe user groups<br>Required: `ModelRouterId` |
| `DescribeModelRewrite` | Describe model rewrite<br>Required: `ModelRouterId` |
| `DescribeResources` | Describe resources |
| `DescribeModelAssociations` | Describe model associations<br>Required: `ModelRouterId` |
| `DescribeLBListeners` | Describe lblisteners<br>Required: `Backends` |
| `DescribeCustomizedConfigList` | Describe customized config list<br>Required: `ConfigType` |
| `DescribeModelRouterQuota` | Describe model router quota<br>Required: `QuotaTypes` |
| `DescribeQuota` | Describe quota |
| `DescribeClusterResources` | Describe cluster resources |
| `DescribeModelRouterResourcePackageDeduction` | Describe model router resource package deduction<br>Required: `DeductionTimeBegin`, `DeductionTimeEnd`, `ModelRouterResourcePackageId` |
| `DescribeRewrite` | Describe rewrite<br>Required: `LoadBalancerId` |
| `DescribeKeys` | Describe keys<br>Required: `ModelRouterId` |
| `DescribeLoadBalancersDetail` | Describe load balancers detail |
| `DescribeClassicalLBByInstanceId` | Describe classical lbby instance id<br>Required: `InstanceIds` |
| `DescribeLoadBalancerTraffic` | Describe load balancer traffic |
| `DescribeCrossTargets` | Describe cross targets |
| `DescribeAssociatedModelAvailability` | Describe associated model availability |
| `DescribeModelRouterGuardrails` | Describe model router guardrails<br>Required: `ModelRouterId` |
| `InquiryPriceRenewLoadBalancer` | Inquire the price of: renew load balancer<br>Required: `LoadBalancerId`, `LoadBalancerChargePrepaid` |
| `DescribeLoadBalancerOverview` | Describe load balancer overview |
| `InquiryPriceCreateLoadBalancer` | Inquire the price of: create load balancer<br>Required: `LoadBalancerType`, `LoadBalancerChargeType` |
| `DescribeBudgets` | Describe budgets |
| `DescribeTargets` | Describe targets<br>Required: `LoadBalancerId` |
| `DescribeTaskStatus` | Describe task status |
| `DescribeTargetHealth` | Describe target health<br>Required: `LoadBalancerIds` |
| `DescribeTargetGroupList` | Describe target group list |
| `DescribeTargetGroups` | Describe target groups |
| `DescribeModelRouterResourcePackages` | Describe model router resource packages |
| `DescribeIdleLoadBalancers` | Describe idle load balancers |
| `DescribeClassicalLBListeners` | Describe classical lblisteners<br>Required: `LoadBalancerId` |
| `DescribeBudgetAssociations` | Describe budget associations<br>Required: `BudgetId` |
| `DescribeLoadBalancerListByCertId` | Describe load balancer list by cert id<br>Required: `CertIds` |
| `DescribeLoadBalancers` | Describe load balancers |
| `DescribeBlockIPList` | Describe block iplist<br>Required: `LoadBalancerId` |
| `DescribeClassicalLBTargets` | Describe classical lbtargets<br>Required: `LoadBalancerId` |
| `DescribeLBOperateProtect` | Describe lboperate protect<br>Required: `LoadBalancerIds` |
| `DescribeClsLogSet` | Describe cls log set |
| `DescribeModelKeys` | Describe model keys |
| `DescribeServiceProviderHealthStatus` | Describe service provider health status<br>Required: `ServiceProviderId` |
| `DescribeModelRouterDetail` | Describe model router detail<br>Required: `ModelRouterId` |
| `DescribeClassicalLBHealthStatus` | Describe classical lbhealth status<br>Required: `LoadBalancerId` |
| `DescribeTargetGroupInstances` | Describe target group instances<br>Required: `Filters` |
## Mutations (gated — need allowlist, 59)

| Action | What it does |
|---|---|
| `InquirePriceRefundModelRouterResourcePackage` | Inquire the price of: refund model router resource package<br>Required: `ModelRouterResourcePackageIds` |
| `AssociateModelsToModelRouter` | Associate models to model router<br>Required: `ModelRouterId` |
| `RefundModelRouterResourcePackage` | Refund model router resource package<br>Required: `ModelRouterResourcePackageIds` |
| `DisassociateTargetGroups` | Run disassociate target groups<br>Required: `Associations` |
| `BatchDeregisterTargets` | Run batch deregister targets<br>Required: `LoadBalancerId`, `Targets` |
| `AutoRewrite` | Run auto rewrite<br>Required: `LoadBalancerId`, `ListenerId` |
| `AssociateCustomizedConfig` | Associate customized config<br>Required: `UconfigId`, `BindList` |
| `DisassociateBudget` | Run disassociate budget<br>Required: `BudgetId`, `Resources` |
| `DeregisterTargetsFromClassicalLB` | Run deregister targets from classical lb<br>Required: `LoadBalancerId`, `InstanceIds` |
| `AssociateTargetGroups` | Associate target groups<br>Required: `Associations` |
| `DeregisterTargetGroupInstances` | Run deregister target group instances<br>Required: `TargetGroupId`, `TargetGroupInstances` |
| `CreateTopic` | Create topic<br>Required: `TopicName` |
| `SetCustomizedConfigForLoadBalancer` | Set customized config for load balancer<br>Required: `OperationType` |
| `CreateModel` | Create model<br>Required: `AccessType` |
| `RegisterTargetsWithClassicalLB` | Register targets with classical lb<br>Required: `LoadBalancerId`, `Targets` |
| `DeregisterTargets` | Run deregister targets<br>Required: `LoadBalancerId` (format `lb-12345678…`), `ListenerId` (format `lbl-12345678…`), `Targets` |
| `CreateUserGroup` | Create user group<br>Required: `ModelRouterId`, `UserGroupName` |
| `BatchModifyTargetWeight` | Run batch modify target weight<br>Required: `LoadBalancerId`, `ModifyList` |
| `DisassociateCustomizedConfig` | Run disassociate customized config<br>Required: `UconfigId`, `BindList` |
| `SetLoadBalancerSecurityGroups` | Set load balancer security groups<br>Required: `LoadBalancerId` |
| `SetSecurityGroupForLoadbalancers` | Set security group for loadbalancers<br>Required: `SecurityGroup`, `OperationType`, `LoadBalancerIds` |
| `RegisterTargetGroupInstances` | Register target group instances<br>Required: `TargetGroupId`, `TargetGroupInstances` |
| `SetLoadBalancerStartStatus` | Set load balancer start status<br>Required: `OperationType`, `LoadBalancerId` |
| `InquirePriceCreateModelRouterResourcePackage` | Inquire the price of: create model router resource package<br>Required: `ModelRouterResourcePackageAmount` |
| `BatchRegisterTargets` | Run batch register targets<br>Required: `LoadBalancerId`, `Targets` |
| `RegisterFunctionTargets` | Register function targets<br>Required: `LoadBalancerId`, `ListenerId`, `FunctionTargets` |
| `CreateKey` | Create key<br>Required: `ModelRouterId` |
| `AssociateModelRouterGuardrails` | Associate model router guardrails<br>Required: `Guardrails` (default WAF), `ModelRouterId` |
| `SetLoadBalancerClsLog` | Set load balancer cls log<br>Required: `LoadBalancerId`, `LogSetId`, `LogTopicId` |
| `DeregisterFunctionTargets` | Run deregister function targets<br>Required: `LoadBalancerId`, `ListenerId`, `FunctionTargets` |
| `ManualRewrite` | Run manual rewrite<br>Required: `LoadBalancerId`, `SourceListenerId`, `TargetListenerId`, `RewriteInfos` |
| `RegenerateKeys` | Run regenerate keys<br>Required: `ModelRouterId` |
| `CreateRule` | Create rule<br>Required: `LoadBalancerId`, `ListenerId`, `Rules` |
| `AssociateBudget` | Associate budget<br>Required: `BudgetId`, `Resources` |
| `AddModelKey` | Add model key<br>Required: `ServiceProviderId`, `Keys` |
| `TestModelInputModalities` | Test model input modalities<br>Required: `Model` |
| `CreateKeys` | Create keys<br>Required: `ModelRouterId` |
| `AddModelRewrite` | Add model rewrite<br>Required: `ModelRouterId`, `SourceModel`, `TargetModel` |
| `DisassociateModelsFromModelRouter` | Run disassociate models from model router<br>Required: `ModelRouterId` |
| `CreateIntentRouter` | Create intent router<br>Required: `ModelRouterId`, `RouteName`, `Tiers` |
| `TestServiceProviderConnection` | Test service provider connection |
| `CreateClsLogSet` | Create cls log set |
| `ReplaceCertForLoadBalancers` | Replace cert for load balancers<br>Required: `OldCertificateId`, `Certificate` |
| `ChatCompletions` | Run chat completions |
| `CreateLoadBalancer` | Create load balancer<br>Required: `LoadBalancerType` |
| `RegisterTargets` | Register targets<br>Required: `LoadBalancerId`, `ListenerId`, `Targets` |
| `CreateBudget` | Create budget |
| `CreateBYOKNetwork` | Create byoknetwork<br>Required: `SubnetId` (format `subnet-xxxxxxxx…`), `VpcId` (format `vpc-xxxxxxxx…`) |
| `DeregisterModelsFromServiceProvider` | Run deregister models from service provider<br>Required: `ServiceProviderId` |
| `RegisterModelsToServiceProvider` | Register models to service provider<br>Required: `ServiceProviderId` |
| `CreateListener` | Create listener<br>Required: `LoadBalancerId`, `Ports`, `Protocol` |
| `CreateModelRouterResourcePackage` | Create model router resource package<br>Required: `ModelRouterResourcePackageAmount` |
| `CreateTargetGroup` | Create target group |
| `CreateModelRouter` | Create model router<br>Required: `ModelRouterType` |
| `MigrateClassicalLoadBalancers` | Migrate classical load balancers<br>Required: `LoadBalancerIds` |
| `DisassociateModelRouterGuardrails` | Run disassociate model router guardrails<br>Required: `Guardrails`, `ModelRouterId` |
| `CreateLoadBalancerSnatIps` | Create load balancer snat ips<br>Required: `LoadBalancerId`, `SnatIps` (default 10) |
| `CloneLoadBalancer` | Clone load balancer<br>Required: `LoadBalancerId` |
| `BatchModifyTargetTag` | Run batch modify target tag<br>Required: `LoadBalancerId`, `ModifyList` |

## Blocked destructive actions (43)

`ModifyTargetGroupInstancesWeight`, `RemoveModelKey`, `ModifyTargetGroupAttribute`, `ModifyLoadBalancersProject`, `ModifyLoadBalancerAttributes`, `DeleteModel`, `ModifyServiceProviderModelAttributes`, `ModifyKeysUserGroup`, `DeleteRewrite`, `DeleteListener`, `ModifyModelRouterGuardrails`, `ModifyListener`, `ModifyBudgetAttributes`, `ModifyKeysBlockStatus`, `ModifyTargetGroupInstancesPort`, `ModifyModelAliasAttributes`, `ModifyIntentRouterAttribute`, `ModifyTargetPort`, `ModifyLoadBalancerSla`, `ModifyRule`, `DeleteModelRouters`, `DeleteIntentRouter`, `ModifyKeyAttributes`, `ModifyFunctionTargets`, `DeleteLoadBalancerSnatIps`, `ModifyLoadBalancerMixIpTarget`, `ModifyModelAttributes`, `ModifyDomain`, `ModifyBlockIPList`, `DeleteLoadBalancer`, `DeleteRule`, `DeleteKeys`, `ModifyModelRouterAttributes`, `DeleteUserGroups`, `RenewLoadBalancers`, `DeleteLoadBalancerListeners`, `DeleteTargetGroups`, `ModifyDomainAttributes`, `DeleteBudgets`, `ModifyTargetWeight`, `RemoveModelRewrite`, `ModifyUserGroupAttributes`, `ModifyModelRouterSecurityGroups` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `clb`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180317` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="clb"`) for the allow/block decision and reason.

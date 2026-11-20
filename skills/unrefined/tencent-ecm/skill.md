---
name: tencent-ecm
description: Tencent Cloud ECM via the Tencent MCP server — 132 actions in API version v20190719 (39 read-only auto-allowed). Use for security, addresses, instances, module, attribute, image. Triggers on mentions of ecm, security, addresses, instances, module, attribute, image, network, load. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud ECM

Compute instances & pools: 132 actions in API version `v20190719` — 39 read-only (auto-allowed), 45 gated mutations, 48 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "ecm"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/ecm/v20190719 — action signatures in `ecm_client.ts`, full request/response shapes in `ecm_models.ts`.

## Read actions (auto-allowed, 39)

| Action | What it does |
|---|---|
| `DescribeConfig` | Describe config |
| `DescribeTaskResult` | Describe task result<br>Required: `EcmRegion`, `TaskId` |
| `DescribeRouteTables` | Describe route tables |
| `DescribeAddresses` | Describe addresses<br>Required: `EcmRegion` |
| `DescribeListeners` | Describe listeners<br>Required: `LoadBalancerId` |
| `DescribeNode` | Describe node |
| `DescribeCustomImageTask` | Describe custom image task<br>Required: `Filters` |
| `DescribeLoadBalancers` | Describe load balancers |
| `DescribeLoadBalanceTaskStatus` | Describe load balance task status<br>Required: `TaskId` |
| `DescribeVpcs` | Describe vpcs |
| `DescribeImage` | Describe image |
| `DescribeModule` | Describe module |
| `DescribeInstancesDeniedActions` | Describe instances denied actions<br>Required: `InstanceIdSet` |
| `DescribeImportImageOs` | Describe import image os |
| `DescribeMonthPeakNetwork` | Describe month peak network<br>Required: `Month` |
| `DescribeTargetHealth` | Describe target health<br>Required: `LoadBalancerIds` |
| `DescribeRouteConflicts` | Describe route conflicts<br>Required: `RouteTableId`, `DestinationCidrBlocks` |
| `DescribePriceRunInstance` | Describe price run instance<br>Required: `InstanceType`, `SystemDisk`, `InstanceCount` |
| `DescribeBaseOverview` | Describe base overview |
| `DescribeRegionIpv6Addresses` | Describe region ipv6 addresses<br>Required: `EcmRegion` |
| `DescribeModuleDetail` | Describe module detail<br>Required: `ModuleId` |
| `DescribeInstanceTypeConfig` | Describe instance type config |
| `DescribePackingQuotaGroup` | Describe packing quota group |
| `DescribeNetworkInterfaces` | Describe network interfaces |
| `DescribeTaskStatus` | Describe task status<br>Required: `TaskSet` |
| `DescribePeakNetworkOverview` | Describe peak network overview |
| `DescribeInstanceVncUrl` | Describe instance vnc url<br>Required: `InstanceId` |
| `DescribeSecurityGroupLimits` | Describe security group limits |
| `DescribeHaVips` | Describe ha vips |
| `QueryVpcTaskResult` | Query vpc task result<br>Required: `TaskId` |
| `DescribeAddressQuota` | Describe address quota<br>Required: `EcmRegion` |
| `DescribeSubnets` | Describe subnets |
| `DescribeInstances` | Describe instances |
| `DescribeSecurityGroups` | Describe security groups |
| `DescribeSecurityGroupPolicies` | Describe security group policies<br>Required: `SecurityGroupId` |
| `DescribeDefaultSubnet` | Describe default subnet<br>Required: `EcmRegion`, `Zone` |
| `DescribeTargets` | Describe targets<br>Required: `LoadBalancerId` |
| `DescribeSecurityGroupAssociationStatistics` | Describe security group association statistics<br>Required: `SecurityGroupIds` |
| `DescribePeakBaseOverview` | Describe peak base overview |
## Mutations (gated — need allowlist, 45)

| Action | What it does |
|---|---|
| `ReplaceSecurityGroupPolicy` | Replace security group policy<br>Required: `SecurityGroupId`, `SecurityGroupPolicySet` |
| `CreateRouteTable` | Create route table<br>Required: `VpcId`, `RouteTableName`, `EcmRegion` |
| `BatchDeregisterTargets` | Run batch deregister targets<br>Required: `LoadBalancerId`, `Targets` |
| `AssignIpv6CidrBlocks` | Run assign ipv6 cidr blocks<br>Required: `VpcId`, `ISPTypes` |
| `RunInstances` | Run instances<br>Required: `ZoneInstanceCountISPSet` |
| `ImportImage` | Import image<br>Required: `ImageId`, `ImageDescription`, `SourceRegion` |
| `CreateImage` | Create image<br>Required: `ImageName`, `InstanceId` |
| `AssignIpv6CidrBlock` | Run assign ipv6 cidr block<br>Required: `VpcId`, `ISPType` |
| `BatchModifyTargetWeight` | Run batch modify target weight<br>Required: `LoadBalancerId`, `ModifyList` |
| `DisassociateSecurityGroups` | Run disassociate security groups<br>Required: `SecurityGroupIds`, `InstanceIds` |
| `CreateSubnet` | Create subnet<br>Required: `VpcId`, `SubnetName`, `CidrBlock`, `Zone`, `EcmRegion` |
| `StartInstances` | Start instances<br>Required: `InstanceIdSet` |
| `DisassociateAddress` | Run disassociate address<br>Required: `EcmRegion`, `AddressId` |
| `CreateVpc` | Create vpc<br>Required: `VpcName`, `CidrBlock`, `EcmRegion` |
| `AssignIpv6SubnetCidrBlock` | Run assign ipv6 subnet cidr block<br>Required: `VpcId`, `Ipv6SubnetCidrBlocks` |
| `SetLoadBalancerSecurityGroups` | Set load balancer security groups<br>Required: `LoadBalancerId` |
| `AllocateAddresses` | Allocate addresses<br>Required: `EcmRegion` |
| `DisassociateInstancesKeyPairs` | Run disassociate instances key pairs<br>Required: `InstanceIds`, `KeyIds` |
| `AssociateAddress` | Associate address<br>Required: `EcmRegion`, `AddressId` |
| `AllocateIpv6AddressesBandwidth` | Allocate ipv6 addresses bandwidth<br>Required: `EcmRegion`, `Ipv6Addresses` |
| `BatchRegisterTargets` | Run batch register targets<br>Required: `LoadBalancerId`, `Targets` |
| `CreateNetworkInterface` | Create network interface<br>Required: `VpcId`, `NetworkInterfaceName`, `SubnetId`, `EcmRegion` |
| `DetachNetworkInterface` | Detach network interface<br>Required: `NetworkInterfaceId`, `InstanceId`, `EcmRegion` |
| `ReplaceRoutes` | Replace routes<br>Required: `RouteTableId`, `Routes` |
| `UnassignIpv6SubnetCidrBlock` | Run unassign ipv6 subnet cidr block<br>Required: `VpcId`, `Ipv6SubnetCidrBlocks` |
| `DisableRoutes` | Disable routes<br>Required: `RouteTableId`, `RouteIds` |
| `ReplaceRouteTableAssociation` | Replace route table association<br>Required: `SubnetId`, `RouteTableId`, `EcmRegion` |
| `AttachNetworkInterface` | Attach network interface<br>Required: `NetworkInterfaceId`, `InstanceId`, `EcmRegion` |
| `CreateKeyPair` | Create key pair<br>Required: `KeyName` |
| `AssociateSecurityGroups` | Associate security groups<br>Required: `SecurityGroupIds`, `InstanceIds` |
| `CreateSecurityGroup` | Create security group<br>Required: `GroupName`, `GroupDescription` |
| `ImportCustomImage` | Import custom image<br>Required: `ImageName`, `Architecture`, `OsType`, `OsVersion` |
| `SetSecurityGroupForLoadbalancers` | Set security group for loadbalancers<br>Required: `LoadBalancerIds`, `SecurityGroup`, `OperationType` |
| `RebootInstances` | Reboot instances<br>Required: `InstanceIdSet` |
| `AssignIpv6Addresses` | Run assign ipv6 addresses<br>Required: `EcmRegion`, `NetworkInterfaceId` |
| `MigratePrivateIpAddress` | Migrate private ip address<br>Required: `EcmRegion`, `SourceNetworkInterfaceId`, `DestinationNetworkInterfaceId`, `PrivateIpAddress` |
| `CreateLoadBalancer` | Create load balancer<br>Required: `EcmRegion`, `LoadBalancerType`, `VipIsp` |
| `AssignPrivateIpAddresses` | Run assign private ip addresses<br>Required: `NetworkInterfaceId`, `EcmRegion` |
| `CreateModule` | Create module<br>Required: `ModuleName`, `DefaultBandWidth` (unit: Mbps), `DefaultImageId`, `InstanceType`, `DefaultSystemDiskSize` (unit: GB), `DefaultDataDiskSize` (unit: GB) |
| `EnableRoutes` | Enable routes<br>Required: `RouteTableId`, `RouteIds` |
| `CreateHaVip` | Create ha vip<br>Required: `VpcId`, `SubnetId`, `HaVipName` |
| `MigrateNetworkInterface` | Migrate network interface<br>Required: `EcmRegion`, `NetworkInterfaceId`, `SourceInstanceId`, `DestinationInstanceId` |
| `CreateListener` | Create listener<br>Required: `LoadBalancerId`, `Ports`, `Protocol` |
| `CreateRoutes` | Create routes<br>Required: `RouteTableId`, `Routes` |
| `CreateSecurityGroupPolicies` | Create security group policies<br>Required: `SecurityGroupId`, `SecurityGroupPolicySet` |

## Blocked destructive actions (48)

`ModifyModuleName`, `ModifyInstancesAttribute`, `ResetRoutes`, `ModifyPrivateIpAddressesAttribute`, `ModifyModuleImage`, `DeleteSecurityGroup`, `ModifyAddressesBandwidth`, `ResetInstancesMaxBandwidth`, `DeleteListener`, `ModifyLoadBalancerAttributes`, `ModifyModuleDisableWanIp`, `ModifyListener`, `DeleteSubnet`, `ModifyIpv6AddressesBandwidth`, `StopInstances`, `ResetInstances`, `ModifyTargetPort`, `DeleteNetworkInterface`, `DeleteModule`, `ReleaseIpv6Addresses`, `RemovePrivateIpAddresses`, `ModifyIpv6AddressesAttribute`, `DeleteSecurityGroupPolicies`, `ModifyModuleConfig`, `ModifySecurityGroupAttribute`, `DeleteLoadBalancer`, `DeleteRoutes`, `ModifySecurityGroupPolicies`, `ModifySubnetAttribute`, `ModifyImageAttribute`, `TerminateInstances`, `DeleteRouteTable`, `ModifyDefaultSubnet`, `ModifyModuleNetwork`, `DeleteHaVip`, `DeleteLoadBalancerListeners`, `DeleteVpc`, `ResetInstancesPassword`, `ReleaseIpv6AddressesBandwidth`, `ModifyRouteTableAttribute`, `ModifyTargetWeight`, `ModifyModuleSecurityGroups`, `ModifyHaVipAttribute`, `ReleaseAddresses`, `ModifyModuleIpDirect`, `ModifyVpcAttribute`, `ModifyAddressAttribute`, `DeleteImage` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `ecm`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20190719` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="ecm"`) for the allow/block decision and reason.

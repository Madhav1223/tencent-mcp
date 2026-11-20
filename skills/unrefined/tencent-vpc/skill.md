---
name: tencent-vpc
description: Tencent Cloud VPC via the Tencent MCP server — 448 actions in API version v20170312 (137 read-only auto-allowed). Use for gateway, route, attribute, routes, addresses, address. Triggers on mentions of vpc, gateway, route, attribute, routes, addresses, address, bandwidth, network. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Networking & traffic
metadata:
  version: "4"
---

# Tencent Cloud VPC

Networking & traffic: 448 actions in API version `v20170312` — 137 read-only (auto-allowed), 159 gated mutations, 152 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "vpc"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Network resources are region-scoped and reference each other by ID (VPC ID, subnet ID, CLB ID). Always resolve IDs with `Describe*` first — names are not accepted where IDs are required.
CIDR blocks cannot overlap within a VPC's route domain; check existing routes/CIDRs before creating subnets, peering, or CCN attachments.
Bandwidth and CLB listener changes apply async — re-read the resource after mutation. Security-group and ACL edits take effect immediately and can drop live traffic: confirm direction (ingress/egress), protocol, port, and CIDR before writing.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/vpc/v20170312 — action signatures in `vpc_client.ts`, full request/response shapes in `vpc_models.ts`.

## Read actions (auto-allowed, 137)

| Action | What it does |
|---|---|
| `DescribeTaskResult` | Describe task result |
| `DescribeRouteTables` | Describe route tables |
| `DescribeInstanceJumbo` | Describe instance jumbo<br>Required: `InstanceIds` |
| `DescribeAddresses` | Describe addresses |
| `CheckGatewayFlowMonitor` | Check gateway flow monitor<br>Required: `GatewayId` |
| `DescribeSpecificTrafficPackageUsedDetails` | Describe specific traffic package used details<br>Required: `TrafficPackageId` |
| `DescribeTemplateLimits` | Describe template limits |
| `CheckNetDetectState` | Check net detect state<br>Required: `DetectDestinationIp` |
| `InquiryPriceResetVpnGatewayInternetMaxBandwidth` | Inquire the price of: reset vpn gateway internet max bandwidth<br>Required: `VpnGatewayId`, `InternetMaxBandwidthOut` (unit: Mbps) |
| `DescribeNetworkAccountType` | Describe network account type |
| `DescribeIp6Addresses` | Describe ip6 addresses |
| `DescribeNetDetectStates` | Describe net detect states |
| `DescribeCcns` | Describe ccns |
| `DescribeCcnRouteTables` | Describe ccn route tables |
| `DescribeRoutePolicyEntries` | Describe route policy entries |
| `DescribeSubnetResourceDashboard` | Describe subnet resource dashboard<br>Required: `SubnetIds` |
| `DescribeFlowLog` | Describe flow log<br>Required: `VpcId`, `FlowLogId` |
| `DescribeCcnRegionBandwidthLimits` | Describe ccn region bandwidth limits<br>Required: `CcnId` |
| `DescribeUsedIpAddress` | Describe used ip address<br>Required: `VpcId` |
| `DescribeCcnRoutes` | Describe ccn routes<br>Required: `CcnId` |
| `GetCcnRegionBandwidthLimits` | Get ccn region bandwidth limits<br>Required: `CcnId` |
| `DescribeAddressBandwidthRange` | Describe address bandwidth range |
| `InquiryPriceCreateVpnGateway` | Inquire the price of: create vpn gateway<br>Required: `InternetMaxBandwidthOut` (unit: Mbps) |
| `DescribeCrossBorderCompliance` | Describe cross border compliance |
| `DescribeTrafficMirrorFilterRules` | Describe traffic mirror filter rules<br>Required: `TrafficMirrorId` |
| `DescribeVpcLimits` | Describe vpc limits<br>Required: `LimitTypes` |
| `DescribeSnapshotAttachedInstances` | Describe snapshot attached instances<br>Required: `SnapshotPolicyId` |
| `DescribeProductQuota` | Describe product quota<br>Required: `Product` |
| `DescribeSubnets` | Describe subnets |
| `DescribeGlobalRoutes` | Describe global routes |
| `DescribeDesignatedZones` | Describe designated zones |
| `DescribeAddressTemplateInstances` | Describe address template instances<br>Required: `AddressTemplateId` |
| `DescribeReserveIpAddresses` | Describe reserve ip addresses |
| `DescribeBandwidthPackageBandwidthRange` | Describe bandwidth package bandwidth range |
| `DescribeVpcPrivateIpAddresses` | Describe vpc private ip addresses<br>Required: `VpcId`, `PrivateIpAddresses` |
| `DescribeAddressTemplates` | Describe address templates |
| `DescribeVpcEndPoint` | Describe vpc end point |
| `DescribeIp6TranslatorQuota` | Describe ip6 translator quota |
| `DownloadCustomerGatewayConfiguration` | Download customer gateway configuration<br>Required: `VpnGatewayId`, `VpnConnectionId`, `CustomerGatewayVendor`, `InterfaceName` |
| `DescribeCustomerGateways` | Describe customer gateways |
| `DescribeNetworkAcls` | Describe network acls |
| `DescribeServiceTemplateGroups` | Describe service template groups |
| `DescribeNatGatewayDestinationIpPortTranslationNatRules` | Describe nat gateway destination ip port translation nat rules |
| `DescribeCcnAttachedInstances` | Describe ccn attached instances |
| `DescribePrivateNatGatewayRegions` | Describe private nat gateway regions |
| `DescribeGatewayFlowMonitorDetail` | Describe gateway flow monitor detail<br>Required: `TimePoint` |
| `DescribeVpcTaskResult` | Describe vpc task result<br>Required: `TaskId` |
| `CheckTrafficMirror` | Check traffic mirror<br>Required: `VpcId` |
| `DescribeVpcEndPointService` | Describe vpc end point service |
| `DescribeCrossBorderCcnRegionBandwidthLimits` | Describe cross border ccn region bandwidth limits |
| `DescribeVpnGatewayCcnRoutes` | Describe vpn gateway ccn routes<br>Required: `VpnGatewayId` |
| `DescribeTrafficPackages` | Describe traffic packages |
| `DescribeBandwidthPackageResources` | Describe bandwidth package resources<br>Required: `BandwidthPackageId` |
| `DescribeVpcPeeringConnections` | Describe vpc peering connections |
| `InquiryPriceRenewAddresses` | Inquire the price of: renew addresses<br>Required: `AddressIds`, `AddressChargePrepaid` |
| `DescribeRouteConflicts` | Describe route conflicts<br>Required: `RouteTableId`, `DestinationCidrBlocks` |
| `DescribeNetworkAclQuintupleEntries` | Describe network acl quintuple entries<br>Required: `NetworkAclId` |
| `DescribePrivateNatGatewayTranslationAclRules` | Describe private nat gateway translation acl rules<br>Required: `NatGatewayId`, `TranslationDirection`, `TranslationType`, `TranslationIp` |
| `DescribeVpcInstances` | Describe vpc instances<br>Required: `Filters` |
| `DescribeVpnGatewaySslServers` | Describe vpn gateway ssl servers |
| `DescribeAccountAttributes` | Describe account attributes |
| `DescribeRouteTableSelectionPolicies` | Describe route table selection policies |
| `DescribeIpGeolocationInfos` | Describe ip geolocation infos<br>Required: `AddressIps` |
| `DescribeCdcLDCXList` | Describe cdc ldcxlist |
| `DescribeServiceTemplateInstances` | Describe service template instances<br>Required: `ServiceTemplateId` |
| `DescribeNatGatewaySourceIpTranslationNatRules` | Describe nat gateway source ip translation nat rules<br>Required: `NatGatewayId` |
| `DescribeBandwidthPackageQuota` | Describe bandwidth package quota |
| `DescribeBandwidthPackages` | Describe bandwidth packages |
| `DescribeRouteTableAssociatedInstances` | Describe route table associated instances |
| `DescribeAddressTemplateGroups` | Describe address template groups |
| `DescribeVpcResourceDashboard` | Describe vpc resource dashboard<br>Required: `VpcIds` |
| `DescribeNetworkInterfaceLimit` | Describe network interface limit<br>Required: `InstanceId` |
| `DescribeCustomerGatewayVendors` | Describe customer gateway vendors |
| `DescribeVpnGatewayRoutes` | Describe vpn gateway routes<br>Required: `VpnGatewayId` |
| `DescribeTrafficMirrors` | Describe traffic mirrors |
| `DescribeCrossBorderFlowMonitor` | Describe cross border flow monitor<br>Required: `SourceRegion`, `DestinationRegion`, `CcnId`, `CcnUin`, `Period`, `StartTime`, `EndTime` |
| `DescribeVpnConnections` | Describe vpn connections |
| `DescribePrivateNatGatewayDestinationIpPortTranslationNatRules` | Describe private nat gateway destination ip port translation nat rules<br>Required: `NatGatewayId` |
| `DescribeHighPriorityRoutes` | Describe high priority routes<br>Required: `HighPriorityRouteTableId` |
| `DescribeVpcIpv6Addresses` | Describe vpc ipv6 addresses<br>Required: `VpcId` |
| `DescribeLocalGateway` | Describe local gateway |
| `DescribeNetDetects` | Describe net detects |
| `DescribeBandwidthPackageBillUsage` | Describe bandwidth package bill usage<br>Required: `BandwidthPackageId` |
| `DescribeServiceTemplateGroupInstances` | Describe service template group instances<br>Required: `ServiceTemplateGroupId` |
| `DescribeVpnGatewaySslClients` | Describe vpn gateway ssl clients |
| `InquiryPriceAllocateAddresses` | Inquire the price of: allocate addresses<br>Required: `InternetChargeType` |
| `DescribeSgSnapshotFileContent` | Describe sg snapshot file content<br>Required: `SnapshotPolicyId`, `SnapshotFileId`, `SecurityGroupId` |
| `DescribeNetworkInterfaces` | Describe network interfaces |
| `DescribeCcnRouteTableBroadcastPolicys` | Describe ccn route table broadcast policys<br>Required: `CcnId`, `RouteTableId` |
| `DescribePrivateNatGateways` | Describe private nat gateways |
| `DescribeVpnGateways` | Describe vpn gateways |
| `DescribeHaVips` | Describe ha vips |
| `DescribePrivateNatGatewayTranslationNatRules` | Describe private nat gateway translation nat rules<br>Required: `NatGatewayId` |
| `DescribeAddressTemplateGroupInstances` | Describe address template group instances<br>Required: `AddressTemplateGroupId` |
| `DescribeTenantCcns` | Describe tenant ccns |
| `DescribeSecurityGroupAssociationStatistics` | Describe security group association statistics<br>Required: `SecurityGroupIds` |
| `DescribeIpGeolocationDatabaseUrl` | Describe ip geolocation database url<br>Required: `Type` |
| `DescribeCcnPolicyBasedRoutingRule` | Describe ccn policy based routing rule<br>Required: `CcnId` |
| `DescribeTrafficQosPolicy` | Describe traffic qos policy<br>Required: `CcnId`, `LocalRegion`, `RemoteRegion` |
| `DescribeIPv6Addresses` | Describe ipv6 addresses |
| `DescribeCcnRouteTableInputPolicys` | Describe ccn route table input policys<br>Required: `CcnId`, `RouteTableId` |
| `DescribeNatGatewayZones` | Describe nat gateway zones |
| `InquiryPriceRenewVpnGateway` | Inquire the price of: renew vpn gateway<br>Required: `VpnGatewayId`, `InstanceChargePrepaid` |
| `DescribeNatGateways` | Describe nat gateways |
| `DescribeVpcs` | Describe vpcs |
| `DescribeHighPriorityRouteTables` | Describe high priority route tables |
| `DescribeGatewayFlowQos` | Describe gateway flow qos<br>Required: `GatewayId` |
| `DescribeIp6Translators` | Describe ip6 translators |
| `DescribeNatGatewayFlowMonitorDetail` | Describe nat gateway flow monitor detail<br>Required: `TimePoint`, `NatGatewayId` |
| `CheckAssistantCidr` | Check assistant cidr<br>Required: `VpcId` |
| `DescribeSecurityGroupExpandedPolicies` | Describe security group expanded policies<br>Required: `SecurityGroupId` |
| `DescribeDhcpIps` | Describe dhcp ips |
| `DescribeFlowLogs` | Describe flow logs |
| `DescribeDirectConnectGatewayCcnRoutes` | Describe direct connect gateway ccn routes<br>Required: `DirectConnectGatewayId` |
| `DescribeRoutes` | Describe routes |
| `DescribeRouteList` | Describe route list |
| `DescribeVpcEndPointServiceWhiteList` | Describe vpc end point service white list |
| `DescribePrivateNatGatewayLimits` | Describe private nat gateway limits |
| `DescribeSecurityGroupLimits` | Describe security group limits |
| `DescribeCdcUsedIdcVlan` | Describe cdc used idc vlan |
| `DescribeSecurityGroupReferences` | Describe security group references<br>Required: `SecurityGroupIds` |
| `DescribeDirectConnectGateways` | Describe direct connect gateways |
| `DescribeServiceTemplates` | Describe service templates |
| `DescribeCcnPolicyBasedRoutingNextHop` | Describe ccn policy based routing next hop<br>Required: `CcnId` |
| `DescribeNatGatewayDirectConnectGatewayRoute` | Describe nat gateway direct connect gateway route<br>Required: `NatGatewayId`, `VpcId` |
| `CheckDefaultSubnet` | Check default subnet |
| `DownloadVpnGatewaySslClientCert` | Download vpn gateway ssl client cert |
| `DescribeAddressQuota` | Describe address quota |
| `DescribeRoutePolicies` | Describe route policies |
| `DescribeSecurityGroups` | Describe security groups |
| `DescribeSecurityGroupPolicies` | Describe security group policies<br>Required: `SecurityGroupId` |
| `DescribeAssistantCidr` | Describe assistant cidr |
| `DescribeClassicLinkInstances` | Describe classic link instances |
| `InquiryPriceModifyAddressesBandwidth` | Inquire the price of: modify addresses bandwidth<br>Required: `AddressIds`, `InternetMaxBandwidthOut` |
| `DescribeSnapshotFiles` | Describe snapshot files<br>Required: `BusinessType`, `InstanceId`, `StartDate`, `EndDate` |
| `DescribeSnapshotPolicies` | Describe snapshot policies |
| `DescribeCdcNetPlanes` | Describe cdc net planes |
## Mutations (gated — need allowlist, 159)

| Action | What it does |
|---|---|
| `AssociateDirectConnectGatewayNatGateway` | Associate direct connect gateway nat gateway<br>Required: `VpcId`, `NatGatewayId`, `DirectConnectGatewayId` |
| `AssociateHaVipInstance` | Associate ha vip instance<br>Required: `HaVipAssociationSet` |
| `AcceptVpcPeeringConnection` | Run accept vpc peering connection<br>Required: `PeeringConnectionId` |
| `EnableGatewayFlowMonitor` | Enable gateway flow monitor<br>Required: `GatewayId` |
| `CreateCcnPolicyBasedRoutingNextHop` | Create ccn policy based routing next hop<br>Required: `CcnId`, `NextHopRegion`, `InstanceId`, `Name`, `InstanceType` |
| `CreateCcnRouteTables` | Create ccn route tables<br>Required: `RouteTable` |
| `ReplaceCcnRouteTableBroadcastPolicys` | Replace ccn route table broadcast policys<br>Required: `CcnId`, `RouteTableId`, `Policys` |
| `ReplaceRouteTableAssociation` | Replace route table association<br>Required: `RouteTableId` |
| `CreateSubnet` | Create subnet<br>Required: `VpcId`, `SubnetName`, `CidrBlock`, `Zone` |
| `CreateVpnGatewaySslClient` | Create vpn gateway ssl client<br>Required: `SslVpnServerId` |
| `AllocateIp6AddressesBandwidth` | Allocate ip6 addresses bandwidth<br>Required: `Ip6Addresses` |
| `LockCcnBandwidths` | Lock ccn bandwidths<br>Required: `Instances` |
| `AddBandwidthPackageResources` | Add bandwidth package resources<br>Required: `ResourceIds` |
| `ReplaceRoutePolicyEntries` | Replace route policy entries<br>Required: `RoutePolicyId`, `RoutePolicyEntrySet` |
| `AllocateAddresses` | Allocate addresses |
| `CreatePrivateNatGateway` | Create private nat gateway<br>Required: `NatGatewayName` |
| `CreateNetworkInterface` | Create network interface<br>Required: `VpcId`, `NetworkInterfaceName`, `SubnetId` |
| `DetachNetworkInterface` | Detach network interface<br>Required: `NetworkInterfaceId`, `InstanceId` |
| `AssociateInstancesToCcnRouteTable` | Associate instances to ccn route table<br>Required: `CcnId`, `RouteTableId`, `Instances` |
| `AddIp6Rules` | Add ip6 rules<br>Required: `Ip6TranslatorId`, `Ip6RuleInfos` |
| `DisassociateDirectConnectGatewayNatGateway` | Run disassociate direct connect gateway nat gateway<br>Required: `VpcId`, `NatGatewayId`, `DirectConnectGatewayId` |
| `ReplaceDirectConnectGatewayCcnRoutes` | Replace direct connect gateway ccn routes<br>Required: `DirectConnectGatewayId`, `Routes` |
| `AddTemplateMember` | Add template member<br>Required: `TemplateId`, `TemplateMember` |
| `MigrateBandwidthPackageResources` | Migrate bandwidth package resources<br>Required: `BandwidthPackageId`, `TargetBandwidthPackageId`, `ResourceIds` |
| `WithdrawNotifyRoutes` | Run withdraw notify routes<br>Required: `RouteTableId`, `RouteItemIds` |
| `CreateCdcNetPlanes` | Create cdc net planes |
| `CreateSecurityGroup` | Create security group<br>Required: `GroupName`, `GroupDescription` |
| `CreateVpnGatewaySslServer` | Create vpn gateway ssl server<br>Required: `VpnGatewayId`, `SslVpnServerName`, `RemoteAddress` |
| `ReplaceCcnRouteTableInputPolicys` | Replace ccn route table input policys<br>Required: `CcnId`, `RouteTableId`, `Policys` |
| `CreateDirectConnectGateway` | Create direct connect gateway<br>Required: `DirectConnectGatewayName`, `NetworkType` |
| `DetachCcnInstances` | Detach ccn instances<br>Required: `CcnId`, `Instances` |
| `CreateReserveIpAddresses` | Create reserve ip addresses<br>Required: `VpcId` |
| `EnableRoutes` | Enable routes<br>Required: `RouteTableId` |
| `SetCcnRegionBandwidthLimits` | Set ccn region bandwidth limits<br>Required: `CcnId`, `CcnRegionBandwidthLimits` |
| `ReplaceRoutes` | Replace routes<br>Required: `RouteTableId`, `Routes` |
| `CreateVpnConnection` | Create vpn connection<br>Required: `VpnGatewayId`, `CustomerGatewayId`, `VpnConnectionName`, `PreShareKey` |
| `TransformAddress` | Run transform address<br>Required: `InstanceId` |
| `CreateVpcEndPointServiceWhiteList` | Create vpc end point service white list<br>Required: `UserUin`, `EndPointServiceId` |
| `AssignIpv6CidrBlock` | Run assign ipv6 cidr block<br>Required: `VpcId` |
| `DisassociateNatGatewayAddress` | Run disassociate nat gateway address<br>Required: `NatGatewayId`, `PublicIpAddresses` |
| `UnassignIpv6Addresses` | Run unassign ipv6 addresses<br>Required: `NetworkInterfaceId`, `Ipv6Addresses` |
| `AssociateIPv6Address` | Associate ipv6 address<br>Required: `IPv6AddressId` |
| `AssociateNatGatewayAddress` | Associate nat gateway address<br>Required: `NatGatewayId` |
| `ReplaceRoutePolicyAssociations` | Replace route policy associations<br>Required: `RoutePolicyAssociationSet` |
| `DisassociateHaVipInstance` | Run disassociate ha vip instance<br>Required: `HaVipAssociationSet` |
| `CreateNatGatewayDestinationIpPortTranslationNatRule` | Create nat gateway destination ip port translation nat rule<br>Required: `NatGatewayId`, `DestinationIpPortTranslationNatRules` |
| `AssignIpv6SubnetCidrBlock` | Run assign ipv6 subnet cidr block<br>Required: `VpcId`, `Ipv6SubnetCidrBlocks` |
| `AttachCcnInstances` | Attach ccn instances<br>Required: `CcnId`, `Instances` |
| `AttachClassicLinkVpc` | Attach classic link vpc<br>Required: `VpcId`, `InstanceIds` |
| `CreateVpcEndPointService` | Create vpc end point service<br>Required: `VpcId`, `EndPointServiceName`, `AutoAcceptFlag`, `ServiceInstanceId` |
| `CreateHighPriorityRouteTable` | Create high priority route table<br>Required: `VpcId`, `Name` |
| `CreateDefaultSecurityGroup` | Create default security group |
| `AssociateDhcpIpWithAddressIp` | Associate dhcp ip with address ip<br>Required: `DhcpIpId`, `AddressIp` |
| `UnassignPrivateIpAddresses` | Run unassign private ip addresses<br>Required: `NetworkInterfaceId`, `PrivateIpAddresses` |
| `CreateIp6Translators` | Create ip6 translators |
| `CreateDefaultVpc` | Create default vpc |
| `AttachNetworkInterface` | Attach network interface<br>Required: `NetworkInterfaceId`, `InstanceId` |
| `CreateCcnPolicyBasedRoutingRules` | Create ccn policy based routing rules<br>Required: `CcnId` |
| `UnlockCcns` | Unlock ccns |
| `DisableFlowLogs` | Disable flow logs<br>Required: `FlowLogIds` |
| `CreateCustomerGateway` | Create customer gateway<br>Required: `CustomerGatewayName`, `IpAddress` |
| `CreateTrafficMirror` | Create traffic mirror<br>Required: `VpcId`, `TrafficMirrorName` |
| `AuditCrossBorderCompliance` | Audit cross border compliance<br>Required: `ServiceProvider` (UNICOM), `ComplianceId`, `AuditBehavior` |
| `AssignIpv6Addresses` | Run assign ipv6 addresses<br>Required: `NetworkInterfaceId` |
| `UnassignIpv6CidrBlock` | Run unassign ipv6 cidr block<br>Required: `VpcId` |
| `CreateNatGatewaySourceIpTranslationNatRule` | Create nat gateway source ip translation nat rule<br>Required: `NatGatewayId`, `SourceIpTranslationNatRules` |
| `RejectVpcPeeringConnection` | Reject vpc peering connection<br>Required: `PeeringConnectionId` |
| `CreateAddressTemplate` | Create address template<br>Required: `AddressTemplateName` |
| `EnableCcnRoutes` | Enable ccn routes<br>Required: `CcnId`, `RouteIds` |
| `CreatePrivateNatGatewayDestinationIpPortTranslationNatRule` | Create private nat gateway destination ip port translation nat rule<br>Required: `NatGatewayId`, `LocalDestinationIpPortTranslationNatRules` |
| `CreateSnapshotPolicies` | Create snapshot policies<br>Required: `SnapshotPolicies` |
| `CreateServiceTemplateGroup` | Create service template group<br>Required: `ServiceTemplateGroupName`, `ServiceTemplateIds` |
| `InquirePriceCreateDirectConnectGateway` | Inquire the price of: create direct connect gateway |
| `DetachClassicLinkVpc` | Detach classic link vpc<br>Required: `VpcId`, `InstanceIds` |
| `CreateSecurityGroupPolicies` | Create security group policies<br>Required: `SecurityGroupId`, `SecurityGroupPolicySet` |
| `AttachSnapshotInstances` | Attach snapshot instances<br>Required: `SnapshotPolicyId`, `Instances` |
| `ReplaceSecurityGroupPolicy` | Replace security group policy<br>Required: `SecurityGroupId`, `SecurityGroupPolicySet` |
| `AdjustPublicAddress` | Adjust public address |
| `CreateNetworkAcl` | Create network acl<br>Required: `VpcId`, `NetworkAclName` |
| `UpdateTrafficMirrorAllFilter` | Update traffic mirror all filter<br>Required: `TrafficMirrorId` |
| `CreateBandwidthPackage` | Create bandwidth package |
| `GenerateVpnConnectionDefaultHealthCheckIp` | Generate vpn connection default health check ip<br>Required: `VpnGatewayId` |
| `CreateRoutePolicyAssociations` | Create route policy associations<br>Required: `RoutePolicyAssociationSet` |
| `EnableSnapshotPolicies` | Enable snapshot policies<br>Required: `SnapshotPolicyIds` |
| `DisassociateNetworkAclSubnets` | Run disassociate network acl subnets<br>Required: `NetworkAclId`, `SubnetIds` |
| `ReplaceSecurityGroupPolicies` | Replace security group policies<br>Required: `SecurityGroupId`, `SecurityGroupPolicySet` |
| `CreateDirectConnectGatewayCcnRoutes` | Create direct connect gateway ccn routes<br>Required: `DirectConnectGatewayId`, `Routes` |
| `AssignPrivateIpAddresses` | Run assign private ip addresses<br>Required: `NetworkInterfaceId` |
| `CreateSubnets` | Create subnets<br>Required: `VpcId`, `Subnets` |
| `CreateVpcPeeringConnection` | Create vpc peering connection<br>Required: `SourceVpcId`, `PeeringConnectionName`, `DestinationVpcId`, `DestinationUin`, `DestinationRegion` |
| `RejectAttachCcnInstances` | Reject attach ccn instances<br>Required: `CcnId`, `Instances` |
| `DisassociateAddress` | Run disassociate address<br>Required: `AddressId` |
| `CreateTrafficMirrorFilterRules` | Create traffic mirror filter rules<br>Required: `TrafficMirrorId` |
| `UnlockCcnBandwidths` | Unlock ccn bandwidths<br>Required: `Instances` |
| `DisassociateIPv6Address` | Run disassociate ipv6 address<br>Required: `IPv6AddressId` |
| `UnassignIpv6SubnetCidrBlock` | Run unassign ipv6 subnet cidr block<br>Required: `VpcId`, `Ipv6SubnetCidrBlocks` |
| `DisableRoutes` | Disable routes<br>Required: `RouteTableId` |
| `EnableVpnGatewaySslClientCert` | Enable vpn gateway ssl client cert |
| `CreateAssistantCidr` | Create assistant cidr<br>Required: `VpcId`, `CidrBlocks` |
| `CreateNatGateway` | Create nat gateway<br>Required: `NatGatewayName`, `VpcId` |
| `NotifyRoutes` | Notify routes<br>Required: `RouteTableId`, `RouteItemIds` |
| `CreateServiceTemplate` | Create service template<br>Required: `ServiceTemplateName` |
| `CreateRoutePolicy` | Create route policy<br>Required: `RoutePolicyDescription`, `RoutePolicyName` |
| `DisableCcnRoutes` | Disable ccn routes<br>Required: `CcnId`, `RouteIds` |
| `CreateAddressTemplateGroup` | Create address template group<br>Required: `AddressTemplateGroupName`, `AddressTemplateIds` |
| `AssociateNetworkAclSubnets` | Associate network acl subnets<br>Required: `NetworkAclId`, `SubnetIds` |
| `AssociateNetworkInterfaceSecurityGroups` | Associate network interface security groups<br>Required: `NetworkInterfaceIds`, `SecurityGroupIds` |
| `ReplaceHighPriorityRouteTableAssociation` | Replace high priority route table association<br>Required: `HighPriorityRouteTableId` |
| `ReturnNormalAddresses` | Run return normal addresses<br>Required: `AddressIps` |
| `EnableFlowLogs` | Enable flow logs<br>Required: `FlowLogIds` |
| `CreateCdcLDCXList` | Create cdc ldcxlist |
| `CreateLocalGateway` | Create local gateway<br>Required: `LocalGatewayName`, `VpcId`, `CdcId` |
| `HaVipDisassociateAddressIp` | Run ha vip disassociate address ip<br>Required: `HaVipId` |
| `DisassociateDhcpIpWithAddressIp` | Run disassociate dhcp ip with address ip<br>Required: `DhcpIpId` |
| `CreateHaVip` | Create ha vip<br>Required: `VpcId`, `HaVipName` |
| `CreateHighPriorityRoutes` | Create high priority routes<br>Required: `HighPriorityRouteTableId`, `HighPriorityRoutes` |
| `LockCcns` | Lock ccns |
| `CreateRoutes` | Create routes<br>Required: `RouteTableId`, `Routes` |
| `CreateFlowLog` | Create flow log<br>Required: `FlowLogName`, `ResourceType`, `ResourceId`, `TrafficType` |
| `CreateRouteTable` | Create route table<br>Required: `VpcId`, `RouteTableName` |
| `DisassociateNetworkInterfaceSecurityGroups` | Run disassociate network interface security groups<br>Required: `NetworkInterfaceIds`, `SecurityGroupIds` |
| `CloneSecurityGroup` | Clone security group<br>Required: `SecurityGroupId` |
| `RefreshDirectConnectGatewayRouteToNatGateway` | Refresh direct connect gateway route to nat gateway<br>Required: `VpcId`, `NatGatewayId`, `DryRun` |
| `CreatePrivateNatGatewayTranslationNatRule` | Create private nat gateway translation nat rule<br>Required: `NatGatewayId`, `TranslationNatRules` |
| `DisassociateVpcEndPointSecurityGroups` | Run disassociate vpc end point security groups<br>Required: `SecurityGroupIds`, `EndPointId` |
| `EnableVpcEndPointConnect` | Enable vpc end point connect<br>Required: `EndPointServiceId`, `EndPointId`, `AcceptFlag` |
| `CreateAndAttachNetworkInterface` | Create and attach network interface<br>Required: `VpcId`, `NetworkInterfaceName`, `SubnetId`, `InstanceId` |
| `CreateGlobalRoutes` | Create global routes<br>Required: `VpcId`, `GlobalRoutes` |
| `MigrateNetworkInterface` | Migrate network interface<br>Required: `NetworkInterfaceId`, `SourceInstanceId`, `DestinationInstanceId` |
| `UpgradeNatGatewayProductVersion` | Upgrade nat gateway product version<br>Required: `VpcId`, `NatGatewayId`, `Force` (default 0) |
| `AcceptAttachCcnInstances` | Run accept attach ccn instances<br>Required: `CcnId`, `Instances` |
| `DisableGatewayFlowMonitor` | Disable gateway flow monitor<br>Required: `GatewayId` |
| `CreateVpc` | Create vpc<br>Required: `VpcName`, `CidrBlock` |
| `DisableSnapshotPolicies` | Disable snapshot policies<br>Required: `SnapshotPolicyIds` |
| `AssociateAddress` | Associate address<br>Required: `AddressId` |
| `CreateNetworkAclEntries` | Create network acl entries<br>Required: `NetworkAclId`, `NetworkAclEntrySet` |
| `CreateRoutePolicyEntries` | Create route policy entries<br>Required: `RoutePolicyId`, `RoutePolicyEntrySet` |
| `ReplaceHighPriorityRoutes` | Replace high priority routes<br>Required: `HighPriorityRouteTableId`, `HighPriorityRoutes` |
| `CreateNetDetect` | Create net detect<br>Required: `VpcId`, `SubnetId`, `NetDetectName`, `DetectDestinationIp` |
| `CreateNetworkAclQuintupleEntries` | Create network acl quintuple entries<br>Required: `NetworkAclId`, `NetworkAclQuintupleSet` |
| `CreatePrivateNatGatewayTranslationAclRule` | Create private nat gateway translation acl rule<br>Required: `NatGatewayId`, `TranslationDirection`, `TranslationType`, `TranslationIp`, `TranslationAclRules` |
| `DisableVpnGatewaySslClientCert` | Disable vpn gateway ssl client cert |
| `MigratePrivateIpAddress` | Migrate private ip address<br>Required: `SourceNetworkInterfaceId`, `DestinationNetworkInterfaceId`, `PrivateIpAddress` |
| `DetachSnapshotInstances` | Detach snapshot instances<br>Required: `SnapshotPolicyId`, `Instances` |
| `HaVipAssociateAddressIp` | Run ha vip associate address ip<br>Required: `HaVipId`, `AddressIp` |
| `UpdateTrafficMirrorDirection` | Update traffic mirror direction<br>Required: `TrafficMirrorId`, `Direction` |
| `StartTrafficMirror` | Start traffic mirror<br>Required: `TrafficMirrorId` |
| `CreateCcn` | Create ccn<br>Required: `CcnName` |
| `CreateVpnGateway` | Create vpn gateway<br>Required: `VpcId`, `VpnGatewayName`, `InternetMaxBandwidthOut` (unit: Mbps) |
| `ClearRouteTableSelectionPolicies` | Run clear route table selection policies<br>Required: `CcnId` |
| `AllocateIPv6Addresses` | Allocate ipv6 addresses |
| `CreateTrafficPackages` | Create traffic packages<br>Required: `TrafficAmount` |
| `CreateDhcpIp` | Create dhcp ip<br>Required: `VpcId`, `SubnetId`, `DhcpIpName` |
| `ResumeSnapshotInstance` | Resume snapshot instance<br>Required: `SnapshotPolicyId`, `SnapshotFileId`, `InstanceId` |
| `SetVpnGatewaysRenewFlag` | Set vpn gateways renew flag<br>Required: `VpnGatewayIds`, `AutoRenewFlag` |
| `ReplaceRoutesWithRoutePolicy` | Replace routes with route policy<br>Required: `RouteTableId`, `Routes` |
| `CreateVpcEndPoint` | Create vpc end point<br>Required: `VpcId`, `SubnetId`, `EndPointName`, `EndPointServiceId` |
| `CreateSecurityGroupWithPolicies` | Create security group with policies<br>Required: `GroupName`, `GroupDescription` |
| `CreateVpnGatewayRoutes` | Create vpn gateway routes<br>Required: `VpnGatewayId`, `Routes` |

## Blocked destructive actions (152)

`ModifyNatGatewayAttribute`, `RemoveBandwidthPackageResources`, `ModifyServiceTemplateGroupAttribute`, `ModifyAddressInternetChargeType`, `ModifyIPv6AddressesAttributes`, `ModifyTrafficMirrorFilterRules`, `ModifyVpnGatewaySslClientCert`, `ModifyVpnGatewaySslServer`, `DeleteTrafficPackages`, `ModifyAddressesBandwidth`, `DeleteServiceTemplateGroup`, `DeleteCdcLDCXList`, `DeleteNetworkAclQuintupleEntries`, `DeleteDirectConnectGateway`, `ModifyCdcNetPlaneAttribute`, `DeleteCcn`, `ModifyNetworkAclEntries`, `ModifyNetworkAclQuintupleEntries`, `DeleteAssistantCidr`, `DeleteCcnPolicyBasedRoutingNextHop`, `DeleteRoutePolicyAssociations`, `DeleteHaVip`, `DeleteNetworkInterface`, `ModifyLocalGateway`, `RenewAddresses`, `DeleteAddressTemplate`, `DeleteRoutes`, `DeleteHighPriorityRouteTables`, `ModifyNetworkInterfaceAttribute`, `ModifyRoutePolicyAttribute`, `ModifyVpcPeeringConnection`, `DeleteRoutePolicyEntries`, `DeleteTrafficMirror`, `ModifyCcnPolicyBasedRoutingNextHopAttribute`, `ModifyBandwidthPackageAttribute`, `ModifyVpnGatewayAttribute`, `DeleteVpc`, `ModifyPrivateNatGatewayTranslationAclRule`, `ModifyRouteTableAttribute`, `ModifyHaVipAttribute`, `ReleaseAddresses`, `ModifyIp6Translator`, `ModifyReserveIpAddress`, `ModifyPrivateIpAddressesAttribute`, `ResetRoutePolicyEntries`, `DeleteAddressTemplateGroup`, `ModifyNetworkInterfaceQos`, `ModifyGlobalRoutes`, `DeleteCcnRouteTables`, `ModifyPrivateNatGatewayTranslationNatRule`, `ModifyVpnGatewayRoutes`, `ModifySnapshotPolicies`, `DeleteVpnGatewaySslClient`, `ModifyAddressTemplateAttribute`, `DeleteTemplateMember`, `DeleteRoutePolicy`, `DeleteCcnPolicyBasedRoutingRule`, `DeleteSubnet`, `ModifyTemplateMember`, `ResetVpnConnection`, `ModifyVpnGatewayCcnRoutes`, `DeleteGlobalRoutes`, `DeletePrivateNatGatewayDestinationIpPortTranslationNatRule`, `ModifyDhcpIpAttribute`, `ModifyGatewayFlowQos`, `DeleteServiceTemplate`, `ModifyAddressTemplateGroupAttribute`, `DeleteSecurityGroupPolicies`, `ModifySecurityGroupAttribute`, `DeletePrivateNatGatewayTranslationAclRule`, `ResetTrafficMirrorFilter`, `DeleteRouteTable`, `RemoveIp6Rules`, `ModifyCustomerGatewayAttribute`, `DeleteSecurityGroup`, `ModifyNetDetect`, `ResetAttachCcnInstances`, `ModifyVpcEndPointServiceAttribute`, `ReleaseIp6AddressesBandwidth`, `ModifyCcnAttribute`, `ResetNatGatewayConnection`, `DeleteFlowLog`, `DeleteVpnGatewaySslServer`, `DeleteVpnConnection`, `DeleteCdcNetPlanes`, `DeleteLocalGateway`, `ModifyServiceTemplateAttribute`, `ModifyPrivateNatGatewayDestinationIpPortTranslationNatRule`, `DeleteDirectConnectGatewayCcnRoutes`, `DeleteDhcpIp`, `ModifyIp6Rule`, `DeleteCustomerGateway`, `ModifyCcnRouteTables`, `ModifyAddressesRenewFlag`, `ModifyHighPriorityRouteECMPAlgorithm`, `DeleteNatGatewaySourceIpTranslationNatRule`, `ModifyNatGatewaySourceIpTranslationNatRule`, `ModifyCcnPolicyBasedRoutingRuleAttribute`, `DeleteNetDetect`, `DeleteVpcEndPoint`, `DeleteHighPriorityRoutes`, `ModifyDirectConnectGatewayAttribute`, `ModifySubnetAttribute`, `ModifyNatGatewayDestinationIpPortTranslationNatRule`, `ResetVpnGatewayInternetMaxBandwidth`, `ModifyVpnConnectionAttribute`, `ModifyRouteTableSelectionPolicies`, `ModifyAddressAttribute`, `ModifyPrivateNatGatewayAttribute`, `DeleteNetworkAcl`, `DeleteVpcEndPointServiceWhiteList`, `ModifyFlowLogAttribute`, `ResetRoutes`, `ModifyNatGatewayAdvancedAttribute`, `DeleteNetworkAclEntries`, `StopTrafficMirror`, `ModifyCcnRegionBandwidthLimitsType`, `DeleteSnapshotPolicies`, `ModifyIPv6AddressesBandwidth`, `ModifyVpcEndPointAttribute`, `ModifyHighPriorityRouteAttribute`, `ModifyVpcEndPointServiceWhiteList`, `ResetHighPriorityRoutes`, `ModifyNetworkAclAttribute`, `DeletePrivateNatGatewayTranslationNatRule`, `ModifyGlobalRouteECMPAlgorithm`, `DeleteVpcPeeringConnection`, `DeleteBandwidthPackage`, `DeleteIp6Translators`, `DeleteVpnGatewayRoutes`, `ModifyCcnAttachedInstancesAttribute`, `ResetTrafficMirrorTarget`, `DeleteNatGateway`, `ModifyIpv6AddressesAttribute`, `ModifyHighPriorityRouteTableAttribute`, `ReleaseIPv6Addresses`, `DeleteReserveIpAddresses`, `ModifyCdcLDCXAttribute`, `DeleteVpcEndPointService`, `DeleteVpnGateway`, `ModifyBandwidthPackageBandwidth`, `ModifySecurityGroupPolicies`, `RenewVpnGateway`, `DeleteTrafficMirrorFilterRules`, `ResetRoutePolicyAssociations`, `ModifyAssistantCidr`, `DeleteNatGatewayDestinationIpPortTranslationNatRule`, `ModifyVpcAttribute`, `ModifyIp6AddressesBandwidth`, `ResetTrafficMirrorSrcs`, `ModifyTrafficMirrorAttribute`, `DeletePrivateNatGateway` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `vpc`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20170312` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="vpc"`) for the allow/block decision and reason.

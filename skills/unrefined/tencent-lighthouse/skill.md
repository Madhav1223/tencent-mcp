---
name: tencent-lighthouse
description: Tencent Cloud LIGHTHOUSE via the Tencent MCP server — 120 actions in API version v20200324 (44 read-only auto-allowed). Use for instances, firewall, disks, template, docker, disk. Triggers on mentions of lighthouse, instances, firewall, disks, template, docker, disk, blueprint, containers. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Compute instances & pools
metadata:
  version: "4"
---

# Tencent Cloud LIGHTHOUSE

Compute instances & pools: 120 actions in API version `v20200324` — 44 read-only (auto-allowed), 38 gated mutations, 38 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "lighthouse"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

This family provisions billable compute. Always price before creating: every compute service exposes an `InquiryPrice*` action — call it with the exact instance type, image, disks, and charge type, and state the estimate before any create call.
Inventory with `Describe*` filtered by zone; capacity (instance types per zone) via the service's `*InstanceType*Configs` / `*ZoneInstanceConfig*` actions.
Charge-type changes (`POSTPAID_BY_HOUR` vs `PREPAID`) alter required params — prepaid needs a period block. Login settings (key pair or password) are mandatory at creation; omitting them is the most common create failure.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/lighthouse/v20200324 — action signatures in `lighthouse_client.ts`, full request/response shapes in `lighthouse_models.ts`.

## Read actions (auto-allowed, 44)

| Action | What it does |
|---|---|
| `DescribeCcnAttachedInstances` | Describe ccn attached instances |
| `DescribeImagesToShare` | Describe images to share |
| `DescribeBlueprintsShareAcrossAccountInfos` | Describe blueprints share across account infos<br>Required: `BlueprintIds` |
| `DescribeBundleDiscount` | Describe bundle discount<br>Required: `BundleId` |
| `DescribeFirewallTemplateRules` | Describe firewall template rules<br>Required: `TemplateId` |
| `DescribeDockerContainerConfiguration` | Describe docker container configuration<br>Required: `InstanceId`, `ContainerId` |
| `DescribeDisksReturnable` | Describe disks returnable |
| `DescribeBlueprintBundles` | Describe blueprint bundles<br>Required: `BlueprintId` |
| `DescribeDiskDiscount` | Describe disk discount<br>Required: `DiskType`, `DiskSize` (unit: GB) |
| `DescribeFirewallTemplateQuota` | Describe firewall template quota |
| `DescribeAllScenes` | Describe all scenes |
| `DescribeBlueprints` | Describe blueprints |
| `DescribeInstancesDeniedActions` | Describe instances denied actions<br>Required: `InstanceIds` |
| `DescribeRegions` | Describe regions |
| `DescribeDockerContainerDetail` | Describe docker container detail<br>Required: `InstanceId`, `ContainerId` |
| `DescribeBlueprintInstances` | Describe blueprint instances<br>Required: `InstanceIds` |
| `DescribeDockerContainers` | Describe docker containers<br>Required: `InstanceId` |
| `DescribeSnapshotsDeniedActions` | Describe snapshots denied actions<br>Required: `SnapshotIds` |
| `DescribeDockerActivities` | Describe docker activities<br>Required: `InstanceId` |
| `DescribeModifyInstanceBundles` | Describe modify instance bundles<br>Required: `InstanceId` |
| `DescribeBundles` | Describe bundles |
| `DescribeMcpServerTemplates` | Describe mcp server templates |
| `DescribeInstancesTrafficPackages` | Describe instances traffic packages |
| `DescribeDiskBackups` | Describe disk backups |
| `DescribeFirewallRules` | Describe firewall rules<br>Required: `InstanceId` |
| `DescribeGeneralResourceQuotas` | Describe general resource quotas<br>Required: `ResourceNames` |
| `DescribeSnapshots` | Describe snapshots |
| `DescribeDiskBackupsDeniedActions` | Describe disk backups denied actions<br>Required: `DiskBackupIds` |
| `DescribeInstanceVncUrl` | Describe instance vnc url<br>Required: `InstanceId` |
| `DescribeKeyPairs` | Describe key pairs |
| `DescribeDiskConfigs` | Describe disk configs |
| `DescribeInstancesDiskNum` | Describe instances disk num<br>Required: `InstanceIds` |
| `DescribeFirewallTemplateRuleQuota` | Describe firewall template rule quota<br>Required: `TemplateId` |
| `DescribeInstancesReturnable` | Describe instances returnable |
| `DescribeFirewallRulesTemplate` | Describe firewall rules template |
| `DescribeMcpServers` | Describe mcp servers<br>Required: `InstanceId` |
| `DescribeInstances` | Describe instances |
| `DescribeDisksDeniedActions` | Describe disks denied actions<br>Required: `DiskIds` |
| `DescribeZones` | Describe zones |
| `DescribeDisks` | Describe disks |
| `DescribeFirewallTemplateApplyRecords` | Describe firewall template apply records<br>Required: `TemplateId` |
| `DescribeResetInstanceBlueprints` | Describe reset instance blueprints<br>Required: `InstanceId` |
| `DescribeScenes` | Describe scenes |
| `DescribeFirewallTemplates` | Describe firewall templates |
## Mutations (gated — need allowlist, 38)

| Action | What it does |
|---|---|
| `CreateFirewallRules` | Create firewall rules<br>Required: `InstanceId`, `FirewallRules` |
| `RenameDockerContainer` | Run rename docker container<br>Required: `InstanceId`, `ContainerId`, `ContainerName` |
| `ImportKeyPair` | Import key pair<br>Required: `KeyName`, `PublicKey` |
| `InquirePriceCreateDisks` | Inquire the price of: create disks<br>Required: `DiskSize` (unit: GB), `DiskType` (CLOUD_PREMIUM | CLOUD_SSD), `DiskChargePrepaid` |
| `InquirePriceRenewDisks` | Inquire the price of: renew disks<br>Required: `DiskIds`, `RenewDiskChargePrepaid` |
| `RerunDockerContainer` | Rerun docker container<br>Required: `InstanceId`, `ContainerConfiguration`, `ContainerId` |
| `ResizeDisks` | Resize disks<br>Required: `DiskIds`, `DiskSize` (unit: GB) |
| `CreateDiskBackup` | Create disk backup<br>Required: `DiskId` |
| `CreateFirewallTemplate` | Create firewall template<br>Required: `TemplateName` |
| `AttachDisks` | Attach disks<br>Required: `DiskIds`, `InstanceId` |
| `StartMcpServers` | Start mcp servers<br>Required: `InstanceId`, `McpServerIds` |
| `AssociateInstancesKeyPairs` | Associate instances key pairs<br>Required: `KeyIds`, `InstanceIds` |
| `DisassociateInstancesKeyPairs` | Run disassociate instances key pairs<br>Required: `KeyIds`, `InstanceIds` |
| `ShareBlueprintAcrossAccounts` | Run share blueprint across accounts<br>Required: `BlueprintId`, `AccountIds` |
| `InquirePriceCreateInstances` | Inquire the price of: create instances<br>Required: `BundleId`, `InstanceChargePrepaid` |
| `CreateInstanceSnapshot` | Create instance snapshot<br>Required: `InstanceId` |
| `SyncBlueprint` | Sync blueprint<br>Required: `BlueprintId`, `DestinationRegions` |
| `CreateFirewallTemplateRules` | Create firewall template rules<br>Required: `TemplateId`, `TemplateRules` |
| `IsolateInstances` | Run isolate instances<br>Required: `InstanceIds` |
| `CreateMcpServer` | Create mcp server<br>Required: `InstanceId`, `Name`, `Command` |
| `CreateBlueprint` | Create blueprint<br>Required: `BlueprintName` |
| `DetachDisks` | Detach disks<br>Required: `DiskIds` |
| `StartDockerContainers` | Start docker containers<br>Required: `InstanceId`, `ContainerIds` |
| `CreateKeyPair` | Create key pair<br>Required: `KeyName` |
| `AttachCcn` | Attach ccn<br>Required: `CcnId` |
| `CreateDisks` | Create disks<br>Required: `Zone`, `DiskSize` (unit: GB), `DiskType` (CLOUD_PREMIUM | CLOUD_SSD), `DiskChargePrepaid` |
| `ApplyFirewallTemplate` | Run apply firewall template<br>Required: `TemplateId`, `ApplyInstances` |
| `RunDockerContainers` | Run docker containers<br>Required: `InstanceId`, `Containers` |
| `StartInstances` | Start instances<br>Required: `InstanceIds` |
| `RebootInstances` | Reboot instances<br>Required: `InstanceIds` |
| `ApplyDiskBackup` | Run apply disk backup<br>Required: `DiskId`, `DiskBackupId` |
| `IsolateDisks` | Run isolate disks<br>Required: `DiskIds` |
| `InquirePriceCreateBlueprint` | Inquire the price of: create blueprint |
| `InquirePriceRenewInstances` | Inquire the price of: renew instances<br>Required: `InstanceIds`, `InstanceChargePrepaid` |
| `ApplyInstanceSnapshot` | Run apply instance snapshot<br>Required: `InstanceId`, `SnapshotId` |
| `DetachCcn` | Detach ccn<br>Required: `CcnId` |
| `CreateInstances` | Create instances<br>Required: `BundleId`, `BlueprintId`, `InstanceChargePrepaid` |
| `ReplaceFirewallTemplateRule` | Replace firewall template rule<br>Required: `TemplateId`, `TemplateRuleId`, `TemplateRule` |

## Blocked destructive actions (38)

`ModifyFirewallTemplate`, `DeleteBlueprints`, `CancelShareBlueprintAcrossAccounts`, `ModifyInstancesAttribute`, `DeleteKeyPairs`, `ModifyDisksRenewFlag`, `TerminateInstances`, `ModifyBlueprintAttribute`, `RestartDockerContainers`, `ModifyDiskBackupsAttribute`, `ModifyDisksAttribute`, `ModifyFirewallRules`, `RemoveMcpServers`, `DeleteDiskBackups`, `DeleteFirewallTemplate`, `ModifyDockerContainer`, `ModifyDisksBackupQuota`, `ModifySnapshotAttribute`, `TerminateDisks`, `ModifyImageSharePermission`, `ModifyMcpServer`, `ModifyInstancesRenewFlag`, `ResetInstance`, `ModifyFirewallRuleDescription`, `ResetAttachCcn`, `ModifyInstancesBundle`, `StopInstances`, `StopDockerContainers`, `StopMcpServers`, `DeleteFirewallTemplateRules`, `RemoveDockerContainers`, `DeleteFirewallRules`, `ResetInstancesPassword`, `DeleteSnapshots`, `ResetFirewallTemplateRules`, `RenewDisks`, `RenewInstances`, `RestartMcpServers` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `lighthouse`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20200324` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="lighthouse"`) for the allow/block decision and reason.

---
name: tencent-config
description: Tencent Cloud CONFIG via the Tencent MCP server — 67 actions in API version v20220802 (29 read-only auto-allowed). Use for aggregate, compliance, pack, evaluation, deliver, discovered. Triggers on mentions of config, aggregate, compliance, pack, evaluation, deliver, discovered, recorder, remediation. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud CONFIG

General service: 67 actions in API version `v20220802` — 29 read-only (auto-allowed), 31 gated mutations, 7 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "config"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/config/v20220802 — action signatures in `config_client.ts`, full request/response shapes in `config_models.ts`.

## Read actions (auto-allowed, 29)

| Action | What it does |
|---|---|
| `DescribeCompliancePack` | Describe compliance pack |
| `ListDiscoveredResources` | List discovered resources<br>Required: `MaxResults` |
| `ListAggregators` | List aggregators<br>Required: `Limit`, `Offset` |
| `ListConfigRules` | List config rules<br>Required: `Limit`, `Offset` |
| `ListConfigRuleResourceEvaluationResults` | List config rule resource evaluation results |
| `ListAggregateDiscoveredResources` | List aggregate discovered resources<br>Required: `MaxResults`, `AccountGroupId` |
| `ListSystemRules` | List system rules<br>Required: `Limit`, `Offset` |
| `ListResourceTypes` | List resource types |
| `DescribeConfigDeliver` | Describe config deliver |
| `ListRemediations` | List remediations |
| `ListAggregateConfigRuleResourceEvaluationResults` | List aggregate config rule resource evaluation results |
| `ListAggregateCompliancePacks` | List aggregate compliance packs<br>Required: `Limit`, `Offset`, `AccountGroupId` |
| `DescribeAggregateConfigRule` | Describe aggregate config rule<br>Required: `RuleId`, `AccountGroupId` |
| `DescribeConfigRecorder` | Describe config recorder |
| `ListAlarmPolicy` | List alarm policy<br>Required: `Offset`, `Limit` |
| `DescribeAggregateCompliancePack` | Describe aggregate compliance pack<br>Required: `AccountGroupId` |
| `DescribeAggregateConfigDeliver` | Describe aggregate config deliver<br>Required: `AccountGroupId` |
| `DescribeConfigRule` | Describe config rule<br>Required: `RuleId` |
| `ListAggregateConfigRuleEvaluationResults` | List aggregate config rule evaluation results<br>Required: `ConfigRuleId`, `Limit`, `Offset`, `AccountGroupId` |
| `DescribeDiscoveredResource` | Describe discovered resource<br>Required: `ResourceId`, `ResourceType`, `ResourceRegion` |
| `DescribeAggregator` | Describe aggregator<br>Required: `AccountGroupId`, `OwnerUin` |
| `DescribeSystemCompliancePack` | Describe system compliance pack<br>Required: `CompliancePackId` |
| `DescribeSystemRule` | Describe system rule |
| `ListRemediationExecutions` | List remediation executions<br>Required: `RuleId` |
| `ListAggregateConfigRules` | List aggregate config rules<br>Required: `Limit`, `Offset`, `AccountGroupId` |
| `ListSystemCompliancePacks` | List system compliance packs<br>Required: `Limit`, `Offset` |
| `ListConfigRuleEvaluationResults` | List config rule evaluation results<br>Required: `ConfigRuleId`, `Limit`, `Offset` |
| `DescribeAggregateDiscoveredResource` | Describe aggregate discovered resource<br>Required: `ResourceId`, `ResourceType`, `ResourceRegion`, `AccountGroupId`, `ResourceOwnerId` |
| `ListCompliancePacks` | List compliance packs<br>Required: `Limit`, `Offset` |
## Mutations (gated — need allowlist, 31)

| Action | What it does |
|---|---|
| `AddConfigRule` | Add config rule<br>Required: `Identifier`, `IdentifierType`, `RuleName`, `ResourceType`, `TriggerType`, `RiskLevel` |
| `StartAggregateConfigRuleEvaluation` | Start aggregate config rule evaluation<br>Required: `TriggerType`, `AccountGroupId` |
| `UpdateAggregateConfigDeliver` | Update aggregate config deliver<br>Required: `Status`, `AccountGroupId` |
| `OpenConfigRule` | Open config rule<br>Required: `RuleId` |
| `CreateAggregator` | Create aggregator<br>Required: `Name`, `Description`, `Type` |
| `OpenConfigRecorder` | Open config recorder |
| `StartConfigRuleEvaluation` | Start config rule evaluation |
| `AddAggregateConfigRule` | Add aggregate config rule<br>Required: `Identifier`, `IdentifierType`, `RuleName`, `ResourceType`, `TriggerType`, `RiskLevel`, `AccountGroupId` |
| `CreateRemediation` | Create remediation<br>Required: `RuleId`, `RemediationType`, `RemediationTemplateId`, `InvokeType` |
| `UpdateRemediation` | Update remediation<br>Required: `RemediationId` |
| `UpdateAggregator` | Update aggregator<br>Required: `Name`, `Description`, `AccountGroupId`, `OwnerUin` |
| `UpdateCompliancePack` | Update compliance pack<br>Required: `CompliancePackName`, `RiskLevel`, `CompliancePackId`, `ConfigRules` |
| `StartRemediation` | Start remediation<br>Required: `RuleId` |
| `UpdateAggregateConfigRule` | Update aggregate config rule<br>Required: `TriggerType`, `RiskLevel`, `RuleId`, `AccountGroupId` |
| `UpdateCompliancePackStatus` | Update compliance pack status<br>Required: `CompliancePackId`, `Status` |
| `AddAlarmPolicy` | Add alarm policy<br>Required: `Name`, `Type`, `EventScope`, `RiskLevel`, `NoticeTime`, `NotificationMechanism`, `Status`, `NoticePeriod` |
| `OpenAggregateConfigRule` | Open aggregate config rule<br>Required: `RuleId`, `AccountGroupId` |
| `DetachConfigRuleToCompliancePack` | Detach config rule to compliance pack<br>Required: `CompliancePackId`, `ConfigRuleId` |
| `UpdateConfigDeliver` | Update config deliver<br>Required: `Status` |
| `AddCompliancePack` | Add compliance pack<br>Required: `ConfigRules`, `RiskLevel`, `CompliancePackName` |
| `CloseConfigRecorder` | Close config recorder |
| `UpdateAlarmPolicy` | Update alarm policy<br>Required: `AlarmPolicyId` |
| `UpdateConfigRecorder` | Update config recorder |
| `PutEvaluations` | Put evaluations<br>Required: `ResultToken`, `Evaluations` |
| `UpdateAggregateCompliancePack` | Update aggregate compliance pack<br>Required: `CompliancePackName`, `RiskLevel`, `CompliancePackId`, `ConfigRules`, `AccountGroupId` |
| `UpdateConfigRule` | Update config rule<br>Required: `TriggerType`, `RiskLevel`, `RuleId` |
| `CloseAggregateConfigRule` | Close aggregate config rule<br>Required: `RuleId`, `AccountGroupId` |
| `DetachAggregateConfigRuleToCompliancePack` | Detach aggregate config rule to compliance pack<br>Required: `CompliancePackId`, `ConfigRuleId`, `AccountGroupId` |
| `AddAggregateCompliancePack` | Add aggregate compliance pack<br>Required: `ConfigRules`, `RiskLevel`, `CompliancePackName`, `AccountGroupId` |
| `UpdateAggregateCompliancePackStatus` | Update aggregate compliance pack status<br>Required: `CompliancePackId`, `Status`, `AccountGroupId` |
| `CloseConfigRule` | Close config rule<br>Required: `RuleId` |

## Blocked destructive actions (7)

`DeleteAlarmPolicy`, `DeleteConfigRule`, `DeleteAggregateCompliancePack`, `DeleteRemediations`, `DeleteAggregators`, `DeleteCompliancePack`, `DeleteAggregateConfigRule` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `config`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220802` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="config"`) for the allow/block decision and reason.

---
name: tencent-mqtt
description: Tencent Cloud MQTT via the Tencent MCP server — 79 actions in API version v20240516 (30 read-only auto-allowed). Use for device, certificate, message, subscription, topic, authorization. Triggers on mentions of mqtt, device, certificate, message, subscription, topic, authorization, client, enrichment. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: Messaging & eventing
metadata:
  version: "4"
---

# Tencent Cloud MQTT

Messaging & eventing: 79 actions in API version `v20240516` — 30 read-only (auto-allowed), 24 gated mutations, 25 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "mqtt"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Topics/queues are region-scoped; producers and consumers must target the same endpoint and namespace/VPC.
Offsets and consumer groups own delivery progress — resetting offsets replays or skips messages; confirm group state before touching.
Retention and partition counts are set at creation and hard to change later — size from throughput and retention needs up front.
Access control is per-topic/queue — grant produce/consume separately and test with a canary message before production cutover.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/mqtt/v20240516 — action signatures in `mqtt_client.ts`, full request/response shapes in `mqtt_models.ts`.

## Read actions (auto-allowed, 30)

| Action | What it does |
|---|---|
| `DescribeMessageEnrichmentRules` | Describe message enrichment rules<br>Required: `InstanceId` |
| `DescribeTopic` | Describe topic<br>Required: `InstanceId`, `Topic` |
| `DescribeMessageByTopic` | Describe message by topic<br>Required: `InstanceId`, `Topic`, `StartTime` |
| `DescribeDeviceCertificateBackupHistory` | Describe device certificate backup history<br>Required: `InstanceId`, `Destination` |
| `DescribeInsPublicEndpoints` | Describe ins public endpoints<br>Required: `InstanceId` |
| `DescribeSharedSubscriptionGroupsWithSubscriptions` | Describe shared subscription groups with subscriptions<br>Required: `InstanceId` |
| `DescribeDeviceCertificate` | Describe device certificate<br>Required: `DeviceCertificateSn`, `InstanceId` |
| `DescribeInsVPCEndpoints` | Describe ins vpcendpoints<br>Required: `InstanceId` |
| `DescribeClientList` | Describe client list<br>Required: `InstanceId` |
| `DescribeProductSKUList` | Describe product skulist |
| `DescribeDeviceCertificates` | Describe device certificates<br>Required: `InstanceId` |
| `DescribeCaCertificates` | Describe ca certificates<br>Required: `InstanceId` |
| `DescribeUserList` | Describe user list<br>Required: `InstanceId` |
| `DescribeAuthorizationPolicies` | Describe authorization policies |
| `DescribeTopicList` | Describe topic list<br>Required: `InstanceId` |
| `DescribeWillMessage` | Describe will message<br>Required: `InstanceId`, `ClientId` |
| `DescribeInstanceList` | Describe instance list |
| `DescribeSharedSubscriptionLag` | Describe shared subscription lag<br>Required: `InstanceId`, `SharedSubscription` |
| `DescribeInstance` | Describe instance<br>Required: `InstanceId` |
| `DescribeDeviceIdentityBackupHistory` | Describe device identity backup history<br>Required: `InstanceId`, `Destination` |
| `DescribeDeviceIdentity` | Describe device identity<br>Required: `InstanceId`, `DeviceId` |
| `DescribeSharedSubscriptions` | Describe shared subscriptions<br>Required: `InstanceId`, `SharedName` |
| `DescribeCaCertificate` | Describe ca certificate<br>Required: `CaSn`, `InstanceId` |
| `DescribeBlockRuleList` | Describe block rule list<br>Required: `InstanceId` |
| `DescribeMessageDetails` | Describe message details<br>Required: `InstanceId`, `MessageId` |
| `DescribeSharedSubscriptionClient` | Describe shared subscription client<br>Required: `InstanceId`, `SharedName`, `TopicFilter` |
| `DescribeAuthenticator` | Describe authenticator<br>Required: `InstanceId` |
| `DescribeMessageList` | Describe message list<br>Required: `InstanceId`, `Topic`, `StartTime`, `EndTime`, `TaskRequestId` |
| `DescribeSharedSubscriptionGroups` | Describe shared subscription groups<br>Required: `InstanceId` |
| `DescribeDeviceIdentities` | Describe device identities<br>Required: `InstanceId` |
## Mutations (gated — need allowlist, 24)

| Action | What it does |
|---|---|
| `CreateDeviceIdentity` | Create device identity<br>Required: `InstanceId`, `DeviceId` |
| `PublishMessage` | Publish message<br>Required: `InstanceId`, `Payload` |
| `CreateInsPublicEndpoint` | Create ins public endpoint<br>Required: `InstanceId`, `Bandwidth` |
| `DeactivateDeviceCertificate` | Deactivate device certificate<br>Required: `InstanceId`, `DeviceCertificateSn` |
| `DeactivateCaCertificate` | Deactivate ca certificate<br>Required: `InstanceId`, `CaSn` |
| `CreateJWTAuthenticator` | Create jwtauthenticator<br>Required: `InstanceId`, `Algorithm`, `From` (default username) |
| `CreateMessageEnrichmentRule` | Create message enrichment rule<br>Required: `InstanceId`, `RuleName`, `Condition`, `Actions`, `Priority` |
| `UpdateAuthorizationPolicyPriority` | Update authorization policy priority<br>Required: `InstanceId` |
| `RegisterDeviceCertificate` | Register device certificate<br>Required: `InstanceId`, `DeviceCertificate`, `CaSn` |
| `UpdateMessageEnrichmentRulePriority` | Update message enrichment rule priority<br>Required: `InstanceId` |
| `CreateTopic` | Create topic<br>Required: `InstanceId`, `Topic` |
| `ActivateDeviceCertificate` | Activate device certificate<br>Required: `InstanceId`, `DeviceCertificateSn` |
| `CreateBlockRule` | Create block rule<br>Required: `InstanceId`, `Name` |
| `CreateInstance` | Create instance<br>Required: `InstanceType`, `Name`, `SkuCode` |
| `RevokedDeviceCertificate` | Revoke d device certificate<br>Required: `InstanceId`, `DeviceCertificateSn` |
| `AddClientSubscription` | Add client subscription<br>Required: `InstanceId`, `ClientId`, `TopicFilter` |
| `CreateJWKSAuthenticator` | Create jwksauthenticator<br>Required: `InstanceId` |
| `KickOutClient` | Run kick out client<br>Required: `InstanceId`, `ClientId` |
| `RegisterCaCertificate` | Register ca certificate<br>Required: `InstanceId`, `CaCertificate`, `VerificationCertificate` |
| `ActivateCaCertificate` | Activate ca certificate<br>Required: `InstanceId`, `CaSn` |
| `CreateUser` | Create user<br>Required: `InstanceId`, `Username` |
| `ApplyRegistrationCode` | Run apply registration code<br>Required: `InstanceId` |
| `CreateAuthorizationPolicy` | Create authorization policy<br>Required: `InstanceId`, `PolicyName`, `PolicyVersion` (default 1), `Priority`, `Effect`, `Actions`, `Retain`, `Qos` |
| `CreateHttpAuthenticator` | Create http authenticator<br>Required: `InstanceId`, `Endpoint` |

## Blocked destructive actions (25)

`ModifyTopic`, `DeleteCaCertificate`, `DeleteDeviceCertificate`, `ModifyInsPublicEndpoint`, `DeleteInstance`, `ModifyX509Config`, `ModifyJWKSAuthenticator`, `DeleteBlockRule`, `ModifyBlockRule`, `ModifyJWTAuthenticator`, `ModifyInstanceCertBinding`, `ModifyMessageEnrichmentRule`, `DeleteDeviceIdentity`, `DeleteInsPublicEndpoint`, `DeleteTopic`, `ModifyUser`, `DeleteUser`, `ModifyAuthorizationPolicy`, `DeleteAuthorizationPolicy`, `ModifyHttpAuthenticator`, `DeleteAuthenticator`, `ModifyDeviceIdentity`, `DeleteMessageEnrichmentRule`, `ModifyInstance`, `DeleteClientSubscription` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `mqtt`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20240516` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="mqtt"`) for the allow/block decision and reason.

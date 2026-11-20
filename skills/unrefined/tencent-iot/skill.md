---
name: tencent-iot
description: Tencent Cloud IOT via the Tencent MCP server — 45 actions in API version v20180123 (15 read-only auto-allowed). Use for device, product, topic, control, devices, gateway. Triggers on mentions of iot, device, product, topic, control, devices, gateway, issue, reset. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud IOT

General service: 45 actions in API version `v20180123` — 15 read-only (auto-allowed), 25 gated mutations, 5 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "iot"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/iot/v20180123 — action signatures in `iot_client.ts`, full request/response shapes in `iot_models.ts`.

## Read actions (auto-allowed, 15)

| Action | What it does |
|---|---|
| `GetDataHistory` | Get data history<br>Required: `ProductId`, `DeviceNames`, `StartTime`, `EndTime` |
| `GetDeviceStatistics` | Get device statistics |
| `GetDebugLog` | Get debug log<br>Required: `ProductId`, `DeviceNames`, `StartTime`, `EndTime` |
| `GetDevices` | Get devices<br>Required: `ProductId` |
| `GetProducts` | Get products |
| `GetDeviceSignatures` | Get device signatures<br>Required: `ProductId`, `DeviceNames` |
| `GetDeviceStatuses` | Get device statuses<br>Required: `ProductId`, `DeviceNames` |
| `GetRules` | Get rules |
| `GetTopic` | Get topic<br>Required: `TopicId`, `ProductId` |
| `GetDevice` | Get device<br>Required: `ProductId`, `DeviceName` |
| `GetDeviceData` | Get device data<br>Required: `ProductId`, `DeviceName` |
| `GetRule` | Get rule<br>Required: `RuleId` |
| `GetDeviceLog` | Get device log<br>Required: `ProductId`, `DeviceNames`, `StartTime`, `EndTime` |
| `GetTopics` | Get topics<br>Required: `ProductId` |
| `GetProduct` | Get product<br>Required: `ProductId` |
## Mutations (gated — need allowlist, 25)

| Action | What it does |
|---|---|
| `AppSecureAddDevice` | Run app secure add device<br>Required: `AccessToken`, `DeviceSignature` |
| `IssueDeviceControl` | Run issue device control<br>Required: `ProductId`, `DeviceName`, `ControlData` |
| `DeactivateRule` | Deactivate rule<br>Required: `RuleId` |
| `AddTopic` | Add topic<br>Required: `ProductId`, `TopicName` |
| `AppGetDeviceStatuses` | Run app get device statuses<br>Required: `AccessToken`, `DeviceIds` |
| `AppGetToken` | Run app get token<br>Required: `UserName`, `Password` |
| `AppUpdateUser` | Run app update user<br>Required: `AccessToken` |
| `AddRule` | Add rule<br>Required: `Name`, `Description` |
| `UnassociateSubDeviceFromGatewayProduct` | Run unassociate sub device from gateway product<br>Required: `SubDeviceProductId`, `GatewayProductId` |
| `AddProduct` | Add product<br>Required: `Name`, `Description` |
| `PublishMsg` | Publish msg<br>Required: `Topic`, `Message` |
| `UpdateRule` | Update rule<br>Required: `RuleId` |
| `AppDeleteDevice` | Run app delete device<br>Required: `AccessToken`, `ProductId`, `DeviceName` |
| `AppGetUser` | Run app get user<br>Required: `AccessToken` |
| `AppGetDevices` | Run app get devices<br>Required: `AccessToken` |
| `AppAddUser` | Run app add user<br>Required: `UserName`, `Password` |
| `UpdateProduct` | Update product<br>Required: `ProductId` |
| `AppIssueDeviceControl` | Run app issue device control<br>Required: `AccessToken`, `ProductId`, `DeviceName`, `ControlData` |
| `AppGetDeviceData` | Run app get device data<br>Required: `AccessToken`, `ProductId`, `DeviceName` |
| `AppGetDevice` | Run app get device<br>Required: `AccessToken`, `ProductId`, `DeviceName` |
| `AddDevice` | Add device<br>Required: `ProductId`, `DeviceName` |
| `AppResetPassword` | Run app reset password<br>Required: `AccessToken`, `OldPassword`, `NewPassword` |
| `ActivateRule` | Activate rule<br>Required: `RuleId` |
| `AssociateSubDeviceToGatewayProduct` | Associate sub device to gateway product<br>Required: `SubDeviceProductId`, `GatewayProductId` |
| `AppUpdateDevice` | Run app update device<br>Required: `AccessToken`, `ProductId`, `DeviceName` |

## Blocked destructive actions (5)

`ResetDevice`, `DeleteRule`, `DeleteDevice`, `DeleteProduct`, `DeleteTopic` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `iot`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20180123` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="iot"`) for the allow/block decision and reason.

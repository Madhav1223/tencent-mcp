---
name: tencent-lcic
description: Tencent Cloud LCIC via the Tencent MCP server — 85 actions in API version v20220817 (35 read-only auto-allowed). Use for room, batch, document, member, live, login. Triggers on mentions of lcic, room, batch, document, member, live, login, playback, edit. Reads pass automatically; mutations need TENCENT_MCP_ALLOW_MUTATIONS; destructive prefixes are blocked.
group: General service
metadata:
  version: "4"
---

# Tencent Cloud LCIC

General service: 85 actions in API version `v20220817` — 35 read-only (auto-allowed), 34 gated mutations, 16 blocked destructive.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "lcic"`, plus `list_service_actions` for the exact live inventory and `get_metadata_context` for region defaults. Required params below are exact per the official SDK.

## How to work this service

Inventory first with the service's `Describe*` / `List*` / `Get*` actions, filtered narrowly — confirm IDs before any mutation.
Price with `InquiryPrice*` where available before creating billable resources.
Mutations outside the readonly prefixes need explicit `TENCENT_MCP_ALLOW_MUTATIONS` entries; destructive prefixes are blocked outright.

1. Confirm region defaults: `get_metadata_context` (falls back to `ap-singapore`).
2. Inventory first: pick a read action below, then narrow with filters/IDs.
3. Mutate only with an allowlist entry — confirm IDs and cost with the user first.

SDK source (public, exact version pinned): https://github.com/TencentCloud/tencentcloud-sdk-nodejs/tree/master/src/services/lcic/v20220817 — action signatures in `lcic_client.ts`, full request/response shapes in `lcic_models.ts`.

## Read actions (auto-allowed, 35)

| Action | What it does |
|---|---|
| `DescribeAppDetail` | Describe app detail<br>Required: `ApplicationId`, `DeveloperId` |
| `DescribeSupervisors` | Describe supervisors<br>Required: `SdkAppId` |
| `DescribeRoomForbiddenUser` | Describe room forbidden user<br>Required: `SdkAppId`, `RoomId` |
| `DescribeRoomStatistics` | Describe room statistics<br>Required: `RoomId`, `Page`, `Limit` |
| `DescribeRecordStream` | Describe record stream<br>Required: `SdkAppId`, `RoomId` |
| `DescribeDocuments` | Describe documents<br>Required: `SchoolId`, `Page`, `Limit`, `Permission` |
| `DescribeDocumentsByRoom` | Describe documents by room<br>Required: `RoomId`, `SdkAppId` |
| `DescribeWhiteBoardSnapshot` | Describe white board snapshot |
| `GetRoomMessage` | Get room message<br>Required: `SdkAppId`, `RoomId` |
| `DescribeRecord` | Describe record<br>Required: `SdkAppId`, `RoomId` |
| `GetWatermark` | Get watermark<br>Required: `SdkAppId` |
| `DescribeEditVersions` | Describe edit versions<br>Required: `SdkAppId`, `RoomId` |
| `DescribeGroup` | Describe group<br>Required: `GroupId`, `SdkAppId` |
| `DescribeLiveRelayConfig` | Describe live relay config<br>Required: `SdkAppId`, `RoomId` |
| `DescribeDocument` | Describe document<br>Required: `DocumentId` |
| `DescribeSdkAppIdUsers` | Describe sdk app id users<br>Required: `SdkAppId` |
| `GetPlaybackToken` | Get playback token<br>Required: `SdkAppId`, `RoomId` |
| `DescribeUser` | Describe user |
| `DescribeGroupMemberList` | Describe group member list<br>Required: `GroupId`, `SdkAppId` |
| `DescribeRoom` | Describe room<br>Required: `RoomId` |
| `DescribeUserDetail` | Describe user detail |
| `DescribePlayRecords` | Describe play records<br>Required: `SdkAppId`, `RoomId`, `StartTime`, `EndTime`, `Page` (default 1), `PageSize` (default 20) |
| `DescribeGroupList` | Describe group list<br>Required: `SdkAppId` |
| `DescribeRecordTask` | Describe record task<br>Required: `SdkAppId`, `RoomId` |
| `GetRoomEvent` | Get room event<br>Required: `RoomId`, `SdkAppId`, `Page`, `Limit` |
| `DescribePlaybackList` | Describe playback list<br>Required: `SdkAppId` |
| `DescribeDeveloper` | Describe developer |
| `DescribeQuestionList` | Describe question list<br>Required: `RoomId` |
| `DescribeCurrentMemberList` | Describe current member list<br>Required: `RoomId`, `Page`, `Limit` |
| `DescribeAnswerList` | Describe answer list<br>Required: `QuestionId` |
| `GetRooms` | Get rooms<br>Required: `SdkAppId` |
| `DescribeGroupLiveCodes` | Describe group live codes |
| `GetEditVersionToken` | Get edit version token<br>Required: `SdkAppId`, `RoomId`, `UserId` |
| `DescribeMarquee` | Describe marquee<br>Required: `SdkAppId`, `RoomId` |
| `DescribeScoreList` | Describe score list<br>Required: `RoomId` |
## Mutations (gated — need allowlist, 34)

| Action | What it does |
|---|---|
| `SendRoomNotificationMessage` | Send room notification message<br>Required: `SdkAppId`, `RoomId`, `MsgContent` |
| `SetWatermark` | Set watermark<br>Required: `SdkAppId` |
| `StartRecord` | Start record<br>Required: `SdkAppId`, `RoomId` |
| `SetMainEditVersion` | Set main edit version<br>Required: `SdkAppId`, `RoomId`, `VersionNo` |
| `StartRoom` | Start room<br>Required: `RoomId` |
| `CreateDocument` | Create document<br>Required: `SdkAppId`, `DocumentUrl`, `DocumentName`, `Owner` |
| `LoginOriginIdWithRoom` | Log in origin id with room<br>Required: `SdkAppId`, `OriginId`, `RoomId` |
| `BatchGetPlaybackToken` | Run batch get playback token<br>Required: `SdkAppId`, `RoomIds` |
| `UnbindDocumentFromRoom` | Unbind document from room<br>Required: `RoomId`, `DocumentId` |
| `BatchRegister` | Run batch register<br>Required: `Users` |
| `BatchAddGroupMember` | Run batch add group member<br>Required: `GroupIds`, `SdkAppId`, `MemberIds` |
| `BatchDeleteGroupMember` | Run batch delete group member<br>Required: `GroupIds`, `SdkAppId`, `MemberIds` |
| `CreateGroupLiveCodes` | Create group live codes<br>Required: `SdkAppId`, `RoomId`, `Number` |
| `SendRoomNormalMessage` | Send room normal message<br>Required: `SdkAppId`, `RoomId`, `FromAccount`, `MsgBody` |
| `LoginUserWithRoom` | Log in user with room<br>Required: `UserId`, `RoomId` |
| `AddGroupMember` | Add group member<br>Required: `GroupId`, `SdkAppId`, `MemberIds` |
| `RegisterUser` | Register user<br>Required: `SdkAppId` |
| `UnblockKickedUser` | Run unblock kicked user<br>Required: `SdkAppId`, `RoomId`, `UserId` |
| `BindDocumentToRoom` | Bind document to room<br>Required: `RoomId`, `DocumentId` |
| `LoginOriginId` | Log in origin id<br>Required: `SdkAppId`, `OriginId` |
| `ForbidSendMsg` | Forbid send msg<br>Required: `SdkAppId`, `RoomId`, `MembersAccount`, `MuteTime` |
| `LoginUser` | Log in user<br>Required: `UserId` |
| `CreateGroupWithMembers` | Create group with members<br>Required: `GroupName`, `SdkAppId` |
| `CreateSupervisor` | Create supervisor<br>Required: `SdkAppId`, `Users` |
| `SetAppCustomContent` | Set app custom content<br>Required: `CustomContent`, `SdkAppId` |
| `BatchDescribeDocument` | Run batch describe document<br>Required: `SdkAppId`, `Page`, `Limit`, `Permission` |
| `BatchCreateRoom` | Run batch create room<br>Required: `SdkAppId`, `RoomInfos` |
| `BatchDeleteRecord` | Run batch delete record<br>Required: `RoomIds`, `SdkAppId` |
| `EndRoom` | Run end room<br>Required: `RoomId` |
| `SetMarquee` | Set marquee<br>Required: `SdkAppId`, `RoomId`, `MarqueeType`, `DisplayMode` |
| `KickUserFromRoom` | Run kick user from room<br>Required: `RoomId`, `SdkAppId`, `UserId`, `KickType`, `Duration` (default 0) |
| `BatchCreateGroupWithMembers` | Run batch create group with members<br>Required: `SdkAppId`, `GroupBaseInfos` |
| `CreateGroupWithSubGroup` | Create group with sub group<br>Required: `GroupName`, `SdkAppId`, `SubGroupIds` |
| `CreateRoom` | Create room<br>Required: `Name`, `StartTime`, `EndTime`, `SdkAppId`, `Resolution` (MaxMicNumber), `MaxMicNumber`, `SubType` |

## Blocked destructive actions (16)

`ModifyRoom`, `DeleteAppCustomContent`, `ModifyApp`, `DeleteGroupMember`, `DeleteGroup`, `ModifyGroup`, `DeleteUser`, `DeleteRecord`, `DeleteSupervisor`, `ModifyLiveRelayConfig`, `DeleteDocument`, `StopRecord`, `DeleteRoom`, `DeleteWhiteBoardSnapshot`, `ModifyUserProfile`, `DeletePlaybackItem` — console or policy change only.
## Mistakes to avoid

- **Case-sensitive names.** Service is lowercase `lcic`, actions PascalCase exactly as listed.
- **Region-scoped resources.** Pass the resource's own region; the default won't find resources elsewhere.
- **Pinned API version.** Calls run against `v20220817` — params outside that version's model are rejected.
- **Credentials are file-only** (`creds/credentials.json`). `Token verification failed` means fix the file, not the call.
- **Required params are strict.** Every `Required:` field above must be present with the documented shape (nested objects included) — most validation failures are a missing nested struct, so mirror an existing object via the matching `Get*`/`Describe*` call first.

## Verify

- Re-run the matching read action after any mutation and diff the fields; success responses can precede propagation.
- Every call is audited — check `/app/logs/audit.ndjson` or Grafana (`job="tencent-mcp-audit"`, `service="lcic"`) for the allow/block decision and reason.

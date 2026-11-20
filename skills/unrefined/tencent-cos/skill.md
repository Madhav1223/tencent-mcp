---
name: tencent-cos
description: Works with Tencent Cloud Object Storage (COS) — buckets, objects, multipart upload/download, ACLs, tagging, lifecycle, versioning, and presigned URLs. Use for any file or bucket task. Triggers on mentions of COS, S3, bucket, object, upload, download, presigned URL, ACL, lifecycle, versioning, or static hosting. COS uses camelCase method names (getBucket, putObject), not PascalCase actions. Reads (get/head/list) pass automatically; put/delete mutations are gated.
metadata:
  version: "1"
---

# Tencent Cloud COS

Object storage: buckets and objects, multipart transfers, ACLs, lifecycle, versioning, presigned URLs. Served over the XML REST API (`xml-rest`) via `cos-nodejs-sdk-v5` — **not** the generic TencentCloud client.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cos"`. Always include `Bucket` and `Region` in params.

## Procedures

| User need | Do this |
|---|---|
| List all buckets | `action: "getService"`, `params: {}` |
| List objects in a bucket | `action: "getBucket"`, `params: {"Bucket": "<b>-<appid>", "Region": "<region>"}` |
| Download a file | `action: "getObject"`, `params: {"Bucket", "Region", "Key"}` (streaming: `getObjectStream`) |
| Upload a file | `action: "putObject"` with `Bucket`, `Region`, `Key`, `Body` — **gated** |
| Large file upload/download | `sliceUploadFile` / `uploadFiles` / `downloadFile` (multipart, resumable) — **gated for uploads** |
| Share a private file | `action: "getObjectUrl"`, `params: {"Bucket", "Region", "Key", "Sign": true, "Expires": 3600}` |
| Check existence without downloading | `headBucket` / `headObject` |
| Bucket config (ACL, CORS, lifecycle, versioning, policy, tagging, website) | `getBucketAcl` / `putBucketAcl`, `getBucketCors` / `putBucketCors`, `getBucketLifecycle` / `putBucketLifecycle`, `getBucketVersioning` / `putBucketVersioning`, `getBucketPolicy` / `putBucketPolicy` — **put*/delete* gated** |
| List in-progress multipart uploads | `multipartList`, `multipartListPart`; abort stale ones with `multipartAbort` — **gated** |

## Safety

- **Auto-allowed:** `get*`, `head*`, `list*`, `selectObjectContent`, `multipartList`, `getObjectUrl`, `getAuth`.
- **Gated:** `put*`, `delete*`, `upload*`, `slice*`, `multipartInit/Upload/Complete/Abort`, `appendObject`, `restoreObject`.
- Bucket names are `<name>-<appid>` — the AppId suffix is mandatory.

## Mistakes to avoid

- **Wrong casing:** COS actions are camelCase (`getBucket`, `putObject`, `deleteMultipleObject`). PascalCase (`GetBucket`, `PutObject`) does not exist here and fails as unknown action — this is the opposite convention from every other Tencent service.
- **Missing Region:** COS is region-scoped per bucket. Always pass the bucket's `Region` (e.g. `ap-singapore`); without it the SDK falls back to the default region and a valid bucket reports as missing.
- `Key` is the full object path including prefix — there are no real folders; `getBucket` with `Prefix`/`Delimiter` emulates listing.
- `deleteMultipleObject` takes an `Objects: [{Key}]` array, not a single `Key`.

## Verify

- After upload, `headObject` on the same `Bucket`/`Region`/`Key` confirms size and ETag.
- After ACL/policy changes, re-read with the matching `get*` action — never assume the write applied.

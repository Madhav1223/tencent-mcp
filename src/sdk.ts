// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { createRequire } from "node:module";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import * as path from "node:path";

const require = createRequire(import.meta.url);
const tencentcloud = require("tencentcloud-sdk-nodejs");

let COS: any;
try {
  COS = require("cos-nodejs-sdk-v5");
} catch {
  COS = null;
}

export interface TencentCredentials {
  secretId?: string;
  secretKey?: string;
  token?: string;
}

export interface ServiceVersion {
  name: string;
  version: string;
  actions: string[];
}

const COS_METHODS = [
  "getService",
  "putBucket",
  "headBucket",
  "getBucket",
  "deleteBucket",
  "putBucketAcl",
  "putBucketACL",
  "getBucketAcl",
  "getBucketACL",
  "putBucketCors",
  "putBucketCORS",
  "getBucketCors",
  "getBucketCORS",
  "deleteBucketCors",
  "deleteBucketCORS",
  "getBucketLocation",
  "getBucketPolicy",
  "putBucketPolicy",
  "deleteBucketPolicy",
  "putBucketTagging",
  "getBucketTagging",
  "deleteBucketTagging",
  "putBucketLifecycle",
  "getBucketLifecycle",
  "deleteBucketLifecycle",
  "putBucketVersioning",
  "getBucketVersioning",
  "putBucketReplication",
  "getBucketReplication",
  "deleteBucketReplication",
  "putBucketWebsite",
  "getBucketWebsite",
  "deleteBucketWebsite",
  "putBucketReferer",
  "getBucketReferer",
  "putBucketDomain",
  "getBucketDomain",
  "deleteBucketDomain",
  "putBucketOrigin",
  "getBucketOrigin",
  "deleteBucketOrigin",
  "putBucketLogging",
  "getBucketLogging",
  "putBucketInventory",
  "getBucketInventory",
  "listBucketInventory",
  "deleteBucketInventory",
  "putBucketAccelerate",
  "getBucketAccelerate",
  "putBucketEncryption",
  "getBucketEncryption",
  "deleteBucketEncryption",
  "getObject",
  "getObjectStream",
  "headObject",
  "listObjectVersions",
  "putObject",
  "deleteObject",
  "getObjectAcl",
  "getObjectACL",
  "putObjectAcl",
  "putObjectACL",
  "optionsObject",
  "putObjectCopy",
  "deleteMultipleObject",
  "restoreObject",
  "putObjectTagging",
  "getObjectTagging",
  "deleteObjectTagging",
  "selectObjectContent",
  "selectObjectContentStream",
  "appendObject",
  "uploadPartCopy",
  "multipartInit",
  "multipartUpload",
  "multipartComplete",
  "multipartList",
  "multipartListPart",
  "multipartAbort",
  "getObjectUrl",
  "getAuth",
  "getV4Auth",
  "sliceUploadFile",
  "abortUploadTask",
  "uploadFile",
  "uploadFiles",
  "sliceCopyFile",
  "downloadFile",
];

export async function resolveCredentials(): Promise<TencentCredentials> {
  const fileCreds = await readCredFile(resolvedCredFile());
  return fileCreds ?? {};
}

// --- Rotating credential file (TENCENT_MCP_CRED_FILE) -----------------------
// A mounted JSON file, re-read on every call (cached by file mtime) so short
// lived / rotating credentials are picked up WITHOUT a container restart.
// Format: { "SecretId": "...", "SecretKey": "...", "Token": "..." }

let CRED_FILE_META: { path: string; sign: string; creds: TencentCredentials } | null = null;

function fileSignature(s: { mtimeMs: number; ctimeMs: number; size: number }): string {
  return `${s.mtimeMs}-${s.ctimeMs}-${s.size}`;
}

export interface CredentialFileStatus {
  path: string;
  state: "ok" | "missing" | "unreadable" | "invalid-json" | "invalid-content";
  detail?: string;
  mtimeMs?: number;
}

let CRED_FILE_STATUS: CredentialFileStatus | null = null;

export function getCredentialFileStatus(): CredentialFileStatus | null {
  return CRED_FILE_STATUS;
}

/**
 * Human-readable description of why the credential file could not be used,
 * or null when the last read succeeded (or no read happened yet).
 */
export function credentialFileProblem(): string | null {
  const st = CRED_FILE_STATUS;
  if (!st) return null;
  if (st.state === "ok") return null;
  switch (st.state) {
    case "missing":
      return `the credential file '${st.path}' does not exist (or was not visible to the server at the last read — under Docker Desktop/WSL2 file-sharing, a container restart re-syncs the bind mount)`;
    case "unreadable":
      return `the credential file '${st.path}' exists but is not readable by the server process (${st.detail ?? "EACCES"}). Check host file ownership/permissions vs the container user`;
    case "invalid-json":
      return `the credential file '${st.path}' was found but is not valid JSON (${st.detail ?? "parse error"}) — content visible to the server may be stale or truncated (Docker Desktop / WSL2 file-sharing can serve stale snapshots after host edits)`;
    case "invalid-content":
      return `the credential file '${st.path}' is readable but lacks valid "secretId"/"SecretId" and "secretKey"/"SecretKey" keys`;
    default:
      return st.detail ?? st.state;
  }
}

// Default credential file: relative to the SERVER's own location (project root),
// not process.cwd(), so it works no matter which directory spawned the process.
const PROJECT_ROOT = path.resolve(dirname(fileURLToPath(import.meta.url)), "..");

function defaultCredFileCandidates(): string[] {
  return [path.join(PROJECT_ROOT, "creds", "credentials.json"), path.join(PROJECT_ROOT, "creds", "credential.json")];
}

export function resolvedCredFile(): string {
  return process.env.TENCENT_MCP_CRED_FILE || defaultCredFileCandidates().find((p) => fileExistsSync(p)) || "";
}

function fileExistsSync(p: string): boolean {
  try {
    const { statSync } = require("node:fs");
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v !== "" ? v : undefined;
}

async function readCredFile(pathName: string): Promise<TencentCredentials | null> {
  if (!pathName) return null;
  try {
    const st = await stat(pathName);
    const sign = fileSignature(st);
    if (CRED_FILE_META && CRED_FILE_META.path === pathName && CRED_FILE_META.sign === sign) {
      CRED_FILE_STATUS = { path: pathName, state: "ok", mtimeMs: st.mtimeMs };
      return CRED_FILE_META.creds;
    }
    const raw = await readFile(pathName, "utf8");
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const creds: TencentCredentials = {
      secretId: str(obj.SecretId ?? obj.secretId),
      secretKey: str(obj.SecretKey ?? obj.secretKey),
      token: str(obj.Token ?? obj.token ?? obj.SessionToken ?? obj.sessionToken ?? obj.securityToken),
    };
    if (!creds.secretId || !creds.secretKey) {
      CRED_FILE_STATUS = { path: pathName, state: "invalid-content", mtimeMs: st.mtimeMs };
      return null;
    }
    CRED_FILE_META = { path: pathName, sign, creds };
    CRED_FILE_STATUS = { path: pathName, state: "ok", mtimeMs: st.mtimeMs };
    return creds;
  } catch (err) {
    // Classify instead of silently swallowing: fs errors vs JSON errors mean
    // very different fixes (host mount/permissions vs truncated/cafe edits).
    const e = err as NodeJS.ErrnoException;
    if (e && e.code === "ENOENT") {
      CRED_FILE_STATUS = { path: pathName, state: "missing" };
    } else if (e && e.code) {
      CRED_FILE_STATUS = { path: pathName, state: "unreadable", detail: e.code };
    } else {
      CRED_FILE_STATUS = {
        path: pathName,
        state: "invalid-json",
        detail: err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
      };
    }
    return null;
  }
}

export function defaultRegion(): string {
  return process.env.TENCENTCLOUD_REGION || "ap-singapore";
}

export function listServices(): string[] {
  const services = Object.keys(tencentcloud).filter((s) => {
    const svc = tencentcloud[s];
    return svc && typeof svc === "object" && Object.keys(svc).some((k) => k.startsWith("v2") || /^v\d{6,}/.test(k));
  });
  if (COS) services.push("cos");
  return services;
}

export function listVersions(service: string): string[] {
  const svc = tencentcloud[service];
  if (!svc || typeof svc !== "object") return [];
  return Object.keys(svc).filter((k) => /^v\d+$/.test(k));
}

export function resolveService(service: string): ServiceVersion | null {
  return resolveServiceVersion(service, undefined);
}

/**
 * Resolve a (service, optional version) pair to the SDK client module.
 * Without an explicit version the newest installed SDK version is used.
 * Returns null if the service is unknown; throws if a named version is unknown.
 */
export function resolveServiceVersion(service: string, version: string | undefined): ServiceVersion | null {
  if (service === "cos") {
    return { name: "cos", version: "xml-rest", actions: COS_METHODS };
  }
  const svc = tencentcloud[service];
  if (!svc || typeof svc !== "object") return null;
  const versions = Object.keys(svc).filter((k) => /^v\d+$/.test(k));
  if (versions.length === 0) return null;
  let chosen: string;
  if (version !== undefined && version !== "") {
    // Accept '2021-08-20', 'v2021-08-20', '20210820', 'v20210820' alike.
    const wantedKey = version.replace(/^v/i, "").replace(/-/g, "");
    const wanted = versions.find((v) => v.replace(/^v/, "") === wantedKey);
    if (!wanted) {
      throw new Error(
        `Unknown version '${version}' for service '${service}'. Available versions: ${versions.join(", ")}`,
      );
    }
    chosen = wanted;
  } else {
    chosen = versions.sort((a, b) => (b > a ? 1 : -1))[0];
  }
  const mod = svc[chosen];
  const Client = mod?.Client;
  if (!Client) return null;
  const actions = Object.getOwnPropertyNames(Client.prototype).filter(
    (m) => m !== "constructor" && m !== "request" && /^[A-Z]/.test(m),
  );
  return { name: service, version: chosen, actions };
}

export interface CallResult {
  service: string;
  version: string;
  action: string;
  response: unknown;
}

async function resolveCredentialCandidates(): Promise<TencentCredentials[]> {
  const fileCreds = await readCredFile(resolvedCredFile());
  if (!fileCreds || !fileCreds.secretId || !fileCreds.secretKey) return [];
  return [{ ...fileCreds }];
}

export async function callTencentApi(
  service: string,
  action: string,
  params: Record<string, unknown>,
  region?: string,
  profile?: { httpTimeout?: number; version?: string },
): Promise<CallResult> {
  const resolved = resolveService(service);
  if (!resolved) throw new Error(`Unknown service: '${service}'. Use list_tencent_services to discover services.`);

  const versionResolved = profile?.version ? resolveServiceVersion(service, profile.version) : resolved;
  if (!versionResolved)
    throw new Error(`Unknown service: '${service}'. Use list_tencent_services to discover services.`);
  const candidates = await resolveCredentialCandidates();
  if (candidates.length === 0) {
    const why = credentialFileProblem();
    throw new Error(
      "Missing Tencent Cloud credentials. Provide creds/credentials.json at TENCENT_MCP_CRED_FILE (/app/creds/credentials.json) with {secretId, secretKey, token}. Env vars and tccli are disabled." +
        (why ? ` Reason: ${why}.` : ""),
    );
  }

  let lastError: unknown = new Error("no credentials available");
  for (const creds of candidates) {
    if (!creds.secretId || !creds.secretKey) continue;
    try {
      return await performCall(service, action, params, region, profile, versionResolved, creds);
    } catch (err) {
      const msg = String(err instanceof Error ? err.message : err);
      lastError = err;
      if (!looksLikeAuthFailure(msg)) throw err;
      // auth failed for this credential set; try the next candidate
    }
  }
  throw lastError;
}

function looksLikeAuthFailure(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("access key id") ||
    lower.includes("secretid") ||
    lower.includes("authfailure") ||
    lower.includes("authentication") ||
    lower.includes("credential") ||
    lower.includes("signature") ||
    lower.includes("unauthorizedoperation")
  );
}

async function performCall(
  service: string,
  action: string,
  params: Record<string, unknown>,
  region: string | undefined,
  profile: { httpTimeout?: number; version?: string } | undefined,
  resolved: ServiceVersion,
  creds: TencentCredentials,
): Promise<CallResult> {
  if (service === "cos") {
    if (!COS) {
      throw new Error("COS support requires the 'cos-nodejs-sdk-v5' package (npm install cos-nodejs-sdk-v5).");
    }
    if (!COS_METHODS.includes(action)) {
      throw new Error(`Unknown COS action '${action}'. Available actions: ${COS_METHODS.join(", ")}`);
    }
    const cos = new COS({
      SecretId: creds.secretId,
      SecretKey: creds.secretKey,
      SecurityToken: creds.token,
    });
    const cosParams: Record<string, unknown> = { ...(params ?? {}) };
    if (region) cosParams.Region = region;
    else if (!cosParams.Region) cosParams.Region = defaultRegion();
    const response = await cos[action](cosParams);
    return { service, version: "xml-rest", action, response };
  }

  const svcMod: { Client: new (opts: any) => any } = tencentcloud[service][resolved.version];
  const chosenVersion: string = resolved.version;

  const regionValue = region && region.trim() !== "" ? region : defaultRegion();
  const client = new svcMod.Client({
    credential: creds,
    region: regionValue,
    profile: { httpProfile: { reqTimeout: profile?.httpTimeout ?? 60 } },
  });
  if (typeof client[action] !== "function") {
    const available = Object.getOwnPropertyNames(Object.getPrototypeOf(new svcMod.Client({ credential: {} })))
      .filter((m) => m !== "constructor" && m !== "request" && /^[A-Z]/.test(m))
      .join(", ");
    throw new Error(
      `Unknown action '${action}' for service '${service}' (${chosenVersion}). Available actions: ${available}`,
    );
  }
  const response = await client[action](params ?? {});
  return { service, version: chosenVersion, action, response };
}

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

export interface ApprovalRequest {
  id: string;
  operation: string;
  sql: string;
  createdAt: string;
  expiresAt: number;
  execute: () => Promise<unknown>;
}

const TTL_MS = 5 * 60 * 1000;
const requests = new Map<string, ApprovalRequest>();

export function createApproval(operation: string, sql: string, execute: () => Promise<unknown>): ApprovalRequest {
  const now = Date.now();
  const request: ApprovalRequest = {
    id: randomUUID(),
    operation,
    sql,
    createdAt: new Date(now).toISOString(),
    expiresAt: now + TTL_MS,
    execute,
  };
  requests.set(request.id, request);
  return request;
}

export function getApproval(id: string): ApprovalRequest | undefined {
  const request = requests.get(id);
  if (!request) return undefined;
  if (request.expiresAt <= Date.now()) {
    requests.delete(id);
    return undefined;
  }
  return request;
}

export function consumeApproval(id: string): ApprovalRequest | undefined {
  const request = getApproval(id);
  if (request) requests.delete(id);
  return request;
}

export function sqlFingerprint(sql: string): string {
  return createHash("sha256").update(sql).digest("hex");
}

export function isApprovalCredentialsConfigured(): boolean {
  return Boolean(process.env.TENCENT_MCP_APPROVAL_USER && process.env.TENCENT_MCP_APPROVAL_PASSWORD);
}

export function authenticateApproval(authorization: string | undefined): boolean {
  if (!authorization?.startsWith("Basic ")) return false;
  const expectedUser = process.env.TENCENT_MCP_APPROVAL_USER;
  const expectedPassword = process.env.TENCENT_MCP_APPROVAL_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;
  let decoded: string;
  try {
    decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }
  const expected = `${expectedUser}:${expectedPassword}`;
  const actualBytes = Buffer.from(decoded);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

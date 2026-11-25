// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  authenticateApproval,
  consumeApproval,
  createApproval,
  getApproval,
  isApprovalCredentialsConfigured,
  sqlFingerprint,
} from "../src/approval.js";
import { credentialFileProblem, getCredentialFileStatus, resolveCredentials } from "../src/sdk.js";
import { loadMetadata } from "../src/metadata.js";
import { SafetyPolicy } from "../src/policy.js";
import { classifySql } from "../src/sqlguard.js";
import { listKnowledge, promoteKnowledge, saveKnowledge } from "../src/knowledge.js";

function withEnvironment(values: Record<string, string | undefined>, callback: () => Promise<void>): Promise<void> {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  return callback().finally(() => {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

test("classifySql distinguishes safe reads, comments, quoted text, and mutations", () => {
  assert.equal(classifySql("SELECT 'DROP TABLE' AS message").risk, "safe");
  assert.equal(classifySql("-- DROP TABLE\nSELECT 1").risk, "safe");
  assert.equal(classifySql("SHOW CREATE TABLE sales").risk, "safe");
  assert.equal(classifySql("DROP TABLE sales").dangerousKeywords.includes("DROP"), true);
  assert.equal(classifySql("SELECT 1; DELETE FROM sales").risk, "dangerous");
  assert.deepEqual(classifySql(" ").dangerousKeywords, ["EMPTY"]);
});

test("SafetyPolicy enforces readonly, deny, explicit allowlist, and default deny", async () => {
  await withEnvironment(
    {
      TENCENT_MCP_READONLY_PREFIXES: undefined,
      TENCENT_MCP_DENY_PREFIXES: undefined,
      TENCENT_MCP_ALLOW_MUTATIONS: "dlc:CreateTask,wedata:*",
    },
    async () => {
      const policy = new SafetyPolicy();
      assert.equal(policy.decide("cvm", "DescribeInstances").allow, true);
      assert.equal(policy.decide("cos", "DeleteBucket").allow, false);
      assert.equal(policy.decide("dlc", "CreateTasks").allow, true);
      assert.equal(policy.decide("wedata", "Anything").allow, true);
      assert.equal(policy.decide("cvm", "CreateInstance").allow, false);
      assert.equal(policy.decide("cvm", "").allow, false);
    },
  );
});

test("SafetyPolicy baked-in default profile allows DLC SQL only and fails safe without profiles file", async () => {
  await withEnvironment(
    {
      TENCENT_MCP_PROFILE: "default",
      TENCENT_MCP_PROFILES_FILE: "/tmp/non-existent-profiles-file-" + Date.now() + ".json",
      TENCENT_MCP_ALLOW_MUTATIONS: undefined,
      TENCENT_MCP_READONLY_PREFIXES: undefined,
      TENCENT_MCP_DENY_PREFIXES: undefined,
    },
    async () => {
      const policy = new SafetyPolicy();
      assert.equal(policy.profileSource, "built-in");
      // Readonly operations are allowed
      assert.equal(policy.decide("dlc", "DescribeTasks").allow, true);
      assert.equal(policy.decide("cvm", "DescribeInstances").allow, true);

      // DLC SQL execution mutations are allowed
      assert.equal(policy.decide("dlc", "CreateTask").allow, true);
      assert.equal(policy.decide("dlc", "CreateTasks").allow, true);
      assert.equal(policy.decide("dlc", "CreateSparkSessionBatchSQL").allow, true);

      // Other mutations are blocked by default
      assert.equal(policy.decide("wedata", "CreateWorkflow").allow, false);
      assert.equal(policy.decide("cos", "putObject").allow, false);
      assert.equal(policy.decide("cvm", "RunInstances").allow, false);
    },
  );
});

test("approval credentials authenticate and approvals are consumed once", async () => {
  await withEnvironment(
    {
      TENCENT_MCP_APPROVAL_USER: "test-user",
      TENCENT_MCP_APPROVAL_PASSWORD: "test-password",
    },
    async () => {
      assert.equal(isApprovalCredentialsConfigured(), true);
      const auth = `Basic ${Buffer.from("test-user:test-password").toString("base64")}`;
      assert.equal(authenticateApproval(auth), true);
      assert.equal(authenticateApproval("Basic invalid"), false);

      const approval = createApproval("test", "DROP TABLE test", async () => "executed");
      assert.equal(getApproval(approval.id)?.sql, "DROP TABLE test");
      assert.equal(sqlFingerprint("DROP TABLE test").length, 64);
      assert.equal(await consumeApproval(approval.id)?.execute(), "executed");
      assert.equal(getApproval(approval.id), undefined);
    },
  );
});

test("loadMetadata parses fenced JSON and reloads changed files", async () => {
  const root = await mkdtemp(join(tmpdir(), "tencent-mcp-metadata-"));
  const path = join(root, "metadata.md");
  try {
    await writeFile(path, '# Metadata\n\n```json\n{"defaults":{"region":"ap-singapore"}}\n```\n');
    await withEnvironment({ TENCENT_MCP_METADATA_FILE: path }, async () => {
      assert.equal((await loadMetadata()).defaults?.region, "ap-singapore");
      await writeFile(path, '{"defaults":{"region":"ap-tokyo"}}\n');
      assert.equal((await loadMetadata()).defaults?.region, "ap-tokyo");
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("knowledge entries save, list by status, and promote safely", async () => {
  const root = await mkdtemp(join(tmpdir(), "tencent-mcp-knowledge-"));
  try {
    await withEnvironment({ TENCENT_MCP_KNOWLEDGE_DIR: root }, async () => {
      const saved = await saveKnowledge({ title: "Deploy checklist", content: "Verify health first." });
      assert.equal(saved.status, "unrefined");
      assert.equal((await listKnowledge("unrefined")).entries.length, 1);

      const promoted = await promoteKnowledge(saved.name);
      assert.equal(promoted.status, "refined");
      assert.equal((await listKnowledge("unrefined")).entries.length, 0);
      assert.equal((await listKnowledge("refined")).entries[0]?.name, saved.name);
      assert.match(await readFile(promoted.path, "utf8"), /> status: refined/);
      await assert.rejects(() => promoteKnowledge("../secrets"), /no paths/);
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("credential file status classifies missing, unreadable, invalid JSON, and invalid content", async () => {
  const root = await mkdtemp(join(tmpdir(), "tencent-mcp-creds-"));
  try {
    // Valid file → ok, no problem.
    const validPath = join(root, "credentials.json");
    await writeFile(validPath, '{"secretId":"AKID-test","secretKey":"k"}');
    await withEnvironment({ TENCENT_MCP_CRED_FILE: validPath }, async () => {
      assert.equal((await resolveCredentials()).secretId, "AKID-test");
      assert.equal(getCredentialFileStatus()?.state, "ok");
      assert.equal(credentialFileProblem(), null);

      // Content change (new secretKey) is picked up even within the same mtimeMs.
      await writeFile(validPath, '{"secretId":"AKID-test","secretKey":"k2"}');
      assert.equal((await resolveCredentials()).secretKey, "k2");

      // Missing file → classified, resolveCredentials returns empty object.
      const missingPath = join(root, "absent.json");
      await withEnvironment({ TENCENT_MCP_CRED_FILE: missingPath }, async () => {
        assert.deepEqual(await resolveCredentials(), {});
        assert.equal(getCredentialFileStatus()?.state, "missing");
        assert.match(credentialFileProblem() ?? "", /does not exist/);
      });

      // Unreadable file (EACCES) → classified, not "missing".
      const unreadablePath = join(root, "unreadable.json");
      await writeFile(unreadablePath, '{"secretId":"AKID","secretKey":"k"}');
      await chmod(unreadablePath, 0o000);
      try {
        await withEnvironment({ TENCENT_MCP_CRED_FILE: unreadablePath }, async () => {
          assert.deepEqual(await resolveCredentials(), {});
          assert.equal(getCredentialFileStatus()?.state, "unreadable");
          assert.match(credentialFileProblem() ?? "", /not readable by the server process/);
        });
      } finally {
        await chmod(unreadablePath, 0o600);
      }

      // Invalid JSON → classified with detail.
      const badJsonPath = join(root, "bad.json");
      await writeFile(badJsonPath, "{not json");
      await withEnvironment({ TENCENT_MCP_CRED_FILE: badJsonPath }, async () => {
        assert.deepEqual(await resolveCredentials(), {});
        assert.equal(getCredentialFileStatus()?.state, "invalid-json");
        assert.match(credentialFileProblem() ?? "", /not valid JSON/);
      });

      // Valid JSON but no secretId/secretKey → invalid-content.
      const noKeysPath = join(root, "nokeys.json");
      await writeFile(noKeysPath, '{"token":"t"}');
      await withEnvironment({ TENCENT_MCP_CRED_FILE: noKeysPath }, async () => {
        assert.deepEqual(await resolveCredentials(), {});
        assert.equal(getCredentialFileStatus()?.state, "invalid-content");
        assert.match(credentialFileProblem() ?? "", /lacks valid "secretId"/);
      });

      // Back to valid → status clears.
      assert.equal((await resolveCredentials()).secretId, "AKID-test");
      assert.equal(credentialFileProblem(), null);
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

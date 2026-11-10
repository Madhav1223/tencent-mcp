# Policy & Permissions — what is in scope vs. what you must override manually

Safety is **deny-by-default** (`src/policy.ts` → `SafetyPolicy.decide()`). Every `call_tencent_api` is classified before it reaches Tencent Cloud. **IAM/CAM on the Tencent side still applies** — the policy below is an extra guardrail, not a replacement for least-privilege CAM.

## Decision order

1. **Readonly prefix match** → `allow: true (readonly)`.
2. **Dangerous prefix match** → `blocked`.
3. **Exact `service:Action` in allowlist** → `allow: true (mutation)`.
4. **Otherwise** → `blocked` (`deny-by-default`).

Inspect live config: tool `get_audit_policy` or `policy.configSummary()`.

## 1. Already in scope (no override needed)

### A. Readonly actions — ALWAYS allowed

Any action whose name **starts with** (case-insensitive) one of:

```
Describe, Get, List, Head, Query, InquiryPrice, Check, Preview, Count, Search, Statistic, Export, Download, multipartList, selectObjectContent
```

Examples that work out-of-the-box: `cvm:DescribeInstances`, `cos:getBucket`, `cls:GetLog`, `tke:ListClusters`, `cam:GetRole`, `sts:GetCallerIdentity`, `wedata:ListProjects`, `dlc:DescribeDataEngines`. Also covers `cos:putBucketACL`? No — `put` is not a readonly prefix, so blocked.

Override key: `TENCENT_MCP_READONLY_PREFIXES` (CSV). Only add prefixes you truly need.

### B. Allowlisted mutations — ALREADY allowed

These non-readonly mutations are pre-approved because they are needed for DLC/WeData/EMR/TKE normal operation:

```
dlc:StartRayCluster
dlc:StartLab
dlc:SwitchDataEngine
dlc:CreateTask
dlc:CreateTasks
dlc:CreateSparkSessionBatchSQL
wedata:CreateTriggerWorkflowRun
emr:StartJobs
emr:StartSparkSubmitTask
emr:RunJobFlow
tke:StartKubeedgeGateway
tke:StartService
```

Plus the compose default extends this with WeData authoring (harmless without IAM):

```
wedata:CreateWorkflow, wedata:CreateWorkflowFolder, wedata:CreateTask, wedata:CreateTriggerTask,
wedata:UpdateTriggerTask, wedata:CreateTriggerWorkflow, wedata:CreateCodeFile, wedata:CreateCodeFolder,
wedata:CreateTaskFolder
```

Compose sets `TENCENT_MCP_ALLOW_MUTATIONS` to the union above. If you use `docker run` without compose, only the 12 defaults are active.

### C. SQL guard (DLC)

`run_dlc_sql` / `dlc:CreateTasks` with SQL: auto-allowed if `classifySql` says `safe` (`SELECT/SHOW/DESCRIBE/DESC/EXPLAIN/USE/LIST/WITH`). `INSERT/UPDATE/DELETE/TRUNCATE/DROP/ALTER/CREATE/...` requires human Basic-Auth at `/approvals/:id` (`TENCENT_MCP_APPROVAL_USER/PASSWORD`, 5-min TTL). No override can bypass this — set approval creds.

## 2. Blocked by default — MUST override manually if you want it

### D. Dangerous prefixes — ALWAYS blocked unless explicitly allowlisted

Any action starting with:

```
Delete, Destroy, Terminate, Drop, Remove, Release, Reset, Purge, Stop, Kill, Cancel, Modify, Renew, Recover, Restart
```

Examples: `cvm:TerminateInstances`, `cos:deleteBucket`, `tke:DeleteCluster`, `cbs:DeleteDisks`. **Adding a prefix is not supported — you must allowlist each exact `service:Action`.** Wildcard `service:*` is allowed but discouraged.

### E. Other mutations (not readonly, not allowlisted)

E.g., `cos:putBucket`, `cos:putObject`, `cvm:RunInstances`, `vpc:CreateVpc`, `cam:CreateRole`. All blocked with hint: `Add 'service:Action' to TENCENT_MCP_ALLOW_MUTATIONS if intended.`

## How to configure

Policy is driven by **`config/mutation-profiles.json`** — a plain JSON file bind-mounted into the container. No code change is ever needed to adjust permissions.

### Step 1 — Edit `config/mutation-profiles.json`

Each top-level key is a profile name. Add your own profile anywhere in the file:

```jsonc
{
  "my-team": {
    "label": "My team — WeData authoring + COS writes",
    "allowedMutations": [
      "wedata:CreateWorkflow",
      "wedata:CreateTask",
      "cos:putObject",
      "cos:deleteObject"
    ]
    // readonlyPrefixes and denyPrefixes inherit from _defaults when omitted
  }
}
```

Built-in profiles (shipped in the file, modify freely):

| Profile | What it allows |
|---|---|
| `default` | DLC SQL execution only (`CreateTask`, `CreateSparkSessionBatchSQL`, ...). Safe baseline. |
| `readonly` | Zero mutations. Safest — CI, reporting, audit-only. |

### Step 2 — Set the active profile

In `.env` or `docker-compose.yml`:

```bash
TENCENT_MCP_PROFILE=my-team
```

### Step 3 — Restart the container

```bash
docker compose up -d --force-recreate
```

> **Why restart?** Policy is baked at startup for auditability — a process boundary makes it clear exactly when a permission change took effect.

The active profile, label, and all resolved lists are shown in startup logs and via the `get_audit_policy` tool.

### Quick one-off (no JSON edit)

For a single extra action without touching the file, use env-var overrides on top of the active profile:

```bash
# in .env — wins over whatever the profile says
TENCENT_MCP_ALLOW_MUTATIONS=cos:putObject,cos:deleteObject
TENCENT_MCP_DENY_PREFIXES=Delete,Destroy,Terminate
TENCENT_MCP_READONLY_PREFIXES=Describe,Get,List,Query
```

Then restart. The profile hint in deny-by-default error messages tells you exactly which JSON key to edit if you want to make it permanent.

## Permissions you must still grant in CAM

The MCP policy does NOT grant Tencent permissions. Your `secretId`'s CAM role must have the actual API permissions (e.g., `QcloudCOSDataWrite`, `QcloudCVMReadOnlyAccess`). If CAM denies, the call fails with `AuthFailure/UnauthorizedOperation` after passing the MCP guard. Audit records show `outcome: error` vs `blocked` (policy).

## Audit

Every call → `auditCall` with `allowed`, `readonly`, `reason`, `outcome: success|error|blocked`, params redacted. Sinks: Loki (`http://loki:3100`), optional ES/Logstash, `TENCENT_MCP_AUDIT_FILE`.

## Workflow extras

- `run_wedata_workflow` needs `wedata:CreateTriggerWorkflowRun` (pre-allowlisted) + reads `wedata:List*`/`GetTaskInstanceLog` (readonly).
- `run_dlc_sql` needs DLC read + `dlc:CreateTasks` + `dlc:DescribeDataEngines`/`DescribeTasks`/`QueryResult`.

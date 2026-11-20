---
name: tencent-dlc
description: Runs analytics on Tencent Cloud Data Lake Compute (DLC) — SQL over data lakes, data engines, Spark sessions, DMS tables, and task management. Prefer the run_dlc_sql helper for queries; use raw DLC actions for engine/table administration. Triggers on mentions of DLC, data lake, data engine, Spark SQL, Presto, DMS table, engine suspension, or analytics query. SELECT/SHOW via run_dlc_sql pass automatically; mutating SQL needs human approval; engine mutations are gated.
metadata:
  version: "1"
---

# Tencent Cloud DLC

Serverless data lake analytics: SQL execution, data engines, Spark sessions, and metastore tables. API version `v20210125`.

**Works best with** the Tencent MCP server — `run_dlc_sql` for queries, `call_tencent_api` with `service: "dlc"` for administration. Defaults come from `get_metadata_context` (`dlc.data_engine_name`, `dlc.database`, `dlc.catalog`).

## Procedures

| User need | Do this |
|---|---|
| Run an analytics query | `run_dlc_sql` with `{"sql": "SELECT ...", "data_engine_name": "...", "database": "..."}` — safe `SELECT`/`SHOW`/`DESCRIBE` execute immediately |
| Find the right engine | `DescribeDataEngines` (or `DescribeUpdatableDataEngines`), pick the `Running` engine matching the workload |
| Explore tables first | `run_dlc_sql` with `SHOW TABLES` / `DESCRIBE <table>` — cheaper than guessing schema |
| Engine cost control | `SuspendResumeDataEngine` to suspend idle engines; `DescribeEngineUsageInfo` to see spend — **engine start/stop/suspend are gated** |
| Submit a batch Spark job | `CreateSparkApp` then `CreateSparkAppTask`, or `CreateTasks` with a `SparkSQLTask` — **`dlc:CreateTasks` is pre-allowlisted** |
| Interactive Spark session SQL | `CreateSparkSessionBatchSQL` — **pre-allowlisted** |
| Ray workloads | `CreateRayCluster` / `StartRayCluster` / `StopRayCluster` — **start actions pre-allowlisted, stop gated** |
| Metastore admin | `CreateDMSTable` / `DescribeDMSTables` / `DropDMSTable` — **`Drop*` is denied outright** |

## Safety

- **Auto-allowed:** `run_dlc_sql` with safe read-only SQL; `Describe*`, `Get*`, `List*`, `Query*`, `Check*` actions.
- **Human approval required:** `run_dlc_sql` with `INSERT/UPDATE/DELETE/DROP/ALTER/CREATE/...` — returns `human_approval_required` with an `approval_url`; a human approves via `POST /approvals/:id {"approve":true}` (Basic auth). `SHOW CREATE TABLE` is display-only and stays auto-allowed.
- **Gated:** engine lifecycle (`SuspendResumeDataEngine`, `RestartDataEngine`, `UpdateDataEngine`), `Delete*`, `Drop*`, `Terminate*`.
- DLC bills per scan — always `LIMIT` exploratory queries and check `DescribeTaskResult` byte-scanned before scaling up.

## Mistakes to avoid

- **Wrong engine type for the SQL dialect:** `SparkSQLTask` for Spark engines, `SQLTask` for Presto/Trino engines — mismatching fails at submit time.
- Database/catalog must exist in the engine's region — `DescribeDatabases` first when unsure; the default `DataLakeCatalog` is not universal.
- Long queries exceed the default timeout — pass `timeout_ms` explicitly (up to the helper's max) instead of retrying blindly.
- `CancelTask`/`CancelTasks` carry the `Cancel*` deny prefix and are blocked — let queries finish or get an allowlist entry.

## Verify

- `run_dlc_sql` returns rows + a task ID — re-query `DescribeTaskResult` for byte-scanned/cost on expensive queries.
- After engine changes, `DescribeDataEngine` must show the target state (`Running`/`Suspended`) before submitting work.

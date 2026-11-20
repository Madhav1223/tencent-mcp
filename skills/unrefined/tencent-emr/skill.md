---
name: tencent-emr
description: Manages Tencent Cloud Elastic MapReduce (EMR) — Hadoop/Spark/Trino clusters, job flows, auto-scaling, and cluster cost control. Use for big-data cluster lifecycle, job submission, and autoscaling policy. Triggers on mentions of EMR, Hadoop, Spark cluster, Trino, Impala, Hive, job flow, auto-scaling, or data warehouse compute. Describe/InquiryPrice pass automatically; job submission actions are pre-allowlisted; cluster termination and scaling mutations are gated or denied.
metadata:
  version: "1"
---

# Tencent Cloud EMR

Managed big-data clusters: Hadoop, Spark, Trino, Hive, HBase, StarRocks. API version `v20190103`.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "emr"`. Clusters are region- and zone-scoped; pin both.

## Procedures

| User need | Do this |
|---|---|
| Inventory clusters | `DescribeInstances` with `{"Limit": 20}` (+ `Filters` on cluster ID, status, or name) |
| Cluster health + metrics | `DescribeClusterNodes` + `DescribeEmrOverviewMetrics` + `DescribeServiceNodeInfos` |
| Submit a job | `RunJobFlow` with the job definition — **pre-allowlisted** |
| Spark submit task | `StartSparkSubmitTask` — **pre-allowlisted** |
| Start queued jobs | `StartJobs` — **pre-allowlisted** |
| Price a change first | `InquiryPriceCreateInstance` / `InquiryPriceScaleOutInstance` / `InquiryPriceRenewInstance` before any capacity call |
| Autoscaling policy | `DescribeAutoScaleStrategies` → `ModifyAutoScaleStrategy` / `AddMetricScaleStrategy` — **modification gated** |
| Inspect past queries | `DescribeSparkQueries` / `DescribeHiveQueries` / `DescribeTrinoQueryInfo` / `DescribeImpalaQueries` |
| YARN queue tuning | `DescribeYarnQueue` → `ModifyYarnQueueV2` / `ModifyResourcePools` — **gated** |
| User/group admin on the cluster | `DescribeUsersForUserManager` → `AddUsersForUserManager` / `ModifyUserGroup` — **gated** |

## Safety

- **Auto-allowed:** `Describe*`, `InquiryPrice*` / `InquirePrice*`, `SyncPodState`-style status reads.
- **Pre-allowlisted:** `emr:StartJobs`, `emr:StartSparkSubmitTask`, `emr:RunJobFlow`.
- **Denied outright:** `TerminateInstance`, `TerminateTasks`, `TerminateClusterNodes`, `TerminateDynamicInstances`, `TerminateSLInstance` (`Terminate*` prefix) — cluster teardown is console-only unless the policy is explicitly changed.
- **Gated:** `CreateInstance`, `CreateCluster`, `ScaleOutCluster`, `ScaleOutInstance`, `ResizeDataDisks`, `Modify*`, `DeployYarnConf`, `ResetYarnConfig`.
- EMR bills for master + core + task nodes hourly — always price with `InquiryPrice*` and confirm before scaling out.

## Mistakes to avoid

- **`DescribeInstances` here means EMR clusters**, not CVM VMs — don't confuse it with `cvm:DescribeInstances` when correlating underlying hosts (use `DescribeClusterNodes` for the mapping).
- Pay-as-you-go vs prepaid (`ConvertPreToPostCluster` exists but is gated) changes which price API applies.
- `RunJobFlow` is async — poll `DescribeJobFlow` / `DescribeYarnApplications` for completion; exit code is in the application detail, not the submit response.
- On-demand vs spot/task nodes have different scale-down behavior — check `DescribeAutoScaleRecords` before assuming capacity freed.

## Verify

- After job submit, `DescribeYarnApplications` must show the application reaching a terminal state (`SUCCEEDED`/`FAILED`); read logs via the returned log paths on failure.
- After scaling or config changes, `DescribeClusterNodes` + `DescribeServiceNodeInfos` confirm the new topology before submitting production jobs.

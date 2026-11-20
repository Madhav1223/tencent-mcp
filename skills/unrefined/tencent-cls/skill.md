---
name: tencent-cls
description: Works with Tencent Cloud Log Service (CLS) — logsets, topics, indexes, SearchLog queries, dashboards, alarms, shippers (COS/ES/Kafka), and scheduled SQL. Use for log search, alerting setup, log pipeline wiring, or dashboard building. Triggers on mentions of CLS, logs, SearchLog, logset, topic, index, alarm, shipper, scheduled SQL, dashboard, or log pipeline. Search/Describe/Get/Query pass automatically; topic/logset/config deletions and shippers are gated.
metadata:
  version: "1"
---

# Tencent Cloud CLS

Log Service: ingestion, indexed search, alarms, shippers, scheduled SQL, and dashboards. API version `v20201016`.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "cls"`. Log queries need `TopicId`, a time range (`From`/`To` in ms), and a Lucene `Query`.

## Procedures

| User need | Do this |
|---|---|
| Find where logs live | `DescribeLogsets` → `DescribeTopics` with `{"LogsetId": "..."}` |
| Search logs | `SearchLog` with `{"TopicId": "...", "From": <ms>, "To": <ms>, "QueryString": "...", "Limit": 100, "Sort": "desc"}` — `From`/`To` (epoch **ms**, `[From, To)`) are the only required fields; exactly one of `TopicId` / `Topics` (up to 50 topics). `QueryString` defaults to CQL syntax (`QuerySyntax: 1`); the old `Query` field is **deprecated** |
| Check a query is valid before a big scan | `DescribeLogHistogram` with the same `Query` — returns hit distribution without full results |
| Read surrounding context of a hit | `DescribeLogContext` with `TopicId`, `PkgId`, `PkgLogId` |
| Range metrics over logs | `QueryRangeMetric` / `QueryMetric` for topic-level counters |
| Create the storage first | `CreateLogset`, then `CreateTopic` with `Period` (retention days) — **gated** |
| Make logs searchable | `CreateIndex` with full-text or key-value rules — **gated**; check status with `DescribeIndex` |
| Alert on log patterns | `CreateAlarm` / `CreateAlarmNotice`, history via `DescribeAlertRecordHistory` — **creation gated** |
| Ship logs onward (COS / ES / Kafka / Splunk) | `CreateShipper`, `CreateCosRecharge`, `CreateEsRecharge`, `CreateKafkaRecharge` — **gated**; preview with `DescribeSplunkPreview` / `SearchCosRechargeInfo` |
| Recurring analytics | `CreateScheduledSql` with source topic + destination — **gated**; status via `DescribeScheduledSqlInfo` |
| Transform in flight | `CreateDataTransform` — **gated** |

## Safety

- **Auto-allowed:** `SearchLog`, `Describe*`, `Get*`, `Query*`, `Check*`, `Preview*`, `UploadLog` is **not** readonly by prefix — ingestion via `UploadLog` is gated; use the CLS agent/daemon for high-volume ingestion instead.
- **Gated:** `Create*`, `Modify*`, `Delete*` (topics, logsets, indexes, alarms, shippers, dashboards, notices).
- `DeleteTopic` / `DeleteLogset` / `DeleteIndex` destroy retained logs permanently — these carry `Delete*` deny prefixes and are blocked; console + explicit approval only.

## Mistakes to avoid

- **`From`/`To` are epoch milliseconds**, not seconds — passing seconds returns an empty range in 1970.
- `QueryString` runs CQL by default (`QuerySyntax: 1`); Lucene is `0`. Either way it only matches indexed fields — verify the topic has an index (`DescribeIndex`) before concluding "no logs".
- `SearchLog` paginates with the `Context` token (up to 10k rows, 1-hour expiry — don't modify other params when passing it back), not page numbers. `Limit` max is 1000; per-topic concurrency is capped at 15 and responses at 49MB — narrow the time range instead of hammering retries.
- Topic retention `Period` is set at `CreateTopic` and capped per region/billing mode — check `ModifyTopic` limits before promising longer retention.

## Verify

- After creating index/config, `DescribeIndex` / `DescribeConfigs` must show the new state before searching.
- After alarm creation, `DescribeAlarms` confirms it is enabled; test-fire with a histogram query that matches the trigger condition.

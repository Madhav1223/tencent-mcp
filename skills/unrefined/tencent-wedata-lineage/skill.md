---
name: tencent-wedata-lineage
description: Traces WeData data lineage and catalog — column/table/process lineage, table metadata, databases, schemas, and data source connections. Use for impact analysis ("what breaks if this table changes"), root-cause tracing ("where did this column come from"), catalog exploration, or wiring new sources. Triggers on mentions of lineage, bloodline, impact analysis, catalog, table metadata, schema, columns, or data source. All lineage/catalog actions are reads and pass automatically; source creation and lineage registration are gated.
metadata:
  version: "1"
---

# WeData Lineage, Catalog & Data Sources

Answer "where did this come from" and "what breaks if I change it". Read-only core; writes gated.

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "wedata"`. `ProjectId` required throughout.

## Procedures

| User need | Do this |
|---|---|
| Column-level tracing | `ListColumnLineage` with `TableUniqueId` + `ColumnName` + `Direction` (`INPUT` upstream / `OUTPUT` downstream) + `Platform` (`WEDATA` default, `THIRD` for external) + `PageNumber`/`PageSize` |
| Table/process graph | `ListLineage` (table relations) and `ListProcessLineage` (job-level edges); register new edges with `RegisterLineage` (`Relations` list) — **registration gated** |
| Table metadata | `GetTable` / `GetTableColumns` / `ListTable`; databases via `ListDatabase`, schemas via `ListSchema`, full catalog scan via `ListCatalog` |
| Which tasks touch a source | `GetDataSourceRelatedTasks` — bridges lineage and operations |
| Permissions on a source | `DescribeDataSourceAuthority`, `ListPermissions`, `GetMyWorkflowMaxPermission` / `GetMyCodeMaxPermission` before assuming access |
| Add a new source | `CreateDataSource` with `ProjectId` + `Name` + `Type` (enum: `MYSQL`, `TENCENT_MYSQL`, `POSTGRE`, `ORACLE`, `SQLSERVER`, `FTP`, `HIVE`, `HUDI`, `HDFS`, `ICEBERG`, …) + `ProdConProperties` (JSON KV connection config; `DevConProperties` **required** for standard-mode projects) — **gated**; then `AuthorizeDataSource` |
| Bind compute to a project | `AssociateResourceGroupToProject` / `AddCalcEnginesToProject`; inspect with `ListResourceGroups` / `GetResourceGroupMetrics` — **gated** |

## Mistakes to avoid

- `TableUniqueId` is the catalog's internal ID, not `db.table` — resolve it via `ListTable`/`GetTable` first; guessing the format returns nothing.
- `Direction` is relative to the queried column: `INPUT` walks upstream (sources), `OUTPUT` walks downstream (consumers) — inverted from some other lineage tools.
- `THIRD`-platform lineage only exists if registered (`RegisterLineage`) — empty results mean "not registered", not "no dependencies".
- `CreateDataSource` `Type` enum is exact and uppercase (`TENCENT_MYSQL`, not `MySQL`) — and each type expects different `ProdConProperties` keys; check `DescribeDataSourceAuthority` output shape for the type first.

## Verify

- After registering lineage, re-query the same `TableUniqueId` + `Direction` — the new edge must appear.
- After source creation, `GetDataSource` + `DescribeDataSourceAuthority` confirm connectivity and permissions before any task references it.

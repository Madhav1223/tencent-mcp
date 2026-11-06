# Tencent MCP metadata

Edit the JSON below with stable context for your account. Keep credentials out of this file.
The container reloads it automatically when the file changes.

```json
{
  "defaults": {
    "region": "ap-singapore"
  },
  "wedata": {
    "project_id": "",
    "project_name": "",
    "workflow_id": "",
    "workflow_name": "",
    "region": ""
  },
  "dlc": {
    "data_engine_name": "",
    "data_engine_id": "",
    "database": "",
    "catalog": "DataLakeCatalog",
    "resource_group_name": "",
    "region": ""
  },
  "account": {
    "team": "",
    "environment": "",
    "notes": ""
  }
}
```

Tool arguments always take precedence over this file. The `account` section is
available as context for MCP clients but is not sent to Tencent Cloud APIs.

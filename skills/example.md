# example — cost optimization

Use this skill when the user asks about Tencent Cloud cost, tagging, or savings.

Steps:
1. Call `get_metadata_context` to confirm default region.
2. Use `call_tencent_api` with `tag:DescribeTags` and `cvm:DescribeInstances` to inventory untagged resources.
3. Summarize top 5 expensive services from Grafana Report dashboard (`http://localhost:5000/d/tencent-mcp-report`) before recommending savings.

Notes: read-only by default — no `Delete*` without `TENCENT_MCP_ALLOW_MUTATIONS`.

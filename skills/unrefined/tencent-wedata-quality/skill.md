---
name: tencent-wedata-quality
description: Manages WeData data-quality monitoring — rule templates, rules, rule groups (monitoring tasks), and execution results. Use when adding data validation to tables, investigating quality failures, or tuning check schedules. Triggers on mentions of data quality, quality rule, rule group, monitoring task, validation, or quality failure. Reads pass automatically; all Create/Update/Modify/Delete quality mutations are gated.
metadata:
  version: "1"
---

# WeData Data Quality

Checks that run against tables on schedule and alert when data looks wrong. Three layers: **template** (reusable check definition) → **rule** (template bound to a table/field) → **rule group** (the scheduled monitoring task).

**Works best with** the Tencent MCP server — `call_tencent_api` with `service: "wedata"`. Every call needs `ProjectId`.

## Procedures

| User need | Do this |
|---|---|
| See available check types | `ListQualityRuleTemplates` — pick the template before writing a rule |
| Inspect existing coverage | `ListQualityRules` (paginated table rules) and `ListQualityRuleGroupsTable` (group view) |
| Add a check, single table | `CreateQualityRule` with `ProjectId` + `CreateRuleScene` (`1` single-table multi-rule, `2` multi-table, `3` clone) + `RuleBOList` (one entry per check) — **gated** |
| Schedule the checks | `CreateQualityRuleGroup` with `ProjectId` + `RuleGroupExecStrategyBOList` (schedule/strategy params) — **gated**; this is the "monitoring task" the docs mention |
| Tune an existing check | `ModifyQualityRule` / `ModifyQualityRuleGroup` — **gated** |
| Did the checks pass? | `ListQualityRuleGroupExecResultsByPage` — execution results per group |
| Remove coverage | `DeleteQualityRule` / `DeleteQualityRuleGroup` — **gated** (deny-prefixed, blocked by default) |

## Mistakes to avoid

- `CreateRuleScene` decides the shape of `RuleBOList` — scene `1` with multi-table entries (or vice versa) fails validation. Match the scene to the payload.
- A rule without a group never executes — creating the rule is only half the job; the group owns the schedule.
- `RuleBOList` entries reference tables/fields by exact names — verify against `GetTableColumns` (`tencent-WEDATA-LINEAGE`) before creating, or checks bind to nothing.
- Quality failures surface as alarms — correlate with `ListAlarmMessages` in `tencent-WEDATA-OPERATIONS` rather than treating them as pipeline bugs.

## Verify

- After creation, `ListQualityRules` must show the rule and its group binding before the next schedule fires.
- After a schedule change, `ListQualityRuleGroupExecResultsByPage` on the following run confirms the new cadence took effect.

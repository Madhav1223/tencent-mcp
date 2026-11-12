// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tencent MCP Contributors

export type SqlRisk = "safe" | "dangerous";

export interface SqlClassification {
  risk: SqlRisk;
  statements: string[];
  dangerousKeywords: string[];
}

const SAFE_LEADING_KEYWORDS = new Set([
  "SELECT",
  "SHOW",
  "DESC",
  "DESCRIBE",
  "EXPLAIN",
  "USE",
  "WITH",
  "LIST",
  "VALUES",
]);

// Statements with these leaders are display-only metadata reads: they never
// mutate data even when they mention DDL words (e.g. SHOW CREATE TABLE,
// DESCRIBE tbl, EXPLAIN <anything>). Only SELECT/WITH need the embedded
// dangerous-keyword scan (WITH can precede DML in some dialects).
const DISPLAY_ONLY_LEADING_KEYWORDS = new Set(["SHOW", "DESC", "DESCRIBE", "EXPLAIN", "USE", "LIST", "VALUES"]);

const DANGEROUS_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "DROP",
  "ALTER",
  "CREATE",
  "REPLACE",
  "MERGE",
  "GRANT",
  "REVOKE",
  "VACUUM",
  "OPTIMIZE",
  "MSCK",
  "REPAIR",
  "REFRESH",
  "ANALYZE",
  "LOAD",
  "EXPORT",
  "IMPORT",
  "CALL",
  "CACHE",
  "CLEAR",
  "RECOVER",
  "UPSERT",
];

function stripCommentsAndQuoted(sql: string): string {
  const out: string[] = [];
  let i = 0;
  let inBlock = false;
  const n = sql.length;
  while (i < n) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        i += 2;
      } else {
        out.push(" ");
        i += 1;
      }
      continue;
    }
    if (ch === "-" && next === "-") {
      while (i < n && sql[i] !== "\n") {
        out.push(" ");
        i += 1;
      }
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlock = true;
      out.push(" ");
      i += 2;
      continue;
    }
    if (ch === "#") {
      while (i < n && sql[i] !== "\n") {
        out.push(" ");
        i += 1;
      }
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      const quote = ch;
      out.push(" ");
      i += 1;
      while (i < n) {
        if (sql[i] === "\\") {
          i += 2;
          continue;
        }
        if (sql[i] === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      out.push(" ");
      continue;
    }
    out.push(ch);
    i += 1;
  }
  return out.join("");
}

function tokenize(sql: string): string[] {
  return stripCommentsAndQuoted(sql)
    .split(/[^a-zA-Z0-9_]+/)
    .filter(Boolean)
    .map((t) => t.toUpperCase());
}

function splitStatements(sql: string): string[] {
  const cleaned = stripCommentsAndQuoted(sql);
  return cleaned
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function classifySql(sql: string): SqlClassification {
  const statements = splitStatements(sql);
  const dangerousKeywords: string[] = [];

  if (statements.length === 0) {
    return { risk: "dangerous", statements, dangerousKeywords: ["EMPTY"] };
  }

  for (const stmt of statements) {
    const tokens = tokenize(stmt);
    if (tokens.length === 0) continue;
    const leading = tokens[0];
    // Display-only statements (SHOW CREATE TABLE, DESCRIBE, EXPLAIN, ...)
    // never mutate: do not treat embedded DDL words as dangerous.
    if (DISPLAY_ONLY_LEADING_KEYWORDS.has(leading)) continue;
    const hits = tokens.filter((t) => DANGEROUS_KEYWORDS.includes(t));
    for (const h of hits) {
      if (!dangerousKeywords.includes(h)) dangerousKeywords.push(h);
    }
    if (!SAFE_LEADING_KEYWORDS.has(leading) && !dangerousKeywords.includes(leading)) {
      dangerousKeywords.push(leading);
    }
  }

  const isSafe = statements.every((stmt) => {
    const tokens = tokenize(stmt);
    if (tokens.length === 0) return true;
    const leading = tokens[0];
    if (!SAFE_LEADING_KEYWORDS.has(leading)) return false;
    // Display-only leaders are always safe (see above).
    if (DISPLAY_ONLY_LEADING_KEYWORDS.has(leading)) return true;
    // SELECT/WITH can embed DML: reject if any dangerous keyword shows up anywhere.
    if (tokens.some((t) => DANGEROUS_KEYWORDS.includes(t))) return false;
    return true;
  });

  return {
    risk: isSafe ? "safe" : "dangerous",
    statements,
    dangerousKeywords,
  };
}

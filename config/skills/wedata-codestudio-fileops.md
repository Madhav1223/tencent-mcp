---
name: wedata-codestudio-fileops
description: Download, read, and upload WeData Code Studio files (notebooks, SQL) via the open API. Use when fetching Studio file content, walking Studio folders, or round-tripping files. Triggers on mentions of CodeStudio file download/upload, GetCodeFile empty content, Studio notebook fetch, or IncludeContent.
---

# WeData Code Studio File Ops — Download / Upload / Read Notebook

Validated 2026-10-09 on prod (`3201386567817011200`, `ap-singapore`): downloaded
`/Users/mpparajuli.yco_cpaxtra.co.th/3p_order/t3_makro_merge_t2_order_line_table_t1.ipynb`
(72,803 chars) + sibling `.sql` (27,605 chars) via MCP `call_tencent_api`.

## Algorithm: download a Studio folder

1. OPEN session -> sid (Streamable HTTP `initialize` handshake; send `Mcp-Session-Id` on every call).
2. LIST root: `ListCodeFolderContents(ProjectId, ParentFolderPath = "/")`.
3. FOR each entry:
   - `IsLeaf = false` -> folder: GOTO 4
   - else -> file: GOTO 5
4. DESCEND: `child_path = parent_path + "/" + Title` (**leading slash REQUIRED**), REPEAT step 2 with `ParentFolderPath = child_path`.
5. DOWNLOAD file: `GetCodeFile(ProjectId, CodeFileId, IncludeContent = true)`.
   **WITHOUT `IncludeContent`, `CodeFileContent` is EMPTY** — this is the #1 gotcha.
6. SAVE bytes to disk preserving relative paths; record manifest `(relpath, size)`.

## Algorithm: upload a file to Studio

1. CREATE folder (skip if exists): `CreateCodeFolder(ProjectId, ParentFolderPath, FolderName)` -> `FolderId`.
2. UPLOAD: `CreateCodeFile(ProjectId, ParentFolderPath, CodeFileName, CodeFileContent)`.
3. VERIFY: `GetCodeFile(ProjectId, CodeFileId, IncludeContent = true)`;
   ASSERT `len(returned_content) == len(local_file)`.

## Checklist (per job)

- Confirm ProjectId + region (e.g. `3201386567817011200`, `ap-singapore`).
- List `/` to confirm connectivity.
- Walk target subtree only (note: UI `/Workspace` prefix is NOT an API path — API root is `/`, e.g. `/Users/<name>/...`).
- Download each file with `IncludeContent=true`.
- Save locally preserving relative paths; record manifest (path, chars).
- For upload: create folder, upload file, round-trip length check.
- Spot-check 1 file content head/tail.

## Gotchas

- Paths without leading slash fail: "parent folder path is invalid".
- `GetCodeFile` without `IncludeContent` returns metadata with `CodeFileContent: ""` — always pass `IncludeContent=true`.
- Empty notebook skeleton = ~192 chars (1 empty cell) — not an error.
- `.ipynb` content is JSON — parse to count cells, don't eyeball.
- Verified empty-content is server-side, not transport stripping: direct Tencent SDK
  (`wedata v20250806 GetCodeFile`) returns the same `""` without the flag.
- Notebook cells are NOT available via `GetTriggerTaskCode` ("task type does not
  support code viewing" for Type-132) nor task `CodeContent` (null for 132);
  `.ipynb` source lives on CFS behind the kernel gateway — `GetCodeFile` +
  `IncludeContent=true` is the only open-API read path.
- If MCP Streamable HTTP returns `Server not initialized`, re-run the
  `initialize` handshake (see `GET /mcp/readme`) or use `scripts/mcp_client.py`
  against `http://127.0.0.1:8000/mcp`, which manages sessions itself.

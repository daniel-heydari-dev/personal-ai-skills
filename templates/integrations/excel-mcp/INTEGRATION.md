---
name: excel-mcp
description: MCP server that lets AI assistants create, read, and modify Excel files without Microsoft Excel installed — spreadsheets, formulas, charts, pivot tables, and conditional formatting.
category: integration
tags: [excel, mcp, spreadsheet, data, charts, pivot-tables]
setup: uvx excel-mcp-server stdio
source: https://github.com/haris-musa/excel-mcp-server
---

# Integration: Excel MCP Server

Give your AI assistant full Excel capabilities — no Microsoft Excel needed.

## Install

```bash
uvx excel-mcp-server stdio
```

Add to your Claude Code MCP config (`~/.claude/mcp_servers.json`):
```json
{
  "excel": {
    "command": "uvx",
    "args": ["excel-mcp-server", "stdio"]
  }
}
```

Or for Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "excel": {
      "command": "uvx",
      "args": ["excel-mcp-server", "stdio"]
    }
  }
}
```

## What It Enables

| Capability | Examples |
|-----------|---------|
| **Workbooks** | Create, open, save Excel files (.xlsx) |
| **Data** | Read/write cells, ranges, insert rows/columns |
| **Formulas** | SUM, VLOOKUP, IF, COUNTIF, and all Excel functions |
| **Formatting** | Cell colors, fonts, borders, number formats |
| **Charts** | Line, bar, pie, scatter — with custom titles/labels |
| **Pivot tables** | Group, aggregate, filter data |
| **Tables** | Excel Table objects with structured references |
| **Sheets** | Create, rename, copy, delete worksheets |
| **Validation** | Data validation rules, dropdown lists |

## Example Prompts

```
"Create an Excel budget tracker with monthly income, expenses, and savings"
"Read the data from sales.xlsx and create a pivot table by region"
"Add a line chart to sheet2 showing revenue trends from columns A and B"
"Apply conditional formatting — red for negative values, green for positive"
```

## Remote Usage

For remote connections, set `EXCEL_FILES_PATH` to specify where files are stored:
```bash
export EXCEL_FILES_PATH=/path/to/excel/files
uvx excel-mcp-server streamable-http
```

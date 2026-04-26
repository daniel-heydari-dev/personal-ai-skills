---
tags: [config, integration, graphify, knowledge-graph]
---

# Integration: graphify (Knowledge Graph)

<!--
  graphify converts your codebase into a knowledge graph.
  Instead of reading thousands of raw files, Claude navigates a graph
  of relationships between files, functions, and modules.
  Result: up to 71x token reduction for large codebase exploration.
-->

## How It Works

```
Your codebase (thousands of files)
        ↓  graphify install
Knowledge graph built in graphify-out/
        ↓
Claude reads the graph instead of raw files
        ↓
71x fewer tokens for "explore the codebase" tasks
```

## Setup

Requires Python 3.10+.

```bash
pip3 install graphifyy
graphify install     # run from inside your project directory
```

Then in Claude Code: use `/graphify` to activate graph navigation.

## When to Use It

**Use graphify when:**
- Asking "how does X work?" across a large codebase (50k+ lines)
- Exploring a new project you've never seen before
- Finding all usages of a function or type
- Understanding module dependencies

**Don't bother for:**
- Small projects (< 5k lines) — just read the files
- Single-file tasks — read the file directly

## Output

graphify writes to `graphify-out/` in the project directory.
The `~/ai-brain/graphify-out/` folder is for graph snapshots you've saved globally.

## Limitations

- Requires Python 3.10+ (check: `python3 --version`)
- First run takes 1-2 minutes for a large codebase
- Re-run after major refactors to keep the graph current
- Languages supported: TypeScript, JavaScript, Python (others via tree-sitter)

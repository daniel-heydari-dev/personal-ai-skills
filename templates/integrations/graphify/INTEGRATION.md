---
name: graphify
description: Knowledge graph tool for large codebases. Use when starting exploration of a new large project (50+ files) to map the entire codebase as a graph, achieving up to 71x token reduction.
category: integrations
tags: [knowledge-graph, codebase, on-demand, token-reduction]
setup: "pip install graphifyy && graphify install"
---

# graphify Integration (optional)

**Install:** `pip install graphifyy && graphify install`

## When to use

- Large codebases (50+ files) — 71x token reduction
- Research corpus (papers, docs, videos)
- Architecture exploration

## Commands

- `/graphify .` — build graph of current folder
- `/graphify query "how does auth work?"` — query graph
- `/graphify ./raw --obsidian` — export to Obsidian vault

## Rules for AI

1. If `graphify-out/GRAPH_REPORT.md` exists, read it BEFORE grepping files
2. Use `graphify query` instead of reading raw code for architecture questions
3. Graph updates automatically on git commit (if hooks installed)

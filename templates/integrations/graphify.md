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

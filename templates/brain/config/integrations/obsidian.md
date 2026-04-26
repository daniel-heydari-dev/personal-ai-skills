---
tags: [config, integration, obsidian]
---

# Integration: Obsidian (Second Brain Vault)

<!--
  This file tells Claude how your Obsidian vault is structured
  so it can navigate it correctly without asking you every time.
-->

## Vault Location

`~/ai-brain` (this vault)

## Folder Map

```
~/ai-brain/
├── config/          ← your identity and tool configs (this folder)
├── .raw/            ← drop files here for auto-ingestion
├── wiki/            ← all knowledge lives here
│   ├── hot.md       ← global session cache (auto-updated by claude-mem)
│   ├── index.md     ← master catalog of everything
│   ├── concepts/    ← ideas that apply across projects
│   ├── entities/    ← tools, people, companies you reference often
│   ├── sources/     ← ingested documents from .raw/
│   └── projects/    ← one folder per project
│       └── shared/  ← cross-project contracts and patterns
└── graphify-out/    ← knowledge graph output (optional)
```

## How to Use It

**When I say "check my notes"** → look in `wiki/projects/<current-project>/`
**When I say "past decisions"** → look in `wiki/projects/<current-project>/decisions.md`
**When I mention a cross-project contract** → look in `wiki/projects/shared/api-contracts.md`
**When I drop a file in .raw/** → ingest it and file it to the right wiki folder

## How It Fits With Other Tools

```text
Claude Code session
        │
        ├──► reads ./CLAUDE.md (per-project routing map)
        │       │
        │       └──► Brain Map points here → ~/ai-brain/wiki/...
        │
        ├──► claude-mem hook fires at session end
        │       └──► writes summary to ~/ai-brain/wiki/hot.md
        │
        ├──► next session: hot.md is auto-injected as recent context
        │
        ├──► /graphify (when invoked) → reads ./graphify-out/graph.json
        │       └──► 71× fewer tokens for "explore codebase" tasks
        │
        └──► search_memory MCP tool → queries older claude-mem history
```

**Boundaries (don't conflate):**

- `hot.md` = volatile recent-session cache, auto-overwritten
- `wiki/projects/<slug>/decisions.md` = permanent ADRs, manually curated
- `wiki/projects/shared/` = cross-project contracts only (not project details)
- `graphify-out/` = per-project, not in this vault

## Adding a New Project

1. Create `wiki/projects/<project-slug>/`
2. Copy the template from `wiki/projects/erp-pro/` (rename files, fill in details)
3. Add a row to `wiki/index.md` projects table
4. Update `wiki/projects/shared/` if this project shares APIs with others
5. Run `npx personal-ai-skills@latest` in the project directory to set up AI config

---
tags: [index, meta, second-brain]
pinned: true
---

# Second Brain — Master Index

> This vault is your AI's long-term memory.
> claude-mem writes session summaries to `hot.md` automatically — you never journal manually.
> Every project you work on has a folder here. Claude navigates it like a codebase.

---

## Vault Structure

```text
~/ai-brain/
│
├── config/                              ← your identity (~50 tokens, always loaded)
│   ├── always.md                        ← name, style, defaults, tools
│   └── integrations/
│       ├── obsidian.md                  ← how the vault is structured
│       ├── claude-mem.md                ← how session memory works
│       └── graphify.md                  ← how the knowledge graph works
│
├── .raw/                                ← drop source files here for ingestion
│   └── projects/                        ← organized per project
│       ├── erp-pro/                     ← PDFs/screenshots/videos for erp-pro
│       ├── erp-pro-ui/                  ← source materials for erp-pro-ui
│       ├── personal-ai-skills/          ← source materials for personal-ai-skills
│       ├── auth-service/                ← source materials for auth-service
│       └── shared/                      ← cross-project source materials
│
├── wiki/
│   ├── hot.md                           ← session cache (auto-updated by claude-mem)
│   ├── index.md                         ← this file — master catalog
│   ├── concepts/                        ← ideas that apply across projects
│   ├── entities/                        ← tools, people, services you reference often
│   ├── sources/                         ← ingested documents from .raw/
│   │
│   └── projects/                        ← ONE FOLDER PER PROJECT
│       │
│       ├── erp-pro/                     ← full-stack ERP SaaS
│       │   ├── index.md                 ← project overview (always loaded)
│       │   ├── decisions.md             ← WHY things are the way they are
│       │   ├── architecture.md          ← system design, data flow, modules
│       │   ├── api-contracts.md         ← APIs this app CONSUMES
│       │   └── dependencies.md          ← what this app needs from other projects
│       │
│       ├── erp-pro-ui/                  ← shared component library (Turborepo)
│       │   ├── index.md
│       │   ├── components.md            ← every component and its props
│       │   ├── design-tokens.md         ← colors, spacing, typography
│       │   └── changelog.md             ← breaking changes and additions
│       │
│       ├── personal-ai-skills/          ← CLI that sets up AI config in any project
│       │   ├── overview.md
│       │   ├── guide.md
│       │   ├── skills-catalog.md
│       │   └── decisions.md
│       │
│       └── shared/                      ← CROSS-PROJECT KNOWLEDGE (the magic folder)
│           ├── api-contracts.md         ← how ALL projects talk to each other
│           ├── shared-types.md          ← TypeScript types used everywhere
│           ├── deployment.md            ← how to deploy the whole system
│           └── env-vars.md              ← environment variables across all apps
│
└── graphify-out/                        ← optional knowledge graph snapshots

── In each project repo ──────────────────────────────────────────────────────

SPEC.md                                  ← root spec (always loaded, ~150 tokens)
CLAUDE.md                                ← routing MAP (always loaded, ~100 tokens)
docs/spec/
  auth/SPEC.md                           ← load only when: auth, login, JWT
  billing/SPEC.md                        ← load only when: billing, stripe, plan
  dashboard/SPEC.md                      ← load only when: dashboard, metrics
  inventory/SPEC.md                      ← load only when: inventory, stock, SKU
  (add more with: npx personal-ai-skills init spec <name>)
```

---

## The Magic: shared/ Folder

This is what makes multi-project AI work. When erp-pro needs to update a component from erp-pro-ui,
Claude checks `shared/api-contracts.md` — not the erp-pro-ui source code.

**Example:** "Update the DataTable component API in erp-pro-ui"

```text
AI reads CLAUDE.md → loads brain map
  → reads erp-pro-ui/components.md
  → reads shared/api-contracts.md
  → sees: erp-pro CONSUMES DataTable with columns/data/pagination props
  → knows: must update erp-pro-ui AND warn about erp-pro usages that break

Result: AI gives you the component change
        AND flags every erp-pro file that uses DataTable automatically
```

---

## How Each Project's CLAUDE.md References the Brain

After running `npx personal-ai-skills@latest`, each project gets a CLAUDE.md like:

**erp-pro CLAUDE.md:**

```text
## Brain Map
Session cache    → ~/ai-brain/wiki/hot.md
This project     → ~/ai-brain/wiki/projects/erp-pro/
Decisions        → ~/ai-brain/wiki/projects/erp-pro/decisions.md
Shared contracts → ~/ai-brain/wiki/projects/shared/api-contracts.md
```

**erp-pro-ui CLAUDE.md:**

```text
## Brain Map
Session cache    → ~/ai-brain/wiki/hot.md
This project     → ~/ai-brain/wiki/projects/erp-pro-ui/
Components I expose → ~/ai-brain/wiki/projects/erp-pro-ui/components.md
Who uses my package → ~/ai-brain/wiki/projects/shared/api-contracts.md
```

---

## Memory Flow

```text
Work in Claude Code → claude-mem fires → writes to hot.md
                                                ↓
                              Next session: context auto-injected
                              Claude remembers decisions, bugs, next steps
```

---

## Adding a New Project

1. `mkdir wiki/projects/<your-slug>/`
2. Copy files from `wiki/projects/erp-pro/` — rename and fill in your details
3. Add a row to the Projects table below
4. If the project has APIs used by other projects: update `shared/api-contracts.md`
5. In the project directory: `npx personal-ai-skills@latest`

---

## Projects

| Project | Status | Stack | Folder |
| --- | --- | --- | --- |
| _no projects yet — `personal-ai-skills` adds a row each time you install_ | | | |

---

## Concepts

| Concept | Description |
| --- | --- |
| _empty_ | _add cross-project ideas as you ingest them_ |

## Entities

| Entity | Type |
| --- | --- |
| _empty_ | _add tools, people, services you reference often_ |

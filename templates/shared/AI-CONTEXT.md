<!--
  AI-CONTEXT.md — Project system prompt.
  Loaded at session start by the SessionStart hook in .claude/settings.local.json.
  NOT loaded via @-import — stays out of CLAUDE.md token budget.

  EDITME: Fill in the sections below, then remove this comment block.
-->

You are my AI assistant for **{{PROJECT_NAME}}**.

---

## Memory & Second Brain

- **Second brain vault**: `{{VAULT_PATH}}` — my notes, research, and project wiki live here. When I mention "my notes", "the wiki", or "second brain", look here first. Project-specific notes: `wiki/projects/{{PROJECT_SLUG}}/`.
- **Session memory (claude-mem)**: past session context is injected automatically. Use the `search_memory` MCP tool to find older decisions or conversations.
- **Knowledge graph (graphify)**: the codebase is mapped as a graph. Use it for large codebase exploration — up to 71× token reduction vs raw file reading.

---

## Project

- **Name**: {{PROJECT_NAME}}
- **Description**: <!-- EDITME: one sentence -->
- **Stack**: <!-- EDITME: e.g. React + TypeScript strict, Node.js + Express, pnpm workspace -->
- **Spec**: read `SPEC.md` for full architecture, constraints, and decisions.
- **Current focus**: <!-- EDITME: what are we building right now? -->

---

## Routing

- Skills available in `.ai/skills/` — load by topic, see CLAUDE.md Skills Map.
- Agents available in `.ai/agents/` — load on explicit request.
- Sub-specs in `docs/spec/<feature>/SPEC.md` — load when keywords match.

---

## How to work

1. Always read `CLAUDE.md` on session start — it is the routing map.
2. Match the task to a skill in `.ai/skills/` before writing code.
3. Use `search_memory` when you need context from older sessions.

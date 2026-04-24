# {{PROJECT_NAME}}

<!--
  CLAUDE.md — the entry point for every AI session.
  This file is auto-loaded. Keep it THIN — it is a MAP, not a manual.
  Target: under 100 tokens. The real content lives in the files it points to.

  HOW IT WORKS:
    1. Claude loads this file automatically on every message.
    2. It reads SPEC.md (always — ~150 tokens).
    3. When you mention a feature (e.g. "working on auth"), Claude reads
       the matching row from Spec Map and loads that sub-spec (~200 tokens).
    4. Total context loaded: ~350–500 tokens. Not 6,000.

  DO NOT put coding rules here. Put them in .ai/rules/ or SPEC.md.
  DO NOT put skill content here. It lives in .ai/skills/.
  DO update the maps below whenever you add specs, skills, or agents.
-->

## ⚡ Always Load

- Root spec: `SPEC.md` — what the app is, tech stack, key rules
- Core rules: `.ai/rules/always.md` — coding standards (add if present)

---

## 🗺️ Spec Map

> Load the matching spec when the user's task mentions these keywords.

| Topic                    | Keywords to watch for              | Load this file                      |
| ------------------------ | ---------------------------------- | ----------------------------------- |
| auth, login, session     | auth, login, logout, JWT, password | `docs/spec/auth/SPEC.md`            |
| billing, payments        | billing, stripe, invoice, plan     | `docs/spec/billing/SPEC.md`         |
| dashboard, analytics     | dashboard, chart, metrics, graph   | `docs/spec/dashboard/SPEC.md`       |

<!--
  HOW TO ADD A SPEC:
    Run: npx personal-ai-skills init spec <name>
    Example: npx personal-ai-skills init spec billing
    → Creates docs/spec/billing/SPEC.md
    → Adds a row to SPEC.md Spec Map (and you add it here too)

  GOOD KEYWORDS:
    auth      → auth, login, logout, session, JWT, password, OAuth
    billing   → billing, stripe, subscription, invoice, plan, payment
    inventory → inventory, stock, SKU, warehouse, location, quantity
    dashboard → dashboard, charts, analytics, metrics, graph
    api       → api, route, endpoint, REST, response, request
-->

---

## 🗺️ Skills Map

> Load the matching skill when the task involves this technology or task type.

| When the user is working on         | Load this skill                         |
| ----------------------------------- | --------------------------------------- |
| React components, hooks, state      | `.ai/skills/modern-react/`              |
| API routes, REST endpoints          | `.ai/skills/api-design/`                |
| TypeScript types, generics          | `.ai/skills/clean-typescript/`          |
| Tests, test coverage                | `.ai/skills/testing-best-practices/`    |
| Git, commits, PRs                   | `.ai/skills/git-workflow/`              |
| Security review, auth checks        | `.ai/agents/security-auditor/`          |
| Code review requested               | `.ai/agents/code-reviewer/`             |

<!--
  HOW TO INSTALL SKILLS:
    npx personal-ai-skills                       ← interactive wizard
    npx personal-ai-skills add modern-react      ← install a specific skill
    npx personal-ai-skills add api-design

  Skills install to .ai/skills/<name>/SKILL.md
  You control which ones exist — only list them here if installed.
-->

---

## 🗺️ Obsidian Map

> Load from the second brain only when the user explicitly asks about past decisions or context.
> Never auto-load the whole vault — it's massive.

| Topic                                  | Load this file                                               |
| -------------------------------------- | ------------------------------------------------------------ |
| Architecture decisions, why we chose X | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/decisions.md`     |
| Past auth or security work             | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/auth.md`          |
| Session context (most recent work)     | `~/ai-brain/wiki/hot.md`                                     |

<!--
  OBSIDIAN VAULT PATH: ~/ai-brain/
  If your vault is at a different path, update every reference above.

  HOW TO USE:
    - Drop any file into ~/ai-brain/.raw/ and Claude extracts + organises it.
    - wiki/hot.md is the always-current session cache — read it first.
    - wiki/projects/{{PROJECT_SLUG}}/ holds notes specific to THIS project.
    - Never tell Claude to "read the whole vault" — always reference specific files.
-->

---

## 🧠 Memory (claude-mem)

claude-mem runs automatically — past session context is already injected at the top of this conversation.
Do not repeat context that is already present. Use `search_memory` MCP tool if you need older context.

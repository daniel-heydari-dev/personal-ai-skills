# {{PROJECT_NAME}}

<!--
  ⚠️ This is the initial scaffold. Run `personal-ai-skills bridge` to refresh
  with your real installed skills/agents/sub-specs.

  Routing map. Loaded every session. Keep it THIN — every line should
  pass the test: "would removing this cause the AI to make a mistake?"

  Anthropic best practices:  https://code.claude.com/docs/en/best-practices
  Memory & imports:          https://code.claude.com/docs/en/memory
  AGENTS.md spec:            https://agents.md/

  FOUR-TIER LOADING (token efficiency):
    @SPEC.md                          ← Tier 1: always loaded (~150 tokens)
    @docs/spec/<feature>/SPEC.md      ← Tier 2: on keyword match (~200 tokens)
    .ai/skills/<name>/SKILL.md        ← Tier 3: on topic match
    ~/ai-brain/wiki/projects/<slug>/  ← Tier 4: on explicit ask only (deep history)

  The @path syntax is a Claude-native lazy-load directive. Non-Claude editors
  read it as a plain pointer — works in both worlds.
-->

## ⚡ Always Load

- Root spec: @SPEC.md
- Always-on rules: @.ai/rules/always.md (add if present)

## 🗺️ Spec Map

> Load the matching sub-spec when the user's task mentions these keywords.
> Scaffold a new one with: `npx personal-ai-skills init spec <name>`

<!--
  EXAMPLE rows — uncomment after you've actually scaffolded these specs.
  Or just run `npx personal-ai-skills init spec <name>` and re-run `bridge` —
  the table will rebuild itself with your real sub-specs.

  | Topic     | Keywords                          | Load                         |
  | --------- | --------------------------------- | ---------------------------- |
  | auth      | auth, login, logout, JWT, session | @docs/spec/auth/SPEC.md      |
  | billing   | billing, stripe, invoice, plan    | @docs/spec/billing/SPEC.md   |
  | dashboard | dashboard, chart, metrics         | @docs/spec/dashboard/SPEC.md |
-->

## 🗺️ Skills

Skills live in `.ai/skills/<name>/SKILL.md`. Match by topic and load only the matching ones.

## 🗺️ Agents

Agents live in `.ai/agents/<name>/AGENT.md`. Load only when the user explicitly requests that role.

## 🗺️ Brain Map

> Obsidian vault (Tier 4) — load only when the user asks about past decisions, history, or background.
> Plain backticks (no `@`) so the vault doesn't auto-load on every session.

| What | Load |
| --- | --- |
| Recent session cache | `~/ai-brain/wiki/hot.md` |
| This project's notes | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/` |
| Architecture decisions | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/decisions.md` |
| Cross-project contracts | `~/ai-brain/wiki/projects/shared/api-contracts.md` |

## 🧠 Memory

- **claude-mem** auto-injects recent session context — don't repeat what's already there.
- **`search_memory`** (MCP tool) — use for older sessions or specific past decisions.
- **`/graphify`** — invoke for large-codebase navigation (up to 71× token reduction).

# {{PROJECT_NAME}}

<!--
  Routing map for non-Claude AI assistants (Codex, Amp, OpenCode, Neovim, Cursor, ...).
  Loaded every session. Keep it THIN — every line should pass the test:
  "would removing this cause the AI to make a mistake?"

  AGENTS.md spec:           https://agents.md/  (open standard, Linux Foundation)
  Mirrors CLAUDE.md so Claude Code and other agents read the same routing.
-->

## ⚡ Always Load

- Root spec: `SPEC.md`
- Always-on rules: `.ai/rules/always.md` (add if present)

## 🗺️ Spec Map

> Load the matching sub-spec when the user's task mentions these keywords.
> Scaffold a new one with: `npx personal-ai-skills init spec <name>`

| Topic | Keywords | Load |
| --- | --- | --- |
| auth | auth, login, logout, JWT, session | `docs/spec/auth/SPEC.md` |
| billing | billing, stripe, invoice, plan | `docs/spec/billing/SPEC.md` |
| dashboard | dashboard, chart, metrics | `docs/spec/dashboard/SPEC.md` |

## 🗺️ Skills

Skills live in `.ai/skills/<name>/SKILL.md`. Match by topic and load only the matching ones.

## 🗺️ Agents

Agents live in `.ai/agents/<name>/AGENT.md`. Load only when the user explicitly requests that role.

## 🗺️ Brain Map

> Obsidian vault — load only when the user asks about past decisions, notes, or session history.

| What | Load |
| --- | --- |
| Recent session cache | `~/ai-brain/wiki/hot.md` |
| This project's notes | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/` |
| Architecture decisions | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/decisions.md` |
| Cross-project contracts | `~/ai-brain/wiki/projects/shared/api-contracts.md` |

## 🧠 Memory

- Past session context is auto-injected when the editor supports it.
- If no context appears, ask the user for it explicitly.
- For large-codebase navigation, ask the user to run `/graphify` or `graphify install`.

## Commands

- Dev: {{devCommand}}
- Build: {{buildCommand}}
- Test: {{testCommand}}

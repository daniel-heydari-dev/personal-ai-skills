# {{PROJECT_NAME}}

<!--
  Routing map. Loaded every session. Keep it THIN — every line should
  pass the test: "would removing this cause a mistake?"

  Anthropic best practices:  https://code.claude.com/docs/en/best-practices
  Memory & imports:          https://code.claude.com/docs/en/memory
  AGENTS.md spec:            https://agents.md/

  THREE-TIER LOADING (token efficiency):
    @SPEC.md                 ← always loaded (~150 tokens)
    @docs/spec/<feature>/    ← on demand, when a keyword matches (~200 tokens)
    .ai/skills/<name>/       ← on demand, when the topic matches

  The @path syntax is a Claude-native lazy-load directive. Non-Claude editors
  read it as a plain pointer — works in both worlds.
-->

## ⚡ Always Load

- Root spec: @SPEC.md
- Always-on rules: @.ai/rules/always.md
- Slash commands: `.ai/commands/<name>/COMMAND.md` — load when the user references one by name

## 🗺️ Spec Map

<!--
  Add a row for each docs/spec/<name>/SPEC.md you scaffold.
  Run: npx personal-ai-skills init spec <name>
-->

| Topic | Keywords | Load |
| ----- | -------- | ---- |
| <!-- EDITME: e.g. Auth | auth, login, logout, JWT, session | `docs/spec/auth/SPEC.md` --> |

## 🗺️ Skills Map

<!--
  List only skills installed in .ai/skills/.
  Run: npx personal-ai-skills add <skill-name>
-->

| Skill | Load |
| ----- | ---- |
| <!-- EDITME: e.g. modern-react | `.ai/skills/modern-react/` --> |

## 🗺️ Agents Map

<!--
  List only agents installed in .ai/agents/.
  Run: npx personal-ai-skills add <agent-name>
-->

| Agent | Load |
| ----- | ---- |
| <!-- EDITME: e.g. code-reviewer | `.ai/agents/code-reviewer/` --> |

## 🗺️ Brain Map

> Load in priority order when context seems lost or session resumed.

| What | When to load | Path |
| ---- | ------------ | ---- |
| **Session log** | First — resuming session, after compaction | `.claude/session-log.md` |
| Recent session cache | Cross-session history | `{{VAULT_PATH}}/wiki/hot.md` |
| This project's notes | Feature context, past work | `{{VAULT_PATH}}/wiki/projects/{{PROJECT_SLUG}}/` |
| Architecture decisions | ADRs, why decisions were made | `{{VAULT_PATH}}/wiki/projects/{{PROJECT_SLUG}}/decisions.md` |
| Cross-project contracts | API contracts with other projects | `{{VAULT_PATH}}/wiki/projects/shared/api-contracts.md` |

## 🧠 Memory

- **`.claude/session-log.md`** — git snapshot written after every turn. Read this first when resuming or context feels lost. Shows WHAT changed this session.
- **claude-mem** auto-injects recent session context — don't repeat what's already there.
- **`search_memory`** (MCP tool) — use for older sessions or specific past decisions.
- **`/graphify`** — invoke for large-codebase navigation (up to 71× token reduction).

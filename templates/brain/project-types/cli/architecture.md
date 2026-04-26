---
tags: [architecture, personal-ai-skills]
---

# personal-ai-skills — Architecture

## Source of truth

Every install reads from `templates/` at install time. Skill content is never bundled inline in user projects — it is copied or symlinked.

```text
templates/
├── skills/<id>/SKILL.md      ← canonical skill content
├── agents/<id>/AGENT.md      ← canonical agent content
├── rules/<id>/RULE.md
├── commands/<id>/COMMAND.md
├── prompts/<id>/PROMPT.md
├── integrations/<id>.md
└── shared/
    ├── SPEC.root.md          ← root SPEC.md template (~150 tokens target)
    ├── SPEC.page.md          ← docs/spec/<feature>/SPEC.md template
    ├── CLAUDE.md             ← routing map template
    └── AGENTS.md             ← non-Claude bridge template
```

## CLI flow

```text
pnpm dlx personal-ai-skills           ← interactive wizard
  ├── prompts.ts                      ← 4-step wizard
  ├── install.ts (installItems)       ← copies templates → .ai/
  ├── bridge.ts (generateBridgeFilesForIds)
  │     ├── claudeBridge()            ← CLAUDE.md (dynamic Spec Map)
  │     ├── cursorBridge()            ← .cursor/rules/ai-config.mdc
  │     ├── vscodeBridge()            ← .vscode/settings.json (merged)
  │     ├── copilotBridge()           ← .github/copilot-instructions.md
  │     ├── geminiBridge()            ← GEMINI.md
  │     ├── windsurfBridge()          ← .windsurfrules
  │     ├── zedBridge()               ← .zed/instructions.md
  │     └── agentsBridge()            ← AGENTS.md (codex, amp, opencode, neovim)
  ├── scaffoldProjectSpec()           ← SPEC.md + CLAUDE.md
  └── buildMasterPrompt()             ← .ai/AI-CONTEXT.md (~200 tokens)
```

## Lock file

`.ai/.skill-lock.json` (project) or `~/.ai/.skill-lock.json` (global) is the source of truth for installed state.

- Records: id, type, source, hash, installedAt, assistants, scope, method
- Read by: `update`, `remove`, `list`, `bridge`
- Updated atomically on every install/remove

## Dynamic Spec Map

`claudeBridge()` scans `docs/spec/*/SPEC.md` at generation time. Each sub-spec's first `# Heading` becomes the row Topic. Re-run `personal-ai-skills bridge` after `init spec <name>` to refresh.

## Three-tier loading (token efficiency)

```text
CLAUDE.md            ← routing map           (~100 tokens, always)
SPEC.md              ← project facts         (~150 tokens, always)
docs/spec/<f>/SPEC.md← feature spec          (~200 tokens, on demand)
.ai/skills/<n>/      ← coding skill          (on demand by topic)
```

Total per session: 300–500 tokens — not 6,000+.

## Critical files

- [src/cli.ts](https://github.com/AgriciDaniel/personal-ai-skills/blob/main/src/cli.ts) — wizard, all subcommands
- [src/bridge.ts](https://github.com/AgriciDaniel/personal-ai-skills/blob/main/src/bridge.ts) — bridge file generators
- [src/install.ts](https://github.com/AgriciDaniel/personal-ai-skills/blob/main/src/install.ts) — copy/symlink installer
- [src/lock.ts](https://github.com/AgriciDaniel/personal-ai-skills/blob/main/src/lock.ts) — lock file ops

## Key invariants

- Never auto-generate bridge files without explicit user consent
- Skill content is read from `templates/` at install time — never bundled inline
- `.ai/.skill-lock.json` is the only source of truth for installed state
- Backwards-compat: assistant IDs and install paths must never break

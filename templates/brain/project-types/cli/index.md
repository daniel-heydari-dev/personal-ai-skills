---
tags: [project, ai-tools, cli, personal-ai-skills]
status: active
version: 1.1.6
---

# personal-ai-skills

> Universal AI skills installer. One command to configure every AI assistant — Claude Code, Cursor, VS Code Copilot, Gemini CLI, WebStorm, Zed, Windsurf, Neovim — with the same skills, agents, and rules.

## What It Does

Installs a three-tier AI configuration system into any project:

```text
Tier 1 — Always loaded (~150 tokens)
  SPEC.md                              what the project is, stack, key invariants
  .ai/rules/<name>/RULE.md             hard constraints (each rule auto-imports)

Tier 2 — Loaded on keyword match (~200 tokens per match)
  docs/spec/<feature>/SPEC.md          loaded only when feature keyword comes up

Tier 3 — Loaded on topic match
  .ai/skills/<name>/SKILL.md           Claude reads frontmatter, loads when relevant
  .ai/agents/<name>/AGENT.md           loaded on explicit role request
```

The AI only loads what's relevant — total per session: ~300–500 tokens, not 6,000+.

## Stack

| Layer | Tech |
| --- | --- |
| Language | TypeScript (strict), ESM |
| Runtime | Node.js 20+ |
| CLI prompts | @clack/prompts |
| Tests | vitest |
| Package manager | pnpm |
| Build | tsc |

## Key Commands

```bash
npx personal-ai-skills@latest        # interactive 4-step wizard
npx personal-ai-skills add           # add skills/agents to current project
npx personal-ai-skills bridge        # generate editor bridge files only
npx personal-ai-skills list          # show installed skills
npx personal-ai-skills remove <name> # remove a skill
npx personal-ai-skills update        # re-install all locked skills
```

## Links

- [[guide]] — how to use in any project (step-by-step)
- [[decisions]] — architecture decisions
- [[skills-catalog]] — all available skills and agents

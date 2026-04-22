# personal-ai-skills

> Universal AI skills installer — one command to teach any AI assistant best practices.

[![npm version](https://img.shields.io/npm/v/personal-ai-skills.svg)](https://www.npmjs.com/package/personal-ai-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is personal-ai-skills?

A CLI that installs coding guidelines, rules, agent personas, and prompt templates into **any project** — and every AI assistant you use reads them automatically.

**The problem:** You use Claude, Copilot, Cursor, Gemini, and more. Each reads its own config directory. Keeping instructions in sync across editors is painful.

**The solution:** `personal-ai-skills` installs everything into a single `.ai/` directory and generates bridge context files (`CLAUDE.md`, `.cursorrules`, etc.) that tell each editor: _"Read `.ai/` for all instructions."_

```
your-project/
├── .ai/                          ← single source of truth
│   ├── skills/clean-code/
│   ├── skills/modern-react/
│   ├── rules/typescript-strict/
│   ├── agents/code-reviewer/
│   └── .skill-lock.json
├── CLAUDE.md                     ← bridge: "read .ai/"
├── GEMINI.md                     ← bridge: "read .ai/"
├── AGENTS.md                     ← bridge: "read .ai/"
└── .cursor/rules/ai-config.mdc   ← bridge: "read .ai/"
```

No duplication. Switch editors freely. Commit `.ai/` to git — your whole team gets the same AI behavior.

### Compatible with skills.sh

Designed to work with the [skills.sh](https://skills.sh) ecosystem by [Vercel Labs](https://github.com/vercel-labs/skills). Skills created for either tool work in both.

---

## Quick Start

```bash
# Run directly (no install needed)
npx personal-ai-skills

# Or install globally
npm install -g personal-ai-skills

# Or with pnpm
pnpm add -g personal-ai-skills
```

The interactive wizard:

1. **Multi-select categories** — Skills, Agents, Commands, Rules, Prompts (pick one or all)
2. **Pick specific items** — checkboxes for each category
3. **Auto-detects** your AI assistants
4. **Installs to `.ai/`** + generates bridge files

That's it. Your AI assistants now follow the guidelines.

---

## How It Works

### Architecture

```
┌───────────────────────────────────────────────────────┐
│  .ai/                    ← all content lives here     │
│  ├── skills/clean-code/                               │
│  ├── skills/modern-react/                             │
│  ├── rules/typescript-strict/                         │
│  ├── agents/code-reviewer/                            │
│  └── .skill-lock.json   ← tracks what's installed    │
├───────────────────────────────────────────────────────┤
│  Bridge context files    ← auto-generated             │
│  ├── CLAUDE.md           → tells Claude: read .ai/    │
│  ├── GEMINI.md           → tells Gemini: read .ai/    │
│  ├── AGENTS.md           → tells Copilot/Codex/Amp    │
│  ├── .cursor/rules/      → tells Cursor: read .ai/    │
│  └── .windsurfrules      → tells Windsurf: read .ai/  │
└───────────────────────────────────────────────────────┘
```

1. **`.ai/` is the single source of truth.** All content (skills, rules, agents, commands, prompts) lives here.
2. **Bridge files** are tiny context files for each editor. They just say "read `.ai/` for instructions." Auto-generated, never overwrite existing ones.
3. **Lock file** (`.ai/.skill-lock.json`) tracks installed items, versions, and sources.
4. **No editor-specific directories.** No `.claude/skills/`, no `.cursor/skills/`, no duplication.

### How AI Assistants Use Your Skills

Once installed, your AI assistants **automatically** pick up the guidelines:

- **Claude Code** reads `CLAUDE.md` → discovers `.ai/skills/` → follows the rules
- **Cursor** reads `.cursor/rules/ai-config.mdc` → discovers `.ai/skills/` → applies them
- **GitHub Copilot** reads `AGENTS.md` + `.github/copilot-instructions.md` → same result
- **Gemini CLI** reads `GEMINI.md` → applies `.ai/` content
- **Windsurf** reads `.windsurfrules` → applies `.ai/` content

You don't need to configure anything extra. Just open your editor, start coding, and the AI follows the guidelines.

### Example: After Installing "clean-code"

You run `npx personal-ai-skills add clean-code` in your project. Now when you ask Claude or Copilot to write a function, they'll automatically:

- Use meaningful variable names (no `x`, `temp`, `data`)
- Keep functions small (< 20 lines)
- Follow DRY principles
- Add proper error handling

Because `.ai/skills/clean-code/SKILL.md` tells them to.

---

## Usage

### Interactive Mode

```bash
personal-ai-skills
```

Multi-select categories → pick items → confirm → done.

### Direct Install

```bash
# Install a single skill
personal-ai-skills add clean-code

# Install multiple items
personal-ai-skills add clean-code modern-react

# Install from GitHub
personal-ai-skills add user/repo

# Install from a local directory
personal-ai-skills add ./my-custom-skill

# Install everything at once
personal-ai-skills add --all --yes
```

### Other Commands

```bash
# List available content
personal-ai-skills list
personal-ai-skills list skills
personal-ai-skills list --installed

# Search the catalog
personal-ai-skills search react

# Remove installed content
personal-ai-skills remove clean-code

# Generate bridge files manually
personal-ai-skills bridge

# Create a new skill template
personal-ai-skills init skills my-skill

# Update installed items
personal-ai-skills update

# Launch web viewer
personal-ai-skills serve
```

### Options

| Option                | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `-y`, `--yes`         | Skip confirmation prompts                                        |
| `--all`               | Install all items                                                |
| `-g`, `--global`      | Install to home directory (`~/.ai/`)                             |
| `-a`, `--agent <ids>` | Target specific assistants for bridge files                      |
| `-t`, `--type <type>` | Content type: `skills`, `agents`, `commands`, `rules`, `prompts` |
| `-v`, `--version`     | Show version                                                     |
| `-h`, `--help`        | Show help                                                        |

### CI/CD Usage

```bash
# Non-interactive install for pipelines
npx personal-ai-skills add --all --yes
```

---

## Content Catalog

### Skills (18)

Best-practice guides that teach your AI how to write better code.

| Skill                    | Description                                  |
| ------------------------ | -------------------------------------------- |
| `clean-code`             | Meaningful names, small functions, DRY       |
| `clean-typescript`       | TypeScript-specific best practices           |
| `modern-react`           | React 19 patterns, Server Components, hooks  |
| `modern-nextjs`          | App Router, Server Components, data fetching |
| `solid-principles`       | SOLID design patterns                        |
| `testing-best-practices` | AAA pattern, test isolation, coverage        |
| `error-handling`         | Error boundaries, logging, recovery          |
| `performance`            | Optimization techniques and profiling        |
| `accessibility`          | WCAG compliance and semantic HTML            |
| `web-security`           | OWASP guidelines, XSS/CSRF prevention        |
| `git-workflow`           | Conventional commits, branching strategies   |
| `documentation`          | JSDoc, README standards, inline comments     |
| `node-backend`           | Express/Fastify patterns, middleware         |
| `api-design`             | RESTful API design principles                |
| `interface-design`       | TypeScript interface design patterns         |
| `systematic-debugging`   | Structured debugging methodology             |
| `brainstorming`          | Design exploration and ideation              |
| `changelog-generation`   | Automated changelog creation                 |

### Agents (8)

Specialized AI personas with deep expertise.

| Agent                   | Description                                   |
| ----------------------- | --------------------------------------------- |
| `architect`             | System design and architecture decisions      |
| `code-reviewer`         | Thorough code review with actionable feedback |
| `test-writer`           | Comprehensive test generation                 |
| `security-auditor`      | Security vulnerability detection              |
| `performance-optimizer` | Performance bottleneck identification         |
| `refactor-expert`       | Code restructuring and pattern improvement    |
| `docs-explorer`         | Documentation navigation and explanation      |
| `migration-helper`      | Framework/library migration guidance          |

### Commands (8)

Quick-access templates for common tasks.

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `code-review`    | Review code quality and suggest improvements |
| `explain`        | Explain code or concepts clearly             |
| `generate-tests` | Create comprehensive test suites             |
| `refactor`       | Improve code structure and readability       |
| `document`       | Generate documentation and comments          |
| `optimize`       | Performance optimization suggestions         |
| `fix-tests`      | Debug and fix failing tests                  |
| `scaffold`       | Generate boilerplate and project structure   |

### Rules (6)

Hard constraints your AI must always follow.

| Rule                     | Description                       |
| ------------------------ | --------------------------------- |
| `typescript-strict`      | Strict TypeScript type-safety     |
| `react-patterns`         | Modern React conventions          |
| `accessibility-required` | WCAG 2.1 AA compliance            |
| `error-boundaries`       | Error boundary patterns for React |
| `import-order`           | Consistent import ordering        |
| `no-console`             | No console.log in production      |

### Prompts (5)

Templates for structured output.

| Prompt           | Description                          |
| ---------------- | ------------------------------------ |
| `pr-description` | Structured pull request descriptions |
| `commit-message` | Conventional commit message format   |
| `release-notes`  | User-facing changelog generation     |
| `bug-report`     | Structured bug report template       |
| `feature-spec`   | Feature specification document       |

---

## Supported AI Assistants (18)

Auto-detected. All content goes to `.ai/` — bridge files handle the rest.

| Assistant      | Bridge File                                     | Detected By                                |
| -------------- | ----------------------------------------------- | ------------------------------------------ |
| Claude Code    | `CLAUDE.md`                                     | `~/.claude/` or `claude` CLI               |
| GitHub Copilot | `AGENTS.md` + `.github/copilot-instructions.md` | `~/.config/github-copilot/`                |
| Cursor         | `.cursor/rules/ai-config.mdc`                   | `~/.cursor/` or `/Applications/Cursor.app` |
| Windsurf       | `.windsurfrules`                                | `~/.codeium/windsurf/`                     |
| Gemini CLI     | `GEMINI.md`                                     | `~/.gemini/` or `gemini` CLI               |
| Antigravity    | `GEMINI.md`                                     | `~/.gemini/antigravity/`                   |
| Codex          | `AGENTS.md`                                     | `~/.codex/` or `codex` CLI                 |
| Amp            | `AGENTS.md`                                     | `~/.config/amp/`                           |
| Cline          | `AGENTS.md`                                     | `~/.cline/`                                |
| Roo Code       | `AGENTS.md`                                     | `~/.roo/`                                  |
| Continue       | `AGENTS.md`                                     | `~/.continue/`                             |
| Goose          | `AGENTS.md`                                     | `~/.config/goose/`                         |
| OpenCode       | `AGENTS.md`                                     | `~/.config/opencode/`                      |
| Kiro           | `AGENTS.md`                                     | `~/.kiro/`                                 |
| Trae           | `AGENTS.md`                                     | `~/.trae/`                                 |
| Augment        | `AGENTS.md`                                     | `~/.augment/`                              |
| Droid          | `AGENTS.md`                                     | `~/.factory/`                              |
| Kilo Code      | `AGENTS.md`                                     | `~/.kilocode/`                             |

---

## Creating Your Own Content

### Skill File Format

```
my-skill/
└── SKILL.md
```

```markdown
---
name: my-skill
description: What this skill teaches
category: coding
tags: [typescript, patterns]
---

# My Skill

## Context

When to apply this skill.

## Instructions

Guidelines the AI must follow.

## Examples

Concrete code examples.

## Anti-patterns

What NOT to do.
```

### Other Content Types

| Type    | File Name    | Template Dir                 |
| ------- | ------------ | ---------------------------- |
| Skill   | `SKILL.md`   | `templates/skills/<name>/`   |
| Agent   | `AGENT.md`   | `templates/agents/<name>/`   |
| Command | `COMMAND.md` | `templates/commands/<name>/` |
| Rule    | `RULE.md`    | `templates/rules/<name>/`    |
| Prompt  | `PROMPT.md`  | `templates/prompts/<name>/`  |

Or use the init command:

```bash
personal-ai-skills init skills my-skill
personal-ai-skills init agents my-agent
```

### Sharing via GitHub

Publish your skill as a repo and anyone can install it:

```bash
personal-ai-skills add your-username/your-skill-repo
```

---

## Publishing to npm

To publish `personal-ai-skills` so anyone can use it with `npx personal-ai-skills`:

```bash
# 1. Login to npm
npm login

# 2. Make sure tests pass and it builds
pnpm test && pnpm build

# 3. Publish
npm publish

# 4. Users can now run:
npx personal-ai-skills
```

### Scoped Package (Optional)

If `personal-ai-skills` is taken on npm, publish under a scope:

```bash
# In package.json: change "name" to "@your-scope/personal-ai-skills"
npm publish --access public

# Users run:
npx @your-scope/personal-ai-skills
```

---

## Development

```bash
# Clone and install
git clone https://github.com/daniel-heydari-dev/personal-ai-skills.git
cd personal-ai-skills
pnpm install

# Dev (runs TypeScript directly)
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Type-check
pnpm typecheck

# Web viewer dev mode
cd web
pnpm install
pnpm dev
```

### Web Viewer

Browse the full catalog with an interactive web UI featuring animated space backgrounds, smooth transitions, and live search.

```bash
# Launch the web viewer
personal-ai-skills serve

# Or develop locally
cd web
pnpm install
pnpm dev
```

#### Web Viewer Features

- Animated canvas space background with twinkling stars and shooting stars
- Smooth page transitions with staggered fade-in animations
- Animated stat counters with eased count-up effects
- Floating nebula orbs with parallax-style drift
- Gradient glow borders on hover with shimmer effects
- **Explore page** — deep-dive into all 45 templates with What/Why/How explanations, before/after code comparisons, and highlight grids
- **Guide page** — interactive workflow timeline, AI config table with official brand SVG icons, concept cards, golden rules, and step-by-step setup instructions
- Package manager tabs (pnpm / npm / yarn) for install commands
- Responsive design — works on mobile and desktop
- Live search across all skills, agents, commands, rules, and prompts

### Project Structure

```
personal-ai-skills/
├── src/
│   ├── cli.ts          # CLI entry point, command routing
│   ├── types.ts        # Central type definitions
│   ├── agents.ts       # 18 AI assistant registry (detection, paths)
│   ├── catalog.ts      # Content catalog (loads templates)
│   ├── install.ts      # Installation to .ai/ directory
│   ├── lock.ts         # Lock file (.ai/.skill-lock.json)
│   ├── bridge.ts       # Bridge context file generation
│   ├── prompts.ts      # Interactive CLI prompts (@clack/prompts)
│   └── github.ts       # GitHub/URL/local source fetching
├── templates/
│   ├── skills/         # 18 built-in skills
│   ├── agents/         # 8 specialized agents
│   ├── commands/       # 8 command templates
│   ├── rules/          # 6 coding rules
│   ├── prompts/        # 5 prompt templates
│   ├── stacks/         # Stack configs (go, node, python, rust)
│   ├── shared/         # Shared AGENTS.md + AI_SETUP.md templates
│   ├── claude/         # Claude bridge template
│   ├── copilot/        # Copilot bridge template
│   └── gemini/         # Gemini bridge template
├── web/                # React web viewer (Vite + React 19)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx           # App shell with nav
│   │   │   ├── SpaceBackground.tsx  # Animated canvas background
│   │   │   ├── SkillCard.tsx        # Skill card with hover effects
│   │   │   └── BrandIcons.tsx       # Official AI brand SVG icons
│   │   ├── pages/
│   │   │   ├── HomePage.tsx         # Hero, stats, search, categories
│   │   │   ├── ExplorePage.tsx      # Full catalog deep-dive with examples
│   │   │   ├── GuidePage.tsx        # Interactive workflow guide
│   │   │   ├── CategoryPage.tsx     # Category listing
│   │   │   └── SkillPage.tsx        # Skill detail view
│   │   └── data/
│   │       └── catalog.ts           # Client-side catalog data
│   └── package.json
├── test/               # Vitest test suite (28 tests)
└── package.json
```

### Key Design Decisions

| Decision                     | Rationale                                                 |
| ---------------------------- | --------------------------------------------------------- |
| `.ai/` as canonical dir      | Editor-agnostic, no duplication, one place for everything |
| Bridge files over symlinks   | Works on all OS, no permission issues, human-readable     |
| Auto-detect assistants       | Zero config — just run `personal-ai-skills/`              |
| Never overwrite bridge files | User customizations are preserved                         |
| Lock file in `.ai/`          | Tracks versions for updates, keeps everything together    |

---

## FAQ

### How do I know it's working?

After installing, open your project in Claude Code, Cursor, or any supported editor. Ask the AI to write a function — it should follow the guidelines from your installed skills.

You can also check the bridge files:

```bash
cat CLAUDE.md      # Shows what Claude reads
cat AGENTS.md      # Shows what Copilot/Codex reads
```

### What if I already have a CLAUDE.md?

Bridge files **never overwrite** existing files. If you already have `CLAUDE.md`, `personal-ai-skills` skips it. Add the `.ai/` reference manually:

```markdown
## AI Configuration

Read all files in `.ai/skills/` and `.ai/rules/` before writing code.
```

### Can I install to multiple projects?

Yes. `cd` into each project and run `personal-ai-skills`. Each project gets its own `.ai/` directory.

### What should I commit to git?

Commit everything:

- `.ai/` — your skills, rules, agents, etc.
- `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` — bridge files
- `.cursor/rules/ai-config.mdc` — Cursor bridge

Your team gets the same AI behavior automatically.

### Project scope vs global?

| Scope                 | Location               | When to Use                           |
| --------------------- | ---------------------- | ------------------------------------- |
| **Project** (default) | `.ai/` in project root | Team-shared, committed to git         |
| **Global** (`-g`)     | `~/.ai/` in home dir   | Personal defaults across all projects |

---

## License

MIT

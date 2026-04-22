# personal-ai-skills

> **One config, every AI assistant, minimal tokens.** The universal AI instruction system — skills, agents, rules, and specs that work across Claude Code, Cursor, VS Code, GitHub Copilot, Codex, Gemini, and Windsurf, integrated with Obsidian as your second brain.

[![npm version](https://img.shields.io/npm/v/personal-ai-skills.svg)](https://www.npmjs.com/package/personal-ai-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 The Problem

You use **multiple AI coding assistants**: Claude Code, Cursor, VS Code Copilot, Codex, Gemini, maybe Windsurf. Every assistant reads its own config file in its own format. You end up:

- Copy-pasting the same rules into `CLAUDE.md`, `.cursor/rules`, `AGENTS.md`, `GEMINI.md`, `.vscode/settings.json`…
- Burning **thousands of tokens per message** because every rule loads every time
- Losing context between sessions — the AI forgets what you did yesterday
- Juggling Obsidian notes, `.md` docs, and AI configs separately
- Repeating the entire project context on every single project

There has to be a better way. **There is.**

---

## 💡 The Solution — Three Principles

### 1. CLAUDE.md is a MAP, not a Loader

Most people dump every rule into `CLAUDE.md`. That burns tokens on every message.

Instead, `CLAUDE.md` should be a **tiny index** that tells the AI **where** things live. The AI only loads specific files **when the topic is relevant**.

```
❌ Old way: 6,000 tokens loaded every message
✅ New way: 200 tokens always + load-on-demand = ~700 tokens average
```

### 2. Three Tiers of Config

```
┌──────────────────────────────────────────┐
│  GLOBAL   ~/.ai/                         │   ← tiny, identity + integrations
│  • always.md (50 tokens)                 │
│  • integrations/ (obsidian, mem, graph)  │
├──────────────────────────────────────────┤
│  PROJECT  project/.ai/                   │   ← project-specific skills/rules
│  • skills/  agents/  rules/  commands/   │
│  • .skill-lock.json                      │
├──────────────────────────────────────────┤
│  SPECS    project/docs/spec/             │   ← hierarchical, page-by-page
│  • SPEC.md (root, always load)           │
│  • auth/SPEC.md      (load on demand)    │
│  • inventory/SPEC.md (load on demand)    │
└──────────────────────────────────────────┘
```

### 3. Obsidian for Humans, `.ai/` for AI

- **Obsidian vault** = your human-readable second brain (you read, edit, browse)
- **`.ai/` folders** = AI-readable instructions (AI reads, never browses)
- They sync via [claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) with a `.raw/` folder for source docs and a `wiki/` folder for AI-managed notes
- **[claude-mem](https://github.com/thedotmack/claude-mem)** automatically captures session activity and injects relevant context into future sessions
- **[graphify](https://github.com/safishamsi/graphify)** (optional) turns large codebases into queryable knowledge graphs with 71x token reduction

---

## 🗂️ The Complete Architecture

```
~/                                  ← your home directory
├── .ai/                            ← GLOBAL config (laptop-wide)
│   ├── always.md                   ← ≤200 tokens, loads every message
│   └── integrations/
│       ├── obsidian.md             ← Obsidian vault path + structure
│       ├── claude-mem.md           ← session memory config
│       └── graphify.md             ← knowledge graph config (optional)
│
├── ai-brain/                       ← OBSIDIAN VAULT (your second brain)
│   ├── .raw/                       ← drop PDFs, docs, videos, screenshots
│   ├── wiki/                       ← auto-managed by claude-obsidian
│   │   ├── hot.md                  ← session cache (auto-loaded)
│   │   ├── index.md                ← master catalog
│   │   ├── concepts/               ← extracted ideas
│   │   ├── entities/               ← people, tools, companies
│   │   ├── projects/               ← YOUR PROJECTS INDEX HERE
│   │   │   ├── saas-inventory/
│   │   │   └── personal-ai-skills/
│   │   └── sources/                ← ingested from .raw/
│   └── .obsidian/
│
└── projects/
    └── my-saas-app/                ← PROJECT-LEVEL config
        ├── SPEC.md                 ← root spec, always load (~150 tokens)
        ├── CLAUDE.md               ← MAP (where things are)
        ├── AGENTS.md               ← (Copilot/Codex bridge)
        ├── .cursor/rules           ← (Cursor bridge)
        ├── .vscode/settings.json   ← (VS Code bridge, merged)
        ├── GEMINI.md               ← (Gemini bridge)
        ├── .windsurfrules          ← (Windsurf bridge)
        │
        ├── .ai/                    ← project skills/rules
        │   ├── skills/
        │   ├── agents/
        │   ├── rules/
        │   ├── commands/
        │   └── .skill-lock.json
        │
        └── docs/
            └── spec/               ← HIERARCHICAL SPECS
                ├── auth/SPEC.md    ← load when working on auth
                ├── inventory/SPEC.md
                └── billing/SPEC.md
```

---

## 🚀 Quick Start

### 1. Install Globally (one-time setup)

```bash
# Install the CLI globally
npm install -g personal-ai-skills

# Create your global ~/.ai/ config
personal-ai-skills init --global

# Install the memory stack
npx claude-mem install                              # session memory
git clone https://github.com/AgriciDaniel/claude-obsidian ~/ai-brain
cd ~/ai-brain && bash bin/setup-vault.sh            # Obsidian vault
pip install graphifyy && graphify install           # optional graph layer
```

### 2. Per-Project Setup (30 seconds)

```bash
cd my-project
personal-ai-skills

# Interactive wizard asks:
# 1. Which categories? (skills, agents, rules, commands, prompts)
# 2. Which specific items? (multi-select)
# 3. Which AI assistants should get bridge files? (NEW!)
#    ◯ Claude Code       ◯ Cursor        ◯ VS Code
#    ◯ GitHub Copilot    ◯ Codex         ◯ Gemini
#    ◯ Windsurf          ◉ All of above  ◯ None
# 4. Create SPEC.md? (Y/n)

# Done!
```

### 3. Daily Use — Add a Feature

```bash
# Create a spec for a new feature area
personal-ai-skills init spec auth

# Now when you open your AI assistant:
# - Always loads: SPEC.md (150 tokens) + always.md (50 tokens)
# - You say "working on auth"
# - AI auto-loads docs/spec/auth/SPEC.md (200 tokens)
# - Total context: ~400 tokens instead of 6,000
```

---

## 📊 Token Budget — Why This Matters

Every token you load costs money AND slows down responses. Here's the math:

| Approach                       | Tokens/message | Cost per 1M msgs |
| ------------------------------ | -------------- | ---------------- |
| ❌ Dump all rules in CLAUDE.md | ~6,000         | $$$$             |
| 🟡 Per-project skills only     | ~500           | $$               |
| ✅ Map pattern + smart loading | ~700           | $                |
| 🏆 + prompt caching (Claude)   | ~70 effective  | ¢                |

**10x–85x cost savings** just from using the map pattern instead of bulk loading.

---

## 🧠 The Memory Stack (3 tools, zero overlap)

Your "second brain" is **three tools working together** — they solve different problems:

### 1. claude-obsidian — Your Knowledge Base

**What:** Persistent Obsidian vault that auto-organizes everything you read.

**Why:** You drop PDFs, articles, screenshots, videos into `.raw/`. Claude extracts concepts, entities, cross-references, and files them into `wiki/`. The graph view shows how everything connects.

**When:** Always-on. This is your long-term knowledge.

```bash
/wiki           # bootstrap or continue
ingest [file]   # read a source, create wiki pages
/save           # save current conversation as a wiki note
/autoresearch   # autonomous 3-round web research
```

### 2. claude-mem — Your Session Memory

**What:** Captures everything you did in a Claude Code session, compresses it, injects relevant bits into future sessions.

**Why:** Stop explaining your project context at the start of every conversation. The AI picks up where you left off.

**When:** Always-on. Zero manual work.

```bash
# install once, forget about it
npx claude-mem install
```

### 3. graphify — Your Code/Docs Graph (optional)

**What:** Turns any folder (code, docs, papers, images, video) into a queryable knowledge graph. 71x fewer tokens per query vs reading raw files.

**Why:** On large codebases or research corpora, even the map pattern isn't enough. The graph gives the AI a structural overview before it searches.

**When:** On-demand. Run `/graphify .` when starting a new codebase exploration.

```bash
/graphify .                    # build graph
/graphify query "auth flow?"   # query the graph
/graphify --obsidian           # export to Obsidian
```

---

## 📖 Deep Dive: Why Each Piece Exists

### Why `CLAUDE.md` as a Map (not a Loader)?

When an AI assistant opens a project, it reads `CLAUDE.md` **every single message**. If you put 50 rules there, you pay for 50 rules × number of messages.

Instead, `CLAUDE.md` should tell the AI:

> "Your rules live in `.ai/rules/`. Your skills live in `.ai/skills/`. Your project spec is `SPEC.md`. Load each of these **only when relevant**."

The AI is smart enough to follow this. It will read `.ai/skills/modern-react/SKILL.md` when you edit a `.tsx` file, and skip it when you edit a `.py` file. You save tokens on every message.

### Why Hierarchical `SPEC.md`?

A real SaaS app has 10+ feature areas (auth, billing, dashboard, settings, reports, admin, API, webhooks, notifications, search...). If you dump ALL of them in one spec, the AI loads 5,000 tokens of irrelevant context when you're working on billing.

**Hierarchical specs solve this:**

- Root `SPEC.md` = 150 tokens, always loaded (what the app IS)
- `docs/spec/billing/SPEC.md` = 200 tokens, loaded only when working on billing

The AI navigates by the root spec's **spec map**, which is a simple table of "topic → file path".

### Why Three Tiers (Global / Project / Specs)?

- **Global** = your identity, never changes (50 tokens always)
- **Project** = what this codebase is (150 tokens always)
- **Specs** = what this feature is (200 tokens on demand)

Each tier has a different lifecycle and a different loading strategy. Mixing them means you either lose per-project nuance (too global) or repeat yourself constantly (too local).

### Why Make Bridges Optional?

Not everyone uses every tool. If you only use Claude Code + Cursor, you don't want `GEMINI.md` and `.windsurfrules` cluttering your repo. The interactive prompt lets you pick exactly which bridges to generate.

### Why Obsidian Instead of Just More `.md` Files?

`.md` files are fine for AI. But YOU need to:

- Search your notes
- See how concepts connect (graph view)
- Embed images, PDFs, videos
- Version-control your knowledge

Obsidian gives you all of that **while remaining plain Markdown**, so the AI can still read everything. The `claude-obsidian` pattern adds auto-organization so your vault doesn't become a dump of random files.

### Why claude-mem for Session Memory?

Even with perfect config, the AI forgets conversations. You solved a tricky bug yesterday — today the AI has no idea. claude-mem captures the tool calls, generates summaries, and injects the relevant ones when you start a new session. It's the memory layer that makes everything else feel continuous.

### Why graphify is Optional?

For small projects (< 20 files), you don't need a graph — the AI can just read files directly. For large codebases (50+ files), grep is slow and burns tokens. graphify precomputes a structural map so the AI navigates by architecture instead of file search.

---

## 🎓 The Commands You'll Actually Use

### Project Setup

```bash
# Interactive install (new project)
personal-ai-skills

# Install specific items
personal-ai-skills add clean-code modern-react

# Pick bridges explicitly
personal-ai-skills add clean-code --bridges claude,cursor,vscode
personal-ai-skills add clean-code --bridges all
personal-ai-skills add clean-code --bridges none    # skills only, no bridges

# Install everything, non-interactive (for CI)
personal-ai-skills add --all --yes
```

### SPEC Management

```bash
# Create root SPEC.md
personal-ai-skills init spec

# Create page-level specs (auto-updates root map)
personal-ai-skills init spec auth
personal-ai-skills init spec inventory
personal-ai-skills init spec billing
```

### Skills Management

```bash
# List what's available and what's installed
personal-ai-skills list
personal-ai-skills list --installed

# Search
personal-ai-skills search react

# Update installed items
personal-ai-skills update

# Remove items
personal-ai-skills remove clean-code
```

### Bridge Management

```bash
# Regenerate bridges (after adding/removing skills)
personal-ai-skills bridge

# Regenerate only specific bridges
personal-ai-skills bridge --bridges vscode,claude
```

### Global Config

```bash
# Install to ~/.ai/ (personal defaults for all projects)
personal-ai-skills add clean-typescript -g

# Sync global config from your GitHub repo
personal-ai-skills sync
```

### Web Viewer

```bash
# Browse the catalog with interactive UI
personal-ai-skills serve
```

---

## 🛠️ Content Catalog

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

### Rules (6), Commands (8), Prompts (5)

See [full catalog](https://personal-ai-skills.dev/explore) in the web viewer.

---

## 🌉 Supported AI Assistants

| Assistant          | Bridge File                                     | Auto-generated | Format                 |
| ------------------ | ----------------------------------------------- | -------------- | ---------------------- |
| **Claude Code**    | `CLAUDE.md`                                     | ✅             | Markdown (map pattern) |
| **Cursor**         | `.cursor/rules/ai-config.mdc`                   | ✅             | MDC with always-apply  |
| **VS Code**        | `.vscode/settings.json`                         | ✅ (merged)    | JSON settings          |
| **GitHub Copilot** | `AGENTS.md` + `.github/copilot-instructions.md` | ✅             | Markdown               |
| **OpenAI Codex**   | `AGENTS.md`                                     | ✅             | Markdown               |
| **Gemini CLI**     | `GEMINI.md`                                     | ✅             | Markdown               |
| **Windsurf**       | `.windsurfrules`                                | ✅             | Plain text             |

All bridges are **optional** — pick the ones you actually use.

---

## 🔌 Integrations

### [claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) — Your Second Brain

```bash
git clone https://github.com/AgriciDaniel/claude-obsidian ~/ai-brain
cd ~/ai-brain && bash bin/setup-vault.sh
```

Your global vault at `~/ai-brain/` becomes the shared knowledge base for every project.

### [claude-mem](https://github.com/thedotmack/claude-mem) — Session Memory

```bash
npx claude-mem install
```

Automatic session-to-session memory. Zero config needed.

### [graphify](https://github.com/safishamsi/graphify) — Knowledge Graphs

```bash
pip install graphifyy
graphify install         # Claude Code
graphify cursor install  # Cursor
graphify gemini install  # Gemini CLI
```

On-demand knowledge graph for large codebases.

---

## 📚 Example: A Full Project Setup

Here's what a production SaaS project looks like with everything configured:

```bash
# Start a new project
npx create-next-app my-saas
cd my-saas

# Install AI config
personal-ai-skills
# ✓ Install: clean-typescript, modern-nextjs, api-design, testing-best-practices
# ✓ Bridges: Claude Code, Cursor, VS Code (I don't use Copilot)
# ✓ Create SPEC.md: Yes

# Create feature specs
personal-ai-skills init spec auth
personal-ai-skills init spec billing
personal-ai-skills init spec dashboard

# Link to Obsidian
echo "obsidian_project: ~/ai-brain/wiki/projects/my-saas/" >> .ai/config

# Done. Your project has:
# ✓ SPEC.md (root, always load)
# ✓ docs/spec/{auth,billing,dashboard}/SPEC.md
# ✓ .ai/ with 4 skills + rules
# ✓ CLAUDE.md, .cursor/rules, .vscode/settings.json (the bridges I use)
# ✓ Obsidian vault linked for long-term notes
# ✓ claude-mem auto-remembers sessions
```

Open Claude Code:

```
You: "Let's add 2FA to the auth system"

Claude auto-loads:
  ✓ always.md              (50 tokens — global identity)
  ✓ SPEC.md                (150 tokens — what the app is)
  ✓ docs/spec/auth/SPEC.md (200 tokens — auth-specific)
  ✓ .ai/skills/modern-nextjs  (300 tokens — React/Next patterns)
  ✓ claude-mem context     (auto-injected — what you did yesterday)

Total: ~800 tokens instead of 8,000
Cost: ~$0.002 instead of $0.024
```

---

## 🏗️ Project Structure

```
personal-ai-skills/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── types.ts            # Central types
│   ├── agents.ts           # AI assistant registry
│   ├── catalog.ts          # Template loading
│   ├── install.ts          # Install to .ai/
│   ├── lock.ts             # .skill-lock.json management
│   ├── bridge.ts           # Bridge file generation (all assistants)
│   ├── prompts.ts          # Interactive CLI (@clack/prompts)
│   ├── github.ts           # GitHub/URL/local source fetching
│   └── spec.ts             # SPEC.md scaffolding (NEW)
├── templates/
│   ├── skills/             # 18 built-in skills
│   ├── agents/             # 8 specialized agents
│   ├── commands/           # 8 command templates
│   ├── rules/              # 6 coding rules
│   ├── prompts/            # 5 prompt templates
│   ├── stacks/             # Stack configs
│   ├── shared/             # SPEC.root, SPEC.page, CLAUDE.md map (NEW)
│   ├── global/             # always.md (NEW)
│   └── integrations/       # obsidian, claude-mem, graphify (NEW)
├── web/                    # React web viewer
└── test/                   # Vitest test suite
```

---

## 🤝 Development

```bash
git clone https://github.com/daniel-heydari-dev/personal-ai-skills.git
cd personal-ai-skills
pnpm install
pnpm dev          # run CLI from source
pnpm test         # run tests
pnpm typecheck    # type-check
pnpm build        # build for publish

# Web viewer
cd web && pnpm dev
```

---

## 🧭 FAQ

### Why not just use Obsidian for everything?

Obsidian is for **humans** — you read it, edit it, browse it. AI can read it too, but Obsidian's plugin system and UI are built for people. `.ai/` files are for **AI** — they're structured, versioned, and optimized for prompt engineering. Both coexist.

### What if a skill and my SPEC conflict?

SPEC wins. Skills are generic best practices. SPEC is project-specific reality. If your project uses class components on purpose, the SPEC overrides the `modern-react` skill.

### Do I need ALL three memory tools (claude-obsidian, claude-mem, graphify)?

- **claude-mem**: Start here. Zero config, instant benefit.
- **claude-obsidian**: Add when you want a long-term knowledge base.
- **graphify**: Add only for large codebases (50+ files).

### Can I use this without any bridges?

Yes. `--bridges none` installs skills to `.ai/` without generating any bridge files. You can then manually reference `.ai/` in whatever AI tool you use.

### How do I commit this to git?

Commit everything:

- `.ai/` — skills, rules, agents
- `SPEC.md` + `docs/spec/` — project specs
- Bridge files (`CLAUDE.md`, `AGENTS.md`, etc.) — team-wide consistency

Do **NOT** commit:

- `~/.ai/` — that's global, personal
- `~/ai-brain/` — that's your personal Obsidian vault
- `.claude-mem/` data — personal session history

### Project scope vs global?

| Scope                 | Location          | When to use                           |
| --------------------- | ----------------- | ------------------------------------- |
| **Project** (default) | `.ai/` in project | Team-shared, committed to git         |
| **Global** (`-g`)     | `~/.ai/` in home  | Personal defaults across all projects |

---

## 📜 License

MIT

---

## 🙏 Credits

Built on the shoulders of:

- [claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) by Agrici Daniel
- [claude-mem](https://github.com/thedotmack/claude-mem) by Alex Newman
- [graphify](https://github.com/safishamsi/graphify) by Safi Shamsi
- [skills.sh](https://skills.sh) ecosystem by Vercel Labs
- [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

---

**Made with ❤️ for developers who refuse to repeat themselves.**

---
tags: [reference, skills, agents, personal-ai-skills]
---

# Skills & Agents Catalog

> Full list of available content in personal-ai-skills. Install any of these with `npx personal-ai-skills add`.

---

## Skills

Skills are domain expertise rules. The AI loads them on demand based on the task. Each skill lives in `.ai/skills/<name>/SKILL.md`.

### Code Quality

| Skill | Install Name | Best For |
|---|---|---|
| Clean Code | `clean-code` | Naming, readability, SOLID principles, avoiding bloat |
| Clean TypeScript | `clean-typescript` | Strict TS, no `any`, utility types, discriminated unions |
| Error Handling | `error-handling` | Result types, typed errors, never swallow exceptions |
| Refactoring | `refactoring-ui` | UI-specific refactor patterns |
| SOLID Principles | `solid-principles` | OOP design, single responsibility, dependency inversion |

### Backend & Node.js

| Skill | Install Name | Best For |
|---|---|---|
| Node.js Backend | `node-backend` | Node/ESM patterns, async, streams, CLI tools |
| API Design | `api-design` | REST conventions, versioning, error responses |
| Performance | `performance` | Profiling, async batching, memory management |
| Web Security | `web-security` | OWASP, input validation, auth patterns |
| Systematic Debugging | `systematic-debugging` | Root cause analysis, bisecting, reproduction |

### Frontend & UI

| Skill | Install Name | Best For |
|---|---|---|
| Modern React | `modern-react` | Hooks, RSC, concurrent features |
| Modern Next.js | `modern-nextjs` | App router, server actions, streaming |
| Frontend Design | `frontend-design` | Component design, layout, accessibility |
| UX/UI Pro | `uiux-pro` | Design system thinking, Figma handoff |
| Accessibility | `accessibility` | WCAG, ARIA, keyboard navigation |
| UX Heuristics | `ux-heuristics` | Nielsen's 10 heuristics applied to code |
| Interface Design | `interface-design` | Visual hierarchy, information density |

### Workflow & Documentation

| Skill | Install Name | Best For |
|---|---|---|
| Git Workflow | `git-workflow` | Commit messages, branching, PR descriptions |
| Documentation | `documentation` | JSDoc, README, inline comments (when and how) |
| Changelog Generation | `changelog-generation` | Semantic changelog from git history |
| Context Engineering | `context-engineering` | Writing better AI prompts, CLAUDE.md design |
| Brainstorming | `brainstorming` | Structured idea generation, trade-off analysis |

### Specialized

| Skill | Install Name | Best For |
|---|---|---|
| SEO | `seo` | Meta tags, structured data, Core Web Vitals |
| Marketing | `marketing` | Copywriting, positioning, landing pages |
| iOS HIG | `ios-hig` | Apple Human Interface Guidelines for native apps |
| Canvas Design | `canvas-design` | Creative canvas-based UI patterns |
| Algorithmic Art | `algorithmic-art` | Generative graphics, WebGL, p5.js |
| Hooked UX | `hooked-ux` | Nir Eyal's Hook Model for engagement design |
| Design Sprint | `design-sprint` | 5-day sprint methodology applied to feature work |
| Superpowers | `superpowers` | Unconventional shortcuts and power-user techniques |
| Brand Guidelines | `brand-guidelines` | Design tokens, brand voice, consistency rules |
| Web Artifacts Builder | `web-artifacts-builder` | Self-contained HTML artifacts Claude can render |
| Theme Factory | `theme-factory` | Dark/light mode, design token systems |
| Skill Creator | `skill-creator` | Meta — creates new SKILL.md files |

---

## Rules

Rules are hard constraints, always loaded into CLAUDE.md/AGENTS.md as `@.ai/rules/<name>/RULE.md`. Each lives in `.ai/rules/<name>/RULE.md`. Install with `npx personal-ai-skills add <name> -t rules`.

| Rule | Install Name | Best For |
|---|---|---|
| Small Components | `small-components` | UI line limits, refactor-on-touch, when to split big components |
| Accessibility Required | `accessibility-required` | Force WCAG 2.1 AA on every UI component |
| Error Boundaries | `error-boundaries` | Require React error boundaries around feature trees |
| Import Order | `import-order` | Consistent import grouping (external → internal → relative) |
| No Console | `no-console` | Disallow `console.log` in production code |
| React Patterns | `react-patterns` | Function components, composition, no class components |
| TypeScript Strict | `typescript-strict` | No `any`, no `@ts-ignore`, strict null checks |

## Agents

Agents are specialized AI personas. Activate them by name: "Act as code-reviewer — review this PR."
Each agent lives in `.ai/agents/<name>/AGENT.md`.

| Agent | Install Name | Role |
|---|---|---|
| Code Reviewer | `code-reviewer` | Thorough PR reviews — correctness, security, style |
| Refactor Expert | `refactor-expert` | Structural improvements, extract patterns, reduce duplication |
| Test Writer | `test-writer` | Generates full test suites from source code |
| Architect | `architect` | System design, trade-off analysis, ADR writing |
| Performance Optimizer | `performance-optimizer` | Profiling, bottleneck identification, optimization |
| Security Auditor | `security-auditor` | OWASP audit, dependency scanning, threat modeling |
| Migration Helper | `migration-helper` | Major version upgrades, framework migrations |
| Docs Explorer | `docs-explorer` | Reads docs, synthesizes patterns, writes usage examples |

---

## Integrations

Integrations install memory and knowledge tools into your workflow.

| Integration | What It Does | Setup After Install |
|---|---|---|
| **claude-obsidian** | Vault structure for AI second brain — notes, wiki, hot context | `git clone https://github.com/AgriciDaniel/claude-obsidian ~/ai-brain` |
| **claude-mem** | Session memory hook for Claude Code — auto-logs summaries to Obsidian | `npx claude-mem install` |
| **graphify** | Knowledge graph from codebase — 71x token reduction. Python 3.10+ required. | `pip3 install graphifyy && graphify install` |

---

## Which Skills for Which Project Type?

### TypeScript CLI / Node.js tool
```
clean-typescript, node-backend, clean-code, testing-best-practices, git-workflow, documentation
agents: code-reviewer, test-writer
```

### Next.js App
```
modern-nextjs, modern-react, clean-typescript, frontend-design, api-design, testing-best-practices
agents: code-reviewer, refactor-expert
```

### API / Backend Service
```
api-design, node-backend, clean-typescript, web-security, performance, error-handling
agents: security-auditor, performance-optimizer, architect
```

### Design System / Component Library
```
modern-react, uiux-pro, accessibility, frontend-design, clean-typescript, documentation
agents: code-reviewer, refactor-expert
```

### Any Project (Baseline)
```
clean-code, git-workflow, documentation, testing-best-practices
agents: code-reviewer
```

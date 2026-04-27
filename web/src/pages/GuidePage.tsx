import { Link } from "react-router-dom";
import {
  ClaudeIcon,
  CopilotIcon,
  CursorIcon,
  WindsurfIcon,
  GeminiIcon,
  CodexIcon,
} from "../components/BrandIcons";
import styles from "./GuidePage.module.css";

const workflowSteps = [
  {
    num: 1,
    title: "Create SPEC.md (three-tier)",
    icon: "📋",
    color: "#8b5cf6",
    desc: "Scaffold your project spec with the three-tier architecture. The SPEC.md root file is always loaded (~150 tokens). Feature specs in docs/spec/*/ are loaded on demand — keeping your total always-load budget under 1,100 tokens.",
    details: [
      "npx personal-ai-skills init spec  →  creates SPEC.md + CLAUDE.md ready to use",
      "npx personal-ai-skills init spec auth  →  creates docs/spec/auth/SPEC.md",
      "Root SPEC.md Spec Map table auto-updates each time you add a sub-spec",
      "Three tiers: ~/.ai/ global identity · .ai/ project · docs/spec/ feature specs",
    ],
    prompt: `# Three-tier layout
# ─────────────────────────────────────────────
# GLOBAL   ~/.ai/           ← identity, integrations (~50 tokens)
# PROJECT  .ai/             ← skills, rules, agents (loaded on demand)
# SPECS    docs/spec/*/     ← page-by-page context (loaded when relevant)

# 1. Scaffold root spec (creates SPEC.md with Spec Map table)
npx personal-ai-skills init spec

# 2. Add a feature spec (auto-appends a row to SPEC.md Spec Map)
npx personal-ai-skills init spec auth
npx personal-ai-skills init spec billing
npx personal-ai-skills init spec dashboard

# Result: always-load budget ~700–1,100 tokens
# (vs ~6,000 tokens with the old content-dump approach)`,
    promptLabel: "init spec workflow",
  },
  {
    num: 2,
    title: "Refine SPEC.md with AI",
    icon: "✨",
    color: "#22d3ee",
    desc: "Paste your project description into any AI and ask it to return a structured technical spec. Copy the result back into SPEC.md. Your spec is the single source of truth for every AI session.",
    details: [
      "Paste your project idea to Claude, ChatGPT, or Gemini",
      "AI returns a full technical spec document",
      "Copy the result into your SPEC.md file",
      'Ask: "Format this as proper markdown with these sections:"',
    ],
    prompt: `We are building an app described in @SPEC.md.
Please improve the specification and format
this file as proper markdown.

Include sections for:
- Overview & Goals
- Tech Stack & Architecture
- Database Schema
- API Endpoints
- UI/UX Flow
- Authentication Flow`,
    promptLabel: "Refinement prompt",
  },
  {
    num: 3,
    title: "Install Skills & Memory Tools",
    icon: "⚡",
    color: "#e879f9",
    desc: "Run the interactive wizard — it walks you through 4 steps: memory stack, content to install, project setup, and bridge files. At the end it generates a prompt you paste into your AI assistant.",
    details: [
      "Step 1 — Memory Stack: vault path + claude-mem + graphify (optional, needs Python 3.10+)",
      "Step 2 — Content: pick skills, agents, rules to install into .ai/",
      "Step 3 — Project setup: name, description, tech stack → creates SPEC.md",
      "Step 4 — Bridge files: which IDEs you use → generates CLAUDE.md, .cursor/rules, etc.",
    ],
    prompt: `npx personal-ai-skills

# Step 1 of 4 — Memory Stack
# ◇  Where is your Obsidian vault (second brain)?
# │  ~/ai-brain
# ◇  Set up memory tools (select any — or press Enter to skip):
# │  ◼ claude-obsidian   second brain vault — notes, wiki, project context
# │  ◼ claude-mem        session memory — installs as a Claude Code hook
# │  ◻ graphify (optional, requires Python 3.10+)

# Step 2 of 4 — Install Content
# ◇  What do you want to install?
# │  ◼ Skills   ◼ Agents   ◻ Commands   ◻ Rules   ◻ Prompts

# Step 3 of 4 — Project Setup
# ◇  Project name?   my-app
# ◇  One-line description?   ...
# ◇  Tech stack?   TypeScript, Node.js, React

# Step 4 of 4 — Bridge Files
# ◇  Which IDEs do you use?
# │  ◼ Claude Code   ◼ Visual Studio Code   ◻ Cursor   ◻ Windsurf

# ✅ Setup complete!
# 📄 AI context saved to: .ai/AI-CONTEXT.md
# 👇 Paste the generated prompt into your AI assistant to connect everything`,
    promptLabel: "4-step interactive wizard",
  },
  {
    num: 4,
    title: "Configure Your AI (map pattern)",
    icon: "⚙️",
    color: "#34d399",
    desc: "The wizard generates CLAUDE.md as a MAP — a tiny index under 200 tokens. The AI loads only what it needs per task. VS Code bridge merges Copilot settings without overwriting your existing config.",
    details: [
      "npx personal-ai-skills bridge  →  regenerate bridge files any time",
      "--bridges claude,vscode  →  specific editors only",
      "--bridges none  →  skip bridge generation entirely",
      "VS Code bridge merges Copilot keys into .vscode/settings.json safely",
    ],
    prompt: `# Generated CLAUDE.md (map pattern — < 200 tokens always-load)
# ─────────────────────────────────────────────

## ⚡ Always Load
- Root spec: SPEC.md — what this project is, stack, key rules

## 🗺️ Skills Map  (load only when relevant)
| Skill | Load |
| --- | --- |
| Node.js, CLI | .ai/skills/node-backend/ |
| TypeScript   | .ai/skills/clean-typescript/ |
| Testing      | .ai/skills/testing-best-practices/ |

## 🗺️ Agents Map
| Agent | Load |
| --- | --- |
| code-reviewer  | .ai/agents/code-reviewer/ |
| refactor-expert | .ai/agents/refactor-expert/ |

## 🧠 Memory
claude-mem runs automatically — past session context already injected.`,
    promptLabel: "Generated CLAUDE.md (map pattern)",
  },
  {
    num: 5,
    title: "Set Up MCP Tools",
    icon: "🔌",
    color: "#fb923c",
    desc: "Connect documentation tools like Context7 so your AI looks up real, up-to-date library docs instead of relying on potentially outdated training data.",
    details: [
      "Install Context7 MCP at context7.com",
      "AI auto-fetches live docs for any library or framework",
      "No more hallucinated APIs or outdated function signatures",
      "Add a rule: always use Context7 for docs — put it in CLAUDE.md",
    ],
    prompt: `# Add to CLAUDE.md → ALWAYS LOAD section:

Always use Context7 MCP when looking up
library docs, API references, or configuration.

# Then in any session you can say:
"Use Context7 to look up the latest
better-auth and TipTap APIs."

# Or add it to a skill file so it applies
# automatically for that technology:
## Rules
- Use Context7 MCP before generating any
  library-specific code`,
    promptLabel: "MCP configuration",
  },
  {
    num: 6,
    title: "Create Subagents",
    icon: "🤖",
    color: "#f472b6",
    desc: "Build specialized sub-agents for repeatable tasks — docs lookup, testing, code review — that run in isolated context and return results to the main session.",
    details: [
      "Subagent = a helper agent focused on one task",
      "Runs in its own context window, returns results to main session",
      "Example: DocsExplorer fetches live library docs in parallel",
      "Install from catalog: npx personal-ai-skills add docs-explorer --type agent",
    ],
    prompt: `# .ai/agents/DocsExplorer/AGENT.md
---
name: DocsExplorer
description: Documentation lookup specialist. Use when
  the user asks about library APIs or framework docs.
tools: WebFetch, WebSearch, MCPSearch
model: sonnet
---

You are a documentation specialist.
Fetch up-to-date docs for any library.

## Strategy
1. Use Context7 MCP as primary source
2. Fall back to web search if needed
3. Try llms.txt paths for LLM-friendly docs
4. Execute ALL lookups in parallel for speed`,
    promptLabel: "Example subagent definition",
  },
  {
    num: 7,
    title: "Build & Iterate",
    icon: "🔄",
    color: "#60a5fa",
    desc: "Start building. Reference SPEC.md in every major prompt so the AI always has full context. After each feature, ask the AI to update SPEC.md — it's your living documentation.",
    details: [
      'Start every session: "We\'re building @SPEC.md"',
      "After each feature: ask AI to update SPEC.md to reflect changes",
      "Use subagents for docs lookup and code validation",
      "Evaluate against SPEC.md + official docs — not AI memory",
    ],
    prompt: `We're building @SPEC.md.
Please evaluate the existing codebase to check
whether auth and database access are implemented
correctly per SPEC.md and official documentation.
Use Context7 MCP to look up current docs.

# After completing a feature, keep SPEC.md current:
"Please update @SPEC.md to reflect
the auth feature we just built."

# Reference a specific page spec when working on it:
"We're building the billing page per
@docs/spec/billing/SPEC.md."`,
    promptLabel: "Iterative development prompts",
  },
  {
    num: 8,
    title: "Create Custom Commands",
    icon: "⌘",
    color: "#fbbf24",
    desc: "Save prompts you type repeatedly as reusable command files. Use $ARGUMENTS for dynamic input — invoke with a slash shortcut instead of re-typing the full prompt every time.",
    details: [
      "Commands are prompt templates saved as .md files in .ai/commands/ or .claude/commands/",
      "Use $ARGUMENTS to pass dynamic values like mode, scope, or a filename",
      "Invoke with: /command-name ARGS  (e.g. /code-review SECURITY)",
      "Modes can be combined: /code-review BUGS, SECURITY",
    ],
    prompt: `# .ai/commands/code-review.md
---
allowed-tools: Read (*)
description: Perform a targeted code review
---
Mode: $ARGUMENTS

Adjust the review based on Mode:
- BUGS       → Focus on logical bugs only
- SECURITY   → Focus on security issues only
- PERFORMANCE→ Focus on performance only

Modes can be combined: "BUGS, SECURITY"
If Mode is empty → full general review.

Perform an in-depth review of the codebase.
Explore file-by-file. Create a detailed report.

# Usage examples:
# /code-review BUGS
# /code-review SECURITY
# /code-review BUGS, PERFORMANCE
# /code-review`,
    promptLabel: "Example command file",
  },
];

const conceptCards = [
  {
    icon: "🏗️",
    title: "Three-Tier Config",
    desc: "Global ~/.ai/ (identity, ~50 tokens) → Project .ai/ (skills, rules, agents) → Specs docs/spec/ (feature-by-feature). Load only what's relevant to the current task.",
    color: "#8b5cf6",
  },
  {
    icon: "🗺️",
    title: "Map Pattern",
    desc: "CLAUDE.md is a tiny index — under 200 tokens always-load. It tells the AI where files live. The AI fetches specific skill or spec files only when the task matches.",
    color: "#34d399",
  },
  {
    icon: "🔌",
    title: "MCP Tools",
    desc: "Context7 and other MCPs give AI access to real, live documentation — no more hallucinated APIs or outdated function signatures.",
    color: "#fb923c",
  },
  {
    icon: "🧠",
    title: "Memory Stack",
    desc: "Obsidian as persistent second brain, claude-mem for session-to-session memory (~10x token savings), graphify for large codebase exploration (71x token reduction).",
    color: "#f472b6",
  },
];

const aiConfigFiles: {
  assistant: string;
  file: string;
  icon: React.ReactNode;
  note?: string;
}[] = [
  { assistant: "Claude Code", file: "CLAUDE.md", icon: <ClaudeIcon />, note: "map pattern — < 200 tokens always-load" },
  { assistant: "GitHub Copilot", file: "AGENTS.md + .github/copilot-instructions.md", icon: <CopilotIcon /> },
  { assistant: "VS Code", file: ".vscode/settings.json", icon: <CopilotIcon />, note: "JSON merge — never overwrites existing keys" },
  { assistant: "Cursor", file: ".cursor/rules/", icon: <CursorIcon /> },
  { assistant: "Windsurf", file: ".windsurfrules", icon: <WindsurfIcon /> },
  { assistant: "Gemini CLI", file: "GEMINI.md", icon: <GeminiIcon /> },
  { assistant: "Codex", file: "AGENTS.md", icon: <CodexIcon /> },
];

export function GuidePage() {
  return (
    <div className={styles.guide}>
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Prompt & Context Engineering
        </span>
        <h1 className={styles.heroTitle}>
          How to Work with{" "}
          <span className={styles.heroAccent}>AI Assistants</span>
        </h1>
        <p className={styles.heroSub}>
          Good input = good results. This guide shows the exact workflow to set
          up any project for AI-assisted development — from scaffolding a spec
          to building with subagents and persistent memory.
        </p>
      </section>

      {/* Core concept */}
      <section className={styles.equation}>
        <div
          className={styles.eqBox}
          style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}
        >
          <span className={styles.eqIcon}>📝</span>
          <span className={styles.eqLabel}>Specific Instructions</span>
          <span className={styles.eqSub}>SPEC.md + Skills + Rules</span>
        </div>
        <span className={styles.eqPlus}>+</span>
        <div
          className={styles.eqBox}
          style={{ borderColor: "rgba(34, 211, 238, 0.3)" }}
        >
          <span className={styles.eqIcon}>📚</span>
          <span className={styles.eqLabel}>Relevant Context</span>
          <span className={styles.eqSub}>MCP Tools + Memory Stack</span>
        </div>
        <span className={styles.eqEquals}>=</span>
        <div
          className={styles.eqBox}
          style={{ borderColor: "rgba(52, 211, 153, 0.3)" }}
        >
          <span className={styles.eqIcon}>🚀</span>
          <span className={styles.eqLabel}>Great Results</span>
          <span className={styles.eqSub}>Accurate, consistent output</span>
        </div>
      </section>

      {/* Concept Cards */}
      <section className={styles.concepts}>
        <h2 className={styles.sectionTitle}>The Four Pillars</h2>
        <div className={styles.conceptGrid}>
          {conceptCards.map((c) => (
            <div
              key={c.title}
              className={styles.conceptCard}
              style={{ "--card-accent": c.color } as React.CSSProperties}
            >
              <span className={styles.conceptIcon}>{c.icon}</span>
              <h3 className={styles.conceptTitle}>{c.title}</h3>
              <p className={styles.conceptDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture diagram */}
      <section className={styles.deepDive}>
        <div className={styles.deepDiveHeader}>
          <span className={styles.deepDiveIcon}>🗂️</span>
          <div>
            <h2 className={styles.deepDiveTitle}>The Complete Architecture</h2>
            <p className={styles.deepDiveSub}>
              Three tiers of config — each with its own lifetime and loading
              strategy. The AI only loads what's relevant to the current task.
            </p>
          </div>
        </div>

        <div className={styles.codeBlock} style={{ marginBottom: "2rem" }}>
          <span className={styles.codeLabel}>Full directory layout</span>
          <pre className={styles.codePre}>
            <code>{`<your-brain-path>/                      ← One location, you provide the path
├── config/                             ← identity + integrations
│   ├── always.md                       ← ~50 tokens, every message
│   └── integrations/                   ← obsidian, mem, graphify
│       ├── obsidian.md
│       ├── claude-mem.md
│       └── graphify.md
├── .raw/                               ← drop PDFs, docs, videos
│   └── projects/                       ← one folder per project
│       ├── personal-ai-skills/
│       ├── erp-pro-ui/
│       ├── erp-pro/
│       ├── auth-service/
│       └── shared/                     ← cross-project knowledge
│
├── wiki/                               ← claude-obsidian manages this
│   ├── hot.md                          ← session cache (auto)
│   ├── index.md                        ← master catalog
│   ├── concepts/                       ← extracted ideas
│   ├── entities/                       ← people, tools, companies
│   ├── sources/                        ← ingested from .raw/
│   └── projects/                       ← one folder per project
│       ├── personal-ai-skills/
│       │
│       ├── erp-pro-ui/
│       │   ├── index.md
│       │   ├── components.md           ← component catalog
│       │   ├── design-tokens.md        ← colors, spacing, typography
│       │   └── changelog.md            ← what changed, when
│       │
│       ├── erp-pro/
│       │   ├── index.md                ← project overview
│       │   ├── decisions.md            ← architecture decisions
│       │   ├── architecture.md         ← system design
│       │   ├── api-contracts.md        ← APIs this app CONSUMES
│       │   └── dependencies.md         ← links to ui-library + auth-service
│       │
│       ├── auth-service/
│       │   ├── index.md
│       │   ├── roles-matrix.md         ← who can do what
│       │   ├── api-contracts.md        ← APIs this app EXPOSES
│       │   └── flows.md                ← login, register, 2FA flows
│       │
│       └── shared/                     ← cross-project knowledge
│            ├── api-contracts.md       ← how all 3 apps talk to each other
│            ├── shared-types.md        ← TypeScript types used everywhere
│            ├── deployment.md          ← how to deploy the whole system
│            └── env-vars.md            ← environment variables across apps
└── graphify-out/                       ← knowledge graph (optional)


project/                                ← PER-PROJECT
├── .ai/                                ← skills, agents, rules
│   ├── skills/
│   ├── agents/
│   ├── rules/
│   └── .skill-lock.json
├── SPEC.md                             ← what the app IS (~150 tokens, always load)
├── docs/spec/                          ← page specs (~200 tokens, on demand)
│   ├── auth/SPEC.md                    ← only load when working on auth
│   ├── inventory/SPEC.md               ← only load when working on inventory
│   ├── billing/SPEC.md                 ← only load when working on billing
│   └── dashboard/SPEC.md
│
├── CLAUDE.md                           ← MAP (tiny index, not a dump)
├── AGENTS.md                           ← Copilot/Codex bridge
├── .cursor/rules/                      ← Cursor bridge
├── .vscode/settings.json               ← VS Code bridge (merged)
└── GEMINI.md                           ← Gemini bridge`}</code>
          </pre>
        </div>

        {/* Token breakdown */}
        <div className={styles.deepDiveWhat}>
          <h3 className={styles.deepDiveWhatTitle}>
            How Claude uses this — real token count
          </h3>
          <p className={styles.deepDiveWhatDesc}>
            Working on the inventory bulk-edit feature: Claude loads{" "}
            <strong>~430 tokens</strong> of precise context — not 6,000 tokens
            of everything. Here's exactly what gets loaded and when.
          </p>
          <div className={styles.codeBlock} style={{ marginTop: "1rem" }}>
            <span className={styles.codeLabel}>Token budget breakdown</span>
            <pre className={styles.codePre}>
              <code>{`Step 1  CLAUDE.md auto-loads           ~80 tokens   (maps, not content)
Step 2  SPEC.md always loads           ~150 tokens  (what the app is)
Step 3  You say: "working on inventory bulk edit"
Step 4  Claude reads Spec Map → loads:
        docs/spec/inventory/SPEC.md    ~200 tokens  (inventory context only)
                                      ──────────────────────────────────────
                          Total:       ~430 tokens  ✅

vs loading everything upfront:        ~6,000–8,000 tokens  ❌`}</code>
            </pre>
          </div>
        </div>

        {/* The four types */}
        <div className={styles.deepDiveExample} style={{ marginTop: "1.5rem" }}>
          <div className={styles.deepDiveExampleLabel}>
            <span>One rule to remember — four types of context</span>
          </div>
          <div className={styles.codeBlock}>
            <span className={styles.codeLabel}>What each file is for</span>
            <pre className={styles.codePre}>
              <code>{`Root SPEC.md   → what the app IS           always loaded,    ~150 tokens
Page SPEC.md   → what this feature DOES    on demand,        ~200 tokens
.ai/ skills    → how to CODE it            by file type,     ~300 tokens
Obsidian       → why decisions were made   you paste it,     ~400 tokens`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Step-by-step workflow */}
      <section className={styles.workflow}>
        <h2 className={styles.sectionTitle}>Step-by-Step Workflow</h2>
        <div className={styles.timeline}>
          {workflowSteps.map((step, i) => (
            <div
              key={step.num}
              className={styles.step}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={styles.stepConnector}>
                <span
                  className={styles.stepDot}
                  style={{ background: step.color }}
                >
                  {step.num}
                </span>
                {i < workflowSteps.length - 1 && (
                  <span className={styles.stepLine} />
                )}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>
                <p className={styles.stepDesc}>{step.desc}</p>
                <ul className={styles.stepDetails}>
                  {step.details.map((d, j) => (
                    <li key={j} className={styles.stepDetail}>
                      <span
                        className={styles.stepCheck}
                        style={{ color: step.color }}
                      >
                        →
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className={styles.codeBlock}>
                  <span className={styles.codeLabel}>{step.promptLabel}</span>
                  <pre className={styles.codePre}>
                    <code>{step.prompt}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Config reference table */}
      <section className={styles.configSection}>
        <h2 className={styles.sectionTitle}>AI Config Files by Assistant</h2>
        <p className={styles.configSub}>
          Each AI assistant reads a different config file.{" "}
          <strong>personal-ai-skills bridge</strong> generates all of these
          interactively — choose which editors to target. The VS Code bridge
          merges Copilot keys into existing settings rather than overwriting.
        </p>
        <div className={styles.configTable}>
          <div className={styles.configHeader}>
            <span>Assistant</span>
            <span>Config File</span>
          </div>
          {aiConfigFiles.map((c) => (
            <div key={c.assistant} className={styles.configRow}>
              <span className={styles.configAssistant}>
                <span className={styles.configIcon}>{c.icon}</span>
                {c.assistant}
              </span>
              <span className={styles.configFileGroup}>
                <code className={styles.configFile}>{c.file}</code>
                {c.note && (
                  <span className={styles.configNote}>{c.note}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive: Skills */}
      <section className={styles.deepDive}>
        <div className={styles.deepDiveHeader}>
          <span className={styles.deepDiveIcon}>⚡</span>
          <div>
            <h2 className={styles.deepDiveTitle}>Skills</h2>
            <p className={styles.deepDiveSub}>
              Extra context that's <strong>dynamically loaded</strong> —
              teaching your AI best practices for a specific technology so it
              writes better code than if you just asked.
            </p>
          </div>
        </div>

        <div className={styles.deepDiveWhat}>
          <h3 className={styles.deepDiveWhatTitle}>What is a Skill?</h3>
          <p className={styles.deepDiveWhatDesc}>
            A Skill is a markdown file (<code>SKILL.md</code>) with structured
            rules, patterns, and code examples for a specific topic. When
            installed, your AI reads it automatically and applies those best
            practices to every response — without you re-typing the rules.
          </p>
          <div className={styles.skillStructure}>
            <div className={styles.skillStructureTitle}>
              Skill folder structure (installed to .ai/skills/)
            </div>
            <div className={styles.skillTree}>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📄</span>
                <span className={styles.skillTreeMain}>SKILL.md</span>
                <span className={styles.skillTreeLabel}>← Core skill file (required)</span>
              </div>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📄</span>
                <span className={styles.skillTreeText}>
                  [+ extra .md documents]
                </span>
              </div>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📁</span>
                <span className={styles.skillTreeText}>
                  [+ references/ folder]
                </span>
              </div>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📁</span>
                <span className={styles.skillTreeText}>
                  [+ examples/ folder]
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.deepDiveExample}>
          <div className={styles.deepDiveExampleLabel}>
            <span>Example — </span>
            <code>.ai/skills/modern-react/SKILL.md</code>
          </div>
          <div className={styles.codeBlock}>
            <span className={styles.codeLabel}>
              Modern React Skill (excerpt)
            </span>
            <pre className={styles.codePre}>
              <code>{`---
name: modern-react
description: React best practices. Use when writing
  React components, hooks, or state management code.
category: frontend
tags: [react, typescript, hooks]
---

# Skill: Modern React

Write clean, performant React components
following modern best practices.

## Rules
- ✅ DO: Use functional components with hooks
- ✅ DO: Keep components small and focused
- ❌ DON'T: Use class components for new code
- ❌ DON'T: Put multiple concerns in one component

## When to Use Each Hook
| Hook          | Use Case                    |
| ------------- | --------------------------- |
| useState      | Local component state       |
| useReducer    | Complex state with actions  |
| useMemo       | Expensive calculations      |
| useCallback   | Stable function references  |
| useEffect     | Syncing with external system|

## Avoid useEffect for Derived State

// ❌ Bad — useEffect for something computable
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(i => i.active));
}, [items]);

// ✅ Good — calculate during render
const filtered = useMemo(
  () => items.filter(i => i.active),
  [items]
);`}</code>
            </pre>
          </div>
          <div className={styles.deepDiveBenefits}>
            <span
              className={styles.benefitChip}
              style={{
                background: "rgba(139, 92, 246, 0.12)",
                color: "#a78bfa",
              }}
            >
              Loaded automatically
            </span>
            <span
              className={styles.benefitChip}
              style={{
                background: "rgba(34, 211, 238, 0.12)",
                color: "#22d3ee",
              }}
            >
              Real code examples
            </span>
            <span
              className={styles.benefitChip}
              style={{
                background: "rgba(52, 211, 153, 0.12)",
                color: "#34d399",
              }}
            >
              DO / DON'T rules
            </span>
            <span
              className={styles.benefitChip}
              style={{
                background: "rgba(251, 146, 60, 0.12)",
                color: "#fb923c",
              }}
            >
              Tables & patterns
            </span>
          </div>
        </div>
      </section>

      {/* Deep Dive: Commands */}
      <section className={styles.deepDive}>
        <div className={styles.deepDiveHeader}>
          <span className={styles.deepDiveIcon}>⌘</span>
          <div>
            <h2 className={styles.deepDiveTitle}>Custom Commands</h2>
            <p className={styles.deepDiveSub}>
              Prompts you use <strong>over and over</strong> — saved as reusable
              commands so you never type them again. Supports{" "}
              <code>$ARGUMENTS</code> for dynamic input.
            </p>
          </div>
        </div>

        <div className={styles.deepDiveWhat}>
          <h3 className={styles.deepDiveWhatTitle}>What is a Command?</h3>
          <p className={styles.deepDiveWhatDesc}>
            A Command is a prompt template saved as a markdown file in{" "}
            <code>.ai/commands/</code> or <code>.claude/commands/</code>.
            Instead of re-typing "review my code for security issues" every
            session, you create a command and invoke it with a slash shortcut.
            Use <code>$ARGUMENTS</code> to pass a mode, filename, or any
            dynamic value.
          </p>
        </div>

        <div className={styles.deepDiveExample}>
          <div className={styles.deepDiveExampleLabel}>
            <span>Example — </span>
            <code>.ai/commands/code-review.md</code>
          </div>
          <div className={styles.codeBlock}>
            <span className={styles.codeLabel}>Code Review Command</span>
            <pre className={styles.codePre}>
              <code>{`---
allowed-tools: Read (*)
description: Perform a targeted code review
---
Mode: $ARGUMENTS

Adjust the review based on Mode:
- BUGS        → Focus only on logical bugs
- SECURITY    → Focus only on security issues
- PERFORMANCE → Focus only on performance

Mode can be combined: "BUGS, SECURITY"
If Mode is empty → full general review.

Perform an in-depth code review of
the entire codebase. Explore file-by-file.
Create a detailed report of all findings.`}</code>
            </pre>
          </div>
          <div className={styles.commandUsage}>
            <div className={styles.commandUsageTitle}>Usage examples</div>
            <div className={styles.commandUsageGrid}>
              <div className={styles.commandUsageItem}>
                <code className={styles.commandUsageCode}>
                  /code-review BUGS
                </code>
                <span className={styles.commandUsageDesc}>
                  Find only logical bugs
                </span>
              </div>
              <div className={styles.commandUsageItem}>
                <code className={styles.commandUsageCode}>
                  /code-review SECURITY
                </code>
                <span className={styles.commandUsageDesc}>
                  Security audit only
                </span>
              </div>
              <div className={styles.commandUsageItem}>
                <code className={styles.commandUsageCode}>
                  /code-review BUGS, PERFORMANCE
                </code>
                <span className={styles.commandUsageDesc}>Combined modes</span>
              </div>
              <div className={styles.commandUsageItem}>
                <code className={styles.commandUsageCode}>/code-review</code>
                <span className={styles.commandUsageDesc}>
                  Full general review
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memory Stack */}
      <section className={styles.deepDive}>
        <div className={styles.deepDiveHeader}>
          <span className={styles.deepDiveIcon}>🧠</span>
          <div>
            <h2 className={styles.deepDiveTitle}>The 3-Tool Memory Stack</h2>
            <p className={styles.deepDiveSub}>
              Three tools, zero overlap — each solving a different memory
              problem. Install once, and your AI carries context across every
              session and project automatically.
            </p>
          </div>
        </div>

        {/* Tool cards */}
        <div className={styles.conceptGrid} style={{ marginBottom: "2rem" }}>
          <div
            className={styles.conceptCard}
            style={{ "--card-accent": "#8b5cf6" } as React.CSSProperties}
          >
            <span className={styles.conceptIcon}>🧠</span>
            <h3 className={styles.conceptTitle}>claude-obsidian</h3>
            <p className={styles.conceptDesc}>
              Your persistent second brain. Drop any file into{" "}
              <code>.raw/</code> — Claude extracts concepts, entities, and links
              into an Obsidian wiki. <code>wiki/hot.md</code> is the session
              cache, auto-loaded at the start of every conversation.
            </p>
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Always-on · long-term knowledge
            </div>
          </div>
          <div
            className={styles.conceptCard}
            style={{ "--card-accent": "#22d3ee" } as React.CSSProperties}
          >
            <span className={styles.conceptIcon}>💾</span>
            <h3 className={styles.conceptTitle}>claude-mem</h3>
            <p className={styles.conceptDesc}>
              Auto-captures your session activity, compresses it into semantic
              summaries, and injects relevant context at the start of the next
              session. ~10x token savings. Zero manual work after{" "}
              <code>npx claude-mem install</code>.
            </p>
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Always-on · session-to-session memory
            </div>
          </div>
          <div
            className={styles.conceptCard}
            style={{ "--card-accent": "#34d399" } as React.CSSProperties}
          >
            <span className={styles.conceptIcon}>📊</span>
            <h3 className={styles.conceptTitle}>graphify</h3>
            <p className={styles.conceptDesc}>
              Turns any folder (code, docs, PDFs, videos) into a queryable
              knowledge graph. 71x fewer tokens per query vs reading raw files.
              Run <code>/graphify .</code> when you start working on a large
              unfamiliar codebase.
            </p>
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              On-demand · large codebases & research
            </div>
          </div>
        </div>

        {/* Vault structure */}
        <div className={styles.deepDiveWhat}>
          <h3 className={styles.deepDiveWhatTitle}>
            Your second brain — one vault, forever
          </h3>
          <p className={styles.deepDiveWhatDesc}>
            Drop any source file into <code>.raw/</code> and claude-obsidian
            organizes everything into <code>wiki/</code>. Every project gets its
            own subfolder. <code>hot.md</code> is the always-loaded session
            cache — it holds the most recent context across all projects.
          </p>
          <div className={styles.codeBlock} style={{ marginTop: "1rem" }}>
            <span className={styles.codeLabel}>&lt;your-brain-path&gt;/ vault structure</span>
            <pre className={styles.codePre}>
              <code>{`<your-brain-path>/                  ← One location, you provide the path
├── config/                         ← identity + integrations
│   ├── always.md                   ← ~50 tokens, every message
│   └── integrations/
│       ├── obsidian.md
│       ├── claude-mem.md
│       └── graphify.md
│
├── .raw/                           ← drop ANY file here (PDFs, docs, videos)
│   └── projects/                   ← one folder per project
│       ├── personal-ai-skills/
│       ├── erp-pro-ui/
│       ├── erp-pro/
│       ├── auth-service/
│       └── shared/                 ← cross-project sources
│
├── wiki/                           ← claude-obsidian auto-manages all of this
│   ├── hot.md                      ← session cache (auto-loaded every chat)
│   ├── index.md                    ← master catalog of everything
│   ├── concepts/                   ← ideas extracted from .raw/ files
│   ├── entities/                   ← people, tools, companies
│   ├── sources/                    ← processed versions of .raw/ files
│   └── projects/                   ← one folder per project
│       ├── personal-ai-skills/
│       ├── erp-pro-ui/             ← UI library notes
│       ├── erp-pro/                ← app notes (decisions, architecture)
│       ├── auth-service/           ← auth notes (roles, flows)
│       └── shared/                 ← cross-project knowledge
│
└── graphify-out/                   ← on-demand knowledge graph output
    └── GRAPH_REPORT.md             ← read this before grepping large repos

~/.claude-mem/                      ← separate dir, auto-managed by claude-mem`}</code>
            </pre>
          </div>
        </div>

        {/* Install + integration templates */}
        <div className={styles.deepDiveExample}>
          <div className={styles.deepDiveExampleLabel}>
            <span>Setup — install the memory stack (one-time per machine)</span>
          </div>
          <div className={styles.codeBlock}>
            <span className={styles.codeLabel}>One-time setup</span>
            <pre className={styles.codePre}>
              <code>{`# 1. Clone the Obsidian vault template (claude-obsidian pattern)
git clone https://github.com/AgriciDaniel/claude-obsidian ~/ai-brain

# 2. Install session memory — runs automatically from now on
npx claude-mem install

# 3. Install graphify (optional — for large codebases and research)
pip install graphifyy && graphify install

# 4. Install integration guide files into your project
#    These teach the AI HOW to use each tool (when to load hot.md, MCP order, etc.)
npx personal-ai-skills add obsidian --type integration
npx personal-ai-skills add claude-mem --type integration
npx personal-ai-skills add graphify --type integration

# Or use the interactive wizard — select "Integrations" from the menu:
npx personal-ai-skills`}</code>
            </pre>
          </div>
          <div className={styles.deepDiveBenefits}>
            <span
              className={styles.benefitChip}
              style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}
            >
              Persists across all projects
            </span>
            <span
              className={styles.benefitChip}
              style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }}
            >
              Zero manual work
            </span>
            <span
              className={styles.benefitChip}
              style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}
            >
              ~10x token savings (claude-mem)
            </span>
            <span
              className={styles.benefitChip}
              style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c" }}
            >
              71x token reduction (graphify)
            </span>
          </div>
        </div>
      </section>

      {/* Key rules */}
      <section className={styles.rulesSection}>
        <h2 className={styles.sectionTitle}>Golden Rules</h2>
        <div className={styles.rulesGrid}>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>01</span>
            <h3 className={styles.ruleTitle}>Always reference @SPEC.md</h3>
            <p className={styles.ruleDesc}>
              Start every major session with "We're building @SPEC.md" so the
              AI has full project context. Never assume it remembers from before.
            </p>
          </div>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>02</span>
            <h3 className={styles.ruleTitle}>Keep SPEC.md updated</h3>
            <p className={styles.ruleDesc}>
              After every feature or architecture change, ask the AI to update
              SPEC.md. It's your living documentation — stale specs produce
              stale code.
            </p>
          </div>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>03</span>
            <h3 className={styles.ruleTitle}>Use real docs, not AI memory</h3>
            <p className={styles.ruleDesc}>
              Always tell the AI to look up library docs via Context7 MCP or
              web search. AI training data goes stale — official docs don't.
            </p>
          </div>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>04</span>
            <h3 className={styles.ruleTitle}>Create once, reuse always</h3>
            <p className={styles.ruleDesc}>
              Put any repeated instruction (coding style, doc lookup rules,
              build steps) in a skill or command file. You should never type
              the same thing to your AI twice.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Automate the setup</h2>
        <p className={styles.ctaSub}>
          <strong>personal-ai-skills</strong> installs skills, agents, rules,
          prompts, and integrations — scaffolds your three-tier spec, and
          generates token-efficient bridge files for every AI tool you use.
        </p>
        <div className={styles.ctaCode}>
          <code>npx personal-ai-skills</code>
        </div>
        <div className={styles.ctaCode} style={{ marginTop: "0.5rem", opacity: 0.7 }}>
          <code>npx personal-ai-skills init spec</code>
        </div>
        <div className={styles.ctaLinks}>
          <Link to="/explore" className={styles.ctaLink}>
            Explore the catalog →
          </Link>
        </div>
      </section>
    </div>
  );
}

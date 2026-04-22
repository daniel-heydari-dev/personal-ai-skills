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
    desc: "Scaffold your project spec with the three-tier architecture: global identity → project rules → page-level specs. Use init spec to generate the files.",
    details: [
      "npx personal-ai-skills init spec  →  creates root SPEC.md",
      "npx personal-ai-skills init spec auth  →  creates docs/spec/auth/SPEC.md",
      "Root SPEC.md auto-updates its Spec Map table",
      "Goal: ~150 tokens loaded always, rest on demand",
    ],
    prompt: `# Three-tier config layout
# ─────────────────────────────
# GLOBAL   ~/.ai/           ← identity + integrations (~50 tokens)
# PROJECT  .ai/             ← skills, rules, agents
# SPECS    docs/spec/*/     ← page-by-page context

# 1. Scaffold root spec
npx personal-ai-skills init spec

# 2. Add a feature spec (auto-updates SPEC.md table)
npx personal-ai-skills init spec auth
npx personal-ai-skills init spec billing

# Total always-load budget: ~700–1,100 tokens
# (vs ~6,000 tokens with the old content-dump approach)`,
    promptLabel: "init spec workflow",
  },
  {
    num: 2,
    title: "Refine with AI",
    icon: "✨",
    color: "#22d3ee",
    desc: "After paste prompt to ChatGPT / Claude and get a structured technical specification back. Copy it into SPEC.MD.",
    details: [
      "Paste your project description to any AI",
      "AI returns a full technical spec document",
      "Copy the result into your SPEC.MD file",
      'Ask: "Please format this as proper markdown"',
    ],
    prompt: `We are building an app described in @SPEC.MD.
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
    title: "Configure Your AI (map pattern)",
    icon: "⚙️",
    color: "#34d399",
    desc: "Generate bridge files for each AI tool. CLAUDE.md acts as a MAP — tiny index that tells the AI where files live, not what's in them. Under 200 tokens always-load.",
    details: [
      "npx personal-ai-skills bridge  →  interactive bridge selection",
      "--bridges claude,vscode  →  specific editors only",
      "--bridges none  →  skip bridge generation",
      "VS Code bridge merges into .vscode/settings.json (never overwrites)",
    ],
    prompt: `# Generated CLAUDE.md (map pattern, < 200 tokens)
# ─────────────────────────────────────────────

## ⚡ ALWAYS LOAD
- Root spec: \`SPEC.md\`
- Rules: \`.ai/rules/\` — always follow

## 🗺️ REFERENCE MAP (load only when relevant)
- Skills: \`.ai/skills/\` — load by file type
- Agents: \`.ai/agents/\` — load when role requested
- Sub-specs: \`docs/spec/*/SPEC.md\` — load when relevant
- Obsidian brain: \`~/ai-brain/wiki/hot.md\`

# Interactive bridge selection
npx personal-ai-skills bridge
# ◯ Claude Code    (CLAUDE.md)
# ◯ Cursor         (.cursor/rules)
# ◯ VS Code        (.vscode/settings.json)
# ◯ GitHub Copilot (AGENTS.md)
# ◯ Gemini CLI     (GEMINI.md)
# ◯ Windsurf       (.windsurfrules)`,
    promptLabel: "Map-pattern bridge generation",
  },
  {
    num: 4,
    title: "Set Up MCP Tools",
    icon: "🔌",
    color: "#fb923c",
    desc: "Connect documentation tools like Context7 so your AI can look up real, up-to-date library docs instead of hallucinating.",
    details: [
      "Install Context7 MCP (context7.com)",
      "AI auto-fetches docs for any library",
      "No more outdated API suggestions",
      "Add rule: always use Context7 for docs",
    ],
    prompt: `# Add to CLAUDE.md or Cursor Rules:

Always use Context7 MCP when I need
library/API documentation, code generation,
setup or configuration steps.

# Then in any prompt you can say:
"Use web search or Context7 MCP to look up
docs for better-auth and TipTap."`,
    promptLabel: "MCP configuration",
  },
  {
    num: 5,
    title: "Create Subagents",
    icon: "🤖",
    color: "#f472b6",
    desc: "Build specialized sub-agents for repeatable tasks — docs lookup, testing, review — that run in parallel.",
    details: [
      "Subagent = helper agent for a subtask",
      "Runs in isolated context, returns results",
      "Example: DocsExplorer for docs lookup",
      "Can batch multiple lookups in parallel",
    ],
    prompt: `# .claude/agents/DocsExplorer.md
---
name: DocsExplorer
description: Documentation lookup specialist
tools: WebFetch, WebSearch, MCPSearch
model: sonnet
---

You are a documentation specialist.
Fetch up-to-date docs for libraries.

## Strategy
1. Use Context7 MCP as primary source
2. Fall back to web search
3. Try llms.txt paths for LLM-friendly docs
4. Execute ALL lookups in parallel`,
    promptLabel: "Example subagent definition",
  },
  {
    num: 6,
    title: "Build & Iterate",
    icon: "🔄",
    color: "#60a5fa",
    desc: "Start building. After each task, ask the AI to update SPEC.MD. Always reference it to keep context accurate.",
    details: [
      "Reference @SPEC.MD in every major prompt",
      "Ask AI to update SPEC.MD after changes",
      "Use subagents for docs & validation",
      "Evaluate code against spec & official docs",
    ],
    prompt: `We're building @SPEC.MD.
Please evaluate the existing codebase to check
whether auth and database access are implemented
correctly (in line with expectations in SPEC.MD
and official documentation).
Use Context7 MCP to look up docs.

# After completing a feature:
"Please update @SPEC.MD to reflect
the changes we just made."`,
    promptLabel: "Iterative development prompt",
  },
  {
    num: 7,
    title: "Install Skills",
    icon: "⚡",
    color: "#e879f9",
    desc: "Add skill files that teach your AI best practices for specific technologies — DO/DON'T rules, code patterns, and real examples it reads automatically.",
    details: [
      "Skills are SKILL.md files with structured rules",
      "AI reads them automatically on every prompt",
      "Include DO/DON'T rules, tables, code examples",
      "Install via: npx personal-ai-skills → select skills",
    ],
    prompt: `# .claude/skills/modern-react/SKILL.md
---
name: Modern React
description: React best practices and patterns
---

## Rules
- ✅ DO: Use functional components + hooks
- ✅ DO: Keep components small and focused
- ❌ DON'T: Use class components for new code

## When to Use Each Hook
| Hook        | Use Case                   |
| ----------- | -------------------------- |
| useState    | Local component state      |
| useMemo     | Expensive calculations     |
| useCallback | Stable function references |`,
    promptLabel: "Example SKILL.md",
  },
  {
    num: 8,
    title: "Create Custom Commands",
    icon: "⌘",
    color: "#fbbf24",
    desc: "Save prompts you use repeatedly as reusable command files. Use $ARGUMENTS for dynamic input — invoke with a shortcut instead of re-typing.",
    details: [
      "Commands are prompt templates saved as .md files",
      "Use $ARGUMENTS to pass dynamic values",
      "Invoke with: /command-name ARGS",
      "Modes can be combined: /code-review BUGS, SECURITY",
    ],
    prompt: `# .claude/commands/code-review.md
---
allowed-tools: Read (*)
description: Perform a code review
---
Mode: $ARGUMENTS

If Mode is one of the following,
adjust the review accordingly:
- BUGS → Focus on logical bugs
- SECURITY → Focus on security issues
- PERFORMANCE → Focus on performance

Modes can be combined: "BUGS, SECURITY"
If empty → full general review.

Perform an in-depth code review.
Explore file-by-file. Create a report.`,
    promptLabel: "Example command file",
  },
];

const conceptCards = [
  {
    icon: "🏗️",
    title: "Three-Tier Config",
    desc: "Global ~/.ai/ (identity, ~50 tokens) → Project .ai/ (skills, rules) → Specs docs/spec/ (page-by-page). Load only what's relevant.",
    color: "#8b5cf6",
  },
  {
    icon: "🗺️",
    title: "Map Pattern",
    desc: "CLAUDE.md is a tiny index — under 200 tokens always-load. AI fetches specific skill/spec files only when the task matches.",
    color: "#34d399",
  },
  {
    icon: "🔌",
    title: "MCP Tools",
    desc: "Context7 and other MCPs give AI access to real, up-to-date documentation — no more hallucinated APIs.",
    color: "#fb923c",
  },
  {
    icon: "🧠",
    title: "Integrations",
    desc: "Obsidian as second brain, claude-mem for session memory, graphify for large codebases — all wired via .ai/integrations/.",
    color: "#f472b6",
  },
];

const aiConfigFiles: {
  assistant: string;
  file: string;
  icon: React.ReactNode;
  note?: string;
}[] = [
  { assistant: "Claude Code", file: "CLAUDE.md", icon: <ClaudeIcon />, note: "map pattern" },
  { assistant: "GitHub Copilot", file: "AGENTS.md", icon: <CopilotIcon /> },
  { assistant: "VS Code", file: ".vscode/settings.json", icon: <CopilotIcon />, note: "JSON merge" },
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
          Good input = good results. This guide shows you the exact workflow to
          set up any project for AI-assisted development — from creating a spec
          to building with subagents.
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
          <span className={styles.eqSub}>SPEC.MD + AI Config</span>
        </div>
        <span className={styles.eqPlus}>+</span>
        <div
          className={styles.eqBox}
          style={{ borderColor: "rgba(34, 211, 238, 0.3)" }}
        >
          <span className={styles.eqIcon}>📚</span>
          <span className={styles.eqLabel}>Relevant Context</span>
          <span className={styles.eqSub}>MCP Tools + Subagents</span>
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
          merges into existing settings rather than overwriting.
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
              <code className={styles.configFile}>{c.file}</code>
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
            practices to every response.
          </p>
          <div className={styles.skillStructure}>
            <div className={styles.skillStructureTitle}>
              Skill folder structure
            </div>
            <div className={styles.skillTree}>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📄</span>
                <span className={styles.skillTreeMain}>SKILL.md</span>
                <span className={styles.skillTreeLabel}>← Core skill file</span>
              </div>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📁</span>
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
                  [+ scripts/ folder]
                </span>
              </div>
              <div className={styles.skillTreeItem}>
                <span className={styles.skillTreeIcon}>📁</span>
                <span className={styles.skillTreeText}>[+ assets/ folder]</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.deepDiveExample}>
          <div className={styles.deepDiveExampleLabel}>
            <span>Example — </span>
            <code>.claude/skills/modern-react/SKILL.md</code>
          </div>
          <div className={styles.codeBlock}>
            <span className={styles.codeLabel}>
              Modern React Skill (excerpt)
            </span>
            <pre className={styles.codePre}>
              <code>{`---
name: Modern React
description: React best practices and patterns
---

# Skill: Modern React

Write clean, performant React components
following modern best practices.

## Component Structure

### Rules
- ✅ DO: Use functional components with hooks
- ✅ DO: Keep components small and focused
- ❌ DON'T: Use class components for new code
- ❌ DON'T: Create god components

### When to Use Each Hook
| Hook          | Use Case                    |
| ------------- | --------------------------- |
| useState      | Local component state       |
| useReducer    | Complex state logic         |
| useMemo       | Expensive calculations      |
| useCallback   | Stable function references  |
| useEffect     | External synchronization    |

## Avoid useEffect Abuse

// ❌ Bad - derived state in useEffect
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(i => i.name.includes(q)));
}, [items, q]);

// ✅ Good - calculate during render
const filtered = useMemo(
  () => items.filter(i => i.name.includes(q)),
  [items, q]
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
            A Command is a prompt template saved as a markdown file. Instead of
            re-typing "review my code for bugs and security issues" every time,
            you create a command and invoke it with a shortcut. Use{" "}
            <code>$ARGUMENTS</code> to pass dynamic values like mode or scope.
          </p>
        </div>

        <div className={styles.deepDiveExample}>
          <div className={styles.deepDiveExampleLabel}>
            <span>Example — </span>
            <code>.claude/commands/code-review.md</code>
          </div>
          <div className={styles.codeBlock}>
            <span className={styles.codeLabel}>Code Review Command</span>
            <pre className={styles.codePre}>
              <code>{`---
allowed-tools: Read (*)
description: Perform a code review
---
Mode: $ARGUMENTS

If Mode is one of the following,
adjust the review accordingly:
- BUGS: Focus ONLY on logical bugs
- SECURITY: Focus ONLY on security issues
- PERFORMANCE: Focus ONLY on performance

Mode can be combined: "BUGS, SECURITY"
If Mode is empty → full general review.

Perform an in-depth code review of
the entire codebase.

Carefully explore file-by-file to find
potential issues and improvements.

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
                <span className={styles.commandUsageDesc}>Combined review</span>
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

      {/* Key rules */}
      <section className={styles.rulesSection}>
        <h2 className={styles.sectionTitle}>Golden Rules</h2>
        <div className={styles.rulesGrid}>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>01</span>
            <h3 className={styles.ruleTitle}>Always reference @SPEC.MD</h3>
            <p className={styles.ruleDesc}>
              Start every major prompt with "We're building @SPEC.MD" so the AI
              has full context. Never assume it remembers.
            </p>
          </div>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>02</span>
            <h3 className={styles.ruleTitle}>Keep SPEC.MD updated</h3>
            <p className={styles.ruleDesc}>
              After every feature or architecture change, ask the AI to update
              SPEC.MD. It's your living documentation.
            </p>
          </div>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>03</span>
            <h3 className={styles.ruleTitle}>Use docs, not memory</h3>
            <p className={styles.ruleDesc}>
              Always tell the AI to look up official docs via MCP or web search.
              AI knowledge can be outdated — real docs aren't.
            </p>
          </div>
          <div className={styles.ruleCard}>
            <span className={styles.ruleNum}>04</span>
            <h3 className={styles.ruleTitle}>Create once, reuse always</h3>
            <p className={styles.ruleDesc}>
              Put repeated instructions (build commands, coding style, doc
              lookup) in your AI config file so you never re-type them.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Automate the setup</h2>
        <p className={styles.ctaSub}>
          <strong>personal-ai-skills</strong> installs skills, agents, rules &
          prompts, scaffolds your three-tier spec, and generates token-efficient
          bridge files for every AI tool you use.
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

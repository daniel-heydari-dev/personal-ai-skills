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
    title: "Create SPEC.MD",
    icon: "📋",
    color: "#8b5cf6",
    desc: "Document your entire project in one file — what it does, the tech stack, database, and all requirements.",
    details: [
      "Create SPEC.MD in your project root",
      "Describe: app name, purpose, features",
      "List: tech stack, libraries, database",
      "Add: API endpoints, data models, UI flows",
    ],
    prompt: `I'm building a "Note Taking" web app.

Users will be able to create and manage notes
via a rich text editor (TipTap).

Stack: React.js with pnpm & TypeScript
Styling: TailwindCSS
Auth: better-auth
Database: SQLite (Bun built-in client)

Do you need more information to create me
a technical specification document which I
can use as a foundation to build this app?`,
    promptLabel:
      "Example prompt to Paste the prompt to ChatGPT / Claude and get a structured technical specification back",
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
    title: "Configure Your AI",
    icon: "⚙️",
    color: "#34d399",
    desc: "Create CLAUDE.md (or equivalent) that tells your AI assistant how to work with your project. Point it to SPEC.MD.",
    details: [
      "Create CLAUDE.md / AGENTS.md / .cursorrules",
      "Reference SPEC.MD for project context",
      "Add build commands & project structure",
      "Set rules: concise replies, use docs, etc.",
    ],
    prompt: `# CLAUDE.md

We're building the app described in @SPEC.MD.
Read that file for architectural context.

Keep replies extremely concise. No fluff.
Always look up official docs before suggesting.
Use the DocsExplorer subagent for doc lookup.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude. ai/code) when working with code in this repository.

## Commands
\`\`\`bash
pnpm dev       # Start dev server
pnpm run build # Build for production
pnpm run lint  # Run linter
\`\`\`

## Architecture
React.js App Router with TypeScript strict mode.

## Key Dependencies
- @tiptap/* — Rich text editor
- better-auth — Authentication
- zod — Schema validation`,
    promptLabel: "Example CLAUDE.md structure",
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
    icon: "📋",
    title: "SPEC.MD",
    desc: "Single source of truth for your entire project — what it is, how it works, and what to build next.",
    color: "#8b5cf6",
  },
  {
    icon: "⚙️",
    title: "AI Config",
    desc: "CLAUDE.md / AGENTS.md / .cursorrules — tells the AI how to behave, what commands to run, and where to look.",
    color: "#34d399",
  },
  {
    icon: "🔌",
    title: "MCP Tools",
    desc: "Context7 and other MCPs give AI access to real, up-to-date documentation — no more hallucinated APIs.",
    color: "#fb923c",
  },
  {
    icon: "🤖",
    title: "Subagents",
    desc: "Specialized helpers for docs lookup, testing, review — run in parallel for speed.",
    color: "#f472b6",
  },
];

const aiConfigFiles: {
  assistant: string;
  file: string;
  icon: React.ReactNode;
}[] = [
  { assistant: "Claude Code", file: "CLAUDE.md", icon: <ClaudeIcon /> },
  { assistant: "GitHub Copilot", file: "AGENTS.md", icon: <CopilotIcon /> },
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
          <strong>personal-ai-skills</strong> generates all of these
          automatically — but you can also create them manually.
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
          prompts and generates all config files automatically.
        </p>
        <div className={styles.ctaCode}>
          <code>npx personal-ai-skills</code>
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

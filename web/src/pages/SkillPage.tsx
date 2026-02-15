import { useParams, Link } from "react-router-dom";
import { getSkillById, categories, type CategoryId } from "../data/catalog";
import styles from "./SkillPage.module.css";

/** Short bullet-point explanations shown on every detail page */
const itemDetails: Record<string, { summary: string; bullets: string[] }> = {
  // ── Skills ──
  accessibility: {
    summary: "Teaches your AI to write inclusive, WCAG-compliant interfaces.",
    bullets: [
      "Semantic HTML elements & ARIA attributes",
      "Keyboard navigation & focus management",
      "Screen-reader-friendly labels and alt text",
      "Color contrast & motion-safe best practices",
    ],
  },
  "api-design": {
    summary: "Guides your AI to design clean, consistent REST APIs.",
    bullets: [
      "RESTful resource naming & URL conventions",
      "HTTP status codes & error response format",
      "Pagination, filtering & versioning strategies",
      "OpenAPI / Swagger spec generation",
    ],
  },
  brainstorming: {
    summary: "Turns your AI into a structured ideation partner.",
    bullets: [
      "Divergent → convergent thinking workflows",
      "Trade-off matrices & decision frameworks",
      "Design exploration with pros/cons analysis",
      "Feature prioritization & scoping guidance",
    ],
  },
  "changelog-generation": {
    summary: "Automates clear, user-facing changelogs from commits.",
    bullets: [
      "Conventional-commit parsing",
      "Groups changes by type: features, fixes, breaking",
      "Generates Markdown or Keep-a-Changelog format",
      "Links to PRs and issues automatically",
    ],
  },
  "clean-code": {
    summary: "Enforces readable, maintainable code in every response.",
    bullets: [
      "Meaningful names — no x, temp, or data",
      "Small, single-purpose functions (< 20 lines)",
      "DRY principles & early returns",
      "Clear error handling & no magic numbers",
    ],
  },
  "clean-typescript": {
    summary: "Strict TypeScript patterns the AI follows by default.",
    bullets: [
      "No any — discriminated unions & branded types",
      "Result<T, E> instead of throwing exceptions",
      "Exhaustive switch with never checks",
      "Readonly types & immutable-first data flow",
    ],
  },
  documentation: {
    summary: "Generates thorough, well-structured documentation.",
    bullets: [
      "JSDoc with @param, @returns, @example",
      "README structure: install → usage → API → FAQ",
      "Inline comments only when 'why' isn't obvious",
      "Architecture Decision Records (ADR) format",
    ],
  },
  "error-handling": {
    summary: "Ensures robust error boundaries and recovery paths.",
    bullets: [
      "Try/catch with typed error classes",
      "Graceful degradation & user-friendly messages",
      "Structured logging with severity levels",
      "Retry strategies & circuit breaker patterns",
    ],
  },
  "git-workflow": {
    summary: "Applies conventional commits and branching best practices.",
    bullets: [
      "Conventional commit format: type(scope): message",
      "Branch naming: feature/, fix/, chore/",
      "Atomic commits — one concern per commit",
      "PR templates & merge strategies",
    ],
  },
  "interface-design": {
    summary: "Designs clean TypeScript interfaces and type hierarchies.",
    bullets: [
      "Composition over inheritance",
      "Discriminated union patterns",
      "Generic constraints & utility types",
      "Interface segregation — small, focused contracts",
    ],
  },
  "modern-nextjs": {
    summary: "Applies Next.js App Router and RSC best practices.",
    bullets: [
      "App Router file-based routing conventions",
      "Server Components by default, client only when needed",
      "Data fetching with async server components",
      "Metadata API, loading/error boundaries, streaming",
    ],
  },
  "modern-react": {
    summary: "Follows React 19 patterns — hooks, composition, performance.",
    bullets: [
      "Functional components with hooks only",
      "Custom hooks for reusable logic extraction",
      "Memo, useMemo, useCallback where it matters",
      "Composition patterns over prop drilling",
    ],
  },
  "node-backend": {
    summary: "Backend patterns for Express, Fastify, and Node.js APIs.",
    bullets: [
      "Layered architecture: route → controller → service",
      "Middleware chains & request validation",
      "Environment config with Zod schemas",
      "Graceful shutdown & health checks",
    ],
  },
  performance: {
    summary: "Optimizes rendering, loading, and runtime performance.",
    bullets: [
      "Bundle splitting & lazy loading",
      "Image optimization & responsive assets",
      "Debounce, throttle & virtualization patterns",
      "Lighthouse & Core Web Vitals targets",
    ],
  },
  "solid-principles": {
    summary: "Applies SOLID design principles to every code suggestion.",
    bullets: [
      "Single Responsibility — one reason to change",
      "Open/Closed — extend, don't modify",
      "Liskov Substitution — subtypes are swappable",
      "Dependency Inversion — depend on abstractions",
    ],
  },
  "systematic-debugging": {
    summary: "Structured methodology for diagnosing and fixing bugs.",
    bullets: [
      "Reproduce → isolate → identify → fix → verify",
      "Binary search through recent changes",
      "Minimal reproduction case construction",
      "Root-cause analysis & regression prevention",
    ],
  },
  "testing-best-practices": {
    summary: "Writes thorough tests following AAA pattern and isolation.",
    bullets: [
      "Arrange → Act → Assert structure",
      "Unit, integration, and E2E coverage",
      "Test isolation — no shared state between tests",
      "Edge cases, error paths, and boundary values",
    ],
  },
  "web-security": {
    summary: "Follows OWASP guidelines to prevent common vulnerabilities.",
    bullets: [
      "Input sanitization & output encoding",
      "XSS, CSRF, and injection prevention",
      "Content Security Policy headers",
      "Authentication & session management patterns",
    ],
  },
  // ── Agents ──
  architect: {
    summary: "Thinks like a senior solutions architect.",
    bullets: [
      "System design with scalability trade-offs",
      "Service boundaries & API contract design",
      "Technology selection with rationale",
      "Diagrams: sequence, component, deployment",
    ],
  },
  "code-reviewer": {
    summary: "Reviews code like a thorough senior engineer.",
    bullets: [
      "Severity-rated findings: critical → nit",
      "Specific line references & suggested fixes",
      "Performance, security & maintainability checks",
      "Praise for well-written patterns",
    ],
  },
  "test-writer": {
    summary: "Generates comprehensive test suites automatically.",
    bullets: [
      "Unit + integration + edge-case coverage",
      "Test plan with expected behaviors listed",
      "Mock & stub strategies for dependencies",
      "Coverage gap analysis & test naming",
    ],
  },
  "security-auditor": {
    summary: "Scans code for security vulnerabilities.",
    bullets: [
      "OWASP Top 10 vulnerability detection",
      "Dependency risk assessment",
      "Auth flow & session handling review",
      "Remediation steps with code examples",
    ],
  },
  "performance-optimizer": {
    summary: "Identifies and fixes performance bottlenecks.",
    bullets: [
      "Runtime complexity analysis (Big-O)",
      "Database query optimization",
      "Bundle size & rendering performance",
      "Caching strategies & lazy-loading",
    ],
  },
  "refactor-expert": {
    summary: "Restructures code for clarity without changing behavior.",
    bullets: [
      "Extract method/class refactoring patterns",
      "Code smell detection & elimination",
      "Design pattern application",
      "Safe step-by-step migration plans",
    ],
  },
  "docs-explorer": {
    summary: "Navigates and explains documentation efficiently.",
    bullets: [
      "Finds relevant docs for your question",
      "Summarizes API references with examples",
      "Compares versions & migration guides",
      "Links to official sources",
    ],
  },
  "migration-helper": {
    summary: "Guides framework and library migration step by step.",
    bullets: [
      "Breaking change detection & impact analysis",
      "Automated codemod suggestions",
      "Phased migration plan with rollback steps",
      "Compatibility testing checklist",
    ],
  },
  // ── Commands ──
  "code-review": {
    summary: "Runs a structured code review on selected files.",
    bullets: [
      "Quality, readability & maintainability checks",
      "Issue severity classification",
      "Actionable improvement suggestions",
      "Summary with overall rating",
    ],
  },
  explain: {
    summary: "Explains code or concepts clearly and concisely.",
    bullets: [
      "Line-by-line code walkthrough",
      "Concept explanation with analogies",
      "Complexity & data-flow analysis",
      "Alternative approaches comparison",
    ],
  },
  "generate-tests": {
    summary: "Creates a full test suite for a given module.",
    bullets: [
      "Test plan with all scenarios listed",
      "Happy path + error path + edge cases",
      "Mock setup & assertion patterns",
      "Coverage target recommendations",
    ],
  },
  refactor: {
    summary: "Improves code structure while preserving behavior.",
    bullets: [
      "Identifies code smells & complexity",
      "Suggests extract/inline/rename operations",
      "Provides before → after comparisons",
      "Ensures test compatibility",
    ],
  },
  document: {
    summary: "Generates documentation for functions, classes & modules.",
    bullets: [
      "JSDoc / TSDoc with full annotations",
      "README sections for public APIs",
      "Usage examples & parameter descriptions",
      "Auto-generated table of contents",
    ],
  },
  optimize: {
    summary: "Analyzes and suggests performance optimizations.",
    bullets: [
      "Algorithmic complexity improvements",
      "Memory allocation reduction",
      "Rendering & I/O bottleneck fixes",
      "Benchmarking recommendations",
    ],
  },
  "fix-tests": {
    summary: "Debugs and fixes failing test cases.",
    bullets: [
      "Failure root-cause analysis",
      "Assertion & mock mismatch detection",
      "Timing & race condition fixes",
      "Updated test code with explanations",
    ],
  },
  scaffold: {
    summary: "Generates project boilerplate and file structure.",
    bullets: [
      "Component/module scaffolding",
      "Config files: tsconfig, eslint, prettier",
      "Folder structure following conventions",
      "Ready-to-run starter with scripts",
    ],
  },
  // ── Rules ──
  "typescript-strict": {
    summary: "Enforces strict TypeScript — no any, no implicit types.",
    bullets: [
      "strict: true in all configurations",
      "Explicit return types on public APIs",
      "No type assertions unless justified",
      "Unknown over any for external data",
    ],
  },
  "react-patterns": {
    summary: "Enforces modern React conventions in generated code.",
    bullets: [
      "Functional components only",
      "Hooks rules: no conditionals, correct deps",
      "Props destructuring & default values",
      "Key prop usage & list rendering",
    ],
  },
  "accessibility-required": {
    summary: "Every UI component must meet WCAG 2.1 AA.",
    bullets: [
      "Alt text on all images",
      "Focusable interactive elements",
      "Sufficient color contrast ratios",
      "Landmark roles & heading hierarchy",
    ],
  },
  "error-boundaries": {
    summary: "React components must have error boundaries.",
    bullets: [
      "ErrorBoundary wrappers at route level",
      "Fallback UI for crashed components",
      "Error logging to monitoring service",
      "Recovery actions (retry / reset)",
    ],
  },
  "import-order": {
    summary: "Consistent import ordering in every file.",
    bullets: [
      "1. Node built-ins  2. External packages",
      "3. Internal aliases  4. Relative imports",
      "Blank line between each group",
      "Alphabetical within each group",
    ],
  },
  "no-console": {
    summary: "No console.log in production code.",
    bullets: [
      "Replace with structured logger",
      "Allow console.warn/error in dev only",
      "Lint rule with auto-fix",
      "Debug logs behind feature flags",
    ],
  },
  // ── Prompts ──
  "pr-description": {
    summary: "Generates structured pull request descriptions.",
    bullets: [
      "Summary, changes, testing & screenshots",
      "Checklist: tests, docs, breaking changes",
      "Link to related issues & tickets",
      "Reviewer guidance & focus areas",
    ],
  },
  "commit-message": {
    summary: "Creates conventional commit messages from diffs.",
    bullets: [
      "type(scope): subject format",
      "Body with what & why",
      "Footer with issue references",
      "Breaking change annotations",
    ],
  },
  "release-notes": {
    summary: "Generates user-facing release notes from changes.",
    bullets: [
      "Grouped by: features, fixes, breaking",
      "Non-technical language for end users",
      "Highlights with upgrade instructions",
      "Version number & date header",
    ],
  },
  "bug-report": {
    summary: "Creates structured bug report templates.",
    bullets: [
      "Steps to reproduce with expected vs actual",
      "Environment: OS, browser, version",
      "Severity & impact classification",
      "Screenshots / logs placeholder",
    ],
  },
  "feature-spec": {
    summary: "Writes detailed feature specification documents.",
    bullets: [
      "Problem statement & user stories",
      "Proposed solution & alternatives",
      "Acceptance criteria & edge cases",
      "Technical design & API surface",
    ],
  },
};

/** Category-level explanation shown when no item-specific details exist */
const categoryExplainers: Record<
  CategoryId,
  { description: string; benefits: string[] }
> = {
  skills: {
    description:
      "Skills are knowledge modules your AI loads before answering. They establish patterns and conventions so every response follows best practices.",
    benefits: [
      "Consistent, high-quality code suggestions",
      "Eliminates repeating the same instructions",
      "Team-wide conventions applied automatically",
    ],
  },
  agents: {
    description:
      "Agents give your AI a specialist persona — architect, reviewer, auditor — so responses are focused and domain-expert quality.",
    benefits: [
      "Deep, role-specific guidance",
      "Structured output with severity ratings",
      "Covers design, security, perf & testing",
    ],
  },
  commands: {
    description:
      "Commands are task templates. Instead of crafting the perfect prompt, pick a command and the AI follows a structured workflow.",
    benefits: [
      "Repeatable, consistent task output",
      "Multi-step workflows in one action",
      "Covers review, test, refactor & scaffold",
    ],
  },
  rules: {
    description:
      "Rules are hard constraints the AI enforces in every response — like a linter, but for AI-generated code.",
    benefits: [
      "Zero-config code style enforcement",
      "Catches issues before code review",
      "Works across all AI assistants",
    ],
  },
  prompts: {
    description:
      "Prompts are fill-in-the-blank templates that produce structured content — commit messages, PRs, specs, and release notes.",
    benefits: [
      "Consistent documentation format",
      "Team-wide communication standards",
      "Saves time on repetitive writing",
    ],
  },
};

const assistants = [
  { name: "Claude", icon: "🟣" },
  { name: "Cursor", icon: "⚡" },
  { name: "Windsurf", icon: "🌊" },
  { name: "GitHub Copilot", icon: "🐙" },
  { name: "Gemini CLI", icon: "💎" },
  { name: "Amp", icon: "🔋" },
  { name: "OpenAI Codex", icon: "🤖" },
  { name: "Kiro", icon: "🔮" },
  { name: "Trae", icon: "🎯" },
];

export function SkillPage() {
  const { skill: skillId } = useParams<{
    category: string;
    skill: string;
  }>();
  const skill = skillId ? getSkillById(skillId) : undefined;

  if (!skill) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>🔍</span>
          <h1 className={styles.title}>Skill Not Found</h1>
          <p className={styles.description}>
            The skill &ldquo;{skillId}&rdquo; does not exist.
          </p>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const cat = categories[skill.category];

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span className={styles.separator}>/</span>
        <Link to={`/${skill.category}`}>{cat.name}</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{skill.name}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.icon}>{cat.icon}</span>
          <span className={styles.category} style={{ color: cat.color }}>
            {cat.name}
          </span>
        </div>
        <h1 className={styles.title}>{skill.name}</h1>
        <p className={styles.description}>{skill.description}</p>
        <div className={styles.tags}>
          {skill.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className={styles.install}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>📦</span>
          <h2 className={styles.sectionTitle}>Installation</h2>
        </div>
        <div className={styles.commands}>
          <div className={styles.commandBlock}>
            <span className={styles.commandLabel}>Interactive</span>
            <div className={styles.commandRow}>
              <span className={styles.commandPrefix}>$</span>
              <code className={styles.command}>npx personal-ai-skills</code>
            </div>
          </div>
          <div className={styles.commandBlock}>
            <span className={styles.commandLabel}>Direct</span>
            <div className={styles.commandRow}>
              <span className={styles.commandPrefix}>$</span>
              <code className={styles.command}>
                npx personal-ai-skills install {skill.category}/{skill.id}
              </code>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>📄</span>
          <h2 className={styles.sectionTitle}>
            What does this {cat.name.slice(0, -1).toLowerCase()} do?
          </h2>
        </div>
        <div className={styles.placeholder}>
          {itemDetails[skill.id] ? (
            <>
              <p className={styles.detailSummary}>
                {itemDetails[skill.id].summary}
              </p>
              <ul className={styles.detailList}>
                {itemDetails[skill.id].bullets.map((b, i) => (
                  <li key={i} className={styles.detailItem}>
                    <span className={styles.detailCheck}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>
              This {cat.name.toLowerCase().slice(0, -1)} helps you with{" "}
              {skill.description.toLowerCase()}
            </p>
          )}
          <div className={styles.fileInfo}>
            <span className={styles.fileLabel}>File</span>
            <code className={styles.filePath}>{skill.file}</code>
          </div>
        </div>
      </section>

      <section className={styles.categoryInfo}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>{cat.icon}</span>
          <h2 className={styles.sectionTitle}>What are {cat.name}?</h2>
        </div>
        <p className={styles.categoryExplain}>
          {categoryExplainers[skill.category].description}
        </p>
        <div className={styles.benefitChips}>
          {categoryExplainers[skill.category].benefits.map((b, i) => (
            <span key={i} className={styles.benefitChip}>
              {b}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.assistantsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>🤖</span>
          <h2 className={styles.sectionTitle}>Supported Assistants</h2>
        </div>
        <div className={styles.assistantGrid}>
          {assistants.map((a, i) => (
            <div
              key={a.name}
              className={styles.assistantItem}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={styles.assistantIcon}>{a.icon}</span>
              <span className={styles.assistantName}>{a.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

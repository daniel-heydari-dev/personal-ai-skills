export interface Skill {
  id: string;
  name: string;
  description: string;
  category: "skills" | "agents" | "commands" | "rules" | "prompts" | "integration";
  tags: string[];
  file: string;
}

export const catalog: Skill[] = [
  // ─── Skills (35) ─────────────────────────────────────────────────
  {
    id: "accessibility",
    name: "Accessibility",
    description:
      "Build inclusive web applications following WCAG standards — semantic HTML, keyboard navigation, ARIA attributes, and screen reader support.",
    category: "skills",
    tags: ["accessibility", "a11y", "wcag", "aria"],
    file: "skills/accessibility/SKILL.md",
  },
  {
    id: "api-design",
    name: "API Design",
    description:
      "RESTful API design conventions, OpenAPI specifications, versioning strategies, and error response patterns.",
    category: "skills",
    tags: ["api", "rest", "openapi", "http"],
    file: "skills/api-design/SKILL.md",
  },
  {
    id: "brainstorming",
    name: "Brainstorming",
    description:
      "Explores user intent, requirements, and design before implementation through collaborative dialogue.",
    category: "skills",
    tags: ["planning", "design", "architecture", "requirements"],
    file: "skills/brainstorming/SKILL.md",
  },
  {
    id: "changelog-generation",
    name: "Changelog Generation",
    description:
      "Conventional commits, semantic versioning, and automated changelog generation for managing releases.",
    category: "skills",
    tags: ["git", "versioning", "releases", "changelog"],
    file: "skills/changelog-generation/SKILL.md",
  },
  {
    id: "clean-code",
    name: "Clean Code",
    description:
      "Principles for writing readable, maintainable, and simple code — naming conventions, function design, and quality.",
    category: "skills",
    tags: ["clean-code", "naming", "readability", "refactoring"],
    file: "skills/clean-code/SKILL.md",
  },
  {
    id: "clean-typescript",
    name: "Clean TypeScript",
    description:
      "TypeScript best practices for type safety, strict typing, discriminated unions, utility types, and maintainability.",
    category: "skills",
    tags: ["typescript", "types", "type-safety", "generics"],
    file: "skills/clean-typescript/SKILL.md",
  },
  {
    id: "documentation",
    name: "Documentation",
    description:
      "Write clear, useful documentation including JSDoc comments, README files, and API docs.",
    category: "skills",
    tags: ["documentation", "jsdoc", "readme", "api-docs"],
    file: "skills/documentation/SKILL.md",
  },
  {
    id: "error-handling",
    name: "Error Handling",
    description:
      "Patterns for robust error handling including custom error classes, Result types, and retry logic.",
    category: "skills",
    tags: ["error-handling", "errors", "result-type", "resilience"],
    file: "skills/error-handling/SKILL.md",
  },
  {
    id: "git-workflow",
    name: "Git Workflow",
    description:
      "Git best practices for clean history, branching strategies, commit conventions, and team collaboration.",
    category: "skills",
    tags: ["git", "version-control", "commits", "branching"],
    file: "skills/git-workflow/SKILL.md",
  },
  {
    id: "interface-design",
    name: "Interface Design",
    description:
      "Modern UI design patterns, design systems, component architecture, spacing systems, and visual consistency.",
    category: "skills",
    tags: ["ui", "design", "components", "ux", "css"],
    file: "skills/interface-design/SKILL.md",
  },
  {
    id: "modern-nextjs",
    name: "Modern Next.js",
    description:
      "Next.js App Router best practices including server/client components, data fetching, and routing patterns.",
    category: "skills",
    tags: ["nextjs", "react", "app-router", "server-components"],
    file: "skills/modern-nextjs/SKILL.md",
  },
  {
    id: "modern-react",
    name: "Modern React",
    description:
      "Modern React patterns and best practices including hooks, composition, component structure, and performance.",
    category: "skills",
    tags: ["react", "hooks", "components", "state-management"],
    file: "skills/modern-react/SKILL.md",
  },
  {
    id: "node-backend",
    name: "Node.js Backend",
    description:
      "Best practices for Node.js server applications including Express project structure, middleware, and controllers.",
    category: "skills",
    tags: ["nodejs", "express", "backend", "api", "server"],
    file: "skills/node-backend/SKILL.md",
  },
  {
    id: "performance",
    name: "Performance",
    description:
      "Techniques for building fast applications including bundle optimization, React performance, caching, and web vitals.",
    category: "skills",
    tags: ["performance", "optimization", "bundle-size", "caching"],
    file: "skills/performance/SKILL.md",
  },
  {
    id: "solid-principles",
    name: "SOLID Principles",
    description:
      "Five SOLID principles for maintainable object-oriented design — SRP, OCP, LSP, ISP, and DIP with examples.",
    category: "skills",
    tags: ["solid", "oop", "design-patterns", "architecture"],
    file: "skills/solid-principles/SKILL.md",
  },
  {
    id: "systematic-debugging",
    name: "Systematic Debugging",
    description:
      "Methodical debugging process using binary search, logging strategies, 5-whys root cause analysis.",
    category: "skills",
    tags: ["debugging", "troubleshooting", "logging", "root-cause"],
    file: "skills/systematic-debugging/SKILL.md",
  },
  {
    id: "testing-best-practices",
    name: "Testing Best Practices",
    description:
      "Write effective, maintainable tests following AAA pattern, proper naming, mocking strategies, and organization.",
    category: "skills",
    tags: ["testing", "unit-tests", "mocking", "coverage"],
    file: "skills/testing-best-practices/SKILL.md",
  },
  {
    id: "web-security",
    name: "Web Security",
    description:
      "Security best practices for web applications including XSS prevention, CSRF protection, and input validation.",
    category: "skills",
    tags: ["security", "xss", "csrf", "authentication"],
    file: "skills/web-security/SKILL.md",
  },

  // ─── Skills — Design ─────────────────────────────────────────────
  {
    id: "brand-guidelines",
    name: "Brand Guidelines",
    description:
      "Apply consistent brand identity — colors, typography, and visual style — to any artifact, presentation, or UI component.",
    category: "skills",
    tags: ["branding", "design", "colors", "typography", "visual-identity"],
    file: "skills/brand-guidelines/SKILL.md",
  },
  {
    id: "canvas-design",
    name: "Canvas Design",
    description:
      "Create original, museum-quality visual art as PDF or PNG — establishing a design philosophy first, then expressing it on canvas.",
    category: "skills",
    tags: ["design", "art", "canvas", "pdf", "png", "visual", "poster"],
    file: "skills/canvas-design/SKILL.md",
  },
  {
    id: "frontend-design",
    name: "Frontend Design",
    description:
      "Build distinctive, production-grade web interfaces with bold aesthetic direction — anti-AI-slop patterns, typography systems, and intentional spatial design.",
    category: "skills",
    tags: ["frontend", "design", "ui", "css", "aesthetics", "typography"],
    file: "skills/frontend-design/SKILL.md",
  },
  {
    id: "theme-factory",
    name: "Theme Factory",
    description:
      "Apply professional color and font themes to presentations and artifacts — 10 pre-set themes (Ocean Depths, Midnight Galaxy, etc.) plus custom theme creation.",
    category: "skills",
    tags: ["themes", "design", "presentations", "colors", "typography"],
    file: "skills/theme-factory/SKILL.md",
  },
  {
    id: "web-artifacts-builder",
    name: "Web Artifacts Builder",
    description:
      "Build elaborate, multi-component HTML artifacts for Claude.ai using React 18, TypeScript, Tailwind CSS, and 40+ shadcn/ui components — bundled into a single HTML file.",
    category: "skills",
    tags: ["artifacts", "react", "tailwind", "shadcn", "html", "frontend"],
    file: "skills/web-artifacts-builder/SKILL.md",
  },

  // ─── Skills — Marketing ───────────────────────────────────────────
  {
    id: "marketing",
    name: "Marketing",
    description:
      "Full-stack marketing skills — CRO, copywriting, email sequences, SEO strategy, paid ads, growth, pricing, and analytics for technical founders.",
    category: "skills",
    tags: ["marketing", "cro", "copywriting", "growth", "email", "pricing", "analytics"],
    file: "skills/marketing/SKILL.md",
  },
  {
    id: "seo",
    name: "SEO",
    description:
      "Comprehensive SEO analysis — technical audits, E-E-A-T content quality, schema markup, local SEO, and AI search optimization (Google AI Overviews, ChatGPT, Perplexity).",
    category: "skills",
    tags: ["seo", "search", "schema", "technical-seo", "ai-seo", "local-seo"],
    file: "skills/seo/SKILL.md",
  },

  // ─── Skills — UX & Product ───────────────────────────────────────
  {
    id: "algorithmic-art",
    name: "Algorithmic Art",
    description:
      "Generate seeded, parametric generative art via p5.js — philosophy-first, interactive, self-contained HTML artifact with seed navigation and downloadable PNG.",
    category: "skills",
    tags: ["generative-art", "p5js", "creative-coding", "procedural", "visual", "interactive"],
    file: "skills/algorithmic-art/SKILL.md",
  },
  {
    id: "design-sprint",
    name: "Design Sprint",
    description:
      "Run a Google Ventures Design Sprint — map, sketch, decide, prototype, and test in 5 phases. Produces a testable prototype and a clear go/no-go decision.",
    category: "skills",
    tags: ["design-sprint", "product", "ux", "prototyping", "validation", "gv-sprint"],
    file: "skills/design-sprint/SKILL.md",
  },
  {
    id: "hooked-ux",
    name: "Hooked UX",
    description:
      "Diagnose where your habit loop breaks using the Hooked Model — trigger, action, variable reward, investment. Pinpoints exactly why users churn and what to fix.",
    category: "skills",
    tags: ["ux", "retention", "engagement", "habit", "hooked", "product", "churn"],
    file: "skills/hooked-ux/SKILL.md",
  },
  {
    id: "ios-hig",
    name: "iOS HIG Design",
    description:
      "Apply Apple's Human Interface Guidelines — navigation patterns, SF Symbols, Dynamic Type, semantic colors, SwiftUI conventions, and dark mode from the start.",
    category: "skills",
    tags: ["ios", "apple", "hig", "swiftui", "uikit", "mobile", "native"],
    file: "skills/ios-hig/SKILL.md",
  },
  {
    id: "refactoring-ui",
    name: "Refactoring UI",
    description:
      "Audit and fix UI visual hierarchy, spacing, color, and typography. Produces a severity-scored punch list with exact CSS fixes — based on Refactoring UI by Adam Wathan.",
    category: "skills",
    tags: ["ui", "design", "hierarchy", "spacing", "color", "typography", "audit"],
    file: "skills/refactoring-ui/SKILL.md",
  },
  {
    id: "uiux-pro",
    name: "UIUX Pro Max",
    description:
      "Generate a complete design system from a brief — design tokens, spacing scale, typography, color system, dark mode, core components, and motion tokens.",
    category: "skills",
    tags: ["design-system", "tokens", "components", "typography", "dark-mode", "ui"],
    file: "skills/uiux-pro/SKILL.md",
  },
  {
    id: "ux-heuristics",
    name: "UX Heuristics",
    description:
      "Severity-scored usability audit using Nielsen's 10 Heuristics — identify and prioritize usability issues with specific fixes for each violation.",
    category: "skills",
    tags: ["ux", "usability", "heuristics", "nielsen", "audit", "evaluation"],
    file: "skills/ux-heuristics/SKILL.md",
  },

  // ─── Skills — Meta & Methodology ─────────────────────────────────
  {
    id: "context-engineering",
    name: "Context Engineering",
    description:
      "Build production-grade AI agent systems — multi-agent architecture, memory systems, context compression, latent briefing, and evaluation frameworks.",
    category: "skills",
    tags: ["agents", "context", "multi-agent", "memory", "orchestration", "llm"],
    file: "skills/context-engineering/SKILL.md",
  },
  {
    id: "skill-creator",
    name: "Skill Creator",
    description:
      "Meta-skill for creating, testing, and iterating on AI skills — define intent, write SKILL.md, benchmark outputs, and optimize trigger descriptions.",
    category: "skills",
    tags: ["skill-creator", "meta", "ai-skills", "benchmarking"],
    file: "skills/skill-creator/SKILL.md",
  },
  {
    id: "superpowers",
    name: "Superpowers",
    description:
      "Structured agent development methodology — clarify intent before coding, TDD with RED-GREEN-REFACTOR cycles, systematic debugging, and two-stage code review.",
    category: "skills",
    tags: ["tdd", "planning", "methodology", "debugging", "code-review"],
    file: "skills/superpowers/SKILL.md",
  },

  // ─── Agents (8) ──────────────────────────────────────────────────
  {
    id: "architect",
    name: "Architect",
    description:
      "Software architect that designs scalable systems, evaluates tradeoffs, and creates technical specifications.",
    category: "agents",
    tags: ["architecture", "design", "scalability", "system-design"],
    file: "agents/architect/AGENT.md",
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description:
      "Expert code reviewer that analyzes code for quality, security, performance, and best practices.",
    category: "agents",
    tags: ["review", "quality", "security", "best-practices"],
    file: "agents/code-reviewer/AGENT.md",
  },
  {
    id: "docs-explorer",
    name: "Docs Explorer",
    description:
      "Documentation specialist that navigates codebases, explains architecture, and helps understand unfamiliar code.",
    category: "agents",
    tags: ["documentation", "architecture", "onboarding", "exploration"],
    file: "agents/docs-explorer/AGENT.md",
  },
  {
    id: "migration-helper",
    name: "Migration Helper",
    description:
      "Migration specialist that helps upgrade frameworks, migrate databases, and modernize legacy codebases.",
    category: "agents",
    tags: ["migration", "upgrade", "modernization", "compatibility"],
    file: "agents/migration-helper/AGENT.md",
  },
  {
    id: "performance-optimizer",
    name: "Performance Optimizer",
    description:
      "Performance specialist that identifies bottlenecks, optimizes code, and improves application speed.",
    category: "agents",
    tags: ["performance", "optimization", "profiling", "bottlenecks"],
    file: "agents/performance-optimizer/AGENT.md",
  },
  {
    id: "refactor-expert",
    name: "Refactor Expert",
    description:
      "Code refactoring specialist that improves code quality, applies design patterns, and modernizes legacy code.",
    category: "agents",
    tags: ["refactoring", "clean-code", "patterns", "modernization"],
    file: "agents/refactor-expert/AGENT.md",
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    description:
      "Security specialist that identifies vulnerabilities, reviews code for security issues, and recommends protections.",
    category: "agents",
    tags: ["security", "vulnerabilities", "audit", "owasp"],
    file: "agents/security-auditor/AGENT.md",
  },
  {
    id: "test-writer",
    name: "Test Writer",
    description:
      "Expert test writer that generates comprehensive test suites with unit tests, integration tests, and edge cases.",
    category: "agents",
    tags: ["testing", "unit-tests", "integration", "coverage"],
    file: "agents/test-writer/AGENT.md",
  },

  // ─── Commands (8) ────────────────────────────────────────────────
  {
    id: "code-review",
    name: "/code-review",
    description:
      "Comprehensive code review that analyzes code for quality, security, performance, and best practices.",
    category: "commands",
    tags: ["review", "quality", "security"],
    file: "commands/code-review/COMMAND.md",
  },
  {
    id: "document",
    name: "/document",
    description:
      "Generates documentation for code including JSDoc/TSDoc, README sections, and API docs.",
    category: "commands",
    tags: ["documentation", "jsdoc", "api-docs"],
    file: "commands/document/COMMAND.md",
  },
  {
    id: "explain",
    name: "/explain",
    description:
      "Explains code, concepts, or architecture in clear, accessible language with examples.",
    category: "commands",
    tags: ["explanation", "learning", "concepts"],
    file: "commands/explain/COMMAND.md",
  },
  {
    id: "fix-tests",
    name: "/fix-tests",
    description:
      "Analyzes failing tests and provides fixes with explanations of root causes.",
    category: "commands",
    tags: ["testing", "debugging", "fixes"],
    file: "commands/fix-tests/COMMAND.md",
  },
  {
    id: "generate-tests",
    name: "/generate-tests",
    description:
      "Generates comprehensive test suites with unit tests, edge cases, and mocks.",
    category: "commands",
    tags: ["testing", "generation", "coverage"],
    file: "commands/generate-tests/COMMAND.md",
  },
  {
    id: "optimize",
    name: "/optimize",
    description:
      "Analyzes and optimizes code for better performance with before/after comparisons.",
    category: "commands",
    tags: ["performance", "optimization", "profiling"],
    file: "commands/optimize/COMMAND.md",
  },
  {
    id: "refactor",
    name: "/refactor",
    description:
      "Refactors code to improve quality while preserving behavior with verification steps.",
    category: "commands",
    tags: ["refactoring", "clean-code", "quality"],
    file: "commands/refactor/COMMAND.md",
  },
  {
    id: "scaffold",
    name: "/scaffold",
    description:
      "Generates project scaffolding, boilerplate code, and file structures.",
    category: "commands",
    tags: ["scaffolding", "boilerplate", "generation"],
    file: "commands/scaffold/COMMAND.md",
  },

  // ─── Rules (6) ───────────────────────────────────────────────────
  {
    id: "accessibility-required",
    name: "Accessibility Required",
    description:
      "Enforces WCAG 2.1 AA accessibility standards including semantic HTML, keyboard navigation, and color contrast.",
    category: "rules",
    tags: ["a11y", "accessibility", "wcag", "aria"],
    file: "rules/accessibility-required/RULE.md",
  },
  {
    id: "error-boundaries",
    name: "Error Boundaries",
    description:
      "Requires React Error Boundaries for graceful error handling and preventing full app crashes.",
    category: "rules",
    tags: ["react", "error-handling", "boundaries", "resilience"],
    file: "rules/error-boundaries/RULE.md",
  },
  {
    id: "import-order",
    name: "Import Order",
    description:
      "Enforces consistent import ordering and grouping across 7 priority groups.",
    category: "rules",
    tags: ["imports", "organization", "style", "eslint"],
    file: "rules/import-order/RULE.md",
  },
  {
    id: "no-console",
    name: "No Console",
    description:
      "Disallows console.log in production code; requires proper structured logging infrastructure.",
    category: "rules",
    tags: ["console", "logging", "production", "pino"],
    file: "rules/no-console/RULE.md",
  },
  {
    id: "react-patterns",
    name: "React Patterns",
    description:
      "Enforces modern React patterns including hooks, composition, and state management best practices.",
    category: "rules",
    tags: ["react", "patterns", "hooks", "composition"],
    file: "rules/react-patterns/RULE.md",
  },
  {
    id: "typescript-strict",
    name: "TypeScript Strict",
    description:
      "Enforces strict TypeScript with proper typing, no any, strict null checks, and discriminated unions.",
    category: "rules",
    tags: ["typescript", "strict", "types", "no-any"],
    file: "rules/typescript-strict/RULE.md",
  },

  // ─── Prompts (5) ─────────────────────────────────────────────────
  {
    id: "bug-report",
    name: "Bug Report",
    description:
      "Generates structured bug reports with reproduction steps, environment info, and severity classification.",
    category: "prompts",
    tags: ["bug", "issue", "reporting", "reproduction"],
    file: "prompts/bug-report/PROMPT.md",
  },
  {
    id: "commit-message",
    name: "Commit Message",
    description:
      "Generates conventional commit messages with proper type, scope, and subject formatting.",
    category: "prompts",
    tags: ["commit", "git", "conventional-commits"],
    file: "prompts/commit-message/PROMPT.md",
  },
  {
    id: "feature-spec",
    name: "Feature Spec",
    description:
      "Generates detailed feature specifications with user stories, acceptance criteria, and technical design.",
    category: "prompts",
    tags: ["feature", "specification", "planning", "user-stories"],
    file: "prompts/feature-spec/PROMPT.md",
  },
  {
    id: "pr-description",
    name: "PR Description",
    description:
      "Generates comprehensive pull request descriptions with change summaries and review checklists.",
    category: "prompts",
    tags: ["pr", "git", "documentation", "review"],
    file: "prompts/pr-description/PROMPT.md",
  },
  {
    id: "release-notes",
    name: "Release Notes",
    description:
      "Generates user-facing release notes with highlights, features, fixes, and migration instructions.",
    category: "prompts",
    tags: ["release", "changelog", "documentation", "migration"],
    file: "prompts/release-notes/PROMPT.md",
  },

  // ─── Integrations (5) ────────────────────────────────────────────
  {
    id: "excel-mcp",
    name: "Excel MCP Server",
    description:
      "MCP server that gives AI assistants full Excel capabilities — create, read, and modify spreadsheets, formulas, charts, and pivot tables without Microsoft Excel installed.",
    category: "integration",
    tags: ["excel", "mcp", "spreadsheet", "data", "charts"],
    file: "integrations/excel-mcp/INTEGRATION.md",
  },
  {
    id: "massgen",
    name: "MassGen",
    description:
      "Multi-agent AI coordination — run Claude, GPT-5, Gemini, and Grok in parallel on the same task, share insights between agents, and reach consensus through voting.",
    category: "integration",
    tags: ["multi-agent", "orchestration", "llm", "parallel", "consensus"],
    file: "integrations/massgen/INTEGRATION.md",
  },
  {
    id: "obsidian",
    name: "claude-obsidian",
    description:
      "Second brain integration — drop files in .raw/, Claude organises them into a searchable wiki. Persistent memory across all sessions.",
    category: "integration",
    tags: ["obsidian", "memory", "second-brain", "knowledge-base", "wiki"],
    file: "integrations/obsidian/INTEGRATION.md",
  },
  {
    id: "claude-mem",
    name: "claude-mem",
    description:
      "Session memory tool — ~10x token savings by automatically compressing and injecting past session context into new conversations.",
    category: "integration",
    tags: ["memory", "session", "tokens", "context", "claude-mem"],
    file: "integrations/claude-mem/INTEGRATION.md",
  },
  {
    id: "graphify",
    name: "graphify",
    description:
      "Knowledge graph for large codebases — 71x token reduction by representing your codebase as a graph that AI can traverse efficiently.",
    category: "integration",
    tags: ["knowledge-graph", "codebase", "tokens", "graphify", "large-codebase"],
    file: "integrations/graphify/INTEGRATION.md",
  },
];

export const categories = {
  skills: {
    name: "Skills",
    icon: "⚡",
    description:
      "Reusable knowledge and best practices for common development tasks.",
    color: "var(--accent-purple)",
  },
  agents: {
    name: "Agents",
    icon: "🤖",
    description: "Specialized AI agents for specific development workflows.",
    color: "var(--accent-cyan)",
  },
  commands: {
    name: "Commands",
    icon: "⌘",
    description: "Quick actions and shortcuts for common operations.",
    color: "var(--accent-green)",
  },
  rules: {
    name: "Rules",
    icon: "📏",
    description: "Coding standards and linting rules to enforce consistency.",
    color: "var(--accent-orange)",
  },
  prompts: {
    name: "Prompts",
    icon: "💬",
    description: "Pre-built prompts for generating documentation and content.",
    color: "var(--accent-pink)",
  },
  integration: {
    name: "Integrations",
    icon: "🔌",
    description: "MCP servers, memory tools, and external AI tool integrations.",
    color: "var(--accent-yellow)",
  },
} as const;

export type CategoryId = keyof typeof categories;

export function getSkillsByCategory(categoryId: CategoryId): Skill[] {
  return catalog.filter((skill) => skill.category === categoryId);
}

export function getSkillById(id: string): Skill | undefined {
  return catalog.find((skill) => skill.id === id);
}

export function searchSkills(query: string): Skill[] {
  const lower = query.toLowerCase();
  return catalog.filter(
    (skill) =>
      skill.name.toLowerCase().includes(lower) ||
      skill.description.toLowerCase().includes(lower) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(lower)),
  );
}

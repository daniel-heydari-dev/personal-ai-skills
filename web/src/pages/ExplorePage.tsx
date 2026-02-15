import { Link } from "react-router-dom";
import {
  categories,
  getSkillsByCategory,
  type CategoryId,
} from "../data/catalog";
import styles from "./ExplorePage.module.css";

const categoryDetails: Record<
  CategoryId,
  {
    what: string;
    why: string;
    how: string;
    highlights: string[];
    beforeCode: string;
    afterCode: string;
    beforeLabel: string;
    afterLabel: string;
  }
> = {
  skills: {
    what: "Skills are reusable knowledge modules that teach your AI assistant best practices, patterns, and conventions for specific domains. Each skill is a Markdown file loaded into the assistant's context.",
    why: "Instead of repeating the same instructions every session, skills give your assistant permanent expertise — consistent, battle-tested patterns that improve every interaction.",
    how: "Install a skill with the CLI, and it's automatically loaded when your assistant starts. Skills cover everything from TypeScript strictness to React patterns to accessibility standards.",
    highlights: [
      "18 production-ready knowledge modules",
      "Covers frontend, backend, testing & DevOps",
      "Stack-specific variants for Node, Go, Rust, Python",
      "Works with Copilot, Claude, Gemini & Cursor",
    ],
    beforeLabel: "Without skills — generic advice",
    afterLabel: "With clean-typescript skill",
    beforeCode: `// AI suggests loose patterns
function getUser(id) {
  return fetch("/api/users/" + id)
    .then(res => res.json())
}`,
    afterCode: `// AI follows strict TypeScript patterns
async function getUser(id: UserId): Promise<Result<User, ApiError>> {
  const response = await fetch(\`/api/users/\${encodeURIComponent(id)}\`);
  if (!response.ok) {
    return err(new ApiError(response.status, await response.text()));
  }
  return ok(userSchema.parse(await response.json()));
}`,
  },
  agents: {
    what: "Agents are specialized AI personas with deep expertise in a specific domain. Each agent has a defined role, capabilities, and response style — like having a senior specialist on your team.",
    why: "A generalist AI gives generic answers. An agent configured as an architect, security auditor, or performance optimizer delivers focused, actionable guidance tailored to its domain.",
    how: "Agents are loaded as system prompts. When activated, the AI adopts the agent's persona and follows its domain-specific guidelines for every response.",
    highlights: [
      "8 expert personas covering the full dev lifecycle",
      "Each agent has specialized capabilities & focus areas",
      "Includes code reviewer, architect, and security auditor",
      "Agents can be combined with skills for deeper expertise",
    ],
    beforeLabel: "Generic AI review",
    afterLabel: "With code-reviewer agent",
    beforeCode: `"This code looks fine. You might want
to add some error handling."`,
    afterCode: `"## Code Review: UserService.ts

**Severity: Medium** — 3 issues found

1. **Missing error boundary** (L42): The \`fetchUser\`
   call has no try/catch. Wrap in Result type.
2. **N+1 query** (L67): \`getOrders()\` inside a
   loop — use batch query instead.
3. **Type narrowing** (L89): Prefer discriminated
   unions over type assertions.

**Suggested fix for #1:**
\`\`\`ts
const result = await tryCatch(() => fetchUser(id));
\`\`\`"`,
  },
  commands: {
    what: "Commands are predefined task templates that give your AI assistant a clear workflow for common development operations — code review, refactoring, test generation, and more.",
    why: "Instead of crafting the perfect prompt every time, commands provide structured, repeatable workflows that produce consistent, high-quality results.",
    how: "Run a command through your AI assistant's interface. The command template guides the AI through a step-by-step process with specific instructions for each phase.",
    highlights: [
      "8 ready-to-use task workflows",
      "Structured multi-step processes",
      "Includes code review, refactor, and scaffold commands",
      "Each command produces consistent, actionable output",
    ],
    beforeLabel: "Vague request",
    afterLabel: "With generate-tests command",
    beforeCode: `"Write some tests for my UserService"`,
    afterCode: `"## Test Plan: UserService

### Unit Tests (12 cases)
✓ createUser — valid input returns User
✓ createUser — duplicate email throws ConflictError
✓ createUser — missing fields throws ValidationError
✓ getUser — existing ID returns User
✓ getUser — unknown ID returns null
...

### Integration Tests (4 cases)
✓ Full CRUD lifecycle
✓ Concurrent access handling

### Edge Cases (3 cases)
✓ Unicode in display name
✓ Max-length email boundary
✓ Rate limit exceeded"`,
  },
  rules: {
    what: "Rules are enforceable coding standards that your AI assistant follows in every response. They act like an automated style guide — ensuring consistency across your entire codebase.",
    why: "Teams waste hours debating style and patterns. Rules codify decisions once, and the AI enforces them automatically — no more inconsistent code reviews.",
    how: "Rules are loaded into the AI's context alongside other instructions. When generating or reviewing code, the AI checks against all active rules and flags violations.",
    highlights: [
      "6 enforceable coding standards",
      "Covers TypeScript, React, imports & accessibility",
      "Each rule includes rationale and examples",
      "Automatically applied during code generation",
    ],
    beforeLabel: "Without rules — inconsistent",
    afterLabel: "With import-order + no-console rules",
    beforeCode: `import { helper } from './utils'
import React from 'react'
import axios from 'axios'
import { Button } from '../components'

console.log("fetching data...")
const data = await axios.get('/api')`,
    afterCode: `// 1. Node built-ins  2. External  3. Internal  4. Relative
import React from 'react';
import axios from 'axios';

import { Button } from '@/components';
import { helper } from './utils';

logger.info('fetching data...');
const data = await axios.get('/api');`,
  },
  prompts: {
    what: "Prompts are fill-in-the-blank templates for generating structured content — commit messages, PR descriptions, bug reports, release notes, and feature specs.",
    why: "Good documentation and communication are force multipliers. Prompts ensure every commit message, PR, and bug report follows a consistent, informative format.",
    how: "Select a prompt template, fill in the variables (like {feature_name} or {changes}), and the AI generates polished, structured content ready to use.",
    highlights: [
      "5 content generation templates",
      "Covers commits, PRs, bugs, releases & specs",
      "Consistent formatting across your team",
      "Variables make templates reusable",
    ],
    beforeLabel: "Ad-hoc commit message",
    afterLabel: "With commit-message prompt",
    beforeCode: `git commit -m "fixed stuff"`,
    afterCode: `git commit -m "fix(auth): prevent session fixation
on OAuth callback

- Regenerate session ID after successful OAuth exchange
- Add CSRF token validation to callback endpoint
- Update session store to invalidate old tokens

Closes #847"`,
  },
};

export function ExplorePage() {
  return (
    <div className={styles.explore}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Everything in the <span className={styles.heroAccent}>AI Skills</span>{" "}
          Catalog
        </h1>
        <p className={styles.heroSub}>
          Browse all 45 templates across 5 categories. Each section explains
          what it is, why it matters, and shows real before &amp; after examples
          so you know exactly what to expect.
        </p>
        <nav className={styles.jumpNav}>
          {(Object.keys(categories) as CategoryId[]).map((catId) => (
            <a key={catId} href={`#${catId}`} className={styles.jumpLink}>
              <span className={styles.jumpIcon}>{categories[catId].icon}</span>
              {categories[catId].name}
            </a>
          ))}
        </nav>
      </section>

      {/* Category sections */}
      {(Object.keys(categories) as CategoryId[]).map((catId) => {
        const cat = categories[catId];
        const items = getSkillsByCategory(catId);
        const details = categoryDetails[catId];

        return (
          <section key={catId} className={styles.categorySection} id={catId}>
            {/* Category header */}
            <div className={styles.catHeader}>
              <span className={styles.catIcon}>{cat.icon}</span>
              <div>
                <h2 className={styles.catTitle}>{cat.name}</h2>
                <p className={styles.catDesc}>{cat.description}</p>
              </div>
              <span className={styles.catCount}>{items.length}</span>
            </div>

            {/* What / Why / How */}
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoLabel}>What</h3>
                <p>{details.what}</p>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.infoLabel}>Why</h3>
                <p>{details.why}</p>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.infoLabel}>How</h3>
                <p>{details.how}</p>
              </div>
            </div>

            {/* Highlights */}
            <ul className={styles.highlights}>
              {details.highlights.map((h, i) => (
                <li key={i} className={styles.highlight}>
                  <span className={styles.highlightCheck}>✓</span>
                  {h}
                </li>
              ))}
            </ul>

            {/* Before / After code */}
            <div className={styles.codeCompare}>
              <div className={styles.codeBefore}>
                <span className={styles.codeLabel}>{details.beforeLabel}</span>
                <pre>
                  <code>{details.beforeCode}</code>
                </pre>
              </div>
              <div className={styles.codeArrow} aria-hidden="true">
                →
              </div>
              <div className={styles.codeAfter}>
                <span className={styles.codeLabel}>{details.afterLabel}</span>
                <pre>
                  <code>{details.afterCode}</code>
                </pre>
              </div>
            </div>

            {/* Items grid */}
            <div className={styles.itemsGrid}>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/${catId}/${item.id}`}
                  className={styles.itemCard}
                >
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemArrow}>→</span>
                </Link>
              ))}
            </div>

            {/* View category link */}
            <Link to={`/${catId}`} className={styles.viewCategory}>
              View all {cat.name.toLowerCase()}
              <span className={styles.viewArrow}>→</span>
            </Link>
          </section>
        );
      })}

      {/* Install CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Start in 30 seconds</h2>
        <p className={styles.ctaSub}>
          Pick any combination of skills, agents, commands, rules, and prompts.
          The CLI handles the rest — auto-detects your editors and generates
          bridge files.
        </p>
        <div className={styles.ctaCode}>
          <code>npx personal-ai-skills</code>
        </div>
      </section>
    </div>
  );
}

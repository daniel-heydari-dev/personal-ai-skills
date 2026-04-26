# {{PROJECT_NAME}} — Root Spec

<!--
  ROOT SPEC — target ~150 tokens when filled in.
  This file is ALWAYS loaded (referenced from CLAUDE.md).
  Its job: tell the AI what the app is, what stack it uses,
  and what rules are non-negotiable. Nothing more.

  FOUR-TIER LOADING (where this file fits):
    Tier 1: SPEC.md (this file)            ← always loaded, ~150 tokens
    Tier 2: docs/spec/<feature>/SPEC.md    ← loaded on keyword match
    Tier 3: .ai/skills/<name>/SKILL.md     ← loaded on topic match
    Tier 4: ~/ai-brain/wiki/projects/...   ← loaded only on explicit ask

  FILLING IN THIS FILE:
    - "What it is"  → 2–3 sentences max. What problem does it solve? Who uses it?
    - "Stack"       → list every major technology. Be specific (Next.js 15, not "React").
    - "Key Rules"   → invariants that MUST NEVER be broken. 3–6 rules max.
                      Bad rule: "write clean code" (too vague)
                      Good rule: "always filter by orgId — never return cross-tenant data"
                      Good rule: "currency is always cents (integer) — never floats"
                      Good rule: "all dates stored and returned as UTC ISO-8601"
    - "Spec Map"    → auto-updated by `npx personal-ai-skills init spec <name>`
                      Add keywords so Claude knows WHEN to load each sub-spec.
                      When a spec gets too dense → move history to Tier 4 (brain).
-->

## What it is

{{ONE_LINE_DESCRIPTION}}

<!--
  EXAMPLE:
  Multi-tenant SaaS for warehouse inventory management.
  B2B, serving 50+ enterprise clients. Each client (org) is fully isolated.
-->

## Stack

{{TECH_STACK}}

<!--
  EXAMPLE:
  - Next.js 15 (App Router), TypeScript strict
  - PostgreSQL + Prisma ORM
  - Stripe for billing, Resend for email
  - Deployed on Vercel, DB on Supabase
-->

## Key Rules

<!--
  List 3–6 non-negotiable invariants. These apply to EVERY response.
  Format: one short sentence each. No vague style preferences here.
-->

- [Add a non-negotiable invariant, e.g. "Always filter by orgId — never query without it"]
- [e.g. "Currency is always cents (integer) — never floats"]
- [e.g. "All dates stored and returned as UTC ISO-8601"]

<!--
  EXAMPLES OF GOOD KEY RULES:
  - Multi-tenant: always filter by orgId — never query without it
  - Currency: always use cents (integer) — never store or return floats
  - Dates: always UTC — convert to local time only in the UI layer
  - Auth: every protected route calls requireAuth() before any DB query
  - Validation: all user input validated at the API boundary with Zod
  - Errors: never expose stack traces or internal errors to the client
-->

---

## 🗺️ Spec Map

> Load the matching sub-spec when the user's task mentions these keywords.
> Run `npx personal-ai-skills init spec <name>` to scaffold a new one.

| Topic               | Keywords to watch for                   | Load this file                     |
| ------------------- | --------------------------------------- | ---------------------------------- |
| auth, login, session | auth, login, logout, JWT, password     | `docs/spec/auth/SPEC.md`           |

<!--
  EXAMPLE ROWS (add/remove as needed):
  | Auth & sessions     | auth, login, logout, JWT, OAuth, session | docs/spec/auth/SPEC.md         |
  | Inventory           | inventory, stock, SKU, warehouse, location | docs/spec/inventory/SPEC.md   |
  | Dashboard           | dashboard, chart, metric, analytics      | docs/spec/dashboard/SPEC.md    |
  | Billing             | billing, stripe, invoice, plan, payment  | docs/spec/billing/SPEC.md      |
  | API design          | api, route, endpoint, REST, response     | docs/spec/api/SPEC.md          |
  | Shared components   | component, design system, UI, layout     | docs/spec/shared/SPEC.md       |
-->

---

## 🗺️ Skills Map

> Load the matching skill when the task involves this technology.
> Install skills with: `npx personal-ai-skills add <skill-name>`

| When working on                 | Load this skill                         |
| ------------------------------- | --------------------------------------- |
| React components, hooks, state  | `.ai/skills/modern-react/`              |
| API routes, REST, validation    | `.ai/skills/api-design/`                |
| TypeScript patterns, types      | `.ai/skills/clean-typescript/`          |
| Tests, coverage, test design    | `.ai/skills/testing-best-practices/`    |

<!--
  Only list skills that are actually installed in .ai/skills/.
  Add rows as you install more: npx personal-ai-skills add <skill>
-->

---

## 🗺️ Obsidian Map

> Load from the second brain when the user asks about past decisions or project history.
> Never auto-load. Reference specific files only.

| Topic                       | Load this file                                            |
| --------------------------- | --------------------------------------------------------- |
| Architecture decisions      | `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/decisions.md` |
| Session cache (recent work) | `~/ai-brain/wiki/hot.md`                                 |

<!--
  Update the path above if your Obsidian vault is not at ~/ai-brain/.
  Add rows as you build up notes in your second brain.
-->

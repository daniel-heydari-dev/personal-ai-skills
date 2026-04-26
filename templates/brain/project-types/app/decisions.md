---
tags: [decisions, erp-pro]
---

# erp-pro — Decisions

## ADR-001: Use erp-pro-ui for all UI components

**Decision:** All UI primitives (buttons, inputs, dialogs, tables) come from the shared `erp-pro-ui` package.

**Why:** Avoids duplicating component logic across the app. Design consistency guaranteed at the package level.
One place to fix bugs, one place to update styles.

**Consequences:** erp-pro frontend is version-pinned to `erp-pro-ui ^0.1.8`. Breaking changes in `erp-pro-ui` require a consumer update.

---

## ADR-002: TanStack Query for all data fetching

**Decision:** All API calls go through `@tanstack/react-query` query and mutation hooks.

**Why:** Provides caching, background refetch, loading/error states, and optimistic updates consistently.
Eliminates ad-hoc useEffect + fetch patterns that caused stale-data bugs.

**Consequences:** No raw `fetch` outside of query functions. All API logic lives in `src/queries/` or colocated with the feature.

---

## ADR-003: Zod for all form validation

**Decision:** All form schemas defined with Zod and connected via `@hookform/resolvers/zod`.

**Why:** Type-safe validation that shares schema between client and backend (when backend adopts Zod).
Validation errors are typed, not strings.

**Consequences:** No ad-hoc regex or conditional validation. Zod schema = source of truth for form shape.

---

## ADR-004: i18next for all user-visible strings

**Decision:** Every UI string goes through `i18next`. No hardcoded text in JSX.

**Why:** Multi-language support from the start. Makes it trivial to add new locales without touching JSX.

**Consequences:** All strings must have translation keys. New features require updating locale files.

---

## ADR-005: Tailwind v4 CSS-first (no `tailwind.config.js`)

**Decision:** Using Tailwind 4 Vite plugin approach — configuration lives in CSS, not a JS config file.

**Why:** Faster builds, better IDE integration, inherits erp-pro-ui token system cleanly.

**Consequences:** Developers must know Tailwind v4 CSS-first syntax. Tailwind v3 patterns (config-based theme extension) won't work.

---

## ADR-006: Monorepo separation (frontend + backend as workspace)

**Decision:** Backend and frontend are sibling folders in the same git repo, coordinated by root `package.json`.

**Why:** Single repo, single PR, shared deployment pipeline. Easy to keep API contracts in sync.

**Consequences:** Backend and frontend must not cross-import. Backend is Node.js/CJS, frontend is ESM — they are separate processes.

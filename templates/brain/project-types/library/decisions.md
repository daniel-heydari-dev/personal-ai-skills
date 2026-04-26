---
tags: [decisions, erp-pro-ui]
---

# erp-pro-ui — Decisions

## ADR-001: Turborepo + pnpm workspaces (not Lerna or Nx)

**Decision:** Monorepo managed with Turborepo + pnpm workspaces. Apps consume packages via `"workspace:*"`.

**Why:** Turbo's caching is faster than Nx for our scale, simpler config than Lerna. pnpm avoids the duplicate-install penalty of npm/yarn for monorepos.

**Consequences:** Contributors need pnpm installed. Turbo cache must be invalidated on shared-config changes (pipelines defined in `turbo.json`).

---

## ADR-002: Tailwind v4 CSS-first (no `tailwind.config.js`)

**Decision:** Tailwind 4 Vite plugin, configuration in CSS via `@theme`. No JS config file.

**Why:** Faster builds, better IDE integration, simpler consumer setup. Single CSS entry (`erp-pro-ui/styles.css`) ships all tokens — consumers do not duplicate config.

**Consequences:** Tailwind v3 patterns (`extend.colors` in JS) won't work. Consumers must import `tailwindcss` then `erp-pro-ui/styles.css` (order matters).

---

## ADR-003: Public API only via `packages/ui/src/index.ts`

**Decision:** Every exported symbol goes through the package barrel. No deep imports allowed in consumer apps.

**Why:** Lets us refactor internal file structure without breaking consumers. Tree-shakeable via named exports.

**Consequences:** New components must be added to `index.ts` to be usable. Internal-only utilities stay un-exported.

---

## ADR-004: Optional peer deps for heavy libs (framer-motion, three, react-table)

**Decision:** `framer-motion`, `@tanstack/react-table`, and `three` are declared as **optional peer deps**, not direct dependencies.

**Why:** Consumers that don't use motion/3D/table components shouldn't pay the bundle cost. Apps that need them already install them directly.

**Consequences:** Components using these libs must handle the peer-missing case (or document the requirement). Storybook and demo app install all optionals explicitly.

---

## ADR-005: Storybook 10 as primary documentation

**Decision:** Storybook (`@storybook/react-vite` v10.2) is the primary docs surface. Stories live alongside components in `packages/ui/`.

**Why:** Stories double as visual tests and live-edit playground. Consumers can run Storybook locally to explore the API without touching the demo app.

**Consequences:** Every new component requires `<Name>.stories.tsx`. Storybook config must stay in sync with the Vite config used by the package.

---

## ADR-006: Strict TypeScript — zero `.js`/`.d.ts` artifacts in `packages/ui/src/`

**Decision:** No stale build artifacts in source. M4 deliverable enforced this.

**Why:** Mixed JS and stale `.d.ts` files caused incorrect type inference in consumer apps. Source must be exclusively `.ts`/`.tsx`.

**Consequences:** Build outputs go to `dist/` only. Pre-commit hook (or lint rule) should catch stray artifacts.

---

## ADR-007: Dark mode via `[data-theme="dark"]` attribute (not `class="dark"`)

**Decision:** Dark mode toggled by setting `data-theme="dark"` on `<html>` (not `class="dark"`).

**Why:** Decouples theme from Tailwind's class-based dark mode. Allows future theme variants (`light`, `dark`, `high-contrast`, brand variants) without class conflicts.

**Consequences:** Consumers must use `ThemeProvider` from `erp-pro-ui` or set the attribute manually. Tailwind's default `dark:` prefix is configured to read the data attribute.

---

## Open Decisions (see [[changelog]] roadmap)

- **Publish mode:** internal-only (`private: true`) vs npm publish with Changesets
- **Demo migration:** migrate `apps/web/tailwind/` JSX demos into `erp-pro-ui` proper, or keep them in the demo app only
- **Component priority order** for post-M5 work

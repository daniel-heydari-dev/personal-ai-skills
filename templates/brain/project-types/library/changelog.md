---
tags: [changelog, erp-pro-ui]
---

# erp-pro-ui — Changelog

## v0.1.8 (current)

- M4 complete: TypeScript cleanup across all components
- Removed stale `.js`, `.d.ts`, `.d.ts.map` artifacts alongside `.ts`/`.tsx` sources
- Fixed icon types — all icons use `SVGProps<SVGSVGElement>` with `title`/`titleId`
- Zero typecheck errors across entire monorepo

## v0.1.x history

- M3: Demo app (`apps/web`) with full route structure and theme toggle
- M2: 40+ core components — Button, Input, Select, Dialog, DataTable, Calendar, Form, etc.
- M1: Storybook loading stories from `packages/ui`, Tailwind working in preview
- M0: Turborepo bootstrap, pnpm workspaces, shared configs, `erp-pro-ui` exports + styles entry

---

## Breaking Changes

### Tailwind v4 migration

Tailwind v4 CSS-first approach — no `tailwind.config.js`.

Consumers must:

1. Remove `tailwind.config.js` (or keep for non-erp-pro-ui config only)
2. Add to their stylesheet:

```css
@import 'tailwindcss';
@import 'erp-pro-ui/styles.css';
```

3. Use `@theme` directive for custom tokens (not `extend` in config)

---

## Roadmap

### M5: Demo TS Migration (in progress)

- Convert 90+ JSX demo files in `apps/web/tailwind/` to TypeScript (`.tsx`)
- Re-enable Animations, Text Animations, Components, Backgrounds demo categories
- No breaking changes to `erp-pro-ui` package exports

### Open Decisions

- Publish mode: internal-only (`private: true`) vs npm publish with Changesets
- Whether to migrate tailwind demo components into `erp-pro-ui` proper or keep in demo app
- Component roadmap priority order for post-M5

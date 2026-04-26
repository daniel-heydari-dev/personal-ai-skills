---
tags: [project, active, ui-library, component-library]
status: active
stack: React 19, Vite 7, Tailwind 4, Turborepo, Storybook 10
---

# erp-pro-ui

## What It Is

Professional UI component library for the erp-pro SaaS ecosystem (Tools Store Management).
Fully TypeScript. Production-grade components. Consumed by `erp-pro` frontend via npm package `erp-pro-ui`.

## Stack

| Layer | Technology | Version |
| --- | --- | --- |
| UI Framework | React | 19.2 |
| Bundler | Vite | 7.3 |
| Styling | Tailwind CSS (CSS-first, Vite plugin) | 4.1 |
| Docs | Storybook (`@storybook/react-vite`) | 10.2.x |
| Monorepo | Turborepo + pnpm workspaces | — |
| Testing | Vitest + React Testing Library | — |

## Monorepo Structure

```text
erp-pro-ui/                     (at ~/Home/turbo-ui-kit)
├── apps/
│   ├── web/                    # Vite + React demo app
│   ├── api/                    # Mock API server
│   └── storybook/              # Storybook docs + sandbox
└── packages/
    ├── ui/                     # erp-pro-ui — main component library
    ├── shared/                 # @erp-pro/shared — utilities
    ├── tsconfig/               # Shared TS configs
    ├── eslint-config/          # Shared lint rules
    ├── prettier-config/        # Shared formatting
    └── vite-config/            # Shared Vite + Tailwind config helpers
```

## Consumer API

```tsx
import { Button } from 'erp-pro-ui';
```

```css
@import 'tailwindcss';
@import 'erp-pro-ui/styles.css';
```

Only export from `packages/ui/src/index.ts`. Avoid deep imports in consumer apps.

## Commands

```bash
# from turbo-ui-kit/
pnpm dev              # run all apps in parallel
pnpm build            # build all packages (cached)
pnpm typecheck        # TypeScript validation (cached)
pnpm lint             # ESLint (cached)
pnpm storybook        # open Storybook dev server
pnpm build-storybook  # static Storybook build
```

## Key Rules

- All components must be fully TypeScript — no `.js` files in `packages/ui/src/`
- Export ONLY from `packages/ui/src/index.ts` — no deep imports
- Components must be: Typed, Accessible (ARIA), Composable, Themeable (CSS vars)
- Styling via Tailwind v4 CSS-first — no inline styles
- No stale `.js`, `.d.ts`, `.d.ts.map` files alongside `.ts`/`.tsx` sources

## Milestones

| Phase | Status | Notes |
| --- | --- | --- |
| M0: Bootstrap | ✅ done | Monorepo, pipelines, exports |
| M1: Storybook | ✅ done | Stories from `packages/ui` |
| M2: Core Components | ✅ done | 40+ components |
| M3: Demo App | ✅ done | Route structure, theme toggle |
| M4: TypeScript Cleanup | ✅ done | Zero typecheck errors |
| M5: Demo TS Migration | 🔲 in progress | Convert 90+ JSX demos to TSX |

## Related Files

- [[components]] — full component catalog with props
- [[design-tokens]] — colors, spacing, typography tokens
- [[changelog]] — breaking changes and additions
- [[projects/shared/api-contracts]] — which projects consume this library

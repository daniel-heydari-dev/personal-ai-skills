---
tags: [project, active, erp, saas]
status: active
stack: React, Vite, Tailwind v4, Node.js, Express, MongoDB
---

# erp-pro

## What It Is

Full-stack ERP / Store Management SaaS. Handles inventory, products, users, and orders.
Frontend consumes `erp-pro-ui` for all UI components. Backend exposes a REST API.

## Stack

### Frontend (`front-end/`)

| Layer | Technology | Version |
| --- | --- | --- |
| Framework | React | 19.2 |
| Bundler | Vite | 8.x |
| Styling | Tailwind CSS v4 (Vite plugin) | 4.2 |
| Data fetching | TanStack React Query | 5.x |
| Tables | TanStack React Table | 8.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Routing | react-router-dom | 7.x |
| i18n | i18next + react-i18next | 26.x / 17.x |
| UI components | erp-pro-ui | ^0.1.8 |
| Drag & Drop | @dnd-kit/core + sortable | 6.x / 10.x |
| Animations | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 1.x |
| Primitives | Radix UI (Dialog, Select, Dropdown) | — |

### Backend (`back-end/`)

Node.js, Express, MongoDB/Mongoose, JWT auth, Cloudinary, Nodemailer.
*Backend detail coming — see `decisions.md` when filled.*

## Commands

```bash
# from root
pnpm --parallel --filter front-end... start --filter back-end... dev

# frontend only (from front-end/)
pnpm dev          # localhost:5173
pnpm build        # tsc --noEmit && vite build
pnpm lint
pnpm format

# deploy
pnpm deploy:develop:front
pnpm deploy:qa:front
pnpm deploy:production:frontend
```

## Key Rules

- All UI components come from `erp-pro-ui` — do not build from scratch
- Forms validated with Zod schemas — no ad-hoc validation
- Data fetching via TanStack Query — no raw fetch without a query hook
- i18n for all user-visible strings — no hardcoded UI text
- TypeScript strict — `tsc --noEmit` must pass before any build

## Related Files

- [[decisions]] — why we chose this stack
- [[architecture]] — data flow and module map
- [[api-contracts]] — APIs this app consumes (backend + third-party)
- [[dependencies]] — what this app depends on from other projects
- [[projects/shared/api-contracts]] — cross-project API contracts

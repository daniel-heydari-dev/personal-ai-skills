---
tags: [architecture, erp-pro]
---

# erp-pro — Architecture

## System Overview

```text
Browser
  └── erp-pro frontend (React/Vite, port 5173)
        ├── erp-pro-ui ^0.1.8      ← shared UI components
        ├── TanStack Query          ← data layer / caching
        ├── React Router v7         ← client-side routing
        └── i18next                 ← internationalization
              │
              │  REST API calls
              ▼
        erp-pro backend (Node.js/Express)
              ├── JWT auth middleware
              ├── Routes: /api/users, /api/products, ...
              ├── Mongoose models → MongoDB Atlas
              └── Cloudinary       ← image uploads
```

## Frontend Module Map

```text
front-end/src/
├── assets/           # Images, SVGs
├── components/       # Local reusable components (non-erp-pro-ui)
│   ├── icons/        # Generated icon components (from SVGr)
│   └── ui/           # App-level wrappers
├── hooks/            # Custom React hooks
├── pages/            # Route-level page components
│   └── dashboardPages/
│       ├── inventory/   # Inventory management
│       │   └── sub-pages/movements/  # Movement tracking with vitest
│       ├── products/    # Product catalog
│       └── users/       # User management
├── queries/          # TanStack Query hooks (data fetching)
├── schemas/          # Zod validation schemas
├── store/            # State management (if any)
├── utils/            # Pure helpers
└── i18n/             # Translation files
```

## Data Flow

```text
User action
  → React component (form/table/button)
  → Zod schema validation (forms only)
  → TanStack Query mutation / query
  → HTTP request to /api/...
  → Backend validates JWT
  → Mongoose query to MongoDB
  → Response cached by TanStack Query
  → Component re-renders
```

## Key Integrations

| Integration | Purpose | Notes |
| --- | --- | --- |
| erp-pro-ui | All UI primitives | Version-pinned ^0.1.8 |
| Cloudinary | Image storage | Backend handles upload |
| MongoDB Atlas | Primary DB | Via Mongoose ODM |
| Recharts | Dashboard charts | Direct in frontend |
| DnD Kit | Drag-and-drop UI | Used in inventory ordering |

## Deployment

| Environment | Frontend | Backend |
| --- | --- | --- |
| develop | `pnpm deploy:develop:front` | TBD |
| qa | `pnpm deploy:qa:front` | TBD |
| production | `pnpm deploy:production:frontend` | TBD |

*Full deployment spec: `wiki/projects/shared/deployment.md`*

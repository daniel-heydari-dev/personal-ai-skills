---
tags: [shared, api-contracts, cross-project]
---

# Cross-Project API Contracts

<!--
  THE MOST IMPORTANT FILE IN shared/
  ────────────────────────────────────
  This is how projects know about each other without reading each other's code.

  When erp-pro needs to use erp-pro-ui, Claude reads THIS file
  to know the exact import API and component shape — not the package source.

  When you add or change a component in erp-pro-ui:
    1. Update this file FIRST
    2. Update erp-pro-ui/components.md
    3. Check every consumer listed under "Who uses this"

  When Claude says "this change affects other projects", it found it here.
-->

## erp-pro-ui → erp-pro

erp-pro-ui PROVIDES the component library that erp-pro frontend CONSUMES.

**Version pinned:** `erp-pro-ui ^0.1.8` in `front-end/package.json`

### Installation

```bash
pnpm add erp-pro-ui
```

### Consumer setup

```css
@import 'tailwindcss';
@import 'erp-pro-ui/styles.css';
```

### Component API (key surfaces)

```tsx
// All imports from the package root — no deep imports
import { Button, Input, DataTable, Dialog, Select } from 'erp-pro-ui';
import { ThemeProvider, useThemeContext, cn } from 'erp-pro-ui';

// Theme
<ThemeProvider>
  <App />
</ThemeProvider>

// Example: DataTable
<DataTable
  columns={columnDefs}   // TanStack Table ColumnDef[]
  data={rows}            // T[]
  pagination={...}       // optional
/>

// Example: Button
<Button variant="primary" | "secondary" | "ghost" | "destructive"
        size="sm" | "md" | "lg"
        loading={bool}
        disabled={bool} />
```

**Impact rules:**
- Any change to a component's props interface = check erp-pro frontend usages
- New peer dep in erp-pro-ui = must also add to erp-pro frontend (or check peerDeps)
- CSS token rename in erp-pro-ui = check custom overrides in erp-pro frontend stylesheet

---

---

## auth-service → erp-pro (and any other web app)

`auth-service` is a standalone authentication microservice (see `wiki/projects/auth-service/`). erp-pro CONSUMES these endpoints from auth-service:

```text
POST /auth/login         → { user, accessToken, refreshToken }
POST /auth/register      → { userId, verifyEmailSent }
POST /auth/refresh       → { accessToken, refreshToken }   (rotates)
POST /auth/logout        → { ok: true }
GET  /auth/me            → { id, email, workspaceId, role, permissions[] }
POST /auth/verify        → { valid, userId, role, permissions[] }   (server-to-server JWT validation)
GET  /auth/roles/:id     → { role, permissions[] }
```

**Impact rules:**

- If `accessToken` claim shape changes (new claim added) → erp-pro frontend's auth context must read the new claim. Old claims always preserved.
- If a permission name changes → search for it in every consumer; this is a breaking change. Use a deprecation window.
- If a role is renamed → coordinate with all consumers BEFORE the rename. Roles are referenced by string in route guards.
- erp-pro never reaches into the auth-service database directly. All access is via the documented endpoints.

Full endpoint specs: `wiki/projects/auth-service/api-contracts.md`. Roles + permissions matrix: `wiki/projects/auth-service/roles-matrix.md`.

---

## Summary: Who Depends on Whom

```text
erp-pro (frontend)
      ↓ consumes npm package
erp-pro-ui

erp-pro (frontend) ──┐
                     │ calls REST API (auth)
                     ▼
                auth-service  ◀──── any other web app calling /auth/*
                     │
                     │ writes to
                     ▼
                PostgreSQL + Redis (private)

erp-pro (frontend)
      ↓ calls REST API (business logic)
erp-pro (backend)
```

**Reading this map:**

- `auth-service` is the most critical service — every consumer depends on it for login/RBAC
- `erp-pro-ui` is a shared dependency — breaking changes break erp-pro frontend
- erp-pro frontend is the primary consumer of erp-pro-ui (only consumer currently)
- Backend changes that alter API contracts must be reflected in erp-pro frontend queries
- erp-pro-ui changes never affect the backend or auth-service (safe to change without coordination)
- A breaking change in `auth-service` requires coordinating with every web app that consumes it

---

## Future Projects

When you add a new project that consumes erp-pro-ui or erp-pro's API, add a section here.

Pattern:

```markdown
## <source-project> → <consumer-project>

<source> PROVIDES ... that <consumer> CONSUMES.

...contract details...

**Impact:** If X changes, update Y.
```

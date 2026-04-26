---
tags: [dependencies, erp-pro]
---

# erp-pro — Dependencies

> What this app needs from other projects and external systems.

## Project Dependencies

| Dependency | Type | Version | Notes |
| --- | --- | --- | --- |
| erp-pro-ui | npm package | ^0.1.8 | All UI components |
| @erp-pro/shared | npm package | workspace (future) | Shared utilities |

## External Services

| Service | Used By | Required |
| --- | --- | --- |
| MongoDB Atlas | Backend | Yes — primary DB |
| Cloudinary | Backend | Yes — image storage |
| SMTP (Nodemailer) | Backend | Yes — email notifications |

## Environment Variables

See `wiki/projects/shared/env-vars.md` for the full list.

Key frontend vars:

```bash
VITE_API_URL=         # Backend API base URL
VITE_CLOUDINARY_*=    # Cloudinary public credentials (if any client-side upload)
```

## Upgrade Notes

- `erp-pro-ui` is currently `^0.1.8` — check for breaking changes before upgrading
  (Track releases at `wiki/projects/erp-pro-ui/changelog.md`)
- `TanStack Query` and `TanStack Table` should be upgraded together (same major)
- Tailwind v4 is locked — no tailwind.config.js; CSS-first only

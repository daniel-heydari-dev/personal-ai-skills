---
tags: [shared, deployment, devops]
---

# Deployment — All Projects

<!--
  DEPLOYMENT FILE
  ────────────────
  How the full system is deployed. Claude reads this before touching
  any deploy config, CI/CD, or infrastructure code.
-->

## Platform Summary

| Project | Platform | Trigger | URL |
|---|---|---|---|
| saas-app | Vercel | Push to `main` | https://app.myapp.com |
| landing-page | Vercel | Push to `main` | https://myapp.com |
| auth-service | Railway (Docker) | Push to `main` | https://auth.myapp.com |
| ui-library | npm (private) | Manual `pnpm publish` | `@my-org/ui-library` |

## Environments

| Env | Branch | Auth service | DB |
|---|---|---|---|
| Production | `main` | https://auth.myapp.com | Supabase prod |
| Staging | `staging` | https://auth-staging.myapp.com | Supabase staging |
| Local | any | http://localhost:4000 | Docker Postgres |

## Deploy Order (when releasing the full system)

When multiple services change in one release:
```
1. ui-library  → publish new npm version
2. auth-service → deploy to Railway (DB migrations run automatically)
3. saas-app    → deploy to Vercel (picks up new ui-library + new auth API)
```
**Never deploy saas-app before auth-service** — it would call an API that doesn't exist yet.

## Auth Service (Railway + Docker)

```bash
# Build
docker build -t auth-service .

# Local run
docker-compose up

# Deploy: push to main → Railway auto-deploys via Dockerfile
```

DB migrations run as part of the startup command in `Dockerfile`:
```dockerfile
CMD ["sh", "-c", "pnpm migrate && node dist/server.js"]
```

## CI/CD (GitHub Actions)

Each project has `.github/workflows/ci.yml` that runs:
1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm build`

Vercel and Railway auto-deploy on push to `main` after CI passes.

## Rollback

- **Vercel:** dashboard → Deployments → click any previous deploy → "Promote to production"
- **Railway:** dashboard → Deployments → "Rollback" button
- **DB migrations:** no automatic rollback — write down/migrations manually

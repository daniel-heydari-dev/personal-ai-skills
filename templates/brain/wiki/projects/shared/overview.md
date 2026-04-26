---
tags: [project, shared, cross-project]
status: active
---

# shared — Cross-Project Patterns

<!--
  WHAT IS THE shared/ FOLDER?
  ────────────────────────────
  Some decisions, patterns, and rules apply to ALL your projects, not just one.
  Put those here. Claude loads this when you're working across projects
  or when a decision affects multiple repos.

  Examples of what lives here:
  - Git branching strategy you use on all projects
  - Code review standards
  - Deployment patterns (you always use Vercel/Railway/etc.)
  - API versioning conventions
  - How you handle secrets and environment variables
  - TypeScript config you copy between projects
-->

## Git Workflow (all projects)

- Branch naming: `feat/description`, `fix/description`, `chore/description`
- Commit format: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- PRs require: passing CI + at least 1 review before merge
- Never force-push to `main`
- Merge strategy: squash merge for features, merge commit for releases

## Code Review Standards

When reviewing or asking Claude to review code, apply these across all projects:

1. **Correctness** — does it do what it says?
2. **Security** — no injection, no leaked secrets, proper auth checks
3. **Performance** — no N+1 queries, no blocking the main thread
4. **Readability** — would a new dev understand this in 3 months?
5. **Tests** — critical paths must have tests

## Environment Variables Convention

All projects follow the same `.env` pattern:

```
# .env.example (committed — shows what vars exist, no values)
# .env.local (gitignored — real values for local dev)
# .env.production (never committed — set in deployment platform)

DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
```

## TypeScript Baseline

All projects use TypeScript strict mode. Shared `tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Deployment Platforms

| Type | Platform | Notes |
|---|---|---|
| Frontend / Next.js | Vercel | Auto-deploy on push to main |
| Backend / APIs | Railway | Docker-based, easy Postgres |
| Mobile | Expo EAS | TestFlight for iOS beta |

## Related

- [[concepts/ai-config-pattern]] — AI configuration pattern used in all projects
- [[entities/personal-ai-skills]] — tool that sets up AI config per project

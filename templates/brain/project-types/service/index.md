---
tags: [project, example, service, auth]
status: example
stack: Node.js, Fastify, PostgreSQL, JWT, Redis
---

# auth-service

## What It Is

Standalone authentication and authorization microservice. Handles user registration, login, password reset, JWT issuance, refresh-token rotation, role-based access control (RBAC), and 2FA. Consumed by every web application that needs auth — never roll your own.

## Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Runtime | Node.js | 20+ LTS |
| Framework | Fastify | 4.x |
| Database | PostgreSQL | 15+ (with Prisma) |
| Token store | Redis | 7.x (refresh tokens, rate limit) |
| Hashing | argon2id | — |
| JWT | `jose` | 5.x (ES256) |
| Email | Resend / SES | — for verification + password reset |
| Tests | vitest | — |

## Commands

```bash
pnpm dev                    # localhost:4000
pnpm build && pnpm start
pnpm test
pnpm db:migrate             # Prisma migrate dev
pnpm db:seed                # seed test users + roles
```

## Key Rules

- All passwords hashed with argon2id — never SHA, never bcrypt for new accounts
- Access tokens are short-lived (15 min); refresh tokens are long-lived (30d) and rotate on use
- All endpoints rate-limited via Redis (per-IP + per-account)
- Email verification required before any role assignment
- Roles are additive — least-privilege by default; explicit grant required
- Every authentication event logged (login, logout, refresh, role change) with IP + user-agent

## Related Files

- [[roles-matrix]] — who can do what
- [[api-contracts]] — APIs this service EXPOSES
- [[flows]] — login, register, refresh, 2FA flows
- [[projects/shared/api-contracts]] — which projects consume this service

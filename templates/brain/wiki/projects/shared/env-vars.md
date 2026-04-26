---
tags: [shared, environment, config]
---

# Environment Variables — All Projects

<!--
  ENV VARS FILE
  ──────────────
  Every environment variable across all projects.
  Claude reads this before asking "where does this config come from?"
  or when setting up a new dev environment.

  NEVER put actual values here — only variable names and descriptions.
  Actual values: .env.local (local dev), deployment platform (prod/staging).
-->

## Convention (all projects)

```
.env.example    ← committed — shows what vars exist (no values)
.env.local      ← gitignored — real values for local dev
.env.test       ← gitignored — values for test runs
```

Production/staging values: set in Vercel / Railway dashboard, never in files.

---

## auth-service

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db

# JWT
JWT_ACCESS_SECRET=           # RS256 private key (or HS256 secret for simplicity)
JWT_REFRESH_SECRET=          # separate secret for refresh tokens
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=4000
NODE_ENV=development | production

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000   # 1 minute
RATE_LIMIT_MAX=5             # per IP per window
```

---

## saas-app

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/saas_db

# Auth service (internal)
AUTH_SERVICE_URL=http://localhost:4000   # prod: https://auth.myapp.com
AUTH_SERVICE_INTERNAL_KEY=              # shared secret for service-to-service calls

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Next.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## client-mobile-app

```bash
# Auth service
EXPO_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000

# Expo
EAS_PROJECT_ID=
EXPO_PUBLIC_APP_ENV=development | production
```

---

## Shared Secrets

Some secrets need to be the same across multiple services:

| Secret | Used by | Why |
|---|---|---|
| `JWT_ACCESS_SECRET` | auth-service (sign), saas-app (verify) | Same key needed for verification |
| `AUTH_SERVICE_INTERNAL_KEY` | saas-app → auth-service | Service-to-service auth header |

> **Note:** saas-app verifying JWTs locally (without calling auth-service) requires sharing the JWT secret. Alternatively, saas-app can always call `/auth/verify` and never share the secret — simpler but adds a network hop.

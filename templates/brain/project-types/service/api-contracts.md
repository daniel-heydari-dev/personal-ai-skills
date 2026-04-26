---
tags: [auth-service, api-contracts, exposes]
---

# auth-service — API Contracts (Exposed)

> Endpoints this service PROVIDES to consumer apps.
> Cross-project consumers map: `projects/shared/api-contracts.md`.

Base URL (prod): `https://auth.example.com`
Auth header (most endpoints): `Authorization: Bearer <accessToken>`

## Public (no auth required)

### POST `/auth/register`

```http
POST /auth/register
{ "email": "ada@example.com", "password": "...", "workspaceId": "ws_xyz789" }

200 → { "userId": "user_abc123", "verifyEmailSent": true }
409 → { "error": "email_taken" }
422 → { "error": "weak_password", "rules": [...] }
```

### POST `/auth/login`

```http
POST /auth/login
{ "email": "...", "password": "...", "totp": "123456?" }

200 → {
  "user": { "id", "email", "workspaceId", "role", "permissions": [...] },
  "accessToken": "...",     // 15 min
  "refreshToken": "..."     // 30 days, rotates on use
}
401 → { "error": "invalid_credentials" }
401 → { "error": "totp_required" }      // when account has 2FA
403 → { "error": "email_not_verified" }
429 → { "error": "rate_limited", "retryAfter": 60 }
```

### POST `/auth/refresh`

```http
POST /auth/refresh
{ "refreshToken": "..." }

200 → { "accessToken": "...", "refreshToken": "..." }   // both rotate
401 → { "error": "refresh_token_invalid_or_expired" }   // forces re-login
```

### POST `/auth/password/forgot`

```http
POST /auth/password/forgot
{ "email": "..." }

200 → { "ok": true }   // always 200, no enumeration leak
```

### POST `/auth/password/reset`

```http
POST /auth/password/reset
{ "token": "<reset-token>", "newPassword": "..." }

200 → { "ok": true }   // also revokes all active refresh tokens
410 → { "error": "token_expired_or_used" }
```

## Authenticated (Bearer required)

### POST `/auth/logout`

```http
POST /auth/logout
Authorization: Bearer <accessToken>

200 → { "ok": true }   // revokes the refresh token
```

### GET `/auth/me`

```http
GET /auth/me

200 → { "id", "email", "name", "workspaceId", "role", "permissions": [...] }
```

### POST `/auth/verify`

For server-to-server token validation (consumer apps call this to check a JWT).

```http
POST /auth/verify
{ "token": "<accessToken>" }

200 → { "valid": true, "userId", "workspaceId", "role", "permissions": [...] }
401 → { "valid": false }
```

### GET `/auth/roles/:userId`

```http
GET /auth/roles/user_abc123
Authorization: Bearer <admin-or-owner-token>

200 → { "userId", "workspaceId", "role", "permissions": [...] }
403 → { "error": "insufficient_role" }
```

### POST `/auth/2fa/enable`, `/auth/2fa/verify`, `/auth/2fa/disable`

TOTP-based. Standard RFC 6238. QR provisioned with `otpauth://` URI.

## Errors

All errors share the shape `{ "error": "<code>", "message"?: "...", "fields"?: [...] }`. Consumers should switch on `error` code, never on message string.

## Versioning

- Path-versioned only when breaking changes ship: `/v2/auth/login`. Default unversioned path always points to the latest stable.
- Deprecation: 90-day window. `Sunset` header on responses + email to API consumers.

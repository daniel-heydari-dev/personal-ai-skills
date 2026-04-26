---
tags: [auth-service, flows, sequences]
---

# auth-service — Flows

> The actual sequences. When a consumer app needs to know what API calls to make in what order, this is the file.

## Registration + Email Verification

```text
User                  Consumer App                 auth-service                Email
 │                          │                            │                       │
 │ submit form              │                            │                       │
 │─────────────────────────▶│                            │                       │
 │                          │ POST /auth/register        │                       │
 │                          │───────────────────────────▶│                       │
 │                          │                            │  hash pw (argon2)     │
 │                          │                            │  insert user (unverified)
 │                          │                            │  generate verify token│
 │                          │                            │──────────────────────▶│
 │                          │                            │                       │ send link
 │                          │ 200 { verifyEmailSent }    │                       │
 │                          │◀───────────────────────────│                       │
 │ shown "check inbox"      │                            │                       │
 │◀─────────────────────────│                            │                       │
 │                          │                            │                       │
 │ clicks link              │                            │                       │
 │─────────────────────────────────────────────────────▶ │                       │
 │                          │                            │  mark email verified  │
 │                          │                            │  redirect to /login   │
 │ 302 to /login            │                            │                       │
 │◀─────────────────────────────────────────────────────│                       │
```

## Login (no 2FA)

```text
User → app → POST /auth/login {email, password}
                ↓
            verify password (argon2)
                ↓
            check email verified
                ↓
            issue accessToken (15m, JWT-ES256) + refreshToken (30d, opaque)
                ↓
            store refreshToken hash in Redis with TTL
                ↓
            return user + tokens
                ↓
        app stores accessToken (memory) + refreshToken (httpOnly cookie)
```

## Login (with 2FA)

```text
1st request:  POST /auth/login {email, password}     → 401 totp_required
              app shows TOTP input
2nd request:  POST /auth/login {email, password, totp: "123456"}
              auth-service verifies TOTP against stored secret (RFC 6238)
              → 200 with tokens (as above)
```

## Token Refresh (rotation)

```text
accessToken expires (15m elapsed)
        ↓
app → POST /auth/refresh {refreshToken}
        ↓
auth-service:
  - look up refreshToken hash in Redis
  - if missing/expired → 401, app redirects to login
  - if found:
      ▸ revoke old refreshToken (delete from Redis)
      ▸ issue new accessToken + new refreshToken (rotation)
      ▸ store new refreshToken hash with fresh TTL
        ↓
app stores both new tokens, retries the original request
```

If a stolen refresh token is used after the legitimate user already rotated, the second use lands on a missing key in Redis → 401 → user is force-logged-out (token reuse detection works passively via rotation).

## Logout

```text
app → POST /auth/logout (Bearer accessToken, body: {refreshToken})
        ↓
auth-service:
  - delete refreshToken from Redis (immediate revoke)
  - access token is short-lived; let it expire on its own
        ↓
app clears local accessToken + cookies
```

## Password Reset

```text
User clicks "forgot password" → app POST /auth/password/forgot {email}
                                  ↓ (always 200 to avoid enumeration)
                                  ↓ (if email exists)
                                  ↓ generate reset token (signed, 1h TTL)
                                  ↓ send email with /reset?token=...

User clicks email link → app collects newPassword
                       → POST /auth/password/reset {token, newPassword}
                                  ↓
                                  ↓ verify token signature + TTL + not-already-used
                                  ↓ hash new password (argon2)
                                  ↓ revoke ALL active refresh tokens (force re-login everywhere)
                                  ↓ mark token used (one-shot)
                                  ↓ 200
```

## Role Change

```text
admin → POST /admin/users/:id/role  {role: "manager"}
          ↓ (consumer app forwards to auth-service)
        auth-service:
          - verify caller has users:role-change permission
          - update users.role
          - if demotion: revoke all refresh tokens for target user
          - log audit event {actor, target, before, after, ip, ua}
          - return 200
```

Consumer apps should NOT cache role/permissions claims beyond the access-token lifetime (15 min). Demotions take effect within at most 15 min — sooner if the user's refresh tokens were revoked.

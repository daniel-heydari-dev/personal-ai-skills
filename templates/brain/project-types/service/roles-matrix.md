---
tags: [auth-service, rbac, roles]
---

# auth-service — Roles Matrix

> Source of truth for who can do what across every consumer app. When a role grants a permission, the JWT carries it as a claim.

## Roles

| Role | Inherits | Description |
| --- | --- | --- |
| `owner` | admin | Workspace owner. Billing + delete-workspace. One per workspace. |
| `admin` | manager | Manage users, roles, workspace settings. Cannot delete workspace. |
| `manager` | member | Manage team members within their unit. View all unit data. |
| `member` | viewer | Standard contributor. Read + write own resources. |
| `viewer` | — | Read-only. Cannot mutate anything. |
| `service` | — | Machine-to-machine. Bypasses 2FA, no UI session. |

## Permission Grid

| Permission | owner | admin | manager | member | viewer |
| --- | --- | --- | --- | --- | --- |
| `workspace:delete` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `workspace:billing` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `workspace:settings` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `users:invite` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `users:remove` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `users:role-change` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `data:read-all` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `data:read-own` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `data:write-own` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `data:export` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `audit:read` | ✅ | ✅ | ❌ | ❌ | ❌ |

## JWT Claim Format

```json
{
  "sub": "user_abc123",
  "workspaceId": "ws_xyz789",
  "role": "manager",
  "permissions": ["data:read-all", "data:write-own", "users:invite"],
  "iat": 1733664000,
  "exp": 1733664900
}
```

Consumer apps read `permissions` directly — never recompute from `role`.

## Promoting / Demoting

- Only `owner` can promote/demote `admin`.
- Only `admin+` can promote/demote `manager` and below.
- Role change is logged to `audit_events` table with actor + target + before/after.
- A role demotion immediately revokes all active refresh tokens for the target user (forces re-login).

## Invariants

- A workspace ALWAYS has exactly one `owner`. Transferring ownership is atomic (revoke + grant in one transaction).
- A user can have only ONE role per workspace (no role union).
- `service` accounts cannot be granted any human-only role and vice versa.

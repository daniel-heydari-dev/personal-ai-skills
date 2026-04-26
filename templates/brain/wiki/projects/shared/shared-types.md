---
tags: [shared, types, typescript]
---

# Shared TypeScript Types

<!--
  SHARED TYPES
  ─────────────
  TypeScript types that multiple projects use.
  When Claude writes code for any project, it checks here for existing types
  before creating new ones that duplicate what already exists.

  Actual source of truth: @my-org/shared-types package (if it exists)
  or copy-paste between projects (record which projects use which types here).
-->

## User & Auth Types

```typescript
// Used by: auth-service, saas-app, client-mobile-app
type Role = "owner" | "admin" | "member" | "viewer";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  workspaceId: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface JWTPayload {
  sub: string;           // userId
  workspaceId: string;
  role: Role;
  permissions: string[];
  iat: number;
  exp: number;
}
```

## API Response Types

```typescript
// Used by: all projects — standard response envelope
interface ApiSuccess<T> {
  data: T;
  ok: true;
}

// RFC 7807 Problem Details — used by auth-service
interface ApiError {
  type: string;          // URI identifying the error type
  title: string;         // human-readable summary
  status: number;        // HTTP status code
  detail?: string;       // specific detail for this occurrence
}
```

## Pagination

```typescript
// Used by: saas-app DataTable, auth-service admin endpoints
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface PaginationParams {
  page?: number;         // default: 1
  pageSize?: number;     // default: 20, max: 100
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
```

## Where Types Live

| Type | Package / File |
|---|---|
| `User`, `Role`, `JWTPayload` | auth-service: `src/types/user.ts` |
| `ApiError` (RFC 7807) | auth-service: `src/types/errors.ts` |
| `DataTable` props | ui-library: `src/components/DataTable/types.ts` |
| `AuthGuard` props | ui-library: `src/components/AuthGuard/types.ts` |

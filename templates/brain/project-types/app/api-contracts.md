---
tags: [api-contracts, erp-pro]
---

# erp-pro — API Contracts (Consumed)

> APIs this frontend calls. Backend is in the same repo (`back-end/`).

## Internal REST API

Base URL: `http://localhost:PORT/api` (dev) | `https://api.erp-pro.app/api` (prod)

All authenticated routes require:

```http
Authorization: Bearer <jwt_token>
```

### Auth

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/logout` | Invalidate session |

### Users

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/users` | List all users (admin) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (admin) |

### Products

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/products` | List products (paginated) |
| POST | `/api/products` | Create product |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Inventory / Movements

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/inventory` | Current stock levels |
| POST | `/api/inventory/movements` | Record stock movement |
| GET | `/api/inventory/movements` | List movements (filterable) |

## Third-Party APIs

| Service | Purpose | Key |
| --- | --- | --- |
| Cloudinary | Image uploads | `CLOUDINARY_*` env vars |

## Frontend Consumes (packages)

| Package | Version | Purpose |
| --- | --- | --- |
| erp-pro-ui | ^0.1.8 | All UI components |

*Cross-project contract: `wiki/projects/shared/api-contracts.md`*

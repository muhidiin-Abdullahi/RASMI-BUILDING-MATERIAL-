# RBM Authentication Architecture

## Overview

Administrator authentication uses **short-lived JWT access tokens** and **rotating refresh tokens** stored server-side in MongoDB. Credentials are delivered to the browser as **HTTP-only cookies** (never `localStorage`).

| Cookie | Purpose | Path | TTL |
|--------|---------|------|-----|
| `rbm_access` | Bearer access JWT | `/` | 15 minutes (default) |
| `rbm_refresh` | Opaque refresh token (hashed in DB) | `/api/v1/auth` | 7 days (default) |

Passwords are hashed with **bcrypt** (12 rounds). API responses never include password hashes or token values.

## Roles

| Role | Capabilities |
|------|----------------|
| `SUPER_ADMIN` | All CMS features + administrator account management |
| `ADMIN` | Products, categories, inquiries, content, settings |

Authorization is enforced by the `adminRoute()` wrapper (`web/src/server/http.ts`) on every `/api/v1/admin/*` Route Handler. UI hiding is not sufficient.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/login` | Public (rate limited) |
| POST | `/api/v1/auth/logout` | None (revokes the refresh cookie if present) |
| GET | `/api/v1/auth/me` | Access cookie |
| POST | `/api/v1/auth/refresh` | Refresh cookie |
| GET | `/api/v1/auth/refresh?next=/admin/...` | Refresh cookie; redirects back, or to login |
| POST | `/api/v1/auth/change-password` | Access cookie |

## Configuration

Set `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` in `web/.env.local` (see `web/.env.example`). The API and the pages share one origin, so no proxy or CORS setup is needed.

## Session lifecycle

1. **Login** — Validates credentials, creates `AdminSession`, sets cookies.
2. **API requests** — `authenticate()` verifies the access JWT and that the user is active.
3. **Refresh** — When an access token expires, the admin client POSTs to `/auth/refresh` and retries, and page visits go through `GET /auth/refresh` from `src/proxy.ts`. The refresh token is rotated and the previous hash invalidated.
4. **Logout** — Deletes the refresh session row and clears cookies.
5. **Password change / disable user** — Revokes all refresh sessions for that user.

## Initial administrator

No public registration endpoint exists. Provision the first account with:

```bash
cd web
npm run create-admin
```

Optional environment variables: `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, `INITIAL_ADMIN_ROLE`. Use `FORCE_CREATE_ADMIN=true` to add another account when admins already exist.

## Production notes

- Use long random `JWT_*_SECRET` values (32+ characters).
- Set `NODE_ENV=production` so cookies use `Secure`.
- Serve the site over HTTPS, because `Secure` cookies are rejected on plain HTTP.
- Optionally set `COOKIE_DOMAIN` to share the session across subdomains.

## CSRF

Cookie-based auth uses `SameSite=Lax`, and CMS changes are sent from the same origin as the API routes.

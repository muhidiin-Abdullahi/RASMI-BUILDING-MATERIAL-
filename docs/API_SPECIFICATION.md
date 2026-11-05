# RBM API Specification (v1)

Base URL: `/api/v1` on the website's own origin. These are Next.js Route Handlers in `web/src/app/api/v1`.

CMS routes, all requiring a signed-in administrator:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/admin/content` | All content sections and their defaults |
| `PATCH` | `/admin/content` | Save one section: `{ "section": "home", "data": { ... } }`. Validation failures return `error.fields`, a list of `{ path, message }`. |
| `GET` | `/admin/media` | List uploaded images |
| `POST` | `/admin/media` | Upload an image as multipart `file` |
| `DELETE` | `/admin/media/:id` | Delete an uploaded image |

`GET /media/:id` serves an uploaded image publicly.

All successful responses use:

```json
{ "success": true, "data": { ... } }
```

Paginated product lists wrap items in `data` with a sibling `pagination` object.

Errors:

```json
{ "success": false, "error": { "message": "Human-safe message", "code": "OPTIONAL_CODE" } }
```

## Public routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service + database connectivity |
| GET | `/categories` | Published categories |
| GET | `/categories/:slug` | Published category by slug |
| GET | `/products` | Published products (pagination, filters) |
| GET | `/products/featured` | Published featured products (max 12) |
| GET | `/products/:slug` | Published product by slug |
| POST | `/inquiries` | Create customer inquiry |

## GET `/products` query parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Default `1` |
| `limit` | integer | Default `12`, max `50` |
| `category` | string | Category slug |
| `search` | string | Name / description search |
| `featured` | `true` | Featured only |
| `sort` | `featured` \| `name-asc` \| `name-desc` | Sort order |

Example: `/api/v1/products?page=1&limit=12&category=bathroom-mirrors&search=mirror`

## POST `/inquiries`

```json
{
  "fullName": "Jane Specifier",
  "phone": "+971500000000",
  "email": "jane@example.com",
  "message": "Please quote 20 units.",
  "productSlug": "halo-round-led-mirror",
  "productName": "Halo Round LED Mirror"
}
```

Response `201`:

```json
{
  "success": true,
  "data": { "id": "...", "reference": "INQ-..." }
}
```

## Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email/password → HTTP-only cookies |
| POST | `/auth/logout` | Revoke refresh session, clear cookies |
| GET | `/auth/me` | Current administrator profile |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/change-password` | Authenticated password change |

See `docs/AUTHENTICATION.md`.

## Administrative routes (authenticated)

All `/admin/*` routes require a valid access cookie and an active account.

| Method | Path | Role |
|--------|------|------|
| GET | `/admin/dashboard` | ADMIN+ |
| GET/POST | `/admin/products` | ADMIN+ |
| GET/PATCH/DELETE | `/admin/products/:id` | ADMIN+ |
| GET/POST | `/admin/categories` | ADMIN+ |
| GET/PATCH/DELETE | `/admin/categories/:id` | ADMIN+ |
| GET | `/admin/inquiries` | ADMIN+ |
| GET | `/admin/inquiries/:id` | ADMIN+ |
| PATCH | `/admin/inquiries/:id/status` | ADMIN+ |
| GET/PATCH | `/admin/content` | ADMIN+ |
| GET/POST/PATCH | `/admin/users` | SUPER_ADMIN |
| POST | `/admin/users/:id/reset-password` | SUPER_ADMIN |

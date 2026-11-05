# Database schema (MongoDB / Mongoose)

## Category

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | required |
| `slug` | string | unique, normalized |
| `description` | string | required |
| `image` | string | optional URL/path |
| `published` | boolean | default `true` |
| `createdAt` / `updatedAt` | dates | automatic |

## Product

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | required |
| `slug` | string | unique |
| `category` | ObjectId → Category | required |
| `shortDescription` | string | required |
| `description` | string | required |
| `images[]` | `{ url, alt }` | |
| `specifications[]` | `{ label, value }` | |
| `brand`, `sku` | string | optional |
| `price`, `currency` | number / string | optional |
| `featured` | boolean | indexed |
| `published` | boolean | indexed |
| timestamps | | automatic |

Public API responses never include Mongo internal fields (`__v`, raw ObjectIds except mapped `id` / `categoryId`).

## Inquiry

| Field | Type | Notes |
|-------|------|-------|
| `fullName`, `phone`, `message` | string | required |
| `email` | string | optional |
| `product` | ObjectId → Product | optional |
| `productSlug`, `productName` | string | snapshot for staff review |
| `status` | `new` \| `in_progress` \| `responded` \| `closed` | default `new` |

Inquiries are not exposed on public list endpoints.

## Relationships

- Product → Category (many-to-one)
- Inquiry → Product (optional many-to-one)

Category deletion is blocked when products reference the category (409 `CATEGORY_HAS_PRODUCTS`).

## AdminUser

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | required |
| `email` | string | unique, normalized lowercase |
| `passwordHash` | string | bcrypt, never returned by API |
| `role` | `SUPER_ADMIN` \| `ADMIN` | |
| `active` | boolean | disabled users cannot authenticate |
| `lastLoginAt` | date | optional |
| timestamps | | automatic |

## AdminSession

Stores hashed refresh tokens with TTL (`expiresAt` TTL index).

## AuditLog

| Field | Type |
|-------|------|
| `actorId` | ObjectId → AdminUser |
| `action` | string |
| `resourceType` | string |
| `resourceId` | string optional |
| `metadata` | mixed optional |
| `createdAt` | date |

## SiteContent

One document per editable website section.

| Field | Type | Notes |
|-------|------|-------|
| `key` | string | unique section name, such as `home` or `projects` |
| `data` | mixed | validated by `sectionSchemas` in `web/src/lib/content/schema.ts` |
| timestamps | | automatic |

Sections that have never been saved use the values in `web/src/lib/content/defaults.ts`. Project posts are stored in the `projects` section.

## Media

Uploaded images, served from `/api/v1/media/:id`.

| Field | Type | Notes |
|-------|------|-------|
| `filename` | string | original file name |
| `contentType` | string | detected from the file's bytes: JPEG, PNG, or WebP |
| `size` | number | bytes, 5 MB maximum |
| `data` | binary | excluded from queries unless requested |
| timestamps | | automatic |

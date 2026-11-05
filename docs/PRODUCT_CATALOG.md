# Product catalog — frontend data & API boundary

## Types

Defined in `web/src/types/product.ts`:

- `Category` — `id`, `name`, `slug`, `description`, `image`, `published`
- `Product` — catalog + detail fields (`images`, `specifications`, optional `price`, `featured`, `published`, timestamps)
- `ProductListQuery` — `categorySlug`, `search`, `sort`, `publishedOnly`

## Development fixtures

Location: `web/src/data/fixtures/catalog.ts`

Fixtures are used only when `NEXT_PUBLIC_CATALOG_DATA_SOURCE=fixture`, for working without MongoDB. Do not treat them as confirmed inventory.

Includes one **unpublished** product (`draft-catalog-entry-internal`) to verify public access rules.

## Product service

Interface: `web/src/services/products/product-service.ts`

Implementations:

- `dbProductService` reads MongoDB directly (default)
- `fixtureProductService` reads the fixtures

Access via:

```ts
import { getProductService } from "@/services/products";
```

## Public API routes

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/categories` | Published categories |
| `GET` | `/api/v1/products` | List with `category`, `search`, `sort`, pagination |
| `GET` | `/api/v1/products/featured` | Featured published products |
| `GET` | `/api/v1/products/:slug` | Published product detail |
| `POST` | `/api/v1/inquiries` | Store customer inquiry (product reference in body) |

Inquiry body fields: `fullName`, `phone`, `email`, `message`, `productSlug`, `productName`.

## Inquiry integration (frontend)

- Contact URL: `/contact?product=<slug>&productName=<name>` (`buildContactInquiryUrl`)
- WhatsApp: only when a WhatsApp number is set in the CMS (`buildWhatsAppInquiryUrl`)
- Mailto fallback with product reference (`buildMailInquiryUrl`)

## Catalog URL state

`/products?category=<slug>&q=<search>&sort=name-asc|name-desc|featured`

An unknown category slug shows an empty result with a link to reset the catalog.

## Missing assets / information

- Per-SKU photography (shared lifestyle/showroom images used)
- Verified SKU/brand fields (omitted on fixtures)
- Public price fields (omitted — “pricing on request”)
- WhatsApp number (optional env)
- JSON-LD product schema (defer until verified commerce data exists)

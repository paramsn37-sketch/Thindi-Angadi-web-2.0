# The Thindi Angdi — Backend Handoff for Lavanya

This document is the implementation contract for turning the current frontend prototype into a secure, production-ready commerce system. The frontend lives in `site/` and deliberately keeps catalogue data in `site/src/data/` so it can be replaced by API responses without redesigning the UI.

## Do we need a backend?

Yes—for a real store. The present frontend can demonstrate browsing, search, filtering, wishlist, a locally persistent cart and checkout screens, but browser storage and mock files are not authoritative or secure. A backend is required for live inventory, verified prices, customer accounts, addresses, orders, payments, shipping, coupons, gift orders, contact/newsletter submissions, content management, audit history and administrative access.

Never trust price, discount, stock, tax, shipping cost, order totals, customer identity or payment status sent by the browser. Recalculate and validate all of them on the server.

## Recommended production architecture

- API: TypeScript with NestJS, Fastify or Express. A serverless API is also acceptable if transactions and background jobs are handled correctly.
- Database: PostgreSQL with migrations and an ORM such as Prisma or Drizzle.
- Cache/queues: Redis for rate limits, short-lived checkout state, idempotency and background jobs. A managed queue can replace Redis queues.
- Media: S3-compatible object storage plus a CDN. Store only media metadata and URLs in PostgreSQL.
- Authentication: managed identity or a mature session library. Use secure, HTTP-only, SameSite cookies for browser sessions; do not store long-lived auth tokens in local storage.
- Payments: a PCI-compliant hosted/embedded provider. Razorpay, Cashfree, Stripe or another provider is a business decision; card details must never pass through or be stored by our server.
- Email/SMS: transactional provider with templates and delivery-event webhooks.
- Shipping: provider adapter behind an internal interface so Shiprocket, Delhivery or another partner can be changed later.
- Observability: structured logs, error tracking, metrics, uptime checks and alerting.
- Environments: local, staging and production with separate databases, storage buckets, payment keys and webhook secrets.

## Repository and service layout

The backend may live in `backend/` in this repository or in a separate private repository. A practical structure is:

```text
backend/
  src/
    auth/          customers, sessions, roles, password reset
    catalogue/     products, variants, categories, regions, media
    inventory/     stock ledger, reservations, availability
    cart/          server carts and cart merging
    pricing/       prices, taxes, coupons, shipping quotes
    checkout/      address validation and checkout orchestration
    orders/        order state machine, history, refunds
    payments/      provider adapters and verified webhooks
    fulfilment/    shipment provider adapters and tracking
    content/       stories, FAQs, gifting and region content
    notifications/ email/SMS jobs and templates
    admin/         protected catalogue and order operations
    common/        validation, errors, logging, security, config
  prisma/ or migrations/
  tests/
  openapi/
```

## Core data model

Use UUID/ULID primary keys, UTC timestamps, soft deletion where history matters, and database constraints—not application code alone—for invariants.

### Catalogue

- `regions`: id, slug, name, Kannada name (optional), summary, story, hero media, status, SEO fields.
- `categories`: id, slug, name, parent id, sort order, status.
- `products`: id, slug, name, short/long description, region id, category id, status (`draft/active/archived`), tax class, SEO fields.
- `product_variants`: id, product id, SKU (unique), pack size/value/unit, MRP, selling price, currency, weight/dimensions, barcode, active flag.
- `product_media`: product id, URL, alt text, width, height, sort order.
- `ingredients`, `allergens`, `nutrition`, `storage`, `shelf_life`, `food_licence_or_compliance_fields`: add only from verified owner-supplied data. Preserve approval status and source.
- `gift_boxes` and `gift_box_items`: fixed or configurable assortments, variant quantities and substitution rules.

### Customers and commerce

- `customers`: id, email/phone, name, verified flags, marketing consent and timestamps.
- `addresses`: customer id, recipient, phone, lines, locality, city, state, postal code, country, delivery metadata.
- `wishlists` / `wishlist_items`.
- `carts` / `cart_items`: customer or anonymous session id, variant id, quantity, timestamps and expiry.
- `inventory_locations`, `inventory_ledger`, `inventory_reservations`: never maintain stock as an untraceable mutable number only.
- `orders`: public order number, customer, immutable billing/shipping snapshots, currency, subtotal, discounts, tax, shipping, grand total, payment and fulfilment states.
- `order_items`: immutable product/SKU/name/price/tax snapshots and quantity.
- `payments`, `payment_attempts`, `refunds`, `webhook_events`.
- `shipments`, `shipment_items`, `tracking_events`.
- `coupons`, `promotions`, eligibility rules and redemption records.
- `contact_messages`, `newsletter_subscriptions`, `story_posts`, `faq_entries`.
- `admin_users`, `roles`, `permissions`, `audit_logs`.

Money must be stored as integer minor units (paise), never floating-point values. Keep ISO currency codes. Order snapshots must remain unchanged even if a product is edited later.

## API contract (versioned)

Expose `/api/v1`. Publish an OpenAPI specification and generate a typed frontend client from it.

### Public catalogue

- `GET /regions`
- `GET /regions/:slug`
- `GET /products?query=&region=&category=&spice=&sort=&cursor=&limit=`
- `GET /products/:slug`
- `GET /gift-boxes`
- `GET /stories` and `GET /stories/:slug`
- `GET /faqs`

List responses must include pagination metadata. Define stable sort rules. Search should normalize case and whitespace and can begin with PostgreSQL full-text/trigram search before adding a separate search service.

### Identity and account

- `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`
- email/phone verification and passwordless or password-reset endpoints
- `GET/PATCH /me`
- CRUD `/me/addresses`
- `GET /me/orders` and `GET /me/orders/:orderNumber`
- `GET/PUT /me/wishlist`

Protect against account enumeration. Rotate sessions after login and privilege changes. Revoke sessions on password reset or suspicious activity.

### Cart and checkout

- `POST /carts` creates an anonymous cart and returns an opaque cart token.
- `GET /carts/:token`
- `POST /carts/:token/items`
- `PATCH/DELETE /carts/:token/items/:itemId`
- `POST /carts/:token/merge` after login.
- `POST /checkout/quote` returns server-calculated totals and availability.
- `POST /checkout/orders` creates a pending order with an idempotency key.
- `POST /checkout/payment-session` creates a provider checkout/payment intent.
- `GET /orders/:orderNumber/status` returns a safe customer-facing status.

At checkout, lock/re-read variants, validate serviceability, reserve inventory for a short period, recalculate every amount, then create the order and payment attempt in a database transaction. Expire abandoned reservations automatically.

### Webhooks

- `POST /webhooks/payments/:provider`
- `POST /webhooks/shipping/:provider`
- provider-specific email/SMS callbacks if required

Verify the raw-body signature, timestamp and expected event source before processing. Store each provider event id under a unique constraint; acknowledge retries safely. A browser redirect is never proof of payment. Only a verified webhook or server-to-server verification may mark an order paid.

## Order state machine

Keep payment and fulfilment states separate.

- Payment: `pending → authorized → paid → partially_refunded/refunded` or `failed/cancelled`.
- Fulfilment: `unfulfilled → processing → packed → shipped → delivered`, with explicit `cancelled/returned` branches.
- Define allowed transitions centrally and audit every transition.
- Use background jobs for confirmation, invoice, shipment creation, tracking updates, reservation expiry and retryable notifications.
- Implement an outbox table so database changes and queued side effects cannot silently diverge.

## Security requirements

- Validate every request with allow-listed schemas; reject unknown fields where practical.
- Enforce authorization in the service layer and test object-level access (IDOR/BOLA).
- Rate-limit login, verification, password reset, search, cart mutation, checkout, contact and webhook routes.
- Use Argon2id/bcrypt if passwords are stored; never log secrets, passwords, full tokens or payment details.
- Configure CORS to the exact production/staging frontend origins. Add CSRF protection for cookie-authenticated mutations.
- Use secure cookies, HSTS, a restrictive Content Security Policy and standard security headers.
- Sanitize rich text and uploaded filenames; verify MIME type, dimensions and size; malware-scan uploads where applicable.
- Store secrets in the hosting platform’s secret manager, not `.env` files committed to Git.
- Encrypt in transit and at rest; apply least-privilege database/service accounts.
- Back up PostgreSQL automatically and test restoration. Define retention and deletion for customer data.
- Keep admin routes separate, require MFA, use least-privilege roles and record append-only audit events.
- Run dependency, secret, static-analysis and container scans in CI.

## Reliability and correctness

- Require idempotency keys for order creation, payment initiation, refunds and other retry-sensitive commands.
- Use database unique constraints for SKU, slug, order number, provider event id and idempotency key.
- Add timeouts, bounded retries with jitter and circuit breaking around providers.
- Never hold a database transaction open while calling an external service.
- Return a consistent error envelope: `{ code, message, fieldErrors?, requestId }`.
- Include a request/correlation id in logs and responses.
- Add `/health/live` and `/health/ready`; readiness should check critical dependencies safely.
- Make all dates ISO-8601 UTC and convert only in presentation layers.

## Frontend integration plan

1. Agree on the OpenAPI schema before replacing mocks.
2. Add `NEXT_PUBLIC_API_BASE_URL` per environment.
3. Generate a typed API client into `site/src/lib/api/`; do not scatter raw `fetch` calls across components.
4. Replace `site/src/data/catalog.ts` and `gifts.ts` reads with catalogue hooks/server requests while retaining their UI-facing TypeScript shapes.
5. Replace local-only cart persistence with an anonymous server cart token; keep a small local fallback and merge on login.
6. Connect search, filters, sorting and pagination to query parameters and API responses.
7. Connect account, addresses, order history, contact, newsletter and checkout forms.
8. Redirect to the payment provider only after a server-created order/payment session.
9. Show payment success only after server verification; handle pending, failed and duplicate-return states.
10. Add loading skeletons, retries, empty states and user-safe errors to every request path.

Suggested environment variables (names may change):

```env
DATABASE_URL=
REDIS_URL=
SESSION_SECRET=
FRONTEND_ORIGIN=
OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=
OBJECT_STORAGE_ACCESS_KEY=
OBJECT_STORAGE_SECRET_KEY=
PAYMENT_PROVIDER_KEY_ID=
PAYMENT_PROVIDER_SECRET=
PAYMENT_WEBHOOK_SECRET=
SHIPPING_PROVIDER_KEY=
EMAIL_PROVIDER_KEY=
ERROR_TRACKING_DSN=
```

Commit only `.env.example`, never real values.

## Tests required before launch

- Unit tests: pricing, promotion eligibility, totals, tax rounding, stock allocation, state transitions and permissions.
- Integration tests: database constraints, cart merge, checkout transaction, inventory reservation/expiry, webhook idempotency and refunds.
- Contract tests: OpenAPI request/response compatibility with the frontend.
- End-to-end: browse → cart → address → payment success/failure/pending → order history; anonymous/login merge; out-of-stock and price-change paths; coupon abuse; cancellation/refund.
- Security: authorization matrix, CSRF, CORS, rate limits, upload validation, injection, XSS sanitization, session rotation and webhook forgery.
- Load tests: catalogue/search, add-to-cart, checkout bursts and webhook retries.
- Recovery drill: restore a backup and replay/reconcile payment and shipment events.

## CI/CD and release gates

For every pull request: format, lint, type check, unit/integration tests, migration validation, OpenAPI diff, dependency/secret scan and build. Deploy migrations with a backward-compatible expand/migrate/contract process. Deploy to staging, run smoke/E2E tests, then promote the same artifact to production. Provide rollback and feature-flag procedures.

Before enabling real checkout, the business owner must supply and approve: legal entity and support details, verified catalogue/SKU/price/pack data, inventory rules, ingredient/allergen/nutrition/storage/shelf-life statements where applicable, tax/GST and invoicing requirements, food-business licences/compliance text, delivery areas and charges, cancellation/return/refund/privacy/terms policies, payment account, shipping account, email/SMS sender details, maker/sourcing claims and final media usage rights.

## Definition of done

The backend is ready only when the frontend consumes staging APIs end-to-end; no live total or stock decision is made in the browser; payment and shipping webhooks are signed and idempotent; admin access uses MFA and audit logs; backups have been restored in a test; monitoring and alerts are active; accessibility/error states are verified; and the owner has approved all regulated and commercial content.

No system can honestly promise “no flaws.” The controls above are intended to prevent common loopholes, expose failures quickly and make recovery safe.

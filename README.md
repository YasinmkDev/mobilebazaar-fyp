# MobileBazaar — Mobile Phone E-Commerce (Final Year Project)

A full-stack, single-vendor mobile phone e-commerce store built for the Pakistan market — storefront, guest checkout, order tracking, and a complete admin operations console.

**Stack:** Next.js 15 (App Router) · TypeScript · Supabase (PostgreSQL, Auth, RLS) · Vercel-ready
**Market features:** PKR pricing, PTA-approved badges, EMI / monthly instalment display, Cash on Delivery + simulated JazzCash / EasyPaisa, compare-up-to-3 phones, faceted filters.

## Highlights
- **Storefront** — 25 phones / 48 variants, live catalogue from Supabase with a bundled-seed fallback, product pages with variant pricing, EMI calculator and spec tables
- **Commerce** — cart, guest checkout with Pakistani mobile validation, order confirmation and a customer tracking timeline
- **Admin Ops Console** — dashboard KPIs and revenue chart, order workflow, full catalogue CRUD (add / edit / delete devices with image upload), low-stock alerts
- **Design** — 'SIGNAL' system: Paper / Ink / Signal Red, Space Grotesk + Doto + Space Mono, skeleton loading system, spotlight carousel, fully responsive

## Run locally
```
npm install
cp .env.example .env.local   # add your Supabase URL + publishable key
npm run dev                   # http://localhost:3000
```
Admin demo login: `admin@mobilebazaar.pk` / `admin123` (local demo only — production uses Supabase Auth).

---

## Development log (sprints)

# MobileBazaar — FYP Mobile Phone E-Commerce

Next.js (App Router) + TypeScript. Design follows the approved UX plan
(Bazaar Green / Tangerine / Sunshine, mobile-first, WCAG 2.2 basics).

## Sprint 1 (done)
- Project scaffold + design system tokens in `app/globals.css`
- Catalogue data layer (`lib/`) — 24 seed phones, Product → Variants model,
  per-variant PKR price/stock, EMI helper. Sprint 2 swaps `lib/products.ts`
  for Supabase queries behind the same `Phone` type.
- Components: Header (trust strip + search), Footer, ProductCard
  (live variant price/EMI, PTA + discount badges, stock honesty)
- Home: hero, brand rail, Best under Rs 50,000, Flagships, Gaming
- Shop: search, faceted filters (price buckets, brand, 5G, RAM), sort,
  live result count, helpful empty state, Compare up to 3 with
  best-spec highlighting

## Run
```
npm install
npm run dev      # http://localhost:3000
npm run build    # production verification
```

## Sprint 2 (done)
- Cart store (`lib/cart.tsx`): context + localStorage persistence, qty cap 5,
  free delivery over Rs 50,000 else Rs 350 — totals always upfront
- Product detail pages for all 24 phones (SSG): colour gallery, variant
  pricing, EMI tenure selector (4/6/12), grouped GSMArena-style specs,
  seeded buyer reviews, similar phones
- Cart page + guest checkout: 6 fields, Pakistani mobile validation,
  COD-first payment radio (JazzCash/EasyPaisa/bank = pending-verification),
  orders saved locally (`lib/orders.ts`)
- Order confirmation + tracking page: status timeline
  (Placed → Confirmed → Packed → Shipped → Delivered), track by order no.

## Sprint 3 (done)
- Admin panel at `/admin` (demo login: admin@mobilebazaar.pk / admin123 —
  production replaces this with Supabase Auth + `profiles.is_admin`)
- Dashboard: revenue / orders / needs-action / delivered KPIs, 7-day
  revenue chart, payment mix, low-stock alerts (<= 7), top phones,
  recent orders; one-click clearly-labelled demo orders for viva practice
- Orders workflow (`/admin/orders`): status filter, order detail,
  set/advance status — the same record the customer's tracking page reads
- Products (`/admin/products`): all 48 variants, inline price + stock
  editing persisted locally (low stock highlighted)
- Supabase-ready pack (canonical, matches `lib/types.ts` 1:1):
  `supabase/migrations/001_initial_schema.sql` (6 tables + RLS + storage
  bucket), `supabase/seed.sql` (24 phones + 48 variants), `docs/ERD.md`
  (Mermaid ERD for the FYP report), `docs/sprint3-supabase-setup.md`

## Roadmap
- Sprint 4: create your free Supabase project (5-min checklist in
  `docs/sprint3-supabase-setup.md`), wire the data layer, testing chapter
  (black-box cases, SUS), deployment to Vercel, FYP documentation pack

## Sprint 5 — senior audit + catalogue CRUD (done)

A full audit pass (method: look for CRUD asymmetries, stated-but-undelivered
features, sad paths, and data defects) found and fixed:

| # | Finding | Fix |
|---|---------|-----|
| 1 | **Catalogue had Read + Update but no Create/Delete** — admin could only nudge stock/prices | Full **Add/Edit device form** (`components/AdminPhoneForm.tsx`): basics, collections, complete specs, dynamic variant rows, strict validation (unique slug, old price > price, duplicate storage, positive numbers). New devices persist in the admin data layer (`lib/admin.ts`), can be **edited and deleted** (deleting cleans their price/stock overrides), and **publish to the live storefront via a generated SQL export** (`phoneToSql` emits INSERTs identical to `supabase/seed.sql`) |
| 2 | Stock field committed on **every keystroke** (typing "25" saved 2, then 25) | Stock and price inputs now commit on blur; steppers still save instantly and the field re-syncs |
| 3 | Any missing phone image rendered a **broken-image icon** (bit us in Sprint 4 with a 404) | Global graceful fallback: every device image swaps to `public/phones/placeholder.jpg` on error (`imgFallback` in `lib/images.ts`) — new devices look intentional until their photo is added |
| 4 | **Data defect:** iPhones carried `"os": "Android 15"` — the seed generator hardcoded it | Fixed at the source (`lib/products.ts` derives OS by brand), `supabase/seed.sql` corrected, and `supabase/fix_catalogue_data.sql` provided to repair the already-seeded live database (run once in the SQL Editor) |
| 5 | Orders admin had **no search and no sort** | Search across ID/customer/city/phone + sort (newest/oldest/total) |
| 6 | Dashboard low-stock ignored admin-added devices | Dashboard reads the merged catalogue (seed + custom) |

Known, deliberate asymmetry: built-in seed devices are managed in
Supabase/seed.sql (no delete button); admin-added devices are fully
CRUD-able locally and publish through SQL export. In production this whole
layer becomes authenticated Supabase writes.

## Sprint 4 — Supabase data-layer swap (done)
- Storefront catalogue (Home / Shop / product pages) reads the live Supabase
  `phones` + `variants` tables via `lib/catalog.ts` (ISR, 5-min revalidate),
  with the bundled seed as an automatic fallback if the DB is unreachable.
- Checkout mirrors every order into Supabase `orders` + `order_items`
  (`lib/orders-sync.ts`, guest INSERT per RLS). Customer tracking keeps
  using the on-device record because guest SELECT is intentionally not
  granted; the owner sees all orders in the Supabase dashboard.
- Proof: REST counts phones=24 / variants=48; a labelled test order
  (MB-S4TEST, "safe to delete") inserted successfully through the same
  guest policies the app uses.

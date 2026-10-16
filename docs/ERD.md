# MobileBazaar — Entity-Relationship Diagram (FYP documentation)

Paste the Mermaid block below into the SRS / design chapter. It matches
`supabase/migrations/001_initial_schema.sql` and `lib/types.ts` exactly.

```mermaid
erDiagram
    PROFILES ||--o{ ORDERS : "admin manages"
    PROFILES {
        uuid id PK "auth.users.id"
        text email
        bool is_admin "admin panel access"
    }
    PHONES ||--|{ VARIANTS : "has 2-3"
    PHONES {
        text id PK "ph-1 … ph-24"
        text slug UK
        text brand
        text model
        text tagline
        numeric rating
        int review_count
        text_arr colours
        int hue "CSS backdrop until press images"
        text_arr tags "budget, camera, gaming, flagship…"
        bool pta_approved
        text warranty
        jsonb specs "display, refreshHz, chipset, cameras, battery, chargingW, fiveG, nfc, os"
        bool is_active
    }
    VARIANTS {
        text sku PK "e.g. samsung-galaxy-a36-128"
        text phone_id FK
        int storage_gb
        int ram_gb
        int price_pkr
        int old_price_pkr "nullable — discount anchor"
        int stock
    }
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    ORDERS {
        text id PK "MB-XXXXX"
        timestamptz placed_at
        text customer_name
        text customer_phone "PK mobile, app-validated"
        text customer_city
        text customer_address
        text customer_email "nullable"
        text customer_note "nullable"
        text payment "cod | jazzcash | easypaisa | bank"
        bool payment_verified "true once wallet/bank payment confirmed"
        int subtotal
        int delivery "0 when ≥ Rs 50,000, else 350"
        int total
        smallint status_index "0 Placed → 1 Confirmed → 2 Packed → 3 Shipped → 4 Delivered"
    }
    ORDER_ITEMS {
        uuid id PK
        text order_id FK
        text sku
        text name
        text variant_label
        int price_pkr "snapshot at purchase time"
        int qty
    }
    PHONES ||--o{ REVIEWS : "moderated"
    REVIEWS {
        uuid id PK
        text phone_id FK
        text author
        smallint rating "1–5"
        date review_date
        text title
        text body
        bool verified
        bool approved "admin approves before public"
    }
```

## Relationship notes (for the viva)

- **phones → variants** is 1:N with cascade delete; every variant carries its own
  PKR price and stock — this is the core of the Product → Variants model and the
  reason discounts and EMI are computed per variant, not per phone.
- **orders → order_items** is 1:N with cascade delete; `price_pkr` on the item is
  a snapshot so a later price change never rewrites history — an examiner will
  ask about this.
- **Guest checkout**: orders are inserted with the anon key (no login). RLS
  allows `INSERT` for everyone but `SELECT` only for admins; the Track Order page
  reads through a server-side route with the service-role key, never the anon key.
- **reviews** are write-by-authenticated, read-when-approved — the moderation
  queue is the admin panel's third screen after catalogue and orders.

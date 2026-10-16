# Sprint 3 — Supabase setup (5-minute checklist, do once)

Everything code-side is already prepared: the schema, the seed data, and the
ERD for your FYP docs. These are the only steps that need *your* Supabase
account.

## 1. Create the project (you, ~2 min)
1. Go to https://supabase.com/dashboard → **New project**
2. Name: `mobilebazaar-fyp` · pick any region · set a database password (save it)
3. Wait for the project to finish provisioning

## 2. Run the prepared SQL (you, ~2 min)
1. Open the project → **SQL Editor** → **New query**
2. Paste the whole contents of `supabase/migrations/001_initial_schema.sql` → **Run**
   (creates 6 tables, RLS policies, the `phone-images` storage bucket)
3. **New query** → paste `supabase/seed.sql` → **Run**
   (inserts the same 24 phones + 48 variants the app uses today — verified 1:1)

Quick check it worked — run this in the SQL Editor:
```sql
select count(*) as phones from public.phones;      -- expect 24
select count(*) as variants from public.variants;  -- expect 48
```

## 3. Hand me the keys (you, ~1 min)
Project → **Settings → API** → copy:
- **Project URL** (e.g. `https://xyzcompany.supabase.co`)
- **anon public** key

Paste both here and say **"start Sprint 3"**. Then I wire:
- `lib/products.ts` → Supabase queries behind the same `Phone` type
- `lib/orders.ts` → real orders table (guest checkout via RLS insert policy)
- auth with roles (`profiles.is_admin`) + admin panel (catalogue, order workflow, sales reports, review moderation)
- the seeded `lib/reviews.ts` → moderated `reviews` table

## 4. Make yourself admin (after Sprint 3's auth lands)
1. Sign up once in the app
2. SQL Editor → run:
   ```sql
   update public.profiles set is_admin = true where email = 'your@email.com';
   ```
3. Reload — the admin panel unlocks

## Why this order
The RLS policies are written so **guest checkout works without login**
(anon can INSERT orders, but can never read them back). The Track Order page
will read through a server-side route with the service-role key — the service
key must **never** go into the browser code or `.env.local` (only server env).

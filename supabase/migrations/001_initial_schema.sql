-- MobileBazaar (FYP) — initial schema, prepared for Sprint 3
-- Mirrors lib/types.ts (Phone/Variant) and lib/orders.ts (Order/OrderItem/Review)
-- verbatim so the Sprint 3 swap of the data layer is mechanical.
--
-- Apply: Supabase Dashboard → SQL Editor → paste and run.
-- Then create the "phone-images" bucket note at the bottom is handled via storage policy below.

-- ── Profiles: one row per auth user; admins get full back-office access ──
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Catalogue ──
create table if not exists public.phones (
  id text primary key,                 -- "ph-1" … "ph-24", same as lib/products.ts
  slug text not null unique,
  brand text not null,
  model text not null,
  tagline text not null default '',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  colours text[] not null default '{Black,Blue,Silver}',
  hue integer not null default 200,   -- CSS backdrop hue until press images arrive
  tags text[] not null default '{}',  -- e.g. budget, camera, gaming, flagship
  pta_approved boolean not null default true,
  warranty text not null default '',
  specs jsonb not null default '{}',  -- display, refreshHz, chipset, cameras, battery, chargingW, fiveG, nfc, os
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.variants (
  sku text primary key,                -- e.g. "samsung-galaxy-a36-128"
  phone_id text not null references public.phones (id) on delete cascade,
  storage_gb integer not null,
  ram_gb integer not null,
  price_pkr integer not null check (price_pkr > 0),
  old_price_pkr integer check (old_price_pkr is null or old_price_pkr > price_pkr),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);
create index if not exists variants_phone_id_idx on public.variants (phone_id);

-- ── Orders (guest checkout: inserts happen without a login) ──
create table if not exists public.orders (
  id text primary key,                 -- "MB-XXXXX", same format as lib/orders.ts
  placed_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,       -- PK mobile, validated in the app
  customer_city text not null,
  customer_address text not null,
  customer_email text,
  customer_note text,
  payment text not null check (payment in ('cod','jazzcash','easypaisa','bank')),
  payment_verified boolean not null default false,  -- true once JazzCash/EasyPaisa/bank payment is confirmed
  subtotal integer not null check (subtotal >= 0),
  delivery integer not null check (delivery >= 0),
  total integer not null check (total >= 0),
  status_index smallint not null default 0 check (status_index between 0 and 4),
  -- 0 Placed → 1 Confirmed → 2 Packed → 3 Shipped → 4 Delivered (ORDER_STEPS)
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders (id) on delete cascade,
  sku text not null,
  name text not null,
  variant_label text not null,
  price_pkr integer not null check (price_pkr > 0),
  qty integer not null check (qty > 0)
);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ── Moderated reviews (Sprint 3 replaces the seeded lib/reviews.ts content) ──
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  phone_id text not null references public.phones (id) on delete cascade,
  author text not null,
  rating smallint not null check (rating between 1 and 5),
  review_date date not null default current_date,
  title text not null default '',
  body text not null default '',
  verified boolean not null default false,
  approved boolean not null default false,  -- admin approves before it goes live
  created_at timestamptz not null default now()
);
create index if not exists reviews_phone_id_idx on public.reviews (phone_id);

-- ── Helpers & RLS ──
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.phones enable row level security;
alter table public.variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- profiles: users see their own row; admins see everything
create policy "profiles_self_read" on public.profiles for select using (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles for all using (public.is_admin());

-- phones/variants: everybody reads; only admins write
create policy "phones_public_read" on public.phones for select using (is_active = true);
create policy "phones_admin_all" on public.phones for all using (public.is_admin());
create policy "variants_public_read" on public.variants for select using (true);
create policy "variants_admin_all" on public.variants for all using (public.is_admin());

-- orders: GUESTS can insert (checkout without login) but cannot read others' orders;
-- admins read/update/delete everything. Customer self-read of their own order id
-- is served via a server-side route using the service-role key (track page),
-- never with the anon key.
create policy "orders_guest_insert" on public.orders for insert with check (true);
create policy "orders_admin_all" on public.orders for all using (public.is_admin());
create policy "order_items_guest_insert" on public.order_items for insert with check (true);
create policy "order_items_admin_all" on public.order_items for all using (public.is_admin());

-- reviews: approved ones are public; anyone logged in can submit; admins moderate
create policy "reviews_public_read" on public.reviews for select using (approved = true);
create policy "reviews_auth_insert" on public.reviews for insert with check (auth.role() = 'authenticated');
create policy "reviews_admin_all" on public.reviews for all using (public.is_admin());

-- ── Storage: public bucket for future phone press images ──
insert into storage.buckets (id, name, public)
values ('phone-images', 'phone-images', true)
on conflict (id) do nothing;

create policy "phone_images_public_read" on storage.objects
  for select using (bucket_id = 'phone-images');
create policy "phone_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'phone-images' and public.is_admin());
create policy "phone_images_admin_update" on storage.objects
  for update using (bucket_id = 'phone-images' and public.is_admin());
create policy "phone_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'phone-images' and public.is_admin());

-- ============================================================
-- SMART CARD — FINAL SUPABASE SCHEMA / SECURITY
-- ============================================================

create extension if not exists pgcrypto;


-- ============================================================
-- 1) SHOPS
-- ============================================================

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  slug text not null unique,

  responsible text,
  phone text,
  whatsapp text,

  google_review text,
  instagram text,
  facebook text,
  tiktok text,
  youtube text,
  website text,

  location text,
  description text,
  logo_url text,

  is_active boolean not null default true,

  card_number text not null unique,

  created_by uuid references auth.users(id)
);


alter table public.shops
add column if not exists responsible text;

alter table public.shops
add column if not exists logo_url text;

alter table public.shops
add column if not exists created_by uuid references auth.users(id);


create index if not exists idx_shops_slug
on public.shops(slug);

create index if not exists idx_shops_active
on public.shops(is_active);


-- ============================================================
-- 2) CARDS
-- ============================================================

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  shop_id uuid not null
    references public.shops(id)
    on delete cascade,

  card_number text not null unique,

  qr_code text not null,

  nfc_url text not null,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'active',
        'inactive'
      )
    )
);


create index if not exists idx_cards_shop_id
on public.cards(shop_id);

create index if not exists idx_cards_status
on public.cards(status);


-- ============================================================
-- 3) ORDERS
-- ============================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  plan text,

  shop_name text not null,
  responsible text not null,
  phone text not null,

  whatsapp text,
  email text,

  google_review text,
  instagram text,
  facebook text,
  tiktok text,
  youtube text,
  website text,

  location text,
  description text,
  logo_url text
);


alter table public.orders
add column if not exists logo_url text;


create index if not exists idx_orders_created_at
on public.orders(created_at desc);


-- ============================================================
-- 4) SHOP EVENTS / ANALYTICS
-- ============================================================

create table if not exists public.shop_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  shop_id uuid not null
    references public.shops(id)
    on delete cascade,

  event_type text not null
);


create index if not exists idx_shop_events_shop_id
on public.shop_events(shop_id);

create index if not exists idx_shop_events_type
on public.shop_events(event_type);

create index if not exists idx_shop_events_created_at
on public.shop_events(created_at desc);


-- ============================================================
-- 5) ADMIN USERS
-- ============================================================

create table if not exists public.admin_users (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  created_at timestamptz not null default now()
);


create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;


grant execute on function public.is_admin()
to authenticated;


-- ============================================================
-- 6) RLS
-- ============================================================

alter table public.shops
enable row level security;

alter table public.cards
enable row level security;

alter table public.orders
enable row level security;

alter table public.shop_events
enable row level security;

alter table public.admin_users
enable row level security;


-- ============================================================
-- Remove old / insecure policies
-- ============================================================

drop policy if exists "Anyone can create shops"
on public.shops;

drop policy if exists "Anyone can create cards"
on public.cards;

drop policy if exists "public can create shop on order"
on public.shops;

drop policy if exists "public can create card on order"
on public.cards;

drop policy if exists "public can view active shops"
on public.shops;

drop policy if exists "admin can view all shops"
on public.shops;

drop policy if exists "admin can insert shops"
on public.shops;

drop policy if exists "admin can update shops"
on public.shops;

drop policy if exists "admin can delete shops"
on public.shops;

drop policy if exists "admin can view cards"
on public.cards;

drop policy if exists "admin can insert cards"
on public.cards;

drop policy if exists "admin can update cards"
on public.cards;

drop policy if exists "admin can delete cards"
on public.cards;

drop policy if exists "public can create order"
on public.orders;

drop policy if exists "admin can view orders"
on public.orders;

drop policy if exists "admin can update orders"
on public.orders;

drop policy if exists "public can log events"
on public.shop_events;

drop policy if exists "admin can view events"
on public.shop_events;

drop policy if exists "admin can view admin list"
on public.admin_users;


-- ============================================================
-- SHOPS POLICIES
-- ============================================================

create policy "public can view active shops"
on public.shops
for select
to anon, authenticated
using (is_active = true);


create policy "admin can view all shops"
on public.shops
for select
to authenticated
using (public.is_admin());


create policy "admin can insert shops"
on public.shops
for insert
to authenticated
with check (public.is_admin());


create policy "admin can update shops"
on public.shops
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


create policy "admin can delete shops"
on public.shops
for delete
to authenticated
using (public.is_admin());


-- ============================================================
-- CARDS POLICIES
-- ============================================================

create policy "admin can view cards"
on public.cards
for select
to authenticated
using (public.is_admin());


create policy "admin can insert cards"
on public.cards
for insert
to authenticated
with check (public.is_admin());


create policy "admin can update cards"
on public.cards
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


create policy "admin can delete cards"
on public.cards
for delete
to authenticated
using (public.is_admin());


-- ============================================================
-- ORDERS POLICIES
-- ============================================================

create policy "public can create order"
on public.orders
for insert
to anon, authenticated
with check (true);


create policy "admin can view orders"
on public.orders
for select
to authenticated
using (public.is_admin());


create policy "admin can update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


-- ============================================================
-- EVENTS POLICIES
-- ============================================================

create policy "public can log events"
on public.shop_events
for insert
to anon, authenticated
with check (true);


create policy "admin can view events"
on public.shop_events
for select
to authenticated
using (public.is_admin());


-- ============================================================
-- ADMIN USERS POLICIES
-- ============================================================

create policy "admin can view admin list"
on public.admin_users
for select
to authenticated
using (public.is_admin());


-- ============================================================
-- 7) CREATE THE FIRST ADMIN
-- ============================================================

-- بعد إنشاء المستخدم من:
-- Supabase → Authentication → Users
--
-- انسخ UUID الخاص بالمستخدم
-- ثم نفّذ:
--
-- insert into public.admin_users (user_id)
-- values ('PUT-ADMIN-USER-UUID-HERE');
--
-- لا تضع service_role key في React/Vite أبدًا.
-- ============================================================
-- 1) Run this SQL in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(), name text not null, description text default '', price numeric(10,2) not null default 0,
 image_url text default '', stock integer not null default 0, active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), customer_name text not null, phone text not null, city text not null, address text default '',
 total numeric(10,2) not null default 0, items jsonb not null default '[]'::jsonb, status text not null default 'new', created_at timestamptz not null default now()
);
alter table public.products enable row level security; alter table public.orders enable row level security;
-- Public customers can read active products and create orders.
create policy "public read active products" on public.products for select using (active = true or auth.role() = 'authenticated');
create policy "public create orders" on public.orders for insert with check (true);
-- Admin = authenticated Supabase user. For a private production setup, restrict this to your admin user/email.
create policy "admin manage products" on public.products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin read orders" on public.orders for select using (auth.role() = 'authenticated');
create policy "admin update orders" on public.orders for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- Storage bucket for product images
insert into storage.buckets (id,name,public) values ('products','products',true) on conflict (id) do nothing;
create policy "public view product images" on storage.objects for select using (bucket_id='products');
create policy "admin upload product images" on storage.objects for insert with check (bucket_id='products' and auth.role()='authenticated');
create policy "admin update product images" on storage.objects for update using (bucket_id='products' and auth.role()='authenticated');
create policy "admin delete product images" on storage.objects for delete using (bucket_id='products' and auth.role()='authenticated');

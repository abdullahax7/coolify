-- ════════════════════════════════════════════════════════
-- Staff table for the team management admin tab.
-- Idempotent — safe to run repeatedly.
-- ════════════════════════════════════════════════════════

create table if not exists public.staff (
  id           uuid primary key default gen_random_uuid(),
  id_slug      text unique,
  name         text not null,
  role         text not null,
  description  text not null default '',
  image_url    text not null default '',
  order_index  int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_staff_order on public.staff (order_index);

-- RLS: public read, admin write. Admin client (service role) bypasses RLS,
-- so the PUT route in /api/staff continues to work via createAdminClient().
alter table public.staff enable row level security;

drop policy if exists "staff_public_read" on public.staff;
create policy "staff_public_read"
  on public.staff
  for select
  using (true);

drop policy if exists "staff_admin_write" on public.staff;
create policy "staff_admin_write"
  on public.staff
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- ════════════════════════════════════════════════════════
-- Testimonials table — referenced by getTestimonials() on
-- the home page and /about. Idempotent.
-- ════════════════════════════════════════════════════════

create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  quote        text not null,
  author       text not null,
  role         text not null default '',
  image_url    text not null default '',
  order_index  int  not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_testimonials_order on public.testimonials (order_index);

-- Public read, admin write (service-role bypasses RLS for the admin client).
alter table public.testimonials enable row level security;

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read"
  on public.testimonials
  for select
  using (true);

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write"
  on public.testimonials
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

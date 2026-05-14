-- ════════════════════════════════════════════════════════
-- PROPERTY TRADER — COMPLETE CONSOLIDATED SCHEMA
-- Paste this entire file into Supabase → SQL Editor → Run.
-- Safe to run on a fresh project OR re-run on an existing one
-- (all statements are idempotent: create … if not exists,
--  drop policy if exists before create policy, etc.).
-- ════════════════════════════════════════════════════════

-- ── 0. EXTENSIONS ────────────────────────────────────────
create extension if not exists pgcrypto;     -- gen_random_uuid()

-- ── 1. CORE TABLES ───────────────────────────────────────

-- Profiles (extends auth.users)
create table if not exists profiles (
  id         uuid primary key references auth.users on delete cascade,
  name       text not null,
  email      text,
  phone      text,
  is_admin   boolean default false,
  role       text not null default 'tenant' check (role in ('tenant', 'landlord')),
  created_at timestamptz default now()
);

-- Older deployments may have the table without the role column.
alter table if exists profiles add column if not exists role text not null default 'tenant';
alter table if exists profiles drop constraint if exists profiles_role_check;
alter table if exists profiles add constraint profiles_role_check check (role in ('tenant', 'landlord'));

-- Orders
create table if not exists orders (
  id                text primary key,
  user_id           uuid references profiles(id) on delete set null,
  type              text not null,
  name              text not null,
  price             text not null,
  detail            text,
  date              text,
  status            text default 'pending',
  form_type         text,
  form_data         jsonb,
  pdf_url           text,
  square_payment_id text,
  customer_name     text,
  customer_email    text,
  customer_phone    text,
  expires_at        timestamptz,
  deleted_at        timestamptz,
  created_at        timestamptz default now()
);

-- Messages
create table if not exists messages (
  id          text primary key,
  name        text,
  email       text,
  phone       text,
  subject     text,
  message     text,
  received_at timestamptz default now(),
  read        boolean default false,
  deleted_at  timestamptz
);

-- Cash Inquiries
create table if not exists cash_inquiries (
  id         text primary key,
  name       text,
  phone      text,
  email      text,
  price      text,
  address    text,
  postcode   text,
  date       text,
  status     text default 'new',
  image_urls text[],
  deleted_at timestamptz
);

-- Appointments
create table if not exists appointments (
  id          text primary key,
  name        text,
  number      text,
  timing      text,
  day         text,
  description text,
  created_at  timestamptz default now(),
  deleted_at  timestamptz
);

-- Tenancies
create table if not exists tenancies (
  id                 text primary key,
  property_id        text,
  property_name      text,
  start_date         text,
  end_date           text,
  rent_amount        text,
  rent_frequency     text,
  rent_day           text,
  deposit_amount     text,
  tenant_name        text,
  tenant_email       text,
  tenant_phone       text,
  agreement_file_url text,
  status             text default 'Pending',
  created_at         timestamptz default now(),
  deleted_at         timestamptz
);

-- Tenancy Forms
create table if not exists tenancy_forms (
  id                  text primary key,
  tenant_name         text,
  landlord_name       text,
  property_address    text,
  contract_start_date text,
  contract_end_date   text,
  monthly_rent        text,
  deposit_amount      text,
  tenant_email        text,
  tenant_phone        text,
  landlord_email      text,
  landlord_phone      text,
  additional_notes    text,
  contract_file_url   text,
  status              text default 'draft',
  created_at          timestamptz default now(),
  deleted_at          timestamptz
);

-- Property Documents
create table if not exists property_documents (
  id            text primary key,
  property_id   text,
  property_name text,
  document_type text,
  expiry_date   text,
  date_uploaded text,
  status        text default 'Current',
  file_url      text,
  file_name     text,
  deleted_at    timestamptz
);

-- Wales Forms
create table if not exists wales_forms (
  id           uuid primary key default gen_random_uuid(),
  form_type    text not null,
  client_name  text not null,
  client_email text,
  client_phone text,
  notes        text,
  form_data    jsonb default '{}'::jsonb,
  pdf_url      text,
  user_email   text,
  admin_email  text,
  status       text default 'pending',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  deleted_at   timestamptz
);

-- Custom Properties
create table if not exists custom_properties (
  id               text primary key,
  title            text,
  location         text,
  price            text,
  beds             text,
  baths            text,
  sqft             text,
  type             text,
  sector           text,
  status           text,
  notes            text,
  image_url        text,
  gallery_urls     text,
  map_embed_url    text,
  description      text,
  features         text,
  interior         text,
  exterior         text,
  listing_type     text,
  user_id          uuid references profiles(id) on delete set null,
  is_approved      boolean default false,
  is_rejected      boolean default false,
  rejection_reason text,
  assigned_to_email text,
  expires_at       timestamptz,
  deleted_at       timestamptz,
  created_at       timestamptz default now()
);

-- Older deployments may have the table without the assigned_to_email column.
alter table if exists custom_properties add column if not exists assigned_to_email text;

-- Property Overrides
create table if not exists property_overrides (
  property_id text primary key,
  hidden      boolean default false,
  featured    boolean default false,
  notes       text
);

-- Site Content (CMS)
create table if not exists site_content (
  id              uuid primary key default gen_random_uuid(),
  page_identifier text not null,
  section_key     text not null,
  content_value   text not null,
  updated_at      timestamptz default now() not null,
  unique (page_identifier, section_key)
);

-- Deletion Logs (legacy audit table)
create table if not exists deletion_logs (
  id                uuid primary key default gen_random_uuid(),
  item_id           text not null,
  item_type         text not null,
  item_name         text,
  deleted_by        uuid references auth.users(id) on delete set null,
  deleted_at        timestamptz default now(),
  associated_files  jsonb default '[]'::jsonb,
  success           boolean default true,
  error_message     text
);

-- Admin Audit Log (new — granular admin action history)
create table if not exists admin_audit_log (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid references auth.users(id) on delete set null,
  admin_email  text,
  action       text not null,           -- 'create' | 'update' | 'delete' | 'restore' | 'approve' | 'reject'
  target_table text not null,
  target_id    text,
  target_name  text,
  diff         jsonb,
  ip           inet,
  user_agent   text,
  created_at   timestamptz default now()
);

-- Staff (team management — editable from the admin pt-console)
create table if not exists staff (
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

-- Testimonials (public quotes, editable from the admin pt-console)
create table if not exists testimonials (
  id           uuid primary key default gen_random_uuid(),
  quote        text not null,
  author       text not null,
  role         text not null default '',
  image_url    text not null default '',
  order_index  int  not null default 0,
  created_at   timestamptz not null default now()
);

-- ── 2. SAFETY: BACKFILL deleted_at ON PRE-EXISTING TABLES ─
-- (no-op on fresh installs; required if a previous deploy
--  used the older schema without the column)
alter table if exists custom_properties   add column if not exists deleted_at timestamptz;
alter table if exists orders              add column if not exists deleted_at timestamptz;
alter table if exists messages            add column if not exists deleted_at timestamptz;
alter table if exists cash_inquiries      add column if not exists deleted_at timestamptz;
alter table if exists appointments        add column if not exists deleted_at timestamptz;
alter table if exists tenancies           add column if not exists deleted_at timestamptz;
alter table if exists tenancy_forms       add column if not exists deleted_at timestamptz;
alter table if exists property_documents  add column if not exists deleted_at timestamptz;
alter table if exists wales_forms         add column if not exists deleted_at timestamptz;

-- ── 3. FUNCTIONS & TRIGGERS ──────────────────────────────

-- Admin check helper
create or replace function is_admin()
returns boolean language sql security definer as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- Auto-create profile row on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    case
      when lower(coalesce(new.raw_user_meta_data->>'role', '')) = 'landlord' then 'landlord'
      else 'tenant'
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Soft-delete helper (admin only)
create or replace function soft_delete_row(p_table text, p_id text)
returns boolean language plpgsql security definer as $$
declare q text; n int;
begin
  if not is_admin() then return false; end if;
  q := format('update public.%I set deleted_at = now() where id = $1 and deleted_at is null', p_table);
  execute q using p_id;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

-- Restore helper (admin only)
create or replace function restore_row(p_table text, p_id text)
returns boolean language plpgsql security definer as $$
declare q text; n int;
begin
  if not is_admin() then return false; end if;
  q := format('update public.%I set deleted_at = null where id = $1 and deleted_at is not null', p_table);
  execute q using p_id;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

-- Hard-delete sweeper — purges rows soft-deleted > retention_days ago.
-- Call from cron: select * from purge_soft_deleted(30);
create or replace function purge_soft_deleted(retention_days int default 30)
returns table (table_name text, rows_purged bigint)
language plpgsql security definer as $$
declare
  cutoff timestamptz := now() - make_interval(days => retention_days);
  t record; q text; n bigint;
begin
  for t in
    select c.table_name
    from information_schema.columns c
    where c.table_schema = 'public' and c.column_name = 'deleted_at'
  loop
    q := format('delete from public.%I where deleted_at is not null and deleted_at < %L', t.table_name, cutoff);
    execute q;
    get diagnostics n = row_count;
    table_name := t.table_name;
    rows_purged := n;
    return next;
  end loop;
  return;
end;
$$;

-- ── 4. ROW LEVEL SECURITY ────────────────────────────────

alter table profiles            enable row level security;
alter table orders              enable row level security;
alter table messages            enable row level security;
alter table cash_inquiries      enable row level security;
alter table appointments        enable row level security;
alter table tenancies           enable row level security;
alter table tenancy_forms       enable row level security;
alter table property_documents  enable row level security;
alter table custom_properties   enable row level security;
alter table property_overrides  enable row level security;
alter table site_content        enable row level security;
alter table deletion_logs       enable row level security;
alter table wales_forms         enable row level security;
alter table admin_audit_log     enable row level security;

-- Profiles
drop policy if exists "Users read own profile"   on profiles;
drop policy if exists "Admins read all profiles" on profiles;
create policy "Users read own profile"   on profiles for select using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (is_admin());

-- Orders
drop policy if exists "Users read own orders"     on orders;
drop policy if exists "Admins manage orders"      on orders;
drop policy if exists "Service role insert orders" on orders;
create policy "Users read own orders"      on orders for select using (auth.uid() = user_id);
create policy "Admins manage orders"       on orders for all    using (is_admin());
create policy "Service role insert orders" on orders for insert with check (true);

-- Messages
drop policy if exists "Public insert messages"  on messages;
drop policy if exists "Admins manage messages"  on messages;
create policy "Public insert messages" on messages for insert with check (true);
create policy "Admins manage messages" on messages for all    using (is_admin());

-- Cash inquiries
drop policy if exists "Public insert cash inquiries" on cash_inquiries;
drop policy if exists "Admins manage cash inquiries" on cash_inquiries;
create policy "Public insert cash inquiries" on cash_inquiries for insert with check (true);
create policy "Admins manage cash inquiries" on cash_inquiries for all    using (is_admin());

-- Appointments
drop policy if exists "Admins manage appointments" on appointments;
create policy "Admins manage appointments" on appointments for all using (is_admin());

-- Tenancies / forms / documents (admin only)
drop policy if exists "Admins manage tenancies"      on tenancies;
drop policy if exists "Admins manage tenancy forms"  on tenancy_forms;
drop policy if exists "Admins manage documents"     on property_documents;
drop policy if exists "Admins manage wales forms"   on wales_forms;
create policy "Admins manage tenancies"     on tenancies        for all using (is_admin());
create policy "Admins manage tenancy forms" on tenancy_forms    for all using (is_admin());
create policy "Admins manage documents"     on property_documents for all using (is_admin());
create policy "Admins manage wales forms"   on wales_forms      for all using (is_admin());

-- Overrides
drop policy if exists "Public read overrides"  on property_overrides;
drop policy if exists "Admins write overrides" on property_overrides;
create policy "Public read overrides"  on property_overrides for select using (true);
create policy "Admins write overrides" on property_overrides for all    using (is_admin());

-- Site content
drop policy if exists "Public read site content"   on site_content;
drop policy if exists "Admins manage site content" on site_content;
create policy "Public read site content"   on site_content for select using (true);
create policy "Admins manage site content" on site_content for all    using (is_admin());

-- Deletion logs
drop policy if exists "Admins read deletion logs"  on deletion_logs;
drop policy if exists "Service role insert logs"   on deletion_logs;
create policy "Admins read deletion logs" on deletion_logs for select using (is_admin());
create policy "Service role insert logs"  on deletion_logs for insert with check (true);

-- Custom properties
drop policy if exists "Public read approved custom properties"   on custom_properties;
drop policy if exists "Users read own custom properties"         on custom_properties;
drop policy if exists "Admins manage custom properties"          on custom_properties;
drop policy if exists "Users insert own custom properties"       on custom_properties;
drop policy if exists "Users update own unapproved properties"   on custom_properties;
create policy "Public read approved custom properties" on custom_properties for select using (is_approved = true and deleted_at is null);
create policy "Users read own custom properties"       on custom_properties for select using (auth.uid() = user_id);
create policy "Admins manage custom properties"        on custom_properties for all    using (is_admin());
create policy "Users insert own custom properties"     on custom_properties for insert with check (auth.uid() = user_id);
create policy "Users update own unapproved properties" on custom_properties for update using (auth.uid() = user_id and is_approved = false);

-- Admin audit log
drop policy if exists "Admins read audit log"           on admin_audit_log;
drop policy if exists "Service role insert audit log"   on admin_audit_log;
create policy "Admins read audit log"          on admin_audit_log for select using (is_admin());
create policy "Service role insert audit log"  on admin_audit_log for insert with check (true);

-- Staff (public read, admin write — service-role admin client bypasses RLS)
alter table staff enable row level security;
drop policy if exists "staff_public_read"  on staff;
drop policy if exists "staff_admin_write"  on staff;
create policy "staff_public_read" on staff for select using (true);
create policy "staff_admin_write" on staff for all
  using      (is_admin())
  with check (is_admin());

-- Testimonials (public read, admin write)
alter table testimonials enable row level security;
drop policy if exists "testimonials_public_read"  on testimonials;
drop policy if exists "testimonials_admin_write"  on testimonials;
create policy "testimonials_public_read" on testimonials for select using (true);
create policy "testimonials_admin_write" on testimonials for all
  using      (is_admin())
  with check (is_admin());

-- ── 5. INDEXES ───────────────────────────────────────────

-- Expiry sweeps
create index if not exists idx_orders_expires_at         on orders (expires_at);
create index if not exists idx_properties_expires_at     on custom_properties (expires_at);

-- "Live row" partial indexes
create index if not exists idx_props_live          on custom_properties (created_at desc)  where deleted_at is null;
create index if not exists idx_orders_live         on orders            (created_at desc)  where deleted_at is null;
create index if not exists idx_messages_live       on messages          (received_at desc) where deleted_at is null;
create index if not exists idx_cash_inquiries_live on cash_inquiries    (id)               where deleted_at is null;

-- Search composites on custom_properties
create index if not exists idx_props_search_compose on custom_properties (location, type, beds)
  where deleted_at is null and is_approved = true;
create index if not exists idx_props_listing_type   on custom_properties (listing_type)
  where deleted_at is null and is_approved = true;
create index if not exists idx_props_user           on custom_properties (user_id, created_at desc)
  where deleted_at is null;
create index if not exists idx_props_approved_expires on custom_properties (is_approved, expires_at)
  where deleted_at is null;

-- Full-text search (title + location + description)
create index if not exists idx_props_fts on custom_properties using gin (
  to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(location, '') || ' ' ||
    coalesce(description, '')
  )
) where deleted_at is null;

-- Dashboard / admin list views
create index if not exists idx_orders_user_status        on orders         (user_id, status, created_at desc)  where deleted_at is null;
create index if not exists idx_appointments_created      on appointments   (created_at desc)                   where deleted_at is null;
create index if not exists idx_tenancies_created         on tenancies      (created_at desc)                   where deleted_at is null;
create index if not exists idx_tenancy_forms_created     on tenancy_forms  (created_at desc)                   where deleted_at is null;
create index if not exists idx_wales_forms_created       on wales_forms    (created_at desc)                   where deleted_at is null;
create index if not exists idx_wales_forms_status        on wales_forms    (status, created_at desc)           where deleted_at is null;

-- Property documents
create index if not exists idx_property_documents_property on property_documents (property_id)  where deleted_at is null;
create index if not exists idx_property_documents_expiry   on property_documents (expiry_date)  where deleted_at is null;

-- Misc
create index if not exists idx_site_content_page on site_content (page_identifier);
create index if not exists idx_profiles_admin    on profiles (id) where is_admin = true;
create index if not exists idx_staff_order        on staff (order_index);
create index if not exists idx_testimonials_order on testimonials (order_index);
create index if not exists idx_profiles_role      on profiles (role);
create index if not exists idx_custom_props_assigned_email
  on custom_properties (lower(assigned_to_email))
  where assigned_to_email is not null;

-- Audit log
create index if not exists idx_audit_log_admin         on admin_audit_log (admin_id, created_at desc);
create index if not exists idx_audit_log_admin_action  on admin_audit_log (admin_id, action, created_at desc);
create index if not exists idx_audit_log_target        on admin_audit_log (target_table, target_id, created_at desc);
create index if not exists idx_audit_log_action        on admin_audit_log (action, created_at desc);
create index if not exists idx_audit_log_created       on admin_audit_log (created_at desc);

-- ── 6. STORAGE BUCKETS ───────────────────────────────────

insert into storage.buckets (id, name, public) values ('pdfs',             'pdfs',             false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('properties',       'properties',       true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('property-images',  'property-images',  true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('cash-inquiries',   'cash-inquiries',   true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents',        'documents',        false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-assets',      'site-assets',      true)  on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Public Upload Cash Inquiries"       on storage.objects;
drop policy if exists "Public View Cash Inquiries"         on storage.objects;
drop policy if exists "Admin Manage Cash Inquiries"        on storage.objects;
drop policy if exists "Public View Property Images"        on storage.objects;
drop policy if exists "Authenticated Upload Property Images" on storage.objects;
drop policy if exists "Admin Manage Property Images"       on storage.objects;
drop policy if exists "Users View Own PDFs"                on storage.objects;
drop policy if exists "Admin Manage PDFs"                  on storage.objects;
drop policy if exists "Server can insert PDFs"             on storage.objects;
drop policy if exists "Admin Manage Documents"             on storage.objects;
drop policy if exists "Owners and tenants view docs"       on storage.objects;
drop policy if exists "Public View Site Assets"            on storage.objects;
drop policy if exists "Admin Manage Site Assets"           on storage.objects;

-- Cash inquiries bucket (public uploads e.g. photo of property)
create policy "Public Upload Cash Inquiries" on storage.objects for insert with check (bucket_id = 'cash-inquiries');
create policy "Public View Cash Inquiries"   on storage.objects for select using      (bucket_id = 'cash-inquiries');
create policy "Admin Manage Cash Inquiries"  on storage.objects for all    using      (bucket_id = 'cash-inquiries' and is_admin());

-- Property image buckets
create policy "Public View Property Images"          on storage.objects for select using (bucket_id in ('properties', 'property-images'));
create policy "Authenticated Upload Property Images" on storage.objects for insert with check (bucket_id in ('properties', 'property-images') and auth.role() = 'authenticated');
create policy "Admin Manage Property Images"         on storage.objects for all    using (bucket_id in ('properties', 'property-images') and is_admin());

-- PDFs (private — namespaced by user_id folder)
create policy "Users View Own PDFs"   on storage.objects for select using (bucket_id = 'pdfs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Server can insert PDFs" on storage.objects for insert with check (bucket_id = 'pdfs');
create policy "Admin Manage PDFs"     on storage.objects for all    using (bucket_id = 'pdfs' and is_admin());

-- Documents (private — admin uploads, authenticated reads via signed URL)
create policy "Admin Manage Documents"       on storage.objects for all    using (bucket_id = 'documents' and is_admin()) with check (bucket_id = 'documents' and is_admin());
create policy "Owners and tenants view docs" on storage.objects for select using (bucket_id = 'documents' and auth.role() = 'authenticated');

-- Site assets (CMS media / staff photos / services catalog images — public CDN reads, admin writes)
create policy "Public View Site Assets"  on storage.objects for select using      (bucket_id = 'site-assets');
create policy "Admin Manage Site Assets" on storage.objects for all    using      (bucket_id = 'site-assets' and is_admin())
                                                                       with check (bucket_id = 'site-assets' and is_admin());

-- ── 7. SEED DATA ─────────────────────────────────────────

insert into site_content (page_identifier, section_key, content_value) values
  ('homepage', 'hero_title',    'Sell Your House Fast'),
  ('homepage', 'hero_subtitle', 'We buy ANY house, in ANY condition, in ANY location across the UK. Get a guaranteed cash offer today.')
on conflict (page_identifier, section_key) do nothing;

-- ── 8. STATISTICS REFRESH ────────────────────────────────
analyze profiles;
analyze orders;
analyze messages;
analyze cash_inquiries;
analyze appointments;
analyze tenancies;
analyze tenancy_forms;
analyze property_documents;
analyze wales_forms;
analyze custom_properties;
analyze property_overrides;
analyze site_content;
analyze admin_audit_log;

-- ── 9. RELOAD POSTGREST SCHEMA CACHE ─────────────────────
-- Force PostgREST to refresh its in-memory schema. Without this, embedded
-- selects like  custom_properties.select('*, profiles(is_admin, email)')
-- can fail with "Could not find a relationship between …" right after the
-- schema is first applied (the cache still holds the empty state).
notify pgrst, 'reload schema';

-- ════════════════════════════════════════════════════════
-- Soft-delete + composite indexes + admin audit log
-- Additive migration — does not alter or drop existing
-- columns. Safe to run repeatedly (idempotent).
-- ════════════════════════════════════════════════════════

-- ── 1. SOFT DELETE COLUMNS ───────────────────────────────
alter table if exists custom_properties   add column if not exists deleted_at timestamptz;
alter table if exists orders              add column if not exists deleted_at timestamptz;
alter table if exists messages            add column if not exists deleted_at timestamptz;
alter table if exists cash_inquiries      add column if not exists deleted_at timestamptz;
alter table if exists appointments        add column if not exists deleted_at timestamptz;
alter table if exists tenancies           add column if not exists deleted_at timestamptz;
alter table if exists tenancy_forms       add column if not exists deleted_at timestamptz;
alter table if exists property_documents  add column if not exists deleted_at timestamptz;
alter table if exists wales_forms         add column if not exists deleted_at timestamptz;

-- Partial indexes — keep "live" lookups blazing while ignoring trashed rows.
create index if not exists idx_props_live
  on custom_properties (created_at desc) where deleted_at is null;

create index if not exists idx_orders_live
  on orders (created_at desc) where deleted_at is null;

create index if not exists idx_messages_live
  on messages (received_at desc) where deleted_at is null;

create index if not exists idx_cash_inquiries_live
  on cash_inquiries (id) where deleted_at is null;

-- ── 2. SEARCH COMPOSITE INDEXES (custom_properties) ──────
-- Frontend filters by (location, type, price, beds). Compose for sub-100ms.
create index if not exists idx_props_search_compose
  on custom_properties (location, type, beds)
  where deleted_at is null and is_approved = true;

create index if not exists idx_props_listing_type
  on custom_properties (listing_type)
  where deleted_at is null and is_approved = true;

create index if not exists idx_props_user
  on custom_properties (user_id, created_at desc)
  where deleted_at is null;

-- Full-text search across title + description.
create index if not exists idx_props_fts
  on custom_properties using gin (
    to_tsvector('english',
      coalesce(title,'') || ' ' ||
      coalesce(location,'') || ' ' ||
      coalesce(description,'')
    )
  ) where deleted_at is null;

-- Orders by user (dashboard view) — frequent.
create index if not exists idx_orders_user_status
  on orders (user_id, status, created_at desc)
  where deleted_at is null;

-- Appointments / tenancies / tenancy_forms / wales_forms — admin list views
-- order by created_at desc. Without these, full table scans on every page load.
create index if not exists idx_appointments_created
  on appointments (created_at desc)
  where deleted_at is null;

create index if not exists idx_tenancies_created
  on tenancies (created_at desc)
  where deleted_at is null;

create index if not exists idx_tenancy_forms_created
  on tenancy_forms (created_at desc)
  where deleted_at is null;

create index if not exists idx_wales_forms_created
  on wales_forms (created_at desc)
  where deleted_at is null;

create index if not exists idx_wales_forms_status
  on wales_forms (status, created_at desc)
  where deleted_at is null;

-- Property documents — looked up by property_id and filtered by expiry.
create index if not exists idx_property_documents_property
  on property_documents (property_id)
  where deleted_at is null;

create index if not exists idx_property_documents_expiry
  on property_documents (expiry_date)
  where deleted_at is null;

-- Site content — frequently read, filtered by page identifier.
create index if not exists idx_site_content_page
  on site_content (page_identifier);

-- Profiles admin lookup. Tiny table but is_admin() called on every API route.
create index if not exists idx_profiles_admin
  on profiles (id) where is_admin = true;

-- Custom properties: expiry sweep (cron) and approved/expired guest queries.
create index if not exists idx_props_approved_expires
  on custom_properties (is_approved, expires_at)
  where deleted_at is null;

-- ── 3. ADMIN AUDIT LOG ───────────────────────────────────
-- Table MUST be created before its indexes (Postgres has no
-- `create index if not exists … on table if exists` form).
create table if not exists admin_audit_log (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid references auth.users(id) on delete set null,
  admin_email  text,
  action       text not null,            -- 'create' | 'update' | 'delete' | 'restore' | 'approve' | 'reject'
  target_table text not null,
  target_id    text,
  target_name  text,
  diff         jsonb,                     -- before/after where useful
  ip           inet,
  user_agent   text,
  created_at   timestamptz default now()
);

create index if not exists idx_audit_log_admin         on admin_audit_log (admin_id, created_at desc);
create index if not exists idx_audit_log_admin_action  on admin_audit_log (admin_id, action, created_at desc);
create index if not exists idx_audit_log_target        on admin_audit_log (target_table, target_id, created_at desc);
create index if not exists idx_audit_log_action        on admin_audit_log (action, created_at desc);
create index if not exists idx_audit_log_created       on admin_audit_log (created_at desc);

alter table admin_audit_log enable row level security;

drop policy if exists "Admins read audit log" on admin_audit_log;
create policy "Admins read audit log"
  on admin_audit_log for select using (is_admin());

drop policy if exists "Service role insert audit log" on admin_audit_log;
create policy "Service role insert audit log"
  on admin_audit_log for insert with check (true);

-- ── 4. HARD-DELETE SWEEPER (called from cron) ────────────
-- Purge rows that have been soft-deleted for over 30 days.
create or replace function purge_soft_deleted(retention_days int default 30)
returns table (table_name text, rows_purged bigint)
language plpgsql security definer as $$
declare
  cutoff timestamptz := now() - make_interval(days => retention_days);
  t record;
  q text;
  n bigint;
begin
  for t in
    select c.table_name
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.column_name = 'deleted_at'
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

-- ── 5. SOFT DELETE HELPER ────────────────────────────────
create or replace function soft_delete_row(p_table text, p_id text)
returns boolean language plpgsql security definer as $$
declare
  q text;
  n int;
begin
  if not is_admin() then
    return false;
  end if;
  q := format('update public.%I set deleted_at = now() where id = $1 and deleted_at is null', p_table);
  execute q using p_id;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

create or replace function restore_row(p_table text, p_id text)
returns boolean language plpgsql security definer as $$
declare
  q text;
  n int;
begin
  if not is_admin() then
    return false;
  end if;
  q := format('update public.%I set deleted_at = null where id = $1 and deleted_at is not null', p_table);
  execute q using p_id;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

-- ── 6. STATISTICS REFRESH ────────────────────────────────
-- Run ANALYZE on all touched tables so the planner picks up the new indexes.
analyze custom_properties;
analyze orders;
analyze messages;
analyze cash_inquiries;
analyze appointments;
analyze tenancies;
analyze tenancy_forms;
analyze wales_forms;
analyze property_documents;
analyze profiles;
analyze site_content;

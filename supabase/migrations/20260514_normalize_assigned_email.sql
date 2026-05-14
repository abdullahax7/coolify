-- ════════════════════════════════════════════════════════
-- Ensure custom_properties.assigned_to_email exists, then
-- normalize its values to lowercase so they match
-- auth.users.email (which Supabase stores lowercase).
-- Idempotent.
-- ════════════════════════════════════════════════════════

-- 1. Add the column if it isn't there yet. The application code reads/writes
--    this column to track which tenant a property has been assigned to.
alter table public.custom_properties
  add column if not exists assigned_to_email text;

-- 2. Index for tenant lookups (case-insensitive prefix/equality).
create index if not exists idx_custom_props_assigned_email
  on public.custom_properties (lower(assigned_to_email))
  where assigned_to_email is not null;

-- 3. Lowercase any pre-existing values.
update public.custom_properties
   set assigned_to_email = lower(assigned_to_email)
 where assigned_to_email is not null
   and assigned_to_email <> lower(assigned_to_email);

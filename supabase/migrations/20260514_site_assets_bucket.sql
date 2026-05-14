-- ════════════════════════════════════════════════════════
-- Missing storage bucket: site-assets
--
-- The admin pt-console uploads CMS media, staff photos, and
-- services-catalog images to a `site-assets` bucket via
-- /api/storage/upload. The previous full_schema.sql forgot
-- to declare it, so on a freshly-transferred Supabase project
-- every upload from MediaTab/StaffTab/ServicesCatalogTab fails
-- (or relies on the route's auto-create fallback, which only
-- works when SUPABASE_SERVICE_ROLE_KEY is set and silently
-- skips RLS policy creation).
--
-- Idempotent — safe to re-run.
-- ════════════════════════════════════════════════════════

-- 1. Bucket — public so the CDN can serve <img src="..."> directly.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = excluded.public;

-- 2. Storage policies
drop policy if exists "Public View Site Assets"  on storage.objects;
drop policy if exists "Admin Manage Site Assets" on storage.objects;

-- Anyone (including anon) can read — the bucket is public.
create policy "Public View Site Assets"
  on storage.objects for select
  using (bucket_id = 'site-assets');

-- Only admins (via profiles.is_admin) can write/delete. The /api/storage/upload
-- route runs as service-role which bypasses RLS anyway, but this policy lets a
-- future direct-from-browser admin upload work without forging service-role.
create policy "Admin Manage Site Assets"
  on storage.objects for all
  using      (bucket_id = 'site-assets' and is_admin())
  with check (bucket_id = 'site-assets' and is_admin());

-- 3. Force PostgREST to reload its schema cache. After a fresh project import
-- the cache sometimes still holds the empty schema, which makes embedded
-- selects like  custom_properties.select('*, profiles(is_admin, email)')
-- fail with "Could not find a relationship between ...".
notify pgrst, 'reload schema';

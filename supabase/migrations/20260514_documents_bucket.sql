-- ════════════════════════════════════════════════════════
-- Storage bucket for property compliance documents
-- (EPC, gas safety, insurance, etc.).
-- Idempotent — safe to re-run.
-- ════════════════════════════════════════════════════════

-- Private bucket — files are only ever served via short-lived signed URLs
-- generated server-side by the admin client. No public read.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage policies. The admin route uses the service role client, which
-- bypasses RLS, but these policies let an authenticated tenant/owner
-- read their own property's docs through signed URLs without needing the
-- service role.
drop policy if exists "Admin Manage Documents"        on storage.objects;
drop policy if exists "Owners and tenants view docs"  on storage.objects;

-- Admin (is_admin() in the profile) gets full CRUD.
create policy "Admin Manage Documents"
  on storage.objects for all
  using      (bucket_id = 'documents' and is_admin())
  with check (bucket_id = 'documents' and is_admin());

-- Authenticated users can read any object in this bucket. Authorization
-- is enforced upstream by /api/documents which checks user_id /
-- assigned_to_email on the property row before signing a URL.
create policy "Owners and tenants view docs"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.role() = 'authenticated');

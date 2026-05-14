-- 1. Create the bucket
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- 2. Allow admins to do everything
create policy "Admins can manage PDFs"
on storage.objects for all
to authenticated
using (
  bucket_id = 'pdfs' AND 
  (select is_admin from profiles where id = auth.uid())
);

-- 3. Allow users to read their own PDFs (we'll name files by order_id or user_id)
-- For now, let's allow users to read any object in 'pdfs' if the name starts with their UID
create policy "Users can read own PDFs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'pdfs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow insert for the server (we'll use service role or admin context)
create policy "Server can insert PDFs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'pdfs');

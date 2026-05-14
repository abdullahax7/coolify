-- ════════════════════════════════════════════════════════
-- Normalize custom_properties.assigned_to_email to lowercase
-- so it matches auth.users.email (which Supabase normalizes
-- to lowercase on signup). Idempotent — re-running is a no-op.
-- ════════════════════════════════════════════════════════

update public.custom_properties
   set assigned_to_email = lower(assigned_to_email)
 where assigned_to_email is not null
   and assigned_to_email <> lower(assigned_to_email);

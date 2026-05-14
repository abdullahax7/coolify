-- ════════════════════════════════════════════════════════
-- Add role (landlord | tenant) to profiles and persist it
-- from the signup metadata. Backfill existing rows from
-- auth.users.raw_user_meta_data. Idempotent.
-- ════════════════════════════════════════════════════════

-- 1. Column
alter table public.profiles
  add column if not exists role text not null default 'tenant';

alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('tenant', 'landlord'));

create index if not exists idx_profiles_role on public.profiles (role);

-- 2. Backfill from auth metadata for users who registered before this column existed.
update public.profiles p
   set role = case
                when lower(coalesce(u.raw_user_meta_data->>'role', '')) = 'landlord' then 'landlord'
                else 'tenant'
              end
  from auth.users u
 where u.id = p.id
   and (p.role is null or p.role = 'tenant');

-- 3. Trigger: copy role from signup metadata on every new user.
create or replace function public.handle_new_user()
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

-- Trigger itself is created in the base schema; recreating the function above
-- is enough — existing trigger now calls the new body.

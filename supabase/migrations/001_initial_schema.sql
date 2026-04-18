-- Run this in your Supabase SQL editor

-- ── Profiles (extends auth.users) ─────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Orders ────────────────────────────────────────────────
create table if not exists orders (
  id text primary key,
  user_id uuid references profiles(id) on delete set null,
  type text not null,
  name text not null,
  price text not null,
  detail text,
  date text,
  status text default 'pending',
  form_type text,
  form_data jsonb,
  pdf_url text,
  square_payment_id text,
  created_at timestamptz default now()
);

-- ── Property Submissions ──────────────────────────────────
create table if not exists property_submissions (
  id text primary key,
  user_id uuid references profiles(id) on delete set null,
  address text, postcode text, type text,
  beds text, baths text, sqft text, price text,
  description text, features text,
  status text default 'pending',
  contact_name text, contact_email text, contact_phone text,
  submitted_at timestamptz default now()
);

-- ── Messages ─────────────────────────────────────────────
create table if not exists messages (
  id text primary key,
  name text, email text, phone text,
  subject text, message text,
  received_at timestamptz default now(),
  read boolean default false
);

-- ── Cash Inquiries ───────────────────────────────────────
create table if not exists cash_inquiries (
  id text primary key,
  name text, phone text, email text,
  price text, address text, postcode text,
  date text,
  status text default 'new'
);

-- ── Appointments ─────────────────────────────────────────
create table if not exists appointments (
  id text primary key,
  name text, number text,
  timing text, day text, description text,
  created_at timestamptz default now()
);

-- ── Tenancies ────────────────────────────────────────────
create table if not exists tenancies (
  id text primary key,
  property_id text, property_name text,
  start_date text, end_date text,
  rent_amount text, rent_frequency text, rent_day text,
  deposit_amount text,
  tenant_name text, tenant_email text, tenant_phone text,
  agreement_file_url text,
  status text default 'Pending',
  created_at timestamptz default now()
);

-- ── Tenancy Forms ────────────────────────────────────────
create table if not exists tenancy_forms (
  id text primary key,
  tenant_name text, landlord_name text,
  property_address text,
  contract_start_date text, contract_end_date text,
  monthly_rent text, deposit_amount text,
  tenant_email text, tenant_phone text,
  landlord_email text, landlord_phone text,
  additional_notes text,
  contract_file_url text,
  status text default 'draft',
  created_at timestamptz default now()
);

-- ── Property Documents ───────────────────────────────────
create table if not exists property_documents (
  id text primary key,
  property_id text, property_name text,
  document_type text, expiry_date text,
  date_uploaded text,
  status text default 'Current',
  file_url text, file_name text
);

-- ── Custom Properties ────────────────────────────────────
create table if not exists custom_properties (
  id text primary key,
  title text, location text, price text,
  beds text, baths text, sqft text,
  type text, sector text, status text,
  notes text, image_url text, gallery_urls text,
  map_embed_url text, description text,
  features text, interior text, exterior text,
  created_at timestamptz default now()
);

-- ── Property Overrides (for static property data) ────────
create table if not exists property_overrides (
  property_id text primary key,
  hidden boolean default false,
  featured boolean default false,
  notes text
);

-- ════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════

alter table profiles enable row level security;
alter table orders enable row level security;
alter table property_submissions enable row level security;
alter table messages enable row level security;
alter table cash_inquiries enable row level security;
alter table appointments enable row level security;
alter table tenancies enable row level security;
alter table tenancy_forms enable row level security;
alter table property_documents enable row level security;
alter table custom_properties enable row level security;
alter table property_overrides enable row level security;

-- Helper: is calling user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- profiles
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (is_admin());

-- orders
create policy "Users read own orders" on orders for select using (auth.uid() = user_id);
create policy "Admins read all orders" on orders for select using (is_admin());
create policy "Admins insert orders" on orders for insert with check (is_admin());
create policy "Admins update orders" on orders for update using (is_admin());
create policy "Admins delete orders" on orders for delete using (is_admin());
create policy "Service role insert orders" on orders for insert with check (true);

-- property_submissions
create policy "Users insert submissions" on property_submissions for insert with check (auth.uid() = user_id);
create policy "Users read own submissions" on property_submissions for select using (auth.uid() = user_id);
create policy "Admins all submissions" on property_submissions for all using (is_admin());

-- messages (public insert, admin read)
create policy "Public insert messages" on messages for insert with check (true);
create policy "Admins read messages" on messages for select using (is_admin());
create policy "Admins update messages" on messages for update using (is_admin());
create policy "Admins delete messages" on messages for delete using (is_admin());

-- cash_inquiries (public insert, admin manage)
create policy "Public insert cash inquiries" on cash_inquiries for insert with check (true);
create policy "Admins all cash inquiries" on cash_inquiries for all using (is_admin());

-- appointments (admin only)
create policy "Admins all appointments" on appointments for all using (is_admin());

-- tenancies (admin only)
create policy "Admins all tenancies" on tenancies for all using (is_admin());

-- tenancy_forms (admin only)
create policy "Admins all tenancy forms" on tenancy_forms for all using (is_admin());

-- property_documents (admin only)
create policy "Admins all documents" on property_documents for all using (is_admin());

-- custom_properties (public read, admin write)
create policy "Public read custom properties" on custom_properties for select using (true);
create policy "Admins write custom properties" on custom_properties for all using (is_admin());

-- property_overrides (public read, admin write)
create policy "Public read overrides" on property_overrides for select using (true);
create policy "Admins write overrides" on property_overrides for all using (is_admin());

-- ════════════════════════════════════════════════════════
-- Storage buckets (run separately or via Supabase dashboard)
-- ════════════════════════════════════════════════════════
-- insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', false);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
-- insert into storage.buckets (id, name, public) values ('tenancy-agreements', 'tenancy-agreements', false);

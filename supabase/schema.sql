-- ============================================================
-- DFIR-Rapid — full database (Supabase / PostgreSQL, free tier)
--
-- HOW TO USE: Supabase → SQL Editor → New query → paste ALL of this → Run
-- Safe to run again (it updates without deleting your data).
--
-- Roles:
--   admin   = you. Everything, incl. managing users and deleting cases
--   analyst = technical team. Leads + all cases, evidence, IOCs, notes
--   client  = customer. Can ONLY see their own cases (no internal notes)
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. LEADS (website forms: demo, trial, plan, contact)
-- ------------------------------------------------------------
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('demo', 'trial', 'plan', 'contact')),
  name         text not null check (char_length(name) between 1 and 100),
  email        text not null check (char_length(email) <= 150 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company      text default '' check (char_length(company) <= 100),
  phone        text default '' check (char_length(phone) <= 40),
  plan         text default '' check (plan in ('', 'Basic', 'Professional', 'Enterprise')),
  company_size text default '' check (char_length(company_size) <= 20),
  message      text default '' check (char_length(message) <= 3000),
  status       text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at   timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ------------------------------------------------------------
-- 2. PROFILES (one per login account, holds the role)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null default '',
  full_name  text not null default '',
  company    text not null default '',
  role       text not null default 'client' check (role in ('admin', 'analyst', 'client')),
  created_at timestamptz not null default now()
);

-- Every new user created in Supabase Authentication automatically gets a profile (role = client)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create profiles for users that already existed before this script
insert into public.profiles (id, email)
select id, coalesce(email, '') from auth.users
on conflict (id) do nothing;

-- Helper functions used by the security rules
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin', 'analyst') from public.profiles where id = auth.uid()), false)
$$;

-- ------------------------------------------------------------
-- 3. CASES (investigations)
-- ------------------------------------------------------------
create sequence if not exists public.case_seq;

create table if not exists public.cases (
  id          uuid primary key default gen_random_uuid(),
  case_number text unique not null default ('DFIR-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.case_seq')::text, 4, '0')),
  title       text not null check (char_length(title) between 1 and 200),
  category    text not null default 'Incident Response',
  severity    text not null default 'medium' check (severity in ('critical', 'high', 'medium', 'low')),
  status      text not null default 'new' check (status in ('new', 'triage', 'investigating', 'reporting', 'closed')),
  summary     text not null default '',
  client_id   uuid references public.profiles (id) on delete set null,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_by  uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  closed_at   timestamptz
);
create index if not exists cases_client_idx on public.cases (client_id);

create or replace function public.touch_case()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'closed' and (old.status is distinct from 'closed') then new.closed_at := now(); end if;
  if new.status <> 'closed' then new.closed_at := null; end if;
  return new;
end $$;

drop trigger if exists cases_touch on public.cases;
create trigger cases_touch before update on public.cases
  for each row execute function public.touch_case();

-- Can the current user see this case? (staff: all, client: only their own)
create or replace function public.can_view_case(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_staff() or exists (select 1 from public.cases where id = cid and client_id = auth.uid())
$$;

-- ------------------------------------------------------------
-- 4. EVIDENCE (chain of custody)
-- ------------------------------------------------------------
create table if not exists public.evidence (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  label            text not null check (char_length(label) between 1 and 200),
  evidence_type    text not null default 'Other',
  source_host      text not null default '',
  sha256           text not null default '' check (sha256 = '' or sha256 ~* '^[a-f0-9]{64}$'),
  size_text        text not null default '',
  collected_by     text not null default '',
  collected_at     timestamptz,
  storage_location text not null default '',
  notes            text not null default '',
  created_at       timestamptz not null default now()
);
create index if not exists evidence_case_idx on public.evidence (case_id);

-- ------------------------------------------------------------
-- 5. TIMELINE EVENTS
-- ------------------------------------------------------------
create table if not exists public.timeline_events (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases (id) on delete cascade,
  event_time  timestamptz not null,
  description text not null check (char_length(description) between 1 and 2000),
  source      text not null default '',
  mitre       text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists timeline_case_idx on public.timeline_events (case_id, event_time);

-- ------------------------------------------------------------
-- 6. IOCs (indicators of compromise)
-- ------------------------------------------------------------
create table if not exists public.iocs (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases (id) on delete cascade,
  ioc_type    text not null default 'Other',
  value       text not null check (char_length(value) between 1 and 1000),
  description text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists iocs_case_idx on public.iocs (case_id);

-- ------------------------------------------------------------
-- 7. NOTES / UPDATES (internal team notes, or updates shared with the client)
-- ------------------------------------------------------------
create table if not exists public.case_notes (
  id             uuid primary key default gen_random_uuid(),
  case_id        uuid not null references public.cases (id) on delete cascade,
  author_id      uuid references public.profiles (id) on delete set null,
  author_name    text not null default '',
  author_role    text not null default '',
  body           text not null check (char_length(body) between 1 and 5000),
  client_visible boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists notes_case_idx on public.case_notes (case_id, created_at);

-- Author is always the logged-in user (cannot be faked from the browser)
create or replace function public.stamp_note_author()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.author_id := auth.uid();
  select coalesce(nullif(full_name, ''), email), role into new.author_name, new.author_role
  from public.profiles where id = auth.uid();
  return new;
end $$;

drop trigger if exists notes_stamp on public.case_notes;
create trigger notes_stamp before insert on public.case_notes
  for each row execute function public.stamp_note_author();

-- When evidence, timeline, IOCs or notes are added, bump the case's "last updated" time
create or replace function public.touch_parent_case()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.cases set updated_at = now() where id = new.case_id;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['evidence', 'timeline_events', 'iocs', 'case_notes'] loop
    execute format('drop trigger if exists %1$s_touch_case on public.%1$I', t);
    execute format('create trigger %1$s_touch_case after insert on public.%1$I for each row execute function public.touch_parent_case()', t);
  end loop;
end $$;

-- ============================================================
-- SECURITY: Row Level Security on every table
-- ============================================================
alter table public.leads           enable row level security;
alter table public.profiles        enable row level security;
alter table public.cases           enable row level security;
alter table public.evidence        enable row level security;
alter table public.timeline_events enable row level security;
alter table public.iocs            enable row level security;
alter table public.case_notes      enable row level security;

-- Remove policies from the earlier version of this file
drop policy if exists "admin read"   on public.leads;
drop policy if exists "admin update" on public.leads;
drop policy if exists "admin delete" on public.leads;

-- LEADS: website visitors can only submit; only staff can read/manage
drop policy if exists "anyone can submit" on public.leads;
create policy "anyone can submit" on public.leads for insert to anon, authenticated with check (status = 'new');
drop policy if exists "staff read leads" on public.leads;
create policy "staff read leads" on public.leads for select to authenticated using (public.is_staff());
drop policy if exists "staff update leads" on public.leads;
create policy "staff update leads" on public.leads for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff delete leads" on public.leads;
create policy "staff delete leads" on public.leads for delete to authenticated using (public.is_staff());

-- PROFILES: you see yourself; staff see everyone; everyone can see staff names; only admin edits
drop policy if exists "read profiles" on public.profiles;
create policy "read profiles" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff() or role in ('admin', 'analyst'));
drop policy if exists "admin edits profiles" on public.profiles;
create policy "admin edits profiles" on public.profiles for update to authenticated
  using (public.my_role() = 'admin') with check (public.my_role() = 'admin');

-- CASES
drop policy if exists "view cases" on public.cases;
create policy "view cases" on public.cases for select to authenticated
  using (public.is_staff() or client_id = auth.uid());
drop policy if exists "staff create cases" on public.cases;
create policy "staff create cases" on public.cases for insert to authenticated with check (public.is_staff());
drop policy if exists "staff update cases" on public.cases;
create policy "staff update cases" on public.cases for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "admin delete cases" on public.cases;
create policy "admin delete cases" on public.cases for delete to authenticated using (public.my_role() = 'admin');

-- EVIDENCE / TIMELINE / IOCs: client can view own case's items; staff manage
do $$
declare t text;
begin
  foreach t in array array['evidence', 'timeline_events', 'iocs'] loop
    execute format('drop policy if exists "view %1$s" on public.%1$I', t);
    execute format('create policy "view %1$s" on public.%1$I for select to authenticated using (public.can_view_case(case_id))', t);
    execute format('drop policy if exists "staff insert %1$s" on public.%1$I', t);
    execute format('create policy "staff insert %1$s" on public.%1$I for insert to authenticated with check (public.is_staff())', t);
    execute format('drop policy if exists "staff update %1$s" on public.%1$I', t);
    execute format('create policy "staff update %1$s" on public.%1$I for update to authenticated using (public.is_staff()) with check (public.is_staff())', t);
    execute format('drop policy if exists "staff delete %1$s" on public.%1$I', t);
    execute format('create policy "staff delete %1$s" on public.%1$I for delete to authenticated using (public.is_staff())', t);
  end loop;
end $$;

-- NOTES: staff see all; client sees only shared updates on own cases and can reply (always shared)
drop policy if exists "view notes" on public.case_notes;
create policy "view notes" on public.case_notes for select to authenticated
  using (public.is_staff() or (client_visible and public.can_view_case(case_id)));
drop policy if exists "add notes" on public.case_notes;
create policy "add notes" on public.case_notes for insert to authenticated
  with check (public.is_staff() or (client_visible = true and public.can_view_case(case_id)));
drop policy if exists "staff delete notes" on public.case_notes;
create policy "staff delete notes" on public.case_notes for delete to authenticated using (public.is_staff());

-- ============================================================
-- Permissions for the website's API access (RLS above still applies)
-- ============================================================
grant usage on schema public to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant select, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.cases, public.evidence, public.timeline_events, public.iocs, public.case_notes to authenticated;
grant select, update on public.profiles to authenticated;
grant usage, select on sequence public.case_seq to authenticated;
grant execute on function public.my_role(), public.is_staff(), public.can_view_case(uuid) to authenticated;

-- ============================================================
-- LAST STEP — make YOURSELF the admin.
-- Replace the email below with the one you log in with, then run this script.
-- (Run just this line again any time to promote another user.)
-- ============================================================
update public.profiles set role = 'admin' where email = 'YOUR-EMAIL@example.com';

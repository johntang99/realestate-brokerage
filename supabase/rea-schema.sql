-- ============================================================
-- BAAM System G — Real Estate Agent (REA)
-- Run this ONCE in your Supabase SQL editor (REA project)
-- Supabase project: Real estate (jbbcuczsrwizbxbnhedc)
-- ============================================================

create extension if not exists pgcrypto;

-- ── Sites ────────────────────────────────────────────────────
create table if not exists public.sites (
  id                  text primary key,
  name                text not null,
  domain              text,
  enabled             boolean not null default true,
  default_locale      text not null default 'en',
  supported_locales   text[] not null default array['en']::text[],
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.site_domains (
  id          uuid primary key default gen_random_uuid(),
  site_id     text not null references public.sites(id) on delete cascade,
  domain      text not null,
  environment text not null default 'prod',
  is_primary  boolean not null default false,
  enabled     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (site_id, domain, environment)
);
create index if not exists site_domains_domain_idx on public.site_domains (domain);

-- ── Admin users ───────────────────────────────────────────────
create table if not exists public.admin_users (
  id              text primary key,
  email           text not null unique,
  name            text not null,
  role            text not null,
  sites           text[] not null default '{}'::text[],
  avatar          text,
  password_hash   text not null,
  created_at      timestamptz not null default now(),
  last_login_at   timestamptz not null default now()
);

-- ── Media assets ──────────────────────────────────────────────
create table if not exists public.media_assets (
  id          uuid primary key default gen_random_uuid(),
  site_id     text not null,
  path        text not null,
  url         text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (site_id, path)
);

-- ── Content entries (DB-first CMS) ───────────────────────────
create table if not exists public.content_entries (
  id          uuid primary key default gen_random_uuid(),
  site_id     text not null,
  locale      text not null,
  path        text not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  text,
  unique (site_id, locale, path)
);
create index if not exists content_entries_site_locale_idx
  on public.content_entries (site_id, locale);
create index if not exists content_entries_path_idx
  on public.content_entries (path);

-- ── Content revisions (audit trail) ──────────────────────────
create table if not exists public.content_revisions (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references public.content_entries(id) on delete cascade,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  created_by  text,
  note        text
);

-- ── Admin audit logs ──────────────────────────────────────────
create table if not exists public.admin_audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    text,
  actor_email text,
  action      text not null,
  site_id     text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- ── REA: Consultation requests (contact form) ─────────────────
create table if not exists public.consultation_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  site_id             text not null,
  data                jsonb not null,
  notification_sent   boolean not null default false
);
create index if not exists consultation_requests_site_idx
  on public.consultation_requests (site_id, created_at desc);

-- ── REA: Home valuation requests ──────────────────────────────
create table if not exists public.valuation_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  site_id             text not null,
  data                jsonb not null,
  notification_sent   boolean not null default false
);
create index if not exists valuation_requests_site_idx
  on public.valuation_requests (site_id, created_at desc);

-- ── REA: Property inquiry requests ───────────────────────────
create table if not exists public.property_inquiries (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  site_id             text not null,
  data                jsonb not null,
  notification_sent   boolean not null default false
);
create index if not exists property_inquiries_site_idx
  on public.property_inquiries (site_id, created_at desc);

-- ── REA: Showing requests ─────────────────────────────────────
create table if not exists public.showing_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  site_id             text not null,
  data                jsonb not null,
  notification_sent   boolean not null default false
);

-- ── REA: Newsletter subscribers ───────────────────────────────
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  site_id     text not null,
  email       text not null,
  confirmed   boolean not null default false,
  unique (site_id, email)
);

-- ── RLS: deny all public access (service-role only) ──────────

alter table public.sites enable row level security;
drop policy if exists "deny_public" on public.sites;
create policy "deny_public" on public.sites for all
  to anon, authenticated using (false) with check (false);

alter table public.site_domains enable row level security;
drop policy if exists "deny_public" on public.site_domains;
create policy "deny_public" on public.site_domains for all
  to anon, authenticated using (false) with check (false);

alter table public.admin_users enable row level security;
drop policy if exists "deny_public" on public.admin_users;
create policy "deny_public" on public.admin_users for all
  to anon, authenticated using (false) with check (false);

alter table public.media_assets enable row level security;
drop policy if exists "deny_public" on public.media_assets;
create policy "deny_public" on public.media_assets for all
  to anon, authenticated using (false) with check (false);

alter table public.content_entries enable row level security;
drop policy if exists "deny_public" on public.content_entries;
create policy "deny_public" on public.content_entries for all
  to anon, authenticated using (false) with check (false);

alter table public.content_revisions enable row level security;
drop policy if exists "deny_public" on public.content_revisions;
create policy "deny_public" on public.content_revisions for all
  to anon, authenticated using (false) with check (false);

alter table public.admin_audit_logs enable row level security;
drop policy if exists "deny_public" on public.admin_audit_logs;
create policy "deny_public" on public.admin_audit_logs for all
  to anon, authenticated using (false) with check (false);

alter table public.consultation_requests enable row level security;
drop policy if exists "deny_public" on public.consultation_requests;
create policy "deny_public" on public.consultation_requests for all
  to anon, authenticated using (false) with check (false);

alter table public.valuation_requests enable row level security;
drop policy if exists "deny_public" on public.valuation_requests;
create policy "deny_public" on public.valuation_requests for all
  to anon, authenticated using (false) with check (false);

alter table public.property_inquiries enable row level security;
drop policy if exists "deny_public" on public.property_inquiries;
create policy "deny_public" on public.property_inquiries for all
  to anon, authenticated using (false) with check (false);

alter table public.showing_requests enable row level security;
drop policy if exists "deny_public" on public.showing_requests;
create policy "deny_public" on public.showing_requests for all
  to anon, authenticated using (false) with check (false);

alter table public.newsletter_subscribers enable row level security;
drop policy if exists "deny_public" on public.newsletter_subscribers;
create policy "deny_public" on public.newsletter_subscribers for all
  to anon, authenticated using (false) with check (false);

-- ── Seed: Site entry ──────────────────────────────────────────
insert into public.sites (id, name, domain, enabled, default_locale, supported_locales)
values ('realestate', 'REA Premium Template', 'rea.local', true, 'en', array['en']::text[])
on conflict (id) do nothing;

-- ── Seed: Default admin user ──────────────────────────────────
-- Password: admin123  (change immediately after first login)
insert into public.admin_users (id, email, name, role, sites, password_hash)
values (
  'admin-rea-001',
  'admin@example.com',
  'Admin',
  'super_admin',
  array['realestate']::text[],
  '$2b$10$WSevTYPp5V9yF5LXi4WThuqj3DyOLMV.DJOLa.D8h8sLvCEf8ovnq'
)
on conflict (email) do update set password_hash = excluded.password_hash;

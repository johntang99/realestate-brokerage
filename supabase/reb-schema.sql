-- ============================================================
-- BAAM System H — REB Premium Supabase Schema
-- Run this in your "Real Estate Brokerage" Supabase project
-- ============================================================

-- CORE TABLES (same as REA base)
CREATE TABLE IF NOT EXISTS public.sites (
  id text PRIMARY KEY,
  name text NOT NULL,
  domain text,
  default_locale text DEFAULT 'en',
  supported_locales text[] DEFAULT '{en}',
  enabled boolean DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_domains (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  domain text NOT NULL UNIQUE,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text REFERENCES public.sites(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text,
  role text DEFAULT 'broker_admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  storage_url text NOT NULL,
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  path text NOT NULL,
  content jsonb DEFAULT '{}',
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, locale, path)
);

CREATE TABLE IF NOT EXISTS public.content_revisions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  path text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text,
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- LEAD/FORM TABLES (from REA)
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  preferred_time text,
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.valuation_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  beds text,
  baths text,
  sqft text,
  year_built text,
  condition text,
  timeline text,
  message text,
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.property_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  property_slug text,
  agent_slug text,
  message text,
  inquiry_type text,
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.showing_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  property_address text,
  agent_slug text,
  preferred_date text,
  preferred_time text,
  message text,
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  first_name text,
  source text DEFAULT 'newsletter',
  is_active boolean DEFAULT true,
  UNIQUE(site_id, email)
);

-- REB-SPECIFIC NEW TABLES
CREATE TABLE IF NOT EXISTS public.agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE IF NOT EXISTS public.agent_users (
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.admin_users(id) ON DELETE CASCADE,
  PRIMARY KEY (agent_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.new_construction (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  event_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE IF NOT EXISTS public.join_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  current_situation text,
  years_experience text,
  current_volume text,
  best_time_to_chat text,
  message text,
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.investor_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  investment_type text,
  budget_range text,
  timeline text,
  message text,
  status text DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.gated_downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  first_name text,
  guide_slug text NOT NULL,
  download_sent boolean DEFAULT false
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_construction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gated_downloads ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
CREATE POLICY "Public read content_entries" ON public.content_entries FOR SELECT USING (true);
CREATE POLICY "Public read agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Public read new_construction" ON public.new_construction FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Public read site_domains" ON public.site_domains FOR SELECT USING (true);

-- Service role full access on all tables
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'sites','site_domains','admin_users','media_assets','content_entries','content_revisions',
    'admin_audit_logs','consultation_requests','valuation_requests','property_inquiries',
    'showing_requests','newsletter_subscribers','agents','agent_users','new_construction',
    'events','join_requests','investor_inquiries','gated_downloads'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY "Service role full access %s" ON public.%s USING (auth.role() = ''service_role'');',
      t, t
    );
  END LOOP;
END $$;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert the REB site
INSERT INTO public.sites (id, name, domain, default_locale, supported_locales, enabled)
VALUES ('reb-template', 'REB Premium Template', 'reb.local', 'en', '{en}', true)
ON CONFLICT (id) DO NOTHING;

-- Insert broker admin user (password: admin123)
INSERT INTO public.admin_users (site_id, email, password_hash, name, role, is_active)
VALUES (
  'reb-template',
  'admin@pinnaclerealty.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Jane Smith',
  'broker_admin',
  true
)
ON CONFLICT (email) DO NOTHING;

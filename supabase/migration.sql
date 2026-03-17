-- ============================================================
-- Horse Hotel AMS — Supabase Table Creation
-- ============================================================
-- Run this SQL in your Supabase SQL Editor to create all tables.
-- This will DROP existing horse_hotel_* tables if they exist.
-- ============================================================

-- 1. Drop existing horse_hotel tables (safe if they don't exist)
DROP TABLE IF EXISTS public.horse_hotel_notifications CASCADE;
DROP TABLE IF EXISTS public.horse_hotel_transports CASCADE;
DROP TABLE IF EXISTS public.horse_hotel_requests CASCADE;
DROP TABLE IF EXISTS public.horse_hotel_tasks CASCADE;
DROP TABLE IF EXISTS public.horse_hotel_announcements CASCADE;
DROP TABLE IF EXISTS public.horse_hotel_horses CASCADE;
DROP TABLE IF EXISTS public.horse_hotel_users CASCADE;

-- 2. Drop old enum types
DROP TYPE IF EXISTS hotel_user_role CASCADE;
DROP TYPE IF EXISTS hotel_user_status CASCADE;
DROP TYPE IF EXISTS horse_stable_type CASCADE;
DROP TYPE IF EXISTS horse_status CASCADE;
DROP TYPE IF EXISTS horse_food_type CASCADE;
DROP TYPE IF EXISTS horse_feed_type CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS announcement_audience CASCADE;
DROP TYPE IF EXISTS transport_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_audience CASCADE;

-- 3. Create enum types
CREATE TYPE hotel_user_role AS ENUM ('admin', 'worker', 'client');
CREATE TYPE hotel_user_status AS ENUM ('pending', 'active');
CREATE TYPE horse_stable_type AS ENUM ('shavings', 'straw');
CREATE TYPE horse_status AS ENUM ('upcoming', 'checked-in', 'checked-out');
CREATE TYPE horse_food_type AS ENUM ('hay', 'grass', 'both');
CREATE TYPE horse_feed_type AS ENUM ('standard', 'client-prepared', 'other');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE announcement_audience AS ENUM ('all', 'staff', 'clients');
CREATE TYPE transport_status AS ENUM ('scheduled', 'in-transit', 'completed');
CREATE TYPE notification_type AS ENUM ('arrival', 'departure', 'request', 'task', 'transport', 'announcement', 'registration');
CREATE TYPE notification_audience AS ENUM ('all', 'staff', 'clients');

-- 4. Create tables

-- ── Users ──
CREATE TABLE public.horse_hotel_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role hotel_user_role NOT NULL DEFAULT 'client',
  status hotel_user_status NOT NULL DEFAULT 'pending',
  phone text,
  avatar text,
  password text,
  invite_token text,
  session_token text,
  lang text DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Horses ──
CREATE TABLE public.horse_hotel_horses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  passport_id text UNIQUE,
  mother_name text,
  owner_id uuid REFERENCES public.horse_hotel_users(id) ON DELETE SET NULL,
  owner_name text,
  check_in date,
  check_out date,
  check_in_time text,
  check_out_time text,
  stable_type horse_stable_type DEFAULT 'shavings',
  stable_location text,
  walker_schedule boolean DEFAULT false,
  paddock_schedule boolean DEFAULT false,
  quarantine boolean DEFAULT false,
  quarantine_start date,
  quarantine_end date,
  transport_destination text,
  notes text,
  image_url text,
  status horse_status DEFAULT 'upcoming',
  food_type horse_food_type DEFAULT 'hay',
  feed_type horse_feed_type DEFAULT 'standard',
  feed_other text,
  special_care text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Tasks ──
CREATE TABLE public.horse_hotel_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  horse_id uuid REFERENCES public.horse_hotel_horses(id) ON DELETE SET NULL,
  horse_name text,
  assigned_to uuid REFERENCES public.horse_hotel_users(id) ON DELETE SET NULL,
  assigned_to_name text,
  due_date date,
  completed boolean DEFAULT false,
  priority task_priority DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.horse_hotel_users(id) ON DELETE SET NULL
);

-- ── Client Requests ──
CREATE TABLE public.horse_hotel_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.horse_hotel_users(id) ON DELETE SET NULL,
  client_name text,
  title text NOT NULL,
  description text,
  facility_type text,
  requested_date date,
  requested_time text,
  requested_end_time text,
  status request_status DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Announcements ──
CREATE TABLE public.horse_hotel_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category text DEFAULT 'general',
  audience announcement_audience DEFAULT 'all',
  author_id uuid REFERENCES public.horse_hotel_users(id) ON DELETE SET NULL,
  author_name text,
  pinned boolean DEFAULT false,
  archived boolean DEFAULT false,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Transports ──
CREATE TABLE public.horse_hotel_transports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id uuid REFERENCES public.horse_hotel_horses(id) ON DELETE SET NULL,
  horse_name text,
  transport_date date,
  transport_time text,
  origin text,
  destination text,
  driver_id uuid REFERENCES public.horse_hotel_users(id) ON DELETE SET NULL,
  driver text,
  notes text,
  status transport_status DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Notifications ──
CREATE TABLE public.horse_hotel_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type,
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  link text,
  audience notification_audience,
  target_user_id uuid REFERENCES public.horse_hotel_users(id) ON DELETE CASCADE,
  source_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE public.horse_hotel_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_hotel_horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_hotel_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_hotel_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_hotel_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_hotel_transports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_hotel_notifications ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies — allow all for anon key (auth is handled in-app)
CREATE POLICY "horse_hotel_users_all" ON public.horse_hotel_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "horse_hotel_horses_all" ON public.horse_hotel_horses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "horse_hotel_tasks_all" ON public.horse_hotel_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "horse_hotel_requests_all" ON public.horse_hotel_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "horse_hotel_announcements_all" ON public.horse_hotel_announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "horse_hotel_transports_all" ON public.horse_hotel_transports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "horse_hotel_notifications_all" ON public.horse_hotel_notifications FOR ALL USING (true) WITH CHECK (true);

-- 7. Seed master admin user (invisible in Users page, cannot be edited or deleted)
INSERT INTO public.horse_hotel_users (email, name, role, status, password, created_at)
VALUES ('deverickydias@gmail.com', 'Ericky', 'admin', 'active', 'Brasilnet1', '2024-01-01');

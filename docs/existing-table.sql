-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.class_sets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entry_year integer NOT NULL UNIQUE,
  family_name text,
  CONSTRAINT class_sets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.elib_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  department text NOT NULL,
  level integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT elib_courses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.elib_downloads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  material_id uuid,
  downloaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT elib_downloads_pkey PRIMARY KEY (id),
  CONSTRAINT elib_downloads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT elib_downloads_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.elib_materials(id)
);
CREATE TABLE public.elib_materials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  title text NOT NULL,
  type USER-DEFINED DEFAULT 'PQ'::material_type,
  year text,
  semester USER-DEFINED,
  file_path text NOT NULL,
  file_size integer DEFAULT 0,
  downloads integer DEFAULT 0,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT elib_materials_pkey PRIMARY KEY (id),
  CONSTRAINT elib_materials_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.elib_courses(id),
  CONSTRAINT elib_materials_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.event_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  question_text text NOT NULL,
  scripture_reference text,
  asked_by_profile_id uuid,
  asker_name text,
  answer_text text,
  answered_by_profile_id uuid,
  answered_at timestamp with time zone,
  status USER-DEFINED DEFAULT 'visible'::question_status,
  is_pinned boolean DEFAULT false,
  cluster_id uuid,
  parent_question_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  search_vector tsvector DEFAULT to_tsvector('english'::regconfig, ((((question_text || ' '::text) || COALESCE(scripture_reference, ''::text)) || ' '::text) || COALESCE(answer_text, ''::text))),
  CONSTRAINT event_questions_pkey PRIMARY KEY (id),
  CONSTRAINT event_questions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_questions_asked_by_profile_id_fkey FOREIGN KEY (asked_by_profile_id) REFERENCES public.profiles(id),
  CONSTRAINT event_questions_answered_by_profile_id_fkey FOREIGN KEY (answered_by_profile_id) REFERENCES public.profiles(id),
  CONSTRAINT event_questions_parent_question_id_fkey FOREIGN KEY (parent_question_id) REFERENCES public.event_questions(id)
);
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone_number text NOT NULL,
  level text,
  checked_in_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  email text,
  gender text,
  relationship_status text,
  referral_source text,
  questions_content text,
  is_rcf_member boolean DEFAULT false,
  coupon_code text,
  coupon_active boolean DEFAULT false,
  coupon_used_at timestamp with time zone,
  department text,
  matric_number text,
  raffle_id integer UNIQUE,
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  config jsonb DEFAULT '{"max_shopping_items": 2}'::jsonb,
  is_recurring boolean DEFAULT false,
  is_exclusive boolean DEFAULT false,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.leadership (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenure_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  unit_id uuid,
  can_manage_unit boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  class_set_id uuid,
  position_id uuid NOT NULL,
  residential_zone_id uuid,
  CONSTRAINT leadership_pkey PRIMARY KEY (id),
  CONSTRAINT leadership_tenure_id_fkey FOREIGN KEY (tenure_id) REFERENCES public.tenures(id),
  CONSTRAINT leadership_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT leadership_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id),
  CONSTRAINT leadership_class_set_id_fkey FOREIGN KEY (class_set_id) REFERENCES public.class_sets(id),
  CONSTRAINT leadership_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.leadership_positions(id),
  CONSTRAINT leadership_residential_zone_id_fkey FOREIGN KEY (residential_zone_id) REFERENCES public.residential_zones(id)
);
CREATE TABLE public.leadership_positions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category = ANY (ARRAY['PRESIDENT'::text, 'CENTRAL'::text, 'UNIT'::text, 'TEAM'::text, 'LEVEL'::text, 'ZONE'::text])),
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leadership_positions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.membership_units (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  tenure_id uuid NOT NULL,
  role text DEFAULT 'Member'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT membership_units_pkey PRIMARY KEY (id),
  CONSTRAINT membership_units_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT membership_units_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id),
  CONSTRAINT membership_units_tenure_id_fkey FOREIGN KEY (tenure_id) REFERENCES public.tenures(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  middle_name text,
  gender text CHECK (gender = ANY (ARRAY['male'::text, 'female'::text])),
  dob date,
  phone_number text,
  matric_number text UNIQUE,
  department text,
  faculty text,
  entry_year integer,
  school_address text,
  home_address text,
  residential_zone_id uuid,
  next_of_kin_name text,
  next_of_kin_phone text,
  parent_phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  avatar_url text,
  class_set_id uuid,
  email text UNIQUE,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_residential_zone_id_fkey FOREIGN KEY (residential_zone_id) REFERENCES public.residential_zones(id),
  CONSTRAINT profiles_class_set_id_fkey FOREIGN KEY (class_set_id) REFERENCES public.class_sets(id)
);
CREATE TABLE public.question_flags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL,
  reason USER-DEFINED NOT NULL,
  description text,
  flagged_by_profile_id uuid,
  flagged_by_name text,
  resolved_by_profile_id uuid,
  resolved_at timestamp with time zone,
  resolution_note text,
  created_at timestamp with time zone DEFAULT now(),
  is_resolved boolean DEFAULT false,
  CONSTRAINT question_flags_pkey PRIMARY KEY (id),
  CONSTRAINT question_flags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.event_questions(id),
  CONSTRAINT question_flags_flagged_by_profile_id_fkey FOREIGN KEY (flagged_by_profile_id) REFERENCES public.profiles(id),
  CONSTRAINT question_flags_resolved_by_profile_id_fkey FOREIGN KEY (resolved_by_profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.question_references (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  main_question_id uuid NOT NULL,
  referenced_question_id uuid NOT NULL,
  reference_type text DEFAULT 'related'::text CHECK (reference_type = ANY (ARRAY['duplicate'::text, 'related'::text, 'follow_up'::text, 'clarification'::text])),
  note text,
  linked_by_profile_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT question_references_pkey PRIMARY KEY (id),
  CONSTRAINT question_references_main_question_id_fkey FOREIGN KEY (main_question_id) REFERENCES public.event_questions(id),
  CONSTRAINT question_references_referenced_question_id_fkey FOREIGN KEY (referenced_question_id) REFERENCES public.event_questions(id),
  CONSTRAINT question_references_linked_by_profile_id_fkey FOREIGN KEY (linked_by_profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.question_stars (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL,
  profile_id uuid,
  session_id text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT question_stars_pkey PRIMARY KEY (id),
  CONSTRAINT question_stars_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.residential_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  CONSTRAINT residential_zones_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rw_admin_moderators (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  role text NOT NULL CHECK (role = ANY (ARRAY['ADMIN'::text, 'MODERATOR'::text])),
  added_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rw_admin_moderators_pkey PRIMARY KEY (id),
  CONSTRAINT rw_admin_moderators_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT rw_admin_moderators_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.tenures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  session text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tenures_pkey PRIMARY KEY (id)
);
CREATE TABLE public.unit_positions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL,
  position_id uuid NOT NULL,
  role_type USER-DEFINED NOT NULL DEFAULT 'assistant'::unit_role_type,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unit_positions_pkey PRIMARY KEY (id),
  CONSTRAINT unit_positions_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id),
  CONSTRAINT unit_positions_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.leadership_positions(id)
);
CREATE TABLE public.units (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type = ANY (ARRAY['UNIT'::text, 'TEAM'::text])),
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT units_pkey PRIMARY KEY (id)
);
CREATE TABLE public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT verification_codes_pkey PRIMARY KEY (id)
);

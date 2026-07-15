-- ═══════════════════════════════════════════════════════════════════════════
-- RCF FUTA — Redemption Week '26 · Sponsors
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Admin-managed sponsor profiles. Each sponsor gets a public page at
-- /sponsors/<slug>. Some sponsors collect member data (opt-in + opt-out, leads
-- stored in rw_sponsor_leads); others are showcase-only (collects_data = false).
--
-- Run in the Supabase SQL Editor. Idempotent. Pairs with docs/sponsor-leads.sql.
-- Depends on set_updated_at() and pgcrypto from schema.sql.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.rw_sponsors (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug           TEXT NOT NULL UNIQUE,        -- URL segment, e.g. 'skybil'
    name           TEXT NOT NULL,
    tagline        TEXT NOT NULL DEFAULT '',
    description    TEXT NOT NULL DEFAULT '',
    url            TEXT NOT NULL DEFAULT '',     -- sponsor website
    logo_url       TEXT NOT NULL DEFAULT '',     -- Cloudinary URL or /public path
    brand_color    TEXT NOT NULL DEFAULT '#1B4DF5',
    -- Courses / offerings. Drives the sign-up skill dropdown and the "what you
    -- get" display. Stored as a JSON array of strings.
    courses        JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- When false, the sponsor's page is a showcase only (no form, no opt-out).
    collects_data  BOOLEAN NOT NULL DEFAULT TRUE,
    -- When false, the sponsor is hidden from the public site.
    active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.rw_sponsors IS 'Admin-managed sponsor profiles rendered at /sponsors/<slug>.';
COMMENT ON COLUMN public.rw_sponsors.collects_data IS 'FALSE = showcase-only page (no lead collection).';

CREATE OR REPLACE TRIGGER rw_sponsors_set_updated_at
    BEFORE UPDATE ON public.rw_sponsors
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_sponsors_slug   ON public.rw_sponsors(slug);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON public.rw_sponsors(active);

-- RLS enabled, no public policies: only the service-role client (used server-side)
-- reads/writes. Mirrors rw_orders / rw_sponsor_leads.
ALTER TABLE public.rw_sponsors ENABLE ROW LEVEL SECURITY;


-- ─── Seed: Skybil ─────────────────────────────────────────────────────────────

INSERT INTO public.rw_sponsors (slug, name, tagline, description, url, logo_url, brand_color, courses, collects_data, active)
VALUES (
    'skybil',
    'Skybil',
    'Elevate Your Skills in Tech and Finance',
    'Skybil is an EdTech academy empowering young Africans through smart, self-paced digital learning. As a Redemption Week ''26 sponsor, Skybil is opening free access to its tech and finance courses for the RCF FUTA family.',
    'https://skybil.com.ng/home',
    '/images/sponsors/skybil-logo.jpeg',
    '#1B4DF5',
    '["Web Development", "Python Programming", "Graphic Design", "Finance", "Other"]'::jsonb,
    TRUE,
    TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- RCF FUTA — Redemption Week '26 · Sponsor Leads
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Lead collection for sponsor partnerships (currently: Skybil — https://skybil.com.ng).
-- Confirmed customers are auto-included by an admin-initiated import; anyone can
-- also sign up via the public /sponsors/<slug> page, and anyone can opt out.
--
-- One row per (sponsor_slug, email). A person can be BOTH a form sign-up and an
-- auto-included customer — that is why signed_up / auto_included are separate flags
-- rather than separate rows.
--
-- Run this entire file in the Supabase SQL Editor. It is idempotent (safe to re-run).
-- Depends on set_updated_at() and the pgcrypto extension from schema.sql.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- set_updated_at() is defined in schema.sql. Re-declared here so this file can be
-- applied standalone without error.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.rw_sponsor_leads (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_slug   TEXT NOT NULL,              -- e.g. 'skybil'
    email          TEXT NOT NULL,              -- always stored lower-cased
    full_name      TEXT NOT NULL,
    whatsapp       TEXT,                        -- nullable (opt-out-only rows may lack it)
    skill          TEXT,                        -- optional course of interest
    -- How the lead came to exist. A person can be both.
    signed_up      BOOLEAN NOT NULL DEFAULT FALSE,   -- filled the public form
    auto_included  BOOLEAN NOT NULL DEFAULT FALSE,   -- matched as a confirmed customer on import
    opted_out      BOOLEAN NOT NULL DEFAULT FALSE,   -- excluded from export; greyed in admin UI
    -- Consent (true only for explicit form sign-ups). consent_text is a snapshot of
    -- the exact wording the person accepted, kept for compliance/audit.
    consent        BOOLEAN NOT NULL DEFAULT FALSE,
    consent_text   TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT rw_sponsor_leads_slug_email_uniq UNIQUE (sponsor_slug, email)
);

COMMENT ON TABLE public.rw_sponsor_leads IS
    'Sponsor lead collection (e.g. Skybil). One row per (sponsor_slug, email).';
COMMENT ON COLUMN public.rw_sponsor_leads.signed_up IS 'Person filled the public sponsor form.';
COMMENT ON COLUMN public.rw_sponsor_leads.auto_included IS 'Matched as a confirmed customer during admin import.';
COMMENT ON COLUMN public.rw_sponsor_leads.opted_out IS 'Person opted out — suppressed from export.';
COMMENT ON COLUMN public.rw_sponsor_leads.consent_text IS 'Snapshot of the exact consent wording accepted at sign-up.';

CREATE OR REPLACE TRIGGER rw_sponsor_leads_set_updated_at
    BEFORE UPDATE ON public.rw_sponsor_leads
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_sponsor_leads_slug  ON public.rw_sponsor_leads(sponsor_slug);
CREATE INDEX IF NOT EXISTS idx_sponsor_leads_email ON public.rw_sponsor_leads(email);


-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS with NO public policies: only the service-role client (used by the
-- server-side sponsor service) can read/write. This mirrors rw_orders.

ALTER TABLE public.rw_sponsor_leads ENABLE ROW LEVEL SECURITY;

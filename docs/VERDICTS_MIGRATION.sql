-- ═══════════════════════════════════════════════════════════════════════════
-- Verdict feature migration — run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════
-- Fresh database? Just run docs/schema.sql (everything below is already in it).
-- Existing database? Run this focused, idempotent migration.
--
-- NOTE: If Postgres complains that "ALTER TYPE ... ADD VALUE cannot run inside a
-- transaction block", run STEP 1 (the two ALTER TYPE lines) on its own first,
-- then run the rest.
-- ───────────────────────────────────────────────────────────────────────────

-- STEP 1 — extend the enums
ALTER TYPE order_status   ADD VALUE IF NOT EXISTS 'ready_for_pickup' BEFORE 'delivered';

DO $$ BEGIN
    CREATE TYPE verdict_status AS ENUM ('active', 'fulfilled', 'voided');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TYPE verdict_status ADD VALUE IF NOT EXISTS 'fulfilled' BEFORE 'voided';

-- STEP 2 — order pickup/delivery columns
ALTER TABLE rw_orders ADD COLUMN IF NOT EXISTS pickup_token       TEXT;
ALTER TABLE rw_orders ADD COLUMN IF NOT EXISTS delivered_at       TIMESTAMPTZ;
ALTER TABLE rw_orders ADD COLUMN IF NOT EXISTS delivered_by_name  TEXT;
ALTER TABLE rw_orders ADD COLUMN IF NOT EXISTS delivered_by_email TEXT;

-- STEP 3 — verdict ref generator
CREATE SEQUENCE IF NOT EXISTS rw_verdict_seq START 1;
CREATE OR REPLACE FUNCTION generate_verdict_ref()
RETURNS TEXT AS $$
BEGIN
    RETURN 'RW26-V-' || LPAD(nextval('rw_verdict_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- STEP 4 — verdict tables
CREATE TABLE IF NOT EXISTS public.rw_verdicts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verdict_ref         TEXT NOT NULL UNIQUE DEFAULT generate_verdict_ref(),
    status              verdict_status NOT NULL DEFAULT 'active',
    issued_by_profile_id UUID REFERENCES public.profiles(id),
    issued_by_name       TEXT NOT NULL,
    issued_by_email      TEXT NOT NULL,
    note                 TEXT,
    manifest            JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount        INTEGER NOT NULL DEFAULT 0,
    total_units         INTEGER NOT NULL DEFAULT 0,
    order_count         INTEGER NOT NULL DEFAULT 0,
    bank_name           TEXT,
    bank_account_name   TEXT,
    bank_account_number TEXT,
    fulfilled_at         TIMESTAMPTZ,
    fulfilled_by_profile_id UUID REFERENCES public.profiles(id),
    fulfilled_by_name    TEXT,
    fulfilled_by_email   TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- (in case the table predates fulfilment tracking)
ALTER TABLE public.rw_verdicts ADD COLUMN IF NOT EXISTS fulfilled_at            TIMESTAMPTZ;
ALTER TABLE public.rw_verdicts ADD COLUMN IF NOT EXISTS fulfilled_by_profile_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.rw_verdicts ADD COLUMN IF NOT EXISTS fulfilled_by_name       TEXT;
ALTER TABLE public.rw_verdicts ADD COLUMN IF NOT EXISTS fulfilled_by_email      TEXT;

CREATE OR REPLACE TRIGGER verdicts_set_updated_at
    BEFORE UPDATE ON public.rw_verdicts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_verdicts_created_at ON public.rw_verdicts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verdicts_status     ON public.rw_verdicts(status);

CREATE TABLE IF NOT EXISTS public.rw_verdict_orders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verdict_id    UUID NOT NULL REFERENCES public.rw_verdicts(id) ON DELETE CASCADE,
    order_id      UUID NOT NULL REFERENCES public.rw_orders(id)   ON DELETE CASCADE,
    order_ref      TEXT NOT NULL,
    customer_name  TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount   INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT rw_verdict_orders_order_unique UNIQUE (order_id)
);
CREATE INDEX IF NOT EXISTS idx_verdict_orders_verdict ON public.rw_verdict_orders(verdict_id);

-- STEP 5 — close the tables (service-role only), like every other rw_* table
ALTER TABLE public.rw_verdicts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rw_verdict_orders ENABLE ROW LEVEL SECURITY;

-- STEP 6 — email templates (new "ready_for_pickup" + refreshed "delivered")
INSERT INTO rw_email_templates (template_key, label, subject, body_html, is_active)
VALUES
  ('ready_for_pickup',
   'Ready for Pickup',
   'Your RW''26 Order is Ready for Pickup — #{{order_ref}}',
   '<p>Hi {{customer_name}},</p>
<p>Wonderful news! Your order <strong>#{{order_ref}}</strong> has been produced and is now <strong>ready for collection</strong>. 🎉</p>
<p>To collect it, please show this <strong>pickup code</strong> to our team member at the pickup point — it confirms the order is really yours:</p>
<p style="text-align:center;margin:24px 0;"><span style="display:inline-block;font-size:24px;font-weight:800;letter-spacing:3px;padding:14px 28px;border:2px dashed #FF0015;border-radius:12px;color:#1C0003;">{{pickup_token}}</span></p>
<p>Keep this code private — only share it at the desk when collecting.</p>
{{items_html}}
<p>— RCF FUTA Team</p>',
   true)
ON CONFLICT (template_key) DO NOTHING;

-- Optional: re-point the "delivered" template to mean "collected — thank you"
-- (skip this if you have already customised it in the admin UI).
UPDATE rw_email_templates
SET label = 'Order Collected — Thank You',
    subject = 'Order Collected — Thank You #{{order_ref}}',
    body_html = '<p>Hi {{customer_name}},</p>
<p>Your order <strong>#{{order_ref}}</strong> has been collected. We hope you love your items! 🎉</p>
<p>Thank you for being part of Redemption Week ''26. Feel free to share photos or leave a review.</p>
<p>— RCF FUTA Team</p>'
WHERE template_key = 'delivered';

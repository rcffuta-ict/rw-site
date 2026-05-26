-- ═══════════════════════════════════════════════════════════════════════════
-- RCF FUTA — Redemption Week '26 · Verdict System Migration
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Run this in Supabase SQL Editor AFTER the base schema.sql has been applied.
-- It is idempotent — safe to re-run.
--
-- Changes:
--   1. Adds 'ready' to the order_status enum
--   2. Creates rw_verdicts table
--   3. Creates rw_verdict_orders junction table
--   4. Creates auto-increment verdict ref generator
--   5. Creates trigger to set covered orders → in_production on verdict insert
--   6. Enables RLS on new tables
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── 1. Add 'ready' to order_status enum ─────────────────────────────────────
-- 'ready' = physical merch has arrived; admin marks it so moderators can deliver

DO $$ BEGIN
    ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready' AFTER 'in_production';
EXCEPTION WHEN others THEN NULL; END $$;


-- ─── 2. Verdict reference sequence ───────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS rw_verdict_seq START 1 INCREMENT 1;

CREATE OR REPLACE FUNCTION generate_verdict_ref()
RETURNS TEXT AS $$
BEGIN
    RETURN 'VRD-' || LPAD(nextval('rw_verdict_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;


-- ─── 3. rw_verdicts — master verdict record ───────────────────────────────────

CREATE TABLE IF NOT EXISTS rw_verdicts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verdict_ref         TEXT NOT NULL UNIQUE DEFAULT generate_verdict_ref(),
    issued_by           TEXT NOT NULL,                      -- admin full name (signature)
    issued_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status              TEXT NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'ready', 'archived')),
    -- PDF stored in Cloudinary (verdicts folder)
    pdf_cloudinary_url  TEXT,
    pdf_cloudinary_id   TEXT,
    -- Financial summary (denormalised for fast display)
    total_amount        INTEGER NOT NULL DEFAULT 0,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE rw_verdicts IS
    'Official production directives issued by admins. Each verdict covers a batch of orders.';

CREATE OR REPLACE TRIGGER verdicts_set_updated_at
    BEFORE UPDATE ON rw_verdicts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_verdicts_status ON rw_verdicts(status);
CREATE INDEX IF NOT EXISTS idx_verdicts_issued_at ON rw_verdicts(issued_at DESC);


-- ─── 4. rw_verdict_orders — junction table ────────────────────────────────────

CREATE TABLE IF NOT EXISTS rw_verdict_orders (
    verdict_id  UUID NOT NULL REFERENCES rw_verdicts(id) ON DELETE CASCADE,
    order_id    UUID NOT NULL REFERENCES rw_orders(id)   ON DELETE RESTRICT,
    PRIMARY KEY (verdict_id, order_id)
);

COMMENT ON TABLE rw_verdict_orders IS
    'Many-to-many junction between verdicts and the orders they cover.';

CREATE INDEX IF NOT EXISTS idx_verdict_orders_verdict ON rw_verdict_orders(verdict_id);
CREATE INDEX IF NOT EXISTS idx_verdict_orders_order   ON rw_verdict_orders(order_id);


-- ─── 5. Trigger: set covered orders → in_production on new verdict_order row ──

CREATE OR REPLACE FUNCTION set_orders_in_production()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rw_orders
    SET status = 'in_production'
    WHERE id = NEW.order_id
      AND status NOT IN ('in_production', 'ready', 'delivered', 'cancelled');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verdict_orders_set_in_production ON rw_verdict_orders;

CREATE TRIGGER verdict_orders_set_in_production
    AFTER INSERT ON rw_verdict_orders
    FOR EACH ROW EXECUTE FUNCTION set_orders_in_production();


-- ─── 6. Trigger: set covered orders → ready when verdict is marked ready ──────

CREATE OR REPLACE FUNCTION set_orders_ready_on_verdict()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ready' AND OLD.status <> 'ready' THEN
        UPDATE rw_orders
        SET status = 'ready'
        WHERE id IN (
            SELECT order_id FROM rw_verdict_orders WHERE verdict_id = NEW.id
        )
        AND status = 'in_production';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verdict_ready_set_orders_ready ON rw_verdicts;

CREATE TRIGGER verdict_ready_set_orders_ready
    AFTER UPDATE OF status ON rw_verdicts
    FOR EACH ROW EXECUTE FUNCTION set_orders_ready_on_verdict();


-- ─── 7. Enable Row Level Security ─────────────────────────────────────────────

ALTER TABLE rw_verdicts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE rw_verdict_orders  ENABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════════════════════════════════
-- Done! Apply this in Supabase SQL Editor, then restart your dev server.
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- RCF FUTA — Redemption Week '26 · Supabase Schema
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Pre-order commerce model:
--   customers order → submit payment receipts → moderators review →
--   moderators update order status → production → delivery
--
-- Run this entire file in the Supabase SQL Editor (Project → SQL Editor → New query).
-- It is idempotent: safe to re-run (uses IF NOT EXISTS / OR REPLACE).
--
-- Tables:
--   1. categories          DB-managed product categories
--   2. products            Core product records
--   3. product_variants    Size × color × design combos per product
--   4. product_images      Cloudinary image refs per variant (fixed 360×480)
--   5. orders              Customer orders (pre-order)
--   6. order_items         Line items per order (snapshot at order time)
--   7. payments            Payment receipts with actor signature
--   8. admin_users         Admin/moderator users (linked to Supabase Auth)
--
-- Views:
--   order_payment_summary  Derived payment state per order
--
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── Extensions ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()


-- ─── Enum Types ───────────────────────────────────────────────────────────────

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending',          -- created, no payment yet
        'partially_paid',   -- at least one approved payment, not full amount
        'paid',             -- full amount covered by approved payments
        'confirmed',        -- moderator queues for production
        'in_production',    -- being produced
        'delivered',        -- handed to customer
        'flagged',          -- flagged for manual review
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',
        'approved',
        'flagged',
        'rejected'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE extraction_confidence AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM ('admin', 'moderator');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ─── Helper: auto-update updated_at ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════════════════════
-- 1. CATEGORIES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT NOT NULL UNIQUE,       -- url-safe e.g. "tshirt", "hoodie"
    label       TEXT NOT NULL,              -- display name e.g. "T-Shirt"
    description TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0, -- ascending — lower = shown first
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'DB-managed product categories. Managed from the admin panel.';



-- ═══════════════════════════════════════════════════════════════════════════
-- 2. PRODUCTS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name         TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    base_price   INTEGER NOT NULL CHECK (base_price >= 0),  -- in Naira kobo (multiply by 100) or whole Naira — pick one convention
    tags         TEXT[] NOT NULL DEFAULT '{}',
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE products IS 'Core product records. Pre-order model: no stock tracking.';
COMMENT ON COLUMN products.base_price IS 'Price in Naira. Variants may override via price_override.';

CREATE OR REPLACE TRIGGER products_set_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available) WHERE is_available = TRUE;


-- ═══════════════════════════════════════════════════════════════════════════
-- 3. PRODUCT VARIANTS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_variants (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size           TEXT,                    -- 'XS','S','M','L','XL','XXL','One Size', or NULL
    color          TEXT,                    -- e.g. 'Black', 'White', 'Burgundy'
    color_hex      TEXT,                    -- e.g. '#000000', custom hex color from admin
    design         TEXT,                    -- e.g. 'Holy Spirit', 'RW\'26'
    sku            TEXT,                    -- optional internal SKU
    price_override INTEGER,                 -- NULL = inherit base_price from product
    is_available   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- No stock column: this is a pre-order site. People order → we produce → deliver.
);

COMMENT ON TABLE product_variants IS 'Size × color × design combinations. No stock tracking (pre-order model).';
COMMENT ON COLUMN product_variants.price_override IS 'When NULL, the parent product.base_price applies.';

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku) WHERE sku IS NOT NULL;


-- ═══════════════════════════════════════════════════════════════════════════
-- 4. PRODUCT IMAGES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_images (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id            UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    cloudinary_public_id  TEXT NOT NULL UNIQUE,
    cloudinary_url        TEXT NOT NULL,
    -- Dimensions are fixed at 360×480 — no width/height columns needed.
    alt_text              TEXT,
    is_primary            BOOLEAN NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE product_images IS 'Cloudinary image refs. One image per variant, fixed 360×480.';
COMMENT ON COLUMN product_images.is_primary IS 'Marks the canonical image shown for this variant.';

CREATE INDEX IF NOT EXISTS idx_images_variant ON product_images(variant_id);

-- Enforce only one primary image per variant
CREATE UNIQUE INDEX IF NOT EXISTS idx_images_primary_per_variant
    ON product_images(variant_id)
    WHERE is_primary = TRUE;


-- ═══════════════════════════════════════════════════════════════════════════
-- 5. ORDERS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_ref       TEXT NOT NULL UNIQUE,       -- short code shown to customer e.g. 'FF3A9C'
    customer_name   TEXT NOT NULL,
    customer_email  TEXT NOT NULL,
    customer_phone  TEXT NOT NULL,
    customer_note   TEXT,
    -- Status is set manually by moderators.
    -- The app derives display state from order_payment_summary view.
    status          order_status NOT NULL DEFAULT 'pending',
    total_amount    INTEGER NOT NULL CHECK (total_amount > 0),  -- sum of all line items
    -- amount_paid is a cached/denormalised value — kept in sync by payment triggers.
    -- Source of truth is the payments table.
    amount_paid     INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Customer pre-orders. Status manually updated by moderators.';
COMMENT ON COLUMN orders.amount_paid IS 'Cached sum of approved payments. Derived via order_payment_summary view.';

CREATE OR REPLACE TRIGGER orders_set_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_ref   ON orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);


-- ─── Order ref generator ──────────────────────────────────────────────────────
-- Generates a short 6-char hex ref like 'FF3A9C'.
-- Call: SELECT generate_order_ref() to get a new unique ref.

CREATE OR REPLACE FUNCTION generate_order_ref()
RETURNS TEXT AS $$
DECLARE
    ref TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        ref := UPPER(SUBSTRING(encode(gen_random_bytes(3), 'hex') FROM 1 FOR 6));
        SELECT COUNT(*) > 0 INTO exists FROM orders WHERE order_ref = ref;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN ref;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════════════════════
-- 6. ORDER ITEMS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id    UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    -- Snapshot fields — immutable after order creation
    product_name  TEXT NOT NULL,    -- snapshot: product name at order time
    variant_label TEXT NOT NULL,    -- snapshot: e.g. "Black · L · Holy Spirit"
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    unit_price    INTEGER NOT NULL CHECK (unit_price >= 0),  -- snapshot at order time
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_items IS 'Line items per order. product_name, variant_label, unit_price are snapshots and immutable.';

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- 7. PAYMENTS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    -- Cloudinary receipt storage
    cloudinary_receipt_public_id  TEXT UNIQUE,
    receipt_url                   TEXT,  -- Cloudinary delivery URL

    -- AI-extracted fields from the receipt image (populated asynchronously)
    extracted_amount        INTEGER NOT NULL CHECK (extracted_amount > 0),
    extracted_sender_name   TEXT,
    extracted_date          DATE,
    extracted_time          TEXT,
    extracted_bank          TEXT,
    extracted_transaction_ref TEXT, -- Unique reference for the transaction
    extraction_confidence   extraction_confidence,

    -- Moderator confirmed amount (entered during approval)
    amount_confirmed        INTEGER CHECK (amount_confirmed >= 0),

    -- Review outcome — set by moderator
    status          payment_status NOT NULL DEFAULT 'pending',
    review_note     TEXT,

    -- Actor signature: stamps who reviewed this payment.
    -- Admin/moderators are the only ones who change payment status.
    -- No separate audit table needed — this IS the audit record.
    moderator_name  TEXT,
    moderator_email TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Customer payment receipts. Multiple per order (installments). Moderator action is recorded via moderator_name/moderator_email.';
COMMENT ON COLUMN payments.moderator_name  IS 'Name of the admin/moderator who last reviewed this payment.';
COMMENT ON COLUMN payments.moderator_email IS 'Email of the admin/moderator who last reviewed this payment.';

CREATE OR REPLACE TRIGGER payments_set_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Add updated_at to payments for trigger use
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'payments' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE payments ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_payments_order  ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);


-- ─── Trigger: sync orders.amount_paid after payment approval ─────────────────

CREATE OR REPLACE FUNCTION sync_order_amount_paid()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders
    SET amount_paid = (
        SELECT COALESCE(SUM(amount_confirmed), 0)
        FROM payments
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
          AND status = 'approved'
    )
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER payments_sync_amount_paid
    AFTER INSERT OR UPDATE OF status OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION sync_order_amount_paid();


-- ═══════════════════════════════════════════════════════════════════════════
-- VIEW: order_payment_summary
-- ═══════════════════════════════════════════════════════════════════════════
-- Derived payment state per order.
-- Mirrors the computeOrderPaymentSummary() TypeScript helper on the client.
-- Use this view in queries instead of summing payments manually.

CREATE OR REPLACE VIEW order_payment_summary AS
SELECT
    o.id                                                        AS order_id,
    o.total_amount,
    COALESCE(SUM(p.amount_confirmed) FILTER (WHERE p.status = 'approved'), 0)  AS amount_paid,
    COALESCE(SUM(p.extracted_amount) FILTER (WHERE p.status = 'pending'),  0)  AS amount_pending,
    GREATEST(o.total_amount - COALESCE(SUM(p.amount_confirmed) FILTER (WHERE p.status = 'approved'), 0), 0) AS balance,
    COALESCE(SUM(p.amount_confirmed) FILTER (WHERE p.status = 'approved'), 0) >= o.total_amount             AS is_fully_paid,
    COUNT(p.id) FILTER (WHERE p.status = 'approved')            AS approved_count,
    COUNT(p.id) FILTER (WHERE p.status = 'pending')             AS pending_count,
    COUNT(p.id) FILTER (WHERE p.status = 'flagged')             AS flagged_count,
    COUNT(p.id) FILTER (WHERE p.status = 'rejected')            AS rejected_count
FROM orders o
LEFT JOIN payments p ON p.order_id = o.id
GROUP BY o.id, o.total_amount;

COMMENT ON VIEW order_payment_summary IS
    'Derived payment state per order. Use instead of summing payments manually. '
    'is_fully_paid is TRUE when approved payments >= total_amount.';


-- ═══════════════════════════════════════════════════════════════════════════
-- Done!
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Note on Security & Authentication:
--   - Row Level Security (RLS) is NOT enabled for these tables by design.
--   - The platform relies on application-level security and the 
--     SUPABASE_SERVICE_ROLE_KEY to manage access to these tables.
--   - Admin/Moderator authentication relies on the existing `profiles` and
--     `rw_admin_moderators` tables in your Supabase project.
--
-- Next steps after running this schema:
--
--   1. Create an unsigned Cloudinary upload preset named "rw26_receipts" in
--      Cloudinary Dashboard → Settings → Upload Presets.
--      Restrict folder to "rw26/receipts".
--
--   2. Set DEMO_MODE = false in src/lib/config.ts when ready to go live.
--

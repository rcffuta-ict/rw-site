-- ═══════════════════════════════════════════════════════════════════════════
-- Migration: Post-order phase
-- Date:      2026-07-22
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Adds support for a "post-order" ordering phase that runs after pre-orders:
--   • rw_settings.order_phase                 — active phase toggle (admin)
--   • rw_products.post_order_price            — per-product post-order price
--   • rw_product_variants.post_order_price_override — per-variant override
--
-- Safe to run on an existing database (idempotent). Run this in the Supabase
-- SQL Editor instead of re-running the full schema.sql.
--
-- Existing orders are unaffected: rw_order_items.unit_price is an immutable
-- snapshot taken at order time.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── 1. Products: post-order price ─────────────────────────────────────────────
-- NULL = fall back to base_price during the post-order phase.
ALTER TABLE public.rw_products
  ADD COLUMN IF NOT EXISTS post_order_price INTEGER CHECK (post_order_price >= 0);

COMMENT ON COLUMN public.rw_products.post_order_price IS
  'Naira price used during the post-order phase. NULL = inherit base_price.';

-- ─── 2. Variants: post-order override ──────────────────────────────────────────
-- Resolution during the post-order phase:
--   post_order_price_override → product.post_order_price → price_override → base_price
ALTER TABLE public.rw_product_variants
  ADD COLUMN IF NOT EXISTS post_order_price_override INTEGER;

COMMENT ON COLUMN public.rw_product_variants.post_order_price_override IS
  'Per-variant post-order price. NULL = inherit product.post_order_price / base price.';

-- ─── 3. Settings: active ordering phase ────────────────────────────────────────
-- 'preorder' = original pre-order prices & terms (default).
-- 'postorder' = post-order prices and the updated terms notice are shown.
ALTER TABLE public.rw_settings
  ADD COLUMN IF NOT EXISTS order_phase text NOT NULL DEFAULT 'preorder';

-- Add the CHECK separately so re-running is safe on pre-existing columns.
DO $$ BEGIN
  ALTER TABLE public.rw_settings
    ADD CONSTRAINT rw_settings_order_phase_check
    CHECK (order_phase IN ('preorder','postorder'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON COLUMN public.rw_settings.order_phase IS
  'Active ordering phase: preorder | postorder.';

COMMIT;

-- ─── Verify ────────────────────────────────────────────────────────────────────
-- SELECT order_phase FROM public.rw_settings WHERE id = 1;
-- SELECT id, name, base_price, post_order_price FROM public.rw_products;

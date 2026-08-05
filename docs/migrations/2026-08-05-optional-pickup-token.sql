-- ═══════════════════════════════════════════════════════════════════════════
-- Migration: Optional pickup-token confirmation
-- Date:      2026-08-05
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Adds an admin-controlled switch for whether marking an order "delivered"
-- requires the personal pickup code emailed to the customer:
--   • rw_settings.pickup_token_required — default true (preserves current
--     behavior). When false, fulfilVerdict() skips generating/emailing a
--     pickup code and markOrderDelivered() only needs a plain confirmation.
--
-- Safe to run on an existing database (idempotent). Run this in the Supabase
-- SQL Editor instead of re-running the full schema.sql.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

ALTER TABLE public.rw_settings
  ADD COLUMN IF NOT EXISTS pickup_token_required boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.rw_settings.pickup_token_required IS
  'When true (default), fulfilling a verdict generates a personal pickup code that must be entered to mark an order delivered. When false, no code is generated/emailed and admins confirm delivery with a plain confirm.';

COMMIT;

-- ─── Verify ────────────────────────────────────────────────────────────────────
-- SELECT pickup_token_required FROM public.rw_settings WHERE id = 1;

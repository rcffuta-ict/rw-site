-- ═══════════════════════════════════════════════════════════════════════════
-- RCF FUTA — Redemption Week '26 · Database Seeding
-- ═══════════════════════════════════════════════════════════════════════════

-- Seed initial categories (safe to re-run — does nothing if slugs already exist)
INSERT INTO categories (slug, label, description, sort_order, is_active)
VALUES
    ('tshirt',    'T-Shirt',   'Comfort-fit cotton tees with event prints.',              1, TRUE),
    ('hoodie',    'Hoodie',    'Heavyweight fleece pullovers for the cold nights.',        2, TRUE),
    ('accessory', 'Accessory', 'Caps, sticker packs, and other branded items.',           3, TRUE)
ON CONFLICT (slug) DO NOTHING;

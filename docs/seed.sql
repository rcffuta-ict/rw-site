-- ═══════════════════════════════════════════════════════════════════════════
-- RCF FUTA — Redemption Week '26 · Database Seeding
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- Safe to re-run. Uses fixed UUIDs and ON CONFLICT DO NOTHING to prevent duplicates.
-- Run this in your Supabase SQL Editor AFTER running schema.sql.

DO $$
DECLARE
    cat_tshirt    UUID;
    cat_hoodie    UUID;
    cat_accessory UUID;

    prod_tshirt UUID := '00000000-0000-0000-0000-000000000001';
    prod_hoodie UUID := '00000000-0000-0000-0000-000000000002';
    prod_acc    UUID := '00000000-0000-0000-0000-000000000003';

    var_ts_blk_m UUID := '00000000-0000-0000-0001-000000000001';
    var_ts_blk_l UUID := '00000000-0000-0000-0001-000000000002';
    var_ts_wht_m UUID := '00000000-0000-0000-0001-000000000003';
    var_ts_wht_l UUID := '00000000-0000-0000-0001-000000000004';

    var_hd_bur_m UUID := '00000000-0000-0000-0002-000000000001';
    var_hd_bur_l UUID := '00000000-0000-0000-0002-000000000002';

    var_ac_os    UUID := '00000000-0000-0000-0003-000000000001';

BEGIN
    -- ─── 1. Categories ────────────────────────────────────────────────────────
    INSERT INTO rw_categories (slug, label, description, sort_order, is_active)
    VALUES
        ('tshirt',    'T-Shirt',   'Comfort-fit cotton tees with event prints.',         1, TRUE),
        ('hoodie',    'Hoodie',    'Heavyweight fleece pullovers for the cold nights.',   2, TRUE),
        ('accessory', 'Accessory', 'Caps, sticker packs, and other branded items.',      3, TRUE)
    ON CONFLICT (slug) DO NOTHING;

    -- Fetch dynamic IDs for the categories
    SELECT id INTO cat_tshirt    FROM rw_categories WHERE slug = 'tshirt';
    SELECT id INTO cat_hoodie    FROM rw_categories WHERE slug = 'hoodie';
    SELECT id INTO cat_accessory FROM rw_categories WHERE slug = 'accessory';

    -- ─── 2. Products ─────────────────────────────────────────────────────────
    INSERT INTO rw_products (id, category_id, name, description, base_price, tags, is_available)
    VALUES
        (
            prod_tshirt, cat_tshirt,
            'Anniversary T-Shirt',
            'Premium comfort fit, breathable cotton tailored for worship and warfare.',
            4500, '{rw26,tshirt}', TRUE
        ),
        (
            prod_hoodie, cat_hoodie,
            'RW''26 Premium Hoodie',
            'Warm, clean, and durable fleece. Built for the cold nights.',
            12000, '{rw26,hoodie,winter}', TRUE
        ),
        (
            prod_acc, cat_accessory,
            'Redemption Sticker Pack',
            'A small, fun add-on for your laptop, journal, or water bottle.',
            800, '{rw26,accessory}', TRUE
        )
    ON CONFLICT (id) DO NOTHING;

    -- ─── 3. Variants ─────────────────────────────────────────────────────────
    INSERT INTO rw_product_variants (id, product_id, size, color, color_hex, design, price_override, is_available)
    VALUES
        (var_ts_blk_m, prod_tshirt, 'M',        'Black',      '#000000', 'Holy Spirit',  NULL, TRUE),
        (var_ts_blk_l, prod_tshirt, 'L',        'Black',      '#000000', 'Holy Spirit',  NULL, TRUE),
        (var_ts_wht_m, prod_tshirt, 'M',        'White',      '#FFFFFF', 'Holy Spirit',  NULL, TRUE),
        (var_ts_wht_l, prod_tshirt, 'L',        'White',      '#FFFFFF', 'Holy Spirit',  NULL, TRUE),

        (var_hd_bur_m, prod_hoodie, 'M',        'Burgundy',   '#800020', 'RW''26 Logo', NULL, TRUE),
        (var_hd_bur_l, prod_hoodie, 'L',        'Burgundy',   '#800020', 'RW''26 Logo', NULL, TRUE),

        (var_ac_os,    prod_acc,    'One Size',  'Multicolor', NULL,      'Assorted Pack', NULL, TRUE)
    ON CONFLICT (id) DO NOTHING;

    -- ─── 4. Images (Placehold.co placeholders) ───────────────────────────────
    INSERT INTO rw_product_images (variant_id, cloudinary_public_id, cloudinary_url, alt_text, is_primary)
    VALUES
        (var_ts_blk_m, 'seed_ts_blk_m', 'https://placehold.co/360x480/000000/FFFFFF?text=T-Shirt%0ABlack+M',   'Black T-Shirt Medium',  TRUE),
        (var_ts_blk_l, 'seed_ts_blk_l', 'https://placehold.co/360x480/000000/FFFFFF?text=T-Shirt%0ABlack+L',   'Black T-Shirt Large',   TRUE),
        (var_ts_wht_m, 'seed_ts_wht_m', 'https://placehold.co/360x480/FFFFFF/000000?text=T-Shirt%0AWhite+M',   'White T-Shirt Medium',  TRUE),
        (var_ts_wht_l, 'seed_ts_wht_l', 'https://placehold.co/360x480/FFFFFF/000000?text=T-Shirt%0AWhite+L',   'White T-Shirt Large',   TRUE),

        (var_hd_bur_m, 'seed_hd_bur_m', 'https://placehold.co/360x480/800020/FFFFFF?text=Hoodie%0ABurgundy+M', 'Burgundy Hoodie Medium', TRUE),
        (var_hd_bur_l, 'seed_hd_bur_l', 'https://placehold.co/360x480/800020/FFFFFF?text=Hoodie%0ABurgundy+L', 'Burgundy Hoodie Large',  TRUE),

        (var_ac_os,    'seed_ac_os',    'https://placehold.co/360x480/1c0003/ff6a00?text=Sticker%0APack',       'Sticker Pack',           TRUE)
    ON CONFLICT (cloudinary_public_id) DO NOTHING;

END $$;

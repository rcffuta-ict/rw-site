import type { Product, ProductImage, ProductVariant } from "./types";

// ─── Demo product catalog ─────────────────────────────────────────────────────
// Used when DEMO_MODE = true (see src/lib/config.ts).
// In live mode this data comes from Supabase → products + product_variants tables.
//
// Categories reference demo slugs that match DEMO_CATEGORIES in categories.ts.

export const DEMO_PRODUCTS: Product[] = [
    {
        id: "tee-hs",
        categoryId: "cat-tshirt",
        categorySlug: "tshirt",
        categoryLabel: "T-Shirt",
        name: "Holy Spirit Tee",
        description:
            "Premium 100% cotton comfort-fit tee. Celebrating 38 years of God's faithfulness — wear the witness.",
        basePrice: 4500,
        tags: ["bestseller"],
        isAvailable: true,
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-04-01T00:00:00Z",
        variants: [
            {
                id: "tee-hs-s-blk",
                productId: "tee-hs",
                size: "S",
                color: "Black",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-m-blk",
                productId: "tee-hs",
                size: "M",
                color: "Black",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-l-blk",
                productId: "tee-hs",
                size: "L",
                color: "Black",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-xl-blk",
                productId: "tee-hs",
                size: "XL",
                color: "Black",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-xxl-blk",
                productId: "tee-hs",
                size: "XXL",
                color: "Black",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-s-wht",
                productId: "tee-hs",
                size: "S",
                color: "White",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-m-wht",
                productId: "tee-hs",
                size: "M",
                color: "White",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-l-wht",
                productId: "tee-hs",
                size: "L",
                color: "White",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-xl-wht",
                productId: "tee-hs",
                size: "XL",
                color: "White",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-xxl-wht",
                productId: "tee-hs",
                size: "XXL",
                color: "White",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: false,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-s-burg",
                productId: "tee-hs",
                size: "S",
                color: "Burgundy",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-m-burg",
                productId: "tee-hs",
                size: "M",
                color: "Burgundy",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-l-burg",
                productId: "tee-hs",
                size: "L",
                color: "Burgundy",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "tee-hs-xl-burg",
                productId: "tee-hs",
                size: "XL",
                color: "Burgundy",
                design: "Holy Spirit",
                sku: null,
                priceOverride: null,
                isAvailable: false,
                images: [],
                colorHex: "",
            },
        ],
    },
    {
        id: "hoodie-rw26",
        categoryId: "cat-hoodie",
        categorySlug: "hoodie",
        categoryLabel: "Hoodie",
        name: "RW'26 Hoodie",
        description:
            "Heavyweight fleece pullover. Structured hood, kangaroo pocket, ribbed cuffs. Built for the cold nights of faith.",
        basePrice: 12000,
        tags: [],
        isAvailable: true,
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-04-01T00:00:00Z",
        variants: [
            {
                id: "hd-m-blk",
                productId: "hoodie-rw26",
                size: "M",
                color: "Black",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-l-blk",
                productId: "hoodie-rw26",
                size: "L",
                color: "Black",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-xl-blk",
                productId: "hoodie-rw26",
                size: "XL",
                color: "Black",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-xxl-blk",
                productId: "hoodie-rw26",
                size: "XXL",
                color: "Black",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-m-burg",
                productId: "hoodie-rw26",
                size: "M",
                color: "Burgundy",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-l-burg",
                productId: "hoodie-rw26",
                size: "L",
                color: "Burgundy",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-xl-burg",
                productId: "hoodie-rw26",
                size: "XL",
                color: "Burgundy",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: false,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-m-wine",
                productId: "hoodie-rw26",
                size: "M",
                color: "Wine Red",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-l-wine",
                productId: "hoodie-rw26",
                size: "L",
                color: "Wine Red",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "hd-xl-wine",
                productId: "hoodie-rw26",
                size: "XL",
                color: "Wine Red",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
        ],
    },
    {
        id: "cap-anni",
        categoryId: "cat-accessory",
        categorySlug: "accessory",
        categoryLabel: "Accessory",
        name: "Anniversary Cap",
        description:
            "Structured 6-panel snapback. Embroidered RW'26 logo on front. One size fits all — just like God's grace.",
        basePrice: 3500,
        tags: [],
        isAvailable: true,
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-04-01T00:00:00Z",
        variants: [
            {
                id: "cap-blk",
                productId: "cap-anni",
                size: "One Size",
                color: "Black",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "cap-wht",
                productId: "cap-anni",
                size: "One Size",
                color: "White",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
            {
                id: "cap-wine",
                productId: "cap-anni",
                size: "One Size",
                color: "Wine Red",
                design: "RW'26",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
        ],
    },
    {
        id: "sticker-pack",
        categoryId: "cat-accessory",
        categorySlug: "accessory",
        categoryLabel: "Accessory",
        name: "Sticker Pack",
        description:
            "5-piece premium vinyl sticker pack. RW'26 flame motif, RCF FUTA crest, scripture tags. Laptop-ready.",
        basePrice: 800,
        tags: ["new"],
        isAvailable: true,
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-04-01T00:00:00Z",
        variants: [
            {
                id: "stk-std",
                productId: "sticker-pack",
                size: "One Size",
                color: null,
                design: "Standard Pack",
                sku: null,
                priceOverride: null,
                isAvailable: true,
                images: [],
                colorHex: "",
            },
        ],
    },
];

// ─── Colour display map (hex for swatches) ────────────────────────────────────
export const COLOR_HEX: Record<string, string> = {
    Black: "#0f0f0f",
    White: "#f8f8f8",
    Burgundy: "#7a0c31",
    "Wine Red": "#940011",
    Navy: "#0a1628",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
    return DEMO_PRODUCTS.find((p) => p.id === id);
}

export function getVariantById(productId: string, variantId: string) {
    const product = getProductById(productId);
    return product?.variants.find((v) => v.id === variantId);
}

// export function getEffectivePrice(product: Product, variantId: string): number {
//     const variant = product.variants.find((v) => v.id === variantId);
//     return variant?.priceOverride ?? product.basePrice;
// }

// export function buildVariantLabel(variant: {
//     size: string | null;
//     color: string | null;
//     design: string | null;
// }): string {
//     return [variant.color, variant.size, variant.design].filter(Boolean).join(" · ");
// }

/** Returns the primary Cloudinary image URL for a variant, or null if none uploaded yet. */
// export function getVariantPrimaryImage(
//     variantId: string,
//     productId: string
// ): string | null {
//     const product = getProductById(productId);
//     if (!product) return null;
//     const variant = product.variants.find((v) => v.id === variantId);
//     if (!variant) return null;
//     const primary = variant.images.find((img) => img.isPrimary) ?? variant.images[0];
//     return primary?.cloudinaryUrl ?? null;
// }

/** Returns the primary image for a variant, falling back to the first image. */
export function getVariantPrimaryImage(
    variant: ProductVariant
): ProductImage | undefined {
    return variant.images.find((img) => img.isPrimary) ?? variant.images[0];
}

/** Effective price for a variant — variant priceOverride takes precedence over product basePrice. */
export function getEffectivePrice(product: Product, variantId: string): number {
    const variant = product.variants.find((v) => v.id === variantId);
    return variant?.priceOverride ?? product.basePrice;
}

/** Build a human-readable variant label e.g. "Black · L · Holy Spirit". */
export function buildVariantLabel(
    variant: Pick<ProductVariant, "color" | "size" | "design">
): string {
    return [variant.color, variant.size, variant.design].filter(Boolean).join(" · ");
}

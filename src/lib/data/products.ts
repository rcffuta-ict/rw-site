import type { Product } from "./types";

export const DEMO_PRODUCTS: Product[] = [
    {
        id: "tee-hs",
        name: "Holy Spirit Tee",
        description:
            "Premium 100% cotton comfort-fit tee. Celebrating 38 years of God's faithfulness — wear the witness.",
        category: "tshirt",
        basePrice: 4500,
        isAvailable: true,
        variants: [
            { id: "tee-hs-s-blk",   size: "S",   color: "Black",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-m-blk",   size: "M",   color: "Black",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-l-blk",   size: "L",   color: "Black",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-xl-blk",  size: "XL",  color: "Black",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-xxl-blk", size: "XXL", color: "Black",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-s-wht",   size: "S",   color: "White",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-m-wht",   size: "M",   color: "White",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-l-wht",   size: "L",   color: "White",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-xl-wht",  size: "XL",  color: "White",    design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-xxl-wht", size: "XXL", color: "White",    design: "Holy Spirit", priceOverride: null, isAvailable: false },
            { id: "tee-hs-s-burg",  size: "S",   color: "Burgundy", design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-m-burg",  size: "M",   color: "Burgundy", design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-l-burg",  size: "L",   color: "Burgundy", design: "Holy Spirit", priceOverride: null, isAvailable: true },
            { id: "tee-hs-xl-burg", size: "XL",  color: "Burgundy", design: "Holy Spirit", priceOverride: null, isAvailable: false },
        ],
    },
    {
        id: "hoodie-rw26",
        name: "RW'26 Hoodie",
        description:
            "Heavyweight fleece pullover. Structured hood, kangaroo pocket, ribbed cuffs. Built for the cold nights of faith.",
        category: "hoodie",
        basePrice: 12000,
        isAvailable: true,
        variants: [
            { id: "hd-m-blk",    size: "M",   color: "Black",    design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-l-blk",    size: "L",   color: "Black",    design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-xl-blk",   size: "XL",  color: "Black",    design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-xxl-blk",  size: "XXL", color: "Black",    design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-m-burg",   size: "M",   color: "Burgundy", design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-l-burg",   size: "L",   color: "Burgundy", design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-xl-burg",  size: "XL",  color: "Burgundy", design: "RW'26", priceOverride: null, isAvailable: false },
            { id: "hd-m-wine",   size: "M",   color: "Wine Red", design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-l-wine",   size: "L",   color: "Wine Red", design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "hd-xl-wine",  size: "XL",  color: "Wine Red", design: "RW'26", priceOverride: null, isAvailable: true },
        ],
    },
    {
        id: "cap-anni",
        name: "Anniversary Cap",
        description:
            "Structured 6-panel snapback. Embroidered RW'26 logo on front. One size fits all — just like God's grace.",
        category: "accessory",
        basePrice: 3500,
        isAvailable: true,
        variants: [
            { id: "cap-blk",  size: "One Size", color: "Black",  design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "cap-wht",  size: "One Size", color: "White",  design: "RW'26", priceOverride: null, isAvailable: true },
            { id: "cap-wine", size: "One Size", color: "Wine Red", design: "RW'26", priceOverride: null, isAvailable: true },
        ],
    },
    {
        id: "sticker-pack",
        name: "Sticker Pack",
        description:
            "5-piece premium vinyl sticker pack. RW'26 flame motif, RCF FUTA crest, scripture tags. Laptop-ready.",
        category: "accessory",
        basePrice: 800,
        isAvailable: true,
        variants: [
            { id: "stk-std", size: "One Size", color: null, design: "Standard Pack", priceOverride: null, isAvailable: true },
        ],
    },
];

// Colour display map (hex for swatches)
export const COLOR_HEX: Record<string, string> = {
    Black: "#0f0f0f",
    White: "#f8f8f8",
    Burgundy: "#7a0c31",
    "Wine Red": "#940011",
    Navy: "#0a1628",
};

export function getProductById(id: string): Product | undefined {
    return DEMO_PRODUCTS.find((p) => p.id === id);
}

export function getVariantById(productId: string, variantId: string) {
    const product = getProductById(productId);
    return product?.variants.find((v) => v.id === variantId);
}

export function getEffectivePrice(product: Product, variantId: string): number {
    const variant = product.variants.find((v) => v.id === variantId);
    return variant?.priceOverride ?? product.basePrice;
}

export function buildVariantLabel(variant: { size: string | null; color: string | null; design: string | null }): string {
    return [variant.color, variant.size, variant.design].filter(Boolean).join(" · ");
}

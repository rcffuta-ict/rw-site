// ─── Products Service ─────────────────────────────────────────────────────────
// Swap DEMO_MODE in src/lib/config.ts to toggle demo vs. live data.
// In live mode, replace the stubs below with your ICT team's Supabase library calls.

import { DEMO_MODE } from "@/lib/config";
import { DEMO_PRODUCTS, getProductById as getById, getVariantById as getVarById, getEffectivePrice as getPrice, buildVariantLabel } from "@/lib/data/products";
import type { Product, ProductVariant } from "@/lib/data/types";

// ─── Re-export helpers (unchanged regardless of mode) ─────────────────────────
export { buildVariantLabel, getEffectivePrice } from "@/lib/data/products";
export type { Product, ProductVariant };

// ─── Core functions ───────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
    if (DEMO_MODE) {
        return DEMO_PRODUCTS.filter((p) => p.isAvailable);
    }
    // TODO: replace with ICT team's Supabase library call
    // e.g. return await db.from("products").select("*").eq("is_available", true)
    throw new Error("Live product fetch not yet implemented");
}

export async function getProductById(id: string): Promise<Product | undefined> {
    if (DEMO_MODE) {
        return getById(id);
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live product fetch not yet implemented");
}

export async function getVariantById(productId: string, variantId: string): Promise<ProductVariant | undefined> {
    if (DEMO_MODE) {
        return getVarById(productId, variantId);
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live variant fetch not yet implemented");
}

export function getEffectivePriceSync(product: Product, variantId: string): number {
    return getPrice(product, variantId);
}

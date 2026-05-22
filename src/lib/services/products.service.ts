"use server";

// ─── Products Service — Supabase ──────────────────────────────────────────────
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProductFromDb, mapVariantFromDb } from "@/lib/supabase/mappers";
import type {
    Product,
    ProductVariant,
    ProductInput,
    ProductVariantInput,
    ProductImage,
    ServiceResult,
} from "@/lib/data/types";
import { unstable_cache, revalidateTag } from "next/cache";

// ─── Shared select fragment ───────────────────────────────────────────────────

const PRODUCT_SELECT = `
    *,
    category:categories ( id, slug, label ),
    variants:product_variants (
        *,
        images:product_images ( * )
    )
` as const;

// ─── Read ─────────────────────────────────────────────────────────────────────

/** Public storefront — returns only available products. */
export async function getProducts(): Promise<Product[]> {
    return unstable_cache(
        async () => {
            const supabase = await createSupabaseAdminClient();
            const { data, error } = await supabase
                .from("products")
                .select(PRODUCT_SELECT)
                .eq("is_available", true)
                .order("created_at", { ascending: true });

            if (error) throw new Error(`Failed to load products: ${error.message}`);
            return (data ?? []).map(mapProductFromDb);
        },
        ["storefront-products"],
        { tags: ["products"], revalidate: 3600 }
    )();
}

/** Admin — returns ALL products (including hidden). */
export async function getAllProducts(): Promise<Product[]> {
    return unstable_cache(
        async () => {
            const supabase = await createSupabaseAdminClient();
            const { data, error } = await supabase
                .from("products")
                .select(PRODUCT_SELECT)
                .order("created_at", { ascending: true });

            if (error) throw new Error(`Failed to load products: ${error.message}`);
            return (data ?? []).map(mapProductFromDb);
        },
        ["admin-all-products"],
        { tags: ["products"], revalidate: 3600 }
    )();
}

export async function getProductById(id: string): Promise<Product | undefined> {
    return unstable_cache(
        async () => {
            const supabase = await createSupabaseAdminClient();
            const { data } = await supabase
                .from("products")
                .select(PRODUCT_SELECT)
                .eq("id", id)
                .single();
            return data ? mapProductFromDb(data) : undefined;
        },
        [`product-${id}`],
        { tags: ["products"], revalidate: 3600 }
    )();
}

export async function getVariantById(
    variantId: string
): Promise<ProductVariant | undefined> {
    return unstable_cache(
        async () => {
            const supabase = await createSupabaseAdminClient();
            const { data } = await supabase
                .from("product_variants")
                .select("*, images:product_images(*)")
                .eq("id", variantId)
                .single();
            return data ? mapVariantFromDb(data) : undefined;
        },
        [`variant-${variantId}`],
        { tags: ["products"], revalidate: 3600 }
    )();
}

// ─── Product CRUD ─────────────────────────────────────────────────────────────

export async function createProduct(
    input: ProductInput
): Promise<ServiceResult<Product>> {
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
        .from("products")
        .insert({
            category_id: input.categoryId,
            name: input.name,
            description: input.description,
            base_price: input.basePrice,
            tags: input.tags ?? [],
            is_available: input.isAvailable ?? true,
        })
        .select(PRODUCT_SELECT)
        .single();

    if (error) return { success: false, error: error.message };
    revalidateTag("products", "max");
    return { success: true, data: mapProductFromDb(data) };
}

export async function updateProduct(
    id: string,
    input: Partial<ProductInput>
): Promise<ServiceResult<Product>> {
    const supabase = await createSupabaseAdminClient();

    const patch: Record<string, unknown> = {};
    if (input.categoryId !== undefined) patch.category_id = input.categoryId;
    if (input.name !== undefined) patch.name = input.name;
    if (input.description !== undefined) patch.description = input.description;
    if (input.basePrice !== undefined) patch.base_price = input.basePrice;
    if (input.tags !== undefined) patch.tags = input.tags;
    if (input.isAvailable !== undefined) patch.is_available = input.isAvailable;

    const { data, error } = await supabase
        .from("products")
        .update(patch)
        .eq("id", id)
        .select(PRODUCT_SELECT)
        .single();

    if (error) return { success: false, error: error.message };
    revalidateTag("products", "max");
    return { success: true, data: mapProductFromDb(data) };
}

export async function deleteProduct(id: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidateTag("products", "max");
    return { success: true };
}

// ─── Variant CRUD ─────────────────────────────────────────────────────────────

export async function addVariant(
    productId: string,
    input: ProductVariantInput
): Promise<ServiceResult<ProductVariant>> {
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
        .from("product_variants")
        .insert({
            product_id: productId,
            size: input.size ?? null,
            color: input.color ?? null,
            color_hex: input.colorHex ?? null,
            design: input.design ?? null,
            sku: input.sku ?? null,
            price_override: input.priceOverride ?? null,
            is_available: input.isAvailable ?? true,
        })
        .select("*, images:product_images(*)")
        .single();

    if (error) return { success: false, error: error.message };
    revalidateTag("products", "max");
    return { success: true, data: mapVariantFromDb(data) };
}

export async function updateVariant(
    variantId: string,
    input: Partial<ProductVariantInput>
): Promise<ServiceResult<ProductVariant>> {
    const supabase = await createSupabaseAdminClient();

    const patch: Record<string, unknown> = {};
    if ("size" in input) patch.size = input.size ?? null;
    if ("color" in input) patch.color = input.color ?? null;
    if ("colorHex" in input) patch.color_hex = input.colorHex ?? null;
    if ("design" in input) patch.design = input.design ?? null;
    if ("sku" in input) patch.sku = input.sku ?? null;
    if ("priceOverride" in input) patch.price_override = input.priceOverride ?? null;
    if ("isAvailable" in input) patch.is_available = input.isAvailable;

    const { data, error } = await supabase
        .from("product_variants")
        .update(patch)
        .eq("id", variantId)
        .select("*, images:product_images(*)")
        .single();

    if (error) return { success: false, error: error.message };
    revalidateTag("products", "max");
    return { success: true, data: mapVariantFromDb(data) };
}

export async function deleteVariant(variantId: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();
    // product_images are cascade deleted via FK
    const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", variantId);

    if (error) {
        if (error.code === "23503") {
            return {
                success: false,
                error: "This variant is referenced in existing orders and cannot be deleted.",
            };
        }
        return { success: false, error: error.message };
    }
    revalidateTag("products", "max");
    return { success: true };
}

// ─── Variant Image ────────────────────────────────────────────────────────────

/**
 * Register a Cloudinary image for a variant in the DB.
 * Call this after a successful Cloudinary upload.
 */
export async function upsertVariantImage(
    variantId: string,
    cloudinaryPublicId: string,
    cloudinaryUrl: string,
    altText: string | null = null,
    isPrimary = true
): Promise<ServiceResult<ProductImage>> {
    const supabase = await createSupabaseAdminClient();

    // If isPrimary: demote any existing primary on this variant first
    if (isPrimary) {
        await supabase
            .from("product_images")
            .update({ is_primary: false })
            .eq("variant_id", variantId)
            .eq("is_primary", true);
    }

    const { data, error } = await supabase
        .from("product_images")
        .upsert(
            {
                variant_id: variantId,
                cloudinary_public_id: cloudinaryPublicId,
                cloudinary_url: cloudinaryUrl,
                alt_text: altText,
                is_primary: isPrimary,
            },
            { onConflict: "cloudinary_public_id" }
        )
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidateTag("products", "max");
    return {
        success: true,
        data: {
            id: data.id,
            variantId: data.variant_id,
            cloudinaryPublicId: data.cloudinary_public_id,
            cloudinaryUrl: data.cloudinary_url,
            altText: data.alt_text ?? null,
            isPrimary: data.is_primary,
        },
    };
}

export async function deleteVariantImage(imageId: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();
    const { error } = await supabase.from("product_images").delete().eq("id", imageId);
    if (error) return { success: false, error: error.message };
    revalidateTag("products", "max");
    return { success: true };
}

// ─── Upload Service ────────────────────────────────────────────────────────────
// Server-side: signed Cloudinary upload → insert into product_images via Supabase.
// Client-side: unsigned receipt upload re-exported from the browser helper.

import { uploadProductImage, deleteCloudinaryAsset } from "@/lib/cloudinary/server";
import { upsertVariantImage, deleteVariantImage } from "@/lib/services/products.service";
import type { ProductImage, ServiceResult } from "@/lib/data/types";

// ─── Server-side: Product variant images (admin) ──────────────────────────────

/**
 * Upload a product variant image to Cloudinary, then register it in Supabase.
 * Call only from Server Actions or API Route Handlers.
 */
export async function uploadVariantImage(
    variantId: string,
    file: Buffer | string,
    altText?: string | null,
    isPrimary = true
): Promise<ServiceResult<ProductImage>> {
    try {
        // 1. Upload to Cloudinary
        const { publicId, url } = await uploadProductImage(file, variantId);

        // 2. Register in Supabase
        return await upsertVariantImage(variantId, publicId, url, altText ?? null, isPrimary);
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Delete a product variant image from both Cloudinary and Supabase.
 * Call only from Server Actions or API Route Handlers.
 */
export async function deleteVariantImageFull(
    imageId: string,
    cloudinaryPublicId: string
): Promise<ServiceResult> {
    try {
        // Delete from Cloudinary first (if it fails, don't orphan the DB record)
        await deleteCloudinaryAsset(cloudinaryPublicId);

        // Then remove from DB
        return await deleteVariantImage(imageId);
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

// ─── Client-side: Payment receipts (customer) ─────────────────────────────────
// These are thin re-exports from the Cloudinary browser helper.
// Import in Client Components for the /fulfil receipt upload flow.

export {
    uploadReceiptClient as uploadPaymentReceipt,
    deleteReceiptClient as deletePaymentReceipt,
} from "@/lib/cloudinary/client";

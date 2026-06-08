// ─── DB ↔ App Mappers ────────────────────────────────────────────────────────
//
// Convert Supabase snake_case row objects → camelCase app types.
// These are pure functions — no side effects, no DB calls.
//
// DB column naming convention: snake_case
// App type convention:         camelCase
//
// Every mapper validates nothing — it assumes the DB schema is correct.
// Validation belongs in the service layer.

import type {
    Category,
    Product,
    ProductVariant,
    ProductImage,
    Order,
    OrderItem,
    Payment,
    AdminUser,
    OrderStatus,
    PaymentStatus,
    ExtractionConfidence,
    AdminRole,
} from "@/lib/data/types";

function toPlain<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// ─── Category ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapCategoryFromDb(row: any): Category {
    return toPlain({
        id: row.id,
        slug: row.slug,
        label: row.label,
        description: row.description ?? null,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        createdAt: row.created_at,
    });
}

// ─── Product Image ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProductImageFromDb(row: any): ProductImage {
    return toPlain({
        id: row.id,
        variantId: row.variant_id,
        cloudinaryPublicId: row.cloudinary_public_id,
        cloudinaryUrl: row.cloudinary_url,
        altText: row.alt_text ?? null,
        isPrimary: row.is_primary,
    });
}

// ─── Product Variant ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapVariantFromDb(row: any): ProductVariant {
    return toPlain({
        id: row.id,
        productId: row.product_id,
        size: row.size ?? null,
        color: row.color ?? null,
        colorHex: row.color_hex ?? null,
        design: row.design ?? null,
        sku: row.sku ?? null,
        priceOverride: row.price_override ?? null,
        isAvailable: row.is_available,
        images: Array.isArray(row.images) ? row.images.map(mapProductImageFromDb) : [],
    });
}

// ─── Product ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProductFromDb(row: any): Product {
    const category = row.category ?? {};
    return toPlain({
        id: row.id,
        categoryId: row.category_id,
        categorySlug: category.slug ?? "",
        categoryLabel: category.label ?? "",
        name: row.name,
        description: row.description ?? "",
        basePrice: row.base_price,
        tags: Array.isArray(row.tags) ? row.tags : [],
        isAvailable: row.is_available,
        variants: Array.isArray(row.variants) ? row.variants.map(mapVariantFromDb) : [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    });
}

// ─── Order Item ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapOrderItemFromDb(row: any): OrderItem {
    return toPlain({
        id: row.id,
        orderId: row.order_id,
        variantId: row.variant_id,
        productName: row.product_name,
        variantLabel: row.variant_label,
        quantity: row.quantity,
        unitPrice: row.unit_price,
        imageUrl: row.image_url ?? null,
    });
}

// ─── Payment ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPaymentFromDb(row: any): Payment {
    return toPlain({
        id: row.id,
        orderId: row.order_id,
        cloudinaryReceiptPublicId: row.cloudinary_receipt_public_id ?? null,
        receiptUrl: row.receipt_url ?? null,
        extractedAmount: row.extracted_amount,
        extractedSenderName: row.extracted_sender_name ?? null,
        extractedDate: row.extracted_date ?? null,
        extractedTime: row.extracted_time ?? null,
        extractedBank: row.extracted_bank ?? null,
        extractedTransactionRef: row.extracted_transaction_ref ?? null,
        extractionConfidence: (row.extraction_confidence as ExtractionConfidence) ?? null,
        amountConfirmed: row.amount_confirmed ?? null,
        userConfirmedAccuracy: row.user_confirmed_accuracy ?? null,
        status: row.status as PaymentStatus,
        reviewNote: row.review_note ?? null,
        moderatorName: row.moderator_name ?? null,
        moderatorEmail: row.moderator_email ?? null,
        createdAt: row.created_at,
    });
}

// ─── Order ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapOrderFromDb(row: any): Order {
    return toPlain({
        id: row.id,
        orderRef: row.order_ref,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        customerNote: row.customer_note ?? null,
        status: row.status as OrderStatus,
        totalAmount: row.total_amount,
        amountPaid: row.amount_paid,
        items: Array.isArray(row.items) ? row.items.map(mapOrderItemFromDb) : [],
        payments: Array.isArray(row.payments) ? row.payments.map(mapPaymentFromDb) : [],
        followUpCount: row.follow_up_count ?? 0,
        lastFollowUpAt: row.last_follow_up_at ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    });
}

// ─── Admin User ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAdminUserFromDb(row: any): AdminUser {
    return toPlain({
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role as AdminRole,
        createdAt: row.created_at,
    });
}

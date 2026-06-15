// ─── RW Commerce System — Canonical Type Definitions ─────────────────────────
//
// Single source of truth for all domain types.
// DB column names (snake_case) are mapped to camelCase at the service layer.
//
// Pre-order model: customers order → pay installments → we produce → deliver.
// Stock tracking is NOT needed. Order fulfillment is derived from payment records.
// Moderators manually transition order.status; the UI derives display state from
// the sum of approved payments vs. the order total.

// ─── Enums / Unions ───────────────────────────────────────────────────────────

export type OrderStatus =
    | "pending" // created, no payment yet
    | "partially_paid" // at least one approved payment, but not full amount
    | "paid" // full amount covered by approved payments
    | "confirmed" // moderator confirms & queues for production
    | "in_production" // being made
    | "delivered" // handed over to customer
    | "flagged" // flagged for manual review
    | "cancelled";

export type PaymentStatus = "pending" | "approved" | "flagged" | "rejected";

export type ExtractionConfidence = "high" | "medium" | "low";

export type AdminRole = "admin" | "moderator";

// ─── Categories (DB-managed) ──────────────────────────────────────────────────
//
// Categories live in the `categories` table and are managed from the admin panel.
// Products reference categories via `categoryId`.

export interface Category {
    id: string;
    slug: string; // e.g. "tshirt", "hoodie", "accessory" — URL-safe
    label: string; // e.g. "T-Shirt", "Hoodie", "Accessory" — display name
    description: string | null;
    sortOrder: number; // ascending — lower = first in lists
    isActive: boolean; // inactive categories are hidden from public storefront
    createdAt: string; // ISO 8601
}

export interface CategoryInput {
    slug: string;
    label: string;
    description?: string | null;
    sortOrder?: number;
    isActive?: boolean;
}

// ─── Product Images ───────────────────────────────────────────────────────────
//
// Images are stored in Cloudinary. Each image belongs to a specific variant.
// Dimensions are fixed at 360×480 — no width/height fields needed.
// One image per variant is the expected norm; `isPrimary` marks the canonical shot.

export interface ProductImage {
    id: string;
    variantId: string; // always tied to a specific variant (never null)
    cloudinaryPublicId: string; // e.g. "rw26/products/tshirt-black-m"
    cloudinaryUrl: string; // full Cloudinary delivery URL
    altText: string | null; // accessibility alt text
    isPrimary: boolean; // true = shown as the main image for this variant
}

// ─── Products ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
    id: string;
    productId: string;
    size: string | null; // 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size' | null
    color: string | null;
    colorHex: string | null; // custom hex code provided by admin
    design: string | null;
    sku: string | null; // optional SKU code for internal tracking
    priceOverride: number | null; // null = inherit basePrice from product
    isAvailable: boolean; // pre-order toggle per variant
    images: ProductImage[]; // Cloudinary images for this variant
}

export interface Product {
    id: string;
    categoryId: string; // FK → categories.id
    categorySlug: string; // denormalised for quick display without a join
    categoryLabel: string; // denormalised for quick display without a join
    name: string;
    description: string;
    basePrice: number; // Naira — used when variant has no priceOverride
    tags: string[]; // optional freeform tags e.g. ["new", "bestseller"]
    isAvailable: boolean; // master toggle — false hides entire product
    variants: ProductVariant[];
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
}

// Input types for create/update operations
export interface ProductInput {
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    tags?: string[];
    isAvailable?: boolean;
}

export interface ProductVariantInput {
    size?: string | null;
    color?: string | null;
    colorHex?: string | null;
    design?: string | null;
    sku?: string | null;
    priceOverride?: number | null;
    isAvailable?: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
    variantId: string;
    productId: string;
    productName: string;
    variantLabel: string; // e.g. "Black · M · Holy Spirit"
    unitPrice: number;
    quantity: number;
    imageUrl?: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
//
// Pre-order flow:
//   1. Customer creates an order → status: "pending"
//   2. Customer submits payment receipt(s) → status auto-reflects payment progress
//   3. Moderator reviews payments → approves/flags/rejects
//   4. When sum(approved payments) >= totalAmount → moderator sets "confirmed"
//   5. Moderator tracks "in_production" → "delivered"
//
// Moderators manually change order.status. The UI derives display state from
// the getOrderPaymentSummary() helper (amountPaid, isFullyPaid, pendingCount).

export interface OrderItem {
    id: string;
    orderId: string;
    variantId: string;
    productName: string;
    variantLabel: string; // snapshot at order time — immutable
    quantity: number;
    unitPrice: number; // snapshot at order time — immutable
    imageUrl?: string | null;
}

export interface Payment {
    id: string;
    orderId: string;

    // Cloudinary receipt storage
    cloudinaryReceiptPublicId: string | null;
    receiptUrl: string | null; // Cloudinary delivery URL (or legacy URL)

    // AI-extracted fields from receipt image
    extractedSenderName: string | null;
    extractedAmount: number; // amount extracted by AI from receipt (replaces amountClaimed)
    extractedDate: string | null;
    extractedTime: string | null;
    extractedBank: string | null;
    extractedTransactionRef: string | null; // unique ref from the bank receipt
    extractionConfidence: ExtractionConfidence | null;
    userConfirmedAccuracy: boolean | null; // customer confirmed the extraction was correct

    // Moderator confirmation
    amountConfirmed: number | null; // amount confirmed received by moderator

    // Review outcome
    status: PaymentStatus;
    reviewNote: string | null;

    // Actor signature — set when a moderator/admin takes action on this payment
    moderatorName: string | null;
    moderatorEmail: string | null;

    createdAt: string; // ISO 8601 — when customer submitted
}

export interface Order {
    id: string;
    orderRef: string; // short alphanumeric code shown to customer e.g. "FF3A9C"
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNote: string | null;
    status: OrderStatus; // set manually by moderators
    totalAmount: number; // sum of (unitPrice × quantity) for all items
    amountPaid: number; // sum of approved payments — derived/cached
    items: OrderItem[];
    payments: Payment[];
    followUpCount: number; // how many follow-up reminders have been sent
    lastFollowUpAt: string | null; // ISO 8601 — last follow-up reminder, or null
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
}

// Derived summary — computed by getOrderPaymentSummary()
export interface OrderPaymentSummary {
    orderId: string;
    totalAmount: number;
    amountPaid: number; // sum of approved payments
    amountPending: number; // sum of pending payments (not yet reviewed)
    balance: number; // totalAmount - amountPaid
    isFullyPaid: boolean; // amountPaid >= totalAmount
    approvedCount: number;
    pendingCount: number;
    flaggedCount: number;
    rejectedCount: number;
}

// ─── Admin / Moderator Users ──────────────────────────────────────────────────
//
// Admin users are linked to Supabase auth.users via `id`.
// Only admins can create/modify products and verdicts.
// Admins and moderators can review payments (actor signature stamped on Payment).

export interface AdminUser {
    id: string; // matches Supabase auth.users.id (UUID)
    email: string;
    name: string;
    role: AdminRole;
    createdAt: string; // ISO 8601
}

// ─── Email Templates & Logs ───────────────────────────────────────────────────
//
// Transactional email system. Templates are stored in the database and edited
// from the admin UI. Triggers fire when order/payment status changes, invoking
// the Edge Function which fetches the template, injects variables, and sends.
// All sends are logged for audit purposes.

export interface EmailTemplate {
    id: string;
    templateKey: string; // e.g. "pending", "paid", "payment_approved" — unique key
    label: string; // human-readable name e.g. "Order Confirmed"
    subject: string; // email subject (supports {{variables}})
    bodyHtml: string; // full HTML body (supports {{variables}})
    isActive: boolean; // inactive templates are skipped by triggers
    updatedAt: string; // ISO 8601
    updatedBy: string | null; // email of the admin who last edited
}

export interface EmailLog {
    id: string;
    orderId: string | null;
    paymentId: string | null;
    templateKey: string;
    recipientEmail: string;
    subject: string | null;
    success: boolean;
    errorMessage: string | null;
    sentAt: string; // ISO 8601
}

// ─── Service Input/Output Helpers ─────────────────────────────────────────────

export interface ServiceResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

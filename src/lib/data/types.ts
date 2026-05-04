// ─── Shared types for the RW commerce system ───────────────────────────────

export type OrderStatus =
    | "pending"
    | "partially_paid"
    | "paid"
    | "confirmed"
    | "in_production"
    | "delivered"
    | "flagged"
    | "cancelled";

export type PaymentStatus = "pending" | "approved" | "flagged" | "rejected";
export type ExtractionConfidence = "high" | "medium" | "low";

// ─── Products ──────────────────────────────────────────────────────────────

export interface ProductVariant {
    id: string;
    size: string | null;   // 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size' | null
    color: string | null;
    design: string | null;
    priceOverride: number | null; // null = inherit basePrice
    isAvailable: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: "tshirt" | "hoodie" | "accessory";
    basePrice: number; // Naira
    variants: ProductVariant[];
    isAvailable: boolean;
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
    variantId: string;
    productId: string;
    productName: string;
    variantLabel: string; // e.g. "M · Black · Holy Spirit"
    unitPrice: number;
    quantity: number;
}

// ─── Orders ────────────────────────────────────────────────────────────────

export interface OrderItem {
    id: string;
    variantId: string;
    productName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
}

export interface Payment {
    id: string;
    orderId: string;
    amountClaimed: number;
    percentOfTotal: number;
    receiptUrl: string | null;
    extractedSenderName: string | null;
    extractedAmount: number | null;
    extractedDate: string | null;
    extractedTime: string | null;
    extractedBank: string | null;
    extractionConfidence: ExtractionConfidence | null;
    amountMatch: boolean | null;
    userConfirmedAccuracy: boolean | null;
    status: PaymentStatus;
    reviewNote: string | null;
    createdAt: string;
}

export interface Order {
    id: string;
    orderRef: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNote: string | null;
    status: OrderStatus;
    totalAmount: number;
    amountPaid: number;
    items: OrderItem[];
    payments: Payment[];
    createdAt: string;
    updatedAt: string;
}

// ─── Legacy (memoryStore compatibility) ────────────────────────────────────

export interface MerchItem {
    id: string;
    name: string;
    description: string;
    basePriceNgn: number;
    sizes: string[];
    active: boolean;
}

export interface OrderLineInput {
    merchItemId: string;
    size: string;
    qty: number;
}

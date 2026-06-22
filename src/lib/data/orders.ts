import type { Order, Payment, OrderPaymentSummary } from "./types";

// ─── Seeded demo orders for admin dashboard ───────────────────────────────────
// Used when DEMO_MODE = true. In live mode, orders come from Supabase.
//
// Pre-order flow: customer orders → submits payment receipts →
// moderator approves/flags → order status manually updated by moderator.

const demoPayments: Record<string, Payment[]> = {
    "FF3A9C": [
        {
            id: "pay-001",
            orderId: "ord-001",
            extractedAmount: 9000,
            cloudinaryReceiptPublicId: null,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "Adewale Ogundimu",
            extractedDate: "2026-05-02",
            extractedTime: "14:32",
            extractedBank: "GTBank",
            extractedTransactionRef: "TXN-93A8B29C",
            extractionConfidence: "high",
            userConfirmedAccuracy: true,
            amountConfirmed: 9000,
            status: "approved",
            reviewNote: null,
            moderatorName: "Precious Olusola",
            moderatorEmail: "preciousolusola16@gmail.com",
            createdAt: "2026-05-02T14:35:00Z",
        },
    ],
    "FF7B2D": [
        {
            id: "pay-002",
            orderId: "ord-002",
            extractedAmount: 2000,
            cloudinaryReceiptPublicId: null,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "David Olakintan",
            extractedDate: "2026-05-03",
            extractedTime: "09:15",
            extractedBank: "Opay",
            extractedTransactionRef: "OP-4938201",
            extractionConfidence: "high",
            userConfirmedAccuracy: true,
            amountConfirmed: null,
            status: "pending",
            reviewNote: "Verification required for Opay transfer",
            moderatorName: null,
            moderatorEmail: null,
            createdAt: "2026-05-03T09:18:00Z",
        },
    ],
    "FFCD01": [
        {
            id: "pay-005",
            orderId: "ord-003",
            extractedAmount: 2000,
            cloudinaryReceiptPublicId: null,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "Grace Omotayo",
            extractedDate: "2026-05-03",
            extractedTime: "16:40",
            extractedBank: "Opay",
            extractedTransactionRef: "OP-9832104",
            extractionConfidence: "high",
            userConfirmedAccuracy: true,
            amountConfirmed: null,
            status: "pending",
            reviewNote: null,
            moderatorName: null,
            moderatorEmail: null,
            createdAt: "2026-05-03T16:45:00Z",
        },
    ],
    "FF891E": [
        {
            id: "pay-003",
            orderId: "ord-004",
            extractedAmount: 12000,
            cloudinaryReceiptPublicId: null,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "Samuel Adeyemi",
            extractedDate: "2026-04-30",
            extractedTime: "18:02",
            extractedBank: "Access Bank",
            extractedTransactionRef: "ACC-5908123A",
            extractionConfidence: "high",
            userConfirmedAccuracy: true,
            amountConfirmed: 12000,
            status: "approved",
            reviewNote: null,
            moderatorName: "Precious Olusola",
            moderatorEmail: "preciousolusola16@gmail.com",
            createdAt: "2026-04-30T18:05:00Z",
        },
    ],
    "FF0F4A": [
        {
            id: "pay-004",
            orderId: "ord-005",
            extractedAmount: 2000,
            cloudinaryReceiptPublicId: null,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "Chidinma Eze",
            extractedDate: "2026-05-01",
            extractedTime: "11:44",
            extractedBank: "Opay",
            extractedTransactionRef: "OP-1102938",
            extractionConfidence: "high",
            userConfirmedAccuracy: false,
            amountConfirmed: null,
            status: "flagged",
            reviewNote: "Manual review requested by user",
            moderatorName: "Precious Olusola",
            moderatorEmail: "preciousolusola16@gmail.com",
            createdAt: "2026-05-01T11:47:00Z",
        },
    ],
};

export const DEMO_ORDERS: Order[] = [
    {
        id: "ord-001",
        orderRef: "FF3A9C",
        customerName: "Adewale Ogundimu",
        customerEmail: "adewale.o@futa.edu.ng",
        customerPhone: "08012345678",
        customerNote: "Please hold for Sunday pickup during Handing Over.",
        status: "partially_paid",
        totalAmount: 18000,
        amountPaid: 9000,
        items: [
            { id: "oi-001", orderId: "ord-001", variantId: "tee-hs-l-blk",  productName: "Holy Spirit Tee", variantLabel: "Black · L · Holy Spirit", quantity: 2, unitPrice: 4500 },
            { id: "oi-002", orderId: "ord-001", variantId: "hd-l-blk",      productName: "RW'26 Hoodie",   variantLabel: "Black · L · RW'26",       quantity: 1, unitPrice: 12000 },
        ],
        payments: demoPayments["FF3A9C"]!,
        createdAt: "2026-05-02T14:00:00Z",
        updatedAt: "2026-05-02T14:35:00Z",
        followUpCount: 0,
        lastFollowUpAt: null,
        pickupToken: null,
        deliveredAt: null,
        deliveredByName: null,
        deliveredByEmail: null,
    },
    {
        id: "ord-002",
        orderRef: "FF7B2D",
        customerName: "Blessing Nwachukwu",
        customerEmail: "blessing.n@gmail.com",
        customerPhone: "09087654321",
        customerNote: null,
        status: "pending",
        totalAmount: 17300,
        amountPaid: 0,
        items: [
            { id: "oi-003", orderId: "ord-002", variantId: "tee-hs-m-wht",  productName: "Holy Spirit Tee", variantLabel: "White · M · Holy Spirit", quantity: 1, unitPrice: 4500 },
            { id: "oi-004", orderId: "ord-002", variantId: "cap-blk",       productName: "Anniversary Cap", variantLabel: "Black · One Size",         quantity: 2, unitPrice: 3500 },
            { id: "oi-005", orderId: "ord-002", variantId: "stk-std",       productName: "Sticker Pack",    variantLabel: "Standard Pack",            quantity: 1, unitPrice: 800 },
        ],
        payments: demoPayments["FF7B2D"]!,
        createdAt: "2026-05-03T09:00:00Z",
        updatedAt: "2026-05-03T09:18:00Z",
        followUpCount: 0,
        lastFollowUpAt: null,
        pickupToken: null,
        deliveredAt: null,
        deliveredByName: null,
        deliveredByEmail: null,
    },
    {
        id: "ord-003",
        orderRef: "FFCD01",
        customerName: "Grace Omotayo",
        customerEmail: "grace.omotayo@futa.edu.ng",
        customerPhone: "07065432109",
        customerNote: null,
        status: "pending",
        totalAmount: 9000,
        amountPaid: 0,
        items: [
            { id: "oi-006", orderId: "ord-003", variantId: "tee-hs-s-burg", productName: "Holy Spirit Tee", variantLabel: "Burgundy · S · Holy Spirit", quantity: 2, unitPrice: 4500 },
        ],
        payments: demoPayments["FFCD01"]!,
        createdAt: "2026-05-03T16:30:00Z",
        updatedAt: "2026-05-03T16:30:00Z",
        followUpCount: 0,
        lastFollowUpAt: null,
        pickupToken: null,
        deliveredAt: null,
        deliveredByName: null,
        deliveredByEmail: null,
    },
    {
        id: "ord-004",
        orderRef: "FF891E",
        customerName: "Samuel Adeyemi",
        customerEmail: "sam.adeyemi@yahoo.com",
        customerPhone: "08098765432",
        customerNote: "For the choir unit matching outfits.",
        status: "paid",
        totalAmount: 12000,
        amountPaid: 12000,
        items: [
            { id: "oi-007", orderId: "ord-004", variantId: "hd-l-wine",  productName: "RW'26 Hoodie", variantLabel: "Wine Red · L · RW'26",  quantity: 1, unitPrice: 12000 },
        ],
        payments: demoPayments["FF891E"]!,
        createdAt: "2026-04-30T17:50:00Z",
        updatedAt: "2026-04-30T18:05:00Z",
        followUpCount: 0,
        lastFollowUpAt: null,
        pickupToken: null,
        deliveredAt: null,
        deliveredByName: null,
        deliveredByEmail: null,
    },
    {
        id: "ord-005",
        orderRef: "FF0F4A",
        customerName: "Chidinma Eze",
        customerEmail: "chidinma.eze@gmail.com",
        customerPhone: "09011223344",
        customerNote: null,
        status: "flagged",
        totalAmount: 17300,
        amountPaid: 0,
        items: [
            { id: "oi-008", orderId: "ord-005", variantId: "tee-hs-xl-blk", productName: "Holy Spirit Tee", variantLabel: "Black · XL · Holy Spirit", quantity: 2, unitPrice: 4500 },
            { id: "oi-009", orderId: "ord-005", variantId: "cap-wine",      productName: "Anniversary Cap",  variantLabel: "Wine Red · One Size",       quantity: 1, unitPrice: 3500 },
            { id: "oi-010", orderId: "ord-005", variantId: "stk-std",       productName: "Sticker Pack",     variantLabel: "Standard Pack",             quantity: 1, unitPrice: 800 },
        ],
        payments: demoPayments["FF0F4A"]!,
        createdAt: "2026-05-01T11:30:00Z",
        updatedAt: "2026-05-01T11:47:00Z",
        followUpCount: 0,
        lastFollowUpAt: null,
        pickupToken: null,
        deliveredAt: null,
        deliveredByName: null,
        deliveredByEmail: null,
    },
    {
        id: "ord-006",
        orderRef: "FFAA52",
        customerName: "David Okonkwo",
        customerEmail: "d.okonkwo@futa.edu.ng",
        customerPhone: "08133445566",
        customerNote: "Drama unit order.",
        status: "confirmed",
        totalAmount: 16500,
        amountPaid: 16500,
        items: [
            { id: "oi-011", orderId: "ord-006", variantId: "hd-m-burg",  productName: "RW'26 Hoodie",   variantLabel: "Burgundy · M · RW'26",    quantity: 1, unitPrice: 12000 },
            { id: "oi-012", orderId: "ord-006", variantId: "cap-blk",    productName: "Anniversary Cap", variantLabel: "Black · One Size",         quantity: 1, unitPrice: 3500 },
            { id: "oi-013", orderId: "ord-006", variantId: "stk-std",    productName: "Sticker Pack",    variantLabel: "Standard Pack",            quantity: 1, unitPrice: 800 },
        ],
        payments: [],
        createdAt: "2026-04-28T10:00:00Z",
        updatedAt: "2026-04-29T15:00:00Z",
        followUpCount: 0,
        lastFollowUpAt: null,
        pickupToken: null,
        deliveredAt: null,
        deliveredByName: null,
        deliveredByEmail: null,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getDemoOrder(orderRef: string): Order | undefined {
    return DEMO_ORDERS.find((o) => o.orderRef.toUpperCase() === orderRef.toUpperCase());
}

export function getDemoOrderById(id: string): Order | undefined {
    return DEMO_ORDERS.find((o) => o.id === id);
}

/** Compute payment summary for an order — mirrors the `order_payment_summary` DB view. */
export function computeOrderPaymentSummary(order: Order): OrderPaymentSummary {
    const approved  = order.payments.filter((p) => p.status === "approved");
    const pending   = order.payments.filter((p) => p.status === "pending");
    const flagged   = order.payments.filter((p) => p.status === "flagged");
    const rejected  = order.payments.filter((p) => p.status === "rejected");

    const amountPaid    = approved.reduce((s, p) => s + (p.amountConfirmed ?? p.extractedAmount), 0);
    const amountPending = pending.reduce((s, p) => s + p.extractedAmount, 0);
    const balance       = order.totalAmount - amountPaid;

    return {
        orderId:        order.id,
        totalAmount:    order.totalAmount,
        amountPaid,
        amountPending,
        balance:        Math.max(balance, 0),
        isFullyPaid:    amountPaid >= order.totalAmount,
        approvedCount:  approved.length,
        pendingCount:   pending.length,
        flaggedCount:   flagged.length,
        rejectedCount:  rejected.length,
    };
}

/** Summary stats for admin dashboard */
export function getDemoStats() {
    const total   = DEMO_ORDERS.length;
    const revenue = DEMO_ORDERS.reduce((s, o) => s + o.amountPaid, 0);
    const pending = DEMO_ORDERS.filter((o) => o.payments.some((p) => p.status === "pending")).length;
    const flagged = DEMO_ORDERS.filter((o) => o.status === "flagged").length;
    return { total, revenue, pending, flagged };
}

import type { Order, Payment } from "./types";

// ─── Seeded demo orders for admin dashboard ─────────────────────────────────

const demoPayments: Record<string, Payment[]> = {
    "FF3A9C": [
        {
            id: "pay-001",
            orderId: "ord-001",
            amountClaimed: 9000,
            percentOfTotal: 50,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "Adewale Ogundimu",
            extractedAmount: 9000,
            extractedDate: "2026-05-02",
            extractedTime: "14:32",
            extractedBank: "GTBank",
            extractionConfidence: "high",
            amountMatch: true,
            userConfirmedAccuracy: true,
            status: "approved",
            reviewNote: null,
            createdAt: "2026-05-02T14:35:00Z",
        },
    ],
    "FF7B2D": [
        {
            id: "pay-002",
            orderId: "ord-002",
            amountClaimed: 2000,
            percentOfTotal: 12,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "David Olakintan",
            extractedAmount: 2000,
            extractedDate: "2026-05-03",
            extractedTime: "09:15",
            extractedBank: "Opay",
            extractionConfidence: "high",
            amountMatch: true,
            userConfirmedAccuracy: true,
            status: "pending",
            reviewNote: "Verification required for Opay transfer",
            createdAt: "2026-05-03T09:18:00Z",
        },
    ],
    "FFCD01": [
        {
            id: "pay-005",
            orderId: "ord-003",
            amountClaimed: 2000,
            percentOfTotal: 22,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "David Olakintan",
            extractedAmount: 2000,
            extractedDate: "2026-05-03",
            extractedTime: "16:40",
            extractedBank: "Opay",
            extractionConfidence: "high",
            amountMatch: true,
            userConfirmedAccuracy: true,
            status: "pending",
            reviewNote: null,
            createdAt: "2026-05-03T16:45:00Z",
        }
    ],
    "FF891E": [
        {
            id: "pay-003",
            orderId: "ord-004",
            amountClaimed: 12000,
            percentOfTotal: 100,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "Samuel Adeyemi",
            extractedAmount: 12000,
            extractedDate: "2026-04-30",
            extractedTime: "18:02",
            extractedBank: "Access Bank",
            extractionConfidence: "high",
            amountMatch: true,
            userConfirmedAccuracy: true,
            status: "approved",
            reviewNote: null,
            createdAt: "2026-04-30T18:05:00Z",
        },
    ],
    "FF0F4A": [
        {
            id: "pay-004",
            orderId: "ord-005",
            amountClaimed: 2000,
            percentOfTotal: 12,
            receiptUrl: "/demo/payment-receipt.jpg",
            extractedSenderName: "David Olakintan",
            extractedAmount: 2000,
            extractedDate: "2026-05-01",
            extractedTime: "11:44",
            extractedBank: "Opay",
            extractionConfidence: "high",
            amountMatch: true,
            userConfirmedAccuracy: false,
            status: "flagged",
            reviewNote: "Manual review requested by user",
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
            { id: "oi-001", variantId: "tee-hs-l-blk",  productName: "Holy Spirit Tee", variantLabel: "Black · L · Holy Spirit", quantity: 2, unitPrice: 4500 },
            { id: "oi-002", variantId: "hd-l-blk",       productName: "RW'26 Hoodie",   variantLabel: "Black · L · RW'26",       quantity: 1, unitPrice: 12000 },
        ],
        payments: demoPayments["FF3A9C"]!,
        createdAt: "2026-05-02T14:00:00Z",
        updatedAt: "2026-05-02T14:35:00Z",
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
            { id: "oi-003", variantId: "tee-hs-m-wht",  productName: "Holy Spirit Tee", variantLabel: "White · M · Holy Spirit", quantity: 1, unitPrice: 4500 },
            { id: "oi-004", variantId: "cap-blk",        productName: "Anniversary Cap", variantLabel: "Black · One Size",         quantity: 2, unitPrice: 3500 },
            { id: "oi-005", variantId: "stk-std",        productName: "Sticker Pack",    variantLabel: "Standard Pack",            quantity: 1, unitPrice: 800 },
        ],
        payments: demoPayments["FF7B2D"]!,
        createdAt: "2026-05-03T09:00:00Z",
        updatedAt: "2026-05-03T09:18:00Z",
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
            { id: "oi-006", variantId: "tee-hs-s-burg", productName: "Holy Spirit Tee", variantLabel: "Burgundy · S · Holy Spirit", quantity: 2, unitPrice: 4500 },
        ],
        payments: demoPayments["FFCD01"]!,
        createdAt: "2026-05-03T16:30:00Z",
        updatedAt: "2026-05-03T16:30:00Z",
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
            { id: "oi-007", variantId: "hd-l-wine",  productName: "RW'26 Hoodie", variantLabel: "Wine Red · L · RW'26",  quantity: 1, unitPrice: 12000 },
        ],
        payments: demoPayments["FF891E"]!,
        createdAt: "2026-04-30T17:50:00Z",
        updatedAt: "2026-04-30T18:05:00Z",
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
            { id: "oi-008", variantId: "tee-hs-xl-blk", productName: "Holy Spirit Tee", variantLabel: "Black · XL · Holy Spirit", quantity: 2, unitPrice: 4500 },
            { id: "oi-009", variantId: "cap-wine",       productName: "Anniversary Cap",  variantLabel: "Wine Red · One Size",       quantity: 1, unitPrice: 3500 },
            { id: "oi-010", variantId: "stk-std",        productName: "Sticker Pack",     variantLabel: "Standard Pack",             quantity: 1, unitPrice: 800 },
        ],
        payments: demoPayments["FF0F4A"]!,
        createdAt: "2026-05-01T11:30:00Z",
        updatedAt: "2026-05-01T11:47:00Z",
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
            { id: "oi-011", variantId: "hd-m-burg",  productName: "RW'26 Hoodie",   variantLabel: "Burgundy · M · RW'26",    quantity: 1, unitPrice: 12000 },
            { id: "oi-012", variantId: "cap-blk",    productName: "Anniversary Cap", variantLabel: "Black · One Size",         quantity: 1, unitPrice: 3500 },
            { id: "oi-013", variantId: "stk-std",    productName: "Sticker Pack",    variantLabel: "Standard Pack",            quantity: 1, unitPrice: 800 },
        ],
        payments: [],
        createdAt: "2026-04-28T10:00:00Z",
        updatedAt: "2026-04-29T15:00:00Z",
    },
];

export function getDemoOrder(orderRef: string): Order | undefined {
    return DEMO_ORDERS.find((o) => o.orderRef.toUpperCase() === orderRef.toUpperCase());
}

export function getDemoOrderById(id: string): Order | undefined {
    return DEMO_ORDERS.find((o) => o.id === id);
}

// Summary stats for admin dashboard
export function getDemoStats() {
    const total = DEMO_ORDERS.length;
    const revenue = DEMO_ORDERS.reduce((s, o) => s + o.amountPaid, 0);
    const pending = DEMO_ORDERS.filter((o) => o.payments.some((p) => p.status === "pending")).length;
    const flagged = DEMO_ORDERS.filter((o) => o.status === "flagged").length;
    return { total, revenue, pending, flagged };
}

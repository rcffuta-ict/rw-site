// ─── In-memory store (demo / legacy) ─────────────────────────────────────────
// Used by DEMO_MODE to simulate order creation and status updates.
// In live mode all of these are replaced by Supabase calls in the service layer.
// This file uses local type aliases to avoid depending on removed legacy types.

import type { Order, OrderItem, OrderStatus } from "./types";

// ─── Local legacy types (removed from types.ts, kept here for MemoryStore only)

interface MerchItem {
    id: string;
    name: string;
    description: string;
    basePriceNgn: number;
    sizes: string[];
    active: boolean;
}

interface OrderLineInput {
    merchItemId: string;
    size: string;
    qty: number;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const merch: MerchItem[] = [
    {
        id:            "tee",
        name:          "Anniversary T‑Shirt",
        description:   "Comfort fit, breathable cotton.",
        basePriceNgn:  4500,
        sizes:         ["S", "M", "L", "XL", "XXL"],
        active:        true,
    },
    {
        id:            "hoodie",
        name:          "Hoodie",
        description:   "Warm, clean, and durable.",
        basePriceNgn:  12000,
        sizes:         ["M", "L", "XL", "XXL"],
        active:        true,
    },
    {
        id:            "stickers",
        name:          "Sticker pack",
        description:   "Small, fun add‑on for your laptop or bottle.",
        basePriceNgn:  800,
        sizes:         ["One size"],
        active:        true,
    },
];

const orders: Order[] = [];

function newId(prefix: string) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(2, 7)}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const MemoryStore = {
    listMerch(): MerchItem[] {
        return merch.filter((m) => m.active);
    },

    getMerch(id: string): MerchItem | undefined {
        return merch.find((m) => m.id === id);
    },

    createOrder(input: {
        customerName:  string;
        customerPhone: string;
        customerEmail?: string;
        lines:         OrderLineInput[];
    }): Order {
        const expanded: OrderItem[] = input.lines
            .map((l) => {
                const item = merch.find((m) => m.id === l.merchItemId && m.active);
                if (!item) return null;
                if (!item.sizes.includes(l.size)) return null;
                if (!Number.isFinite(l.qty) || l.qty <= 0) return null;
                return {
                    id:           newId("item"),
                    orderId:      "",  // filled in below
                    variantId:    `${item.id}_${l.size}`,
                    productName:  item.name,
                    variantLabel: l.size,
                    quantity:     l.qty,
                    unitPrice:    item.basePriceNgn,
                } satisfies OrderItem;
            })
            .filter((i): i is OrderItem => i !== null);

        const orderId     = newId("ord");
        const totalAmount = expanded.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

        // Fill in orderId on each item
        expanded.forEach((item) => { item.orderId = orderId; });

        const order: Order = {
            id:            orderId,
            orderRef:      Math.random().toString(36).substring(2, 8).toUpperCase(),
            createdAt:     new Date().toISOString(),
            updatedAt:     new Date().toISOString(),
            followUpCount: 0,
            lastFollowUpAt: null,
            status:        "pending",
            customerName:  input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail ?? "",
            customerNote:  null,
            items:         expanded,
            totalAmount,
            amountPaid:    0,
            payments:      [],
        };
        orders.unshift(order);
        return order;
    },

    listOrders(): Order[] {
        return orders;
    },

    getOrder(orderId: string): Order | undefined {
        return orders.find((o) => o.id === orderId || o.orderRef === orderId);
    },

    setStatus(orderId: string, status: OrderStatus): Order | undefined {
        const o = orders.find((x) => x.id === orderId);
        if (!o) return undefined;
        o.status    = status;
        o.updatedAt = new Date().toISOString();
        return o;
    },

    attachReceipt(orderId: string, receiptUrl: string): Order | undefined {
        const o = orders.find((x) => x.id === orderId);
        if (!o) return undefined;
        const paymentId = newId("pay");
        o.payments.push({
            id:                         paymentId,
            orderId:                    o.id,
            extractedAmount:            0,
            cloudinaryReceiptPublicId:  null,
            receiptUrl:                 receiptUrl || null,
            extractedSenderName:        null,
            extractedDate:              null,
            extractedTime:              null,
            extractedBank:              null,
            extractedTransactionRef:    null,
            extractionConfidence:       null,
            userConfirmedAccuracy:      null,
            amountConfirmed:            null,
            status:                     "pending",
            reviewNote:                 null,
            moderatorName:              null,
            moderatorEmail:             null,
            createdAt:                  new Date().toISOString(),
        });
        o.updatedAt = new Date().toISOString();
        return o;
    },
};

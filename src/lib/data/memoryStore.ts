import type { MerchItem, Order, OrderItem, OrderLineInput, OrderStatus } from "./types";

const merch: MerchItem[] = [
    {
        id: "tee",
        name: "Anniversary T‑Shirt",
        description: "Comfort fit, breathable cotton.",
        basePriceNgn: 4500,
        sizes: ["S", "M", "L", "XL", "XXL"],
        active: true,
    },
    {
        id: "hoodie",
        name: "Hoodie",
        description: "Warm, clean, and durable.",
        basePriceNgn: 12000,
        sizes: ["M", "L", "XL", "XXL"],
        active: true,
    },
    {
        id: "stickers",
        name: "Sticker pack",
        description: "Small, fun add‑on for your laptop or bottle.",
        basePriceNgn: 800,
        sizes: ["One size"],
        active: true,
    },
];

const orders: Order[] = [];

function id(prefix: string) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now()
        .toString(36)
        .slice(2, 7)}`;
}

export const MemoryStore = {
    listMerch(): MerchItem[] {
        return merch.filter((m) => m.active);
    },

    getMerch(id: string): MerchItem | undefined {
        return merch.find((m) => m.id === id);
    },

    createOrder(input: {
        customerName: string;
        customerPhone: string;
        customerEmail?: string;
        lines: OrderLineInput[];
    }): Order {
        const expanded: OrderItem[] = input.lines
            .map((l) => {
                const item = merch.find((m) => m.id === l.merchItemId && m.active);
                if (!item) return null;
                if (!item.sizes.includes(l.size)) return null;
                if (!Number.isFinite(l.qty) || l.qty <= 0) return null;
                return {
                    id: id("item"),
                    variantId: `${item.id}_${l.size}`,
                    productName: item.name,
                    variantLabel: l.size,
                    quantity: l.qty,
                    unitPrice: item.basePriceNgn,
                };
            })
            .filter((i): i is OrderItem => i !== null);

        const totalAmount = expanded.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
        const order: Order = {
            id: id("ord"),
            orderRef: Math.random().toString(36).substring(2, 8).toUpperCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "pending",
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail ?? "",
            customerNote: null,
            items: expanded,
            totalAmount,
            amountPaid: 0,
            payments: [],
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
        o.status = status;
        o.updatedAt = new Date().toISOString();
        return o;
    },

    attachReceipt(orderId: string, filename: string): Order | undefined {
        const o = orders.find((x) => x.id === orderId);
        if (!o) return undefined;
        // In the new system, receipts are part of payments. 
        // We'll create a mock payment record.
        const paymentId = id("pay");
        o.payments.push({
            id: paymentId,
            orderId: o.id,
            amountClaimed: 0, // Unknown from just a receipt attachment in this legacy helper
            percentOfTotal: 0,
            receiptUrl: filename,
            extractedSenderName: null,
            extractedAmount: null,
            extractedDate: null,
            extractedTime: null,
            extractedBank: null,
            extractionConfidence: null,
            amountMatch: null,
            userConfirmedAccuracy: null,
            status: "pending",
            reviewNote: null,
            createdAt: new Date().toISOString(),
        });
        o.updatedAt = new Date().toISOString();
        return o;
    },
};

import type { MerchItem, Order, OrderLineInput, OrderStatus } from "./types";

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
        phone: string;
        email?: string;
        lines: OrderLineInput[];
    }): Order {
        const expanded = input.lines
            .map((l) => {
                const item = merch.find((m) => m.id === l.merchItemId && m.active);
                if (!item) return null;
                if (!item.sizes.includes(l.size)) return null;
                if (!Number.isFinite(l.qty) || l.qty <= 0) return null;
                return {
                    merchItemId: item.id,
                    merchItemName: item.name,
                    size: l.size,
                    qty: l.qty,
                    unitPriceNgn: item.basePriceNgn,
                };
            })
            .filter(Boolean) as Order["lines"];

        const totalNgn = expanded.reduce((sum, l) => sum + l.qty * l.unitPriceNgn, 0);
        const order: Order = {
            id: id("ord"),
            createdAt: new Date().toISOString(),
            status: "pending_payment",
            customerName: input.customerName,
            phone: input.phone,
            email: input.email,
            lines: expanded,
            totalNgn,
        };
        orders.unshift(order);
        return order;
    },

    listOrders(): Order[] {
        return orders;
    },

    getOrder(orderId: string): Order | undefined {
        return orders.find((o) => o.id === orderId);
    },

    setStatus(orderId: string, status: OrderStatus): Order | undefined {
        const o = orders.find((x) => x.id === orderId);
        if (!o) return undefined;
        o.status = status;
        return o;
    },

    attachReceipt(orderId: string, filename: string): Order | undefined {
        const o = orders.find((x) => x.id === orderId);
        if (!o) return undefined;
        o.receipt = { filename, uploadedAt: new Date().toISOString() };
        if (o.status === "pending_payment") o.status = "receipt_submitted";
        return o;
    },
};

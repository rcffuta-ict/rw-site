// ─── Orders Service ───────────────────────────────────────────────────────────
// Swap DEMO_MODE in src/lib/config.ts to toggle demo vs. live data.

import { DEMO_MODE } from "@/lib/config";
import { DEMO_ORDERS, getDemoOrder, getDemoOrderById } from "@/lib/data/orders";
import { MemoryStore } from "@/lib/data/memoryStore";
import type { Order, OrderStatus, Payment } from "@/lib/data/types";

export type { Order, OrderStatus, Payment };

// ─── Input types ──────────────────────────────────────────────────────────────

export interface CreateOrderInput {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNote?: string | null;
    lines: Array<{
        variantId: string;
        productId: string;
        productName: string;
        variantLabel: string;
        unitPrice: number;
        quantity: number;
    }>;
}

export interface AttachPaymentInput {
    orderId: string;
    amountClaimed: number;
    receiptUrl: string | null;
    userConfirmedAccuracy: boolean;
}

export interface OrderResult {
    success: boolean;
    order?: Order;
    error?: string;
}

// ─── Core functions ───────────────────────────────────────────────────────────

export async function listOrders(): Promise<Order[]> {
    if (DEMO_MODE) {
        return DEMO_ORDERS;
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live order list not yet implemented");
}

export async function getOrderByRef(ref: string): Promise<Order | undefined> {
    if (DEMO_MODE) {
        return getDemoOrder(ref);
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live order fetch not yet implemented");
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    if (DEMO_MODE) {
        return getDemoOrderById(id);
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live order fetch not yet implemented");
}

export async function createOrder(input: CreateOrderInput): Promise<OrderResult> {
    if (DEMO_MODE) {
        try {
            const order = MemoryStore.createOrder({
                customerName: input.customerName,
                customerEmail: input.customerEmail,
                customerPhone: input.customerPhone,
                lines: input.lines.map((l) => ({
                    merchItemId: l.productId,
                    size: l.variantLabel,
                    qty: l.quantity,
                })),
            });
            return { success: true, order };
        } catch (e) {
            return { success: false, error: String(e) };
        }
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live order creation not yet implemented");
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<Order | undefined> {
    if (DEMO_MODE) {
        return MemoryStore.setStatus(orderId, status);
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live status update not yet implemented");
}

export async function attachPayment(input: AttachPaymentInput): Promise<OrderResult> {
    if (DEMO_MODE) {
        const order = MemoryStore.attachReceipt(input.orderId, input.receiptUrl ?? "");
        if (!order) return { success: false, error: "Order not found" };
        return { success: true, order };
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live payment attach not yet implemented");
}

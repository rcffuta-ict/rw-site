// ─── Finance Service ──────────────────────────────────────────────────────────
// Reads all payments (with their parent order) for the finance module.
// Uses the service role key — admin-only.

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { mapPaymentFromDb, mapOrderFromDb } from "@/lib/supabase/mappers";
import type { Payment, Order } from "@/lib/data/types";
import { unstable_cache } from "next/cache";

// A payment enriched with its parent order context
export type PaymentWithOrder = Payment & { order: Order };

const PAYMENT_SELECT = `
    *,
    order:rw_orders (
        *,
        items:rw_order_items ( * ),
        payments:rw_payments ( * )
    )
` as const;

export async function listAllPayments(): Promise<PaymentWithOrder[]> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("rw_payments")
        .select(PAYMENT_SELECT)
        .order("created_at", { ascending: false });

    if (error) throw new Error(`Finance: failed to load payments: ${error.message}`);

    return (data ?? []).map((row) => ({
        ...mapPaymentFromDb(row),
        order: mapOrderFromDb(row.order),
    }));
}

export async function getFinanceSummary() {
    const payments = await listAllPayments();

    const collected = payments
        .filter((p) => p.status === "approved")
        .reduce((s, p) => s + (p.amountConfirmed ?? p.extractedAmount), 0);

    const pending = payments
        .filter((p) => p.status === "pending")
        .reduce((s, p) => s + p.extractedAmount, 0);

    const flagged = payments
        .filter((p) => p.status === "flagged")
        .reduce((s, p) => s + p.extractedAmount, 0);

    // unique orders across all payments
    const orderMap = new Map<string, Order>();
    payments.forEach((p) => orderMap.set(p.order.id, p.order));
    const orders = Array.from(orderMap.values());
    const totalOrdered = orders.reduce((s, o) => s + o.totalAmount, 0);

    return { collected, pending, flagged, totalOrdered, outstanding: totalOrdered - collected, payments };
}

export async function getPendingPaymentsCount(): Promise<number> {
    const supabase = await createSupabaseAdminClient();
    const { count, error } = await supabase
        .from("rw_payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

    if (error) return 0;
    return count ?? 0;
}

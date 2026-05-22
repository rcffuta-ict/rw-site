// ─── Orders Service — Supabase ────────────────────────────────────────────────

import {
    createSupabaseAdminClient,
    createSupabaseServerClient,
} from "@/lib/supabase/server";
import { mapOrderFromDb, mapPaymentFromDb } from "@/lib/supabase/mappers";
import type {
    Order,
    OrderStatus,
    Payment,
    PaymentStatus,
    OrderPaymentSummary,
    ServiceResult,
} from "@/lib/data/types";

export type { Order, OrderStatus, Payment, PaymentStatus, OrderPaymentSummary };

// ─── Shared select fragment ───────────────────────────────────────────────────

const ORDER_SELECT = `
    *,
    items:order_items ( * ),
    payments ( * )
` as const;

// ─── Input types ──────────────────────────────────────────────────────────────

export interface CreateOrderInput {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNote?: string | null;
    lines: Array<{
        variantId: string;
        productName: string;
        variantLabel: string;
        unitPrice: number;
        quantity: number;
    }>;
}

export interface AttachPaymentInput {
    orderId: string;
    extractedAmount: number;
    extractedTransactionRef?: string | null;
    extractedSenderName?: string | null;
    extractedBank?: string | null;
    extractedDate?: string | null;
    extractedTime?: string | null;
    cloudinaryReceiptPublicId?: string | null;
    receiptUrl: string | null;
    userConfirmedAccuracy: boolean;
}

export interface ReviewPaymentInput {
    paymentId: string;
    decision: Extract<PaymentStatus, "approved" | "flagged" | "rejected">;
    actorEmail: string;
    actorName: string;
    amountConfirmed?: number;
    reviewNote?: string | null;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function listOrders(): Promise<Order[]> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to load orders: ${error.message}`);
    return (data ?? []).map(mapOrderFromDb);
}

export async function getOrderByRef(ref: string): Promise<Order | undefined> {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("order_ref", ref.toUpperCase())
        .single();
    return data ? mapOrderFromDb(data) : undefined;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("id", id)
        .single();
    return data ? mapOrderFromDb(data) : undefined;
}

export async function getOrderPaymentSummary(
    orderId: string
): Promise<OrderPaymentSummary | undefined> {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from("order_payment_summary")
        .select("*")
        .eq("order_id", orderId)
        .single();

    if (!data) return undefined;

    return {
        orderId: data.order_id,
        totalAmount: data.total_amount,
        amountPaid: Number(data.amount_paid),
        amountPending: Number(data.amount_pending),
        balance: Number(data.balance),
        isFullyPaid: data.is_fully_paid,
        approvedCount: Number(data.approved_count),
        pendingCount: Number(data.pending_count),
        flaggedCount: Number(data.flagged_count),
        rejectedCount: Number(data.rejected_count),
    };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createOrder(
    input: CreateOrderInput
): Promise<ServiceResult<Order>> {
    const supabase = await createSupabaseServerClient();

    // 1. Generate a unique order ref
    const { data: refData, error: refError } = await supabase.rpc("generate_order_ref");

    if (refError || !refData) {
        return { success: false, error: "Failed to generate order reference." };
    }

    const totalAmount = input.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

    // 2. Insert the order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            order_ref: refData as string,
            customer_name: input.customerName,
            customer_email: input.customerEmail,
            customer_phone: input.customerPhone,
            customer_note: input.customerNote ?? null,
            status: "pending",
            total_amount: totalAmount,
            amount_paid: 0,
        })
        .select("id")
        .single();

    if (orderError || !order) {
        return {
            success: false,
            error: orderError?.message ?? "Failed to create order.",
        };
    }

    // 3. Insert all line items
    const { error: itemsError } = await supabase.from("order_items").insert(
        input.lines.map((l) => ({
            order_id: order.id,
            variant_id: l.variantId,
            product_name: l.productName,
            variant_label: l.variantLabel,
            quantity: l.quantity,
            unit_price: l.unitPrice,
        }))
    );

    if (itemsError) {
        return { success: false, error: itemsError.message };
    }

    // 4. Fetch the complete order
    const fullOrder = await getOrderById(order.id);
    if (!fullOrder)
        return { success: false, error: "Created but could not retrieve order." };

    return { success: true, data: fullOrder };
}

// ─── Status ───────────────────────────────────────────────────────────────────

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<ServiceResult<Order>> {
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

    if (error) return { success: false, error: error.message };

    const updated = await getOrderById(orderId);
    if (!updated) return { success: false, error: "Order not found after update." };
    return { success: true, data: updated };
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function attachPayment(
    input: AttachPaymentInput
): Promise<ServiceResult<Order>> {
    const supabase = await createSupabaseServerClient();

    // Compute percent of total
    const order = await getOrderById(input.orderId);
    if (!order) return { success: false, error: "Order not found." };

    const { error } = await supabase.from("payments").insert({
        order_id: input.orderId,
        extracted_amount: input.extractedAmount,
        extracted_transaction_ref: input.extractedTransactionRef ?? null,
        extracted_sender_name: input.extractedSenderName ?? null,
        extracted_bank: input.extractedBank ?? null,
        extracted_date: input.extractedDate ?? null,
        extracted_time: input.extractedTime ?? null,
        cloudinary_receipt_public_id: input.cloudinaryReceiptPublicId ?? null,
        receipt_url: input.receiptUrl ?? null,
        user_confirmed_accuracy: input.userConfirmedAccuracy,
        status: "pending",
    });

    if (error) return { success: false, error: error.message };

    const updated = await getOrderById(input.orderId);
    if (!updated) return { success: false, error: "Failed to retrieve updated order." };
    return { success: true, data: updated };
}

export async function reviewPayment(
    input: ReviewPaymentInput
): Promise<ServiceResult<Payment>> {
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
        .from("payments")
        .update({
            status: input.decision,
            review_note: input.reviewNote ?? null,
            amount_confirmed: input.amountConfirmed ?? null,
            moderator_name: input.actorName,
            moderator_email: input.actorEmail,
        })
        .eq("id", input.paymentId)
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: mapPaymentFromDb(data) };
}

export async function deletePaymentReceipt(paymentId: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase
        .from("payments")
        .update({
            cloudinary_receipt_public_id: null,
            receipt_url: null,
        })
        .eq("id", paymentId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

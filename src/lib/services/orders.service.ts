"use server";

// ─── Orders Service — Supabase ────────────────────────────────────────────────
import {
    createSupabaseAdminClient
} from "@/lib/supabase/server";
import { mapOrderFromDb, mapPaymentFromDb } from "@/lib/supabase/mappers";
import {
    enqueueOrderStatusEmail,
    enqueuePaymentStatusEmail,
} from "@/lib/services/email.service";
import type {
    Order,
    OrderStatus,
    Payment,
    PaymentStatus,
    OrderPaymentSummary,
    ServiceResult,
} from "@/lib/data/types";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

// ─── Shared select fragment ───────────────────────────────────────────────────

const ORDER_SELECT = `
    *,
    items:rw_order_items ( * ),
    payments:rw_payments ( * )
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
        imageUrl?: string | null;
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
        .from("rw_orders")
        .select(ORDER_SELECT)
        .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to load orders: ${error.message}`);
    return (data ?? []).map(mapOrderFromDb);
}

export async function getOrderByRef(ref: string): Promise<Order | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase
        .from("rw_orders")
        .select(ORDER_SELECT)
        .eq("order_ref", ref.toUpperCase())
        .single();
    return data ? mapOrderFromDb(data) : undefined;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase
        .from("rw_orders")
        .select(ORDER_SELECT)
        .eq("id", id)
        .single();
    return data ? mapOrderFromDb(data) : undefined;
}

export async function getOrderPaymentSummary(
    orderId: string
): Promise<OrderPaymentSummary | undefined> {
    const supabase = await createSupabaseAdminClient();
    const { data } = await supabase
        .from("rw_order_payment_summary")
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
    const supabase = await createSupabaseAdminClient();

    // 0. Validate that all variant IDs exist in the database and are valid UUIDs
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const variantIds = Array.from(new Set(input.lines.map((l) => l.variantId)));
    
    // Check UUID format
    const invalidFormatIds = variantIds.filter((id) => !UUID_REGEX.test(id));
    if (invalidFormatIds.length > 0) {
        return {
            success: false,
            error: "Some items in your cart are no longer available or are out of date. Please clear your cart and try adding them again.",
        };
    }

    // Query database for existence
    const { data: dbVariants, error: checkError } = await supabase
        .from("rw_product_variants")
        .select("id")
        .in("id", variantIds);

    if (checkError) {
        return {
            success: false,
            error: "Failed to validate products in cart. Please try again.",
        };
    }

    const foundIds = new Set((dbVariants ?? []).map((v) => v.id));
    const missingIds = variantIds.filter((id) => !foundIds.has(id));

    if (missingIds.length > 0) {
        return {
            success: false,
            error: "Some items in your cart are no longer available or are out of date. Please clear your cart and try adding them again.",
        };
    }

    // 1. Generate a unique order ref
    const { data: refData, error: refError } = await supabase.rpc("generate_order_ref");

    if (refError || !refData) {
        return { success: false, error: "Failed to generate order reference." };
    }

    const totalAmount = input.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

    // 2. Insert the order
    const { data: order, error: orderError } = await supabase
        .from("rw_orders")
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
    const { error: itemsError } = await supabase.from("rw_order_items").insert(
        input.lines.map((l) => ({
            order_id: order.id,
            variant_id: l.variantId,
            product_name: l.productName,
            variant_label: l.variantLabel,
            quantity: l.quantity,
            unit_price: l.unitPrice,
            image_url: l.imageUrl || null,
        }))
    );

    if (itemsError) {
        return { success: false, error: itemsError.message };
    }

    // 4. Fetch the complete order
    const fullOrder = await getOrderById(order.id);
    if (!fullOrder)
        return { success: false, error: "Created but could not retrieve order." };

    // 5. Queue the "order received" email (best-effort — never blocks the order).
    await enqueueOrderStatusEmail(order.id, "pending", fullOrder.customerEmail);

    revalidateTag("orders", "max");
    return { success: true, data: fullOrder };
}

// ─── Status ───────────────────────────────────────────────────────────────────

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<ServiceResult<Order>> {
    const supabase = await createSupabaseAdminClient();

    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) return { success: false, error: "Order not found." };

    if (existingOrder.status === "flagged") {
        const hdrs = await headers();
        const isAdmin = hdrs.get("x-admin-role") === "ADMIN";
        if (!isAdmin) {
            return { success: false, error: "Only administrators can restore a flagged order." };
        }
    }

    const { error } = await supabase.from("rw_orders").update({ status }).eq("id", orderId);

    if (error) return { success: false, error: error.message };

    const updated = await getOrderById(orderId);
    if (!updated) return { success: false, error: "Order not found after update." };

    // Queue the customer notification for the new order status (best-effort).
    await enqueueOrderStatusEmail(orderId, status, updated.customerEmail);

    revalidateTag("orders", "max");
    return { success: true, data: updated };
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function attachPayment(
    input: AttachPaymentInput
): Promise<ServiceResult<Order>> {
    const supabase = await createSupabaseAdminClient();

    // Compute percent of total
    const order = await getOrderById(input.orderId);
    if (!order) return { success: false, error: "Order not found." };

    const { error } = await supabase.from("rw_payments").insert({
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
    revalidateTag("orders", "max");
    return { success: true, data: updated };
}

export async function reviewPayment(
    input: ReviewPaymentInput
): Promise<ServiceResult<Payment>> {
    const supabase = await createSupabaseAdminClient();

    const { data: paymentData, error: paymentError } = await supabase
        .from("rw_payments")
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

    if (paymentError) return { success: false, error: paymentError.message };

    // Synchronize order status based on approved payments
    const order = await getOrderById(paymentData.order_id);
    if (order) {
        let newStatus: OrderStatus = order.status;
        if (["pending", "partially_paid", "paid"].includes(order.status)) {
            const approvedPayments = order.payments.map(p => 
                p.id === paymentData.id 
                    ? { ...p, status: input.decision, amountConfirmed: input.amountConfirmed ?? p.extractedAmount } 
                    : p
            ).filter(p => p.status === "approved");

            const approvedSum = approvedPayments.reduce((s, p) => 
                s + (p.amountConfirmed ?? p.extractedAmount), 
                0
            );

            if (approvedSum >= order.totalAmount) {
                newStatus = "paid";
            } else if (approvedSum > 0) {
                newStatus = "partially_paid";
            } else {
                newStatus = "pending";
            }
        }
        if (newStatus !== order.status) {
            await supabase.from("rw_orders").update({ status: newStatus }).eq("id", order.id);
            // Order moved (e.g. → paid / partially_paid): tell the customer.
            await enqueueOrderStatusEmail(order.id, newStatus, order.customerEmail);
        }
    }

    // Queue the payment review outcome notification (best-effort).
    await enqueuePaymentStatusEmail(
        paymentData.order_id,
        paymentData.id,
        input.decision,
        order?.customerEmail
    );

    revalidateTag("orders", "max");
    return { success: true, data: mapPaymentFromDb(paymentData) };
}

export async function deletePaymentReceipt(paymentId: string): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase
        .from("rw_payments")
        .update({
            cloudinary_receipt_public_id: null,
            receipt_url: null,
        })
        .eq("id", paymentId);

    if (error) return { success: false, error: error.message };
    revalidateTag("orders", "max");
    return { success: true };
}

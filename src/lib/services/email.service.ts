// lib/services/email.service.ts
// App-layer email: enqueue into rw_email_queue (durable outbox) and trigger the
// send-order-email Edge Function to drain it. Enqueuing is a fast insert, so
// admin actions return instantly while sending happens asynchronously.
//
// No pg_net / `net` dependency — the worker is pinged over HTTPS via after().

import { after } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

interface EnqueueResult {
    success: boolean;
    error?: string;
}

/** Resolve the DB template key a status maps to. */
function templateKeyFor(eventType: string, newStatus: string): string {
    return eventType === "payment_status" ? `payment_${newStatus}` : newStatus;
}

/**
 * Ping the worker to drain the queue, without blocking the response. Uses
 * after() so the request returns immediately and the fetch still completes.
 */
export function triggerEmailDrain(): void {
    const run = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!baseUrl || !serviceKey) return;
        try {
            await fetch(`${baseUrl}/functions/v1/send-order-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${serviceKey}`,
                },
                body: JSON.stringify({ drain: true }),
            });
        } catch (err) {
            console.error("Email drain trigger failed:", err);
        }
    };

    try {
        after(run);
    } catch {
        // Outside a request scope — best-effort fire without awaiting.
        void run();
    }
}

async function enqueue(row: Record<string, unknown>): Promise<EnqueueResult> {
    try {
        const supabase = await createSupabaseAdminClient();
        const { error } = await supabase.from("rw_email_queue").insert(row);
        if (error) {
            console.error("Email enqueue failed:", error.message);
            return { success: false, error: error.message };
        }
        triggerEmailDrain();
        return { success: true };
    } catch (err) {
        console.error("Email enqueue threw:", err);
        return { success: false, error: (err as Error).message };
    }
}

/** Queue the automatic email for an order status change. */
export async function enqueueOrderStatusEmail(
    orderId: string,
    newStatus: string,
    recipientEmail?: string
): Promise<EnqueueResult> {
    return enqueue({
        mode: "status",
        event_type: "order_status",
        order_id: orderId,
        new_status: newStatus,
        template_key: templateKeyFor("order_status", newStatus),
        recipient_email: recipientEmail ?? null,
    });
}

/** Queue the automatic email for a payment status change. */
export async function enqueuePaymentStatusEmail(
    orderId: string,
    paymentId: string,
    newStatus: string,
    recipientEmail?: string
): Promise<EnqueueResult> {
    return enqueue({
        mode: "status",
        event_type: "payment_status",
        order_id: orderId,
        payment_id: paymentId,
        new_status: newStatus,
        template_key: templateKeyFor("payment_status", newStatus),
        recipient_email: recipientEmail ?? null,
    });
}

/** Queue a one-off custom message to an order's customer. */
export async function enqueueCustomEmail(input: {
    orderId: string;
    recipientEmail?: string;
    subject: string;
    bodyHtml: string;
}): Promise<EnqueueResult> {
    return enqueue({
        mode: "custom",
        order_id: input.orderId,
        recipient_email: input.recipientEmail ?? null,
        subject: input.subject,
        body_html: input.bodyHtml,
    });
}

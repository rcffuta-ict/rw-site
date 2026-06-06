"use server";

import {
    updateEmailTemplate,
    type EmailTemplate,
} from "@/lib/services/email-templates.service";
import { enqueueCustomEmail } from "@/lib/services/email.service";
import { requeueEmail } from "@/lib/services/email-queue.service";
import { getOrderById } from "@/lib/services/orders.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Resolve the signed-in admin's email for the `updated_by` audit column. */
async function getAdminEmail(): Promise<string | null> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user.email ?? null;
}

/**
 * Persist edits to a single email template. The admin identity is resolved
 * server-side (never trusted from the client).
 */
export async function saveEmailTemplateAction(
    id: string,
    patch: Partial<Pick<EmailTemplate, "subject" | "body_html" | "is_active" | "label">>
) {
    try {
        const adminEmail = await getAdminEmail();
        return await updateEmailTemplate(id, patch, adminEmail ?? undefined);
    } catch (e) {
        return { success: false as const, error: (e as Error).message };
    }
}

/**
 * Send a one-off custom message to an order's customer from the admin area.
 */
export async function sendCustomEmailAction(input: {
    orderId: string;
    subject: string;
    bodyHtml: string;
}) {
    try {
        await getAdminEmail(); // authorize: admin session required
        const subject = input.subject?.trim();
        const bodyHtml = input.bodyHtml?.trim();
        if (!input.orderId) return { success: false as const, error: "Pick a customer to message." };
        if (!subject) return { success: false as const, error: "Add a subject line." };
        if (!bodyHtml) return { success: false as const, error: "Write a message first." };

        // Resolve the recipient up front so it shows in the Delivery tab.
        const order = await getOrderById(input.orderId);
        if (!order) return { success: false as const, error: "Order not found." };

        const res = await enqueueCustomEmail({
            orderId: input.orderId,
            recipientEmail: order.customerEmail,
            subject,
            bodyHtml,
        });
        if (!res.success) {
            return { success: false as const, error: res.error ?? "Failed to queue message." };
        }
        return { success: true as const };
    } catch (e) {
        return { success: false as const, error: (e as Error).message };
    }
}

/** Retry a failed (or stuck) email from the Delivery tab. */
export async function retryEmailAction(queueId: string) {
    try {
        await getAdminEmail(); // authorize
        if (!queueId) return { success: false as const, error: "Missing email id." };
        const res = await requeueEmail(queueId);
        if (!res.success) {
            return { success: false as const, error: res.error ?? "Failed to retry." };
        }
        return { success: true as const };
    } catch (e) {
        return { success: false as const, error: (e as Error).message };
    }
}

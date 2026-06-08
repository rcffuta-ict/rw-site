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
 * Send a one-off custom message to one or more orders' customers from the admin
 * area. Orders that share an email address are combined into a single send.
 */
export async function sendCustomEmailAction(input: {
    orderIds: string[];
    subject: string;
    bodyHtml: string;
}) {
    try {
        await getAdminEmail(); // authorize: admin session required
        const subject = input.subject?.trim();
        const bodyHtml = input.bodyHtml?.trim();
        const orderIds = Array.from(new Set(input.orderIds ?? [])).filter(Boolean);
        if (orderIds.length === 0)
            return { success: false as const, error: "Pick a customer to message." };
        if (!subject) return { success: false as const, error: "Add a subject line." };
        if (!bodyHtml) return { success: false as const, error: "Write a message first." };

        // Resolve every order up front, then group by recipient email so a
        // customer with several selected orders gets one combined email.
        const orders = await Promise.all(orderIds.map((id) => getOrderById(id)));
        const groups = new Map<string, { email: string; ids: string[] }>();
        for (const order of orders) {
            if (!order) continue;
            const key = order.customerEmail.trim().toLowerCase();
            if (!key) continue;
            const group = groups.get(key);
            if (group) group.ids.push(order.id);
            else groups.set(key, { email: order.customerEmail, ids: [order.id] });
        }

        if (groups.size === 0)
            return { success: false as const, error: "No valid recipients found." };

        const results = await Promise.all(
            Array.from(groups.values()).map((group) =>
                enqueueCustomEmail({
                    orderId: group.ids[0],
                    orderIds: group.ids,
                    recipientEmail: group.email,
                    subject,
                    bodyHtml,
                })
            )
        );

        const failed = results.find((r) => !r.success);
        if (failed) {
            return { success: false as const, error: failed.error ?? "Failed to queue message." };
        }
        return { success: true as const, sent: groups.size };
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

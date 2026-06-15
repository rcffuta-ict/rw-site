"use server";

import {
    updateEmailTemplate,
    getEmailTemplate,
    type EmailTemplate,
} from "@/lib/services/email-templates.service";
import { enqueueCustomEmail } from "@/lib/services/email.service";
import { requeueEmail } from "@/lib/services/email-queue.service";
import { getOrderById, recordFollowUps } from "@/lib/services/orders.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
    FOLLOW_UP_TEMPLATE_KEY,
    DEFAULT_SUBJECTS,
    DEFAULT_BODIES,
} from "@/app/(admin)/admin/(authenticated)/email-templates/constants";

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
 * Group the SELECTED orders by recipient email, then enqueue one custom email
 * per email. Orders the admin selected that share an address are combined into
 * a single send (the worker merges their variables — refs side by side, an
 * item table per order) instead of mailing the same person twice. Only the
 * explicitly selected orders are included — we never pull in other orders.
 */
async function enqueueGroupedCustom(
    orderIds: string[],
    subject: string,
    bodyHtml: string
): Promise<
    | { success: true; sent: number; sentOrderIds: string[] }
    | { success: false; error: string }
> {
    const ids = Array.from(new Set(orderIds)).filter(Boolean);
    if (ids.length === 0) return { success: false, error: "Pick a customer to message." };

    const orders = (await Promise.all(ids.map((id) => getOrderById(id)))).filter(
        (o): o is NonNullable<typeof o> => Boolean(o)
    );

    // One group per recipient email, holding every selected order for it.
    const groups = new Map<string, { email: string; ids: string[] }>();
    for (const order of orders) {
        const key = order.customerEmail.trim().toLowerCase();
        if (!key) continue;
        const group = groups.get(key);
        if (group) group.ids.push(order.id);
        else groups.set(key, { email: order.customerEmail, ids: [order.id] });
    }
    if (groups.size === 0) return { success: false, error: "No valid recipients found." };

    const groupArr = Array.from(groups.values());
    const results = await Promise.all(
        groupArr.map((group) =>
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
    if (failed) return { success: false, error: failed.error ?? "Failed to queue message." };

    const sentOrderIds = groupArr.flatMap((g) => g.ids);
    return { success: true, sent: groupArr.length, sentOrderIds };
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
        if (!subject) return { success: false as const, error: "Add a subject line." };
        if (!bodyHtml) return { success: false as const, error: "Write a message first." };

        const res = await enqueueGroupedCustom(input.orderIds ?? [], subject, bodyHtml);
        if (!res.success) return { success: false as const, error: res.error };
        return { success: true as const, sent: res.sent };
    } catch (e) {
        return { success: false as const, error: (e as Error).message };
    }
}

/**
 * Send the follow-up reminder to one or more stale orders. Uses the editable
 * "follow_up" template (falling back to the bundled default), combines orders
 * that share an email, and records the follow-up against each order so the
 * Follow-up tab can show how many reminders have gone out.
 */
export async function sendFollowUpAction(input: { orderIds: string[] }) {
    try {
        await getAdminEmail(); // authorize: admin session required

        // Prefer the admin-edited template; fall back to the bundled default.
        const tpl = await getEmailTemplate(FOLLOW_UP_TEMPLATE_KEY);
        const row = tpl.success ? tpl.data : undefined;
        const subject = (
            row?.subject ?? DEFAULT_SUBJECTS[FOLLOW_UP_TEMPLATE_KEY]
        )?.trim();
        const bodyHtml = (
            row?.body_html ?? DEFAULT_BODIES[FOLLOW_UP_TEMPLATE_KEY]
        )?.trim();
        if (!subject || !bodyHtml)
            return { success: false as const, error: "Follow-up template is empty." };

        const res = await enqueueGroupedCustom(input.orderIds ?? [], subject, bodyHtml);
        if (!res.success) return { success: false as const, error: res.error };

        await recordFollowUps(res.sentOrderIds);
        return { success: true as const, sent: res.sent };
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

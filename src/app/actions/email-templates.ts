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
 * Resolve the selected orders, collapse them to distinct recipient emails, then
 * for each email gather EVERY order placed under that email and combine them
 * into a single send (the worker renders the message once, then a details block
 * per order — so a customer with two orders gets both item tables). Returns the
 * distinct recipient count and the order ids actually included.
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

    // Distinct recipient emails across the selected orders.
    const selected = (await Promise.all(ids.map((id) => getOrderById(id)))).filter(
        (o): o is NonNullable<typeof o> => Boolean(o)
    );
    const emails = new Map<string, string>(); // lowercased key → original casing
    for (const order of selected) {
        const key = order.customerEmail.trim().toLowerCase();
        if (key && !emails.has(key)) emails.set(key, order.customerEmail);
    }
    if (emails.size === 0) return { success: false, error: "No valid recipients found." };

    // Expand each email to ALL of that customer's orders, so every order
    // connected to the address is included in the one email.
    const groups = await Promise.all(
        Array.from(emails.values()).map(async (email) => {
            const all = await getOrdersByEmail(email);
            const allIds = all.map((o) => o.id);
            // Fall back to the originally-selected order(s) if the lookup is empty.
            const groupIds =
                allIds.length > 0
                    ? allIds
                    : selected
                          .filter(
                              (o) =>
                                  o.customerEmail.trim().toLowerCase() ===
                                  email.trim().toLowerCase()
                          )
                          .map((o) => o.id);
            return { email, ids: groupIds };
        })
    );

    const results = await Promise.all(
        groups.map((group) =>
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

    const sentOrderIds = groups.flatMap((g) => g.ids);
    return { success: true, sent: groups.length, sentOrderIds };
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

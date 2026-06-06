// lib/services/email-queue.service.ts
// Read + retry access to the email outbox (rw_email_queue) for the admin
// Delivery tab.

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { triggerEmailDrain } from "@/lib/services/email.service";
import type { ServiceResult } from "@/lib/data/types";

export interface EmailQueueRow {
    id: string;
    created_at: string;
    mode: "status" | "custom";
    event_type: string | null;
    order_id: string | null;
    new_status: string | null;
    template_key: string | null;
    recipient_email: string | null;
    subject: string | null;
    status: "pending" | "sending" | "sent" | "failed";
    attempts: number;
    last_error: string | null;
    sent_at: string | null;
}

const COLUMNS =
    "id, created_at, mode, event_type, order_id, new_status, template_key, recipient_email, subject, status, attempts, last_error, sent_at";

/** Recent outbox rows, newest first — for the Delivery tab. */
export async function getRecentEmailQueue(
    limit = 50
): Promise<ServiceResult<EmailQueueRow[]>> {
    try {
        const supabase = await createSupabaseAdminClient();
        const { data, error } = await supabase
            .from("rw_email_queue")
            .select(COLUMNS)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) return { success: false, error: error.message };
        return { success: true, data: (data ?? []) as EmailQueueRow[] };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

/** Re-queue a failed (or stuck) email and nudge the worker to drain it. */
export async function requeueEmail(id: string): Promise<ServiceResult> {
    try {
        const supabase = await createSupabaseAdminClient();
        const { error } = await supabase
            .from("rw_email_queue")
            .update({ status: "pending", attempts: 0, last_error: null })
            .eq("id", id);

        if (error) return { success: false, error: error.message };
        triggerEmailDrain();
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

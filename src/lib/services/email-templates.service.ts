// lib/services/email-templates.service.ts
"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { ServiceResult } from "@/lib/data/types";

/**
 * Email template data structure
 */
export interface EmailTemplate {
    id: string;
    template_key: string;
    label: string;
    subject: string;
    body_html: string;
    is_active: boolean;
    updated_at: string;
    updated_by: string | null;
}

/**
 * Email log entry (read-only)
 */
export interface EmailLog {
    id: string;
    order_id: string | null;
    payment_id: string | null;
    template_key: string;
    recipient_email: string;
    subject: string | null;
    success: boolean;
    error_message: string | null;
    sent_at: string;
}

/**
 * Fetch all email templates, optionally filtered
 */
export async function getEmailTemplates(options?: {
    only_active?: boolean;
}): Promise<ServiceResult<EmailTemplate[]>> {
    try {
        const supabase = createSupabaseAdminClient();

        let query = supabase.from("rw_email_templates").select("*");

        if (options?.only_active) {
            query = query.eq("is_active", true);
        }

        const { data, error } = await query.order("template_key");

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Fetch a single template by key or ID
 */
export async function getEmailTemplate(
    idOrKey: string
): Promise<ServiceResult<EmailTemplate>> {
    try {
        const supabase = createSupabaseAdminClient();

        // Try by template_key first, then by id
        let { data, error } = await supabase
            .from("rw_email_templates")
            .select("*")
            .eq("template_key", idOrKey)
            .single();

        if (error && error.code === "PGRST116") {
            // Not found by key, try by id
            const result = await supabase
                .from("rw_email_templates")
                .select("*")
                .eq("id", idOrKey)
                .single();

            data = result.data;
            error = result.error;
        }

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data as EmailTemplate };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(
    id: string,
    patch: Partial<Pick<EmailTemplate, "subject" | "body_html" | "is_active" | "label">>,
    adminEmail?: string
): Promise<ServiceResult<EmailTemplate>> {
    try {
        const supabase = createSupabaseAdminClient();

        const updatePayload: any = { ...patch };
        if (adminEmail) {
            updatePayload.updated_by = adminEmail;
        }

        const { data, error } = await supabase
            .from("rw_email_templates")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data as EmailTemplate };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Get email send logs for an order
 */
export async function getEmailLogsForOrder(
    orderId: string
): Promise<ServiceResult<EmailLog[]>> {
    try {
        const supabase = createSupabaseAdminClient();

        const { data, error } = await supabase
            .from("rw_email_logs")
            .select("*")
            .eq("order_id", orderId)
            .order("sent_at", { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Get recent email logs (for admin dashboard)
 */
export async function getRecentEmailLogs(
    limit: number = 50
): Promise<ServiceResult<EmailLog[]>> {
    try {
        const supabase = createSupabaseAdminClient();

        const { data, error } = await supabase
            .from("rw_email_logs")
            .select("*")
            .order("sent_at", { ascending: false })
            .limit(limit);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Get email stats (success rate, failures, etc.)
 */
export async function getEmailStats(since?: Date): Promise<
    ServiceResult<{
        total_sent: number;
        successful: number;
        failed: number;
        success_rate: number;
    }>
> {
    try {
        const supabase = createSupabaseAdminClient();

        let query = supabase.from("rw_email_logs").select("success", { count: "exact" });

        if (since) {
            query = query.gte("sent_at", since.toISOString());
        }

        const { data, count, error } = await query;

        if (error) {
            return { success: false, error: error.message };
        }

        const total = count || 0;
        const successful = data?.filter((d: any) => d.success).length || 0;
        const failed = total - successful;
        const successRate = total > 0 ? (successful / total) * 100 : 0;

        return {
            success: true,
            data: {
                total_sent: total,
                successful,
                failed,
                success_rate: Math.round(successRate * 100) / 100,
            },
        };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

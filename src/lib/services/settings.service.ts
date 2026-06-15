/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath } from "next/cache";
import type { ServiceResult } from "@/lib/data/types";

export interface GlobalSettings {
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    payment_min_amount: number;
    payment_installment_allowed: boolean;
    /** Master switch for the storefront. When false, no one can browse products,
     * checkout, or place orders. */
    preorders_enabled: boolean;
    /** Master switch for payment submission on /fulfil. When false, orders can
     * still be looked up but no part/full payment can be submitted. */
    payments_enabled: boolean;
}

export interface AdminModerator {
    id: string;
    profile_id: string;
    role: "ADMIN" | "MODERATOR";
    added_by: string;
    created_at: string;
    profiles?: {
        email: string;
        first_name: string;
        last_name: string;
    };
}

export async function getSettings(): Promise<GlobalSettings> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("rw_settings")
        .select("*")
        .eq("id", 1)
        .single();

    if (error || !data) {
        // Fallback defaults
        return {
            bank_name: "",
            bank_account_name: "",
            bank_account_number: "",
            payment_min_amount: 0,
            payment_installment_allowed: false,
            preorders_enabled: true,
            payments_enabled: true,
        };
    }
    return data;
}

export async function updateSettings(
    patch: Partial<GlobalSettings>,
    adminProfileId: string
): Promise<ServiceResult<GlobalSettings>> {
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
        .from("rw_settings")
        .update({ ...patch, updated_by: adminProfileId })
        .eq("id", 1)
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    await supabase.from("rw_audit_logs").insert({
        profile_id: adminProfileId,
        action: "UPDATE_SETTINGS",
        entity_type: "SETTINGS",
        entity_id: "1",
        details: patch,
    });

    revalidateTag("settings", "max");
    // The pre-orders / payments master switches gate these public pages, so
    // purge them to reflect the change immediately.
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/checkout");
    revalidatePath("/fulfil");
    return { success: true, data };
}

export async function getModerators(): Promise<AdminModerator[]> {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("rw_admin_moderators")
        .select("*, profiles!profile_id(email, first_name, last_name)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as any as AdminModerator[];
}

export async function addModeratorByEmail(
    email: string,
    adminProfileId: string
): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

    if (!profile) {
        return { success: false, error: "No user found with that email." };
    }

    const { error } = await supabase.from("rw_admin_moderators").insert({
        profile_id: profile.id,
        role: "MODERATOR",
        added_by: adminProfileId,
    });

    if (error) {
        if (error.code === "23505")
            return { success: false, error: "User is already an admin/moderator." };
        return { success: false, error: error.message };
    }

    await supabase.from("rw_audit_logs").insert({
        profile_id: adminProfileId,
        action: "ADD_MODERATOR",
        entity_type: "MODERATOR",
        entity_id: profile.id,
        details: { email },
    });

    revalidateTag("moderators", "max");
    return { success: true };
}

export async function removeModerator(
    id: string,
    adminProfileId: string
): Promise<ServiceResult> {
    const supabase = await createSupabaseAdminClient();

    const { data: existing } = await supabase
        .from("rw_admin_moderators")
        .select("role, profile_id")
        .eq("id", id)
        .single();
    if (!existing) return { success: false, error: "Not found" };
    if (existing.role === "ADMIN")
        return { success: false, error: "Cannot remove an ADMIN from this interface." };

    const { error } = await supabase.from("rw_admin_moderators").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await supabase.from("rw_audit_logs").insert({
        profile_id: adminProfileId,
        action: "REMOVE_MODERATOR",
        entity_type: "MODERATOR",
        entity_id: existing.profile_id,
        details: {},
    });

    revalidateTag("moderators", "max");
    return { success: true };
}

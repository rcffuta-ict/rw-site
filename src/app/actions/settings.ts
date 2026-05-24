/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
    updateSettings,
    addModeratorByEmail,
    removeModerator,
} from "@/lib/services/settings.service";
import type { GlobalSettings } from "@/lib/services/settings.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getAdminProfileId() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user.id;
}

export async function saveSettingsAction(patch: Partial<GlobalSettings>) {
    try {
        const profileId = await getAdminProfileId();
        return await updateSettings(patch, profileId);
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function addModeratorAction(email: string) {
    try {
        const profileId = await getAdminProfileId();
        return await addModeratorByEmail(email, profileId);
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function removeModeratorAction(id: string) {
    try {
        const profileId = await getAdminProfileId();
        return await removeModerator(id, profileId);
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

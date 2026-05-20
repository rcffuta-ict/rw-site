import { getIctAdminClient } from "@/lib/ict";

export type AdminRole = "ADMIN" | "MODERATOR" | null;

/**
 * Resolves the admin role of a user by looking them up in rw_admin_moderators.
 *
 * Returns:
 *  - "ADMIN"     — user has ADMIN role in rw_admin_moderators
 *  - "MODERATOR" — user has MODERATOR role in rw_admin_moderators
 *  - null        — user is not in the table (no admin access)
 */
export async function resolveAdminRole(userId: string): Promise<AdminRole> {
    const client = getIctAdminClient();

    const { data, error } = await client.supabase
        .from("rw_admin_moderators")
        .select("role")
        .eq("profile_id", userId)
        .maybeSingle();

    if (error || !data) return null;

    return data.role as AdminRole;
}

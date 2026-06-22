import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveAdminRole } from "@/lib/auth/roles";
import { getIctAdminClient } from "@/lib/ict";

/**
 * GET /api/admin/me
 *
 * Returns the current admin user's id, email, and role.
 * Used by AdminAuthContext to hydrate client-side auth state.
 *
 * Responses:
 *  200 { userId, email, role, name }
 *  401 { error: "Unauthorized" }
 */
export async function GET() {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await resolveAdminRole(user.id);

    if (!role) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query profiles using service role client
    const adminClient = getIctAdminClient();
    const { data: profile } = await adminClient.supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : null;

    return NextResponse.json({
        userId: user.id,
        email: user.email,
        role,
        name: fullName,
        avatarUrl: profile?.avatar_url ?? null,
    });
}

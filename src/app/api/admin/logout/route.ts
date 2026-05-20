import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/logout
 *
 * Signs the current user out of Supabase and returns 200.
 * The client (AdminAuthContext.signOut) handles the redirect to /admin/login.
 */
export async function POST() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
}

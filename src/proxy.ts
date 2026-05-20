import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";

/**
 * Proxy (auth guard) for all /admin/* routes.
 *
 * Rules:
 *  1. /admin/login is always accessible (no session required)
 *  2. All other /admin/* routes require a valid Supabase session
 *  3. The session user must exist in rw_admin_moderators — otherwise rejected
 *  4. Approved requests receive an x-admin-role header for downstream use
 *
 * NOTE: This file uses proxy.ts conventions (renamed from middleware.ts in
 * this version of Next.js). The export must be named `proxy`.
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always allow the login page through
    if (pathname === "/admin/login") {
        return NextResponse.next({ request });
    }

    // Create SSR-aware client (reads/writes session cookies)
    const { supabase, response } = createProxySupabaseClient(request);

    // Verify session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check rw_admin_moderators directly (ict-lib not SSR-aware, can't use here)
    const { data: mod, error } = await supabase
        .from("rw_admin_moderators")
        .select("role")
        .eq("profile_id", user.id)
        .maybeSingle();

    if (error || !mod) {
        // Valid Supabase user but not an admin/moderator — sign out and reject
        await supabase.auth.signOut();
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
    }

    // Attach role to response headers for downstream Server Components to read
    response.headers.set("x-admin-role", mod.role);
    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Build enriched request headers that all downstream Server Components can read
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-current-path", request.nextUrl.pathname);

    // 1. Always allow the login page through immediately (no auth check needed)
    if (pathname === "/admin/login") {
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // 2. Create SSR-aware client (reads/writes session cookies)
    const { supabase } = createProxySupabaseClient(request);

    // 3. Verify session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Check rw_admin_moderators for an admin/moderator role
    const { data: mod, error } = await supabase
        .from("rw_admin_moderators")
        .select("role")
        .eq("profile_id", user.id)
        .maybeSingle();

    if (error || !mod) {
        // Valid Supabase session but no admin permissions — sign out and reject
        await supabase.auth.signOut();
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
    }

    // 5. Forward the role on the REQUEST headers so that Server Component
    //    layouts can read it via next/headers (which reads request headers,
    //    NOT response headers).
    requestHeaders.set("x-admin-role", mod.role);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    // Only intercept admin paths; skip internal Next.js files, static assets, etc.
    matcher: ["/admin/:path*"],
};

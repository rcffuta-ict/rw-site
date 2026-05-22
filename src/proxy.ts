import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Always allow the login page through immediately
    if (pathname === "/admin/login") {
        return NextResponse.next();
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

    // 4. Check rw_admin_moderators directly
    const { data: mod, error } = await supabase
        .from("rw_admin_moderators")
        .select("role")
        .eq("profile_id", user.id)
        .maybeSingle();

    if (error || !mod) {
        // Clear cookies and reject if not a real administrator
        await supabase.auth.signOut();
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
    }

    // 5. CRITICAL CRUX FIX: Clone the base request and pass the auth cookies
    // down into the request context, combined with your custom layout headers.
    const finalResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Mirror the security context cookies into the request headers context
    // so downstream Server layouts can read the active auth cookies instantly!
    request.cookies.getAll().forEach((cookie) => {
        finalResponse.cookies.set(cookie.name, cookie.value);
    });

    finalResponse.headers.set("x-admin-role", mod.role);

    return finalResponse;
}

export const config = {
    // Make sure we skip internal files, static styles, images, and only match admin paths
    matcher: ["/admin/:path*"],
};

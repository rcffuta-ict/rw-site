import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";
import { resolveAdminRole } from "./lib/auth/roles";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Always allow the login page through — no auth check needed
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // 2. Create SSR-aware Supabase client.
    //    The returned `response` carries any refreshed session cookies — we MUST
    //    use it as the base for our final response so those cookies reach the browser.
    const { supabase, response } = createProxySupabaseClient(request);

    // 3. Verify session (may refresh the access token internally)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Verify the user has an admin/moderator role
    const mod = await resolveAdminRole(user.id);

    if (!mod) {
        await supabase.auth.signOut();
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
    }

    // 5. Pass through — the `response` already has refreshed cookies baked in.
    //    The proxy is the single gatekeeper; layouts trust it completely.
    return response;
}

export const config = {
    // Match /admin and all sub-paths; skip _next internals and static assets
    matcher: ["/admin", "/admin/:path*"],
};

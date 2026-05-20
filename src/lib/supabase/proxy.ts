import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Creates an SSR-aware Supabase client scoped to the proxy.ts request/response
 * cycle. Reads cookies from the incoming NextRequest and writes refreshed
 * session cookies back to the NextResponse.
 *
 * Use ONLY inside src/proxy.ts.
 */
export function createProxySupabaseClient(request: NextRequest) {
    const response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet, headers) {
                    // Write refreshed session cookies to the response
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                    // Apply cache-busting headers required by Supabase SSR
                    Object.entries(headers ?? {}).forEach(([key, value]) =>
                        response.headers.set(key, value)
                    );
                },
            },
        }
    );

    return { supabase, response };
}

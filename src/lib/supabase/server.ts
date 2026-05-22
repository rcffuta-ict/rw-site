import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * SSR-aware Supabase client for Server Components and Route Handlers.
 * Uses the anon key + session cookies. Respects RLS.
 * Call once per request — do NOT share across requests.
 */
export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // setAll can throw in Server Components (read-only context).
                        // The proxy.ts middleware handles session refreshes — this is safe.
                    }
                },
            },
        }
    );
}

/**
 * Supabase admin client — uses Service Role key (bypasses RLS entirely).
 * Use ONLY in Server Actions and API Route Handlers — never expose to browser.
 *
 * Required for:
 *   - Admin product/category CRUD
 *   - Payment moderation (status updates)
 *   - Reading all orders regardless of customer auth
 */
export async function createSupabaseAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing Supabase admin credentials. " +
                "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
        );
    }

    return createClient(url, key, {
        auth: {
            // Service role must NOT auto-refresh or persist sessions
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

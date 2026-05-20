import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates an SSR-aware Supabase client for Server Components and Route Handlers.
 * Reads and writes session cookies via Next.js `cookies()`.
 *
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

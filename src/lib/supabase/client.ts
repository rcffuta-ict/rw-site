import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client for use in Client Components.
 * Handles auth state via cookies that are shared with the server.
 *
 * Safe to call multiple times — Supabase deduplicates under the hood.
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

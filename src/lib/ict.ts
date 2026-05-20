import { RcfIctClient } from "@rcffuta/ict-lib/server";

let _adminClient: RcfIctClient | null = null;

/**
 * Returns a singleton RcfIctClient using the Supabase service role key.
 * Safe for use in Server Components, Route Handlers, and Server Actions.
 *
 * Uses the service role key — bypasses RLS. Never expose to the browser.
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 */
export function getIctAdminClient(): RcfIctClient {
    if (!_adminClient) {
        _adminClient = new RcfIctClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }
    return _adminClient;
}

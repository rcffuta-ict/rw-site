"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveAdminRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type LoginState = {
    error?: string;
} | null;

/**
 * Server Action — handles admin login form submission.
 *
 * 1. Signs in with Supabase email + password
 * 2. Checks if the user has an ADMIN or MODERATOR role
 * 3. Redirects to /admin (or the `next` query param) on success
 * 4. Returns an error string on failure
 */
export async function adminLogin(
    _prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const next = (formData.get("next") as string) || "/admin";

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return { error: "Invalid credentials. Please try again." };
    }

    // Verify the user has admin access
    const role = await resolveAdminRole(data.user.id);

    if (!role) {
        // Sign them back out immediately — they have a valid Supabase account
        // but no admin permissions
        await supabase.auth.signOut();
        return {
            error: "You do not have permission to access the admin panel.",
        };
    }

    revalidatePath("/admin", "layout");

    // Successful login — redirect to admin dashboard (or original destination)
    redirect(next);
}

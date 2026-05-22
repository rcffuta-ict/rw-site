"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { adminLogin, type LoginState } from "@/app/actions/adminLogin";
import { AdminLogo } from "@/components/admin/AdminLogo";
import Link from "next/link";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/forms/Button";

// ─── Inner form — uses useSearchParams, must be inside <Suspense> ─────────────

function LoginForm() {
    const searchParams = useSearchParams();
    const next     = searchParams.get("next") || "/admin";
    const urlError = searchParams.get("error");

    const [state, formAction, isPending] = useActionState<LoginState, FormData>(
        adminLogin,
        null
    );

    const errorMessage =
        state?.error ||
        (urlError === "unauthorized"
            ? "You are not authorized to access the admin panel."
            : null);

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {/* Pass `next` redirect target through the form */}
            <input type="hidden" name="next" value={next} />

            <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                placeholder="you@rcffuta.com"
                required
            />

            <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
            />

            {errorMessage && (
                <p className="text-sm text-rw-crimson bg-rw-crimson/5 border border-rw-crimson/20 rounded-xl px-4 py-3">
                    {errorMessage}
                </p>
            )}

            <Button
                type="submit"
                disabled={isPending}
                loading={isPending}
                className="w-full !h-12 mt-2"
            >
                {isPending ? "Signing in…" : "Sign in"}
            </Button>
        </form>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-rw-bg-alt px-4">
            <div className="w-full max-w-sm">
                <AdminLogo variant="login" />

                {/* Card */}
                <div className="rw-card p-8">
                    <h1 className="section-heading text-xl text-rw-ink mb-1">Sign in</h1>
                    <p className="text-sm text-rw-muted mb-8">
                        Admin &amp; Moderator access only
                    </p>

                    {/* Suspense required by Next.js for useSearchParams in Client Components */}
                    <Suspense fallback={
                        <div className="flex flex-col gap-5 animate-pulse">
                            <div className="h-10 bg-rw-bg-alt rounded-xl" />
                            <div className="h-10 bg-rw-bg-alt rounded-xl" />
                            <div className="h-12 bg-rw-bg-alt rounded-xl mt-2" />
                        </div>
                    }>
                        <LoginForm />
                    </Suspense>
                </div>

                <p className="mt-8 text-center text-xs text-rw-muted">
                    <Link href="/" className="hover:text-rw-crimson transition-colors">
                        ← Back to public site
                    </Link>
                </p>
            </div>
        </div>
    );
}

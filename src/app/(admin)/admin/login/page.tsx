"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        setTimeout(() => {
            // Demo credentials
            if (email === "admin@rcffuta.com" && password === "rw26admin") {
                router.push("/admin");
            } else {
                setError("Invalid credentials. Try admin@rcffuta.com / rw26admin");
                setLoading(false);
            }
        }, 800);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col items-center gap-3 mb-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fire-gradient shadow-lg">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" />
                        </svg>
                    </span>
                    <div className="text-center">
                        <p className="font-display font-bold text-xl text-rw-ink">RW&apos;26 Admin</p>
                        <p className="text-sm text-rw-muted">Redemption Week · RCF FUTA</p>
                    </div>
                </div>

                {/* Card */}
                <div className="rw-card p-8">
                    <h1 className="section-heading text-xl text-rw-ink mb-1">Sign in</h1>
                    <p className="text-sm text-rw-muted mb-6">Admin access only</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold text-rw-text-2 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@rcffuta.com"
                                required
                                className="w-full rounded-xl border border-[var(--rw-border-mid)] bg-rw-bg-alt px-4 py-3 text-sm text-rw-ink placeholder:text-rw-muted focus:outline-none focus:border-rw-crimson focus:ring-2 focus:ring-rw-crimson/10 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-xs font-semibold text-rw-text-2 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-[var(--rw-border-mid)] bg-rw-bg-alt px-4 py-3 text-sm text-rw-ink placeholder:text-rw-muted focus:outline-none focus:border-rw-crimson focus:ring-2 focus:ring-rw-crimson/10 transition-all"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-rw-crimson bg-rw-crimson/5 border border-rw-crimson/20 rounded-xl px-4 py-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-fire-gradient px-4 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-60 transition-all"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-rw-muted">
                        Demo build — credentials shown in hint above
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-rw-muted">
                    <a href="/" className="hover:text-rw-crimson transition-colors">← Back to public site</a>
                </p>
            </div>
        </div>
    );
}

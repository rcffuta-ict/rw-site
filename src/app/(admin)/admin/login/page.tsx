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
            if (email === "admin@rcffuta.com" && password === "rw26admin") {
                router.push("/admin");
            } else {
                setError("Invalid credentials. Try admin@rcffuta.com / rw26admin");
                setLoading(false);
            }
        }, 800);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-rw-bg-alt px-4">
            <div className="w-full max-w-sm">
                {/* Logo area */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rw-crimson shadow-lg">
                        <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" /></svg>
                    </span>
                    <div className="text-center">
                        <p className="font-display font-bold text-2xl text-rw-ink">RW&apos;26 Admin</p>
                        <p className="text-sm text-rw-muted mt-1">Redemption Week · RCF FUTA</p>
                    </div>
                </div>

                {/* Card */}
                <div className="rw-card p-8">
                    <h1 className="section-heading text-xl text-rw-ink mb-1">Sign in</h1>
                    <p className="text-sm text-rw-muted mb-8">Admin access only</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-rw-ink mb-2">Email</label>
                            <input id="email" type="email" autoComplete="email"
                                value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="admin@rcffuta.com" required
                                className="rw-input"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-rw-ink mb-2">Password</label>
                            <input id="password" type="password" autoComplete="current-password"
                                value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••" required
                                className="rw-input"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-rw-crimson bg-rw-crimson/5 border border-rw-crimson/20 rounded-xl px-4 py-3">{error}</p>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full !h-12 mt-2">
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                </div>

                <p className="mt-8 text-center text-xs text-rw-muted">
                    <a href="/" className="hover:text-rw-crimson transition-colors">← Back to public site</a>
                </p>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "../../shared/ui";

export default function AdminLoginPage() {
    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    function submit() {
        setError(null);
        if (token.trim().length < 6) {
            setError("Enter your admin token.");
            return;
        }
        sessionStorage.setItem("rw_admin_token", token.trim());
        router.push("/admin/orders");
    }

    return (
        <main className={ui.page}>
            <header className={ui.header}>
                <h1 className={ui.h1}>Admin login</h1>
                <p className={ui.lead}>
                    Enter the admin token to manage orders. (This will be replaced by
                    Supabase Auth.)
                </p>
            </header>

            <section className={ui.card}>
                <div className={ui.cardTitle}>Token</div>
                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                    <input
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="RW_ADMIN_TOKEN"
                        style={{
                            height: 44,
                            padding: "0 12px",
                            borderRadius: 14,
                            border: "1px solid rgb(226 232 240)",
                            background: "#fff",
                            fontWeight: 800,
                        }}
                    />
                    {error ? (
                        <div style={{ color: "#b42318", fontWeight: 800 }}>{error}</div>
                    ) : null}
                    <button
                        onClick={submit}
                        style={{
                            height: 44,
                            padding: "0 16px",
                            borderRadius: 14,
                            border: "1px solid transparent",
                            background: "rgb(37 99 235)",
                            color: "#fff",
                            fontWeight: 900,
                            cursor: "pointer",
                        }}
                    >
                        Continue
                    </button>
                </div>
            </section>
        </main>
    );
}

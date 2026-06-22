"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AdminRole } from "@/lib/auth/roles";

interface AdminUser {
    userId: string;
    email: string;
    role: AdminRole;
    name: string | null;
    avatarUrl: string | null;
}

interface AdminAuthContextValue {
    user: AdminUser | null;
    role: AdminRole;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
    user: null,
    role: null,
    loading: true,
    signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/admin/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled) {
                    setUser(data ?? null);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const signOut = useCallback(async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        setUser(null);
        router.push("/admin/login");
    }, [router]);

    return (
        <AdminAuthContext.Provider
            value={{ user, role: user?.role ?? null, loading, signOut }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}

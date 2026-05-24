"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNotification } from "./AdminNotification";
import { MobileAdviceModal } from "./MobileAdviceModal";
import { AdminHeader } from "./common/AdminHeader";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import AdminLoading from "@/app/(admin)/admin/(authenticated)/loading";
import { AppStatusIndicator } from "@/context/AppStatusContext";

// ─── Themed Toaster ──────────────────────────────────────────────────────────
// Sonner toast notifications, styled to match the RW admin design system.
// Position: bottom-right to avoid collision with the status indicator (bottom-left offset).
function RwToaster() {
    return (
        <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
                style: {
                    background: "var(--rw-bg, #fff)",
                    color: "var(--rw-ink, #1C0003)",
                    border: "1px solid var(--rw-border, #e4dcd9)",
                    borderRadius: "0.875rem",
                    fontFamily: "var(--font-body, inherit)",
                    fontSize: "0.8125rem",
                    boxShadow:
                        "0 8px 32px rgba(28,0,3,0.12), 0 2px 8px rgba(28,0,3,0.06)",
                },
                classNames: {
                    error: "!border-red-200 !text-red-700",
                    success: "!border-green-200 !text-green-700",
                    warning: "!border-amber-200 !text-amber-700",
                    info: "!border-blue-200 !text-blue-700",
                    description: "!text-rw-muted",
                    closeButton: "!bg-white !border-[var(--rw-border)]",
                },
            }}
        />
    );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { loading } = useAdminAuth();

    // Close mobile menu on route change
    useEffect(() => {
        (() => {
            setIsMobileMenuOpen(false);
        })();
    }, [pathname]);

    if (loading) {
        return <AdminLoading />;
    }

    return (
        <div className="h-screen flex flex-col bg-rw-bg-alt relative overflow-hidden">
            <AdminNotification />
            <MobileAdviceModal />

            {/* Mobile Header */}
            <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

            <div className="flex flex-1 min-h-0 overflow-hidden relative">
                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar - Fixed on desktop, Drawer on mobile */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 ${
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <AdminSidebar
                        isMobileOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                </div>

                <main className="flex-1 min-w-0 overflow-y-auto">
                    <div className="mx-auto max-w-screen-2xl px-5 lg:px-8 py-8 sm:py-10 stagger-children">
                        {children}
                    </div>
                </main>
            </div>
            <RwToaster />
        </div>
    );
}

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </AdminAuthProvider>
    );
}

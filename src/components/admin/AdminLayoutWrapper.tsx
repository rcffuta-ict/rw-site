"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNotification } from "./AdminNotification";
import { MobileAdviceModal } from "./MobileAdviceModal";
import { AdminHeader } from "./common/AdminHeader";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        (() => setIsMobileMenuOpen(false))();
    }, [pathname]);

    if (isLoginPage) {
        return (
            <div className="h-screen flex flex-col bg-rw-bg-alt relative overflow-hidden">
                <AdminNotification />
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        );
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
        </div>
    );
}

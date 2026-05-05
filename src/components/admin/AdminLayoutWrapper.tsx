"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNotification } from "./AdminNotification";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (isLoginPage) {
        return (
            <div className="h-screen flex flex-col bg-rw-bg-alt relative overflow-hidden">
                <AdminNotification />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-rw-bg-alt relative overflow-hidden">
            <AdminNotification />
            
            {/* Mobile Header */}
            <header className="md:hidden h-14 shrink-0 bg-white border-b border-[var(--rw-border)] px-4 flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rw-crimson">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" /></svg>
                    </span>
                    <span className="text-sm font-bold text-rw-ink">RW&apos;26 Admin</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-rw-bg-alt transition-colors"
                >
                    <svg className="h-6 w-6 text-rw-ink" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
            </header>

            <div className="flex flex-1 min-h-0 overflow-hidden relative">
                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar - Fixed on desktop, Drawer on mobile */}
                <div className={`fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                    <AdminSidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
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

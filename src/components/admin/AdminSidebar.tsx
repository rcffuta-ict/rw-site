"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

import { AdminLogo } from "@/components/admin/AdminLogo";

const NAV = [
    {
        href: "/admin",
        label: "Dashboard",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
        href: "/admin/orders",
        label: "Orders",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
    {
        href: "/admin/products",
        label: "Products",
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
        href: "/admin/finance",
        label: "Finance",
        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
        href: "/admin/verdicts",
        label: "Verdicts",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
        href: "/admin/settings",
        label: "Settings",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
];

export function AdminSidebar({
    isMobileOpen,
    onClose,
    pendingFinanceCount = 0,
}: {
    isMobileOpen?: boolean;
    onClose?: () => void;
    pendingFinanceCount?: number;
}) {
    const pathname = usePathname();
    const { user, role, signOut } = useAdminAuth();

    return (
        <aside
            className={`flex flex-col w-64 shrink-0 border-r border-[var(--rw-border)] bg-white h-full relative z-20 transition-transform duration-300 ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
            <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--rw-border)]">
                <AdminLogo variant="sidebar" role={role} />
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg bg-rw-bg-alt text-rw-muted"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {NAV.map(({ href, label, icon }) => {
                    const active =
                        href === "/admin" ? pathname === href : pathname.startsWith(href);
                    const hasNotification =
                        label === "Finance" && pendingFinanceCount > 0;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                    ? "bg-rw-crimson/8 text-rw-crimson font-semibold"
                                    : "text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <svg
                                    className="h-[18px] w-[18px] shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d={icon}
                                    />
                                </svg>
                                {label}
                            </div>
                            {hasNotification && (
                                <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-rw-crimson text-white text-[10px] font-black leading-none shadow-sm shadow-rw-crimson/20">
                                    {pendingFinanceCount > 99
                                        ? "99+"
                                        : pendingFinanceCount}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* Elegant Sign out option inside core sidebar items */}
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-rw-crimson hover:bg-rw-crimson/5 w-full text-left mt-2 border border-dashed border-rw-crimson/10"
                >
                    <svg
                        className="h-[18px] w-[18px] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        />
                    </svg>
                    Sign out
                </button>
            </nav>

            <div className="border-t border-[var(--rw-border)] px-4 py-4 flex flex-col gap-3">
                {/* Premium User Profile Card */}
                {user && (
                    <div className="flex items-center gap-3 px-1 pb-3 border-b border-[var(--rw-border)]/60">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rw-crimson/10 text-rw-crimson text-sm font-bold border border-rw-crimson/10 select-none">
                            {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 leading-tight">
                            <p
                                className="text-xs font-bold text-rw-ink truncate"
                                title={user.name || "Administrator"}
                            >
                                {user.name || "Administrator"}
                            </p>
                            <p
                                className="text-[10px] text-rw-muted font-medium truncate mt-0.5"
                                title={user.email}
                            >
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}

                <Link
                    href="/"
                    className="flex items-center gap-2 text-xs text-rw-muted hover:text-rw-ink transition-colors px-1 font-medium"
                >
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                    Public site
                </Link>
            </div>
        </aside>
    );
}

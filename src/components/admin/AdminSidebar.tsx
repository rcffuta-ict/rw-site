"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin",          label: "Dashboard",  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/orders",   label: "Orders",     icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { href: "/admin/products", label: "Products",   icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { href: "/admin/finance",  label: "Finance",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/admin/verdicts", label: "Verdicts",   icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { href: "/admin/settings", label: "Settings",   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[var(--rw-border)] bg-rw-bg-alt min-h-screen sticky top-0">
            <div className="flex items-center gap-2 px-4 py-4 border-b border-[var(--rw-border)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rw-crimson">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z" /></svg>
                </span>
                <div className="leading-tight">
                    <p className="text-[13px] font-bold text-rw-ink">RW&apos;26 Admin</p>
                    <p className="text-[10px] text-rw-muted">RCF FUTA</p>
                </div>
            </div>

            <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
                {NAV.map(({ href, label, icon }) => {
                    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                active ? "bg-rw-crimson/10 text-rw-crimson font-semibold" : "text-rw-text-2 hover:text-rw-ink hover:bg-white"
                            }`}
                        >
                            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                            </svg>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-[var(--rw-border)] px-4 py-3">
                <Link href="/" className="text-xs text-rw-muted hover:text-rw-ink transition-colors">← Public site</Link>
            </div>
        </aside>
    );
}

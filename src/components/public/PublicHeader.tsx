"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/public/CartContext";

const NAV = [
    { href: "/",        label: "Home" },
    { href: "/shop",    label: "Merch" },
    { href: "/fulfil",  label: "Pay Order" },
];

export function PublicHeader() {
    const pathname = usePathname();
    const { itemCount, openCart } = useCart();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-rw-bg/95 backdrop-blur-sm border-b border-[var(--rw-border)]">
            <div className="section-container flex h-14 items-center justify-between gap-6">
                {/* Wordmark */}
                <Link href="/" id="site-logo" className="flex items-center gap-2.5 shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rw-crimson">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11zm0 16a4 4 0 0 1-4-4c0-2.5 1.8-4.2 4-7.1C14.2 9.8 16 11.5 16 14a4 4 0 0 1-4 4z" />
                        </svg>
                    </span>
                    <span className="font-display font-bold text-rw-ink text-[15px] leading-tight">
                        Redemption Week <span className="text-rw-crimson">&apos;26</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary">
                    {NAV.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                pathname === l.href
                                    ? "text-rw-crimson font-semibold"
                                    : "text-rw-text-2 hover:text-rw-ink"
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Cart */}
                    <button
                        id="cart-button"
                        onClick={openCart}
                        aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                        className="relative rounded-lg p-2 text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rw-crimson text-[10px] font-bold text-white leading-none">
                                {itemCount > 9 ? "9+" : itemCount}
                            </span>
                        )}
                    </button>

                    <Link
                        href="/shop"
                        id="header-shop-cta"
                        className="hidden sm:inline-flex h-8 items-center rounded-lg bg-rw-crimson px-4 text-[13px] font-semibold text-white hover:bg-rw-crimson-dk transition-colors"
                    >
                        Shop Merch
                    </Link>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden rounded-lg p-2 text-rw-text-2 hover:text-rw-ink transition-colors"
                        onClick={() => setOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        {open
                            ? <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            : <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" /></svg>
                        }
                    </button>
                </div>
            </div>

            {open && (
                <div className="md:hidden border-t border-[var(--rw-border)] bg-rw-bg px-4 py-3 animate-fade-in-down">
                    {NAV.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                                pathname === l.href ? "text-rw-crimson" : "text-rw-text-2 hover:text-rw-ink"
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className="mt-2 block rounded-lg bg-rw-crimson px-4 py-2.5 text-center text-sm font-semibold text-white"
                    >
                        Shop Merch
                    </Link>
                </div>
            )}
        </header>
    );
}

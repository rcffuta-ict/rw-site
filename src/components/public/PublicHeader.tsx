"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/public/CartContext";

const NAV = [
    { href: "/",        label: "Home" },
    { href: "/shop",    label: "Shop" },
    { href: "/fulfil",  label: "Pay Order" },
];

export function PublicHeader() {
    const pathname = usePathname();
    const { itemCount, openCart } = useCart();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--rw-border)]">
            <div className="section-container flex h-16 items-center justify-between gap-4">
                {/* Logo area — multiple logos */}
                <Link href="/" id="site-logo" className="flex items-center gap-3 shrink-0">
                    {/* RCF FUTA logo placeholder */}
                    <img
                        src="https://placehold.co/40x40?text=RCF"
                        alt="RCF FUTA Logo"
                        className="h-9 w-9 rounded-lg object-cover"
                    />
                    {/* 38th Anniversary logo placeholder */}
                    <img
                        src="https://placehold.co/40x40?text=38th"
                        alt="38th Anniversary Logo"
                        className="h-9 w-9 rounded-lg object-cover"
                    />
                    <div className="hidden sm:block leading-tight">
                        <p className="font-display font-bold text-rw-ink text-[15px]">
                            Redemption Week <span className="text-rw-crimson">&apos;26</span>
                        </p>
                        <p className="text-[10px] text-rw-muted font-medium tracking-wide">
                            38th Anniversary · RCF FUTA
                        </p>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
                    {NAV.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                pathname === l.href
                                    ? "text-rw-crimson font-semibold"
                                    : "text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt"
                            }`}
                        >
                            {l.label}
                            {pathname === l.href && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-rw-crimson rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Cart */}
                    <button
                        id="cart-button"
                        onClick={openCart}
                        aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                        className="relative rounded-lg p-2.5 text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rw-crimson text-[10px] font-bold text-white leading-none">
                                {itemCount > 9 ? "9+" : itemCount}
                            </span>
                        )}
                    </button>

                    <Link
                        href="/shop"
                        id="header-shop-cta"
                        className="hidden sm:inline-flex h-9 items-center rounded-lg bg-rw-crimson px-5 text-[13px] font-semibold text-white hover:bg-rw-crimson-dk transition-all hover:shadow-md"
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
                <div className="md:hidden border-t border-[var(--rw-border)] bg-white px-5 py-4 animate-fade-in-down">
                    {NAV.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`block rounded-lg px-3 py-3 text-sm font-medium ${
                                pathname === l.href ? "text-rw-crimson bg-rw-bg-alt" : "text-rw-text-2 hover:text-rw-ink"
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className="mt-3 block rounded-xl bg-rw-crimson px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                        Shop Merch
                    </Link>
                </div>
            )}
        </header>
    );
}

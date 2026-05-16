"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Identity } from "../ui/Identity";
import { useCart } from "@/context/CartContext";

const NAV = [
    { href: "/",       label: "Home" },
    { href: "/shop",   label: "Shop" },
    { href: "/fulfil", label: "Pay Order" },
];

export function PublicHeader() {
    const pathname = usePathname();
    const { itemCount, openCart } = useCart();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Close mobile menu on route change
    useEffect(() => { setOpen(false); }, [pathname]);

    // Add shadow on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8d0d4]
                            transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}>
            <div className="section-container flex h-16 items-center justify-between gap-4">

                {/* Identity / Logo */}
                <Identity />

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
                    {NAV.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                pathname === l.href
                                    ? "text-[#FF0015] font-semibold"
                                    : "text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8]"
                            }`}
                        >
                            {l.label}
                            {pathname === l.href && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5
                                                 bg-[#FF0015] rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Cart button */}
                    <button
                        id="cart-button"
                        onClick={openCart}
                        aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                        className="relative rounded-lg p-2.5 text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8] transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}
                            viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center
                                             rounded-full bg-[#FF0015] text-[10px] font-bold text-white leading-none">
                                {itemCount > 9 ? "9+" : itemCount}
                            </span>
                        )}
                    </button>

                    {/* My Orders — desktop */}
                    <Link
                        href="/orders"
                        id="header-orders-cta"
                        className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border
                                   border-[#e8d0d4] bg-white px-4 text-[13px] font-semibold text-[#1C0003]
                                   hover:border-[#FF0015] hover:text-[#FF0015] transition-all"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}
                            viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                        </svg>
                        My Orders
                    </Link>

                    {/* Hamburger — mobile */}
                    <button
                        className="md:hidden rounded-lg p-2 text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8] transition-colors"
                        onClick={() => setOpen((o) => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        {open ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu — slide-down */}
            {open && (
                <div className="md:hidden border-t border-[#e8d0d4] bg-white px-5 py-4 animate-fade-in-down">
                    <nav className="flex flex-col gap-1">
                        {NAV.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold
                                            transition-colors ${
                                    pathname === l.href
                                        ? "text-[#FF0015] bg-[#fff0f0]"
                                        : "text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8]"
                                }`}
                            >
                                {pathname === l.href && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF0015] shrink-0" />
                                )}
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                    {/* My Orders in mobile */}
                    <Link
                        href="/orders"
                        className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#e8d0d4]
                                   px-4 py-3.5 text-sm font-semibold text-[#1C0003] hover:border-[#FF0015]
                                   hover:text-[#FF0015] transition-all"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                        </svg>
                        My Orders
                    </Link>
                </div>
            )}
        </header>
    );
}

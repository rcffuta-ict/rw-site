"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Identity } from "../ui/Identity";
import { useCart } from "@/context/CartContext";

const NAV = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/fulfil", label: "Pay Order" },
    { href: "/docs", label: "Guide" },
];

export function PublicHeader() {
    const pathname = usePathname();
    const isOrderDetailsPage =
        pathname?.startsWith("/orders/") && pathname?.endsWith("/details");

    const { itemCount, openCart } = useCart();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // True while the header is still floating over the page's hero section.
    const [overHero, setOverHero] = useState(false);

    useEffect(() => {
        (() => {
            setOpen(false);
        })();
    }, [pathname]);

    // useEffect(() => {
    //     // Re-query each time: the hero belongs to an async (streamed) server
    //     // component, so it may not be in the DOM yet when this effect first runs.
    //     const compute = () => {
    //         const hero = document.querySelector<HTMLElement>(".hero-root");
    //         const y = window.scrollY;
    //         setScrolled(y > 8);
    //         // Transparent only while the header overlaps the hero. Switch to the
    //         // solid treatment a little before the hero fully exits for a smooth feel.
    //         console.log("Scrolling", {
    //             hero,
    //         });
    //         if (hero) {
    //             const heroBottom = hero.offsetTop + hero.offsetHeight;
    //             setOverHero(y < heroBottom - 72);
    //         } else {
    //             setOverHero(false);
    //         }
    //     };

    //     compute();
    //     window.addEventListener("scroll", compute, { passive: true });
    //     window.addEventListener("resize", compute);

    //     // The hero can stream into the DOM after this effect runs, so recompute
    //     // whenever the document changes — stop once it's found (scroll/resize
    //     // keep it in sync after that), or after a short grace period.
    //     const mo = new MutationObserver(() => {
    //         compute();
    //         if (document.querySelector(".hero-root")) mo.disconnect();
    //     });
    //     mo.observe(document.body, { childList: true, subtree: true });
    //     const stopWatching = window.setTimeout(() => mo.disconnect(), 4000);

    //     return () => {
    //         window.removeEventListener("scroll", compute);
    //         window.removeEventListener("resize", compute);
    //         mo.disconnect();
    //         window.clearTimeout(stopWatching);
    //     };
    // }, [pathname]);

    // While the mobile menu is open we always show the solid header so the
    // dropdown panel reads cleanly.
    const light = overHero && !open;

    const isActive = (href: string) => {
        if (href.includes("#")) return false; // anchor links never get active state
        return pathname === href;
    };

    const isOrdersActive = pathname?.startsWith("/orders");
    const isCheckoutActive = pathname === "/checkout";
    if (isOrderDetailsPage) return null;

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
                light
                    ? "bg-transparent border-b border-transparent"
                    : `bg-white/95 backdrop-blur-md border-b border-[#e8d0d4] ${scrolled ? "shadow-sm" : ""}`
            }`}
        >
            <div className="section-container flex h-16 items-center justify-between gap-4">
                {/* Identity / Logo */}
                <Identity dark={light} />

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
                    {NAV.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                                isActive(l.href)
                                    ? light
                                        ? "text-white font-semibold bg-white/10"
                                        : "text-[#FF0015] font-semibold bg-[#FF0015]/5"
                                    : light
                                      ? "text-white/80 hover:text-white hover:bg-white/10"
                                      : l.href === "/#support"
                                        ? "text-[#FF0015]/80 hover:text-[#FF0015] hover:bg-[#FF0015]/5"
                                        : "text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8]"
                            }`}
                        >
                            {l.label}
                            {isActive(l.href) && (
                                <span
                                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full ${
                                        light ? "bg-white" : "bg-[#FF0015]"
                                    }`}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Cart button */}
                    <button
                        id="cart-button"
                        // onClick={() => (!isCheckoutActive ? openCart() : null)}
                        onClick={openCart}
                        aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                        className={`relative rounded-lg p-2.5 transition-colors ${
                            isCheckoutActive
                                ? "text-[#FF0015] bg-[#fff0f0]"
                                : light
                                  ? "text-white hover:bg-white/10"
                                  : "text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8]"
                        }`}
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                        {itemCount > 0 && (
                            <span
                                className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center
                                             rounded-full bg-[#FF0015] text-[10px] font-bold text-white leading-none"
                            >
                                {itemCount > 9 ? "9+" : itemCount}
                            </span>
                        )}
                    </button>

                    {/* My Orders — desktop */}
                    <Link
                        href="/orders"
                        id="header-orders-cta"
                        className={`hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border px-4 text-[13px] font-semibold transition-all ${
                            isOrdersActive
                                ? "border-[#FF0015] bg-[#fff0f0] text-[#FF0015]"
                                : light
                                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
                                  : "border-[#e8d0d4] bg-white text-[#1C0003] hover:border-[#FF0015] hover:text-[#FF0015]"
                        }`}
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                            />
                        </svg>
                        My Orders
                    </Link>

                    {/* Hamburger — mobile */}
                    <button
                        className={`lg:hidden rounded-lg p-2 transition-colors ${
                            light
                                ? "text-white hover:bg-white/10"
                                : "text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8]"
                        }`}
                        onClick={() => setOpen((o) => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        {open ? (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="lg:hidden border-t border-[#e8d0d4] bg-white/98 backdrop-blur-sm px-5 py-4 animate-fade-in-down">
                    <nav className="flex flex-col gap-1">
                        {NAV.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold
                                            transition-colors ${
                                                isActive(l.href)
                                                    ? "text-[#FF0015] bg-[#fff0f0]"
                                                    : l.href === "/#support"
                                                      ? "text-[#FF0015]/80 hover:bg-[#fff0f0]"
                                                      : "text-[#5c4048] hover:text-[#1C0003] hover:bg-[#fdf8f8]"
                                            }`}
                            >
                                {isActive(l.href) && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF0015] shrink-0" />
                                )}
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    {/* My Orders in mobile */}
                    <Link
                        href="/orders"
                        className={`mt-3 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            isOrdersActive
                                ? "border-[#FF0015] bg-[#fff0f0] text-[#FF0015]"
                                : "border-[#e8d0d4] text-[#1C0003] hover:border-[#FF0015] hover:text-[#FF0015]"
                        }`}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                            />
                        </svg>
                        My Orders
                    </Link>
                </div>
            )}
        </header>
    );
}

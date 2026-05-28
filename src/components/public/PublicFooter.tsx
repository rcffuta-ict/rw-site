"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOGOS } from "@/lib/config";
import { Identity } from "../ui/Identity";
import { BrandDisplay } from "../common/BrandDisplay";

const PROGRAMME = [
    { day: "Mon", label: "Opening Ceremony" },
    { day: "Tue", label: "Word Night" },
    { day: "Wed", label: "Power Night" },
    { day: "Thu", label: "Drama Night — Acts '26" },
    { day: "Fri", label: "Choir Concert" },
    { day: "Sat", label: "RIFE & Alumni Reunion" },
    { day: "Sun", label: "Handing Over Ceremony" },
];

const QUICK_LINKS = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop Merch" },
    { href: "/#support", label: "Support Us" },
    { href: "/fulfil", label: "Pay an Order" },
    { href: "/orders", label: "My Orders" },
    // { href: "/admin", label: "Admin Dashboard" },
];

const SOCIAL_LINKS = [
    {
        label: "Instagram",
        href: "https://www.instagram.com/rcffuta",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4.5 w-4.5 h-[18px] w-[18px]"
            >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/rcffuta",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
        ),
    },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@rcffuta",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
    {
        label: "Telegram",
        href: "https://t.me/rcffuta",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.88 7.99-3.43 3.8-1.56 4.59-1.83 5.1-.11.11.27.18.59.18.91z" />
            </svg>
        ),
    },
];

const FELLOWSHIP_FACTS = [
    { label: "Founded", value: "1983" },
    { label: "Alumni", value: "9,000+" },
    { label: "Members", value: "900+" },
    { label: "Units", value: "16" },
];

export function PublicFooter() {
    const pathname = usePathname();
    const isOrderDetailsPage =
        pathname?.startsWith("/orders/") && pathname?.endsWith("/details");

    return (
        <footer className="bg-rw-bg-warm border-t border-[#e8d0d4] text-[#1C0003] print:hidden">
            {/* ── Top brand band ─────────────────────────────────────────────── */}
            <div className="border-b border-[#e8d0d4]">
                <div className="section-container !pt-6 lg:pt-16 !pb-10 !lg:pb-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 text-center lg:text-left">
                    <Identity className="justify-center lg:justify-start" />
                    <BrandDisplay />
                </div>
            </div>

            {/* ── Main columns ─────────────────────────────────────────────── */}
            {!isOrderDetailsPage && (
                <div className="section-container !pt-20 lg:!pt-28 !pb-16">
                    <div className="grid gap-12 lg:gap-16 xl:gap-20 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                        {/* Col 1 — About */}
                        <div className="text-center sm:text-left">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a8085] mb-6">
                                About
                            </p>
                            <p className="text-sm text-[#5c4048] leading-relaxed max-w-[38ch] mx-auto sm:mx-0">
                                The Redeemed Christian Fellowship, Federal University of
                                Technology, Akure (RCFFUTA) is one of the leading
                                fellowships in the FUTA environs, standing strong in
                                faith, values, and purpose since 1983.
                            </p>
                            <p className="mt-5 text-sm text-[#9a8085] italic">
                                &ldquo;A place where good things never cease.&rdquo;
                            </p>

                            {/* Stats */}
                            <div className="mt-10 grid grid-cols-2 gap-3">
                                {FELLOWSHIP_FACTS.map((f) => (
                                    <div
                                        key={f.label}
                                        className="border border-[#e8d0d4] rounded-xl p-4 bg-[#fdf8f8] hover:border-[#FF0015]/25 transition-colors"
                                    >
                                        <p className="font-display font-bold text-2xl text-[#FF0015]">
                                            {f.value}
                                        </p>
                                        <p className="text-[11px] text-[#9a8085] font-medium mt-1">
                                            {f.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Social */}
                            <div className="mt-10 flex items-center justify-center sm:justify-start gap-3">
                                {SOCIAL_LINKS.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        aria-label={s.label}
                                        className="h-10 w-10 rounded-xl border border-[#e8d0d4] bg-white flex items-center justify-center text-[#9a8085] hover:text-[#FF0015] hover:border-[#FF0015]/30 hover:bg-[#FF0015]/5 transition-all duration-200"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Col 2 — Programme */}
                        <div className="text-center sm:text-left">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a8085] mb-6">
                                Programme
                            </p>
                            <ul className="flex flex-col gap-0.5 max-w-[280px] mx-auto sm:mx-0">
                                {PROGRAMME.map((n, i) => (
                                    <li
                                        key={n.day}
                                        className="flex items-start gap-4 py-3 border-b border-[#f4eced] last:border-0"
                                    >
                                        <div className="flex flex-col items-center gap-0.5 shrink-0 w-8 mt-0.5">
                                            <span className="font-display font-bold text-[11px] text-[#FF0015]">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-[9px] text-[#9a8085] font-bold uppercase tracking-wider">
                                                {n.day}
                                            </span>
                                        </div>
                                        <span className="text-sm text-[#5c4048] leading-tight">
                                            {n.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3 — Navigate */}
                        <div className="text-center sm:text-left">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a8085] mb-6">
                                Navigate
                            </p>
                            <ul className="flex flex-col gap-4">
                                {QUICK_LINKS.map((l) => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className="group flex items-center justify-center sm:justify-start gap-3 text-sm text-[#5c4048] hover:text-[#FF0015] transition-colors duration-200"
                                        >
                                            <span className="h-px w-3 bg-[#FF0015]/30 group-hover:w-5 group-hover:bg-[#FF0015] transition-all duration-300" />
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 4 — Sponsorship */}
                        <div className="text-center sm:text-left">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a8085] mb-6">
                                Sponsorship
                            </p>
                            <p className="text-sm text-[#5c4048] leading-relaxed mb-8">
                                Partner with 38 years of impact. Reach 900+ students and
                                alumni across a full week of events.
                            </p>

                            <div className="flex flex-col gap-2 mb-8">
                                {[
                                    { tier: "Diamond", amount: "₦1,000,000" },
                                    { tier: "Gold", amount: "₦750,000" },
                                    { tier: "Silver", amount: "₦500,000" },
                                    { tier: "Bronze", amount: "₦250,000" },
                                ].map((s) => (
                                    <div
                                        key={s.tier}
                                        className="flex items-center justify-between py-2 border-b border-[#f4eced] text-xs"
                                    >
                                        <span className="text-[#9a8085] font-medium">
                                            {s.tier}
                                        </span>
                                        <span className="text-[#1C0003] font-bold tabular-nums">
                                            {s.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/#support"
                                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold bg-[#FF0015] text-white hover:bg-[#cc0011] transition-all shadow-[0_4px_12px_rgba(255,0,21,0.25)]"
                            >
                                Support Us →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bottom bar ─────────────────────────────────────────────────── */}
            <div className="border-t border-[#e8d0d4]">
                <div className="section-container !py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <span className="text-xs text-[#9a8085]">
                        © 2026 Redeemed Christian Fellowship, FUTA Chapter · All rights
                        reserved
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-[#9a8085]">
                            Powered by the RCF FUTA ICT Unit
                        </span>
                        <span className="h-3 w-px bg-[#e8d0d4]" />
                        <a
                            href="https://rcffuta.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#9a8085] hover:text-[#FF0015] transition-colors"
                        >
                            rcffuta.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

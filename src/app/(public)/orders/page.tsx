import type { Metadata } from "next";
import { OrdersClient } from "./OrdersClient";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";
import { FELLOWSHIP, TENURE } from "@/lib/config";
import { HeaderBanner } from "@/components/common/HeaderBanner";
import { SiteImage } from "@/components/ui/SiteImage";

export const metadata: Metadata = {
    title: `My Orders — ${TENURE.brandLabel}`,
    description: `Look up your ${TENURE.eventName} merchandise orders by reference number, phone number, or email address.`,
};

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="bg-rw-ink relative overflow-hidden py-10">
                {/* Subtle texture grid */}
                <SiteImage
                    src="shop_banner_usufiq"
                    alt="Light Touch pattern with deep crimson and black tones, evoking a sense of mystery and elegance."
                    fill
                    priority
                    sizes="100vw"
                    placeholderLabel={
                        "Light Touch pattern with deep crimson and black tones, evoking a sense of mystery and elegance."
                    }
                    className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
                    colors={{
                        bg: "1C0003",
                        fg: "FF6A00",
                    }}
                />
                {/* Crimson glow */}
                {/* <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-rw-crimson/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-rw-crimson/10 blur-3xl pointer-events-none" /> */}

                <div className="absolute inset-0 bg-gradient-to-r from-[#1C0003] via-[#1C0003]/50 to-transparent md:block hidden" />
                <div className="absolute inset-0 bg-[#1C0003]/70 md:hidden block" />

                <div className="section-container relative py-16 md:py-24">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 p-6 relative z-10 max-w-6xl">
                        <div className="max-w-xl">
                            <p className="text-[10px] font-black text-rw-crimson uppercase tracking-[0.35em] mb-4">
                                {TENURE.brandLabel} &mdash; {TENURE.anniversaryLabel}
                            </p>
                            <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-none tracking-tight mb-5">
                                Track
                                <br />
                                <span className="text-rw-crimson">Your Order</span>
                            </h1>
                            <p className="text-white/50 text-base leading-relaxed max-w-md">
                                Look up any order by reference number, email address, or
                                phone number. Official communications arrive exclusively
                                from{" "}
                                <span className="text-white/80 font-semibold">
                                    info@rw.rcffuta.com
                                </span>
                                .
                            </p>
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-3 flex-wrap shrink-0">
                            <Link href="/shop">
                                <Button
                                    variant="outlined"
                                    size="md"
                                    className="border-white/20 text-white hover:border-white/50 hover:bg-white/5 text-xs font-black uppercase tracking-widest"
                                >
                                    ← Back to Shop
                                </Button>
                            </Link>
                            <Link href="/docs">
                                <Button
                                    variant="outlined"
                                    size="md"
                                    className="border-white/20 text-white hover:border-white/50 hover:bg-white/5 text-xs font-black uppercase tracking-widest"
                                >
                                    Order Guide
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* ── Stat strip ─────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-12 bg-white/10 rounded-2xl overflow-hidden border border-white/10">
                        {[
                            {
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                ),
                                label: "Official Email",
                                value: "info@rw.rcffuta.com",
                                sub: "All order updates sent here only",
                            },
                            {
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                    />
                                ),
                                label: "Collection Point",
                                value: TENURE.venue,
                                sub: TENURE.dateRange,
                            },
                            {
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                    />
                                ),
                                label: "Refund Policy",
                                value: "No refunds issued",
                                sub: (
                                    <Link
                                        href="/terms"
                                        className="text-rw-crimson hover:underline font-bold"
                                    >
                                        Read Terms of Service →
                                    </Link>
                                ),
                            },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="bg-rw-ink/60 backdrop-blur-sm px-6 py-5 flex gap-4 items-start"
                            >
                                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg
                                        className="h-3.5 w-3.5 text-white/40"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        {card.icon}
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] mb-1">
                                        {card.label}
                                    </p>
                                    <p className="text-sm font-bold text-white/90 leading-snug break-words">
                                        {card.value}
                                    </p>
                                    <p className="text-[11px] text-white/40 font-medium mt-0.5">
                                        {card.sub}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info strip — 3 cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-14">
                    {[
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                />
                            ),
                            label: "Official Email",
                            value: "info@rw.rcffuta.com",
                            sub: "All order updates sent here",
                        },
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                />
                            ),
                            label: "Pickup Location",
                            value: TENURE.venue,
                            sub: TENURE.dateRange,
                        },
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                            ),
                            label: "No Refunds",
                            value: "All sales are final",
                            sub: "See Terms of Service",
                        },
                    ].map((card) => (
                        <div
                            key={card.label}
                            className="rw-card p-5 flex gap-4 items-start"
                        >
                            <div className="h-9 w-9 rounded-xl bg-rw-bg-alt border border-[var(--rw-border-mid)] flex items-center justify-center shrink-0 mt-0.5">
                                <svg
                                    className="h-4 w-4 text-rw-ink/50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    {card.icon}
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-rw-muted uppercase tracking-widest mb-1">
                                    {card.label}
                                </p>
                                <p className="text-sm font-bold text-rw-ink leading-snug break-words">
                                    {card.value}
                                </p>
                                <p className="text-[11px] text-rw-muted font-medium mt-0.5">
                                    {card.sub}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Orders Client ─────────────────────────────────────────────── */}
                <OrdersClient />

                {/* ── Footer strip ─────────────────────────────────────────────── */}
                <div className="section-container pb-20">
                    <div className="pt-10 border-t border-dashed border-[var(--rw-border-mid)]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-black text-rw-muted uppercase tracking-widest">
                                    {FELLOWSHIP.fullName}
                                </p>
                                <p className="text-sm text-rw-text-2">
                                    Questions?{" "}
                                    <Link
                                        href="/docs"
                                        className="text-rw-crimson font-bold hover:underline"
                                    >
                                        Read the full guide
                                    </Link>{" "}
                                    or review our{" "}
                                    <Link
                                        href="/terms"
                                        className="text-rw-crimson font-bold hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="text-rw-crimson font-bold hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0 flex-wrap">
                                <Link href="/terms">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs font-black uppercase tracking-widest"
                                    >
                                        Terms
                                    </Button>
                                </Link>
                                <Link href="/privacy">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs font-black uppercase tracking-widest"
                                    >
                                        Privacy
                                    </Button>
                                </Link>
                                <Link href="/docs">
                                    <Button variant="outlined" size="sm">
                                        Order Guide
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

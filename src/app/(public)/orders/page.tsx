import type { Metadata } from "next";
import { OrdersClient } from "./OrdersClient";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";
import { FELLOWSHIP, TENURE } from "@/lib/config";

export const metadata: Metadata = {
    title: `My Orders — ${TENURE.brandLabel}`,
    description: `Look up your ${TENURE.eventName} merchandise orders by reference number, phone number, or email address.`,
};

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="section-container py-16 md:py-24">
                {/* Page header */}
                <div className="max-w-2xl mb-14">
                    <p className="eyebrow mb-3">{TENURE.brandLabel}</p>

                    <div className="flex items-center gap-4 mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div>
                            <h1 className="font-display font-black text-5xl md:text-6xl text-rw-ink mb-4 leading-none tracking-tight">
                                Track Your
                                <br />
                                <span className="text-gradient-crimson">Order</span>
                            </h1>
                            <div className="crimson-line mt-4 mb-6" />
                            <p className="text-lg text-rw-text-2 leading-relaxed">
                                Look up any order using your reference number, email
                                address, or phone number. All order communications are
                                sent from{" "}
                                <span className="font-bold text-rw-ink">
                                    info@rw.rcffuta.com
                                </span>
                                .
                            </p>
                        </div>

                        <Link
                            href="/shop"
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF0015] px-5 text-sm
                                       font-semibold text-white hover:bg-[#cc0011] transition-all
                                       hover:shadow-[0_4px_16px_rgba(255,0,21,0.3)] self-start sm:self-auto"
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
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                                />
                            </svg>
                            Shop Merch
                        </Link>
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

                {/* Main lookup */}
                <OrdersClient />

                {/* Bottom legal + guide strip */}
                <div className="mt-16 pt-10 border-t border-dashed border-[var(--rw-border-mid)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-black text-rw-muted uppercase tracking-widest">
                                {FELLOWSHIP.fullName}
                            </p>
                            <p className="text-sm text-rw-text-2">
                                Questions about your order?{" "}
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
    );
}

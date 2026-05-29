import { getProducts } from "@/lib/services/products.service";
import { ShopClient } from "./ShopClient";
import { FELLOWSHIP, TENURE } from "@/lib/config";
import { HeaderBanner } from "@/components/common/HeaderBanner";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";

export const metadata: Metadata = {
    title: `Shop — ${TENURE.brandLabel} Official Merch`,
    description: `Pre-order official ${TENURE.brandLabelShort} anniversary merchandise. T-shirts, hoodies, caps, and more. Ready for pickup during ${TENURE.eventName}.`,
};

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-white">
            <HeaderBanner
                bannerDescription="Official Merch Banner Background"
                title={`${TENURE.brandLabelShort} Merch Sales`}
                description={`Pre-order your official ${TENURE.brandLabelShort} anniversary merch. Merchandise is collected exclusively at ${TENURE.venue}.`}
                header="Official Merchandise"
            />

            <div className="bg-gradient-to-b from-slate-50/60 to-white my-16">
                <div className="section-container py-12 lg:py-16">
                    <ShopClient products={products} />
                </div>
            </div>

            {/* Legal & Guide strip */}
            <div className="section-container mb-10">
                <div className="rw-card overflow-hidden">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--rw-border)]">
                        {/* Left — How it works CTA */}
                        <div className="p-8 md:p-10 flex flex-col gap-4 bg-gradient-to-br from-rw-crimson/8 to-rw-crimson/3">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-rw-crimson/10 border border-rw-crimson/20 flex items-center justify-center shrink-0">
                                    <svg
                                        className="h-4 w-4 text-rw-crimson"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xs font-black text-rw-crimson uppercase tracking-widest">
                                    How It Works
                                </p>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-rw-ink leading-tight">
                                New to pre-ordering?
                            </h3>
                            <p className="text-sm text-rw-text-2 leading-relaxed">
                                From browsing to pickup at {TENURE.venue} — our complete
                                guide walks you through every step of the process.
                            </p>
                            <div className="mt-2">
                                <Link href="/docs">
                                    <Button variant="outlined" size="sm">
                                        View Complete Guide →
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right — Legal notice */}
                        <div className="p-8 md:p-10 flex flex-col gap-4 bg-rw-bg-warm/30">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-rw-ink/5 border border-[var(--rw-border-mid)] flex items-center justify-center shrink-0">
                                    <svg
                                        className="h-4 w-4 text-rw-ink/60"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xs font-black text-rw-muted uppercase tracking-widest">
                                    Purchase Policy
                                </p>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-rw-ink leading-tight">
                                Before you order
                            </h3>
                            <p className="text-sm text-rw-text-2 leading-relaxed">
                                All sales are final — no refunds are offered. Merch is
                                collected in-person only at {TENURE.venue} during{" "}
                                {TENURE.eventName} ({TENURE.dateRange}). By placing an
                                order you accept our Terms of Service.
                            </p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <Link
                                    href="/terms"
                                    className="text-xs font-black text-rw-ink hover:text-rw-crimson transition-colors uppercase tracking-widest underline underline-offset-4"
                                >
                                    Terms of Service
                                </Link>
                                <span className="text-rw-border-mid text-xs">·</span>
                                <Link
                                    href="/privacy"
                                    className="text-xs font-black text-rw-ink hover:text-rw-crimson transition-colors uppercase tracking-widest underline underline-offset-4"
                                >
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 py-3 bg-rw-ink/3 border-t border-[var(--rw-border)] flex items-center justify-between gap-4 flex-wrap">
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">
                            {FELLOWSHIP.fullName} &mdash; {TENURE.brandLabel}
                        </p>
                        <p className="text-[10px] font-bold text-rw-muted uppercase tracking-widest">
                            Delivery: {TENURE.venue} &mdash; Check your email for updates
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="section-container mb-24">
                <div className="rw-card p-8 md:p-12 bg-gradient-to-r from-rw-crimson/10 to-rw-crimson/5 border-l-4 border-l-rw-crimson">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold text-rw-crimson uppercase tracking-widest mb-2">
                                Next Step
                            </p>
                            <h3 className="font-display font-bold text-3xl text-rw-ink mb-2">
                                Ready to Checkout?
                            </h3>
                            <p className="text-rw-text-2 max-w-lg text-sm">
                                Once you&rsquo;ve added items to your cart, proceed to
                                checkout. You&rsquo;ll need a valid email address &mdash;
                                all order updates are sent from{" "}
                                <span className="font-bold text-rw-ink">
                                    info@rw.rcffuta.com
                                </span>
                                .
                            </p>
                        </div>
                        <div className="flex gap-3 flex-wrap md:flex-nowrap shrink-0">
                            <Link href="/docs">
                                <Button variant="outlined" size="lg">
                                    View Guide
                                </Button>
                            </Link>
                            <Link href="/checkout">
                                <Button variant="primary" size="lg">
                                    Checkout Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

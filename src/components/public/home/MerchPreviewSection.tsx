"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductDrawer } from "@/components/public/ProductDrawer";
import { TENURE } from "@/lib/config";
import type { Product } from "@/lib/data/types";
import { ShimmerCard, ShopProductCard } from "../ShopProductCard";

function MerchComingSoon() {
    return (
        <div className="relative">
            {/* Ghost cards grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 select-none pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ opacity: 1 - i * 0.18 }}>
                        <ShimmerCard />
                    </div>
                ))}
            </div>

            {/* Frosted overlay with centred badge + text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-white/40 via-white/75 to-white/95 backdrop-blur-[2px] rounded-2xl">
                {/* Glow ring + badge */}
                <div className="relative flex items-center justify-center">
                    {/* Pulse rings */}
                    <span
                        className="absolute h-20 w-20 rounded-full bg-rw-crimson/10 animate-ping"
                        style={{ animationDuration: "2s" }}
                    />
                    <span
                        className="absolute h-14 w-14 rounded-full bg-rw-crimson/15 animate-ping"
                        style={{ animationDuration: "2.4s", animationDelay: "0.4s" }}
                    />
                    {/* Icon circle */}
                    <div className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-br from-[#1C0003] to-[#3d0008] flex items-center justify-center shadow-[0_8px_32px_rgba(196,18,48,0.35)]">
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Label pill */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase border border-rw-crimson/25 bg-rw-crimson/8 text-rw-crimson">
                    <span className="h-1.5 w-1.5 rounded-full bg-rw-crimson animate-pulse" />
                    Collection Dropping Soon
                </span>

                {/* Headline */}
                <div className="text-center px-6">
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-rw-ink leading-tight">
                        Official Merch on the Way
                    </h3>
                    <p className="mt-2 text-rw-muted text-sm sm:text-base leading-relaxed max-w-[38ch] mx-auto">
                        We&apos;re finalizing our exclusive Redemption Week&nbsp;&apos;26
                        collection. Be the first to know when it drops.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── MerchPreviewSection ──────────────────────────────────────────────────────

export function MerchPreviewSection({ products }: { products: Product[] }) {
    const [selected, setSelected] = useState<Product | null>(null);

    // Show first 4 products on home page
    const preview = products.slice(0, 4);

    return (
        <section className="section-py-sm bg-white">
            <div className="section-container">
                {/* Header */}
                <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                    <div>
                        <p className="eyebrow mb-4">Official Merchandise</p>
                        <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">
                            Pre-order now
                        </h2>
                        <p className="mt-3 text-rw-text-2 text-lg max-w-[44ch]">
                            Ready for pickup during the Handing Over ceremony. Secure
                            yours before quantities run out.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="btn-secondary shrink-0 !h-11 !px-6 text-sm self-start sm:self-auto"
                    >
                        View all items →
                    </Link>
                </div>

                {/* Product grid — using same ProductCard as shop page */}
                {preview.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {preview.map((p) => (
                            <ShopProductCard
                                key={p.id}
                                product={p}
                                onOpen={() => setSelected(p)}
                            />
                        ))}
                    </div>
                ) : (
                    <MerchComingSoon />
                )}

                {/* Bottom CTA strip */}
                <div className="mt-12 rounded-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1C0003] to-[#3d0008]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0015]/10 to-[#FF6A00]/15" />
                    <div className="relative px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                        <div>
                            <p className="font-display font-bold text-white text-xl">
                                {TENURE.eventName} {TENURE.shortYear} Official Merch
                            </p>
                            <p className="text-white/50 text-sm mt-1">
                                Limited quantities — secure yours before it runs out.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="shrink-0 inline-flex items-center gap-2 h-11 px-7 rounded-xl font-bold
                                       text-sm bg-[#FF0015] text-white hover:bg-[#cc0011] transition-all
                                       shadow-[0_4px_16px_rgba(255,0,21,0.4)] hover:shadow-[0_6px_24px_rgba(255,0,21,0.5)]"
                        >
                            Shop Now →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selected && (
                <ProductDrawer product={selected} onClose={() => setSelected(null)} />
            )}
        </section>
    );
}

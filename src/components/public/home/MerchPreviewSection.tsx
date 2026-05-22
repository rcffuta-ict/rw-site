"use client";

import Link from "next/link";
import { useState } from "react";
import { COLOR_HEX } from "@/lib/data/products";
import { ProductDrawer } from "@/components/public/ProductDrawer";
import { useCart } from "@/context/CartContext";
import { productImageUrl } from "@/lib/utils/functions";
import { TENURE } from "@/lib/config";
import type { Product } from "@/lib/data/types";

// ─── Inline ProductCard — same as ShopClient.ProductCard ─────────────────────

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
    const colors = [
        ...new Set(product.variants.filter((v) => v.color).map((v) => v.color!)),
    ];
    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const displayColor = hoveredColor ?? colors[0] ?? null;

    return (
        <article className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1.5 transition-all duration-300">
            {/* Image */}
            <div
                className="relative overflow-hidden bg-rw-bg-alt"
                style={{ aspectRatio: "3/4" }}
            >
                <img
                    src={productImageUrl(product.name, displayColor, 360, 480)}
                    alt={`${product.name}${displayColor ? ` — ${displayColor}` : ""}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick view overlay */}
                <button
                    onClick={onOpen}
                    id={`merch-preview-${product.id}`}
                    aria-label={`Quick view ${product.name}`}
                    className="absolute inset-0 flex items-end justify-center pb-5 bg-black/0 group-hover:bg-black/25 transition-all"
                >
                    <span className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 bg-white rounded-xl px-6 py-2.5 text-sm font-bold text-rw-ink shadow-lg">
                        Quick View
                    </span>
                </button>

                {/* Colour swatches */}
                {colors.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1.5">
                        {colors.slice(0, 4).map((c) => (
                            <button
                                key={c}
                                title={c}
                                onMouseEnter={() => setHoveredColor(c)}
                                onMouseLeave={() => setHoveredColor(null)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setHoveredColor(c);
                                }}
                                className={`h-5 w-5 rounded-full border-2 shadow-sm transition-all ${hoveredColor === c ? "border-white scale-125" : "border-white/60"}`}
                                style={{ background: COLOR_HEX[c] ?? "#888" }}
                            />
                        ))}
                    </div>
                )}

                {/* Category pill */}
                <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-[#1C0003] px-2.5 py-1 rounded-full">
                    {product.categoryLabel}
                </span>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex-1">
                    <h3 className="font-display font-bold text-rw-ink group-hover:text-rw-crimson transition-colors text-[15px] leading-snug">
                        {product.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-rw-muted line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--rw-border)]">
                    <span className="font-bold text-rw-crimson text-lg">
                        ₦{product.basePrice.toLocaleString()}
                    </span>
                    <button
                        onClick={onOpen}
                        className="rounded-xl bg-rw-ink text-white px-4 py-2 text-xs font-bold hover:bg-rw-crimson transition-colors"
                    >
                        Select Options
                    </button>
                </div>
            </div>
        </article>
    );
}

// ─── Coming-Soon State (Home) ─────────────────────────────────────────────────

function ShimmerCard() {
    return (
        <div className="rw-card overflow-hidden flex flex-col" style={{ aspectRatio: "auto" }}>
            {/* Image placeholder */}
            <div
                className="relative bg-gradient-to-br from-[#f5f0ef] to-[#ede5e3] overflow-hidden"
                style={{ aspectRatio: "3/4" }}
            >
                {/* Shimmer sweep */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                {/* Ghost icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#1C0003]/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                    </svg>
                </div>
            </div>
            {/* Info placeholder */}
            <div className="p-5 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded-full bg-[#1C0003]/8 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.2s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-3 w-1/2 rounded-full bg-[#1C0003]/5 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.4s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="pt-3 border-t border-[var(--rw-border)] flex items-center justify-between">
                    <div className="h-5 w-16 rounded-full bg-rw-crimson/15 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.6s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    <div className="h-8 w-24 rounded-xl bg-[#1C0003]/8 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite_0.3s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                    <span className="absolute h-20 w-20 rounded-full bg-rw-crimson/10 animate-ping" style={{ animationDuration: "2s" }} />
                    <span className="absolute h-14 w-14 rounded-full bg-rw-crimson/15 animate-ping" style={{ animationDuration: "2.4s", animationDelay: "0.4s" }} />
                    {/* Icon circle */}
                    <div className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-br from-[#1C0003] to-[#3d0008] flex items-center justify-center shadow-[0_8px_32px_rgba(196,18,48,0.35)]">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        We&apos;re finalizing our exclusive Redemption Week&nbsp;&apos;26 collection.
                        Be the first to know when it drops.
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
                            <ProductCard
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

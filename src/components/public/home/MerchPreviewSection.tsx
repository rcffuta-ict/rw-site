"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_PRODUCTS, COLOR_HEX } from "@/lib/data/products";
import { ProductDrawer } from "@/components/public/ProductDrawer";
import { useCart } from "@/context/CartContext";
import { CartSidebar } from "@/components/public/CartSidebar";
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
            <div className="relative overflow-hidden bg-rw-bg-alt" style={{ aspectRatio: "3/4" }}>
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
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHoveredColor(c); }}
                                className={`h-5 w-5 rounded-full border-2 shadow-sm transition-all ${hoveredColor === c ? "border-white scale-125" : "border-white/60"}`}
                                style={{ background: COLOR_HEX[c] ?? "#888" }}
                            />
                        ))}
                    </div>
                )}

                {/* Category pill */}
                <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-[#1C0003] px-2.5 py-1 rounded-full">
                    {product.category}
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

// ─── MerchPreviewSection ──────────────────────────────────────────────────────

export function MerchPreviewSection() {
    const [selected, setSelected] = useState<Product | null>(null);
    const { isOpen, closeCart } = useCart();

    // Show first 4 products on home page
    const preview = DEMO_PRODUCTS.slice(0, 4);

    return (
        <section className="section-py bg-white">
            <div className="section-container">
                {/* Header */}
                <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                    <div>
                        <p className="eyebrow mb-4">Official Merchandise</p>
                        <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl">
                            Pre-order now
                        </h2>
                        <p className="mt-3 text-rw-text-2 text-lg max-w-[44ch]">
                            Ready for pickup during the Handing Over ceremony.
                            Secure yours before quantities run out.
                        </p>
                    </div>
                    <Link href="/shop" className="btn-secondary shrink-0 !h-11 !px-6 text-sm self-start sm:self-auto">
                        View all items →
                    </Link>
                </div>

                {/* Product grid — using same ProductCard as shop page */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {preview.map((p) => (
                        <ProductCard key={p.id} product={p} onOpen={() => setSelected(p)} />
                    ))}
                </div>

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
            {selected && <ProductDrawer product={selected} onClose={() => setSelected(null)} />}
            {isOpen && <CartSidebar onClose={closeCart} />}
        </section>
    );
}

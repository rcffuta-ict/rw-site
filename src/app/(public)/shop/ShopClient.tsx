"use client";

import { useState } from "react";
import type { Product } from "@/lib/data/types";
import { COLOR_HEX } from "@/lib/data/products";
import { ProductDrawer } from "@/components/public/ProductDrawer";
import { useCart } from "@/context/CartContext";
import { productImageUrl } from "@/lib/utils/functions";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Category = "all" | "tshirt" | "hoodie" | "accessory";

const CATEGORY_LABELS: Record<Category, string> = {
    all: "All Items",
    tshirt: "T-Shirts",
    hoodie: "Hoodies",
    accessory: "Accessories",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
    const colors = [
        ...new Set(product.variants.filter((v) => v.color).map((v) => v.color!)),
    ];
    const sizes = [
        ...new Set(
            product.variants
                .filter((v) => v.size && v.size !== "One Size")
                .map((v) => v.size!)
        ),
    ];

    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const displayColor = hoveredColor ?? colors[0] ?? null;

    // Find the image for the current display colour
    const activeVariant =
        product.variants.find((v) => v.color === displayColor) || product.variants[0];
    const primaryImage =
        activeVariant?.images?.find((img) => img.isPrimary)?.cloudinaryUrl ||
        activeVariant?.images?.[0]?.cloudinaryUrl;
    const finalImageUrl =
        primaryImage || productImageUrl(product.name, displayColor, 360, 480);

    return (
        <article className="rw-card group flex flex-col overflow-hidden hover:-translate-y-1.5">
            {/* Image */}
            <div
                className="relative overflow-hidden bg-rw-bg-alt"
                style={{ aspectRatio: "3/4" }}
            >
                <img
                    src={finalImageUrl}
                    alt={`${product.name}${displayColor ? ` — ${displayColor}` : ""}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick view overlay */}
                <button
                    onClick={onOpen}
                    id={`product-view-${product.id}`}
                    aria-label={`Quick view ${product.name}`}
                    className="absolute inset-0 flex items-end justify-center pb-5 bg-black/0 group-hover:bg-black/25 transition-all"
                >
                    <span className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 bg-white rounded-xl px-6 py-2.5 text-sm font-bold text-rw-ink shadow-lg">
                        Quick View
                    </span>
                </button>

                {/* Colour swatches (hover to preview) */}
                {colors.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1.5">
                        {colors.slice(0, 5).map((c) => (
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
                        {colors.length > 5 && (
                            <span className="text-[10px] text-white font-bold bg-black/30 rounded-full px-1.5 flex items-center">
                                +{colors.length - 5}
                            </span>
                        )}
                    </div>
                )}
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

                {sizes.length > 0 && (
                    <p className="text-[11px] text-rw-muted font-medium">
                        Sizes: {sizes.join(" · ")}
                    </p>
                )}

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

// ─── ShopClient ───────────────────────────────────────────────────────────────

export function ShopClient({ products }: { products: Product[] }) {
    const [category, setCategory] = useState<Category>("all");
    const [selected, setSelected] = useState<Product | null>(null);

    const filtered =
        category === "all"
            ? products
            : products.filter((p) => p.categorySlug === category);

    if (products.length === 0) {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0003] via-[#2a0005] to-[#3d0008] py-32 px-6 flex flex-col items-center text-center">
                {/* Ambient glow blobs */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rw-crimson/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#FF6A00]/8 blur-3xl" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-rw-crimson/5 blur-2xl" />

                {/* Pulse rings + icon */}
                <div className="relative mb-8 flex items-center justify-center">
                    <span
                        className="absolute h-32 w-32 rounded-full border border-white/5 animate-ping"
                        style={{ animationDuration: "3s" }}
                    />
                    <span
                        className="absolute h-24 w-24 rounded-full border border-rw-crimson/15 animate-ping"
                        style={{ animationDuration: "2.4s", animationDelay: "0.5s" }}
                    />
                    <span
                        className="absolute h-16 w-16 rounded-full bg-rw-crimson/10 animate-ping"
                        style={{ animationDuration: "2s", animationDelay: "0.2s" }}
                    />
                    <div className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#FF0015] to-[#FF6A00] flex items-center justify-center shadow-[0_0_48px_rgba(255,0,21,0.45)]">
                        <svg
                            className="w-9 h-9 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Status badge */}
                <div className="mb-5 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                    <span className="text-xs font-bold tracking-[0.18em] uppercase text-white/60">
                        We&#39;re coming
                    </span>
                </div>

                {/* Headline */}
                <h2
                    className="font-display font-extrabold text-white leading-tight tracking-tight mb-4"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                >
                    Merch Dropping
                    <span className="block bg-gradient-to-r from-[#FF0015] to-[#FF6A00] bg-clip-text text-transparent">
                        Very Soon
                    </span>
                </h2>

                {/* Body */}
                <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-[44ch] mb-8">
                    Our exclusive Redemption Week&nbsp;&apos;26 collection is currently
                    being finalized. Limited quantities — be ready to secure yours the
                    moment we go live.
                </p>

                {/* Shimmer bar — decorative */}
                <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-[#FF0015] to-transparent animate-[shimmer-slide_2.5s_ease-in-out_infinite]" />
                </div>
            </div>
        );
    }

    return (
        <div className="mb-20">
            {/* Category tabs */}
            <div
                className="flex flex-wrap gap-2 mb-10"
                role="tablist"
                aria-label="Product categories"
            >
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                    <button
                        key={c}
                        role="tab"
                        aria-selected={category === c}
                        onClick={() => setCategory(c)}
                        id={`category-tab-${c}`}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                            category === c
                                ? "bg-rw-ink text-white shadow-sm"
                                : "border border-[var(--rw-border)] text-rw-text-2 hover:border-rw-ink/30 hover:text-rw-ink"
                        }`}
                    >
                        {CATEGORY_LABELS[c]}
                    </button>
                ))}
            </div>

            {/* Product grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onOpen={() => setSelected(p)} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-24 text-center text-rw-muted">
                    <p className="text-lg">No items in this category yet.</p>
                </div>
            )}

            {selected && (
                <ProductDrawer product={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}
